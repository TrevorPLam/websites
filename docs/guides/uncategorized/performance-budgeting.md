# performance-budgeting.md


## Overview

Performance budgets establish clear, measurable limits for various performance metrics and resource characteristics. By defining these budgets upfront and monitoring them continuously, teams can catch performance issues early and make informed decisions about feature development.

## Types of Performance Budgets

### Asset-Based Budgets

Asset-based budgets focus on the file size and quantity of web assets:

- **JavaScript bundle size**: Total compressed JavaScript per page
- **CSS bundle size**: Total compressed CSS per page
- **Image file sizes**: Individual and aggregate image file sizes
- **Font file sizes**: Web font file sizes and loading strategies
- **Total page weight**: Sum of all resources loaded per page

### Core Web Vitals Budgets

Core Web Vitals budgets target user experience metrics:

- **Largest Contentful Paint (LCP)**: ≤ 2.5 seconds
- **Interaction to Next Paint (INP)**: ≤ 200 milliseconds
- **Cumulative Layout Shift (CLS)**: ≤ 0.1

### Performance Metrics Budgets

Additional performance metrics to budget:

- **First Contentful Paint (FCP)**: ≤ 1.8 seconds
- **Time to Interactive (TTI)**: ≤ 3.8 seconds
- **Total Blocking Time (TBT)**: ≤ 200 milliseconds
- **Speed Index**: ≤ 3.4 seconds

## Setting Performance Budgets

### Industry Benchmarks

Based on 2026 standards and user expectations:

```javascript
const performanceBudgets = {
  // Asset budgets (compressed)
  javascript: {
    critical: '150KB', // Above-the-fold JS
    total: '250KB', // Total JS per page
  },
  css: {
    critical: '50KB', // Above-the-fold CSS
    total: '100KB', // Total CSS per page
  },
  images: {
    hero: '200KB', // Hero images
    content: '100KB', // Content images
    icons: '10KB', // Icons and illustrations
  },
  fonts: {
    woff2: '50KB', // Web font files
    total: '100KB', // Total fonts per page
  },

  // Performance metrics
  coreWebVitals: {
    LCP: 2500, // milliseconds
    INP: 200, // milliseconds
    CLS: 0.1, // unitless
  },

  // Network budgets
  requests: {
    total: 50, // Total requests per page
    critical: 10, // Critical rendering path requests
  },
};
```

### Device-Specific Budgets

Adjust budgets based on target devices:

```javascript
const deviceBudgets = {
  desktop: {
    javascript: '400KB',
    images: '500KB',
    totalWeight: '2MB',
  },
  mobile: {
    javascript: '150KB',
    images: '300KB',
    totalWeight: '1MB',
  },
  slowConnection: {
    javascript: '50KB',
    images: '100KB',
    totalWeight: '500KB',
  },
};
```

## Implementation Strategies

### Build-Time Enforcement

#### Webpack Bundle Analyzer

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
  performance: {
    maxAssetSize: 250000, // 250KB per asset
    maxEntrypointSize: 250000, // 250KB per entry point
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js');
    },
  },
};
```

#### Next.js Bundle Analysis

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', 'lodash'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
});
```

### Runtime Monitoring

#### Performance Budget Monitoring

