/**
 * @file packages/marketing-components/src/product/ProductComparison.tsx
 * @role component
 * @summary Side-by-side product comparison
 */

import { Container, Section } from '@repo/ui';
import { Rating } from '@repo/ui';
import type { Product } from './types';

export interface ProductComparisonProps {
  products: Product[];
  title?: string;
  productHref?: (product: Product) => string;
  className?: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function ProductComparison({
  products,
  title = 'Compare Products',
  productHref,
  className,
}: ProductComparisonProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left font-semibold">Product</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 text-left">
                    <a
                      href={productHref?.(p) ?? `/products/${p.slug}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {p.name}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-4 font-medium text-muted-foreground">Price</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    {formatPrice(p.price)}
                    {p.compareAtPrice != null && p.compareAtPrice > p.price && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 font-medium text-muted-foreground">Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.rating != null ? (
                      <Rating value={p.rating} readOnly size="sm" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Description</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-sm text-muted-foreground">
                    {p.description ?? '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
