/**
 * @file packages/marketing-components/src/product/ProductCard.tsx
 * @role component
 * @summary Single product card
 */

import { Card, Rating } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Product } from './types';

export interface ProductCardProps {
  product: Product;
  href?: string;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  className?: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function ProductCard({
  product,
  href,
  onAddToCart,
  onWishlist,
  className,
}: ProductCardProps) {
  const link = href ?? `/products/${product.slug}`;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <a href={link} className="block">
        {product.image && (
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <img
              src={product.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            {product.rating != null && (
              <Rating value={product.rating} readOnly size="sm" />
            )}
            {product.reviewCount != null && product.reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice != null && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </a>
      {(onAddToCart || onWishlist) && (
        <div className="flex gap-2 border-t border-border p-4">
          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="min-h-[44px] flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add to Cart
            </button>
          )}
          {onWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onWishlist(product);
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              aria-label="Add to wishlist"
            >
              ♥
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
