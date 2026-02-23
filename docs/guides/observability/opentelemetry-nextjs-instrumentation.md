# opentelemetry-nextjs-instrumentation.md

# OpenTelemetry Instrumentation for Next.js Applications

## Overview

OpenTelemetry is a vendor-neutral, open-source observability framework for generating, collecting, and exporting telemetry data (traces, metrics, and logs). For Next.js applications, OpenTelemetry provides comprehensive observability across the hybrid rendering model, combining server-side rendering, client-side navigation, and API routes.

## Why OpenTelemetry for Next.js?

### Key Benefits

1. **Unified Observability**: Single instrumentation approach for all Next.js rendering modes
2. **Vendor Agnostic**: Change observability providers without code changes
3. **Comprehensive Coverage**: Automatic instrumentation for Next.js internals
4. **Performance Insights**: Deep visibility into application performance
5. **Production Debugging**: Trace issues across server and client boundaries

### Next.js Specific Challenges

- **Hybrid Rendering**: SSR, SSG, ISR, and CSR require different tracing approaches
- **Edge Runtime**: Limited instrumentation capabilities at the edge
- **API Routes**: Separate tracing context for serverless functions
- **Client Navigation**: Maintaining trace context across page transitions

## Setup and Configuration

### 1. Basic Setup with @vercel/otel

```bash
# Install dependencies
npm install @vercel/otel @opentelemetry/api @opentelemetry/sdk-node
npm install @opentelemetry/auto-instrumentations-node
```

```typescript
// instrumentation.ts (root directory)
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('next-app');
}
```

### 2. Manual OpenTelemetry Configuration

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function register() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'next-app',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
    }),

    // Auto-instrumentations for Node.js modules
    instrumentations: [getNodeAutoInstrumentations()],

    // Trace exporter
    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
      headers: {
        'api-key': process.env.OTEL_API_KEY || '',
      },
    }),

    // Metrics exporter
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics',
        headers: {
          'api-key': process.env.OTEL_API_KEY || '',
        },
      }),
      exportIntervalMillis: 30000, // Export every 30 seconds
    }),
  });

  sdk.start();
}
```

### 3. Environment Configuration

```bash
# .env.local
OTEL_SERVICE_NAME=next-app
OTEL_SERVICE_VERSION=1.0.0
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://localhost:4318/v1/metrics
OTEL_RESOURCE_ATTRIBUTES=service.name=next-app,service.version=1.0.0
OTEL_NODE_RESOURCE_DETECTORS=env,host,os
```

## Default Spans in Next.js

### Automatic Spans

Next.js automatically creates spans for the following operations:

#### Server-Side Rendering

```typescript
// Default spans for SSR
- [http.method] [next.route] - HTTP request handling
- render route (app) [next.route] - Server component rendering
- resolve page components - Component resolution
- resolve segment modules - Segment loading
- start response - Response initialization
```

#### API Routes

```typescript
// Default spans for API routes
- [http.method] [next.route] - API route request
- executing api route (app) [next.route] - API route execution
```

#### Client-Side Navigation

```typescript
// Default spans for client navigation
- fetch [http.method] [http.url] - Client-side fetches
- navigation - Page transitions
```

### Custom Spans

#### Manual Span Creation

```typescript
// lib/otel.ts
import { trace, SpanKind, SpanStatusCode } from '@opentelemetry/api';

export class CustomTracer {
  static async traceFunction<T>(
    name: string,
    fn: () => Promise<T>,
    attributes?: Record<string, string>
  ): Promise<T> {
    const tracer = trace.getTracer('next-app');
    const span = tracer.startSpan(name, {
      kind: SpanKind.INTERNAL,
      attributes: {
        'function.name': name,
        ...attributes,
      },
    });

    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      span.recordException(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      span.end();
    }
  }

  static traceDatabaseQuery<T>(query: string, fn: () => Promise<T>): Promise<T> {
    return this.traceFunction('database.query', fn, {
      'db.query': query,
      'db.system': 'postgresql',
    });
  }

  static traceExternalAPI<T>(apiName: string, endpoint: string, fn: () => Promise<T>): Promise<T> {
    return this.traceFunction('external.api', fn, {
      'api.name': apiName,
      'api.endpoint': endpoint,
    });
  }
}
```

#### Usage in Application Code

```typescript
// app/api/users/route.ts
import { CustomTracer } from '@/lib/otel';

