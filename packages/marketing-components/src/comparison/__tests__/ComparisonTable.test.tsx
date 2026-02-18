/**
 * @file packages/marketing-components/src/comparison/__tests__/ComparisonTable.test.tsx
 * @role test
 * @summary Tests for ComparisonTable component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ComparisonTable } from '../ComparisonTable';

const columns = [
  { id: 'a', name: 'Plan A' },
  { id: 'b', name: 'Plan B', highlight: true },
];

const rows = [
  { feature: 'Storage', values: ['10GB', '100GB'] },
  { feature: 'Support', values: [true, true] },
  { feature: 'Price', values: ['$9', '$29'] },
];

describe('ComparisonTable', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ComparisonTable title="Compare Plans" columns={columns} rows={rows} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders title when provided', () => {
    render(<ComparisonTable title="Compare Plans" columns={columns} rows={rows} />);
    expect(screen.getByRole('heading', { name: /compare plans/i })).toBeInTheDocument();
  });

  it('renders table with header row', () => {
    render(<ComparisonTable columns={columns} rows={rows} />);
    expect(screen.getByRole('columnheader', { name: /feature/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /plan a/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /plan b/i })).toBeInTheDocument();
  });

  it('renders all row values', () => {
    render(<ComparisonTable columns={columns} rows={rows} />);
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('10GB')).toBeInTheDocument();
    expect(screen.getByText('100GB')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('$9')).toBeInTheDocument();
    expect(screen.getByText('$29')).toBeInTheDocument();
  });

  it('renders checkmark for boolean true', () => {
    const { container } = render(
      <ComparisonTable columns={columns} rows={[{ feature: 'X', values: [true] }]} />
    );
    expect(container.textContent).toContain('✓');
  });
});
