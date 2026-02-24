/**
 * @file packages/ui/src/components/__tests__/Card.test.tsx
 * @summary Unit tests for Card component/module.
 * @description Test suite covering functionality, edge cases, and error scenarios.
 * @security none
 * @adr none
 * @requirements none
 */

import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Card } from '../Card';

describe('Card', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Card>Card content</Card>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with correct content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Card>Default card</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass(
      'bg-card',
      'text-card-foreground',
      'rounded-xl',
      'border',
      'border-border',
      'shadow-xs'
    );
  });

  it('applies testimonial variant classes', () => {
    const { container } = render(<Card variant="testimonial">Testimonial</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('p-6');
  });

  it('applies service variant classes', () => {
    const { container } = render(<Card variant="service">Service card</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('p-6', 'hover:shadow-md', 'transition-shadow');
  });

  it('passes custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Card ref={ref}>Card with ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('handles additional HTML attributes', () => {
    const { container } = render(
      <Card data-testid="test-card" role="article">
        Card with attributes
      </Card>
    );
    const card = container.querySelector('[data-testid="test-card"]');
    expect(card).toHaveAttribute('role', 'article');
  });

  it('renders complex content correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card description</p>
        <button>Action</button>
      </Card>
    );
    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
