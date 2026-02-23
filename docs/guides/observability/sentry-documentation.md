# sentry-documentation.md


## Overview

Sentry is a comprehensive application monitoring and debugging platform that provides end-to-end distributed tracing, error tracking, and performance monitoring. This documentation covers Sentry's core features, SDK integration, configuration patterns, and best practices for 2026 implementation.

## Core Concepts

### Error Tracking and Performance Monitoring

Sentry provides unified monitoring for both errors and performance issues:

```typescript
// Sentry initialization with error tracking and performance monitoring
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',

  // Performance monitoring
  integrations: [
    new BrowserTracing({
      // Set custom trace propagation targets
      tracePropagationTargets: [/^\//, /^https:\/\/api\.example\.com/],
    }),
  ],

  // Performance sampling
  tracesSampleRate: 1.0,

  // Error sampling
  sampleRate: 1.0,

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Release tracking
  release: 'my-app@1.0.0',

  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
});
```

### Distributed Tracing

```typescript
// Manual tracing for custom operations
import * as Sentry from '@sentry/react';

async function processOrder(orderId: string): Promise<void> {
  return Sentry.startSpan(
    {
      name: 'process-order',
      op: 'function',
      description: `Processing order ${orderId}`,
    },
    async () => {
      // Validate order
      await Sentry.startSpan({ name: 'validate-order', op: 'function' }, async () => {
        await validateOrder(orderId);
      });

      // Process payment
      await Sentry.startSpan({ name: 'process-payment', op: 'http.client' }, async () => {
        await processPayment(orderId);
      });

      // Update inventory
      await Sentry.startSpan({ name: 'update-inventory', op: 'db.query' }, async () => {
        await updateInventory(orderId);
      });
    }
  );
}
```

## SDK Integration

### Next.js Integration

```typescript
// pages/_app.tsx
import * as Sentry from '@sentry/nextjs';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default Sentry.withProfiler(MyApp);

// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  integrations: [
    Sentry.httpIntegration({ tracing: true }),
    Sentry.postgresIntegration(),
    Sentry.redisIntegration(),
  ],

  tracesSampleRate: 1.0,
});
```

### React Integration

```typescript
// Error boundary component
import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Profiler for performance monitoring
function MyComponent(): JSX.Element {
  return (
    <Sentry.Profiler
      name="MyComponent"
      onUpdate={(profilerEvent) => {
        console.log('Performance data:', profilerEvent);
      }}
    >
      <div>My component content</div>
    </Sentry.Profiler>
  );
}
```

### Node.js Integration

```typescript
// server.ts
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  integrations: [
    nodeProfilingIntegration(),
    Sentry.httpIntegration({ tracing: true }),
    Sentry.postgresIntegration(),
  ],

  tracesSampleRate: 1.0,

  // Performance monitoring
  profilesSampleRate: 1.0,
});

// Express middleware
import express from 'express';

const app = express();

// Request handler and tracing
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler
app.use(Sentry.Handlers.errorHandler());

// Custom error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  Sentry.captureException(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

## Advanced Configuration

### Custom Context and Tags

```typescript
// Adding custom context
Sentry.setContext('user', {
  id: '12345',
  email: 'user@example.com',
  plan: 'premium',
  lastLogin: new Date().toISOString(),
});

Sentry.setContext('request', {
  method: 'POST',
  url: '/api/orders',
  headers: {
    'content-type': 'application/json',
    authorization: 'Bearer ***',
  },
});

// Adding tags for filtering
Sentry.setTag('feature', 'checkout');
Sentry.setTag('environment', 'production');
Sentry.setTag('version', '1.2.3');

// Adding extra data
Sentry.setExtra('order_id', 'order_12345');
Sentry.setExtra('payment_method', 'credit_card');
Sentry.setExtra('amount', 99.99);
```

### Custom Breadcrumbs

```typescript
// Manual breadcrumb creation
Sentry.addBreadcrumb({
  message: 'User clicked checkout button',
  category: 'ui',
  level: 'info',
  data: {
    button_id: 'checkout-btn',
    page: '/products/123',
    timestamp: Date.now(),
  },
});

// HTTP request breadcrumb
Sentry.addBreadcrumb({
  category: 'http',
  message: 'POST /api/orders',
  level: 'info',
  data: {
    status_code: 200,
    duration: 250,
    request_size: 1024,
    response_size: 512,
  },
});

