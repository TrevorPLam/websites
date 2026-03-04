/**
 * @file mcp/servers/src/shared/middleware.ts
 * @summary Shared correlation-ID middleware for MCP tool handlers.
 * @description Wraps any MCP tool handler to ensure every call carries a unique
 *   correlation ID, emits structured start/end log entries, and returns the ID
 *   in the response so callers can chain requests across servers.
 * @security No secrets logged. Correlation IDs are random UUIDs only.
 * @requirements 3-B: Add Correlation IDs Across All MCP Servers
 */

import crypto from 'crypto';

/** Generic MCP tool-handler input (params bag from SDK). */
export type ToolParams = Record<string, unknown>;

/** Minimal shape the SDK expects back from a tool handler. */
export interface ToolResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
  /** Correlation ID echoed back so callers can chain requests. */
  _correlationId?: string;
}

/** A tool handler matching the @modelcontextprotocol/sdk signature. */
export type ToolHandler<P extends ToolParams = ToolParams> = (
  params: P
) => Promise<ToolResponse>;

/**
 * Wrap a tool handler with correlation-ID tracking.
 *
 * If the caller supplies `params._correlationId` it is reused (for chaining).
 * Otherwise a new `crypto.randomUUID()` is generated.
 *
 * Emits `tool_call_start` and `tool_call_end` structured log lines to stderr
 * so they are visible in MCP server logs without polluting stdout (which is
 * reserved for the JSON-RPC transport).
 *
 * @param toolName - Human-readable tool identifier used in log entries.
 * @param handler  - The original async tool handler to wrap.
 * @returns A wrapped handler with the same signature.
 *
 * @example
 * ```ts
 * server.tool('deploy', 'Deploy application', schema,
 *   withCorrelation('deploy', async (params) => { ... })
 * );
 * ```
 */
export function withCorrelation<P extends ToolParams>(
  toolName: string,
  handler: ToolHandler<P>
): ToolHandler<P> {
  return async (params: P): Promise<ToolResponse> => {
    const correlationId: string =
      typeof params._correlationId === 'string' && params._correlationId.length > 0
        ? params._correlationId
        : crypto.randomUUID();

    const startMs = Date.now();

    process.stderr.write(
      JSON.stringify({
        event: 'tool_call_start',
        tool: toolName,
        correlationId,
        timestamp: new Date().toISOString(),
      }) + '\n'
    );

    try {
      const result = await handler(params);

      const durationMs = Date.now() - startMs;

      process.stderr.write(
        JSON.stringify({
          event: 'tool_call_end',
          tool: toolName,
          correlationId,
          durationMs,
          isError: result.isError ?? false,
          timestamp: new Date().toISOString(),
        }) + '\n'
      );

      return { ...result, _correlationId: correlationId };
    } catch (err: unknown) {
      const durationMs = Date.now() - startMs;
      const message = err instanceof Error ? err.message : String(err);

      process.stderr.write(
        JSON.stringify({
          event: 'tool_call_end',
          tool: toolName,
          correlationId,
          durationMs,
          isError: true,
          error: message,
          timestamp: new Date().toISOString(),
        }) + '\n'
      );

      return {
        content: [{ type: 'text', text: `Error: ${message}` }],
        isError: true,
        _correlationId: correlationId,
      };
    }
  };
}

/**
 * Emit a structured `tool_call_start` or `tool_call_end` log line to stderr
 * (MCP log channel — keeps stdout clean for JSON-RPC transport).
 *
 * @param event         - `'tool_call_start'` or `'tool_call_end'`.
 * @param tool          - Human-readable tool name.
 * @param correlationId - UUID that ties start/end log lines together.
 * @param extra         - Optional additional fields (durationMs, isError, error).
 */
export function logMcpTool(
  event: 'tool_call_start' | 'tool_call_end',
  tool: string,
  correlationId: string,
  extra?: Record<string, unknown>
): void {
  process.stderr.write(
    JSON.stringify({ event, tool, correlationId, timestamp: new Date().toISOString(), ...extra }) + '\n'
  );
}

/**
 * Extract an existing correlation ID from raw tool params, or generate a new UUID.
 *
 * Reads `params['_correlationId']`; falls back to `crypto.randomUUID()`.
 *
 * @param params - Raw params object from a McpServer tool handler.
 * @returns A non-empty correlation ID string.
 */
export function resolveCorrelationId(params: Record<string, unknown>): string {
  return typeof params['_correlationId'] === 'string' && params['_correlationId'].length > 0
    ? params['_correlationId']
    : crypto.randomUUID();
}
