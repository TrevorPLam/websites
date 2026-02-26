# Documentation Redirect Mappings

## Overview

This file contains redirect mappings for the documentation migration from `docs/guides/` to `docs/guides-new/` structure. These mappings should be implemented in Next.js redirects configuration and any web server redirect rules.

## Payment Processing Redirects

```typescript
// next.config.ts redirects
const paymentRedirects = [
  {
    source: '/docs/guides/payments-billing/stripe-documentation',
    destination: '/docs/guides-new/payments/payment-processing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/payments-billing/stripe-checkout-sessions',
    destination: '/docs/guides-new/payments/payment-processing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/payments-billing/stripe-customer-portal',
    destination: '/docs/guides-new/payments/payment-processing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/payments-billing/stripe-webhook-handler',
    destination: '/docs/guides-new/payments/payment-processing-guide',
    permanent: true,
  },
];
```

## SEO & Metadata Redirects

```typescript
const seoRedirects = [
  {
    source: '/docs/guides/seo-metadata/metadata-generation-system',
    destination: '/docs/guides-new/seo/seo-optimization-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/seo-metadata/dynamic-sitemap-generation',
    destination: '/docs/guides-new/seo/seo-optimization-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/seo-metadata/structured-data-system',
    destination: '/docs/guides-new/seo/seo-optimization-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/seo-metadata/dynamic-og-images',
    destination: '/docs/guides-new/seo/seo-optimization-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/multi-tenant/tenant-metadata-factory',
    destination: '/docs/guides-new/seo/seo-optimization-guide',
    permanent: true,
  },
];
```

## Email Redirects

```typescript
const emailRedirects = [
  {
    source: '/docs/guides/email/email-package-structure',
    destination: '/docs/guides-new/email/email-architecture-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/email/multi-tenant-email-routing',
    destination: '/docs/guides-new/email/email-architecture-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/email/unified-email-send',
    destination: '/docs/guides-new/email/email-architecture-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/email/email-integration-guide',
    destination: '/docs/guides-new/email/email-architecture-guide',
    permanent: true,
  },
];
```

## AI Integration Redirects

```typescript
const aiRedirects = [
  {
    source: '/docs/guides/ai-automation/ai-integration-guide',
    destination: '/docs/guides-new/ai/ai-integration-patterns',
    permanent: true,
  },
  {
    source: '/docs/guides/ai-automation/ide-agentic-setup-guide',
    destination: '/docs/guides-new/ai/ai-integration-patterns',
    permanent: true,
  },
  {
    source: '/docs/guides/best-practices/agentic-development',
    destination: '/docs/guides-new/ai/ai-integration-patterns',
    permanent: true,
  },
];
```

## Testing Redirects

```typescript
const testingRedirects = [
  {
    source: '/docs/guides/testing/playwright-best-practices',
    destination: '/docs/guides-new/testing/testing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/testing/testing-library-documentation',
    destination: '/docs/guides-new/testing/testing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/testing/vitest-documentation',
    destination: '/docs/guides-new/testing/testing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/testing/e2e-testing-suite-patterns',
    destination: '/docs/guides-new/testing/testing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/testing/axe-core-documentation',
    destination: '/docs/guides-new/testing/testing-guide',
    permanent: true,
  },
  {
    source: '/docs/guides/testing/playwright-documentation',
    destination: '/docs/guides-new/testing/testing-guide',
    permanent: true,
  },
];
```

## Complete Redirect Configuration

```typescript
// next.config.ts
const redirects = [
  ...paymentRedirects,
  ...seoRedirects,
  ...emailRedirects,
  ...aiRedirects,
  ...testingRedirects,
  
  // Category-level redirects
  {
    source: '/docs/guides/payments-billing',
    destination: '/docs/guides-new/payments',
    permanent: true,
  },
  {
    source: '/docs/guides/seo-metadata',
    destination: '/docs/guides-new/seo',
    permanent: true,
  },
  {
    source: '/docs/guides/email',
    destination: '/docs/guides-new/email',
    permanent: true,
  },
  {
    source: '/docs/guides/ai-automation',
    destination: '/docs/guides-new/ai',
    permanent: true,
  },
  {
    source: '/docs/guides/testing',
    destination: '/docs/guides-new/testing',
    permanent: true,
  },
];
```

