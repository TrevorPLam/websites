<!--
/**
 * @file opentelemetry-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for opentelemetry documentation.
 * @entrypoints docs/guides/opentelemetry-documentation.md
 * @exports opentelemetry documentation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# opentelemetry-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


OpenTelemetry (OTel) is a vendor-neutral open source observability framework for instrumenting, generating, collecting, and exporting telemetry data such as traces, metrics, and logs. As an industry standard, OpenTelemetry is supported by more than 90 observability vendors and integrated by many libraries, services, and applications.

## Core Concepts

### Signals

OpenTelemetry provides three types of telemetry signals:

- **Traces**: Track requests as they flow through distributed systems
- **Metrics**: Measure quantitative data over time
- **Logs**: Provide detailed event information with context

### Components

OpenTelemetry consists of several key components:

- **API**: Provides interfaces for instrumentation
- **SDK**: Implements the API with configurable behavior
- **Instrumentation Libraries**: Auto-instrument popular frameworks and libraries
- **Collector**: Vendor-agnostic telemetry data receiver and processor
- **Exporters**: Send telemetry data to various backends

## Architecture

### OpenTelemetry SDK

The SDK implementation includes:

- **SdkLoggerProvider**: Logger provider with processing and exporting capabilities
- **TextMapPropagator**: Propagates context across process boundaries
- **OpenTelemetrySdk**: Carrier object combining all configured SDK components

### Instrumentation Methods

For each signal type, OpenTelemetry provides several methods:

- **Manual Instrumentation**: Direct API usage for custom code
- **Auto Instrumentation**: Library-based instrumentation for common frameworks
- **Zero-code Instrumentation**: Automatic instrumentation without code changes

## Getting Started

### Installation

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node
```

### Basic Setup

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

## Manual Instrumentation

### Creating Spans

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('my-service');

// Create a span
const span = tracer.startSpan('operation-name');

// Add attributes
span.setAttributes({
  'user.id': '12345',
  'operation.type': 'database-query',
});

// Add events
span.addEvent('Database query started', {
  'db.query': 'SELECT * FROM users',
});

// End the span
span.end();
```

### Metrics

```typescript
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('my-service');

// Create a counter
const counter = meter.createCounter('requests_total', {
  description: 'Total number of requests',
});

counter.add(1, { method: 'GET', status: '200' });

// Create a histogram
const histogram = meter.createHistogram('request_duration', {
  description: 'Request duration in milliseconds',
});

histogram.record(150, { endpoint: '/api/users' });
```

### Logging

```typescript
import { logs } from '@opentelemetry/api';

const logger = logs.getLogger('my-service');

logger.emit({
  severityNumber: SeverityNumber.INFO,
  body: 'User login successful',
  attributes: {
    'user.id': '12345',
    'ip.address': '192.168.1.1',
  },
});
```

## Context Propagation

### TextMapPropagator

```typescript
import { propagation, trace } from '@opentelemetry/api';

// Inject context into outgoing request
const headers = {};
propagation.inject(headers, trace.setSpan(context, activeSpan));

// Extract context from incoming request
const extractedContext = propagation.extract(headers);
```

## Exporters

### OTLP Exporter

```typescript
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';

const traceExporter = new OTLPTraceExporter({
  url: 'https://your-collector.com/v1/traces',
  headers: {
    Authorization: 'Bearer your-token',
  },
});
```

### Prometheus Exporter

```typescript
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const prometheusExporter = new PrometheusExporter({
  port: 9464,
  endpoint: '/metrics',
});
```

## Configuration

### Environment Variables

```bash
# Service name
OTEL_SERVICE_NAME=my-service

# Resource attributes
OTEL_RESOURCE_ATTRIBUTES=service.version=1.0.0,deployment.environment=production

# Exporter configuration
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-collector.com
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer your-token

# Sampling
OTEL_TRACES_SAMPLER=traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1
```

### Configuration File

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production',
  }),
  traceExporter: new OTLPTraceExporter(),
  metricExporter: new PrometheusExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});
```

## Best Practices

### Semantic Conventions

Use OpenTelemetry semantic conventions for consistent naming:

```typescript
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

span.setAttributes({
  [SemanticAttributes.HTTP_METHOD]: 'GET',
  [SemanticAttributes.HTTP_URL]: '/api/users',
  [SemanticAttributes.HTTP_STATUS_CODE]: 200,
  [SemanticAttributes.DB_SYSTEM]: 'postgresql',
  [SemanticAttributes.DB_STATEMENT]: 'SELECT * FROM users',
});
```

### Sampling

Configure appropriate sampling to balance performance and observability:

```typescript
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(0.1), // Sample 10% of traces
});
```

### Error Handling

```typescript
try {
  // Your code here
} catch (error) {
  span.recordException(error);
  span.setStatus({ code: SpanStatusCode.ERROR });
  throw error;
}
```

## Integration with Popular Frameworks

### Express.js

```typescript
import { expressInstrumentation } from '@opentelemetry/instrumentation-express';

const sdk = new NodeSDK({
  instrumentations: [
    expressInstrumentation({
      requestHook: (span, info) => {
        span.setAttribute('custom.attribute', 'value');
      },
    }),
  ],
});
```

### Next.js

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Export for Next.js
export default sdk;
```

## Security Considerations

- **Sensitive Data**: Avoid logging sensitive information in traces
- **PII**: Use appropriate sampling and filtering for personally identifiable information
- **Authentication**: Secure your collector endpoints with proper authentication
- **Network**: Use TLS for all telemetry data transmission

## Performance Impact

- **Overhead**: OpenTelemetry typically adds <5% performance overhead
- **Sampling**: Use appropriate sampling rates to minimize impact
- **Batching**: Configure batch processing for exporters
- **Async Processing**: Use asynchronous exporters to avoid blocking

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [OpenTelemetry Official Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry Concepts](https://opentelemetry.io/docs/concepts/)
- [OpenTelemetry Getting Started](https://opentelemetry.io/docs/getting-started/)
- [OpenTelemetry Specifications](https://opentelemetry.io/docs/specs/)
- [OpenTelemetry GitHub](https://github.com/open-telemetry/opentelemetry-js)
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
- [Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)


## Overview

[Add content here]


## Implementation

[Add content here]


## Testing

[Add content here]
