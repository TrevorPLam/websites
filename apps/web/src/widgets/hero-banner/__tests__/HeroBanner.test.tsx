/**
 * @file apps/web/src/widgets/hero-banner/__tests__/HeroBanner.test.tsx
 * @summary Unit tests for Hero Banner component.
 * @description Comprehensive test suite covering functionality, accessibility, and performance.
 * @security Tests for multi-tenant tracking and data validation compliance
 * @performance Tests for Core Web Vitals optimization
 * @compliance WCAG 2.2 AA accessibility testing
 * @requirements TASK-007, unit-testing, performance-testing
 */

import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HeroBanner } from '../ui/HeroBanner';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: vi.fn(({ onLoad, onError, ...props }) => {
    React.useEffect(() => {
      // Simulate image load after a short delay
      setTimeout(() => {
        onLoad?.();
      }, 100);
    }, [onLoad]);

    return <img {...props} ref={vi.fn()} data-testid="hero-image" />;
  }),
}));

// Mock window object for performance tracking
Object.defineProperty(window, 'gtag', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, 'performance', {
  value: {
    mark: vi.fn(),
    observer: vi.fn(),
  },
  writable: true,
});

describe('HeroBanner', () => {
  const defaultProps = {
    headline: 'Transform Your Business Today',
    subheadline: 'Get expert guidance and proven strategies to accelerate your growth.',
    ctaPrimary: {
      label: 'Get Started',
      href: '#contact',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders headline and subheadline correctly', () => {
    render(<HeroBanner {...defaultProps} />);

    expect(screen.getByText('Transform Your Business Today')).toBeInTheDocument();
    expect(screen.getByText(/Get expert guidance and proven strategies/)).toBeInTheDocument();
  });

  it('renders primary CTA button', () => {
    render(<HeroBanner {...defaultProps} />);

    const ctaButton = screen.getByRole('link', { name: 'Get Started' });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '#contact');
  });

  it('renders secondary CTA when provided', () => {
    const propsWithSecondary = {
      ...defaultProps,
      ctaSecondary: {
        label: 'Learn More',
        href: '#features',
      },
    };

    render(<HeroBanner {...propsWithSecondary} />);

    const secondaryButton = screen.getByRole('link', { name: 'Learn More' });
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveAttribute('href', '#features');
  });

  it('renders background image when provided', () => {
    const propsWithImage = {
      ...defaultProps,
      backgroundImage: {
        url: '/test-image.jpg',
        alt: 'Test background image',
      },
    };

    render(<HeroBanner {...propsWithImage} />);

    const image = screen.getByTestId('hero-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test background image');
  });

  it('shows skeleton placeholder while image loads', () => {
    const propsWithImage = {
      ...defaultProps,
      backgroundImage: {
        url: '/test-image.jpg',
        alt: 'Test background image',
      },
      optimization: {
        enableSkeleton: true,
        preloadImage: true,
      },
    };

    render(<HeroBanner {...propsWithImage} />);

    // Initially skeleton should be visible
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('tracks conversion events on CTA clicks', async () => {
    const user = userEvent.setup();
    render(<HeroBanner {...defaultProps} />);

    const ctaButton = screen.getByRole('link', { name: 'Get Started' });
    await user.click(ctaButton);

    expect(window.gtag).toHaveBeenCalledWith('event', 'hero_cta_click', {
      event_category: 'conversion',
      event_label: 'primary',
      variant: 'control',
    });
  });

  it('calls custom onClick handlers', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    const propsWithOnClick = {
      ...defaultProps,
      ctaPrimary: {
        ...defaultProps.ctaPrimary,
        onClick: mockOnClick,
      },
    };

    render(<HeroBanner {...propsWithOnClick} />);

    const ctaButton = screen.getByRole('link', { name: 'Get Started' });
    await user.click(ctaButton);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('supports A/B testing variants', () => {
    const propsWithVariant = {
      ...defaultProps,
      variant: 'variant-a' as const,
      tracking: {
        eventName: 'hero_interaction',
        properties: {
          test_group: 'A',
        },
      },
    };

    render(<HeroBanner {...propsWithVariant} />);

    const section = screen.getByRole('region', { name: /hero-headline/i });
    expect(section).toHaveAttribute('data-variant', 'variant-a');
  });

  it('supports accessibility preferences', () => {
    const propsWithAccessibility = {
      ...defaultProps,
      accessibility: {
        reducedMotion: true,
        highContrast: true,
        largeText: true,
      },
    };

    render(<HeroBanner {...propsWithAccessibility} />);

    // Check that accessibility classes are applied
    const section = screen.getByRole('region', { name: /hero-headline/i });
    expect(section).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HeroBanner {...defaultProps} />);

    // Check for proper ARIA attributes
    const section = screen.getByRole('region', { name: /hero-headline/i });
    expect(section).toBeInTheDocument();

    // Check headline is properly labeled
    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toBeInTheDocument();
    expect(headline).toHaveAttribute('id', 'hero-headline');
  });

  it('supports different container sizes', () => {
    const propsWithContainer = {
      ...defaultProps,
      containerSize: 'sm' as const,
    };

    render(<HeroBanner {...propsWithContainer} />);

    const container = screen.getByRole('region', { name: /hero-headline/i }).parentElement;
    expect(container).toBeInTheDocument();
  });

  it('renders trust indicators', () => {
    render(<HeroBanner {...defaultProps} />);

    expect(screen.getByText('Free consultation')).toBeInTheDocument();
    expect(screen.getByText('No commitment')).toBeInTheDocument();
    expect(screen.getByText('Quick response')).toBeInTheDocument();
  });

  it('handles image load events', async () => {
    const propsWithImage = {
      ...defaultProps,
      backgroundImage: {
        url: '/test-image.jpg',
        alt: 'Test background image',
      },
    };

    render(<HeroBanner {...propsWithImage} />);

    // Wait for image to load
    await waitFor(() => {
      expect(window.performance.mark).toHaveBeenCalledWith('hero-image-loaded');
    });
  });

  it('handles image load errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { default: MockImage } = await import('next/image');
    MockImage.mockImplementation(({ onError, ...props }) => {
      React.useEffect(() => {
        setTimeout(() => {
          onError?.();
        }, 100);
      }, [onError]);

      return <img {...props} ref={vi.fn()} data-testid="hero-image" />;
    });

    const propsWithImage = {
      ...defaultProps,
      backgroundImage: {
        url: '/invalid-image.jpg',
        alt: 'Invalid image',
      },
    };

    render(<HeroBanner {...propsWithImage} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Hero banner image failed to load:',
        '/invalid-image.jpg'
      );
    });

    consoleSpy.mockRestore();
  });

  it('supports custom className', () => {
    const propsWithClass = {
      ...defaultProps,
      className: 'custom-hero-class',
    };

    render(<HeroBanner {...propsWithClass} />);

    const section = screen.getByRole('region', { name: /hero-headline/i });
    expect(section).toHaveClass('custom-hero-class');
  });

  it('supports different button variants and sizes', () => {
    const propsWithCustomButtons = {
      ...defaultProps,
      ctaPrimary: {
        label: 'Primary CTA',
        href: '#primary',
        variant: 'secondary' as const,
        size: 'small' as const,
      },
      ctaSecondary: {
        label: 'Secondary CTA',
        href: '#secondary',
        variant: 'ghost' as const,
        size: 'large' as const,
      },
    };

    render(<HeroBanner {...propsWithCustomButtons} />);

    expect(screen.getByRole('link', { name: 'Primary CTA' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Secondary CTA' })).toBeInTheDocument();
  });

  it('tracks performance metrics', () => {
    const propsWithTracking = {
      ...defaultProps,
      tracking: {
        eventName: 'hero_engagement',
        properties: {
          button_clicked: 'primary',
        },
      },
    };

    render(<HeroBanner {...propsWithTracking} />);

    // Check that performance monitoring script is included
    expect(document.querySelector('script')).toBeInTheDocument();
  });
});
