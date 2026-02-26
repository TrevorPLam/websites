/**
 * @file packages/ai-testing/templates/component.template.ts
 * @summary React Component Test Template for AI Test Generation
 * @description Template for generating comprehensive React component tests following 2026 standards
 * @security Test-only template; no production dependencies
 * @requirements TASK-004-4.2: Create test templates for common patterns
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { toHaveNoViolations } from '@chialab/vitest-axe';
import userEvent from '@testing-library/user-event';

// Import the component to test
import { {{componentName}} } from '{{componentPath}}';

// Extend Vitest with accessibility matcher
expect.extend({ toHaveNoViolations } as any);

describe('{{componentName}} Component Tests', () => {
  const user = userEvent.setup();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any global state here
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<{{componentName}} {{props}} />);
      // Basic rendering test
    });

    it('should render with default props', () => {
      render(<{{componentName}} />);
      // Test default prop behavior
    });

    it('should be accessible', async () => {
      const { container } = render(<{{componentName}} {{props}} />);
      const results = await toHaveNoViolations(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('User Interactions', () => {
    it('should handle user interactions correctly', async () => {
      render(<{{componentName}} {{props}} />);
      
      // Test user interactions
      {{#each interactions}}
      await act(async () => {
        await {{this.action}};
      });
      
      // Assert expected behavior
      {{this.assertion}}
      {{/each}}
    });

    it('should handle edge cases', async () => {
      render(<{{componentName}} {{props}} />);
      
      // Test edge cases
      {{#each edgeCases}}
      await act(async () => {
        await {{this.action}};
      });
      
      expect({{this.expectation}});
      {{/each}}
    });
  });

  describe('Props', () => {
    it('should handle prop changes correctly', async () => {
      const { rerender } = render(<{{componentName}} {{initialProps}} />);
      
      // Test prop updates
      {{#each propTests}}
      await act(async () => {
        rerender(<{{componentName}} {{this.props}} />);
      });
      
      expect({{this.expectation}});
      {{/each}}
    });

    it('should validate prop types', () => {
      // Test prop validation
      {{#each validationTests}}
      expect(() => {
        render(<{{componentName}} {{this.invalidProps}} />);
      }).toThrow('{{this.errorMessage}}');
      {{/each}}
    });
  });

  describe('State Management', () => {
    it('should manage state correctly', async () => {
      render(<{{componentName}} {{props}} />);
      
      // Test state changes
      {{#each stateTests}}
      await act(async () => {
        await {{this.action}};
      });
      
      expect({{this.expectation}});
      {{/each}}
    });

    it('should handle async state updates', async () => {
      render(<{{componentName}} {{props}} />);
      
      // Test async state
      {{#each asyncStateTests}}
      await waitFor(() => {
        expect({{this.expectation}});
      });
      {{/each}}
    });
  });

  describe('Integration', () => {
    it('should integrate with parent components', () => {
      // Test parent-child integration
      const ParentComponent = () => (
        <div>
          <{{componentName}} {{props}} />
        </div>
      );
      
      render(<ParentComponent />);
      // Assert integration behavior
    });

    it('should handle context changes', async () => {
      // Test context integration if applicable
      {{#if useContext}}
      const TestProvider = ({ children }) => (
        <TestContext.Provider value={{{mockContext}}}>
          {children}
        </TestContext.Provider>
      );
      
      render(
        <TestProvider>
          <{{componentName}} {{props}} />
        </TestProvider>
      );
      
      // Assert context behavior
      {{/if}}
    });
  });

  describe('Performance', () => {
    it('should render within performance budget', () => {
      const startTime = performance.now();
      
      render(<{{componentName}} {{props}} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should not cause unnecessary re-renders', () => {
      const { rerender } = render(<{{componentName}} {{props}} />);
      
      const startTime = performance.now();
      rerender(<{{componentName}} {{props}} />);
      const endTime = performance.now();
      
      const reRenderTime = endTime - startTime;
      
      // Re-render should be fast
      expect(reRenderTime).toBeLessThan(50);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      // Mock error scenario
      vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<{{componentName}} {{errorProps}} />);
      
      // Assert error handling
      {{#each errorTests}}
      await waitFor(() => {
        expect({{this.expectation}});
      });
      {{/each}}
      
      vi.restoreAllMocks();
    });

    it('should provide fallback UI', () => {
      // Test error boundaries or fallbacks
      render(<{{componentName}} {{fallbackProps}} />);
      
      // Assert fallback behavior
      {{#each fallbackTests}}
      expect({{this.expectation}});
      {{/each}}
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<{{componentName}} {{props}} />);
      
      {{#each a11yTests}}
      expect(screen.getByRole('{{this.role}}')).toHaveAttribute('{{this.attribute}}', '{{this.value}}');
      {{/each}}
    });

    it('should support keyboard navigation', async () => {
      render(<{{componentName}} {{props}} />);
      
      {{#each keyboardTests}}
      await user.tab();
      expect({{this.expectation}});
      {{/each}}
    });

    it('should have proper focus management', async () => {
      render(<{{componentName}} {{props}} />);
      
      {{#each focusTests}}
      await act(async () => {
        await {{this.action}};
      });
      
      expect({{this.expectation}});
      {{/each}}
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
      
      render(<{{componentName}} {{props}} />);
      
      // Assert mobile behavior
      {{#each mobileTests}}
      expect({{this.expectation}});
      {{/each}}
    });

    it('should render correctly on desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      });
      
      render(<{{componentName}} {{props}} />);
      
      // Assert desktop behavior
      {{#each desktopTests}}
      expect({{this.expectation}});
      {{/each}}
    });
  });
});

// Helper functions for testing
const createMockProps = (overrides = {}) => ({
  // Default mock props
  ...overrides,
});

const createMockContext = () => ({
  // Mock context values
});

// Export for use in other test files
export { createMockProps, createMockContext };
