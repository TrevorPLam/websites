/**
 * @file packages/ui/src/components/FallbackUI.tsx
 * @summary Graceful fallback UI components for error boundaries and loading states
 * @description WCAG 2.2 AA compliant fallback components with retry mechanisms
 * @security Fallback UIs prevent broken interfaces and maintain user experience
 * @requirements PROD-003, WCAG-2.2-AA
 */

import React from 'react';
import { Button } from './Button';

// Base fallback props
export interface BaseFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
  retryText?: string;
  className?: string;
}

// Loading fallback props
export interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Network error fallback props
export interface NetworkErrorFallbackProps extends BaseFallbackProps {
  onRetry?: () => void;
  isRetrying?: boolean;
}

// Form error fallback props
export interface FormErrorFallbackProps extends BaseFallbackProps {
  fieldName?: string;
  onDismiss?: () => void;
}

// Base loading spinner component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Generic error fallback component
export const ErrorFallback: React.FC<BaseFallbackProps> = ({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  message = 'We apologize for the inconvenience. Please try again or contact support if the problem persists.',
  showRetry = true,
  retryText = 'Try again',
  className = '',
}) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-6 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 ${className}`}
    >
      {/* Error icon */}
      <div className="flex justify-center mb-4">
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

      {/* Error content */}
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
          {title}
        </h2>
        <p className="text-sm text-red-700 dark:text-red-300">
          {message}
        </p>

        {/* Retry button */}
        {showRetry && resetErrorBoundary && (
          <Button
            onClick={resetErrorBoundary}
            variant="outline"
            size="small"
            className="mt-4"
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
            {retryText}
          </Button>
        )}
      </div>

      {/* Error details for development */}
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded text-left w-full">
          <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-200">
            Error details (development only)
          </summary>
          <pre className="mt-2 text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap overflow-auto max-h-32">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

// Loading fallback component
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size={size} />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

// Network error fallback component
export const NetworkErrorFallback: React.FC<NetworkErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  onRetry,
  isRetrying = false,
  title = 'Connection error',
  message = 'Unable to connect to our services. Please check your internet connection and try again.',
  retryText = 'Retry',
  className = '',
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-6 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 ${className}`}
    >
      {/* Network error icon */}
      <div className="flex justify-center mb-4">
        <svg
          className="w-12 h-12 text-orange-500 dark:text-orange-400"
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

      {/* Error content */}
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
          {title}
        </h2>
        <p className="text-sm text-orange-700 dark:text-orange-300">
          {message}
        </p>

        {/* Retry button */}
        <Button
          onClick={handleRetry}
          disabled={isRetrying}
          variant="outline"
          size="small"
          className="mt-4"
        >
          {isRetrying ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Retrying...</span>
            </>
          ) : (
            <>
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
              {retryText}
            </>
          )}
        </Button>
      </div>

      {/* Additional help */}
      <div className="mt-4 text-xs text-orange-600 dark:text-orange-400 text-center">
        <p>If the problem persists, contact our support team.</p>
      </div>
    </div>
  );
};

// Form error fallback component
export const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  onDismiss,
  fieldName,
  title = fieldName ? `${fieldName} error` : 'Form error',
  message = 'There was a problem with this field. Please check your input and try again.',
  showRetry = true,
  className = '',
}) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 ${className}`}
    >
      <div className="flex items-start space-x-3">
        {/* Warning icon */}
        <svg
          className="w-5 h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5"
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

        {/* Error content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
            {title}
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center space-x-2 mt-2">
            {showRetry && resetErrorBoundary && (
              <Button
                onClick={resetErrorBoundary}
                variant="ghost"
                size="small"
                className="text-xs h-6 px-2"
              >
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button
                onClick={onDismiss}
                variant="ghost"
                size="small"
                className="text-xs h-6 px-2"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error details for development */}
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-xs">
          <summary className="cursor-pointer font-medium text-yellow-800 dark:text-yellow-200">
            Error details
          </summary>
          <pre className="mt-1 text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
};

// Widget-specific fallback component
export const WidgetFallback: React.FC<{
  widgetName: string;
  error?: Error;
  resetErrorBoundary?: () => void;
  compact?: boolean;
}> = ({ widgetName, error, resetErrorBoundary, compact = false }) => {
  if (compact) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="p-3 border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {widgetName} temporarily unavailable
          </span>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="ml-auto text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              aria-label={`Retry ${widgetName}`}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-6 border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 rounded-lg"
    >
      <LoadingSpinner size="md" />
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        {widgetName} is temporarily unavailable
      </p>
      {resetErrorBoundary && (
        <Button
          onClick={resetErrorBoundary}
          variant="ghost"
          size="small"
          className="mt-3"
        >
          Try again
        </Button>
      )}
    </div>
  );
};

// Page-level fallback component
export const PageFallback: React.FC<{
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
}> = ({ error, resetErrorBoundary, title, message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6">
        <ErrorFallback
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          title={title}
          message={message}
          className="w-full"
        />
      </div>
    </div>
  );
};

// Minimal inline fallback for inline components
export const InlineFallback: React.FC<{
  message?: string;
  onRetry?: () => void;
  size?: 'sm' | 'md';
}> = ({ message = 'Failed to load', onRetry, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-3',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`inline-flex items-center space-x-2 border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 rounded ${sizeClasses[size]}`}
    >
      <svg
        className="w-3 h-3 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span className="text-gray-600 dark:text-gray-400">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          aria-label="Retry"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
