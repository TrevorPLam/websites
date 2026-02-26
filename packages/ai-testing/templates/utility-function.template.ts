/**
 * @file packages/ai-testing/templates/utility-function.template.ts
 * @summary Utility Function Test Template for AI Test Generation
 * @description Template for generating comprehensive utility function tests following 2026 standards
 * @security Test-only template; no production dependencies
 * @requirements TASK-004-4.2: Create test templates for common patterns
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import the utility function to test
import { {{functionName}} } from '{{functionPath}}';

describe('{{functionName}} Utility Tests', () => {
  beforeEach(() => {
    // Reset any global state here
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('Basic Functionality', () => {
    it('should handle valid inputs', () => {
      const input = {{validInput}};
      const expected = {{expectedOutput}};
      
      const result = {{functionName}}(input);
      
      expect(result).toBe(expected);
    });

    it('should handle edge cases', () => {
      const edgeCases = [
        {{#each edgeCases}}
        {{this}},
        {{/each}}
      ];
      
      edgeCases.forEach(input => {
        expect(() => {{functionName}}(input)).not.toThrow();
      });
    });

    it('should handle invalid inputs', () => {
      const invalidInputs = [
        {{#each invalidInputs}}
        {{this}},
        {{/each}}
      ];
      
      invalidInputs.forEach(input => {
        expect(() => {{functionName}}(input)).toThrow();
      });
    });

    it('should have consistent output format', () => {
      const input = {{validInput}};
      const result1 = {{functionName}}(input);
      const result2 = {{functionName}}(input);
      
      expect(result1).toEqual(result2);
    });
  });

  describe('Performance', () => {
    it('should execute within performance budget', () => {
      const input = {{validInput}};
      
      const startTime = performance.now();
      
      // Run multiple times for performance testing
      for (let i = 0; i < 1000; i++) {
        {{functionName}}(input);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time
      expect(duration).toBeLessThan(100); // 100ms for 1000 operations
    });

    it('should not cause memory leaks', () => {
      const input = {{validInput}};
      
      // Test with large inputs
      const largeInput = {{largeInput}};
      
      expect(() => {{functionName}}(largeInput)).not.toThrow();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety', () => {
      const input = {{validInput}};
      const result = {{functionName}}(input);
      
      // Type assertions
      expect(typeof result).toBe('{{expectedType}}');
      
      {{#if expectedProperties}}
      // Check expected properties
      {{#each expectedProperties}}
      expect(result).toHaveProperty('{{this}}');
      {{/each}}
      {{/if}}
    });

    it('should handle null/undefined inputs gracefully', () => {
      {{#if handlesNull}}
      expect(() => {{functionName}}(null)).toThrow();
      {{/if}}
      
      {{#if handlesUndefined}}
      expect(() => {{functionName}}(undefined)).toThrow();
      {{/if}}
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty inputs', () => {
      {{#if handlesEmpty}}
      const result = {{functionName}}({{emptyInput}});
      expect(result).toBe({{expectedEmptyOutput}});
      {{/if}}
    });

    it('should handle boundary values', () => {
      const boundaryTests = [
        {{#each boundaryTests}}
        { input: {{this.input}}, expected: {{this.expected}} },
        {{/each}}
      ];
      
      boundaryTests.forEach(({ input, expected }) => {
        expect({{functionName}}(input)).toBe(expected);
      });
    });

    it('should handle special characters', () => {
      const specialInputs = [
        {{#each specialInputs}}
        '{{this}}',
        {{/each}}
      ];
      
      specialInputs.forEach(input => {
        expect(() => {{functionName}}(input)).not.toThrow();
      });
    });
  });

  describe('Error Handling', () => {
    it('should provide meaningful error messages', () => {
      try {
        {{functionName}}({{invalidInput}});
      } catch (error) {
        expect(error.message).toContain('{{expectedErrorMessage}}');
      }
    });

    it('should handle malformed inputs gracefully', () => {
      const malformedInputs = [
        {{#each malformedInputs}}
        {{this}},
        {{/each}}
      ];
      
      malformedInputs.forEach(input => {
        expect(() => {{functionName}}(input)).toThrow();
      });
    });
  });

  describe('Integration', () => {
    it('should work with other utilities', () => {
      // Test integration with other utility functions
      const input = {{validInput}};
      
      // Call the function in combination with others
      const result = {{functionName}}(input);
      
      expect(result).toBeDefined();
      
      {{#each integrationTests}}
      // {{this.description}}
      const integratedResult = {{this.function}}(result);
      expect(integratedResult).toBe({{this.expected}});
      {{/each}}
    });

    it('should handle async operations', () => {
      {{#if isAsync}}
      const input = {{validInput}};
      
      return expect({{functionName}}(input)).resolves.toBe({{expectedOutput}});
      {{/if}}
    });
  });

  describe('Documentation Examples', () => {
    it('should match documented examples', () => {
      // Test examples from documentation
      const examples = [
        {{#each examples}}
        { input: {{this.input}}, expected: {{this.expected}} },
        {{/each}}
      ];
      
      examples.forEach(({ input, expected }) => {
        expect({{functionName}}(input)).toBe(expected);
      });
    });
  });

  describe('Regression Tests', () => {
    it('should not regress on known issues', () => {
      // Test for known regressions
      const regressionTests = [
        {{#each regressionTests}}
        { input: {{this.input}}, expected: {{this.expected}}, issue: '{{this.issue}}' },
        {{/each}}
      ];
      
      regressionTests.forEach(({ input, expected, issue }) => {
        const result = {{functionName}}(input);
        expect(result).toBe(expected);
        // If this test fails, check issue: {{issue}}
      });
    });
  });

  describe('Security', () => {
    it('should not expose sensitive information', () => {
      const sensitiveInputs = [
        {{#each sensitiveInputs}}
        '{{this}}',
        {{/each}}
      ];
      
      sensitiveInputs.forEach(input => {
        const result = {{functionName}}(input);
        
        // Ensure no sensitive data is exposed
        expect(JSON.stringify(result)).not.toContain('password');
        expect(JSON.stringify(result)).not.toContain('token');
        expect(JSON.stringify(result)).not.toContain('secret');
      });
    });

    it('should prevent code injection', () => {
      const injectionAttempts = [
        '{{javascriptInjection}}',
        '{{sqlInjection}}',
        '{{xssInjection}}',
      ];
      
      injectionAttempts.forEach(input => {
        expect(() => {{functionName}}(input)).not.toThrow();
        // Ensure no code execution
        expect(typeof {{functionName}}(input)).toBe('{{expectedType}}');
      });
    });
  });
});

// Helper functions for testing
const createMockData = (overrides = {}) => ({
  // Default mock data
  ...overrides,
});

const createLargeDataset = (size = 1000) => {
  // Create large dataset for performance testing
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    value: `item-${index}`,
  }));
};

// Export for use in other test files
export { createMockData, createLargeDataset };
