/**
 * @file packages/ui/src/components/ErrorBoundary.tsx
 * @summary React Error Boundary component with Sentry integration and graceful fallbacks
 * @description Production-ready error boundary following 2026 best practices
 * @security Error boundaries prevent UI crashes and enable secure error reporting
 * @requirements PROD-003, PROD-UI-001
 */

import React from 'react';

// Error context for tenant-aware error reporting
export interface ErrorContext {
  tenantId?: string;
  userId?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

// Enhanced error boundary props with Sentry integration
export interface EnhancedErrorBoundaryProps {
  // UI customization
  fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  fallbackRender?: (props: { error: Error; resetErrorBoundary: () => void; errorContext?: ErrorContext }) => React.ReactNode;

  // Error reporting
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorContext?: ErrorContext) => void;
  enableSentry?: boolean;

  // Context for multi-tenant environments
  tenantId?: string;
  userId?: string;

  // Retry behavior
  maxRetries?: number;
  retryDelay?: number;

  // Logging level
  logLevel?: 'error' | 'warn' | 'info';

  children: React.ReactNode;
}

// Internal state for retry tracking
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

// Default fallback component with WCAG 2.2 AA compliance
const DefaultFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
    >
      <div className="text-center space-y-4 max-w-md">
        {/* Error icon */}
        <div className="flex justify-center">
          <svg
            className="w-12 h-12 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Something went wrong
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
        </div>

        {/* Retry button */}
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition-colors"
          aria-label="Try again"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try again
        </button>
      </div>

      {/* Error details for development */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded text-left">
          <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-200">
            Error details (development only)
          </summary>
          <pre className="mt-2 text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

// Enhanced Error Boundary component
export class EnhancedErrorBoundary extends React.Component<
  EnhancedErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryTimeouts: Map<number, NodeJS.Timeout> = new Map();

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError, enableSentry = true, tenantId, userId, logLevel = 'error' } = this.props;

    // Create error context for multi-tenant environments
    const errorContext: ErrorContext = {
      tenantId,
      userId,
      componentStack: errorInfo.componentStack || undefined,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? (window.location.href || 'unknown') : 'SSR',
    };

    // Log error based on configured level
    const logMessage = `[${logLevel.toUpperCase()}] Component error: ${error.message}`;
    const logData = { error, errorInfo, errorContext };

    switch (logLevel) {
      case 'error':
        console.error(logMessage, logData);
        break;
      case 'warn':
        console.warn(logMessage, logData);
        break;
      case 'info':
        console.info(logMessage, logData);
        break;
    }

    // Send to Sentry if enabled
    if (enableSentry && typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues and handle missing Sentry
      import('@sentry/react').then((Sentry) => {
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
            tenant: tenantId ? { id: tenantId } : undefined,
            user: userId ? { id: userId } : undefined,
          },
          tags: {
            component: 'ErrorBoundary',
            tenant_id: tenantId || 'unknown',
            user_id: userId || 'anonymous',
          },
          extra: {
            errorContext,
            retryCount: this.state.retryCount,
          },
        });
      }).catch(() => {
        // Silently fail if Sentry is not available
        console.warn('Sentry not available for error reporting');
      });
    }

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo, errorContext);
    }
  }

  resetErrorBoundary = (): void => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const { retryCount } = this.state;

    // Clear any existing retry timeout
    const existingTimeout = this.retryTimeouts.get(retryCount);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.retryTimeouts.delete(retryCount);
    }

    // Check if we've exceeded max retries
    if (retryCount >= maxRetries) {
      console.warn(`Maximum retries (${maxRetries}) exceeded for error boundary`);
      return;
    }

    // Schedule retry with exponential backoff
    const delay = retryDelay * Math.pow(2, retryCount);
    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        retryCount: retryCount + 1,
      });
    }, delay);

    this.retryTimeouts.set(retryCount, timeout);
  };

  componentWillUnmount(): void {
    // Clean up all retry timeouts
    this.retryTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const {
      children,
      fallback: FallbackComponent = DefaultFallback,
      fallbackRender,
      tenantId,
      userId
    } = this.props;

    if (hasError && error) {
      const errorContext: ErrorContext = {
        tenantId,
        userId,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
        url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      };

      if (fallbackRender) {
        return fallbackRender({
          error,
          resetErrorBoundary: this.resetErrorBoundary,
          errorContext,
        });
      }

      return <FallbackComponent error={error} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return children;
  }
}

// Functional wrapper for easier usage
export const ErrorBoundary: React.FC<EnhancedErrorBoundaryProps> = (props) => {
  return <EnhancedErrorBoundary {...props} />;
};

// Hook for programmatic error boundary usage
export const useErrorBoundary = () => {
  return React.useCallback((error: Error) => {
    throw error;
  }, []);
};

// Specialized error boundaries for different contexts
export const RootErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary
    enableSentry={true}
    logLevel="error"
    maxRetries={1}
    fallbackRender={({ error, resetErrorBoundary }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full p-6 text-center">
          <DefaultFallback error={error} resetErrorBoundary={resetErrorBoundary} />
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

export const WidgetErrorBoundary: React.FC<{
  children: React.ReactNode;
  tenantId?: string;
  widgetName?: string;
}> = ({ children, tenantId, widgetName }) => (
  <ErrorBoundary
    tenantId={tenantId}
    enableSentry={true}
    logLevel="warn"
    maxRetries={3}
    fallbackRender={({ error, resetErrorBoundary }) => (
      <div className="p-4 border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 rounded-lg">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {widgetName ? `${widgetName} widget` : 'Widget'} temporarily unavailable
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Please try again in a moment
            </p>
          </div>
          <button
            onClick={resetErrorBoundary}
            className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
            aria-label="Retry widget"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
