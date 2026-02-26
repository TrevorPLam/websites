/**
 * @file apps/web/src/features/lead-capture/lib/performance.ts
 * @summary Performance optimization utilities for lead capture.
 * @description Core Web Vitals optimization utilities and hooks.
 */

import { useCallback, useRef, useEffect, useState } from 'react';

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const interactionStartTime = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();

    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        console.debug(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  const startInteraction = useCallback(() => {
    interactionStartTime.current = performance.now();
  }, []);

  const endInteraction = useCallback((interactionName: string) => {
    if (interactionStartTime.current) {
      const interactionTime = performance.now() - interactionStartTime.current;
      console.debug(`[Performance] ${componentName} ${interactionName} time: ${interactionTime.toFixed(2)}ms`);

      // Track INP (Interaction to Next Paint)
      if (performance.measure) {
        performance.measure(`${componentName}-${interactionName}`, {
          start: interactionStartTime.current!,
          end: performance.now(),
        });
      }
    }
  }, [componentName]);

  return { startInteraction, endInteraction };
}

// Debounced hook for form inputs (INP optimization)
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// Resource preloading utility
export function preloadResources(resources: Array<{ href: string; as: string; type?: string }>) {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) {
      link.type = resource.type;
    }
    document.head.appendChild(link);
  });
}

// Critical CSS injection for LCP optimization
export function injectCriticalCSS(css: string) {
  if (document.querySelector('#critical-css')) {
    return; // Already injected
  }

  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = css;
  document.head.appendChild(style);
}

// Font loading optimization
export function loadFont(fontFamily: string, src: string, weights: string[] = ['400']) {
  return new Promise<void>((resolve, reject) => {
    const font = new FontFace(fontFamily, `url(${src})`, {
      weight: weights.join(' '),
      display: 'swap',
    });

    font.load()
      .then(() => {
        document.fonts.add(font);
        resolve();
      })
      .catch(reject);
  });
}

// Image optimization utilities
export function optimizeImageSrc(src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
} = {}): string {
  const { width, height, quality = 80, format = 'auto' } = options;

  // This would integrate with your image optimization service
  const params = new URLSearchParams();

  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality !== 80) params.set('q', quality.toString());
  if (format !== 'auto') params.set('f', format);

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

// Bundle size monitoring
export function logBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource' && 'transferSize' in entry) {
          const resource = entry as PerformanceResourceTiming;
          console.debug(`[Bundle Size] ${resource.name}: ${resource.transferSize} bytes`);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}

// CLS prevention utilities
export function reserveSpace(element: HTMLElement, width: number, height: number) {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.position = 'relative';
}

// Skeleton loading component
export function createSkeleton(width: number, height: number, className = '') {
  const div = document.createElement('div');
  div.className = `animate-pulse bg-gray-200 rounded ${className}`;
  div.style.width = `${width}px`;
  div.style.height = `${height}px`;
  return div;
}

// Performance metrics collection
export function collectMetrics() {
  if (typeof window === 'undefined' || !('web-vitals' in window)) {
    return;
  }

  // Dynamic import to avoid bundle issues
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, getINP }) => {
    getCLS((metric: any) => console.debug('[CWV] CLS:', metric));
    getFID((metric: any) => console.debug('[CWV] FID:', metric));
    getFCP((metric: any) => console.debug('[CWV] FCP:', metric));
    getLCP((metric: any) => console.debug('[CWV] LCP:', metric));
    getTTFB((metric: any) => console.debug('[CWV] TTFB:', metric));
    getINP((metric: any) => console.debug('[CWV] INP:', metric));
  }).catch(() => {
    // web-vitals not available, silently fail
  });
}

// Request idle callback for non-critical tasks
export function scheduleIdleCallback(callback: () => void, timeout = 5000) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 100);
  }
}
