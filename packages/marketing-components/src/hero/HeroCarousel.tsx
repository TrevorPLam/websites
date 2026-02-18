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

export function HeroCarousel({
  slides,
  autoPlay = false,
  interval = 5000,
  className,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const slide = slides[activeIndex];

  React.useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, slides.length]);

  if (!slide) return null;

  return (
    <section className={className} aria-roledescription="carousel" aria-label="Hero carousel">
      <div>
        <h1>{slide.title}</h1>
        {slide.subtitle && <p>{slide.subtitle}</p>}
        {slide.image && <img src={slide.image.src} alt={slide.image.alt} />}
        {slide.cta && <a href={slide.cta.href}>{slide.cta.label}</a>}
      </div>
      {slides.length > 1 && (
        <div role="tablist" aria-label="Carousel slides">
          {slides.map((s, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1}: ${s.title}`}
              onClick={() => setActiveIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
