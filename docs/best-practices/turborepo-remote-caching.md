# Turborepo Remote Caching: Official Guide

## Introduction

Remote caching is a powerful feature in Turborepo that shares build artifacts across your team and CI/CD pipelines. Instead of each developer or CI machine rebuilding the same code, they can download cached results, dramatically reducing build times .

## 1. Core Concept

Turborepo's remote cache works by:
1. Computing a hash for each task based on its inputs (source files, dependencies, environment variables)
2. Storing task outputs (build artifacts, logs) in a remote server
3. Retrieving cached results when the same hash is encountered on any machine

This ensures that **only one machine ever needs to build a given hash** .

## 2. Vercel Remote Cache (Official Solution)

Vercel provides a hosted remote cache that's free for all plans .

### 2.1 Setup

**Step 1: Authenticate with Vercel**
```bash
npx turbo login
```
This authenticates the Turborepo CLI with your Vercel account .

**Step 2: Link to Remote Cache**
```bash
npx turbo link
```
This connects your local repository to a Vercel project and enables remote caching .

### 2.2 Verification

After setup, run any build command:
```bash
turbo build
```

You should see output indicating cache hits from the remote cache.

## 3. Custom Remote Cache Implementation

Turborepo follows an open specification, allowing teams to implement their own remote cache servers .

### 3.1 Cache Server API Specification

A compatible remote cache server must implement the following endpoints :

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v8/artifacts/{hash}` | GET | Download cached artifact |
| `/v8/artifacts/{hash}` | PUT | Upload artifact to cache |
| `/v8/artifacts/{hash}` | HEAD | Check if artifact exists |
| `/v8/artifacts` | POST | Query artifact information |
| `/v8/artifacts/events` | POST | Record usage events |
| `/v8/artifacts/status` | GET | Service health check |
| `/v8/openapi` | GET | OpenAPI specification |

### 3.2 Azure Functions Implementation Example

The `@azure-utils/turborepo-cache` package provides a ready-to-deploy implementation using Azure Functions .

**Installation:**
```bash
npm i -D @azure-utils/turborepo-cache
```

**Basic Setup:**
```typescript
// src/index.ts
import { registerCacheRouter } from "@azure-utils/turborepo-cache";

