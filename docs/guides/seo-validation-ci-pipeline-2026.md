# SEO Validation CI Pipeline 2026 Guide

## Overview

SEO validation in CI/CD pipelines ensures that SEO best practices are maintained automatically, preventing regressions and ensuring production readiness. This guide covers implementing comprehensive SEO validation with structured data testing, sitemap validation, and automated quality gates.

## Key Concepts

### What is SEO Validation CI?

SEO validation CI automatically checks:

- **Structured data validity** against Schema.org standards
- **Sitemap format** and accessibility
- **Metadata completeness** and optimization
- **Core Web Vitals** performance metrics
- **Content accessibility** and SEO compliance

### Benefits of Automated SEO Validation

- **Prevent regressions** before deployment
- **Ensure consistency** across pages
- **Maintain quality standards** automatically
- **Reduce manual testing** overhead
- **Provide fast feedback** to developers

## Implementation Guide

### 1. Structured Data Validation

Create comprehensive tests for Schema.org markup:

```typescript
// packages/seo/src/__tests__/structured-data.test.ts
import { buildLocalBusinessSchema, buildFAQSchema } from '../structured-data';
import { SITE_CONFIGS } from '@repo/test-fixtures';

describe('Structured Data Validity', () => {
  describe('LocalBusiness schema', () => {
    it('produces valid @context and @type for law industry', () => {
      const schema = buildLocalBusinessSchema(SITE_CONFIGS.sterlingLaw);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('LegalService');
      expect(schema.name).toBeTruthy();
      expect(schema.address?.['@type']).toBe('PostalAddress');
      expect(schema.address?.addressLocality).toBeTruthy();
    });

    it('includes aggregateRating only when review count > 0', () => {
      const configWithReviews = {
        ...SITE_CONFIGS.sterlingLaw,
        identity: {
          ...SITE_CONFIGS.sterlingLaw.identity,
          reviewSummary: { average: 4.8, count: 127 },
        },
      };
      const schema = buildLocalBusinessSchema(configWithReviews);
      expect(schema.aggregateRating).toBeDefined();
      expect(Number(schema.aggregateRating?.ratingValue)).toBeGreaterThan(0);
    });

    it('excludes aggregateRating when no reviews', () => {
      const configNoReviews = {
        ...SITE_CONFIGS.sterlingLaw,
        identity: { ...SITE_CONFIGS.sterlingLaw.identity, reviewSummary: undefined },
      };
      const schema = buildLocalBusinessSchema(configNoReviews);
      expect(schema.aggregateRating).toBeUndefined();
    });

    it('validates required LocalBusiness fields', () => {
      const schema = buildLocalBusinessSchema(SITE_CONFIGS.sterlingLaw);

      // Required fields for LocalBusiness
      expect(schema.name).toBeDefined();
      expect(schema.url).toBeDefined();
      expect(schema.telephone).toBeDefined();
      expect(schema.address).toBeDefined();
    });
  });

  describe('FAQ schema', () => {
    const faqs = [
      { question: 'Do you offer free consultations?', answer: 'Yes, call us.' },
      { question: 'What areas do you serve?', answer: 'DFW metroplex.' },
    ];

    it('produces valid FAQPage schema', () => {
      const schema = buildFAQSchema(faqs);
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });

    it('never nests HTML in answer text', () => {
      const schemaWithHtml = buildFAQSchema([
        { question: 'Test?', answer: '<p>Answer with <b>HTML</b></p>' },
      ]);
      // Google strips HTML — return plain text
      expect(schemaWithHtml.mainEntity[0].acceptedAnswer.text).not.toContain('<');
    });

    it('validates FAQ structure requirements', () => {
      const schema = buildFAQSchema(faqs);

      // Check each question has required fields
      schema.mainEntity.forEach((item: any) => {
        expect(item.name).toBeDefined();
        expect(item.acceptedAnswer).toBeDefined();
        expect(item.acceptedAnswer.text).toBeDefined();
      });
    });
  });

  describe('Article schema', () => {
    it('produces valid Article schema with required fields', () => {
      const articleConfig = {
        title: 'Test Article',
        description: 'Test description',
        author: 'Test Author',
        publishedAt: '2024-01-01',
        image: 'https://example.com/image.jpg',
      };

      const schema = buildArticleSchema(articleConfig);
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe(articleConfig.title);
      expect(schema.description).toBe(articleConfig.description);
      expect(schema.author).toBeDefined();
      expect(schema.datePublished).toBe(articleConfig.publishedAt);
    });
  });

  describe('Breadcrumb schema', () => {
    it('produces valid BreadcrumbList schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
        { name: 'Legal Consulting', url: '/services/legal-consulting' },
      ];

      const schema = buildBreadcrumbSchema(breadcrumbs);
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0]['@type']).toBe('ListItem');
      expect(schema.itemListElement[0].position).toBe(1);
    });
  });
});
```