// Database query breadcrumb
Sentry.addBreadcrumb({
  category: 'db',
  message: 'SELECT * FROM orders WHERE user_id = ?',
  level: 'info',
  data: {
    database: 'postgresql',
    duration: 45,
    rows_affected: 10,
  },
});
```

### Custom Sampling

```typescript
// Advanced sampling configuration
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampler: (samplingContext) => {
    // Sample all transactions in production
    if (samplingContext.transactionContext.name === 'checkout') {
      return 1.0; // 100% sample rate for checkout
    }

    // Sample 10% of other transactions
    return 0.1;
  },

  beforeSend: (event, hint) => {
    // Filter out certain errors
    if (event.exception) {
      const error = hint.originalException as Error;

      // Ignore network errors in development
      if (process.env.NODE_ENV === 'development' && error.message.includes('Network Error')) {
        return null;
      }

      // Add custom fingerprinting
      event.fingerprint = ['{{ default }}', error.message, event.request?.url];
    }

    return event;
  },
});
```

## Error Handling Patterns

### Structured Error Reporting

```typescript
// Custom error classes
class PaymentError extends Error {
  constructor(
    message: string,
    public readonly paymentId: string,
    public readonly amount: number,
    public readonly errorCode: string
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Error reporting with context
function reportPaymentError(error: PaymentError): void {
  Sentry.captureException(error, {
    tags: {
      error_type: 'payment',
      error_code: error.errorCode,
    },
    extra: {
      payment_id: error.paymentId,
      amount: error.amount,
      timestamp: new Date().toISOString(),
    },
    fingerprint: ['payment-error', error.errorCode, error.paymentId],
  });
}

// Usage in application
async function processPayment(paymentId: string, amount: number): Promise<void> {
  try {
    // Payment processing logic
    await paymentGateway.charge(paymentId, amount);
  } catch (error) {
    const paymentError = new PaymentError(
      `Payment failed: ${error.message}`,
      paymentId,
      amount,
      'PAYMENT_GATEWAY_ERROR'
    );

    reportPaymentError(paymentError);
    throw paymentError;
  }
}
```

### Async Error Handling

```typescript
// Async error boundary for React
class AsyncErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error?: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        error_boundary: 'async',
      },
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details>
            {this.state.error && this.state.error.message}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Async function error wrapper
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        operation: context,
        async: 'true'
      },
      extra: {
        timestamp: new Date().toISOString(),
        context
      }
    });
    throw error;
  }
}
```

## Performance Monitoring

### Custom Metrics

```typescript
// Custom performance metrics
class PerformanceTracker {
  static trackDatabaseQuery(query: string, duration: number): void {
    Sentry.addBreadcrumb({
      category: 'db.query',
      message: query,
      level: 'info',
      data: {
        duration,
        timestamp: Date.now(),
      },
    });

    // Send custom metric
    Sentry.metrics.increment('database.query.count', 1, {
      query_type: this.getQueryType(query),
    });

    Sentry.metrics.distribution('database.query.duration', duration, {
      query_type: this.getQueryType(query),
    });
  }

  static trackAPICall(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number
  ): void {
    Sentry.addBreadcrumb({
      category: 'http',
      message: `${method} ${endpoint}`,
      level: statusCode >= 400 ? 'error' : 'info',
      data: {
        status_code: statusCode,
        duration,
        timestamp: Date.now(),
      },
    });

    Sentry.metrics.increment('api.request.count', 1, {
      endpoint,
      method,
      status_code: statusCode.toString(),
    });

    Sentry.metrics.distribution('api.request.duration', duration, {
      endpoint,
      method,
    });
  }

  private static getQueryType(query: string): string {
    const normalized = query.trim().toUpperCase();
    if (normalized.startsWith('SELECT')) return 'SELECT';
    if (normalized.startsWith('INSERT')) return 'INSERT';
    if (normalized.startsWith('UPDATE')) return 'UPDATE';
    if (normalized.startsWith('DELETE')) return 'DELETE';
    return 'OTHER';
  }
}
```

### Frontend Performance

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToSentry(metric: any): void {
  Sentry.addBreadcrumb({
    category: 'web-vitals',
    message: metric.name,
    level: 'info',
    data: {
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
    },
  });

  // Send as custom metric
  Sentry.metrics.gauge(`web_vitals.${metric.name}`, metric.value, {
    rating: metric.rating,
  });
}

// Initialize web vitals tracking
getCLS(sendToSentry);
getFID(sendToSentry);
getFCP(sendToSentry);
getLCP(sendToSentry);
getTTFB(sendToSentry);

// Custom performance marks
function measureComponentRender(componentName: string): void {
  const startTime = performance.now();

  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      Sentry.metrics.distribution('component.render.duration', duration, {
        component: componentName,
      });

      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Component ${componentName} rendered`,
        level: 'info',
        data: {
          duration,
          component: componentName,
        },
      });
    },
  };
}
```

## Security and Privacy

### Data Sanitization

```typescript
// Sensitive data filtering
interface SentryDataSanitizer {
  sanitizeRequest(request: any): any;
  sanitizeUser(user: any): any;
  sanitizeResponse(response: any): any;
}

