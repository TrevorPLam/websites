# vercel-otel-documentation.md

Vercel provides built-in support for OpenTelemetry instrumentation through the `@vercel/otel` package, which simplifies observability integration for Next.js applications and Vercel Functions. This package offers a zero-config approach that works out of the box on Vercel's platform while remaining compatible with self-hosted deployments.

## Overview

The `@vercel/otel` package dramatically simplifies OpenTelemetry integration by providing:

- **Zero-config setup**: Automatic instrumentation with minimal configuration
- **Vercel platform optimization**: Optimized for Vercel's serverless environment
- **Self-hosted compatibility**: Works with any Node.js deployment
- **Automatic context propagation**: Built-in trace context management
- **Multiple exporter support**: Compatible with various observability backends

## Installation

```bash
npm install @vercel/otel
```

## Basic Setup

### Automatic Instrumentation

Create an `instrumentation.ts` file in your project root:

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('your-service-name');
}
```

### Custom Configuration

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('your-service-name', {
    serviceName: 'my-nextjs-app',
    serviceVersion: '1.0.0',
    traceExporter: {
      url: 'https://your-collector.com/v1/traces',
      headers: {
        Authorization: 'Bearer your-token',
      },
    },
  });
}
```

## Configuration Options

### Basic Configuration

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('service-name', {
    // Service identification
    serviceName: 'my-app',
    serviceVersion: '1.0.0',

    // Exporter configuration
    traceExporter: {
      url: 'https://your-collector.com/v1/traces',
      headers: {
        Authorization: 'Bearer your-token',
      },
    },

    // Sampling configuration
    sampler: 'always_on', // or 'always_off', 'traceidratio', 'parentbased_always_on'
    samplerArg: 0.1, // for traceidratio sampler

    // Resource attributes
    attributes: {
      'deployment.environment': 'production',
      'service.namespace': 'frontend',
    },
  });
}
```

### Advanced Configuration

```typescript
import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function register() {
  registerOTel('my-app', {
    // Custom exporter
    traceExporter: new OTLPTraceExporter({
      url: 'https://your-collector.com/v1/traces',
      headers: {
        Authorization: 'Bearer your-token',
      },
      timeoutMillis: 30000,
    }),

    // Resource configuration
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'my-app',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production',
    }),

    // Custom sampler
    sampler: {
      type: 'traceidratio',
      argument: 0.1,
    },

    // Additional attributes
    attributes: {
      'vercel.region': process.env.VERCEL_REGION,
      'vercel.environment': process.env.VERCEL_ENV,
    },
  });
}
```

## Context Propagation

### Automatic Context Propagation

`@vercel/otel` automatically handles context propagation for:

- **Incoming requests**: HTTP headers are automatically extracted
- **Outgoing requests**: Context is automatically injected
- **Server-to-server communication**: Trace context flows through Vercel's infrastructure

### Manual Context Management

```typescript
import { trace, context } from '@opentelemetry/api';

// Get current span
const currentSpan = trace.getActiveSpan();

// Set span in context
const ctx = trace.setSpan(context.active(), currentSpan);

// Use context for operations
context.with(ctx, () => {
  // Your code here
});
```

## Integration with Popular Services

### Datadog

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-app', {
    traceExporter: {
      url: 'https://trace.agent.datadoghq.com',
      headers: {
        'DD-API-KEY': process.env.DATADOG_API_KEY,
      },
    },
    attributes: {
      service: 'my-app',
      env: process.env.NODE_ENV,
    },
  });
}
```

### Honeycomb

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-app', {
    traceExporter: {
      url: 'https://api.honeycomb.io/v1/traces',
      headers: {
        'x-honeycomb-team': process.env.HONEYCOMB_API_KEY,
        'x-honeycomb-dataset': 'my-app',
      },
    },
  });
}
```

### New Relic

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-app', {
    traceExporter: {
      url: 'https://trace-api.newrelic.com/trace/v1',
      headers: {
        'Api-Key': process.env.NEW_RELIC_API_KEY,
        'data-source': 'nr-trace-ingest',
      },
    },
    attributes: {
      'service.name': 'my-app',
      'account.id': process.env.NEW_RELIC_ACCOUNT_ID,
    },
  });
}
```

## Custom Instrumentation

### Adding Custom Spans

```typescript
import { trace } from '@opentelemetry/api';

export function customOperation() {
  const tracer = trace.getTracer('custom-tracer');
  const span = tracer.startSpan('custom-operation');

  try {
    // Add attributes
    span.setAttributes({
      'operation.type': 'database-query',
      'user.id': '12345',
    });

    // Add events
    span.addEvent('Operation started');

    // Your operation logic here
    performOperation();

    span.addEvent('Operation completed');
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}
```