### 2. Sitemap Validation

Implement comprehensive sitemap testing:

```typescript
// packages/seo/src/__tests__/sitemap.test.ts
describe('Sitemap Validation', () => {
  describe('URL format and structure', () => {
    it('every URL is absolute and starts with https', async () => {
      const { default: sitemap } = await import('../../../sites/[law-firm-client]/src/app/sitemap');
      const entries = await sitemap();

      for (const entry of entries) {
        expect(entry.url).toMatch(/^https:\/\//);
        expect(entry.url).not.toMatch(/^http:/);
      }
    });

    it('no duplicate URLs', async () => {
      const { default: sitemap } = await import('../../../sites/[law-firm-client]/src/app/sitemap');
      const entries = await sitemap();
      const urls = entries.map((e: { url: string }) => e.url);
      expect(new Set(urls).size).toBe(urls.length);
    });

    it('includes required sitemap fields', async () => {
      const { default: sitemap } = await import('../../../sites/[law-firm-client]/src/app/sitemap');
      const entries = await sitemap();

      for (const entry of entries) {
        expect(entry.url).toBeDefined();
        expect(entry.lastModified).toBeDefined();
        expect(entry.changeFrequency).toBeDefined();
        expect(entry.priority).toBeDefined();

        // Validate priority range
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1);

        // Validate changeFrequency
        const validFrequencies = [
          'always',
          'hourly',
          'daily',
          'weekly',
          'monthly',
          'yearly',
          'never',
        ];
        expect(validFrequencies).toContain(entry.changeFrequency);
      }
    });

    it('validates lastModified format', async () => {
      const { default: sitemap } = await import('../../../sites/[law-firm-client]/src/app/sitemap');
      const entries = await sitemap();

      for (const entry of entries) {
        expect(entry.lastModified).toBeInstanceOf(Date);
        expect(entry.lastModified.getTime()).not.toBeNaN();
      }
    });
  });

  describe('Content coverage', () => {
    it('includes all required pages', async () => {
      const { default: sitemap } = await import('../../../sites/[law-firm-client]/src/app/sitemap');
      const entries = await sitemap();
      const urls = entries.map((e: { url: string }) => e.url);

      // Check for essential pages
      expect(urls).toContain(expect.stringContaining('/'));
      expect(urls).toContain(expect.stringContaining('/about'));
      expect(urls).toContain(expect.stringContaining('/contact'));
      expect(urls).toContain(expect.stringContaining('/services'));
    });

    it('includes all blog posts', async () => {
      const { default: sitemap } = await import('../../../sites/[law-firm-client]/src/app/sitemap');
      const entries = await sitemap();
      const urls = entries.map((e: { url: string }) => e.url);

      // Check blog posts are included
      const blogUrls = urls.filter((url) => url.includes('/blog/'));
      expect(blogUrls.length).toBeGreaterThan(0);
    });
  });
});
```

### 3. Metadata Validation

Create tests for metadata optimization:

