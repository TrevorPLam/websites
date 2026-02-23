# core-web-vitals-optimization.md

# Core Web Vitals Optimization Strategies and Implementation

> **Version Reference:** Core Web Vitals 2026 Specification | Last Updated: 2026-02-23
> **Purpose:** Comprehensive guide for optimizing Core Web Vitals with latest 2026 standards, advanced patterns, and production-ready implementations

1. [Overview](#overview)
2. [Core Web Vitals Metrics (2026)](#core-web-vitals-metrics-2026)
3. [Optimization Strategies](#optimization-strategies)
4. [Performance Monitoring](#performance-monitoring)
5. [Advanced Optimization Techniques](#advanced-optimization-techniques)
6. [Performance Budgeting](#performance-budgeting)
7. [Framework-Specific Optimizations](#framework-specific-optimizations)
8. [Monitoring and Analytics](#monitoring-and-analytics)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [References](#references)

---

## Overview

Core Web Vitals (CWV) are a set of specific metrics that Google uses to measure user experience on the web. In 2026, these metrics have evolved beyond the original three to include Interaction to Next Paint (INP) as a replacement for First Input Delay (FID). This comprehensive guide covers optimization strategies for all current Core Web Vitals metrics and their impact on user experience and SEO rankings.

## Core Web Vitals Metrics (2026)

### 1. Largest Contentful Paint (LCP)

**Definition**: Measures loading performance. Specifically, it marks the point in the page load timeline when the largest content element becomes visible in the viewport.

**Good Threshold**: ≤ 2.5 seconds
**Target**: 1.2 seconds or less

### 2. Interaction to Next Paint (INP)

**Definition**: Measures responsiveness. It captures the latency of all interactions throughout the page lifecycle, reporting the worst interaction delay.

**Good Threshold**: ≤ 200 milliseconds
**Target**: 100 milliseconds or less

### 3. Cumulative Layout Shift (CLS)

**Definition**: Measures visual stability. It quantifies how much unexpected layout shift occurs during the entire page lifecycle.

**Good Threshold**: ≤ 0.1
**Target**: 0.05 or less

### Additional Important Metrics

#### First Contentful Paint (FCP)

- **Good**: ≤ 1.8 seconds
- Measures when the first piece of content renders

#### Time to First Byte (TTFB)

- **Good**: ≤ 800 milliseconds
- Measures server response time

## Optimization Strategies

### 1. LCP Optimization

#### Image Optimization

```typescript
// Image optimization with modern formats
const ImageOptimizer = {
  // Convert to modern formats
  async optimizeImage(src: string): Promise<string> {
    const image = await sharp(src);

    // Convert to WebP with quality optimization
    const webp = await image
      .webp({ quality: 80 })
      .resize({ width: 1200, withoutEnlargement: true })
      .toBuffer();

    return `data:image/webp;base64,${webp.toString('base64')}`;
  },

  // Responsive image loading
  generateResponsiveImages(src: string, breakpoints: number[]) {
    return breakpoints.map(size => ({
      src: this.generateImageSrc(src, size),
      width: size,
      sizes: `${size}w`
    }));
  },

  // Preload critical images
  preloadCriticalImages(images: string[]) {
    return images.map(src => ({
      rel: 'preload',
      as: 'image',
      href: src,
      fetchpriority: 'high'
    }));
  }
};

// Next.js Image component with optimization
import Image from 'next/image';

const OptimizedImage = ({ src, alt, priority = false, ...props }) => (
  <Image
    src={src}
    alt={alt}
    width={800}
    height={400}
    priority={priority}
    placeholder="blur"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    style={{
      objectFit: 'cover'
    }}
    {...props}
  />
);
```

#### Font Optimization

```typescript
// Font loading strategy
const FontOptimizer = {
  async optimizeFonts(fonts: string[]) {
    const fontFaces = fonts.map((font) => ({
      fontFamily: font,
      src: `url(/fonts/${font}.woff2) format('woff2')`,
      display: 'swap',
      preload: true,
    }));

    return fontFaces;
  },

  // Critical font preloading
  preloadCriticalFonts(criticalFonts: string[]) {
    return criticalFonts.map((font) => ({
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
      href: `/fonts/${font}.woff2`,
    }));
  },
};

// CSS font-face optimization
const fontCSS = `
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}

/* Critical CSS with font loading */
.critical-text {
  font-family: 'Inter', system-ui, sans-serif;
  font-display: swap;
}
`;
```

#### Server-Side Rendering Optimization

```typescript
// Next.js server-side rendering optimizations
export default function HomePage({ posts }: { posts: Post[] }) {
  return (
    <div>
      <Head>
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" />
        <link rel="preload" href="/hero-image.webp" as="image" />
      </Head>

      {/* Above-the-fold content */}
      <HeroSection />
      <CriticalContent posts={posts.slice(0, 3)} />

      {/* Below-the-fold content with loading */}
      <Suspense fallback={<ContentSkeleton />}>
        <AdditionalContent posts={posts.slice(3)} />
      </Suspense>
    </div>
  );
}

// Streaming SSR with Suspense
const StreamingPage = async () => {
  const criticalData = await getCriticalData();
  const fullData = await getFullData();

  return (
    <div>
      <CriticalComponent data={criticalData} />
      <Suspense fallback={<LoadingSpinner />}>
        <FullComponent data={fullData} />
      </Suspense>
    </div>
  );
};
```

### 2. INP Optimization

#### JavaScript Execution Optimization

```typescript
// Code splitting and lazy loading
const ComponentLoader = {
  // Dynamic imports for heavy components
  loadHeavyComponent: async () => {
    const { HeavyComponent } = await import('./HeavyComponent');
    return HeavyComponent;
  },

  // Progressive loading
  loadComponentProgressively: async (componentName: string) => {
    const { Component } = await import(`./components/${componentName}`);
    return Component;
  }
};

// React.lazy with Suspense
const LazyChart = React.lazy(() => import('./Chart'));

const InteractiveDashboard = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Load Chart
      </button>

      {showChart && (
        <React.Suspense fallback={<ChartSkeleton />}>
          <LazyChart />
        </React.Suspense>
      )}
    </div>
  );
};

// Web Workers for heavy computations
const WorkerManager = {
  createWorker: (script: string) => {
    const worker = new Worker(`/workers/${script}`);
    return worker;
  },

  processInWorker: async <T, R>(worker: Worker, data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      worker.postMessage(data);
      worker.onmessage = (e) => resolve(e.data);
      worker.onerror = reject;
    });
  }
};

// Usage example
const dataProcessor = WorkerManager.createWorker('data-processor');
const result = await WorkerManager.processInWorker(dataProcessor, largeDataset);
```

#### Event Handling Optimization

```typescript
// Debounced event handlers
const useDebouncedCallback = (callback: Function, delay: number = 300) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any[]) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
};

// Optimized scroll handler
const useOptimizedScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = useDebouncedCallback(() => {
    setScrollPosition(window.scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return scrollPosition;
};

// Request animation frame for smooth interactions
const useSmoothAnimation = () => {
  const [value, setValue] = useState(0);
  const animationRef = useRef<number>();

  const animate = useCallback(
    (targetValue: number) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const animate = (currentValue: number) => {
        const diff = targetValue - currentValue;
        const step = diff * 0.1; // 10% easing

        if (Math.abs(diff) < 0.1) {
          setValue(targetValue);
          return;
        }

        setValue(currentValue + step);
        animationRef.current = requestAnimationFrame(animate);
      };

      animate(value);
    },
    [value]
  );

  return [value, animate];
};
```

### 3. CLS Optimization

#### Layout Stability Techniques

```typescript
// Reserve space for dynamic content
const LayoutStabilizer = {
  // Skeleton placeholders
  createSkeleton: (width: number, height: number) => (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(90deg, #f0f0f0 25%, transparent 50%, #f0f0f0 75%, transparent)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite'
      }}
    />
  ),

  // Size-aware containers
  createSizeAwareContainer: (children: React.ReactNode) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: height: entry.contentRect.height
          });
        }
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    }, []);

    return (
      <div ref={containerRef} style={{ position: 'relative' }}>
        {children}
      </div>
    );
  }
};

// CLS-aware component
const CLSAwareImage = ({ src, alt, ...props }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div style={{ position: 'relative', ...dimensions }}>
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#f0f0f0'
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        {...props}
      />
    </div>
  );
};
```

#### Font Loading Optimization

```typescript
// Font loading with CLS prevention
const FontLoadingOptimizer = {
  // Font face with size adjustment
  createOptimizedFontFace: (fontFamily: string, src: string) => {
    return `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${src}') format('woff2');
        font-display: swap;
        size-adjust: 100%;
        ascent-override: 90%;
        descent-override: 22%;
      }
    `;
  },

  // Font size adjustment for layout stability
  adjustFontSize: (element: HTMLElement, targetSize: number) => {
    const computedStyle = window.getComputedStyle(element);
    const currentSize = parseFloat(computedStyle.fontSize);

    if (currentSize !== targetSize) {
      element.style.fontSize = `${targetSize}px`;
      element.style.lineHeight = '1.2';
    }
  }
};

// Dynamic content insertion
const DynamicContent = ({ children, placeholder }: DynamicContentProps) => {
  const [content, setContent] = useState<React.ReactNode>(placeholder);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Measure container before content change
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerRef.current.style.height = `${rect.height}px`;
    }

    setContent(children);

    return () => {
      if (containerRef.current) {
        containerRef.current.style.height = '';
      }
    };
  }, [children, placeholder]);

  return (
    <div ref={containerRef} style={{ overflow: 'hidden' }}>
      {content}
    </div>
  );
};
```

## Performance Monitoring

### 1. Real User Monitoring (RUM)

```typescript
// Web Vitals monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB, getINP } from 'web-vitals';

class WebVitalsMonitor {
  private metrics: WebVitalsMetrics = {};

  constructor() {
    this.setupMonitoring();
  }

  private setupMonitoring() {
    // Monitor all Core Web Vitals
    getCLS(this.handleCLS);
    getINP(this.handleINP);
    getLCP(this.handleLCP);
    getFCP(this.handleFCP);
    getTTFB(this.handleTTFB);

    // Monitor custom metrics
    this.monitorCustomMetrics();
  }

  private handleCLS = (metric: CLSMetric) => {
    this.metrics.cls = metric;
    this.reportMetric('CLS', metric);
  };

  private handleINP = (metric: INPMetric) => {
    this.metrics.inp = metric;
    this.reportMetric('INP', metric);
  };

  private handleLCP = (metric: LCPMetric) => {
    this.metrics.lcp = metric;
    this.reportMetric('LCP', metric);
  };

  private reportMetric = (name: string, metric: any) => {
    const rating = this.getRating(metric);

    // Send to analytics
    this.sendToAnalytics({
      name,
      value: metric.value,
      rating,
      id: metric.id,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Update UI indicators
    this.updateUIIndicators(name, rating);
  };

  private getRating(metric: any): 'good' | 'needs-improvement' | 'poor' {
    if (metric.rating === 'good') return 'good';
    if (metric.rating === 'poor') return 'poor';
    return 'needs-improvement';
  }

  private sendToAnalytics(data: AnalyticsData) {
    // Send to your analytics service
    fetch('/api/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  private updateUIIndicators(name: string, rating: string) {
    // Update performance indicators in the UI
    const indicator = document.querySelector(`[data-metric="${name}"]`);
    if (indicator) {
      indicator.setAttribute('data-rating', rating);
      indicator.className = `metric-indicator metric-${rating}`;
    }
  }
}

// Initialize monitoring
const monitor = new WebVitalsMonitor();
```

### 2. Laboratory Testing

```typescript
// Lighthouse CI/CD integration
const LighthouseCI = {
  runAudit: async (url: string): Promise<LighthouseResult> => {
    const lighthouse = await import('lighthouse');

    const result = await lighthouse(url, {
      onlyCategories: ['performance'],
      port: 9222,
      output: 'json',
      logLevel: 'error',
    });

    return result.lhr;
  },

  extractWebVitals: (result: LighthouseResult) => ({
    lcp: result.audits['largest-contentful-paint'].numericValue,
    inp: result.audits['interaction-to-next-paint'].numericValue,
    cls: result.audits['cumulative-layout-shift'].numericValue,
    fcp: result.audits['first-contentful-paint'].numericValue,
    ttfb: result.audits['server-response-time'].numericValue,
  }),

  generateReport: (result: LighthouseResult): string => {
    const vitals = this.extractWebVitals(result);

    return `
# Performance Report
## Core Web Vitals
- LCP: ${vitals.lcp.toFixed(2)}s (${this.getRating(vitals.lcp)})
- INP: ${vitals.inp.toFixed(2)}ms (${this.getRating(vitals.inp)})
- CLS: ${vitals.cls.toFixed(3)} (${this.getRating(vitals.cls)})
- FCP: ${vitals.fcp.toFixed(2)}s (${this.getRating(vitals.fcp)})
- TTFB: ${vitals.ttfb.toFixed(2)}ms (${this.getRating(vitals.ttfb)})

## Recommendations
${this.generateRecommendations(result)}
    `;
  },
};
```

## Advanced Optimization Techniques

### 1. Edge Computing and CDN

```typescript
// Edge optimization with Cloudflare Workers
export class EdgeOptimizer {
  // Image optimization at edge
  static optimizeImageAtEdge(request: Request): Response {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/images/')) {
      // Serve optimized images from edge
      return this.serveOptimizedImage(request);
    }

    return fetch(request);
  }

  private static async serveOptimizedImage(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const imagePath = url.pathname.slice(1); // Remove leading slash

    // Check if optimized version exists
    const optimizedPath = this.getOptimizedPath(imagePath);

    try {
      const optimizedImage = await fetch(`https://cdn.example.com/${optimizedPath}`);
      return new Response(optimizedImage.body, {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      // Fallback to original image
      return fetch(request);
    }
  }

  private static getOptimizedPath(imagePath: string): string {
    // Convert to WebP and resize
    const pathWithoutExt = imagePath.replace(/\.[^/.]+$/, '');
    return `${pathWithoutExt}.webp`;
  }
}

// Next.js middleware for edge optimization
export const config = {
  experimental: {
    runtime: 'edge',
    middleware: ['middleware-edge-optimization.ts'],
  },
};
```

### 2. Predictive Prefetching

```typescript
// Intelligent prefetching system
class PrefetchManager {
  private prefetchQueue: Map<string, PrefetchItem> = new Map();
  private observer: IntersectionObserver;

  constructor() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            this.prefetchLink(link.href);
          }
        });
      },
      { rootMargin: '50px' }
    );
  }

  observeLinks(links: HTMLAnchorElement[]) {
    links.forEach((link) => this.observer.observe(link));
  }

  private prefetchLink(href: string) {
    if (!this.prefetchQueue.has(href)) {
      this.prefetchQueue.set(href, { href, timestamp: Date.now() });

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  // Predictive prefetching based on user behavior
  predictivePrefetch(userBehavior: UserBehavior) {
    const predictions = this.predictNextPages(userBehavior);

    predictions.forEach((page) => {
      this.prefetchLink(page.url);
    });
  }

  private predictNextPages(userBehavior: UserBehavior): PredictedPage[] {
    // Simple prediction based on common patterns
    const predictions: PredictedPage[] = [];

    // Predict next page in sequence
    if (userBehavior.currentPage.match(/\/page\/\d+$/)) {
      const nextPage = parseInt(userBehavior.currentPage.match(/\/page\/(\d+)$/)[1]) + 1;
      predictions.push({
        url: userBehavior.currentPage.replace(/\/page\/\d+$/, `/page/${nextPage}`),
        confidence: 0.8,
      });
    }

    return predictions;
  }
}
```

### 3. Resource Hints and Priority

```typescript
// Resource optimization hints
const ResourceOptimizer = {
  // Critical resource hints
  addCriticalHints: () => {
    const hints = [
      {
        href: '/fonts/inter-var.woff2',
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      },
      {
        href: '/hero-image.webp',
        rel: 'preload',
        as: 'image',
        fetchpriority: 'high'
      },
      {
        href: '/critical.css',
        rel: 'preload',
        as: 'style'
      }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  },

  // DNS prefetch for external domains
  addDNSPrefetch: (domains: string[]) => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  },

  // Preconnect for external resources
  addPreconnect: (origins: string[]) => {
    origins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      document.head.appendChild(link);
    });
  }
};

