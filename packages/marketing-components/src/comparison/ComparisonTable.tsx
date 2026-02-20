'use client';

/**
 * @file packages/marketing-components/src/comparison/ComparisonTable.tsx
 * @role component
 * @summary Feature comparison table
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { ComparisonColumn, ComparisonRow } from './types';

export interface ComparisonTableProps {
  title?: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  className?: string;
}

function CellValue({ value }: { value: string | boolean | number | null }) {
  if (value === true) return <span aria-hidden>✓</span>;
  if (value === false) return <span aria-hidden>—</span>;
  return <span>{value ?? '—'}</span>;
}

export function ComparisonTable({ title, columns, rows, className }: ComparisonTableProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border bg-muted p-3 text-left font-medium">Feature</th>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={cn(
                      'border border-border p-3 text-center font-medium',
                      col.highlight && 'bg-primary/10 text-primary'
                    )}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-3 font-medium">{row.feature}</td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={cn(
                        'border border-border p-3 text-center',
                        columns[j]?.highlight && 'bg-primary/5'
                      )}
                    >
                      <CellValue value={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