class SentryDataSanitizerImpl implements SentryDataSanitizer {
  private sensitiveFields = ['password', 'token', 'secret', 'key', 'credit_card', 'ssn', 'email'];

  sanitizeRequest(request: any): any {
    if (!request) return request;

    const sanitized = { ...request };

    // Sanitize headers
    if (sanitized.headers) {
      sanitized.headers = this.sanitizeObject(sanitized.headers);
    }

    // Sanitize query parameters
    if (sanitized.query_string) {
      sanitized.query_string = this.sanitizeQueryString(sanitized.query_string);
    }

    // Sanitize body
    if (sanitized.data) {
      sanitized.data = this.sanitizeObject(sanitized.data);
    }

    return sanitized;
  }

  sanitizeUser(user: any): any {
    if (!user) return user;

    const sanitized = { ...user };

    // Mask sensitive user data
    if (sanitized.email) {
      sanitized.email = this.maskEmail(sanitized.email);
    }

    // Remove sensitive fields
    this.sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  sanitizeResponse(response: any): any {
    if (!response) return response;

    const sanitized = { ...response };

    // Sanitize response data
    if (sanitized.data) {
      sanitized.data = this.sanitizeObject(sanitized.data);
    }

    return sanitized;
  }

  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in sanitized) {
      if (this.sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeObject(sanitized[key]);
      }
    }

    return sanitized;
  }

  private maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.slice(0, 2)}***@${domain}`;
  }

  private sanitizeQueryString(queryString: string): string {
    const params = new URLSearchParams(queryString);

    for (const [key] of params) {
      if (this.sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        params.set(key, '[REDACTED]');
      }
    }

    return params.toString();
  }
}

// Apply sanitizer in Sentry configuration
const sanitizer = new SentryDataSanitizerImpl();

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  beforeSend: (event) => {
    // Sanitize request data
    if (event.request) {
      event.request = sanitizer.sanitizeRequest(event.request);
    }

    // Sanitize user data
    if (event.user) {
      event.user = sanitizer.sanitizeUser(event.user);
    }

    // Sanitize contexts
    if (event.contexts) {
      Object.keys(event.contexts).forEach((key) => {
        event.contexts[key] = sanitizer.sanitizeObject(event.contexts[key]);
      });
    }

    return event;
  },
});
```

### GDPR Compliance

```typescript
// GDPR compliance features
class GDPRCompliance {
  private userConsent: boolean = false;
  private dataRetentionDays: number = 30;

  setConsent(consented: boolean): void {
    this.userConsent = consented;

    if (consented) {
      Sentry.setUser({ consent: 'granted' });
    } else {
      Sentry.setUser({ consent: 'denied' });
      // Clear existing data
      this.clearUserData();
    }
  }

  clearUserData(): void {
    Sentry.setUser(null);
    Sentry.setContext('user', {});
  }

  requestDeletion(userId: string): void {
    // Send deletion request to Sentry
    Sentry.captureMessage(`User data deletion requested: ${userId}`, {
      level: 'info',
      tags: {
        gdpr: 'deletion_request',
      },
    });

    // Clear local user data
    this.clearUserData();
  }

  configureDataRetention(days: number): void {
    this.dataRetentionDays = days;

    Sentry.configureScope((scope) => {
      scope.setTag('data_retention_days', days.toString());
    });
  }
}
```

## Testing and Development

### Mock Sentry for Testing

```typescript
// Mock Sentry for unit tests
class MockSentry {
  private static events: any[] = [];
  private static breadcrumbs: any[] = [];

  static captureException(error: Error, context?: any): string {
    const eventId = `mock-event-${Date.now()}`;
    this.events.push({
      id: eventId,
      error,
      context,
      timestamp: new Date().toISOString(),
    });
    return eventId;
  }

  static captureMessage(message: string, level: string = 'info'): string {
    const eventId = `mock-message-${Date.now()}`;
    this.events.push({
      id: eventId,
      message,
      level,
      timestamp: new Date().toISOString(),
    });
    return eventId;
  }

  static addBreadcrumb(breadcrumb: any): void {
    this.breadcrumbs.push({
      ...breadcrumb,
      timestamp: new Date().toISOString(),
    });
  }

  static getEvents(): any[] {
    return this.events;
  }

  static getBreadcrumbs(): any[] {
    return this.breadcrumbs;
  }

  static clear(): void {
    this.events = [];
    this.breadcrumbs = [];
  }

  // Mock other Sentry methods
  static init(): void {}
  static setUser(): void {}
  static setTag(): void {}
  static setExtra(): void {}
  static setContext(): void {}
}

// Test utilities
export function setupSentryMock(): void {
  // Replace Sentry with mock
  global.Sentry = MockSentry;
}

export function expectSentryEvent(error: Error, context?: any): void {
  const events = MockSentry.getEvents();
  const matchingEvent = events.find(
    (event) => event.error === error && JSON.stringify(event.context) === JSON.stringify(context)
  );

  expect(matchingEvent).toBeDefined();
}

export function expectSentryBreadcrumb(category: string, message: string): void {
  const breadcrumbs = MockSentry.getBreadcrumbs();
  const matchingBreadcrumb = breadcrumbs.find(
    (breadcrumb) => breadcrumb.category === category && breadcrumb.message === message
  );

  expect(matchingBreadcrumb).toBeDefined();
}
```

