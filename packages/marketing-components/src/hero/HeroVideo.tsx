/**
 * @file packages/marketing-components/src/hero/HeroVideo.tsx
 * @role component
 * @summary Video background hero with overlay
 *
 * Hero variant with video background and optional overlay.
 * Supports autoplay, loop, and muted video options.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroVideo as HeroVideoType, HeroSlots } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroVideoProps extends BaseHeroProps {
  /** Video configuration */
  video?: HeroVideoType;
  /** Embedded video (YouTube/Vimeo) */
  embeddedVideo?: {
    id: string;
    platform: 'youtube' | 'vimeo';
    autoplay?: boolean;
  };
  /** Show overlay */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
  /** Composition slots */
  slots?: HeroSlots;
}

/**
 * Video background hero section with optional overlay.
 * Supports both direct video and embedded YouTube/Vimeo videos.
 *
 * @param props - HeroVideoProps
 * @returns Hero section component
 */
export function HeroVideo({
  title,
  subtitle,
  description,
  video,
  embeddedVideo,
  overlay = true,
  overlayOpacity = 0.5,
  cta,
  dualCta,
  slots,
  className,
  children,
}: HeroVideoProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const videoElement = video ? (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={video.src}
      poster={video.poster}
      autoPlay={video.autoplay && !prefersReducedMotion}
      loop={video.loop}
      muted={video.muted ?? true}
      playsInline
      aria-label="Background video"
    >
      <track kind="captions" />
    </video>
  ) : embeddedVideo ? (
    <div className="absolute inset-0 h-full w-full">
      <iframe
        className="h-full w-full object-cover"
        src={`https://www.${
          embeddedVideo.platform === 'youtube' ? 'youtube' : 'vimeo'
        }.com/embed/${embeddedVideo.id}?autoplay=${
          embeddedVideo.autoplay && !prefersReducedMotion ? 1 : 0
        }&mute=1&loop=1&controls=0`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Background video"
        aria-label="Background video"
      />
    </div>
  ) : null;

  const content = (
    <div className="relative z-10 flex flex-col items-center text-center">
      {slots?.header}
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl md:text-2xl">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
          {description}
        </p>
      )}
      {slots?.content}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        {slots?.ctaArea ? (
          slots.ctaArea
        ) : dualCta ? (
          <>
            <HeroCTAButton {...dualCta.primary} variant={dualCta.primary.variant || 'primary'} size={dualCta.primary.size || 'large'} />
            <HeroCTAButton {...dualCta.secondary} variant={dualCta.secondary.variant || 'outline'} size={dualCta.secondary.size || 'large'} />
          </>
        ) : cta ? (
          <HeroCTAButton {...cta} variant={cta.variant || 'primary'} size={cta.size || 'large'} />
        ) : null}
      </div>
      {slots?.footer}
      {children}
    </div>
  );

  return (
    <Section className={cn('relative overflow-hidden', className)}>
      {videoElement}
      {slots?.background}
      {overlay && !slots?.overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}
      {slots?.overlay}
      <Container className="relative z-10 py-24 md:py-32">{content}</Container>
    </Section>
  );
}
