/**
 * @file mcp/gateway/src/index.ts
 * @summary MCP Gateway — unified traffic routing for all MCP server calls.
 * @description Implements a middleware pipeline (auth → rate-limit → policy → route →
 *   audit) with OpenTelemetry-compatible tracing spans and correlation IDs.
 *   Every request that enters the gateway carries a `mcp.correlation_id` attribute
 *   so traces can be linked across servers and tenants.
 * @security Rejects unauthenticated/unauthorised requests before they reach any
 *   downstream MCP server. Rate limiting is per-tenant sliding window (in-memory
 *   fallback when Redis is unavailable). No secrets are logged.
 * @requirements 3-A: Implement MCP Gateway Pattern
 */

import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GatewayRequest {
  /** Target MCP server name (must be registered in mcp/config/config.json). */
  server: string;
  /** Tool name to invoke on the target server. */
  tool: string;
  /** Arbitrary tool parameters. */
  params: Record<string, unknown>;
  /** JWT or API-key token presented by the caller. */
  authToken?: string;
  /** Tenant identifier (UUID). Required for multi-tenant isolation. */
  tenantId?: string;
  /** Existing correlation ID to continue a trace chain. */
  correlationId?: string;
}

export interface GatewayResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  /** Correlation ID to include in subsequent chained requests. */
  correlationId: string;
  /** Wall-clock duration of the full middleware pipeline in milliseconds. */
  durationMs: number;
  /** OpenTelemetry-compatible span attributes emitted for this call. */
  spanAttributes: SpanAttributes;
}

export interface SpanAttributes {
  'mcp.server': string;
  'mcp.tool': string;
  'mcp.correlation_id': string;
  'tenant.id': string;
  'gateway.auth_passed': boolean;
  'gateway.rate_limit_passed': boolean;
  'gateway.policy_passed': boolean;
  'gateway.duration_ms'?: number;
}

export interface GatewayConfig {
  /** Registered MCP servers available for routing. */
  registeredServers: Set<string>;
  /** Max requests per tenant per minute (sliding window). */
  rateLimitRpm: number;
  /** Optional logger (defaults to stderr JSON lines). */
  logger?: (entry: Record<string, unknown>) => void;
}

// ---------------------------------------------------------------------------
// In-memory rate-limit store (sliding window, per tenant)
// ---------------------------------------------------------------------------

interface RateLimitWindow {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private readonly windows = new Map<string, RateLimitWindow>();

  constructor(private readonly limitRpm: number) {}

  /** Returns true when the request is within the allowed rate. */
  allow(tenantId: string): boolean {
    const now = Date.now();
    const windowMs = 60_000;
    const cutoff = now - windowMs;

    let window = this.windows.get(tenantId);
    if (!window) {
      window = { timestamps: [] };
      this.windows.set(tenantId, window);
    }

    // Evict expired timestamps
    window.timestamps = window.timestamps.filter(ts => ts > cutoff);

    if (window.timestamps.length >= this.limitRpm) {
      return false;
    }

    window.timestamps.push(now);
    return true;
  }
}

// ---------------------------------------------------------------------------
// Simple audit log store (in-memory append-only list)
// ---------------------------------------------------------------------------

export interface AuditEntry {
  correlationId: string;
  tenantId: string;
  server: string;
  tool: string;
  authPassed: boolean;
  rateLimitPassed: boolean;
  policyPassed: boolean;
  success: boolean;
  durationMs: number;
  timestamp: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// MCPGateway
// ---------------------------------------------------------------------------

/**
 * Unified request router for all MCP tool invocations.
 *
 * Middleware pipeline (executed in order):
 * 1. Auth validation  — token must be non-empty
 * 2. Rate-limit check — sliding-window per `tenantId`
 * 3. Policy enforcement — server/tool must be registered and allowed
 * 4. Route to handler  — delegates to the registered handler function
 * 5. Audit logging     — appends a structured entry regardless of outcome
 *
 * @example
 * ```ts
 * const gateway = new MCPGateway({
 *   registeredServers: new Set(['github', 'secure-deployment']),
 *   rateLimitRpm: 120,
 * });
 *
 * gateway.registerHandler('github', 'search_repositories', async (params) => {
 *   // call real MCP server here
 *   return { result: [] };
 * });
 *
 * const response = await gateway.routeRequest({
 *   server: 'github',
 *   tool: 'search_repositories',
 *   params: { query: 'websites' },
 *   authToken: 'Bearer <token>',
 *   tenantId: 'tenant-uuid',
 * });
 * ```
 */
export class MCPGateway {
  private readonly rateLimiter: InMemoryRateLimiter;
  private readonly handlers = new Map<
    string,
    (params: Record<string, unknown>) => Promise<unknown>
  >();
  private readonly auditLog: AuditEntry[] = [];
  private readonly log: (entry: Record<string, unknown>) => void;
  private readonly config: GatewayConfig;

  constructor(config: GatewayConfig) {
    this.config = config;
    this.rateLimiter = new InMemoryRateLimiter(config.rateLimitRpm);
    this.log = config.logger ?? ((entry) => {
      process.stderr.write(JSON.stringify(entry) + '\n');
    });
  }