## Apache/Nginx Redirect Examples

### Apache (.htaccess)

```apache
# Payment processing redirects
Redirect 301 "/docs/guides/payments-billing/stripe-documentation" "/docs/guides-new/payments/payment-processing-guide"
Redirect 301 "/docs/guides/payments-billing/stripe-checkout-sessions" "/docs/guides-new/payments/payment-processing-guide"
Redirect 301 "/docs/guides/payments-billing/stripe-customer-portal" "/docs/guides-new/payments/payment-processing-guide"
Redirect 301 "/docs/guides/payments-billing/stripe-webhook-handler" "/docs/guides-new/payments/payment-processing-guide"

# SEO redirects
Redirect 301 "/docs/guides/seo-metadata/metadata-generation-system" "/docs/guides-new/seo/seo-optimization-guide"
Redirect 301 "/docs/guides/seo-metadata/dynamic-sitemap-generation" "/docs/guides-new/seo/seo-optimization-guide"
Redirect 301 "/docs/guides/seo-metadata/structured-data-system" "/docs/guides-new/seo/seo-optimization-guide"
Redirect 301 "/docs/guides/seo-metadata/dynamic-og-images" "/docs/guides-new/seo/seo-optimization-guide"
Redirect 301 "/docs/guides/multi-tenant/tenant-metadata-factory" "/docs/guides-new/seo/seo-optimization-guide"
```

### Nginx

```nginx
# Payment processing redirects
location ~ ^/docs/guides/payments-billing/stripe- {
    return 301 /docs/guides-new/payments/payment-processing-guide;
}

# SEO redirects
location ~ ^/docs/guides/seo-metadata/ {
    return 301 /docs/guides-new/seo/seo-optimization-guide;
}

location = /docs/guides/multi-tenant/tenant-metadata-factory {
    return 301 /docs/guides-new/seo/seo-optimization-guide;
}
```

## Validation Script

```bash
#!/bin/bash
# validate-redirects.sh

echo "Validating documentation redirects..."

# Check if new files exist
echo "Checking target files..."
files=(
    "docs/guides-new/payments/payment-processing-guide.md"
    "docs/guides-new/seo/seo-optimization-guide.md"
    "docs/guides-new/email/email-architecture-guide.md"
    "docs/guides-new/ai/ai-integration-patterns.md"
    "docs/guides-new/testing/testing-guide.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Test redirects (requires curl)
echo "Testing redirects..."
redirects=(
    "http://localhost:3000/docs/guides/payments-billing/stripe-documentation"
    "http://localhost:3000/docs/guides/seo-metadata/metadata-generation-system"
)

for url in "${redirects[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [ "$response" = "301" ] || [ "$response" = "308" ]; then
        echo "✅ $url redirects correctly ($response)"
    else
        echo "❌ $url not redirecting ($response)"
    fi
done
```

## Monitoring

### Google Analytics

Track redirect usage to identify broken links:

```javascript
// Track redirect events
gtag('event', 'page_view', {
  page_location: destinationUrl,
  custom_map: {
    redirect_source: sourceUrl,
    redirect_type: 'documentation_migration'
  }
});
```

### Log Analysis

Monitor redirect patterns:

```bash
# Analyze redirect logs
grep "301" /var/log/nginx/access.log | grep "docs/guides/" | 
  awk '{print $7}' | sort | uniq -c | sort -nr
```

## Maintenance

1. **Monthly Review**: Check redirect usage and remove unused redirects after 6 months
2. **Link Validation**: Run automated link checking weekly
3. **Documentation Updates**: Update any remaining internal references
4. **External Links**: Update external sites that link to old URLs

## Timeline

- **Phase 1** (Immediate): Implement all redirects
- **Phase 2** (1 month): Monitor usage and fix issues
- **Phase 3** (3 months): Review and optimize
- **Phase 4** (6 months): Begin removing unused redirects
- **Phase 5** (12 months): Complete cleanup
