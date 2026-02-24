/**
 * @file packages/ui/src/components/__tests__/Container.test.tsx
 * @summary Unit tests for Container component/module.
 * @description Test suite covering functionality, edge cases, and error scenarios.
 * @security none
 * @adr none
 * @requirements none
 */

import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Container } from '../Container';

describe('Container', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Container>Container content</Container>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with correct content', () => {
    render(<Container>Container content</Container>);
    expect(screen.getByText('Container content')).toBeInTheDocument();
  });

  it('applies default size classes', () => {
    const { container } = render(<Container>Default</Container>);
    const containerDiv = container.querySelector('div');
    expect(containerDiv).toHaveClass(
      'mx-auto',
      'w-full',
      'px-4',
      'sm:px-6',
      'lg:px-8',
      'max-w-7xl'
    );
  });

  it('applies narrow size classes', () => {
    const { container } = render(<Container size="narrow">Narrow</Container>);
    const containerDiv = container.querySelector('div');
    expect(containerDiv).toHaveClass('max-w-4xl');
  });

  it('applies wide size classes', () => {
    const { container } = render(<Container size="wide">Wide</Container>);
    const containerDiv = container.querySelector('div');
    expect(containerDiv).toHaveClass('max-w-screen-2xl');
  });

  it('passes custom className', () => {
    const { container } = render(<Container className="custom-class">Custom</Container>);
    const containerDiv = container.querySelector('div');
    expect(containerDiv).toHaveClass('custom-class');
  });
});
