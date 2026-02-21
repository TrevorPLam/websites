# Environment Variables & Secret Management Guide

## Overview

This guide explains how to properly manage environment variables and secrets in the marketing websites monorepo following 2026 security best practices.

## 🚨 Critical Security Rules

1. **NEVER commit `.env.local` to version control**
2. **NEVER use hardcoded secrets in code**
3. **ALWAYS use empty values in `.env.local` for development**
4. **ALWAYS reference environment variables through proper schemas**

## File Structure

```
marketing-websites/
├── .env.example              # Template file (committed)
├── .env.local                # Local development (gitignored)
├── .env.production.local     # Production secrets (gitignored)
└── packages/infra/env/schemas/  # Validation schemas
```

## Environment Variable Categories

### 1. Core Application

```bash
NODE_ENV=development
SITE_URL=http://localhost:3000
SITE_NAME="Hair Salon Template"
```

### 2. Public Variables (Client-Side)

- Prefixed with `NEXT_PUBLIC_`
- Exposed to browser bundle
- Use for non-sensitive configuration only

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Hair Salon Template"
NEXT_PUBLIC_ANALYTICS_ID=
```

### 3. Server-Side Secrets

- Never prefixed with `NEXT_PUBLIC_`
- Only accessible on server
- Used for API keys, database connections

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
HUBSPOT_PRIVATE_APP_TOKEN=
```

### 4. Paired Variables

Some integrations require multiple variables that must be set together:

```bash
# Supabase [PAIR] - Both required or both omitted
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Upstash Redis [PAIR] - Both required or both omitted
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Development Setup

1. **Copy the template:**

   ```bash
   cp .env.example .env.local
   ```

2. **Fill in required values:**
   - Leave empty variables as-is for local development
   - Add actual values only when needed
   - Never use placeholder values like "placeholder-key"

3. **Validate configuration:**
   ```bash
   pnpm validate-env  # Validates all environment variables
   ```

## Production Deployment

### 1. Production Environment File

```bash
cp .env.example .env.production.local
```

### 2. Fill in Production Values

- Use actual production credentials
- Ensure all paired variables are set
- Validate with `pnpm validate-env`

### 3. Platform-Specific Setup

Different platforms have different environment variable handling:

#### Vercel

```bash
vercel env add
```

#### Docker

```bash
docker run -e SUPABASE_URL=your-url -e SUPABASE_SERVICE_ROLE_KEY=your-key
```

#### Kubernetes

```yaml
env:
  - name: SUPABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: supabase-url
```

## Security Best Practices (2026 Standards)

### 1. Principle of Least Privilege

- Use minimum required permissions
- Separate development and production credentials
- Rotate secrets regularly

### 2. Environment Variable Validation

All environment variables are validated through Zod schemas in `packages/infra/env/schemas/`:

```typescript
// Example schema
export const supabaseSchema = z.object({
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});
```

### 3. Type Safety

Environment variables are type-safe through our validation system:

```typescript
import { env } from '@repo/infra/env';

// Fully typed access
const supabaseUrl = env.SUPABASE_URL; // string | undefined
```

### 4. Runtime Validation

Environment variables are validated at application startup:

```typescript
// Early failure on invalid configuration
if (!env.SUPABASE_URL && !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase not configured - using in-memory fallback');
}
```

## Common Anti-Patterns to Avoid

### ❌ Hardcoded Secrets

```typescript
// NEVER do this
const apiKey = 'sk-1234567890abcdef';
```

### ❌ Placeholder Values

```bash
# NEVER do this
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-role-key
```

### ❌ Mixed Environment Files

```bash
# NEVER commit actual values to .env.example
SUPABASE_URL=https://your-actual-project.supabase.co
```

### ❌ Client-Side Secrets

```typescript
// NEVER expose server secrets to client
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = your - secret - key;
```

## ✅ Correct Patterns

### ✅ Proper Environment Variable Usage

```typescript
import { env } from '@repo/infra/env';

// Server-side only
const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Client-safe (public)
const publicUrl = env.NEXT_PUBLIC_SITE_URL;
```

### ✅ Conditional Feature Usage

```typescript
// Graceful fallbacks when integrations not configured
if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  // Use Supabase
} else {
  // Use in-memory fallback
}
```

### ✅ Environment-Specific Configuration

```typescript
const isDevelopment = env.NODE_ENV === 'development';
const isProduction = env.NODE_ENV === 'production';
```

## Validation Commands

```bash
# Validate all environment variables
pnpm validate-env

# Check for missing required variables
pnpm check-env

# Validate client configuration
pnpm validate-client [client-path]
```

## Troubleshooting

### Common Issues

1. **Build fails with missing environment variables**
   - Check `.env.local` exists
   - Ensure variables match schema requirements
   - Run `pnpm validate-env`

2. **Runtime errors accessing environment variables**
   - Verify variable names match exactly
   - Check for typos in `.env.local`
   - Ensure proper import from `@repo/infra/env`

3. **TypeScript errors for environment variables**
   - Run `pnpm type-check`
   - Ensure schema definitions are up to date
   - Check import paths

### Debug Commands

```bash
# Show current environment (development only)
pnpm debug:env

# Validate specific schema
pnpm validate:env --schema=supabase

# Check environment variable sources
pnpm trace:env
```

## Security Monitoring

### Automated Checks

- CI/CD pipeline validates environment variables
- Pre-commit hooks prevent hardcoded secrets
- Dependency scanning for leaked credentials

### Manual Reviews

- Regular audits of `.env.local` files
- Review of new environment variable additions
- Validation of production configurations

## Integration-Specific Guides

### Supabase Configuration

```bash
# Required for database features
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### HubSpot Integration

```bash
# For CRM functionality
HUBSPOT_PRIVATE_APP_TOKEN=your-private-app-token
```

### Rate Limiting (Upstash Redis)

```bash
# For API rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## Support

For environment variable issues:

1. Check this guide first
2. Run validation commands
3. Review schema definitions in `packages/infra/env/schemas/`
4. Check CI/CD logs for validation failures

---

**Remember:** Environment security is critical. Never commit secrets, always use proper validation, and follow the principle of least privilege.