```javascript
// performance-monitor.js
class PerformanceBudgetMonitor {
  constructor(budgets) {
    this.budgets = budgets;
    this.violations = [];
  }

  checkBudgets() {
    // Check Core Web Vitals
    this.checkCoreWebVitals();

    // Check resource sizes
    this.checkResourceSizes();

    // Check request counts
    this.checkRequestCounts();

    // Report violations
    this.reportViolations();
  }

  checkCoreWebVitals() {
    const vitals = this.getCoreWebVitals();

    Object.entries(this.budgets.coreWebVitals).forEach(([metric, limit]) => {
      if (vitals[metric] > limit) {
        this.violations.push({
          type: 'core-web-vitals',
          metric,
          actual: vitals[metric],
          limit,
          severity: 'high',
        });
      }
    });
  }

  checkResourceSizes() {
    const resources = performance.getEntriesByType('resource');

    resources.forEach((resource) => {
      const size = resource.transferSize || 0;
      const budget = this.getResourceBudget(resource.name);

      if (budget && size > budget) {
        this.violations.push({
          type: 'resource-size',
          resource: resource.name,
          actual: size,
          limit: budget,
          severity: 'medium',
        });
      }
    });
  }

  getResourceBudget(resourceName) {
    if (resourceName.endsWith('.js')) return this.budgets.javascript.total;
    if (resourceName.endsWith('.css')) return this.budgets.css.total;
    if (resourceName.match(/\.(png|jpg|jpeg|webp|svg)$/)) return this.budgets.images.content;
    return null;
  }

  reportViolations() {
    if (this.violations.length > 0) {
      console.warn('Performance budget violations:', this.violations);

      // Send to monitoring service
      this.sendToMonitoring(this.violations);
    }
  }

  sendToMonitoring(violations) {
    // Send to your monitoring service
    fetch('/api/performance-violations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        violations,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    });
  }
}

// Initialize monitoring
const monitor = new PerformanceBudgetMonitor(performanceBudgets);
window.addEventListener('load', () => monitor.checkBudgets());
```

### CI/CD Integration

#### Lighthouse CI Configuration

```yaml
# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        budgets: [
          {
            path: '/*.js',
            limit: '150KB',
            resourceType: 'script'
          },
          {
            path: '/*.css',
            limit: '50KB',
            resourceType: 'stylesheet'
          },
          {
            path: '/*.{png,jpg,jpeg,webp,svg}',
            limit: '100KB',
            resourceType: 'image'
          }
        ]
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

#### GitHub Actions Workflow

```yaml
# .github/workflows/performance-budget.yml
name: Performance Budget Check

on:
  pull_request:
    branches: [main]

jobs:
  performance-budget:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Check bundle sizes
        run: |
          node scripts/check-bundle-sizes.js

      - name: Upload performance reports
        uses: actions/upload-artifact@v3
        with:
          name: performance-reports
          path: .lighthouseci
```

## Budget Enforcement Strategies

### Progressive Enhancement

```javascript
// progressive-loading.js
class ProgressiveLoader {
  constructor() {
    this.connectionType = this.getConnectionType();
    this.deviceType = this.getDeviceType();
  }

  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType;
    }
    return '4g'; // Default assumption
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  shouldLoadResource(resourceType, size) {
    const budget = this.getBudgetForDevice();
    return budget[resourceType] >= size;
  }

  getBudgetForDevice() {
    if (this.connectionType === 'slow-2g' || this.connectionType === '2g') {
      return performanceBudgets.slowConnection;
    }
    if (this.deviceType === 'mobile') {
      return performanceBudgets.mobile;
    }
    return performanceBudgets.desktop;
  }

  loadScript(src, budget) {
    if (!this.shouldLoadResource('javascript', budget)) {
      console.warn(`Skipping ${src} - exceeds budget`);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }
}
```

### Resource Loading Optimization

```javascript
// optimized-loading.js
class OptimizedResourceLoader {
  constructor() {
    this.loadedResources = new Set();
    this.criticalResources = new Set();
  }

  async loadCriticalResources() {
    // Load critical CSS first
    await this.loadCriticalCSS();

    // Load critical JavaScript
    await this.loadCriticalJS();

    // Load above-the-fold images
    await this.loadCriticalImages();
  }

