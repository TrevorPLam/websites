'use client';

/**
 * @file packages/marketing-components/src/product/ProductGrid.tsx
 * @role component
 * @summary Product grid layout
 */

import { Container, Section } from '@repo/ui';
import { ProductCard } from './ProductCard';
import type { Product } from './types';

export interface ProductGridProps {
  products: Product[];
  title?: string;
  productHref?: (product: Product) => string;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  className?: string;
}

export function ProductGrid({
  products,
  title,
  productHref,
  onAddToCart,
  onWishlist,
  className,
}: ProductGridProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={productHref?.(product)}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