// Usage in Next.js Head component
const Head = () => (
  <>
    <title>Optimized Page</title>

    {/* Critical CSS */}
    <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

    {/* Resource hints */}
    <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/hero-image.webp" as="image" fetchpriority="high" />

    {/* DNS prefetch */}
    <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    <link rel="dns-prefetch" href="//api.example.com" />

    {/* Preconnect */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://api.example.com" />
  </>
);
```

## Performance Budgeting

### 1. Budget Configuration

```typescript
// Performance budget configuration
interface PerformanceBudget {
  resourceSizes: {
    script: number;
    stylesheet: number;
    image: number;
    font: number;
    total: number;
  };

  timings: {
    fcp: number;
    lcp: number;
    ttfb: number;
    interactive: number;
  };

  thresholds: {
    cls: number;
    inp: number;
  };
}

const productionBudget: PerformanceBudget = {
  resourceSizes: {
    script: 150000, // 150KB
    stylesheet: 75000, // 75KB
    image: 500000, // 500KB
    font: 50000, // 50KB
    total: 1000000, // 1MB
  },

  timings: {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    ttfb: 800, // 800ms
    interactive: 3000, // 3s
  },

  thresholds: {
    cls: 0.1,
    inp: 200,
  },
};

// Budget validation
class BudgetValidator {
  static validateBudget(metrics: WebVitalsMetrics, budget: PerformanceBudget): BudgetReport {
    const violations: BudgetViolation[] = [];

    // Check resource sizes
    if (metrics.totalSize > budget.resourceSizes.total) {
      violations.push({
        type: 'resource-size',
        metric: 'total',
        actual: metrics.totalSize,
        budget: budget.resourceSizes.total,
        severity: 'high',
      });
    }

    // Check timings
    if (metrics.lcp > budget.timings.lcp) {
      violations.push({
        type: 'timing',
        metric: 'lcp',
        actual: metrics.lcp,
        budget: budget.timings.lcp,
        severity: 'high',
      });
    }

    // Check thresholds
    if (metrics.cls > budget.thresholds.cls) {
      violations.push({
        type: 'threshold',
        metric: 'cls',
        actual: metrics.cls,
        budget: budget.thresholds.cls,
        severity: 'medium',
      });
    }

    return {
      passed: violations.length === 0,
      violations,
      score: this.calculateScore(violations),
    };
  }

  private static calculateScore(violations: BudgetViolation[]): number {
    let score = 100;

    violations.forEach((violation) => {
      switch (violation.severity) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }
}
```

### 2. Budget Enforcement

```typescript
// CI/CD budget enforcement
const BudgetEnforcer = {
  enforceBudget: async (buildPath: string, budget: PerformanceBudget): Promise<void> => {
    // Run Lighthouse audit
    const lighthouse = await import('lighthouse');
    const result = await lighthouse(buildPath, {
      onlyCategories: ['performance'],
      output: 'json',
    });

    const metrics = this.extractMetrics(result.lhr);
    const report = BudgetValidator.validateBudget(metrics, budget);

    if (!report.passed) {
      console.error('Performance budget violations:');
      report.violations.forEach((violation) => {
        console.error(`- ${violation.metric}: ${violation.actual} > ${violation.budget}`);
      });

      throw new Error('Performance budget not met');
    }
  },

  extractMetrics: (lhr: any): WebVitalsMetrics => ({
    lcp: lrh.audits['largest-contentful-paint'].numericValue,
    inp: lrh.audits['interaction-to-next-paint'].numericValue,
    cls: lrh.audits['cumulative-layout-shift'].numericValue,
    fcp: lrh.audits['first-contentful-paint'].numericValue,
    ttfb: lrh.audits['server-response-time'].numericValue,
    totalSize: lrh.audits['total-byte-weight'].numericValue,
  }),
};
```

## Framework-Specific Optimizations

### 1. Next.js Optimizations

```typescript
// Next.js configuration for performance
const nextConfig = {
  experimental: {
    // Optimize images
    optimizeCss: true,
    optimizePackageImports: true,
    optimizeServerReact: true,

    // Streaming SSR
    streaming: true,

    // Partial Prerendering
    ppr: true,
  },

  // Image optimization
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Bundle optimization
  webpack: (config, { buildId, dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.runtimeChunk = 'single';
    }

    return config;
  },

  // Compression
  compress: true,

  // Headers for caching
  headers: async () => [
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/fonts/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

### 2. React Optimizations

```typescript
// React performance optimizations
const ReactOptimizer = {
  // Memoization strategies
  createMemoizedComponent: <P extends object>(
    Component: React.ComponentType<P>,
    areEqual?: (prevProps: P, nextProps: P) => boolean
  ) => {
    return React.memo(Component, areEqual);
  },

  // Callback optimization
  useOptimizedCallback: <T extends (...args: any[]) => (
    callback: T,
    deps: React.DependencyList
  ) => {
    const callbackRef = React.useRef(callback);

    return React.useCallback((...args) => callbackRef.current(...args), deps);
  },

  // State optimization
  useOptimizedState: <T>(initialValue: T) => {
    const [state, setState] = useState(initialValue);
    const stateRef = useRef(state);

    const setOptimizedState = React.useCallback((updater: T | ((prev: T) => T)) => {
      setState(prevState => {
        const newState = typeof updater === 'function' ? updater(prevState) : updater;
        return JSON.stringify(newState) === JSON.stringify(prevState) ? prevState : newState;
      });
    }, []);

    return [state, setOptimizedState];
  },

  // Virtual scrolling for large lists
  useVirtualScroll: <T>(items: T[], itemHeight: number) => {
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = React.useCallback(() => {
      if (containerRef.current) {
        const { scrollTop, clientHeight } = containerRef.current;
        const start = Math.floor(scrollTop / itemHeight);
        const visibleCount = Math.ceil(clientHeight / itemHeight);

        setVisibleRange({ start, end: start + visibleCount + 1 });
      }
    }, [itemHeight]);

    React.useEffect(() => {
      const container = containerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
      }
    }, [handleScroll, itemHeight]);

    const visibleItems = items.slice(visibleRange.start, visibleRange.end);

    return { visibleItems, containerRef };
  }
};
```

## Monitoring and Analytics

### 1. Real User Monitoring Dashboard

```typescript
// Performance dashboard component
const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch(`/api/metrics?range=${selectedTimeRange}`);
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const averageMetrics = useMemo(() => {
    if (metrics.length === 0) return null;

    const sum = metrics.reduce((acc, metric) => ({
      lcp: acc.lcp + metric.lcp,
      inp: acc.inp + metric.inp,
      cls: acc.cls + metric.cls,
      fcp: acc.fcp + metric.fcp,
      ttfb: acc.ttfb + metric.ttfb
    }), { lcp: 0, inp: 0, cls: 0, fcp: 0, ttfb: 0 });

    const count = metrics.length;

    return {
      lcp: sum.lcp / count,
      inp: sum.inp / count,
      cls: sum.cls / count,
      fcp: sum.fcp / count,
      ttfb: sum.ttfb / count
    };
  }, [metrics]);

  return (
    <div className="performance-dashboard">
      <h2>Core Web Vitals Dashboard</h2>

      <div className="metrics-overview">
        <MetricCard
          title="LCP"
          value={averageMetrics?.lcp.toFixed(2)}
          unit="s"
          rating={getRating(averageMetrics?.lcp, 'lcp')}
        />
        <MetricCard
          title="INP"
          value={averageMetrics?.inp.toFixed(0)}
          unit="ms"
          rating={getRating(averageMetrics?.inp, 'inp')}
        />
        <MetricCard
          title="CLS"
          value={averageMetrics?.cls.toFixed(3)}
          rating={getRating(averageMetrics?.cls, 'cls')}
        />
      </div>

      <div className="time-range-selector">
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option value="1h">Last hour</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <div className="metrics-chart">
        <MetricsChart data={metrics} />
      </div>
    </div>
  );
};
```

## Security Considerations

### Performance-Related Security Risks

#### 1. Resource Loading Security

```typescript
// Secure resource loading with CSP and integrity checks
const SecureResourceLoader = {
  loadScript: async (src: string, integrity?: string) => {
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';

    if (integrity) {
      script.integrity = integrity;
    }

    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Preload critical resources with security headers
  preloadCriticalResources: (resources: Resource[]) => {
    return resources.map((resource) => ({
      rel: 'preload',
      href: resource.url,
      as: resource.type,
      integrity: resource.integrity,
      crossOrigin: 'anonymous',
    }));
  },
};
```

#### 2. Performance Monitoring Security

```typescript
// Secure performance data collection
class SecurePerformanceMonitor {
  private readonly allowedOrigins = ['https://your-domain.com'];

  private sanitizeMetrics(metrics: WebVitalsMetrics): WebVitalsMetrics {
    // Remove sensitive information
    return {
      ...metrics,
      url: this.sanitizeUrl(metrics.url),
      userAgent: this.sanitizeUserAgent(metrics.userAgent),
    };
  }

  private sanitizeUrl(url: string): string {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
  }

  private sanitizeUserAgent(ua: string): string {
    // Remove version numbers and unique identifiers
    return ua
      .replace(/\/[\d.]+/g, '/x.x.x')
      .replace(/\([^)]*\)/g, '')
      .substring(0, 50);
  }

  async sendMetrics(metrics: WebVitalsMetrics): Promise<void> {
    const sanitizedMetrics = this.sanitizeMetrics(metrics);

    await fetch('/api/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.getCSRFToken(),
      },
      body: JSON.stringify(sanitizedMetrics),
    });
  }
}
```

### Privacy-First Performance Monitoring

#### 1. GDPR-Compliant Analytics

```typescript
// Privacy-compliant performance tracking
class PrivacyAwareAnalytics {
  private hasConsent: boolean = false;

  constructor() {
    this.checkConsent();
  }

  private checkConsent(): void {
    // Check for user consent before tracking
    this.hasConsent = document.cookie.includes('analytics-consent=true');
  }

  trackPerformanceEvent(eventName: string, data: any): void {
    if (!this.hasConsent) {
      return; // Respect user privacy preferences
    }

    // Minimize data collection
    const minimalData = {
      event: eventName,
      timestamp: Date.now(),
      // Only collect essential metrics
      ...(data.lcp && { lcp: Math.round(data.lcp) }),
      ...(data.inp && { inp: Math.round(data.inp) }),
      ...(data.cls && { cls: Math.round(data.cls * 1000) / 1000 }),
    };

    this.sendToAnalytics(minimalData);
  }

  private async sendToAnalytics(data: any): Promise<void> {
    // Use beacon API for reliable delivery
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(data));
    } else {
      await fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
      });
    }
  }
}
```

---

## Troubleshooting Guide

### Common Performance Issues and Solutions

#### 1. LCP Issues

##### Problem: Slow LCP due to large images

**Symptoms:**

- LCP > 4 seconds
- Largest element is always an image
- Network waterfall shows delayed image loading

**Solutions:**

```typescript
// Implement progressive image loading
const ProgressiveImageLoader = {
  // Convert images to WebP with multiple sizes
  optimizeImages: async (imageSrc: string) => {
    const sizes = [640, 768, 1024, 1280, 1536];

    return Promise.all(
      sizes.map((size) =>
        convertToWebP(imageSrc, {
          width: size,
          quality: 80,
          format: 'webp',
        })
      )
    );
  },

  // Implement blur-up technique
  createBlurPlaceholder: (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Create tiny blurred version
      canvas.width = 20;
      canvas.height = 20;
      ctx.filter = 'blur(10px)';
      ctx.drawImage(img, 0, 0, 20, 20);

      return canvas.toDataURL();
    };
  },
};
```

##### Problem: Server response time delays

**Symptoms:**

- TTFB > 1.5 seconds
- LCP consistently slow across all pages
- Network tab shows long waiting times

**Solutions:**

```typescript
// Implement edge caching and CDN optimization
const EdgeOptimization = {
  // Configure edge caching headers
  setCacheHeaders: (response: Response) => {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Edge-Cache-Tag', 'static-assets');
    response.headers.set('Surrogate-Control', 'max-age=86400');
  },

  // Implement edge-side includes for dynamic content
  edgeSideInclude: async (template: string, data: any) => {
    // Process template at edge for faster delivery
    const processed = await processTemplateAtEdge(template, data);
    return processed;
  },
};
```

#### 2. INP Issues

##### Problem: JavaScript blocking main thread

**Symptoms:**

- INP > 300ms during interactions
- Janky animations and scrolling
- Long tasks in DevTools (>50ms)

**Solutions:**

```typescript
// Implement main thread optimization
constMainThreadOptimizer = {
  // Break up long tasks
  scheduleTask: (task: () => void, priority: 'high' | 'normal' | 'low' = 'normal') => {
    if (priority === 'high' && 'scheduler' in window) {
      // Use scheduler API for high-priority tasks
      (window as any).scheduler.postTask(task, { priority: 'user-blocking' });
    } else {
      // Fallback to setTimeout for lower priority
      setTimeout(task, priority === 'low' ? 100 : 0);
    }
  },

  // Implement time slicing for heavy computations
  timeSlice: <T>(items: T[], processor: (item: T) => void, batchSize = 5) => {
    let index = 0;

    const processBatch = () => {
      const endIndex = Math.min(index + batchSize, items.length);

      for (let i = index; i < endIndex; i++) {
        processor(items[i]);
      }

      index = endIndex;

      if (index < items.length) {
        this.scheduleTask(processBatch, 'normal');
      }
    };

    processBatch();
  },
};
```

#### 3. CLS Issues

##### Problem: Dynamic content causing layout shifts

**Symptoms:**

- CLS > 0.25 on page load
- Elements jumping during content loading
- Poor visual stability

**Solutions:**

```typescript
// Implement layout stability techniques
const LayoutStabilityManager = {
  // Reserve space for dynamic content
  reserveSpace: (selector: string, dimensions: { width: number; height: number }) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.width = `${dimensions.width}px`;
      element.style.height = `${dimensions.height}px`;
      element.style.overflow = 'hidden';
    }
  },

  // Implement skeleton screens
  createSkeleton: (type: 'text' | 'image' | 'card', dimensions?: any) => {
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton skeleton-${type}`;

    if (dimensions) {
      Object.assign(skeleton.style, dimensions);
    }

    return skeleton;
  },

  // Font loading with size adjustment
  loadFontsWithStability: async (fonts: string[]) => {
    const fontPromises = fonts.map((font) => {
      return new Promise((resolve) => {
        const fontFace = new FontFace(font, `url(/fonts/${font}.woff2)`);
        fontFace.load().then(() => {
          document.fonts.add(fontFace);
          resolve(font);
        });
      });
    });

    await Promise.all(fontPromises);
  },
};
```

### Performance Debugging Checklist

#### Pre-Launch Checklist

- [ ] All images optimized and in modern formats (WebP/AVIF)
- [ ] Critical CSS inlined and non-critical CSS loaded asynchronously
- [ ] Fonts preloaded with font-display: swap
- [ ] JavaScript code-split and lazy-loaded
- [ ] Resource hints (preload, prefetch, preconnect) implemented
- [ ] CDN configured with proper caching headers
- [ ] Core Web Vitals measured and within thresholds

#### Runtime Monitoring

- [ ] Real User Monitoring (RUM) implemented
- [ ] Performance budgets enforced in CI/CD
- [ ] Alerting configured for performance regressions
- [ ] A/B testing for performance optimizations
- [ ] Regular performance audits scheduled

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Web.dev Learn Core Web Vitals](https://web.dev/learn-core-web-vitals/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Next.js OpenTelemetry Guide](https://nextjs.org/docs/app/guides/open-telemetry)

### Performance Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://webpagetest.org/)
- [Chrome DevTools Performance Panel](https://developers.google.com/web/tools/chrome-devtools/performance/)

### Research and Guides

- [Core Web Vitals Optimization Guide 2026](https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/)
- [Web Performance Best Practices 2026](https://solidappmaker.com/web-performance-in-2026-best-practices-for-speed-security-core-web-vitals/)
- [INP (Interaction to Next Paint) Guide](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide)

### Framework Documentation

- [Next.js Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance Best Practices](https://react.dev/optimizing-performance)
- [Vite Performance Guide](https://vite.dev/guide/build/#build-optimize)

### Monitoring and Analytics

- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/web-vitals)
- [New Relic Browser Monitoring](https://newrelic.com/browser/)
- [Datadog Real User Monitoring](https://docs.datadogh.com/real-user-monitoring/)

## Implementation

[Add content here]

## Best Practices

[Add content here]

## Testing

[Add content here]