export async function GET() {
  return CustomTracer.traceFunction('api.users.get', async () => {
    const users = await CustomTracer.traceDatabaseQuery('SELECT * FROM users', () =>
      db.query('SELECT * FROM users')
    );

    return Response.json(users);
  });
}

// lib/database.ts
export async function getUserById(id: string) {
  return CustomTracer.traceFunction('database.getUser', async () => {
    const query = 'SELECT * FROM users WHERE id = $1';
    return CustomTracer.traceDatabaseQuery(query, () => db.query(query, [id]));
  });
}
```

## Advanced Instrumentation

### 1. Custom Metrics

#### Creating Custom Metrics

```typescript
// lib/metrics.ts
import { metrics, Meter, Counter, Histogram, UpDownCounter } from '@opentelemetry/api';

export class CustomMetrics {
  private meter: Meter;

  constructor() {
    this.meter = metrics.getMeter('next-app-metrics');
  }

  // Request counter
  private requestCounter: Counter = this.meter.createCounter('http_requests_total', {
    description: 'Total number of HTTP requests',
  });

  // Request duration histogram
  private requestDuration: Histogram = this.meter.createHistogram('http_request_duration', {
    description: 'HTTP request duration',
    unit: 'ms',
  });

  // Active users gauge
  private activeUsers: UpDownCounter = this.meter.createUpDownCounter('active_users', {
    description: 'Number of active users',
  });

  // Database query counter
  private dbQueries: Counter = this.meter.createCounter('database_queries_total', {
    description: 'Total number of database queries',
  });

  // Record metrics
  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    this.requestCounter.add(1, {
      method,
      route,
      status_code: statusCode.toString(),
    });

    this.requestDuration.record(duration, {
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  incrementActiveUsers() {
    this.activeUsers.add(1);
  }

  decrementActiveUsers() {
    this.activeUsers.add(-1);
  }

  recordDatabaseQuery(queryType: string, duration: number) {
    this.dbQueries.add(1, {
      query_type: queryType,
    });

    this.requestDuration.record(duration, {
      query_type: queryType,
    });
  }
}

// Singleton instance
export const customMetrics = new CustomMetrics();
```

#### Middleware Integration

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { customMetrics } from '@/lib/metrics';

export function middleware(request: NextRequest) {
  const start = Date.now();

  // Increment active users
  customMetrics.incrementActiveUsers();

  const response = NextResponse.next();

  // Record metrics after response
  response.headers.set('x-middleware-start', start.toString());

  return response;
}
```

### 2. Context Propagation

#### Client-Side Context

```typescript
// lib/client-otel.ts
import { trace, context, propagation } from '@opentelemetry/api';

export class ClientTracer {
  static traceFunction<T>(
    name: string,
    fn: () => Promise<T>,
    attributes?: Record<string, string>
  ): Promise<T> {
    const tracer = trace.getTracer('next-app-client');
    const span = tracer.startSpan(name, {
      kind: SpanKind.CLIENT,
      attributes,
    });

    try {
      const result = fn();

      if (result instanceof Promise) {
        return result
          .then((data) => {
            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
            return data;
          })
          .catch((error) => {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            });
            span.recordException(error);
            span.end();
            throw error;
          });
      }

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      span.end();
      throw error;
    }
  }

  // Propagate context to fetch requests
  static fetchWithTracing(url: string, options?: RequestInit): Promise<Response> {
    const tracer = trace.getTracer('next-app-client');
    const span = tracer.startSpan('fetch', {
      kind: SpanKind.CLIENT,
      attributes: {
        'http.url': url,
        'http.method': options?.method || 'GET',
      },
    });

    // Inject context into headers
    const headers = new Headers(options?.headers);
    propagation.inject(context.active(), headers, {
      set: (carrier, key, value) => carrier.set(key, value),
    });

    const fetchOptions = {
      ...options,
      headers,
    };

    return fetch(url, fetchOptions)
      .then((response) => {
        span.setAttributes({
          'http.status_code': response.status.toString(),
        });

        if (response.ok) {
          span.setStatus({ code: SpanStatusCode.OK });
        } else {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: `HTTP ${response.status}`,
          });
        }

        span.end();
        return response;
      })
      .catch((error) => {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        span.recordException(error);
        span.end();
        throw error;
      });
  }
}
```

#### Usage in Client Components

```typescript
// components/UserProfile.tsx
'use client';

import { ClientTracer } from '@/lib/client-otel';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await ClientTracer.traceFunction(
          'loadUserProfile',
          () => ClientTracer.fetchWithTracing(`/api/users/${userId}`),
          { 'user.id': userId }
        );

        const user = await userData.json();
        setUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### 3. Error Handling and Logging

#### Structured Error Logging

```typescript
// lib/error-logging.ts
import { trace, context, Exception } from '@opentelemetry/api';

export class ErrorLogger {
  static logError(error: Error, context?: Record<string, any>) {
    const tracer = trace.getTracer('next-app');
    const span = tracer.startSpan('error', {
      attributes: {
        'error.name': error.name,
        'error.message': error.message,
        'error.stack': error.stack || '',
        ...context,
      },
    });

    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });

    // Log to console with structured format
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        context,
        traceId: span.spanContext().traceId,
        spanId: span.spanContext().spanId,
      })
    );

    span.end();
  }

  static logWarning(message: string, context?: Record<string, any>) {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'warning',
        message,
        context,
      })
    );
  }

  static logInfo(message: string, context?: Record<string, any>) {
    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        message,
        context,
      })
    );
  }
}
```

#### Error Boundary Integration

```typescript
// components/ErrorBoundary.tsx
'use client';

