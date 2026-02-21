# Infrastructure-1: Observability & OpenTelemetry Integration

## Metadata

- **Task ID**: infrastructure-1-observability-opentelemetry
- **Owner**: AGENT
- **Priority / Severity**: P1 (High Infrastructure)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Observability, distributed tracing, THEGOAL infrastructure
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-1-server-action-hardening
- **Downstream Tasks**: None

## Context

Current observability setup:

- Sentry integration exists for error tracking
- Logging present but not standardized
- No distributed tracing across serverless functions and multi-tenant boundaries
- No tenant-aware correlation IDs

This addresses **Research Topic #20: Observability & Distributed Tracing Strategy** from perplexity research.

## Dependencies

- **Upstream Task**: `security-1-server-action-hardening` — audit logs can use OpenTelemetry spans
- **Required Packages**: `@vercel/otel`, `@repo/infra`, Sentry (with OpenTelemetry integration)

## Cross-Task Dependencies & Sequencing

- **Upstream**: `security-1-server-action-hardening` (audit logs use OpenTelemetry)
- **Parallel Work**: Can work alongside other infrastructure tasks
- **Downstream**: Supports all security and infrastructure tasks (tracing, metrics)

## Research

- **Primary topics**: [R-OBSERVABILITY](RESEARCH-INVENTORY.md#r-observability) (new)
- **[2026-02] Research Topic #20**: Observability requirements:
  - Use OpenTelemetry for tracing/metrics/logs; Next.js supports instrumentation hooks
  - Tenant-aware correlation IDs and logs
  - Sentry as error tracker, not primary tracer (skipOpenTelemetrySetup: true)
- **References**:
  - [docs/research/perplexity-performance-2026.md](../docs/research/perplexity-performance-2026.md) (Topic #20)
  - [docs/research/RESEARCH-GAPS.md](../docs/research/RESEARCH-GAPS.md)
  - Next.js OpenTelemetry documentation

## Related Files

- `instrumentation.ts` – create – OpenTelemetry instrumentation entry point
- `packages/infra/src/observability/otel.ts` – create – OpenTelemetry configuration
- `packages/infra/src/observability/logger.ts` – modify – Tenant-aware structured logging
- `packages/infra/src/observability/tracing.ts` – create – Tracing utilities
- `docs/architecture/observability.md` – create – Document observability strategy

## Acceptance Criteria

- [ ] `instrumentation.ts` created at root:
  - Uses `@vercel/otel` for Next.js integration
  - Configures service name, attributes
  - Exports `register()` function
- [ ] OpenTelemetry configured:
  - OTLP endpoint configured via env vars
  - Tenant-aware spans (include `tenantId`, `userId`, `correlationId`)
  - Instrumentation for booking flows, webhooks, external API adapters
- [ ] Sentry integration:
  - Configured with `skipOpenTelemetrySetup: true`
  - Uses OpenTelemetry context manager
  - Sentry sampler configured to avoid clashing tracers
- [ ] Structured logging:
  - Tenant-aware logs with `tenantId`, `userId`, `correlationId`
  - Integration with OpenTelemetry spans
- [ ] Documentation created: `docs/architecture/observability.md`
- [ ] Instrumentation tests verify traces are emitted
- [ ] Dashboards/alerts configured (latency, error rate per tenant)

## Technical Constraints

- Must work with Next.js App Router
- Must integrate with existing Sentry setup
- OTLP endpoint configurable via env vars
- Must support multi-tenant context propagation

## Implementation Plan

### Phase 1: Core Instrumentation

- [ ] Create `instrumentation.ts` at root:

  ```typescript
  import { registerOTel } from '@vercel/otel';

  export function register() {
    registerOTel({
      serviceName: 'marketing-platform',
      attributes: {
        'deployment.environment': process.env.NODE_ENV,
      },
    });
  }
  ```

- [ ] Configure `next.config.js`:
  - Enable `experimental.instrumentationHook: true`

### Phase 2: OpenTelemetry Configuration

- [ ] Create `packages/infra/src/observability/otel.ts`:
  - OTLP exporter configuration
  - Resource attributes (service name, version, environment)
  - Span processor configuration

### Phase 3: Sentry Integration

- [ ] Update Sentry configuration:
  - Set `skipOpenTelemetrySetup: true`
  - Configure OpenTelemetry context manager
  - Configure sampler to avoid conflicts

### Phase 4: Tenant-Aware Instrumentation

- [ ] Create `packages/infra/src/observability/tracing.ts`:
  - Utilities for creating tenant-aware spans
  - Correlation ID propagation
- [ ] Update `packages/infra/src/observability/logger.ts`:
  - Structured logging with tenant context
  - Integration with OpenTelemetry spans

### Phase 5: Instrument Key Flows

- [ ] Instrument booking actions:
  - `confirmBooking`, `cancelBooking` spans
  - Include `tenantId`, `userId`, `bookingId`
- [ ] Instrument webhook handlers:
  - Webhook processing spans
  - Include `eventId`, `provider`, `tenantId`
- [ ] Instrument external API adapters:
  - API call spans with retry/circuit breaker context

### Phase 6: Testing & Documentation

- [ ] Instrumentation tests:
  - Verify traces are emitted
  - Verify tenant context in spans
- [ ] Create `docs/architecture/observability.md`
- [ ] Configure dashboards/alerts (if observability backend available)

## Sample code / examples

### Instrumentation Entry Point

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'marketing-platform',
    attributes: {
      'deployment.environment': process.env.NODE_ENV || 'development',
      'deployment.version': process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    },
  });
}
```

### Next.js Config

```typescript
// next.config.js
export default {
  // ... other config
  experimental: {
    instrumentationHook: true,
  },
};
```

### Tenant-Aware Tracing

```typescript
// packages/infra/src/observability/tracing.ts
import { trace, context } from '@opentelemetry/api';

