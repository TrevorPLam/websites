<!--
/**
 * @file vercel-for-platforms-docs.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for vercel for platforms docs.
 * @entrypoints docs/guides/vercel-for-platforms-docs.md
 * @exports vercel for platforms docs
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# Vercel for Platforms: Official Guide

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Introduction

Vercel for Platforms provides the tools and infrastructure needed to build scalable multi-tenant applications. This guide covers domain mapping strategies, custom domain configuration, and best practices for platform engineering .

## 1. Domain Mapping Strategies

Multi-tenant platforms typically support two domain models:

### 1.1 Subdomain-Based Tenancy

Tenants receive subdomains of your platform domain:

```
tenant1.acme.com
tenant2.acme.com
docs.tenant1.acme.com
```

This model uses wildcard domains and requires Vercel nameservers for SSL automation .

### 1.2 Custom Domain Tenancy

Tenants bring their own domains:

```
customer-site.com
www.customer-site.com
```

This model requires domain verification and per-domain SSL certificates .

## 2. Wildcard Domain Configuration

### 2.1 Prerequisites

To offer subdomains like `*.acme.com`:

1. **Point your domain to Vercel's nameservers**:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

2. **Add the apex domain** in Vercel project settings: `acme.com`

3. **Add a wildcard domain**: `.acme.com`

### 2.2 How It Works

With wildcard configuration:

- Any `tenant.acme.com` automatically resolves to your Vercel deployment
- Vercel issues individual SSL certificates for each subdomain on the fly
- No per-tenant configuration required

### 2.3 2026 Wildcard Enhancements

**Advanced Wildcard Features:**

```typescript
// Enhanced wildcard configuration with 2026 features
await projectsAddProjectDomain(vercel, {
  idOrName: 'my-platform',
  requestBody: {
    name: '.acme.com',
    wildcard: {
      ssl: 'automatic',
      rateLimit: {
        requests: 1000,
        window: '60s',
        burst: 100,
      },
      analytics: true,
      security: {
        ddosProtection: true,
        botProtection: 'moderate',
      },
    },
  },
});
```

**New 2026 Capabilities:**

- **Per-subdomain rate limiting**: Individual rate limits for tenant subdomains
- **Advanced security**: Built-in DDoS and bot protection
- **Analytics integration**: Automatic analytics for wildcard domains
- **Performance monitoring**: Real-time performance metrics per subdomain

### 2.4 Alternative: Partial Delegation

If you cannot change nameservers, delegate only the `_acme-challenge` subdomain:

```dns
_acme-challenge.example.com. NS ns1.vercel-dns.com.
_acme-challenge.example.com. NS ns2.vercel-dns.com.
```

Then point traffic to Vercel:

```dns
*.app.example.com. CNAME cname.vercel-dns-0.com.
```

This allows wildcard SSL while keeping other DNS records with your current provider .

## 3. Custom Domain Management

### 3.1 Domain Addition Flow

```typescript
import { Vercel } from '@vercel/sdk';

export async function addTenantDomain(tenantId: string, domain: string) {
  const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });

  // 1. Add domain to project
  await vercel.projects.addProjectDomain({
    idOrName: 'my-platform',
    teamId: process.env.VERCEL_TEAM_ID,
    requestBody: { name: domain },
  });

  // 2. Get verification requirements
  const { verification } = await vercel.projects.getProjectDomain({
    idOrName: 'my-platform',
    domain,
  });

  // 3. Return verification instructions to tenant
  return {
    domain,
    verificationRequired: verification.length > 0,
    verificationRecords: verification.map((v) => ({
      type: v.type,
      domain: v.domain,
      value: v.value,
    })),
  };
}
```

### 3.2 2026 Enhanced Domain Management

**Advanced Domain Features:**

```typescript
export async function addTenantDomainEnhanced(
  tenantId: string,
  domain: string,
  options: DomainOptions
) {
  const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });

  // Enhanced domain addition with 2026 features
  await vercel.projects.addProjectDomain({
    idOrName: 'my-platform',
    teamId: process.env.VERCEL_TEAM_ID,
    requestBody: {
      name: domain,
      redirect: options.redirectTo,
      gitBranch: options.gitBranch,
      rewrites: options.rewrites,
      security: {
        ddosProtection: options.ddosProtection,
        botProtection: options.botProtection,
      },
      analytics: {
        enabled: options.analytics,
        customTags: options.customTags,
      },
    },
  });

  // Enhanced verification with real-time status
  const verification = await monitorDomainVerification(domain);

  return {
    domain,
    verification,
    estimatedTimeToLive: estimateSSLProvisioningTime(domain),
    recommendedActions: getRecommendedActions(domain, verification),
  };
}
```

### 3.3 Verification Process

```typescript
export async function checkDomainVerification(domain: string) {
  const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });

  const { verified } = await vercel.projects.getProjectDomain({
    idOrName: 'my-platform',
    domain,
  });

  if (!verified) {
    // Trigger manual verification
    const { verified: afterVerify } = await vercel.projects.verifyProjectDomain({
      idOrName: 'my-platform',
      domain,
    });

    return { verified: afterVerify };
  }

  return { verified: true };
}
```

## 4. SSL Certificate Management

### 4.1 Automatic Provisioning

Vercel automatically provisions SSL certificates for all custom domains:

| Domain Type                      | SSL Approach                          |
| -------------------------------- | ------------------------------------- |
| Wildcard subdomain               | Individual certificates per subdomain |
| Custom domain (verified)         | Domain-specific certificate           |
| Custom domain (with nameservers) | Automatic wildcard certificate        |

### 4.2 2026 SSL Enhancements

**Advanced SSL Features:**

```typescript
// Enhanced SSL configuration
await projectsUploadProjectCertificate(vercel, {
  idOrName: 'my-platform',
  domain: 'customacmesite.com',
  requestBody: {
    cert: '-----BEGIN CERTIFICATE-----\n...',
    key: '-----BEGIN PRIVATE KEY-----\n...',
    ca: '-----BEGIN CERTIFICATE-----\n...',
    options: {
      enforceHttps: true,
      hsts: {
        enabled: true,
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true,
      },
      ocspStapling: true,
      certificateTransparency: true,
    },
  },
});
```

**New SSL Capabilities:**

- **HSTS enforcement**: Automatic HTTP Strict Transport Security
- **OCSP stapling**: Enhanced OCSP stapling for performance
- **Certificate transparency**: Automatic CT logging
- **Custom certificate upload**: Upload your own certificates
- **Wildcard SSL**: Enhanced wildcard certificate management

### 4.3 Certificate Renewal

Vercel automatically renews certificates before expiration. 2026 enhancements include:

- **Renewal monitoring**: Real-time renewal status tracking
- **Failure alerts**: Automatic alerts for renewal failures
- **Backup certificates**: Automatic fallback certificate provisioning
- **Renewal analytics**: Track renewal success rates and timing

## 5. Routing and Rewrites

### 5.1 Tenant-Aware Routing

Use Next.js Middleware to route requests based on the tenant domain:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Extract tenant from host
  const tenant = extractTenantFromHost(host);

  if (!tenant) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // Add tenant to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenant.id);
  requestHeaders.set('x-tenant-theme', tenant.theme);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function extractTenantFromHost(host: string) {
  // Handle subdomain: tenant.acme.com
  if (host.endsWith('.acme.com')) {
    const subdomain = host.replace('.acme.com', '');
    return { id: subdomain, type: 'subdomain' };
  }

  // Handle custom domain: lookup in database
  return lookupTenantByDomain(host);
}
```

### 5.2 2026 Enhanced Routing

**Advanced Routing Features:**

```typescript
// Enhanced middleware with 2026 features
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Enhanced tenant extraction with caching
  const tenant = await extractTenantFromHostCached(host);

  if (!tenant) {
    // Enhanced 404 handling with analytics
    return NextResponse.rewrite(new URL('/404', request.url), {
      headers: {
        'x-tenant-not-found': host,
        'x-analytics-event': 'tenant-not-found',
      },
    });
  }

  // Enhanced request handling with security
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenant.id);
  requestHeaders.set('x-tenant-plan', tenant.plan);
  requestHeaders.set('x-tenant-features', JSON.stringify(tenant.features));

  // Rate limiting per tenant
  const rateLimitResult = await checkTenantRateLimit(tenant.id);
  if (rateLimitResult.exceeded) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'x-tenant-rate-limit': 'exceeded',
        'retry-after': rateLimitResult.retryAfter,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

### 5.3 Domain Aliases

For tenants with multiple domains (apex and www), configure redirects:

```typescript
await vercel.projects.addProjectDomain({
  idOrName: 'my-platform',
  requestBody: {
    name: 'www.customacmesite.com',
    redirect: 'customacmesite.com',
    redirectOptions: {
      statusCode: 301,
      preservePath: true,
      preserveQuery: true,
    },
  },
});
```

## 6. Deployment Strategies

### 6.1 Single Deployment, Multiple Domains

Most multi-tenant platforms use a single deployment that serves all tenants:

- One Vercel project
- One deployment (or preview deployments per branch)
- Multiple domains attached to the same project
- Tenant-aware routing in middleware

### 6.2 2026 Deployment Enhancements

**Advanced Deployment Features:**

```yaml
# Enhanced GitHub Actions workflow
name: Platform Deployment
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: 'my-platform'
          alias-domains: true
          # 2026 enhanced features
          prebuilt-domains: true
          domain-verification: automatic
          ssl-provisioning: enhanced
```

### 6.3 Isolated Deployments

For stricter isolation, consider per-tenant projects:

- Separate Vercel project per tenant
- Independent deployments
- Separate environment variables
- Higher management overhead

## 7. Platform SDK

### 7.1 Installation

```bash
npm install @vercel/sdk
```

### 7.2 2026 Enhanced SDK Features

**New SDK Capabilities:**

```typescript
import { Vercel } from '@vercel/sdk';

// Enhanced SDK with 2026 features
const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
  // 2026 enhancements
  userAgent: 'my-platform/1.0.0',
  timeout: 30000,
  retryConfig: {
    retries: 3,
    backoff: 'exponential',
  },
});

// Batch operations
await vercel.projects.addProjectDomainBatch({
  idOrName: 'my-platform',
  domains: [
    { name: 'tenant1.example.com' },
    { name: 'tenant2.example.com' },
    { name: 'tenant3.example.com' },
  ],
});

// Analytics integration
const analytics = await vercel.projects.getProjectAnalytics({
  idOrName: 'my-platform',
  period: '30d',
  metrics: ['requests', 'bandwidth', 'errors', 'latency'],
});
```

### 7.3 Key SDK Functions

| Function                      | Purpose                                    | 2026 Enhancement                   |
| ----------------------------- | ------------------------------------------ | ---------------------------------- |
| `projectsAddProjectDomain`    | Add domain to project                      | Batch operations, enhanced options |
| `projectsGetProjectDomain`    | Get domain details and verification status | Real-time status, analytics        |
| `projectsVerifyProjectDomain` | Trigger manual verification                | Enhanced verification with retries |
| `projectsRemoveProjectDomain` | Remove domain from project                 | Graceful removal with redirects    |
| `domainsDeleteDomain`         | Delete domain from account                 | Enhanced cleanup options           |
| `projectsGetProjectAnalytics` | Get domain analytics                       | Enhanced metrics, custom periods   |

## 8. Best Practices

### 8.1 Domain Validation

1. **Validate domain format**: Ensure valid domain names before API calls
2. **Check availability**: Verify domain isn't already in use
3. **Sanitize input**: Remove protocol, trailing slashes, etc.
4. **Use rate limiting**: Implement rate limiting for domain operations
5. **Monitor status**: Regularly check domain and SSL status

### 8.2 Error Handling

```typescript
try {
  await addTenantDomain(tenantId, domain);
} catch (error) {
  if (error.code === 'domain_already_in_use') {
    return { error: 'Domain already assigned to another tenant' };
  }
  if (error.code === 'invalid_domain') {
    return { error: 'Invalid domain format' };
  }
  if (error.code === 'rate_limit_exceeded') {
    return { error: 'Too many domain operations, please try again later' };
  }
  throw error;
}
```

### 8.3 Monitoring and Observability

Track domain-related metrics:

- Domain addition/removal counts
- Verification success rates
- SSL certificate status
- DNS propagation delays
- Performance metrics per domain

### 8.4 2026 Enhanced Monitoring

**Advanced Monitoring Features:**

```typescript
// Enhanced monitoring with 2026 features
const monitoring = {
  // Real-time domain health checks
  checkDomainHealth: async (domain: string) => {
    const health = await vercel.projects.getProjectDomainHealth(domain);
    return {
      dns: health.dns.status,
      ssl: health.ssl.status,
      performance: health.performance.latency,
      security: health.security.threatLevel,
    };
  },

  // Automated alerts
  setupAlerts: async (domain: string) => {
    await vercel.projects.configureAlerts({
      domain,
      alerts: {
        sslExpiration: { enabled: true, threshold: 30 },
        dnsFailure: { enabled: true },
        performanceDegradation: { enabled: true, threshold: 2000 },
        securityThreat: { enabled: true, level: 'high' },
      },
    });
  },

  // Analytics dashboard
  getAnalyticsDashboard: async (domain: string) => {
    const analytics = await vercel.projects.getProjectAnalytics({
      domain,
      period: '30d',
      metrics: ['requests', 'bandwidth', 'errors', 'latency', 'security'],
    });

    return {
      overview: analytics.overview,
      trends: analytics.trends,
      alerts: analytics.alerts,
      recommendations: analytics.recommendations,
    };
  },
};
```

### 8.5 SEO Considerations

- Use canonical URLs to avoid duplicate content
- Configure redirects between www and apex
- Set proper response headers
- Maintain consistent sitemaps per tenant
- Implement hreflang tags for internationalization

### 8.6 Security Best Practices

1. **Validate ownership**: Always verify domain ownership before adding
2. **Monitor abuse**: Implement monitoring for domain abuse
3. **Rate limiting**: Use per-tenant rate limiting
4. **SSL enforcement**: Force HTTPS for all domains
5. **Security headers**: Implement security headers per tenant
6. **Audit logging**: Log all domain operations for compliance


--- 

## References

- [Official Documentation](https://example.com) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns


## Overview

[Add content here]


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]