```typescript
// packages/seo/src/__tests__/metadata.test.ts
import { generateMetadata } from '../metadata';
import { SITE_CONFIGS } from '@repo/test-fixtures';

describe('Metadata Validation', () => {
  describe('Page metadata', () => {
    it('generates complete metadata for home page', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      expect(metadata.title).toBeDefined();
      expect(metadata.description).toBeDefined();
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.twitter).toBeDefined();
      expect(metadata.robots).toBeDefined();
      expect(metadata.canonical).toBeDefined();
    });

    it('optimizes title length for SEO', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      // Title should be between 30-60 characters for optimal display
      expect(metadata.title?.length).toBeGreaterThanOrEqual(30);
      expect(metadata.title?.length).toBeLessThanOrEqual(60);
    });

    it('optimizes description length', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      // Description should be between 120-160 characters
      expect(metadata.description?.length).toBeGreaterThanOrEqual(120);
      expect(metadata.description?.length).toBeLessThanOrEqual(160);
    });

    it('includes Open Graph tags', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      expect(metadata.openGraph?.title).toBeDefined();
      expect(metadata.openGraph?.description).toBeDefined();
      expect(metadata.openGraph?.type).toBeDefined();
      expect(metadata.openGraph?.url).toBeDefined();
      expect(metadata.openGraph?.siteName).toBeDefined();
      expect(metadata.openGraph?.images).toBeDefined();
    });

    it('includes Twitter Card tags', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      expect(metadata.twitter?.card).toBeDefined();
      expect(metadata.twitter?.title).toBeDefined();
      expect(metadata.twitter?.description).toBeDefined();
      expect(metadata.twitter?.images).toBeDefined();
    });
  });

  describe('Structured data in metadata', () => {
    it('includes JSON-LD structured data', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      expect(metadata.other?.['application/ld+json']).toBeDefined();

      const structuredData = JSON.parse(metadata.other!['application/ld+json']);
      expect(structuredData['@context']).toBe('https://schema.org');
    });

    it('validates JSON-LD syntax', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      expect(() => {
        JSON.parse(metadata.other!['application/ld+json']);
      }).not.toThrow();
    });
  });

  describe('Robots meta tags', () => {
    it('sets appropriate robots directives', async () => {
      const metadata = await generateMetadata({
        page: 'home',
        config: SITE_CONFIGS.sterlingLaw,
      });

      expect(metadata.robots).toBeDefined();
      expect(metadata.robots).toContain('index');
      expect(metadata.robots).toContain('follow');
    });

    it('handles noindex pages', async () => {
      const metadata = await generateMetadata({
        page: 'private',
        config: SITE_CONFIGS.sterlingLaw,
        noindex: true,
      });

      expect(metadata.robots).toContain('noindex');
    });
  });
});
```

### 4. CI/CD Integration

Create GitHub Actions workflow for SEO validation:

```yaml
# .github/workflows/seo-validation.yml
name: SEO Validation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  seo-validation:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: pnpm install

      - name: Run SEO validation tests
        run: pnpm test:seo

      - name: Run structured data validation
        run: pnpm test -- --testPathPattern="structured-data"

      - name: Run sitemap validation
        run: pnpm test -- --testPathPattern="sitemap"

      - name: Run metadata validation
        run: pnpm test -- --testPathPattern="metadata"

      - name: Generate SEO report
        run: pnpm test:seo -- --coverage --coverageReporters=text-lcov > seo-report.txt

      - name: Upload SEO coverage report
        uses: actions/upload-artifact@v4
        with:
          name: seo-coverage-report
          path: seo-report.txt

      - name: Comment PR with SEO results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('seo-report.txt', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## SEO Validation Results\n\n${report}`
            });
```

### 5. SEO Quality Gates

Implement automated quality gates:

```typescript
// packages/seo/src/validation/quality-gates.ts
export interface SEOQualityGate {
  name: string;
  threshold: number;
  actual: number;
  passed: boolean;
  message: string;
}

export async function runSEOQualityGates(): Promise<SEOQualityGate[]> {
  const gates: SEOQualityGate[] = [];

  // Structured data validation gate
  const structuredDataResults = await validateAllStructuredData();
  gates.push({
    name: 'Structured Data Validity',
    threshold: 100,
    actual: structuredDataResults.passRate,
    passed: structuredDataResults.passRate >= 100,
    message: `${structuredDataResults.passed}/${structuredDataResults.total} schemas passed validation`,
  });

  // Sitemap validation gate
  const sitemapResults = await validateSitemap();
  gates.push({
    name: 'Sitemap Validity',
    threshold: 100,
    actual: sitemapResults.passRate,
    passed: sitemapResults.passRate >= 100,
    message: `${sitemapResults.passed}/${sitemapResults.total} URLs passed validation`,
  });

  // Metadata completeness gate
  const metadataResults = await validateMetadataCompleteness();
  gates.push({
    name: 'Metadata Completeness',
    threshold: 95,
    actual: metadataResults.completenessRate,
    passed: metadataResults.completenessRate >= 95,
    message: `${metadataResults.completenessRate.toFixed(1)}% pages have complete metadata`,
  });

  // Core Web Vitals gate
  const cwvResults = await validateCoreWebVitals();
  gates.push({
    name: 'Core Web Vitals',
    threshold: 75,
    actual: cwvResults.performanceScore,
    passed: cwvResults.performanceScore >= 75,
    message: `Performance score: ${cwvResults.performanceScore}`,
  });

  return gates;
}

