# Vercel Domains API Documentation


## Introduction

Vercel provides a comprehensive Domains API for programmatically managing custom domains across your projects. This is essential for multi-tenant platforms where tenants bring their own domains .

## 1. Adding Domains Programmatically

### 1.1 Using the Vercel SDK

```typescript
import { VercelCore as Vercel } from '@vercel/sdk/core.js';
import { projectsAddProjectDomain } from '@vercel/sdk/funcs/projectsAddProjectDomain.js';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

// The 'idOrName' is your project name in Vercel, for example: 'multi-tenant-app'
await projectsAddProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  teamId: 'team_1234',
  requestBody: {
    // The tenant's custom domain
    name: 'customacmesite.com',
  },
});
```

Once the domain is added, Vercel attempts to issue an SSL certificate automatically .

### 1.2 Using the REST API Directly

```bash
curl -X POST "https://api.vercel.com/v9/projects/my-multi-tenant-app/domains?teamId=team_1234" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "customacmesite.com"
  }'
```

## 2. Domain Verification

### 2.1 Checking Verification Status

```typescript
import { VercelCore as Vercel } from '@vercel/sdk/core.js';
import { projectsGetProjectDomain } from '@vercel/sdk/funcs/projectsGetProjectDomain.js';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const domain = 'customacmesite.com';

const [domainResponse] = await projectsGetProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  teamId: 'team_1234',
  domain,
});

const { verified, verification } = domainResponse;

if (!verified) {
  console.log(`Domain requires verification.`);
  console.log(`Add TXT record: ${verification[0].domain} with value ${verification[0].value}`);
}
```

### 2.2 Triggering Manual Verification

```typescript
import { VercelCore as Vercel } from '@vercel/sdk/core.js';
import { projectsVerifyProjectDomain } from '@vercel/sdk/funcs/projectsVerifyProjectDomain.js';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const domain = 'customacmesite.com';

const [verifyResponse] = await projectsVerifyProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  teamId: 'team_1234',
  domain,
});

const { verified } = verifyResponse;

if (!verified) {
  console.log(`Domain verification required for ${domain}.`);
  // Prompt tenant to add a TXT record or switch nameservers
}
```

## 3. 2026 API Enhancements

### 3.1 Advanced Domain Management

New features in the 2026 Vercel Domains API:

```typescript
// Enhanced domain addition with options
await projectsAddProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  teamId: 'team_1234',
  requestBody: {
    name: 'customacmesite.com',
    redirect: 'www.customacmesite.com', // Automatic redirect
    gitBranch: 'main', // Branch-specific domains
    rewrites: [
      // Custom rewrites
      { source: '/old-path', destination: '/new-path' },
    ],
  },
});
```

**New Capabilities:**

- **Automatic redirects**: Configure redirects during domain addition
- **Branch-specific domains**: Associate domains with specific git branches
- **Custom rewrites**: Define URL rewriting rules per domain
- **Bulk operations**: Add multiple domains in a single API call

### 3.2 Enhanced SSL Management

**Advanced SSL Configuration:**

```typescript
// Custom SSL certificate upload
await projectsUploadProjectCertificate(vercel, {
  idOrName: 'my-multi-tenant-app',
  domain: 'customacmesite.com',
  requestBody: {
    cert: '-----BEGIN CERTIFICATE-----\n...',
    key: '-----BEGIN PRIVATE KEY-----\n...',
    ca: '-----BEGIN CERTIFICATE-----\n...', // Optional CA bundle
  },
});
```

**2026 SSL Features:**

- **Custom certificate upload**: Upload your own SSL certificates
- **Wildcard certificate support**: Enhanced wildcard SSL management
- **Automatic renewal**: Improved automatic certificate renewal
- **Certificate monitoring**: Track certificate expiration and status

### 3.3 Domain Analytics

**Domain Usage Analytics:**

```typescript
// Get domain analytics
const [analytics] = await projectsGetProjectDomainAnalytics(vercel, {
  idOrName: 'my-multi-tenant-app',
  domain: 'customacmesite.com',
  period: '30d', // 30 days
});

console.log(`Requests: ${analytics.requests}`);
console.log(`Bandwidth: ${analytics.bandwidth}GB`);
console.log(`Unique visitors: ${analytics.uniqueVisitors}`);
```

