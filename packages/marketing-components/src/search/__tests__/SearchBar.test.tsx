/**
 * @file packages/marketing-components/src/search/__tests__/SearchBar.test.tsx
 * @role test
 * @summary Tests for SearchBar component
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<SearchBar />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders search input with default placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByRole('searchbox', { name: /search/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search…');
  });

  it('uses custom placeholder', () => {
    render(<SearchBar placeholder="Search products…" />);
    expect(screen.getByPlaceholderText('Search products…')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onChange={onChange} />);
    await user.type(screen.getByRole('searchbox'), 'test');
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange).toHaveBeenLastCalledWith('t');
  });

  it('has role="search" on form', () => {
    render(<SearchBar />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });
});
