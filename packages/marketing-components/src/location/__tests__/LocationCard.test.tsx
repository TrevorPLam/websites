/**
 * @file packages/marketing-components/src/location/__tests__/LocationCard.test.tsx
 * @role test
 * @summary Tests for LocationCard component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { LocationCard } from '../LocationCard';
import type { Location } from '../types';

const fixture: Location = {
  id: '1',
  name: 'Downtown Office',
  address: '123 Main St',
  city: 'Austin',
  state: 'TX',
  zip: '78701',
  phone: '(512) 555-1234',
  directionsUrl: 'https://maps.google.com',
};

describe('LocationCard', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<LocationCard location={fixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders location name', () => {
    render(<LocationCard location={fixture} />);
    expect(screen.getByRole('heading', { name: /downtown office/i })).toBeInTheDocument();
  });

  it('renders address when provided', () => {
    render(<LocationCard location={fixture} />);
    expect(screen.getByText(/123 Main St, Austin, TX, 78701/)).toBeInTheDocument();
  });

  it('renders phone link when provided', () => {
    render(<LocationCard location={fixture} />);
    const link = screen.getByRole('link', { name: /\(512\) 555-1234/ });
    expect(link).toHaveAttribute('href', 'tel:(512) 555-1234');
  });

  it('renders directions link when provided', () => {
    render(<LocationCard location={fixture} />);
    const link = screen.getByRole('link', { name: /get directions/i });
    expect(link).toHaveAttribute('href', fixture.directionsUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies custom className', () => {
    const { container } = render(<LocationCard location={fixture} className="custom-class" />);
    const card = container.querySelector('[class*="custom-class"]');
    expect(card).toBeInTheDocument();
  });
});
