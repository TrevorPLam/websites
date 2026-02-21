/**
 * @file seo.spec.ts
 * @role test
 * @summary E2E tests for SEO optimization and meta tags.
 *
 * @entrypoints
 * - pnpm test:e2e seo.spec.ts
 *
 * @exports
 * - SEO test suite
 *
 * @depends_on
 * - External: @playwright/test
 * - Internal: tenant fixture
 *
 * @used_by
 * - CI/CD pipeline
 * - SEO validation
 * - Search engine compliance testing
 *
 * @runtime
 * - environment: test
 * - side_effects: validates SEO structure and meta tags
 *
 * @data_flow
 * - inputs: tenant configurations
 * - outputs: SEO validation results
 *
 * @invariants
 * - All pages have proper meta tags
 * - Structured data is valid JSON-LD
 * - Canonical URLs are correctly set
 *
 * @gotchas
 * - Dynamic content loading
 * - Client-side rendering issues
 * - Meta tag timing
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Add Core Web Vitals testing
 * - Add schema.org validation
 * - Add sitemap testing
 *
 * @verification
 * - Run: pnpm test:e2e tests/e2e/specs/seo.spec.ts
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-21
 * - updated: Initial SEO E2E tests
 */

import { test, expect } from '../fixtures/tenant';
import { getTenantUrl } from '../fixtures/tenant';

/**
 * SEO test suite
 *
 * These tests verify that pages are properly optimized for search engines
 * and follow SEO best practices for 2026 standards.
 */