### Metrics Integration

```typescript
import { metrics } from '@opentelemetry/api';

export function trackCustomMetric(value: number) {
  const meter = metrics.getMeter('custom-meter');
  const counter = meter.createCounter('custom_operations_total');

  counter.add(value, {
    'operation.type': 'custom',
    'service.name': 'my-app',
  });
}
```

## Environment Variables

### Configuration via Environment

```bash
# Service configuration
OTEL_SERVICE_NAME=my-app
OTEL_SERVICE_VERSION=1.0.0

# Exporter configuration
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-collector.com
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer your-token

# Sampling
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1

# Resource attributes
OTEL_RESOURCE_ATTRIBUTES=service.name=my-app,deployment.environment=production
```

### Vercel Environment Variables

```bash
# Vercel-specific
VERCEL_ENV=production
VERCEL_REGION=iad1
VERCEL_URL=my-app.vercel.app

# Custom application variables
NEXT_PUBLIC_APP_NAME=My Application
API_BASE_URL=https://api.example.com
```

## Best Practices

### Performance Optimization

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-app', {
    // Use sampling to reduce overhead
    sampler: 'traceidratio',
    samplerArg: 0.1, // Sample 10% of traces

    // Configure batch processing
    traceExporter: {
      url: 'https://your-collector.com/v1/traces',
      headers: { Authorization: 'Bearer your-token' },
      // Batch configuration
      timeoutMillis: 30000,
      maxExportBatchSize: 512,
    },
  });
}
```

### Error Handling

```typescript
import { registerOTel } from '@vercel/otel';
import { trace, SpanStatusCode } from '@opentelemetry/api';

export function register() {
  registerOTel('my-app', {
    // Error handling configuration
    traceExporter: {
      url: 'https://your-collector.com/v1/traces',
      headers: { Authorization: 'Bearer your-token' },
    },
  });
}

export function withTracing<T>(operation: () => Promise<T>): Promise<T> {
  const tracer = trace.getTracer('app-tracer');
  const span = tracer.startSpan('operation');

  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await operation();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Security Considerations

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-app', {
    // Avoid sensitive data in traces
    traceExporter: {
      url: process.env.OTEL_EXPORTER_URL,
      headers: {
        Authorization: `Bearer ${process.env.OTEL_API_KEY}`,
      },
    },

    // Filter sensitive attributes
    attributes: {
      'service.name': 'my-app',
      environment: process.env.NODE_ENV,
      // Never include secrets, tokens, or PII
    },
  });
}
```

## Troubleshooting

### Common Issues

1. **Instrumentation not loading**: Ensure `instrumentation.ts` is in project root
2. **Missing traces**: Check exporter configuration and network connectivity
3. **High overhead**: Adjust sampling rates and batch configuration
4. **Context not propagating**: Verify middleware and async operation handling

### Debug Mode

```typescript
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-app', {
    // Enable debug logging
    debug: true,

    // Verbose exporter configuration
    traceExporter: {
      url: 'https://your-collector.com/v1/traces',
      headers: { Authorization: 'Bearer your-token' },
      // Add timeout for debugging
      timeoutMillis: 5000,
    },
  });
}
```

## Limitations

- **Platform-specific optimizations**: Some optimizations are Vercel-specific
- **Exporter limitations**: Limited to OTLP HTTP exporter
- **Configuration complexity**: Advanced configurations require custom exporters
- **Cold start impact**: Initial instrumentation may affect cold start times

## Migration from Custom Setup

### From Manual OpenTelemetry Setup

```typescript
// Before (manual setup)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: new OTLPTraceExporter({
    url: 'https://your-collector.com/v1/traces',
  }),
});

sdk.start();

// After (@vercel/otel)
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('my-app', {
    traceExporter: {
      url: 'https://your-collector.com/v1/traces',
    },
  });
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Vercel OpenTelemetry Documentation](https://vercel.com/docs/otel)
- [OpenTelemetry Official Documentation](https://opentelemetry.io/docs/)
- [Next.js OpenTelemetry Guide](https://nextjs.org/docs/app/guides/open-telemetry)
- [OpenTelemetry JavaScript SDK](https://github.com/open-telemetry/opentelemetry-js)
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
- [OpenTelemetry Specifications](https://opentelemetry.io/docs/specs/)

## Implementation

[Add content here]

## Testing

[Add content here]