registerCacheRouter({
  // Token for authentication (defaults to env['TURBO_TOKEN'])
  turboToken: "",
  // Azure Storage connection (defaults to env['AzureWebJobsStorage'])
  connectionString: "",
  // Container name (defaults to env['CONTAINER_NAME'] or 'turborepocache')
  containerName: "",
  // Enable health check endpoint
  healthCheck: true,
});
```

**Configure `host.json`:**
```json
{
  "extensions": {
    "http": {
      "routePrefix": ""
    }
  }
}
```
This removes the `/api` prefix that would otherwise break compatibility .

### 3.3 S3-Compatible Implementations

For AWS environments, you can implement the cache server using:
- **AWS Lambda** with API Gateway
- **S3** as the storage backend
- **DynamoDB** for metadata tracking

The implementation must follow the same API specification.

## 4. 2026 Enhancements

### 4.1 OIDC Authentication

New security features for enterprise environments:

```bash
# OIDC-based authentication (no tokens required)
npx turbo login --oidc
```

- **Zero-trust architecture**: Security-first design for remote caching
- **Role-based access control**: Granular permissions for cache access
- **Audit logging**: Comprehensive tracking of cache operations

### 4.2 Intelligent Cache Compression

Enhanced compression algorithms for better performance:

- **Adaptive compression**: Automatically selects optimal compression based on artifact type
- **Delta compression**: Only stores changes between similar artifacts
- **Bandwidth optimization**: Up to 60% reduction in data transfer

### 4.3 Predictive Caching

AI-powered cache preloading:

```bash
# Enable predictive caching
turbo build --predictive-cache
```

- **Machine learning models**: Predict likely future cache requests
- **Background preloading**: Automatically warm cache for likely builds
- **Usage pattern analysis**: Learns from team behavior patterns

### 4.4 Cross-Region Replication

Global cache distribution for distributed teams:

- **Automatic replication**: Cache artifacts replicated across regions
- **Geographic routing**: Automatically serves from nearest cache location
- **Consistency guarantees**: Strong consistency across all regions

## 5. Configuration

### 5.1 Environment Variables

| Variable | Purpose |
|----------|---------|
| `TURBO_TOKEN` | Authentication token for remote cache |
| `TURBO_TEAM` | Team identifier for Vercel cache |
| `TURBO_API` | Custom API endpoint (for self-hosted) |
| `TURBO_REMOTE_CACHE_TIMEOUT` | Timeout in milliseconds |
| `TURBO_OIDC_PROVIDER` | OIDC provider for authentication |
| `TURBO_CACHE_COMPRESSION` | Compression level (1-9) |
| `TURBO_PREDICTIVE_CACHE` | Enable AI-powered predictive caching |

### 5.2 Using Custom Cache in CI

```yaml
# GitHub Actions example with custom cache
name: CI
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      TURBO_API: ${{ secrets.TURBO_API }}
      TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
      TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
      TURBO_OIDC_PROVIDER: ${{ secrets.OIDC_PROVIDER }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build with remote cache
        run: npx turbo build --predictive-cache
```

## 6. Cache Invalidation and Keys

Turborepo automatically generates cache keys based on:
- Source files (contents, not timestamps)
- Environment variables
- Lockfile changes
- Task dependencies

This ensures that cache entries are only reused when **exactly the same inputs** are present.

## 7. Monitoring and Analytics

### 7.1 Enhanced Metrics Dashboard

New analytics capabilities for cache optimization:

- **Real-time cache hit rates**: Live monitoring of cache effectiveness
- **Performance trends**: Historical analysis of cache performance
- **Cost optimization insights**: Recommendations for reducing cache costs
- **Geographic distribution**: Cache usage by region and user location

### 7.2 Custom Metrics Integration

```typescript
// Custom metrics integration
import { CacheMetrics } from "@turbo/cache-analytics";

const metrics = new CacheMetrics({
  endpoint: process.env.CUSTOM_METRICS_ENDPOINT,
  apiKey: process.env.CUSTOM_METRICS_KEY,
});

// Track custom events
metrics.trackCacheHit({ task: 'build', duration: 1200 });
metrics.trackCacheMiss({ task: 'test', reason: 'input-changed' });
```

## 8. Security Considerations

1. **Authentication**: Always secure your cache server with tokens or OIDC
2. **Encryption**: Use HTTPS for all endpoints with TLS 1.3
3. **Access Control**: Restrict who can read/write to the cache
4. **Data Isolation**: Use separate containers/namespaces per team/project
5. **Retention Policies**: Implement artifact cleanup to manage storage costs
6. **Audit Trails**: Log all cache operations for compliance

## 9. Troubleshooting

**Cache misses when expected hits:**
- Check that all inputs are properly considered
- Verify environment variables are consistent
- Ensure lockfile hasn't changed
- Review predictive cache settings

**Authentication errors:**
- Verify `TURBO_TOKEN` is set correctly
- Check OIDC provider configuration
- Validate token permissions

**Performance issues:**
- Consider geographic proximity to cache server
- Monitor network latency
- Implement regional cache replication for global teams
- Check compression settings

**High storage costs:**
- Review retention policies
- Implement automatic cleanup
- Use compression optimization
- Monitor cache hit rates to identify unused artifacts

## 10. Best Practices

1. **Start with Vercel Remote Cache** for immediate wins
2. **Enable OIDC authentication** for enterprise security
3. **Use predictive caching** for frequently accessed artifacts
4. **Monitor analytics** regularly for optimization opportunities
5. **Implement regional replication** for distributed teams
6. **Set up proper retention policies** to control costs
7. **Use compression** to reduce bandwidth usage
8. **Regular security audits** of cache access patterns