import { ErrorLogger } from '@/lib/error-logging';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorLogger.logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error && (
              <summary>Error details</summary>
            )}
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Production Deployment

### 1. OpenTelemetry Collector Setup

#### Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: ['--config=/etc/otel-collector-config.yaml']
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - '4317:4317' # OTLP gRPC receiver
      - '4318:4318' # OTLP HTTP receiver
      - '8888:8888' # Prometheus metrics
      - '8889:8889' # Prometheus exporter
    environment:
      - OTEL_EXPORTER_JAEGER_ENDPOINT=http://jaeger:14268/api/traces
      - OTEL_EXPORTER_PROMETHEUS_ENDPOINT=http://prometheus:9090/api/v1/write

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - '16686:16686' # Jaeger UI
      - '14268:14268' # Jaeger collector

  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3000:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

#### Collector Configuration

```yaml
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
  memory_limiter:
    limit_mib: 512

exporters:
  jaeger:
    endpoint: jaeger:14268
    tls:
      insecure: true

  prometheus:
    endpoint: '0.0.0.0:8889'
    const_labels:
      environment: production

  logging:
    loglevel: info

extensions:
  health_check:
  pprof:
    endpoint: 0.0.0.0:1777

service:
  extensions: [health_check, pprof]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [jaeger]

    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [prometheus]
```

### 2. Cloud Provider Integration

#### AWS X-Ray Integration

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AWSXRayIdGenerator } from '@opentelemetry/id-generator-aws-xray';
import { AWSXRayPropagator } from '@opentelemetry/propagator-aws-xray';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function register() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'next-app',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
      [SemanticResourceAttributes.CLOUD_PROVIDER]: 'aws',
      [SemanticResourceAttributes.CLOUD_PLATFORM]: 'aws_ec2',
      [SemanticResourceAttributes.CLOUD_REGION]: process.env.AWS_REGION,
    }),

    instrumentations: [getNodeAutoInstrumentations()],

    // AWS XRay integration
    idGenerator: new AWSXRayIdGenerator(),
    textMapPropagator: new AWSXRayPropagator(),

    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
      headers: {
        'x-amzn-trace-id': process.env.AWS_XRAY_TRACE_ID,
      },
    }),
  });

  sdk.start();
}
```

#### Google Cloud Trace Integration

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { GoogleCloudTraceExporter } from '@opentelemetry/exporter-google-cloud-trace';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function register() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'next-app',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
      [SemanticResourceAttributes.CLOUD_PROVIDER]: 'gcp',
      [SemanticResourceAttributes.CLOUD_PLATFORM]: 'gcp_cloud_run',
      [SemanticResourceAttributes.CLOUD_REGION]: process.env.GOOGLE_CLOUD_REGION,
    }),

    instrumentations: [getNodeAutoInstrumentations()],

    traceExporter: new GoogleCloudTraceExporter({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    }),
  });

  sdk.start();
}
```

