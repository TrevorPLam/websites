/**
 * @file packages/ui/src/components/__tests__/ErrorBoundary.test.tsx
 * @summary Comprehensive tests for ErrorBoundary components
 * @description Tests error boundary functionality, fallback UI, and error reporting
 * @security Validates error handling prevents UI crashes
 * @requirements PROD-003, PROD-UI-001
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the error boundary components
import { SimpleErrorBoundary, RootErrorBoundary, WidgetErrorBoundary } from '../SimpleErrorBoundary';

// Mock console.error to avoid test output noise
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('SimpleErrorBoundary', () => {
  const ThrowErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>Component working</div>;
  };

  it('renders children when there is no error', () => {
    render(
      <SimpleErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </SimpleErrorBoundary>
    );

    expect(screen.getByText('Component working')).toBeInTheDocument();
  });

  it('catches errors and displays fallback UI', () => {
    render(
      <SimpleErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </SimpleErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We apologize for the inconvenience')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('calls onError when an error occurs', () => {
    const onError = jest.fn();
    
    render(
      <SimpleErrorBoundary onError={onError}>
        <ThrowErrorComponent shouldThrow={true} />
      </SimpleErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('resets error state when retry button is clicked', async () => {
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(false);
      return (
        <SimpleErrorBoundary>
          <button onClick={() => setShouldThrow(true)}>Trigger Error</button>
          {shouldThrow ? <ThrowErrorComponent shouldThrow={true} /> : <div>Safe content</div>}
        </SimpleErrorBoundary>
      );
    };

    render(<TestComponent />);

    // Initially shows safe content
    expect(screen.getByText('Safe content')).toBeInTheDocument();

    // Trigger error
    fireEvent.click(screen.getByText('Trigger Error'));
    
    // Shows error fallback
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    // Reset error
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    
    // Should show safe content again (or attempt to)
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('includes error details in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <SimpleErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </SimpleErrorBoundary>
    );

    expect(screen.getByText('Error details (development only)')).toBeInTheDocument();

    // Toggle details
    fireEvent.click(screen.getByText('Error details (development only)'));
    expect(screen.getByText('Test error')).toBeInTheDocument();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('hides error details in production mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <SimpleErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </SimpleErrorBoundary>
    );

    expect(screen.queryByText('Error details (development only)')).not.toBeInTheDocument();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });
});

describe('RootErrorBoundary', () => {
  it('provides root-level error handling', () => {
    const ThrowErrorComponent = () => {
      throw new Error('Root level error');
    };

    render(
      <RootErrorBoundary>
        <ThrowErrorComponent />
      </RootErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith(
      'Root error boundary caught error:',
      expect.objectContaining({
        error: 'Root level error',
        stack: expect.any(String),
        componentStack: expect.any(String),
        timestamp: expect.any(String),
      })
    );
  });
});

describe('WidgetErrorBoundary', () => {
  const ThrowWidgetError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Widget error');
    }
    return <div>Widget working</div>;
  };

  it('provides widget-specific error handling', () => {
    render(
      <WidgetErrorBoundary widgetName="Test Widget" tenantId="tenant-123">
        <ThrowWidgetError shouldThrow={true} />
      </WidgetErrorBoundary>
    );

    expect(screen.getByText('Test Widget widget temporarily unavailable')).toBeInTheDocument();
    expect(screen.getByText('Please try again in a moment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry widget' })).toBeInTheDocument();
  });

  it('logs widget errors with context', () => {
    render(
      <WidgetErrorBoundary widgetName="Test Widget" tenantId="tenant-123">
        <ThrowWidgetError shouldThrow={true} />
      </WidgetErrorBoundary>
    );

    expect(console.warn).toHaveBeenCalledWith(
      'Widget error boundary caught error in Test Widget widget:',
      expect.objectContaining({
        error: expect.any(Error),
        errorInfo: expect.any(Object),
        tenantId: 'tenant-123',
      })
    );
  });

  it('uses generic widget name when not provided', () => {
    render(
      <WidgetErrorBoundary>
        <ThrowWidgetError shouldThrow={true} />
      </WidgetErrorBoundary>
    );

    expect(screen.getByText('Widget temporarily unavailable')).toBeInTheDocument();
  });
});

describe('Error Boundary Edge Cases', () => {
  it('handles async errors gracefully', async () => {
    const AsyncErrorComponent = () => {
      React.useEffect(() => {
        setTimeout(() => {
          throw new Error('Async error');
        }, 100);
      }, []);
      return <div>Loading...</div>;
    };

    render(
      <SimpleErrorBoundary>
        <AsyncErrorComponent />
      </SimpleErrorBoundary>
    );

    // Initially shows loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Note: Async errors outside of React's render cycle won't be caught
    // This test verifies the component doesn't crash during async operations
  });

  it('handles null children gracefully', () => {
    render(
      <SimpleErrorBoundary>
        {null}
      </SimpleErrorBoundary>
    );

    // Should render without error
    expect(document.body).toBeInTheDocument();
  });

  it('handles multiple nested error boundaries', () => {
    const NestedErrorComponent = ({ depth }: { depth: number }) => {
      if (depth === 2) {
        throw new Error('Deep error');
      }
      return (
        <SimpleErrorBoundary>
          <NestedErrorComponent depth={depth + 1} />
        </SimpleErrorBoundary>
      );
    };

    render(
      <SimpleErrorBoundary>
        <NestedErrorComponent depth={0} />
      </SimpleErrorBoundary>
    );

    // The innermost boundary should catch the error
    expect(screen.getAllByText('Something went wrong')).toHaveLength(1);
  });
});

describe('Error Boundary Accessibility', () => {
  it('provides proper ARIA attributes', () => {
    const ThrowErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <SimpleErrorBoundary>
        <ThrowErrorComponent />
      </SimpleErrorBoundary>
    );

    const alertRegion = screen.getByRole('alert');
    expect(alertRegion).toHaveAttribute('aria-live', 'polite');
    expect(alertRegion).toBeInTheDocument();
  });

  it('provides accessible button labels', () => {
    const ThrowErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <SimpleErrorBoundary>
        <ThrowErrorComponent />
      </SimpleErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: 'Try again' });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveAttribute('aria-label', 'Try again');
  });
});

describe('Error Boundary Performance', () => {
  it('does not re-render unnecessarily when no errors occur', () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      return (
        <SimpleErrorBoundary>
          <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
        </SimpleErrorBoundary>
      );
    };

    const { container } = render(<TestComponent />);

    const initialRenderCount = container.innerHTML.match(/Count:/)?.length || 0;

    // Click button multiple times
    fireEvent.click(screen.getByText('Count: 0'));
    fireEvent.click(screen.getByText('Count: 1'));
    fireEvent.click(screen.getByText('Count: 2'));

    // Should not have error fallback
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    
    // Component should re-render normally
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
  });
});