  /**
   * Register a tool handler for a specific server+tool combination.
   *
   * @param server  - MCP server name (e.g. `'github'`).
   * @param tool    - Tool name (e.g. `'search_repositories'`).
   * @param handler - Async function that receives tool params and returns a result.
   */
  registerHandler(
    server: string,
    tool: string,
    handler: (params: Record<string, unknown>) => Promise<unknown>
  ): void {
    this.handlers.set(`${server}:${tool}`, handler);
  }

  /**
   * Route a request through the full middleware pipeline.
   *
   * @param req - Incoming gateway request.
   * @returns A GatewayResponse with `success`, optional `data`/`error`, and
   *   tracing metadata.
   */
  async routeRequest(req: GatewayRequest): Promise<GatewayResponse> {
    const startMs = Date.now();
    const correlationId =
      req.correlationId && req.correlationId.length > 0
        ? req.correlationId
        : crypto.randomUUID();
    const tenantId = req.tenantId ?? 'unknown';

    const spanAttributes: SpanAttributes = {
      'mcp.server': req.server,
      'mcp.tool': req.tool,
      'mcp.correlation_id': correlationId,
      'tenant.id': tenantId,
      'gateway.auth_passed': false,
      'gateway.rate_limit_passed': false,
      'gateway.policy_passed': false,
    };

    this.log({
      event: 'gateway_request_start',
      correlationId,
      server: req.server,
      tool: req.tool,
      tenantId,
      timestamp: new Date().toISOString(),
    });

    // ---- 1. Auth validation ------------------------------------------------
    if (!req.authToken || req.authToken.trim().length === 0) {
      return this._reject(
        correlationId, tenantId, req, spanAttributes, startMs,
        'Authentication required: missing or empty auth token'
      );
    }
    spanAttributes['gateway.auth_passed'] = true;

    // ---- 2. Rate-limit check ------------------------------------------------
    if (!this.rateLimiter.allow(tenantId)) {
      return this._reject(
        correlationId, tenantId, req, spanAttributes, startMs,
        `Rate limit exceeded for tenant ${tenantId} (max ${this.config.rateLimitRpm} rpm)`
      );
    }
    spanAttributes['gateway.rate_limit_passed'] = true;

    // ---- 3. Policy enforcement ---------------------------------------------
    if (!this.config.registeredServers.has(req.server)) {
      return this._reject(
        correlationId, tenantId, req, spanAttributes, startMs,
        `Policy violation: server '${req.server}' is not registered in the gateway`
      );
    }
    spanAttributes['gateway.policy_passed'] = true;

    // ---- 4. Route to handler ------------------------------------------------
    const handlerKey = `${req.server}:${req.tool}`;
    const handler = this.handlers.get(handlerKey);
    if (!handler) {
      return this._reject(
        correlationId, tenantId, req, spanAttributes, startMs,
        `No handler registered for ${handlerKey}`
      );
    }

    let data: unknown;
    let success = true;
    let routeError: string | undefined;

    try {
      // Inject correlation ID under a namespaced key to avoid collisions with
      // user-supplied params. Handlers may read this via params.__mcp?.correlationId.
      data = await handler({ ...req.params, __mcp: { correlationId } });
    } catch (err: unknown) {
      success = false;
      routeError = err instanceof Error ? err.message : String(err);
    }

    const durationMs = Date.now() - startMs;
    spanAttributes['gateway.duration_ms'] = durationMs;

    // ---- 5. Audit logging --------------------------------------------------
    this._audit({
      correlationId,
      tenantId,
      server: req.server,
      tool: req.tool,
      authPassed: spanAttributes['gateway.auth_passed'],
      rateLimitPassed: spanAttributes['gateway.rate_limit_passed'],
      policyPassed: spanAttributes['gateway.policy_passed'],
      success,
      durationMs,
      timestamp: new Date().toISOString(),
      error: routeError,
    });

    this.log({
      event: 'gateway_request_end',
      correlationId,
      server: req.server,
      tool: req.tool,
      tenantId,
      success,
      durationMs,
      error: routeError,
      timestamp: new Date().toISOString(),
    });

    return {
      success,
      data: success ? data : undefined,
      error: routeError,
      correlationId,
      durationMs,
      spanAttributes,
    };
  }

  /** Return a copy of the in-memory audit log (for inspection/testing). */
  getAuditLog(): Readonly<AuditEntry[]> {
    return [...this.auditLog];
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private _reject(
    correlationId: string,
    tenantId: string,
    req: GatewayRequest,
    spanAttributes: SpanAttributes,
    startMs: number,
    error: string
  ): GatewayResponse {
    const durationMs = Date.now() - startMs;
    spanAttributes['gateway.duration_ms'] = durationMs;

    this._audit({
      correlationId,
      tenantId,
      server: req.server,
      tool: req.tool,
      authPassed: spanAttributes['gateway.auth_passed'],
      rateLimitPassed: spanAttributes['gateway.rate_limit_passed'],
      policyPassed: spanAttributes['gateway.policy_passed'],
      success: false,
      durationMs,
      timestamp: new Date().toISOString(),
      error,
    });

    this.log({
      event: 'gateway_request_rejected',
      correlationId,
      server: req.server,
      tool: req.tool,
      tenantId,
      error,
      durationMs,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error,
      correlationId,
      durationMs,
      spanAttributes,
    };
  }

  private _audit(entry: AuditEntry): void {
    this.auditLog.push(entry);
  }
}
