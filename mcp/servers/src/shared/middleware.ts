/**
 * @file mcp/servers/src/shared/middleware.ts
 * @summary Shared middleware helpers for MCP tool handlers.
 * @description Provides correlation-ID tracking, structured logging, in-memory
 *   rate limiting (sliding window), and tenant-ID validation for MCP servers.
 *   Rate limiting and tenant validation are optional opt-in hardening wrappers.
 * @security No secrets logged. Correlation IDs are random UUIDs only.
 *   Rate limiter keys are never logged. Tenant validation rejects empty/non-UUID values.
 * @requirements 3-B: Add Correlation IDs Across All MCP Servers
 *               5-A: MCP Server Hardening (rate limiting + tenant boundary enforcement)
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

// ─── Rate Limiting (5-A: MCP Server Hardening) ────────────────────────────────

/** Configuration for a sliding-window rate limiter. */
export interface RateLimitConfig {
  /** Maximum number of calls allowed in the window. */
  maxCalls: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

/** Internal per-key state for the sliding-window rate limiter. */
interface RateLimitBucket {
  timestamps: number[];
}

/**
 * In-memory sliding-window rate limiter factory.
 *
 * Returns a `checkLimit(key)` function that tracks call timestamps per key
 * and returns `true` when the call is allowed, or `false` when the rate limit
 * is exceeded. Expired timestamps are pruned on every call to prevent unbounded
 * memory growth.
 *
 * @param config - `{ maxCalls, windowMs }` — e.g. `{ maxCalls: 100, windowMs: 60_000 }`.
 * @returns A `checkLimit` function and a `resetKey` utility for testing.
 *
 * @example
 * ```ts
 * const limiter = createRateLimiter({ maxCalls: 60, windowMs: 60_000 });
 * if (!limiter.checkLimit(tenantId)) {
 *   return { content: [{ type: 'text', text: 'Rate limit exceeded.' }], isError: true };
 * }
 * ```
 */
export function createRateLimiter(config: RateLimitConfig): {
  checkLimit: (key: string) => boolean;
  resetKey: (key: string) => void;
} {
  const buckets = new Map<string, RateLimitBucket>();

  function checkLimit(key: string): boolean {
    const now = Date.now();
    const cutoff = now - config.windowMs;

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { timestamps: [] };
      buckets.set(key, bucket);
    }

    // Prune expired timestamps (sliding window)
    bucket.timestamps = bucket.timestamps.filter((ts) => ts > cutoff);

    if (bucket.timestamps.length >= config.maxCalls) {
      return false;
    }

    bucket.timestamps.push(now);
    return true;
  }

  function resetKey(key: string): void {
    buckets.delete(key);
  }

  return { checkLimit, resetKey };
}

// ─── Tenant Validation (5-A: MCP Server Hardening) ────────────────────────────

/** UUID v4 pattern used to validate tenant IDs. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validate that a tenant ID is a well-formed UUID v4.
 *
 * Throws an `Error` with a descriptive message if the value is missing or
 * malformed. Call this at the top of any tool handler that scopes data to a
 * tenant to enforce the multi-tenant isolation boundary.
 *
 * @param tenantId - Candidate tenant ID from tool params.
 * @throws `Error` if `tenantId` is not a valid UUID v4.
 *
 * @example
 * ```ts
 * async ({ tenantId, ...rest }) => {
 *   assertTenantId(tenantId);
 *   // safe to use tenantId here
 * }
 * ```
 */
export function assertTenantId(tenantId: unknown): asserts tenantId is string {
  if (typeof tenantId !== 'string' || !UUID_RE.test(tenantId)) {
    throw new Error(
      `Invalid tenantId: expected a UUID v4, got type ${typeof tenantId}`
    );
  }
}

/**
 * Build a standard rate-limit-exceeded tool response.
 *
 * Returns a generic error message that does not disclose the specific limit
 * or time window to avoid assisting attackers in optimizing abuse.
 *
 * @param correlationId - Correlation ID to include in the response.
 * @returns A tool response indicating rate limit exceeded.
 */
export function rateLimitExceededResponse(correlationId: string): ToolResponse {
  return {
    content: [{ type: 'text', text: 'Rate limit exceeded. Please try again later.' }],
    isError: true,
    _correlationId: correlationId,
  };
}
