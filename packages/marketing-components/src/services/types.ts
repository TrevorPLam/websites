/**
 * @file packages/marketing-components/src/services/types.ts
 * @role types
 * @summary Shared types for service component variants
 */

import * as React from 'react';

/**
 * Service item interface
 */
export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: string;
  image?: {
    src: string;
    alt: string;
  };
  category?: string;
  tags?: string[];
  rating?: number;
  featured?: boolean;
  cta?: {
    label: string;
    href: string;
  };
  icon?: React.ReactNode;
}

/**
 * Service filter options
 */
export interface ServiceFilter {
  category?: string;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  featured?: boolean;
}

/**
 * Service sort options
 */
export type ServiceSortBy = 'name' | 'price' | 'rating' | 'date' | 'popularity';
export type ServiceSortOrder = 'asc' | 'desc';
