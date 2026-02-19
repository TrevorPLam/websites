/**
 * @file packages/marketing-components/src/hero/__tests__/HeroCentered.test.tsx
 * @role test
 * @summary Tests for HeroCentered component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroCentered } from '../HeroCentered';
import { testA11y } from '../../__tests__/test-utils';

describe('HeroCentered', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<HeroCentered title="Test Hero" subtitle="Test Subtitle" />);
    await testA11y(container);
  });

  it('renders title', () => {
    render(<HeroCentered title="Test Hero" />);
    expect(screen.getByRole('heading', { level: 1, name: /test hero/i })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<HeroCentered title="Test Hero" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<HeroCentered title="Test Hero" description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders CTA link when provided', () => {
    render(<HeroCentered title="Test Hero" cta={{ label: 'Get Started', href: '/signup' }} />);
    const link = screen.getByRole('link', { name: /get started/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('renders dual CTAs when provided', () => {
    render(
      <HeroCentered
        title="Test Hero"
        dualCta={{
          primary: { label: 'Primary', href: '/primary' },
          secondary: { label: 'Secondary', href: '/secondary' },
        }}
      />
    );
    expect(screen.getByRole('link', { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /secondary/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<HeroCentered title="Test Hero" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders children when provided', () => {
    render(
      <HeroCentered title="Test Hero">
        <div data-testid="child">Child Content</div>
      </HeroCentered>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
