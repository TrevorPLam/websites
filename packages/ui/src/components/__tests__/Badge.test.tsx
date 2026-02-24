/**
 * Badge component tests.
 * Verifies rendering, variants, sizes, accessibility, and proper styling.
 */

import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with correct text', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
  });

  it('applies secondary variant classes', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
  });

  it('applies destructive variant classes', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/80');
  });

  it('applies outline variant classes', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('text-foreground');
  });

  it('applies small size classes', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
  });

  it('applies large size classes', () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  it('passes custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders as span by default', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('handles children correctly', () => {
    render(<Badge>123</Badge>);
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('combines variant and size classes correctly', () => {
    const { container } = render(
      <Badge variant="secondary" size="lg">
        Combined
      </Badge>
    );
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80', 'px-3', 'py-1', 'text-sm');
  });
});
