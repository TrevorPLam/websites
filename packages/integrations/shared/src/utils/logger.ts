/**
 * @file packages/integrations/shared/src/utils/logger.ts
 * Task: Unified logging and monitoring across all integrations
 *
 * Purpose: Provides secure, structured logging for all integration packages.
 * Implements 2026 best practices for log redaction, structured logging,
 * and monitoring integration.
 *
 * Created: 2026-02-21
 * Standards: Secure logging with automatic redaction, structured format, monitoring integration
 */

// Simple console-based logger to avoid monorepo import issues
// TODO: Reintegrate with @repo/infra logging when project references are fixed

export interface LogContext {
  integrationId: string;
  operation?: string;
  requestId?: string;
  userId?: string;
  tenantId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metrics?: {
    duration?: number;
    statusCode?: number;
    retryCount?: number;
  };
}

/**
 * Secure logger that automatically redacts sensitive information
 * Following 2026 security best practices for log sanitization
 */
export class IntegrationLogger {
  private static readonly SENSITIVE_KEYS = [
    'key',
    'secret',
    'token',
    'password',
    'auth',
    'credential',
    'apikey',
    'api_key',
    'private',
    'confidential',
    'ssn',
    'creditcard',
    'card',
    'bank',
    'account',
    'routing',
  ];

  private static readonly SENSITIVE_PATTERNS = [
    /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/i,
    /Basic\s+[A-Za-z0-9\-._~+\/]+=*/i,
    /X-[A-Za-z\-]*-Api-Key:\s*[A-Za-z0-9\-._~+\/]+=*/i,
    /[A-Za-z0-9]{32,}/, // Long alphanumeric strings (likely keys/tokens)
    /\b(?:\d{4}[-\s]?){3}\d{4}\b/, // Credit card numbers
    /\b\d{3}-?\d{2}-?\d{4}\b/, // SSN pattern
  ];

  constructor(private readonly integrationId: string) {}

  /**
   * Redact sensitive information from log data
   */
  private static redactSensitiveData(data: unknown): unknown {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      let redacted = data;

      // Apply sensitive patterns
      for (const pattern of IntegrationLogger.SENSITIVE_PATTERNS) {
        redacted = redacted.replace(pattern, '[REDACTED]');
      }

      return redacted;
    }

    if (Array.isArray(data)) {
      return data.map((item) => IntegrationLogger.redactSensitiveData(item));
    }

    if (typeof data === 'object') {
      const redacted: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();

        // Check if key contains sensitive terms
        const isSensitive = IntegrationLogger.SENSITIVE_KEYS.some((sensitiveKey) =>
          lowerKey.includes(sensitiveKey)
        );

        if (isSensitive) {
          redacted[key] = '[REDACTED]';
        } else {
          redacted[key] = IntegrationLogger.redactSensitiveData(value);
        }
      }

