// File: packages/marketing-components/src/hero/HeroCarousel.tsx
// Purpose: Rotating hero slides with auto-play
// Task: 2.1
// Status: Scaffolded - TODO: Implement

import * as React from 'react';

export interface HeroSlide {
  title: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
  };
  cta?: {
    label: string;
    href: string;
  };
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function HeroCarousel({ slides, autoPlay, interval, className }: HeroCarouselProps) {
  // TODO: Implement carousel hero with auto-play
  return (
    <section className={className}>
      {slides.map((slide, index) => (
        <div key={index}>
          <h1>{slide.title}</h1>
          {slide.subtitle && <p>{slide.subtitle}</p>}
          {slide.image && <img src={slide.image.src} alt={slide.image.alt} />}
          {slide.cta && <a href={slide.cta.href}>{slide.cta.label}</a>}
        </div>
      ))}
    </section>
  );
}