export async function validateAllStructuredData() {
  // Implementation to validate all structured data
  const results = {
    passed: 0,
    total: 0,
    errors: [],
  };

  // Test LocalBusiness schema
  try {
    const schema = buildLocalBusinessSchema(SITE_CONFIGS.sterlingLaw);
    validateSchema(schema);
    results.passed++;
  } catch (error) {
    results.errors.push(`LocalBusiness schema: ${error.message}`);
  }
  results.total++;

  // Test FAQ schema
  try {
    const faqs = [{ question: 'Test?', answer: 'Test answer' }];
    const schema = buildFAQSchema(faqs);
    validateSchema(schema);
    results.passed++;
  } catch (error) {
    results.errors.push(`FAQ schema: ${error.message}`);
  }
  results.total++;

  return {
    ...results,
    passRate: results.total > 0 ? (results.passed / results.total) * 100 : 0,
  };
}
```

## Best Practices

### 1. Test Organization

**Test Structure**

- **Separate test files** for different SEO aspects
- **Use descriptive test names** that explain what's being tested
- **Group related tests** in describe blocks
- **Include edge cases** and error scenarios

**Test Data**

- **Use realistic test fixtures** that match production data
- **Mock external dependencies** for consistent testing
- **Parameterize tests** for different configurations
- **Maintain test data** in sync with schema changes

### 2. CI/CD Integration

**Workflow Configuration**

- **Run SEO tests on every push** and pull request
- **Fail builds** on SEO validation failures
- **Generate reports** for visibility
- **Comment on PRs** with test results

**Performance Optimization**

- **Cache dependencies** between test runs
- **Run tests in parallel** where possible
- **Use selective testing** for changed files
- **Optimize test execution** time

### 3. Quality Gates

**Threshold Settings**

- **Set realistic thresholds** based on business requirements
- **Gradually increase** quality standards
- **Monitor trends** over time
- **Adjust thresholds** based on analytics data

**Error Handling**

- **Provide clear error messages** for debugging
- **Include context** in failure reports
- **Suggest fixes** for common issues
- **Track recurring problems**

## Advanced Patterns

### 1. Visual SEO Testing

```typescript
// packages/seo/src/__tests__/visual-seo.test.ts
import { test, expect } from '@playwright/test';

test.describe('Visual SEO validation', () => {
  test('meta tags are present and correct', async ({ page }) => {
    await page.goto('/');

    // Check title tag
    const title = await page.title();
    expect(title).toBeDefined();
    expect(title.length).toBeGreaterThan(0);

    // Check meta description
    const description = (await page.getAttribute('meta[name="description"]')) as string;
    expect(description).toBeDefined();
    expect(description?.length).toBeGreaterThan(0);

    // Check Open Graph tags
    const ogTitle = (await page.getAttribute('meta[property="og:title"]')) as string;
    expect(ogTitle).toBeDefined();
    expect(ogTitle).toBe(title);
  });

  test('structured data is present and valid', async ({ page }) => {
    await page.goto('/');

    // Check for JSON-LD structured data
    const structuredData = await page.$eval(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      return scripts.map((script) => JSON.parse(script.textContent || '{}'));
    });

    expect(structuredData.length).toBeGreaterThan(0);
    expect(structuredData[0]['@context']).toBe('https://schema.org');
  });
});
```

### 2. Performance-Based SEO Testing

```typescript
// packages/seo/src/__tests__/performance-seo.test.ts
import { test, expect } from '@playwright/test';