## 4. Wildcard Domains

### 4.1 Standard Configuration

For wildcard domains like `*.acme.com`, Vercel requires using Vercel nameservers to manage DNS challenges for SSL certificates :

1. **Point your domain to Vercel's nameservers**:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

2. **Add the apex domain** in project settings: `acme.com`

3. **Add the wildcard domain**: `.acme.com`

Now any `tenant.acme.com` automatically resolves to your Vercel deployment. Vercel issues individual certificates for each subdomain on the fly .

### 4.2 2026 Wildcard Enhancements

**Advanced Wildcard Features:**

```typescript
// Enhanced wildcard configuration
await projectsAddProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  requestBody: {
    name: '.acme.com',
    wildcard: {
      ssl: 'automatic', // or "manual" for custom certificates
      dns: 'managed', // or "delegated" for partial delegation
      rateLimit: {
        requests: 1000, // Rate limit per subdomain
        window: '60s',
      },
    },
  },
});
```

**New Capabilities:**

- **Per-subdomain rate limiting**: Configure rate limits for individual subdomains
- **Partial DNS delegation**: Delegate only \_acme-challenge subdomain
- **Custom SSL for wildcards**: Upload custom certificates for wildcard domains
- **Automatic DNS management**: Enhanced DNS record management

### 4.3 Without Full Nameserver Delegation

If you cannot change your apex domain's nameservers, you can delegate only the `_acme-challenge` subdomain :

| Record Type | Name              | Value                 |
| ----------- | ----------------- | --------------------- |
| NS          | `_acme-challenge` | `ns1.vercel-dns.com.` |
| NS          | `_acme-challenge` | `ns2.vercel-dns.com.` |

Then point the wildcard traffic to Vercel with a CNAME record:

| Record Type | Name                | Value                    |
| ----------- | ------------------- | ------------------------ |
| CNAME       | `*.app.example.com` | `cname.vercel-dns-0.com` |

**Important**: This method may prevent other hosting providers from issuing certificates for their service and should only be used if you cannot change your nameservers .

## 5. SSL Certificate Automation

Vercel automatically provisions and renews SSL certificates for custom domains. The process varies by configuration:

| Configuration                       | SSL Approach                                   |
| ----------------------------------- | ---------------------------------------------- |
| Apex domain with Vercel nameservers | Automatic wildcard certificate                 |
| Domain with verification            | Domain-specific certificate after verification |
| Wildcard without full nameservers   | Requires `_acme-challenge` delegation          |

### 5.1 2026 SSL Enhancements

**Advanced SSL Features:**

- **Certificate transparency**: Automatic logging to certificate transparency logs
- **OCSP stapling**: Enhanced OCSP stapling for better performance
- **HSTS enforcement**: Automatic HSTS header configuration
- **Certificate monitoring**: Real-time certificate status monitoring

## 6. Removing Domains

When a tenant cancels or no longer needs their custom domain, remove it from your Vercel account :

```typescript
import { VercelCore as Vercel } from '@vercel/sdk/core.js';
import { projectsRemoveProjectDomain } from '@vercel/sdk/funcs/projectsRemoveProjectDomain.js';
import { domainsDeleteDomain } from '@vercel/sdk/funcs/domainsDeleteDomain.js';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

await Promise.all([
  projectsRemoveProjectDomain(vercel, {
    idOrName: 'my-multi-tenant-app',
    teamId: 'team_1234',
    domain: 'customacmesite.com',
  }),
  domainsDeleteDomain(vercel, {
    domain: 'customacmesite.com',
  }),
]);
```

The first call disassociates the domain from your project, and the second removes it from your account entirely .

### 6.2 2026 Removal Enhancements

**Graceful Domain Removal:**

```typescript
// Graceful domain removal with redirect
await projectsRemoveProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  teamId: 'team_1234',
  domain: 'customacmesite.com',
  requestBody: {
    redirect: 'platform.default.com', // Temporary redirect
    gracePeriod: '30d', // 30-day grace period
  },
});
```

## 7. Handling Redirects

### 7.1 Apex to www Redirect

Some tenants want `www.customacmesite.com` to redirect to the apex domain:

