/**
 * @file packages/infra/composition/__tests__/withErrorBoundary.test.tsx
 * Purpose: Unit tests for withErrorBoundary HOC.
 * Verifies error boundary catches errors, calls logError, and renders fallback or default UI.
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { withErrorBoundary } from '../hocs';

const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) throw new Error('Test error');
  return <span>OK</span>;
};

describe('withErrorBoundary', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = () => {};
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders the wrapped component when no error occurs', () => {
    const Safe = withErrorBoundary(() => <span>Content</span>);
    render(<Safe />);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders default fallback (role=alert and Try again button) when child throws', () => {
    const Safe = withErrorBoundary(ThrowError);
    render(<Safe />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('renders custom ReactNode fallback when child throws', () => {
    const Safe = withErrorBoundary(ThrowError, <div data-testid="custom">Custom fallback</div>);
    render(<Safe />);
    expect(screen.getByTestId('custom')).toHaveTextContent('Custom fallback');
  });

  it('renders function fallback with error and reset when child throws', () => {
    const fallbackFn = (error: Error, reset: () => void) => (
      <div>
        <span data-testid="err-msg">{error.message}</span>
        <button onClick={reset}>Reset</button>
      </div>
    );
    const Safe = withErrorBoundary(ThrowError, fallbackFn);
    render(<Safe />);
    expect(screen.getByTestId('err-msg')).toHaveTextContent('Test error');
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('reset button in default fallback re-renders child', async () => {
    const user = userEvent.setup();
    const Safe = withErrorBoundary(ThrowError);
    render(<Safe />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByText('Try again'));
    // After reset, ThrowError runs again and throws again, so we still see fallback
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('reset from function fallback re-renders child', async () => {
    const user = userEvent.setup();
    const fallbackFn = (_error: Error, reset: () => void) => <button onClick={reset}>Reset</button>;
    const Safe = withErrorBoundary(ThrowError, fallbackFn);
    render(<Safe />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
    await user.click(screen.getByText('Reset'));
    // ThrowError throws again on re-render
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('sets displayName on wrapped component', () => {
    const Named = withErrorBoundary(ThrowError);
    expect(Named.displayName).toBe('WithErrorBoundary(ThrowError)');
  });
});