test.describe('Performance SEO validation', () => {
  test('Core Web Vitals meet thresholds', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Get Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            LCP: entries.find((e) => e.name === 'largest-contentful-paint')?.startTime || 0,
            FID:
              entries.find((e) => e.name === 'first-input')?.processingStart -
                entries.find((e) => e.name === 'first-input')?.startTime || 0,
            CLS: entries.find((e) => e.name === 'cumulative-layout-shift')?.value || 0,
          };
          resolve(vitals);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      });
    });

    // Check thresholds (2026 standards)
    expect(metrics.LCP).toBeLessThan(2500); // 2.5s
    expect(metrics.FID).toBeLessThan(100); // 100ms
    expect(metrics.CLS).toBeLessThan(0.1); // 0.1
  });
});
```

### 3. Multi-tenant SEO Testing

```typescript
// packages/seo/src/__tests__/multi-tenant-seo.test.ts
describe('Multi-tenant SEO validation', () => {
  const tenants = ['tenant-1', 'tenant-2', 'tenant-3'];

  tenants.forEach((tenantId) => {
    describe(`Tenant: ${tenantId}`, () => {
      it('generates tenant-specific metadata', async () => {
        const config = await getTenantConfig(tenantId);
        const metadata = await generateMetadata({
          page: 'home',
          config,
        });

        expect(metadata.title).toContain(config.identity.siteName);
        expect(metadata.openGraph?.siteName).toBe(config.identity.siteName);
      });

      it('includes tenant-specific structured data', async () => {
        const config = await getTenantConfig(tenantId);
        const schema = buildLocalBusinessSchema(config);

        expect(schema.name).toBe(config.identity.siteName);
        expect(schema.address?.addressLocality).toBe(config.address?.city);
      });
    });
  });
});
```

## Monitoring and Reporting

### 1. SEO Dashboard

Create a comprehensive SEO monitoring dashboard:

```typescript
// components/SEODashboard.tsx
export function SEODashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/seo/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch SEO metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading SEO metrics...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">SEO Performance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SEOMetricCard
          title="Structured Data"
          value={metrics?.structuredData?.validity || 0}
          unit="%"
          threshold={100}
        />
        <SEOMetricCard
          title="Sitemap Health"
          value={metrics?.sitemap?.health || 0}
          unit="%"
          threshold={100}
        />
        <SEOMetricCard
          title="Metadata Coverage"
          value={metrics?.metadata?.coverage || 0}
          unit="%"
          threshold={95}
        />
        <SEOMetricCard
          title="Core Web Vitals"
          value={metrics?.performance?.score || 0}
          unit=""
          threshold={75}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Issues</h2>
        <SEOIssuesList issues={metrics?.issues || []} />
      </div>
    </div>
  );
}
```

### 2. Alert System

Implement alerts for SEO issues:

```typescript
// packages/seo/src/monitoring/alerts.ts
export class SEOAlertManager {
  private alerts: SEOAlert[] = [];

  async checkAndAlerts() {
    const gates = await runSEOQualityGates();

    for (const gate of gates) {
      if (!gate.passed) {
        await this.sendAlert({
          type: 'quality_gate_failure',
          message: gate.message,
          severity: gate.actual < gate.threshold * 0.8 ? 'high' : 'medium',
          gate: gate.name,
        });
      }
    }
  }

  private async sendAlert(alert: SEOAlert) {
    // Send to monitoring system
    await fetch('/api/alerts', {
      method: 'POST',
      body: JSON.stringify({
        ...alert,
        timestamp: new Date().toISOString(),
        service: 'seo-validation',
      }),
    });

    // Send to Slack if configured
    if (process.env.SLACK_WEBHOOK_URL) {
      await this.sendSlackAlert(alert);
    }
  }

  private async sendSlackAlert(alert: SEOAlert) {
    const payload = {
      text: `SEO Alert: ${alert.type}`,
      attachments: [
        {
          color: alert.severity === 'high' ? 'danger' : 'warning',
          fields: [
            { title: 'Gate', value: alert.gate, short: true },
            { title: 'Message', value: alert.message, short: false },
            { title: 'Severity', value: alert.severity, short: true },
          ],
        },
      ],
    };

    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
```

## Tools and Resources

### Testing Tools

- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **Lighthouse CI** - Performance testing
- **Schema Markup Validator** - Structured data testing
- **Google Rich Results Test** - Rich snippets testing

### CI/CD Platforms

- **GitHub Actions** - Workflow automation
- **Vercel** - Deployment with built-in SEO checks
- **CircleCI** - Custom CI/CD pipelines
- **GitLab CI** - Alternative CI platform

### Monitoring Tools

- **Google Search Console** - Search performance
- **Screaming Frog** - SEO crawling and analysis
- **Sitebulb** - Technical SEO auditing
- **Ahrefs** - Backlink and keyword analysis

## References

- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Jest Testing Framework](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

_Last updated: February 2026_