### Integration Testing

```typescript
// Integration test for Sentry
describe('Sentry Integration', () => {
  beforeEach(() => {
    setupSentryMock();
  });

  afterEach(() => {
    MockSentry.clear();
  });

  it('should capture exceptions with context', () => {
    const error = new Error('Test error');
    const context = { tags: { feature: 'test' } };

    Sentry.captureException(error, context);

    expectSentryEvent(error, context);
  });

  it('should add breadcrumbs for user actions', () => {
    const breadcrumb = {
      category: 'ui',
      message: 'User clicked button',
      level: 'info',
    };

    Sentry.addBreadcrumb(breadcrumb);

    expectSentryBreadcrumb('ui', 'User clicked button');
  });
});
```

## Monitoring and Alerting

### Custom Alerts

```typescript
// Alert configuration
interface AlertRule {
  name: string;
  condition: (event: any) => boolean;
  threshold: number;
  window: number; // minutes
  notification: {
    slack?: string;
    email?: string[];
    webhook?: string;
  };
}

class AlertManager {
  private rules: AlertRule[] = [];
  private eventCounts: Map<string, number> = new Map();

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  processEvent(event: any): void {
    this.rules.forEach((rule) => {
      if (rule.condition(event)) {
        this.incrementEventCount(rule.name);
        this.checkThreshold(rule);
      }
    });
  }

  private incrementEventCount(ruleName: string): void {
    const current = this.eventCounts.get(ruleName) || 0;
    this.eventCounts.set(ruleName, current + 1);
  }

  private checkThreshold(rule: AlertRule): void {
    const count = this.eventCounts.get(rule.name) || 0;

    if (count >= rule.threshold) {
      this.sendAlert(rule);
      this.eventCounts.set(rule.name, 0); // Reset counter
    }
  }

  private sendAlert(rule: AlertRule): void {
    const message = `Alert: ${rule.name} threshold reached`;

    if (rule.notification.slack) {
      this.sendSlackAlert(rule.notification.slack, message);
    }

    if (rule.notification.email) {
      this.sendEmailAlert(rule.notification.email, message);
    }

    if (rule.notification.webhook) {
      this.sendWebhookAlert(rule.notification.webhook, message);
    }
  }

  private async sendSlackAlert(webhook: string, message: string): Promise<void> {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  }

  private async sendEmailAlert(emails: string[], message: string): Promise<void> {
    // Implement email sending logic
    console.log(`Sending alert to ${emails.join(', ')}: ${message}`);
  }

  private async sendWebhookAlert(webhook: string, message: string): Promise<void> {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, timestamp: new Date().toISOString() }),
    });
  }
}

// Configure alert rules
const alertManager = new AlertManager();

alertManager.addRule({
  name: 'high-error-rate',
  condition: (event) => event.level === 'error',
  threshold: 10,
  window: 5,
  notification: {
    slack: process.env.SLACK_WEBHOOK_URL,
    email: ['dev-team@example.com'],
  },
});

alertManager.addRule({
  name: 'payment-failures',
  condition: (event) => event.tags?.error_type === 'payment',
  threshold: 5,
  window: 10,
  notification: {
    webhook: process.env.PAYMENT_ALERT_WEBHOOK,
  },
});
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry React Integration](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Node.js Integration](https://docs.sentry.io/platforms/javascript/guides/node/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/sentry-basics/performance-monitoring/)
- [Sentry Security and PII Documentation](https://docs.sentry.io/security-legal-pii/)
- [Sentry API Documentation](https://docs.sentry.io/api/)
- [Sentry for AI Integration](https://docs.sentry.io/ai/)


## Implementation

[Add content here]


## Best Practices

[Add content here]