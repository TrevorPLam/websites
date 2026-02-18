/**
 * @file packages/marketing-components/src/filter/__tests__/FilterBar.test.tsx
 * @role test
 * @summary Tests for FilterBar component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { FilterBar } from '../FilterBar';

const options = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'recent', label: 'Recent' },
];

describe('FilterBar', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<FilterBar options={options} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders all options', () => {
    render(<FilterBar options={options} />);
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /featured/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recent/i })).toBeInTheDocument();
  });

  it('calls onSelect when option clicked', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    render(<FilterBar options={options} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: /featured/i }));
    expect(onSelect).toHaveBeenCalledWith('featured');
  });

  it('marks active option with aria-pressed', () => {
    render(<FilterBar options={options} activeId="featured" />);
    const featuredBtn = screen.getByRole('button', { name: /featured/i });
    expect(featuredBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('has role="group" with aria-label', () => {
    render(<FilterBar options={options} />);
    const group = screen.getByRole('group', { name: /filter options/i });
    expect(group).toBeInTheDocument();
  });
});
