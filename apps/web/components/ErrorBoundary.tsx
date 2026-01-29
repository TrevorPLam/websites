'use client'

import React, { Component, ReactNode } from 'react'
import { logError } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onNavigateHome?: () => void
}

interface State {
  hasError: boolean
  error?: Error
  recoveryAttempts: number
}

const RECOVERY_STORAGE_KEY = 'error-boundary-recovery-attempts'
const MAX_RECOVERY_ATTEMPTS = 1

const readRecoveryAttempts = (): number => {
  if (typeof window === 'undefined') {
    return 0
  }

  try {
    const rawAttempts = window.sessionStorage.getItem(RECOVERY_STORAGE_KEY)
    const parsedAttempts = Number(rawAttempts)

    // Treat missing/invalid values as zero to avoid crashing the fallback UI.
    return Number.isFinite(parsedAttempts) && parsedAttempts >= 0 ? parsedAttempts : 0
  } catch {
    // Storage can be unavailable (private mode / blocked access), so fail safely.
    return 0
  }
}

const writeRecoveryAttempts = (attempts: number): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(RECOVERY_STORAGE_KEY, String(attempts))
  } catch {
    // If storage fails, we still allow the user to retry without persisting state.
  }
}

export const navigateHome = (): void => {
  // Use a direct location change so users can escape an error loop safely.
  if (typeof window !== 'undefined') {
    window.location.assign('/')
  }
}

/**
 * Error Boundary component to catch and handle React errors
 * Prevents the entire app from crashing with a retry-limited recovery flow
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, recoveryAttempts: readRecoveryAttempts() }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, recoveryAttempts: readRecoveryAttempts() }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to your error reporting service
    logError('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    })
  }

  handleRetry = () => {
    // Limit retries to avoid infinite loops when the underlying error persists.
    if (this.state.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
      return
    }

    const nextAttempts = this.state.recoveryAttempts + 1
    writeRecoveryAttempts(nextAttempts)

    this.setState({ hasError: false, error: undefined, recoveryAttempts: nextAttempts })
  }

  handleGoHome = () => {
    // Safe navigation gives users an escape hatch without triggering reload loops.
    const navigate = this.props.onNavigateHome ?? navigateHome
    navigate()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      const recoveryDisabled = this.state.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={this.handleRetry}
                disabled={recoveryDisabled}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Go to homepage
              </button>
            </div>
            {recoveryDisabled ? (
              <p className="mt-4 text-sm text-gray-500">
                Recovery attempts are exhausted. Please contact support if this keeps happening.
              </p>
            ) : null}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