      return redacted;
    }

    return data;
  }

  /**
   * Create a structured log entry
   */
  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context: Partial<LogContext> = {},
    error?: Error,
    metrics?: LogEntry['metrics']
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        integrationId: this.integrationId,
        ...context,
      } as LogContext,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
      metrics,
    };
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: Partial<LogContext>, data?: unknown): void {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      const redactedData = IntegrationLogger.redactSensitiveData(data);
      const entry = this.createLogEntry('debug', message, { ...context, data: redactedData });
      console.log(`[DEBUG][${this.integrationId}]`, entry);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: Partial<LogContext>, data?: unknown): void {
    const redactedData = IntegrationLogger.redactSensitiveData(data);

    const logObject: any = {
      integration: this.integrationId,
    };

    if (context) {
      Object.assign(logObject, context);
    }

    if (redactedData) {
      logObject.data = redactedData;
    }

    console.info(`[INFO][${this.integrationId}] ${message}`, logObject);
  }

  /**
   * Log warnings
   */
  warn(message: string, context?: Partial<LogContext>, data?: unknown): void {
    const redactedData = IntegrationLogger.redactSensitiveData(data);

    const logObject: any = {
      integration: this.integrationId,
    };

    if (context) {
      Object.assign(logObject, context);
    }

    if (redactedData) {
      logObject.data = redactedData;
    }

    console.warn(`[WARN][${this.integrationId}] ${message}`, logObject);
  }

  /**
   * Log errors
   */
  error(message: string, error?: Error, context?: Partial<LogContext>, data?: unknown): void {
    const redactedData = IntegrationLogger.redactSensitiveData(data);

    const logObject: any = {
      integration: this.integrationId,
    };

    if (context) {
      Object.assign(logObject, context);
    }

    if (redactedData) {
      logObject.data = redactedData;
    }

    if (error) {
      logObject.error = {
        name: error.name,
        message: error.message,
      };
      if (error.stack) {
        logObject.error.stack = error.stack;
      }
    }

    console.error(`[ERROR][${this.integrationId}] ${message}`, logObject);
  }

  /**
   * Log operation start with timing
   */
  startOperation(operationName: string, context?: Partial<LogContext>): () => void {
    const startTime = Date.now();
    const operationId = `${this.integrationId}-${operationName}-${startTime}`;

    this.info(`Starting operation: ${operationName}`, {
      ...context,
      operationId,
      operationName,
    });

    return () => {
      const duration = Date.now() - startTime;
      this.info(`Completed operation: ${operationName}`, {
        ...context,
        operationId,
        operationName,
        duration,
      });
    };
  }

  /**
   * Log API request/response with security considerations
   */
  logApiCall(
    method: string,
    url: string,
    statusCode?: number,
    duration?: number,
    context?: Partial<LogContext>,
    requestData?: unknown,
    responseData?: unknown
  ): void {
    const level = statusCode && statusCode >= 400 ? 'error' : 'info';
    const message = `${method} ${url} ${statusCode ? `(${statusCode})` : ''}`;

    // Never log request/response bodies in production
    const logData =
      typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
        ? {
            request: IntegrationLogger.redactSensitiveData(requestData),
            response: IntegrationLogger.redactSensitiveData(responseData),
          }
        : undefined;

    const logObject: any = {
      method,
      url: this.sanitizeUrl(url),
      statusCode,
      duration,
    };

    if (context) {
      Object.assign(logObject, context);
    }

    this[level](message, logObject, logData);
  }

  /**
   * Sanitize URL to remove sensitive query parameters
   */
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const sensitiveParams = ['key', 'token', 'secret', 'auth', 'credential'];

      for (const param of sensitiveParams) {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '[REDACTED]');
        }
      }

      return urlObj.toString();
    } catch {
      // If URL parsing fails, return a redacted version
      return url.replace(/[?&][^=]*=[^&]*/g, (match) => {
        if (match.includes('key') || match.includes('token') || match.includes('secret')) {
          return match.split('=')[0] + '=[REDACTED]';
        }
        return match;
      });
    }
  }
}

/**
 * Logger factory for creating integration-specific loggers
 */
export function createLogger(integrationId: string): IntegrationLogger {
  return new IntegrationLogger(integrationId);
}

/**
 * Global integration metrics collector
 */
export class IntegrationMetrics {
  private static metrics: Map<
    string,
    {
      requestCount: number;
      successCount: number;
      errorCount: number;
      totalResponseTime: number;
      lastRequest: Date;
    }
  > = new Map();

  static recordRequest(integrationId: string, success: boolean, responseTime: number): void {
    const current = this.metrics.get(integrationId) || {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      lastRequest: new Date(),
    };

    current.requestCount++;
    current.totalResponseTime += responseTime;
    current.lastRequest = new Date();

    if (success) {
      current.successCount++;
    } else {
      current.errorCount++;
    }

    this.metrics.set(integrationId, current);
  }

  static getMetrics(integrationId?: string): Record<string, any> {
    if (integrationId) {
      const metrics = this.metrics.get(integrationId);
      return metrics ? this.formatMetrics(integrationId, metrics) : {};
    }

    const result: Record<string, any> = {};
    for (const [id, metrics] of this.metrics.entries()) {
      result[id] = this.formatMetrics(id, metrics);
    }
    return result;
  }

  private static formatMetrics(integrationId: string, metrics: any): any {
    const successRate = metrics.requestCount > 0 ? metrics.successCount / metrics.requestCount : 0;
    const errorRate = metrics.requestCount > 0 ? metrics.errorCount / metrics.requestCount : 0;
    const averageResponseTime =
      metrics.requestCount > 0 ? metrics.totalResponseTime / metrics.requestCount : 0;

    return {
      integrationId,
      requestCount: metrics.requestCount,
      successRate: Math.round(successRate * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      lastRequest: metrics.lastRequest.toISOString(),
    };
  }

  static reset(): void {
    this.metrics.clear();
  }
}
