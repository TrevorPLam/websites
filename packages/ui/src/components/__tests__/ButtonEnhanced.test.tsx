/**
 * @file packages/ui/src/components/__tests__/ButtonEnhanced.test.tsx
 * @summary Comprehensive test suite for enhanced Button component with WCAG 2.2 AA compliance.
 * @description Tests accessibility, interactions, variants, and responsive behavior of Button component.
 * @security No security concerns - test file for UI component.
 * @adr none
 * @requirements WCAG-2.2, DOMAIN-3-1
 */

/**
 * Enhanced Button Component Tests
 * WCAG 2.2 AA compliance testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ButtonEnhanced';
import { validateButtonAccessibility } from '../ButtonEnhanced';

// Setup Vitest DOM matchers
import '@testing-library/jest-dom';

describe('ButtonEnhanced', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole('button', { name: 'Destructive' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    let button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('h-11');

    rerender(<Button size="large">Large</Button>);
    button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('h-14');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: 'Loading...' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByRole('button', { name: 'Disabled' });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with left and right icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    const RightIcon = () => <span data-testid="right-icon">→</span>;

    render(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        With Icons
      </Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('hides icons when loading', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    render(<Button loading leftIcon={<LeftIcon />}>Loading</Button>);

    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument();
  });

  it('supports custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: 'Custom' });

    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('ButtonEnhanced Accessibility', () => {
  it('meets WCAG 2.2 AA requirements for default button', () => {
    render(<Button>Accessible Button</Button>);
    const button = screen.getByRole('button');

    // Mock getBoundingClientRect and getComputedStyle for testing
    Object.defineProperty(button, 'getBoundingClientRect', {
      value: () => ({ width: 100, height: 48, top: 0, left: 0 }),
      configurable: true,
    });

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({ zoom: '1', outline: 'none', outlineOffset: '0px' }),
      configurable: true,
    });

    expect(validateButtonAccessibility(button as HTMLButtonElement)).toBe(true);
  });

  it('fails WCAG validation for small touch targets', () => {
    render(<Button>Small Button</Button>);
    const button = screen.getByRole('button');

    // Mock small touch target
    Object.defineProperty(button, 'getBoundingClientRect', {
      value: () => ({ width: 20, height: 20, top: 0, left: 0 }),
      configurable: true,
    });

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({ zoom: '1', outline: 'none', outlineOffset: '0px' }),
      configurable: true,
    });

    expect(validateButtonAccessibility(button as HTMLButtonElement)).toBe(false);
  });

  it('has proper ARIA attributes when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-live', 'polite');
  });

  it('has proper ARIA attributes when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('icons have aria-hidden="true"', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    render(<Button leftIcon={<LeftIcon />}>With Icon</Button>);

    const icon = screen.getByTestId('left-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('maintains minimum touch target size of 44px', () => {
    render(<Button size="small">Small Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('min-h-[44px]');
  });

  it('large button exceeds minimum touch target size', () => {
    render(<Button size="large">Large Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('min-h-[48px]');
  });
});
