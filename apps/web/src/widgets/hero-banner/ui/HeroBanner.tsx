import React from 'react'

/**
 * @file apps/web/src/widgets/hero-banner/ui/HeroBanner.tsx
 * @summary Hero banner component.
 * @description Main hero section with headline, subheadline, and CTAs.
 * @security No sensitive data handling; UI component only.
 * @adr none
 * @requirements DOMAIN-3-6
 */

import Image from 'next/image';

export interface HeroBannerProps {
  headline: string;
  subheadline?: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
  backgroundImage?: {
    url: string;
    alt: string;
  };
}

/**
 * Renders a hero banner section with headline, subheadline, and call-to-action buttons.
 *
 * @param props Hero banner props including headline, subheadline, CTAs, and background image.
 * @returns JSX element representing the hero banner component.
 */
export function HeroBanner({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
}: HeroBannerProps) {
  return (
    <section aria-labelledby="hero-headline" className="relative min-h-[60vh] flex items-center">
      {backgroundImage && (
        <Image
          src={backgroundImage.url}
          alt={backgroundImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA=="
        />
      )}

      <div className="relative z-10 container mx-auto px-4">
        <h1 id="hero-headline" className="text-4xl font-bold tracking-tight md:text-6xl text-white">
          {headline}
        </h1>
        {subheadline && <p className="mt-4 text-xl text-gray-200">{subheadline}</p>}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={ctaPrimary.href}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {ctaPrimary.label}
          </a>
          {ctaSecondary && (
            <a
              href={ctaSecondary.href}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-white rounded-md hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              {ctaSecondary.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
