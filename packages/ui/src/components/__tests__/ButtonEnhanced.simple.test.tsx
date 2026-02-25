/**
 * @file packages/ui/src/components/__tests__/ButtonEnhanced.simple.test.tsx
 * @summary Simplified test suite for enhanced Button component core functionality.
 * @description Tests basic button accessibility and functionality without JSX dependencies.
 * @security No security concerns - test file for UI component.
 * @adr none
 * @requirements WCAG-2.2, DOMAIN-3-1
 */

/**
 * Enhanced Button Component Tests - Simplified
 * Core functionality tests without JSX issues
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateButtonAccessibility } from '../ButtonEnhanced';

// Mock HTMLButtonElement for testing
const createMockButton = (width: number, height: number, hasAccessibleName = true) => {
  const button = {
    getBoundingClientRect: vi.fn(() => ({ width, height, top: 0, left: 0 })),
    getAttribute: vi.fn((attr) => {
      if (attr === 'aria-label') return hasAccessibleName ? 'Test Button' : null;
      if (attr === 'aria-live') return null;
      if (attr === 'aria-busy') return null;
      if (attr === 'aria-disabled') return null;
      if (attr === 'role') return 'button';
      return null;
    }),
    closest: vi.fn(() => null),
    textContent: hasAccessibleName ? 'Test Button' : '',
    querySelector: vi.fn(() => null),
    hasAttribute: vi.fn(() => false),
  } as any;

  return button;
};

describe('ButtonEnhanced Accessibility', () => {
  beforeEach(() => {
    // Mock window.getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: vi.fn(() => ({
        zoom: '1',
        outline: 'none',
        outlineOffset: '0px',
        getPropertyValue: vi.fn(() => 'none')
      })),
      configurable: true,
    });
  });

  it('meets WCAG 2.2 AA requirements for default button', () => {
    const button = createMockButton(100, 48, true);

    expect(validateButtonAccessibility(button)).toBe(true);
  });

  it('fails WCAG validation for small touch targets', () => {
    const button = createMockButton(20, 20, true);

    expect(validateButtonAccessibility(button)).toBe(false);
  });

  it('fails WCAG validation for missing accessible name', () => {
    const button = createMockButton(100, 48, false);

    expect(validateButtonAccessibility(button)).toBe(false);
  });

  it('passes WCAG validation for minimum touch target size', () => {
    const button = createMockButton(44, 44, true);

    expect(validateButtonAccessibility(button)).toBe(true);
  });

  it('passes WCAG validation for large touch target size', () => {
    const button = createMockButton(56, 56, true);

    expect(validateButtonAccessibility(button)).toBe(true);
  });
});

describe('ButtonEnhanced Component Structure', () => {
  it('exports Button component', () => {
    expect(() => {
      const module = require('../ButtonEnhanced');
      expect(module.Button).toBeDefined();
      expect(module.Button.displayName).toBe('Button');
    }).not.toThrow();
  });

  it('exports validateButtonAccessibility function', () => {
    expect(() => {
      const module = require('../ButtonEnhanced');
      expect(module.validateButtonAccessibility).toBeDefined();
      expect(typeof module.validateButtonAccessibility).toBe('function');
    }).not.toThrow();
  });

  it('exports ButtonProps interface', () => {
    expect(() => {
      const module = require('../ButtonEnhanced');
      expect(module.ButtonProps).toBeDefined();
    }).not.toThrow();
  });

  it('exports createButtonVariant helper', () => {
    expect(() => {
      const module = require('../ButtonEnhanced');
      expect(module.createButtonVariant).toBeDefined();
      expect(typeof module.createButtonVariant).toBe('function');
    }).not.toThrow();
  });
});
