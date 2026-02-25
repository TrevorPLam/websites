/**
 * @file packages/ui/src/components/SimpleErrorBoundary.tsx
 * @summary Simple React Error Boundary component without external dependencies
 * @description Production-ready error boundary following 2026 best practices
 * @security Error boundaries prevent UI crashes and enable secure error reporting
 * @requirements PROD-003, PROD-UI-001
 */

import React from 'react';

// Simple error boundary props
export interface SimpleErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  tenantId?: string;
  userId?: string;
}

// Simple error boundary state
interface SimpleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Default fallback component
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
            We apologize for the inconvenience. Please try again or contact support if the problem persists.
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

// Simple Error Boundary component
export class SimpleErrorBoundary extends React.Component<
  SimpleErrorBoundaryProps,
  SimpleErrorBoundaryState
> {
  constructor(props: SimpleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SimpleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError, tenantId, userId } = this.props;

    // Log error with context
    console.error('Error caught by boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      tenantId,
      userId,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Try to report to Sentry if available (optional)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
          tenant: tenantId ? { id: tenantId } : undefined,
          user: userId ? { id: userId } : undefined,
        },
        tags: {
          component: 'SimpleErrorBoundary',
          tenant_id: tenantId || 'unknown',
          user_id: userId || 'anonymous',
        },
      });
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback: FallbackComponent = DefaultFallback } = this.props;

    if (hasError && error) {
      return <FallbackComponent error={error} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return children;
  }
}

// Functional wrapper for easier usage
export const ErrorBoundary: React.FC<SimpleErrorBoundaryProps> = (props) => {
  return <SimpleErrorBoundary {...props} />;
};

// Specialized error boundaries
export const RootErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error('Root error boundary caught error:', { error, errorInfo });
    }}
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
    onError={(error, errorInfo) => {
      console.warn(`Widget error boundary caught error in ${widgetName || 'widget'}:`, { 
        error, 
        errorInfo, 
        tenantId 
      });
    }}
    fallback={({ error, resetErrorBoundary }) => (
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

export default SimpleErrorBoundary;
