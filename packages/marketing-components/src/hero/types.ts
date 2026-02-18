/**
 * @file packages/marketing-components/src/hero/types.ts
 * @role types
 * @summary Shared types for hero component variants
 *
 * Defines TypeScript interfaces for all hero variants and composition system.
 */

import * as React from 'react';

/**
 * Base hero props shared across all variants
 */
export interface BaseHeroProps {
  /** Main hero title */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional description text */
  description?: string;
  /** Custom CSS class name */
  className?: string;
  /** Children for composition slots */
  children?: React.ReactNode;
}

/**
 * CTA (Call to Action) configuration
 */
export interface HeroCTA {
  /** CTA label text */
  label: string;
  /** CTA href/link */
  href: string;
  /** Optional variant style */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Optional size */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Dual CTA configuration
 */
export interface HeroDualCTA {
  /** Primary CTA */
  primary: HeroCTA;
  /** Secondary CTA */
  secondary: HeroCTA;
}

/**
 * Image configuration
 */
export interface HeroImage {
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt: string;
  /** Optional image width */
  width?: number;
  /** Optional image height */
  height?: number;
  /** Optional priority flag for Next.js Image */
  priority?: boolean;
}

/**
 * Video configuration
 */
export interface HeroVideo {
  /** Video source URL */
  src: string;
  /** Optional poster image */
  poster?: string;
  /** Autoplay video */
  autoplay?: boolean;
  /** Loop video */
  loop?: boolean;
  /** Mute video */
  muted?: boolean;
  /** Video type */
  type?: 'video/mp4' | 'video/webm' | 'video/ogg';
}

/**
 * YouTube/Vimeo video configuration
 */
export interface HeroEmbeddedVideo {
  /** Video ID */
  id: string;
  /** Platform type */
  platform: 'youtube' | 'vimeo';
  /** Autoplay */
  autoplay?: boolean;
}

/**
 * Layout options
 */
export type HeroLayout = 'full-width' | 'contained' | 'edge-to-edge' | 'with-sidebar';

/**
 * Animation options
 */
export type HeroAnimation = 'fade-in' | 'slide-up' | 'zoom' | 'parallax' | 'typewriter' | 'none';

/**
 * Composition slots for hero sections
 */
export interface HeroSlots {
  /** Header slot content */
  header?: React.ReactNode;
  /** Content slot (between title and CTA) */
  content?: React.ReactNode;
  /** Footer slot content */
  footer?: React.ReactNode;
  /** Background slot */
  background?: React.ReactNode;
  /** Overlay slot */
  overlay?: React.ReactNode;
  /** CTA area slot (replaces default CTA) */
  ctaArea?: React.ReactNode;
}

/**
 * Stats item for hero with stats
 */
export interface HeroStat {
  /** Stat value */
  value: string | number;
  /** Stat label */
  label: string;
  /** Optional description */
  description?: string;
}

/**
 * Testimonial item for hero with testimonials
 */
export interface HeroTestimonial {
  /** Testimonial content */
  content: string;
  /** Author name */
  author: string;
  /** Author role */
  role?: string;
  /** Author avatar */
  avatar?: string;
  /** Rating (1-5) */
  rating?: number;
}

/**
 * Feature item for hero with features
 */
export interface HeroFeature {
  /** Feature title */
  title: string;
  /** Feature description */
  description?: string;
  /** Feature icon */
  icon?: React.ReactNode;
}
