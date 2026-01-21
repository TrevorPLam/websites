import { describe, it, expect, vi, afterEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import * as ErrorBoundaryModule from '@/components/ErrorBoundary'

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error')
}

const GoodComponent = () => <div>Working component</div>

describe('ErrorBoundary', () => {
  afterEach(() => {
    // Reset storage so each test starts with a clean recovery counter.
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundaryModule.ErrorBoundary>
        <GoodComponent />
      </ErrorBoundaryModule.ErrorBoundary>
    )

    expect(screen.getByText('Working component')).toBeInTheDocument()
  })

  it('should render fallback UI when error occurs', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = vi.fn()

    render(
      <ErrorBoundaryModule.ErrorBoundary>
        <ThrowError />
      </ErrorBoundaryModule.ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We're sorry/)).toBeInTheDocument()

    console.error = originalError
  })

  it('should render custom fallback when provided', () => {
    const originalError = console.error
    console.error = vi.fn()

    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundaryModule.ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundaryModule.ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()

    console.error = originalError
  })

  it('limits retries to avoid infinite recovery loops', () => {
    const originalError = console.error
    console.error = vi.fn()

    render(
      <ErrorBoundaryModule.ErrorBoundary>
        <ThrowError />
      </ErrorBoundaryModule.ErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: /try again/i })

    // Retry once to simulate a persistent error and ensure we disable further attempts.
    fireEvent.click(retryButton)

    expect(screen.getByRole('button', { name: /try again/i })).toBeDisabled()

    console.error = originalError
  })

  it('navigates home without triggering a reload loop', () => {
    const originalError = console.error
    console.error = vi.fn()

    const navigateHomeSpy = vi.fn()

    render(
      <ErrorBoundaryModule.ErrorBoundary onNavigateHome={navigateHomeSpy}>
        <ThrowError />
      </ErrorBoundaryModule.ErrorBoundary>
    )

    // Provide an escape hatch that avoids a full reload loop.
    fireEvent.click(screen.getByRole('button', { name: /go to homepage/i }))

    expect(navigateHomeSpy).toHaveBeenCalledTimes(1)

    console.error = originalError
  })

  it('treats invalid stored recovery values as zero', () => {
    const originalError = console.error
    console.error = vi.fn()

    // Non-numeric values should not lock the user out of recovery.
    window.sessionStorage.setItem('error-boundary-recovery-attempts', 'not-a-number')

    render(
      <ErrorBoundaryModule.ErrorBoundary>
        <ThrowError />
      </ErrorBoundaryModule.ErrorBoundary>
    )

    expect(screen.getByRole('button', { name: /try again/i })).toBeEnabled()

    console.error = originalError
  })
})