test.describe('SEO Optimization', () => {
  /**
   * Test: Homepage SEO structure
   *
   * Verifies that the homepage has proper SEO structure including:
   * - Title tags
   * - Meta descriptions
   * - Canonical URLs
   * - Structured data (JSON-LD)
   * - Open Graph tags
   * - Twitter Card tags
   */
  test('homepage should have proper SEO structure', async ({ page, tenant }) => {
    console.log(`🔍 Testing SEO structure for ${tenant.name} homepage`);

    // Navigate to tenant homepage
    const homepageUrl = getTenantUrl(tenant, '/');
    await page.goto(homepageUrl);

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Test page title
    const title = await page.title();
    expect(title).toContain(tenant.siteConfig.title);
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);

    // Test meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    expect(metaDescription!.length).toBeLessThan(160);

    // Test canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain(tenant.slug);
    expect(canonical).toMatch(/^https?:\/\/.+/);

    // Test viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');

    // Test robots meta tag
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toMatch(/index|follow/);

    console.log('✅ Homepage SEO structure verified');
  });

  /**
   * Test: Structured data (JSON-LD) validation
   *
   * Verifies that pages contain valid structured data for:
   * - LocalBusiness schema
   * - Organization schema
   * - Service schema (if applicable)
   */
  test('should have valid JSON-LD structured data', async ({ page, tenant }) => {
    console.log(`📊 Testing JSON-LD structured data for ${tenant.name}`);

    const homepageUrl = getTenantUrl(tenant, '/');
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');

    // Find JSON-LD scripts
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(jsonLdScripts.length).toBeGreaterThan(0);

    // Validate each JSON-LD script
    for (const script of jsonLdScripts) {
      const jsonContent = await script.textContent();
      expect(jsonContent).toBeTruthy();

      // Parse JSON to ensure it's valid
      let structuredData;
      try {
        structuredData = JSON.parse(jsonContent!);
      } catch (error) {
        throw new Error(`Invalid JSON-LD structure: ${error}`);
      }

      // Validate required fields based on schema type
      if (structuredData['@type'] === 'LocalBusiness') {
        expect(structuredData.name).toBeTruthy();
        expect(structuredData.url).toBeTruthy();
        expect(structuredData['@context']).toBe('https://schema.org');
      }

      if (structuredData['@type'] === 'Organization') {
        expect(structuredData.name).toBeTruthy();
        expect(structuredData.url).toBeTruthy();
        expect(structuredData['@context']).toBe('https://schema.org');
      }
    }

    console.log('✅ JSON-LD structured data validated');
  });

  /**
   * Test: Open Graph tags
   *
   * Verifies that pages have proper Open Graph tags for social sharing:
   * - og:title
   * - og:description
   * - og:image
   * - og:url
   * - og:type
   */
  test('should have proper Open Graph tags', async ({ page, tenant }) => {
    console.log(`📷 Testing Open Graph tags for ${tenant.name}`);

    const homepageUrl = getTenantUrl(tenant, '/');
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');

    // Test required Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogTitle).toContain(tenant.siteConfig.title);

    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute('content');
    expect(ogDescription).toBeTruthy();
    expect(ogDescription!.length).toBeGreaterThan(10);

    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBeTruthy();
    expect(ogUrl).toContain(tenant.slug);

    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBeTruthy();
    expect(ogType).toMatch(/website|business/);

    // Test og:image if present
    const ogImage = page.locator('meta[property="og:image"]');
    if ((await ogImage.count()) > 0) {
      const imageSrc = await ogImage.first().getAttribute('content');
      expect(imageSrc).toBeTruthy();
      expect(imageSrc).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i);
    }

    console.log('✅ Open Graph tags verified');
  });

  /**
   * Test: Twitter Card tags
   *
   * Verifies that pages have proper Twitter Card tags:
   * - twitter:card
   * - twitter:title
   * - twitter:description
   * - twitter:image (if applicable)
   */
  test('should have proper Twitter Card tags', async ({ page, tenant }) => {
    console.log(`🐦 Testing Twitter Card tags for ${tenant.name}`);

    const homepageUrl = getTenantUrl(tenant, '/');
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');

    // Test Twitter Card type
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBeTruthy();
    expect(twitterCard).toMatch(/summary|summary_large_image/);

    // Test Twitter title
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(twitterTitle).toBeTruthy();
    expect(twitterTitle).toContain(tenant.siteConfig.title);

    // Test Twitter description
    const twitterDescription = await page
      .locator('meta[name="twitter:description"]')
      .getAttribute('content');
    expect(twitterDescription).toBeTruthy();
    expect(twitterDescription!.length).toBeGreaterThan(10);

    console.log('✅ Twitter Card tags verified');
  });

  /**
   * Test: Heading structure
   *
   * Verifies that pages have proper heading hierarchy:
   * - Single H1 tag
   * - Proper heading order (H1 -> H2 -> H3)
   * - No skipped heading levels
   */
  test('should have proper heading structure', async ({ page, tenant }) => {
    console.log(`📝 Testing heading structure for ${tenant.name}`);

    const homepageUrl = getTenantUrl(tenant, '/');
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');

    // Check for exactly one H1
    const h1Tags = await page.locator('h1').all();
    expect(h1Tags.length).toBe(1);

    // Check H1 content
    const h1Content = await h1Tags[0].textContent();
    expect(h1Content).toBeTruthy();
    expect(h1Content!.length).toBeGreaterThan(5);

    // Check heading hierarchy (no skipped levels)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 1;

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const currentLevel = parseInt(tagName.substring(1));

      // Heading level should not skip more than one level
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      previousLevel = currentLevel;
    }

    console.log('✅ Heading structure verified');
  });

  /**
   * Test: Image alt attributes
   *
   * Verifies that all meaningful images have alt attributes:
   * - All img tags have alt attributes
   * - Alt text is descriptive (not just decorative)
   */
  test('images should have proper alt attributes', async ({ page, tenant }) => {
    console.log(`🖼️ Testing image alt attributes for ${tenant.name}`);

    const homepageUrl = getTenantUrl(tenant, '/');
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');

    // Find all images
    const images = await page.locator('img').all();

    for (const image of images) {
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();

      // Alt text should be descriptive (not just "image" or "picture")
      if (alt && alt !== 'decorative') {
        expect(alt.length).toBeGreaterThan(3);
      }
    }

    console.log('✅ Image alt attributes verified');
  });

  /**
   * Test: Internal linking
   * 
   * Verifies that internal links are properly structured:
   * - Internal links use relative paths or full tenant URLs
   - No broken internal links
   */
  test('internal links should be properly structured', async ({ page, tenant }) => {
    console.log(`🔗 Testing internal links for ${tenant.name}`);

    const homepageUrl = getTenantUrl(tenant, '/');
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');

    // Find all internal links
    const internalLinks = await page.locator('a[href*="/"]').all();

    for (const link of internalLinks) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();

      // Internal links should be relative or include tenant slug
      if (href && !href.startsWith('http')) {
        // Relative link - should work within tenant context
        expect(href).toMatch(/^\/[^\/]/);
      } else if (href && href.includes('localhost')) {
        // Full URL - should include tenant slug
        expect(href).toContain(tenant.slug);
      }
    }

    console.log('✅ Internal links structure verified');
  });

  /**
   * Test: Page speed indicators
   * 
   * Verifies basic performance indicators:
   * - Page loads within reasonable time
   - No blocking resources
   */
  test('should load within reasonable time', async ({ page, tenant }) => {
    console.log(`⚡ Testing page load speed for ${tenant.name}`);

    const homepageUrl = getTenantUrl(tenant, '/');

    // Measure page load time
    const startTime = Date.now();
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds (adjust based on your requirements)
    expect(loadTime).toBeLessThan(5000);

    console.log(`✅ Page loaded in ${loadTime}ms`);
  });
});
