// File: packages/marketing-components/src/hero/HeroVideo.tsx
// Purpose: Video background hero with overlay
// Task: 2.1
// Status: Scaffolded - TODO: Implement

import * as React from 'react';

export interface HeroVideoProps {
  title: string;
  subtitle?: string;
  video?: {
    src: string;
    poster?: string;
  };
  overlay?: boolean;
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function HeroVideo({ title, subtitle, video, overlay, cta, className }: HeroVideoProps) {
  // TODO: Implement video hero with overlay
  return (
    <section className={className}>
      {video && <video src={video.src} poster={video.poster} />}
      {overlay && <div className="overlay" />}
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {cta && <a href={cta.href}>{cta.label}</a>}
      </div>
    </section>
  );
}