## Performance Optimization

### 1. Sampling Strategies

#### Head-Based Sampling

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

export function register() {
  const sdk = new NodeSDK({
    // Sample 10% of traces in production
    sampler: new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(0.1),
    }),

    // ... other configuration
  });

  sdk.start();
}
```

#### Adaptive Sampling

```typescript
// lib/adaptive-sampler.ts
import { Sampler, SamplingDecision, SamplingResult } from '@opentelemetry/sdk-trace-base';
import { SpanKind } from '@opentelemetry/api';

export class AdaptiveSampler implements Sampler {
  private errorRate = 0;
  private totalSpans = 0;
  private errorSpans = 0;

  constructor(private baseSampleRate: number = 0.1) {}

  shouldSample(
    context: any,
    traceId: string,
    spanName: string,
    spanKind: SpanKind,
    attributes: any
  ): SamplingResult {
    this.totalSpans++;

    // Always sample errors
    if (attributes?.error) {
      this.errorSpans++;
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLE,
        attributes: {
          'sampling.reason': 'error',
        },
      };
    }

    // Always sample critical operations
    if (this.isCriticalOperation(spanName, attributes)) {
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLE,
        attributes: {
          'sampling.reason': 'critical',
        },
      };
    }

    // Adaptive sampling based on error rate
    const adjustedSampleRate = this.calculateAdjustedRate();

    if (Math.random() < adjustedSampleRate) {
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLE,
        attributes: {
          'sampling.reason': 'adaptive',
          'sampling.rate': adjustedSampleRate.toString(),
        },
      };
    }

    return {
      decision: SamplingDecision.DROP,
      attributes: {
        'sampling.reason': 'dropped',
      },
    };
  }

  private isCriticalOperation(spanName: string, attributes: any): boolean {
    const criticalOperations = ['auth.login', 'payment.process', 'user.signup'];

    return (
      criticalOperations.includes(spanName) ||
      attributes?.['http.status_code']?.startsWith('5') ||
      attributes?.['error']
    );
  }

  private calculateAdjustedRate(): number {
    const errorRate = this.errorSpans / this.totalSpans;

    // Increase sampling rate when error rate is high
    if (errorRate > 0.05) {
      return Math.min(1.0, this.baseSampleRate * 2);
    }

    // Decrease sampling rate when error rate is low
    if (errorRate < 0.01) {
      return Math.max(0.01, this.baseSampleRate * 0.5);
    }

    return this.baseSampleRate;
  }
}
```

### 2. Resource Optimization

#### Memory Management

```typescript
// lib/resource-manager.ts
export class ResourceManager {
  private static readonly MAX_SPANS = 1000;
  private static readonly MAX_ATTRIBUTES = 128;
  private static readonly MAX_EVENTS = 128;

  static createOptimizedSpan(name: string, options?: any) {
    const attributes = this.limitAttributes(options?.attributes);
    const events = this.limitEvents(options?.events);

    return {
      name,
      attributes,
      events,
      // Limit span duration to prevent memory leaks
      maxDuration: 60000, // 60 seconds
    };
  }

  private static limitAttributes(attributes?: Record<string, any>): Record<string, any> {
    if (!attributes) return {};

    const limited: Record<string, any> = {};
    let count = 0;

    for (const [key, value] of Object.entries(attributes)) {
      if (count >= this.MAX_ATTRIBUTES) break;

      // Limit attribute values to 1024 characters
      const stringValue = String(value);
      limited[key] =
        stringValue.length > 1024 ? stringValue.substring(0, 1024) + '...' : stringValue;

      count++;
    }

    return limited;
  }

  private static limitEvents(events?: any[]): any[] {
    if (!events) return [];

    return events.slice(0, this.MAX_EVENTS).map((event) => ({
      ...event,
      attributes: this.limitAttributes(event.attributes),
    }));
  }
}
```

## Testing and Validation

### 1. Unit Testing

#### Testing Custom Spans

```typescript
// __tests__/otel.test.ts
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { CustomTracer } from '@/lib/otel';

