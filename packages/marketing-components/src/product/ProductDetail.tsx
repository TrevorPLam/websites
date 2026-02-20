'use client';

/**
 * @file packages/marketing-components/src/product/ProductDetail.tsx
 * @role component
 * @summary Single product detail view with gallery
 */

import { Container, Section } from '@repo/ui';
import { Rating } from '@repo/ui';
import type { Product } from './types';

export interface ProductDetailProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function ProductDetail({ product, onAddToCart, className }: ProductDetailProps) {
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return (
    <Section className={className}>
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img src={images[0]} alt="" className="h-full w-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded bg-muted">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.rating != null && (
              <div className="mt-2 flex items-center gap-2">
                <Rating value={product.rating} readOnly size="sm" />
                {product.reviewCount != null && product.reviewCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.compareAtPrice != null && product.compareAtPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {product.description && (
              <p className="mt-6 text-muted-foreground">{product.description}</p>
            )}
            {onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="mt-8 min-h-[44px] rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