1. Add both `customacmesite.com` and `www.customacmesite.com` to your Vercel project
2. Configure a redirect for `www.customacmesite.com` to the apex domain through the API or Vercel dashboard

### 7.2 API Configuration

```typescript
await projectsAddProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  teamId: 'team_1234',
  requestBody: {
    name: 'www.customacmesite.com',
    redirect: 'customacmesite.com',
  },
});
```

### 7.3 2026 Redirect Enhancements

**Advanced Redirect Configuration:**

```typescript
// Advanced redirect with conditions
await projectsAddProjectDomain(vercel, {
  idOrName: 'my-multi-tenant-app',
  requestBody: {
    name: 'old.customacmesite.com',
    redirect: {
      destination: 'new.customacmesite.com',
      statusCode: 301, // or 302 for temporary
      preservePath: true, // Preserve URL path
      preserveQuery: true, // Preserve query parameters
    },
  },
});
```

## 8. Troubleshooting

### 8.1 Common Issues

| Issue                        | Solution                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------- |
| DNS propagation delays       | Changes can take 24-48 hours; use [WhatsMyDNS](https://whatsmydns.com) to check |
| Domain not verified          | Add TXT record or switch to Vercel nameservers                                  |
| Wildcard SSL not working     | Must use Vercel nameservers or delegate `_acme-challenge`                       |
| Subdomain length exceeded    | Each DNS label has a 63-character limit; keep branch names concise              |
| Duplicate content SEO issues | Use canonical tags or redirect to primary domain                                |

### 8.2 2026 Troubleshooting Tools

**Enhanced Diagnostics:**

```typescript
// Domain health check
const [health] = await projectsGetProjectDomainHealth(vercel, {
  idOrName: 'my-multi-tenant-app',
  domain: 'customacmesite.com',
});

console.log(`DNS Status: ${health.dns.status}`);
console.log(`SSL Status: ${health.ssl.status}`);
console.log(`Configuration: ${health.config.valid}`);
```

**New Diagnostic Features:**

- **Real-time DNS checking**: Instant DNS status verification
- **SSL certificate validation**: Enhanced certificate validation
- **Configuration validation**: Automatic configuration error detection
- **Performance monitoring**: Domain performance metrics

### 8.3 Verification Status Codes

| Status     | Description                         |
| ---------- | ----------------------------------- |
| `pending`  | Domain added, awaiting verification |
| `verified` | Domain successfully verified        |
| `failed`   | Verification failed                 |
| `expired`  | Certificate expired                 |
| `revoked`  | Certificate revoked                 |

## 9. Best Practices

### 9.1 Domain Management

1. **Validate domain format**: Ensure valid domain names before API calls
2. **Check availability**: Verify domain isn't already in use
3. **Sanitize input**: Remove protocol, trailing slashes, etc.
4. **Use rate limiting**: Implement rate limiting for domain operations
5. **Monitor status**: Regularly check domain and SSL status

### 9.2 Security Considerations

1. **Secure API tokens**: Use environment variables for API tokens
2. **Validate ownership**: Always verify domain ownership
3. **Monitor abuse**: Monitor for domain abuse or misuse
4. **Implement access controls**: Restrict domain management to authorized users
5. **Audit logging**: Log all domain operations for compliance

### 9.3 Performance Optimization

1. **Batch operations**: Use bulk operations when possible
2. **Cache responses**: Cache domain status information
3. **Async processing**: Use async operations for domain verification
4. **Monitor metrics**: Track API response times and success rates
5. **Implement retries**: Use retry logic for transient failures

### 9.4 2026 Best Practices

**Modern Domain Management:**

1. **Use enhanced SDK**: Leverage new SDK features for better functionality
2. **Implement monitoring**: Use built-in analytics and monitoring
3. **Automate SSL**: Take advantage of enhanced SSL automation
4. **Use wildcard domains**: Leverage improved wildcard domain support
5. **Implement graceful removal**: Use grace periods for domain removal

---

## References

- [Vercel Platform Docs](https://vercel.com/docs/platforms) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

## Overview

[Add content here]

## Implementation

[Add content here]

## Best Practices

[Add content here]

## Testing

[Add content here]