describe('CustomTracer', () => {
  it('should create and end spans correctly', async () => {
    const tracer = trace.getTracer('test');

    const result = await CustomTracer.traceFunction('test-function', async () => {
      return 'test-result';
    });

    expect(result).toBe('test-result');
  });

  it('should record errors in spans', async () => {
    const error = new Error('Test error');

    await expect(
      CustomTracer.traceFunction('test-error', async () => {
        throw error;
      })
    ).rejects.toThrow('Test error');
  });

  it('should include attributes in spans', async () => {
    const tracer = trace.getTracer('test');

    await CustomTracer.traceFunction('test-attributes', async () => 'result', {
      'test.attribute': 'value',
    });

    // Verify span attributes (implementation depends on testing setup)
  });
});
```

### 2. Integration Testing

#### End-to-End Tracing Test

```typescript
// __tests__/tracing-integration.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import { App } from '@/app/page';

describe('Tracing Integration', () => {
  it('should trace page load', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    // Verify that traces were created
    // This depends on your testing infrastructure
  });

  it('should trace API calls', async () => {
    // Mock fetch to verify tracing headers
    const originalFetch = global.fetch;
    global.fetch = jest.fn();

    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'traceparent': expect.any(String),
            'x-trace-id': expect.any(String),
          }),
        })
      );
    });

    global.fetch = originalFetch;
  });
});
```

## Monitoring and Alerting

### 1. Dashboard Setup

#### Grafana Dashboard Configuration

```json
{
  "dashboard": {
    "title": "Next.js OpenTelemetry Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Request Duration",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
            "legendFormat": "Error Rate"
          }
        ]
      }
    ]
  }
}
```

### 2. Alerting Rules

#### Prometheus Alerting Rules

```yaml
# alerts.yml
groups:
  - name: nextjs-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~\"5..\"}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is {{ $value | humanizePercentage }} for the last 5 minutes'

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_bucket[5m])) > 2000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High response time detected'
          description: '95th percentile response time is {{ $value }}ms'

      - alert: DatabaseQuerySlow
        expr: histogram_quantile(0.95, rate(database_query_duration_bucket[5m])) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'Slow database queries detected'
          description: '95th percentile query time is {{ $value }}ms'
```

## Best Practices

### 1. Performance Considerations

- **Sampling**: Use appropriate sampling rates to balance observability and performance
- **Batch Processing**: Configure batch processors for efficient data export
- **Resource Limits**: Set appropriate limits for spans, attributes, and events
- **Async Operations**: Ensure tracing doesn't block critical application flows

### 2. Security Considerations

- **Sensitive Data**: Avoid logging sensitive information (passwords, tokens, PII)
- **Data Retention**: Configure appropriate retention policies for trace data
- **Access Control**: Implement proper access controls for observability data
- **Network Security**: Use secure connections for data export

### 3. Operational Guidelines

- **Environment Configuration**: Use different configurations for development, staging, and production
- **Version Management**: Include service version information in all traces
- **Monitoring**: Monitor the observability system itself
- **Documentation**: Maintain clear documentation of custom spans and metrics

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Documentation

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Next.js OpenTelemetry Guide](https://nextjs.org/docs/app/guides/open-telemetry/)
- [OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry JavaScript](https://github.com/open-telemetry/opentelemetry-js)

### Tools and Platforms

- [Jaeger Tracing](https://www.jaegertracing.io/)
- [Prometheus Monitoring](https://prometheus.io/)
- [Grafana Dashboards](https://grafana.com/)
- [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector)

### Cloud Provider Guides

- [AWS X-Ray Integration](https://docs.aws.amazon.com/xray/)
- [Google Cloud Trace](https://cloud.google.com/trace)
- [Azure Monitor](https://docs.microsoft.com/en-us/azure/monitor/)

### Best Practices

- [OpenTelemetry Best Practices](https://opentelemetry.io/docs/best-practices/)
- [Next.js Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Observability Engineering](https://www.oreilly.com/library/view/observability-engineering/9781492076438/)

## Implementation

[Add content here]
