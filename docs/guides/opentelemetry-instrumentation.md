# opentelemetry-instrumentation.md

# OpenTelemetry Instrumentation Patterns for Next.js Applications

## Overview

Effective observability in Next.js applications, especially with the App Router, requires a strategic approach to OpenTelemetry (OTel) instrumentation. This document outlines the authoritative patterns for tracing, metrics, and logging in Next.js 15/16 environments.

## Core Instrumentation Pattern: `instrumentation.ts`

The recommended way to initialize OpenTelemetry is through the `instrumentation.ts` file located in the root (or `src/`) directory. This file is executed once during server startup.

### Basic Initialization with `@vercel/otel`

For applications deploying to Vercel or similar environments, `@vercel/otel` provides a high-level wrapper that configures standard instrumentations for Node.js and Edge runtimes.

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-next-app');
}
```

## Automatic Instrumentation Capabilities

When properly initialized, Next.js provides automatic tracing for:

- **Server Actions**: Tracing the execution of server-side functions called from the client.
- **Server Components**: Performance monitoring of data fetching and rendering.
- **Middleware**: Observability into routing, headers, and rewrite logic.
- **Metadata Generation**: Tracing `generateMetadata` execution.
- **Data Fetching**: Automatic instrumentation of the global `fetch` API.

## Custom Instrumentation Patterns

### 1. Manual Span Creation

Use the OpenTelemetry API to track specific business logic that isn't captured automatically.

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('my-service');

export async function processOrder(orderId: string) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    try {
      span.setAttribute('order.id', orderId);
      // ... business logic
      return result;
    } finally {
      span.end();
    }
  });
}
```

### 2. Context Propagation

Ensuring trace IDs are propagated across asynchronous boundaries and external service calls is critical for distributed tracing. Next.js App Router contextually manages these IDs across Server Components and API routes.

## Best Practices for 2026

1. **Leverage App Router Internals**: Avoid legacy `_instrumentation.js` patterns; use the standard `instrumentation.ts` hook.
2. **Runtime Separation**: Ensure that Node.js-specific SDKs are conditionally imported or handled if your application uses the Edge runtime.
3. **Sampling Strategy**: Implement trace sampling at the collector level to control costs and performance overhead while maintaining high-quality observability.
4. **Structured Logging Integration**: Correlation of logs with Trace IDs (e.g., using `trace_id` in log attributes) to allow for seamless navigation between traces and logs.

## References

- [Next.js Observability Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/observability)
- [OpenTelemetry JS API Reference](https://opentelemetry.io/docs/languages/js/api/)
- [Vercel OpenTelemetry Guide](https://vercel.com/docs/concepts/observability/opentelemetry)
- [OpenTelemetry Semantic Conventions for HTTP](https://opentelemetry.io/docs/specs/semconv/http/)
