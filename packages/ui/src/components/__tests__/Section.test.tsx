/**
 * Section component tests.
 * Verifies rendering, polymorphic behavior, and layout.
 */

import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Section } from '../Section';

describe('Section', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Section>Section content</Section>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with correct content', () => {
    render(<Section>Section content</Section>);
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Section>Default</Section>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('py-16', 'md:py-20');
  });

  it('renders as section by default', () => {
    const { container } = render(<Section>Section</Section>);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders as div when as prop is div', () => {
    const { container } = render(<Section as="div">Div Section</Section>);
    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('py-16', 'md:py-20');
  });

  it('renders as aside when as prop is aside', () => {
    const { container } = render(<Section as="aside">Aside Section</Section>);
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
    expect(aside).toHaveClass('py-16', 'md:py-20');
  });

  it('passes custom className', () => {
    const { container } = render(<Section className="custom-class">Custom</Section>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('renders complex content correctly', () => {
    render(
      <Section>
        <h1>Section Title</h1>
        <p>Section description</p>
        <button>Action</button>
      </Section>
    );
    expect(screen.getByRole('heading', { name: 'Section Title' })).toBeInTheDocument();
    expect(screen.getByText('Section description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Section ref={ref}>Section with ref</Section>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('handles additional HTML attributes', () => {
    const { container } = render(
      <Section data-testid="test-section" aria-labelledby="title">
        Section with attributes
      </Section>
    );
    const section = container.querySelector('[data-testid="test-section"]');
    expect(section).toHaveAttribute('aria-labelledby', 'title');
  });

  it('combines custom className with default classes', () => {
    const { container } = render(<Section className="mt-8">With margin</Section>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('py-16', 'md:py-20', 'mt-8');
  });

  it('passes through other HTML attributes', () => {
    const { container } = render(
      <Section id="my-section" role="region">
        Section with id and role
      </Section>
    );
    const section = container.querySelector('#my-section');
    expect(section).toHaveAttribute('role', 'region');
  });
});
