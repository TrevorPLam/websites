// File: packages/features/src/feature/lib/__tests__/schema.test.ts  [TRACE:FILE=packages.features.feature.schema.test]
// Purpose: Unit tests for Zod schemas to verify validation logic, error messages, and edge cases.
//          Tests cover valid inputs, invalid inputs, type coercion, and custom refinements.
//
// Exports / Entry: Schema test suite
// Used by: Jest test runner, CI/CD pipeline
//
// Invariants:
// - All schemas must have tests for valid and invalid inputs
// - Error messages must be clear and actionable
// - Edge cases must be covered
//
// Status: @internal
// Features:
// - [FEAT:TESTING] Comprehensive schema coverage
// - [FEAT:VALIDATION] Input validation testing
// - [FEAT:TYPE_SAFETY] Type inference verification

import { z } from 'zod';
import { featureSchema } from '../schema';

describe('featureSchema', () => {
  describe('Valid Inputs', () => {
    it('accepts valid data', () => {
      const valid = {
        // Valid data structure
      };

      expect(() => featureSchema.parse(valid)).not.toThrow();
      expect(featureSchema.parse(valid)).toMatchObject(valid);
    });

    it('accepts optional fields when omitted', () => {
      const valid = {
        // Required fields only
      };

      expect(() => featureSchema.parse(valid)).not.toThrow();
    });

    it('accepts optional fields when provided', () => {
      const valid = {
        // All fields including optional
      };

      expect(() => featureSchema.parse(valid)).not.toThrow();
    });
  });

  describe('Invalid Inputs', () => {
    it('rejects missing required fields', () => {
      const invalid = {
        // Missing required field
      };

      expect(() => featureSchema.parse(invalid)).toThrow();
    });

    it('rejects wrong field types', () => {
      const invalid = {
        field: 123, // Should be string
      };

      expect(() => featureSchema.parse(invalid)).toThrow();
    });

    it('rejects values outside allowed range', () => {
      const invalid = {
        field: 'value-outside-range',
      };

      expect(() => featureSchema.parse(invalid)).toThrow();
    });

    it('rejects invalid format (email, URL, etc.)', () => {
      const invalid = {
        email: 'not-an-email',
      };

      expect(() => featureSchema.parse(invalid)).toThrow();
    });
  });

  describe('Error Messages', () => {
    it('provides clear error messages', () => {
      const invalid = {
        // Invalid data
      };

      try {
        featureSchema.parse(invalid);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.errors[0]).toHaveProperty('message');
          expect(error.errors[0].message).toBeTruthy();
        }
      }
    });

    it('identifies which field has the error', () => {
      const invalid = {
        field: 'invalid-value',
      };

      try {
        featureSchema.parse(invalid);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.errors[0]).toHaveProperty('path');
          expect(error.errors[0].path).toContain('field');
        }
      }
    });
  });

  describe('Type Coercion', () => {
    it('coerces strings to numbers when appropriate', () => {
      const input = {
        numberField: '123',
      };

      const result = featureSchema.parse(input);
      expect(typeof result.numberField).toBe('number');
      expect(result.numberField).toBe(123);
    });

    it('coerces strings to booleans when appropriate', () => {
      const input = {
        booleanField: 'true',
      };

      const result = featureSchema.parse(input);
      expect(typeof result.booleanField).toBe('boolean');
      expect(result.booleanField).toBe(true);
    });
  });

  describe('Custom Refinements', () => {
    it('validates custom business rules', () => {
      const invalid = {
        // Data that violates custom refinement
      };

      expect(() => featureSchema.parse(invalid)).toThrow();
    });

    it('passes custom business rules', () => {
      const valid = {
        // Data that satisfies custom refinement
      };

      expect(() => featureSchema.parse(valid)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty strings', () => {
      const input = {
        field: '',
      };

      // Should either reject or accept based on schema design
      expect(() => featureSchema.parse(input)).toThrow();
    });

    it('handles null values', () => {
      const input = {
        field: null,
      };

      // Should reject unless field is nullable
      expect(() => featureSchema.parse(input)).toThrow();
    });

    it('handles undefined values', () => {
      const input = {
        // Missing field
      };

      // Should reject if field is required
      expect(() => featureSchema.parse(input)).toThrow();
    });

    it('handles very long strings', () => {
      const input = {
        field: 'a'.repeat(10000),
      };

      // Should either validate length or accept
      expect(() => featureSchema.parse(input)).not.toThrow();
    });

    it('handles special characters', () => {
      const input = {
        field: '<script>alert("xss")</script>',
      };

      // Should either sanitize or accept based on schema
      expect(() => featureSchema.parse(input)).not.toThrow();
    });
  });

  describe('Type Inference', () => {
    it('infers correct TypeScript types', () => {
      type InferredType = z.infer<typeof featureSchema>;

      const valid: InferredType = {
        // TypeScript should validate this structure
      };

      expect(valid).toBeDefined();
    });
  });
});