  async loadCriticalCSS() {
    const criticalCSS = await this.getCriticalCSS();
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  async loadCriticalJS() {
    const scripts = document.querySelectorAll('script[data-critical]');
    for (const script of scripts) {
      await this.loadScript(script.src);
    }
  }

  async loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  lazyLoadNonCritical() {
    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadResource(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('[data-lazy]').forEach((el) => {
      observer.observe(el);
    });
  }
}
```

## Monitoring and Alerting

### Real User Monitoring (RUM)

```javascript
// rum-monitoring.js
class RUMPerformanceMonitor {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.metrics = {};
  }

  collectMetrics() {
    // Core Web Vitals
    this.collectCoreWebVitals();

    // Resource timing
    this.collectResourceTiming();

    // Navigation timing
    this.collectNavigationTiming();

    // Send metrics
    this.sendMetrics();
  }

  collectCoreWebVitals() {
    // Use web-vitals library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((cls) => (this.metrics.CLS = cls));
      getFID((fid) => (this.metrics.FID = fid));
      getFCP((fcp) => (this.metrics.FCP = fcp));
      getLCP((lcp) => (this.metrics.LCP = lcp));
      getTTFB((ttfb) => (this.metrics.TTFB = ttfb));
    });
  }

  collectResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    this.metrics.resources = resources.map((resource) => ({
      name: resource.name,
      size: resource.transferSize,
      duration: resource.duration,
      type: this.getResourceType(resource.name),
    }));
  }

  collectNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0];
    this.metrics.navigation = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime,
    };
  }

  sendMetrics() {
    const payload = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metrics: this.metrics,
    };

    navigator.sendBeacon(this.apiEndpoint, JSON.stringify(payload));
  }
}
```

### Budget Violation Alerts

```javascript
// budget-alerts.js
class BudgetAlertManager {
  constructor(budgets, webhookUrl) {
    this.budgets = budgets;
    this.webhookUrl = webhookUrl;
    this.violationThreshold = 3; // Alert after 3 violations
  }

  checkAndAlert(violations) {
    const criticalViolations = violations.filter((v) => v.severity === 'high');

    if (criticalViolations.length >= this.violationThreshold) {
      this.sendAlert(criticalViolations);
    }
  }

  sendAlert(violations) {
    const alert = {
      type: 'performance-budget-violation',
      severity: 'high',
      violations: violations,
      url: window.location.href,
      timestamp: Date.now(),
      environment: process.env.NODE_ENV,
    };

    fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
  }
}
```

## Best Practices

### Budget Setting Guidelines

1. **Start with industry benchmarks** and adjust based on your specific needs
2. **Consider your target audience** and their typical devices/network conditions
3. **Account for growth** and set budgets that allow for reasonable feature additions
4. **Review and adjust** budgets quarterly based on real user data

### Performance Culture

1. **Make performance visible** with dashboards and regular reporting
2. **Include performance in code reviews** with automated checks
3. **Educate the team** about performance impact of different technologies
4. **Celebrate performance wins** to maintain motivation

### Technical Strategies

1. **Code splitting** to reduce initial bundle sizes
2. **Tree shaking** to eliminate unused code
3. **Image optimization** with modern formats and responsive loading
4. **Caching strategies** to reduce repeat load times
5. **CDN usage** for improved geographic performance

## Tools and Resources

### Budget Calculation Tools

- [Performance Budget Calculator](https://www.performancebudget.io/) - Interactive budget planning
- [Lighthouse Budgets](https://developers.google.com/web/tools/lighthouse/audits/budgets) - Built-in budget analysis
- [Bundle Analyzer](https://webpack.github.io/analyse/) - Webpack bundle analysis

### Monitoring Tools

- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated performance testing
- [Web Vitals Extension](https://github.com/GoogleChrome/web-vitals-extension) - Real-time metrics
- [SpeedCurve](https://speedcurve.com/) - Continuous performance monitoring

### Testing Tools

- [WebPageTest](https://www.webpagetest.org/) - Detailed performance analysis
- [PageSpeed Insights](https://pagespeed.web.dev/) - Google's performance analysis
- [GTmetrix](https://gtmetrix.com/) - Performance monitoring and optimization

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Web Performance Budgets](https://developers.google.com/web/tools/chrome-devtools/performances/performance-budgets)
- [Core Web Vitals](https://web.dev/vitals/)
- [Performance Budget Calculator](https://www.performancebudget.io/)
- [Lighthouse Performance Audits](https://developers.google.com/web/tools/lighthouse/audits/performance)
- [Web Performance Working Group](https://www.w3.org/webperf/)
- [Performance Budgeting Best Practices](https://web.dev/performance-budgeting-101/)