export function withTenantSpan<T>(
  name: string,
  tenantId: string,
  userId: string,
  correlationId: string,
  fn: () => Promise<T>
): Promise<T> {
  const tracer = trace.getTracer('marketing-platform');

  return tracer.startActiveSpan(
    name,
    {
      attributes: {
        'tenant.id': tenantId,
        'user.id': userId,
        'correlation.id': correlationId,
      },
    },
    async (span) => {
      try {
        const result = await fn();
        span.setStatus({ code: 1 }); // OK
        return result;
      } catch (error) {
        span.setStatus({ code: 2, message: String(error) }); // ERROR
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    }
  );
}
```

### Structured Logging

```typescript
// packages/infra/src/observability/logger.ts
import { trace } from '@opentelemetry/api';

export function logWithContext(
  level: 'info' | 'warn' | 'error',
  message: string,
  metadata: {
    tenantId?: string;
    userId?: string;
    correlationId?: string;
    [key: string]: unknown;
  }
) {
  const span = trace.getActiveSpan();
  const spanContext = span?.spanContext();

  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...metadata,
    ...(spanContext && {
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
    }),
  };

  // Log to console (or structured log backend)
  console.log(JSON.stringify(logEntry));

  // Add to span attributes
  span?.setAttributes({
    [`log.${level}`]: message,
    ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [`log.${k}`, String(v)])),
  });
}
```

### Booking Action Instrumentation

```typescript
// packages/features/src/booking/lib/booking-actions.ts
import { withTenantSpan } from '@repo/infra/observability/tracing';

export async function confirmBooking(input: unknown) {
  // ... validation and auth ...

  return withTenantSpan(
    'booking.confirm',
    ctx.tenantId,
    ctx.userId,
    ctx.correlationId,
    async () => {
      // ... booking logic ...
    }
  );
}
```

## Testing Requirements

- **Instrumentation Tests:**
  - Verify `instrumentation.ts` is called
  - Verify traces are emitted (if OTLP endpoint configured)
  - Verify tenant context in spans
- **Integration Tests:**
  - Booking flow creates spans with tenant context
  - Webhook processing creates spans
- **Manual Tests:**
  - Verify traces in observability backend (if configured)
  - Verify Sentry errors include trace context

## Execution notes

- **Related files — current state:**
  - Sentry configuration exists
  - Logging present but not standardized
  - No OpenTelemetry instrumentation
- **Potential issues / considerations:**
  - OTLP endpoint configuration (local vs production)
  - Sentry integration (avoid tracer conflicts)
  - Performance impact of tracing (sampling)
- **Verification:**
  - Instrumentation hook enabled
  - Traces emitted (verify in observability backend)
  - Sentry errors include trace context

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Instrumentation tests pass
- [ ] `instrumentation.ts` created and configured
- [ ] OpenTelemetry configured with tenant-aware spans
- [ ] Sentry integrated (skipOpenTelemetrySetup: true)
- [ ] Key flows instrumented (booking, webhooks, APIs)
- [ ] Documentation created (`docs/architecture/observability.md`)
- [ ] Traces verified in observability backend (if configured)
