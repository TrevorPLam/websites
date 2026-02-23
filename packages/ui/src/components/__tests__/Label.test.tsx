import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
/**
 * Label component tests.
 * Verifies rendering, required/error variants, and accessibility.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Label } from '../Label';

describe('Label', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Label>Field label</Label>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with correct text', () => {
    render(<Label>Field label</Label>);
    expect(screen.getByText('Field label')).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(<Label required>Required field</Label>);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies error styling when error is true', () => {
    const { container } = render(<Label error>Error state</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('text-destructive');
  });

  it('passes custom className', () => {
    const { container } = render(<Label className="custom-class">Custom</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('custom-class');
  });
});
