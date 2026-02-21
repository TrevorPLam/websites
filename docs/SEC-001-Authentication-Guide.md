# Authentication System Documentation

## Overview

This repository implements a **2026-compliant centralized authentication system** following OAuth 2.1 standards with defense-in-depth security patterns. The system addresses CVE-2025-29927 by never relying solely on middleware for authentication.

## Architecture

### Core Components

1. **Auth Core** (`packages/infra/src/auth/core.ts`)
   - `AuthService`: Centralized authentication service
   - `TokenValidator`: JWT token validation and generation
   - `SessionManager`: Secure session management
   - `PKCEManager`: OAuth 2.1 PKCE implementation

2. **Middleware** (`packages/infra/src/auth/middleware.ts`)
   - `authMiddleware`: Next.js middleware with defense-in-depth
   - Rate limiting and security headers
   - Tenant context propagation

3. **Tenant Context** (`packages/infra/src/auth/tenant-context.ts`)
   - Multi-tenant isolation using AsyncLocalStorage
   - JWT-based tenant extraction
   - Request-scoped tenant management

### Security Features

- **OAuth 2.1 Compliance**: PKCE required for all clients
- **Defense-in-Depth**: Middleware + data access validation
- **Multi-Tenant Isolation**: Tenant context from verified JWT claims
- **MFA Support**: Configurable multi-factor authentication
- **Audit Logging**: Comprehensive security event tracking
- **Rate Limiting**: Request throttling and abuse prevention
- **Session Security**: HTTP-only cookies with secure flags

## Usage Examples

### Basic Authentication

```typescript
import { verifyAuth, withAuth } from '@repo/infra/auth/core';

// Verify authentication in Server Components
export default async function ProtectedPage() {
  const auth = await verifyAuth({ requireMFA: true });

  if (!auth) {
    redirect('/login');
  }

  return <Dashboard user={auth} />;
}

// Run operations within authenticated context
const result = await withAuth(async (auth) => {
  return createBooking({ userId: auth.userId, tenantId: auth.tenantId });
}, { requireRoles: ['admin'] });
```

### Middleware Integration

```typescript
// middleware.ts
import { authMiddleware } from '@repo/infra/auth/middleware';

export default authMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image).*)'],
};
```

### Server Actions

```typescript
import { secureAction } from '@repo/infra/security/secure-action';
import { verifyAuth } from '@repo/infra/auth/core';

export async function createBookingAction(input: unknown) {
  return secureAction(
    input,
    bookingSchema,
    async (ctx, data) => {
      // Authentication already verified by secureAction
      const auth = await verifyAuth();

      if (!auth || auth.userId !== ctx.userId) {
        throw new Error('Unauthorized');
      }

      return bookingRepository.create(data, auth.tenantId);
    },
    { actionName: 'createBooking', requireAuth: true }
  );
}
```

## Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_ISSUER=marketing-websites
JWT_AUDIENCE=marketing-websites

# Session Configuration
SESSION_MAX_AGE=604800  # 7 days in seconds
MFA_REQUIRED=false

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000  # 15 minutes in ms
```

### Session Options

```typescript
const sessionConfig: SessionConfig = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  requireMFA: false,
  allowedOrigins: ['https://yourdomain.com'],
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};
```

## Security Best Practices

### 1. Defense-in-Depth Authentication

Never rely solely on middleware. Always verify at data access points:

```typescript
// ✅ Good: Verify at each layer
export async function getBookings() {
  const auth = await verifyAuth();
  if (!auth) return null;

  return bookingRepository.findByTenant(auth.tenantId);
}

// ❌ Bad: Only middleware check
export async function getBookings() {
  // Assumes middleware already verified auth
  return bookingRepository.all(); // SECURITY RISK!
}
```

### 2. Multi-Tenant Data Isolation

Always use tenant-scoped queries:

```typescript
// ✅ Good: Tenant-scoped queries
const bookings = await db.bookings.findMany({
  where: {
    tenant_id: tenantId, // NEVER NULLABLE
    user_id: userId,
  },
});

// ❌ Bad: Cross-tenant access
const bookings = await db.bookings.findMany({
  where: { user_id: userId }, // Missing tenant_id!
});
```

### 3. OAuth 2.1 PKCE Implementation

```typescript
// Generate PKCE parameters
const pkce = await PKCEManager.generatePKCE();

// Build OAuth 2.1 authorization URL
const authUrl = new URL('https://auth.example.com/oauth/authorize');
authUrl.searchParams.set('code_challenge', pkce.codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
authUrl.searchParams.set('response_type', 'code');

// Exchange code for token
const tokenResponse = await fetch('https://auth.example.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    code_verifier: pkce.codeVerifier,
    client_id: clientId,
  }),
});
```

## Testing

### Unit Tests

```bash
# Run authentication tests
pnpm test -- packages/infra/src/auth/__tests__/

# Run specific test file
pnpm test -- packages/infra/src/auth/__tests__/core.test.ts
```

### Integration Tests

```typescript
import { AuthService } from '@repo/infra/auth/core';

describe('Authentication Integration', () => {
  it('should authenticate user with valid credentials', async () => {
    const authService = new AuthService();

    // Mock session validation
    vi.spyOn(authService.session, 'validateSession').mockResolvedValue(mockAuthContext);

    const result = await authService.verifyAuth();
    expect(result).toBeTruthy();
  });
});
```

## Migration Guide

### From Legacy Authentication

1. **Replace middleware-only checks**:

   ```typescript
   // Old
   export async function protectedAction() {
     // Assumes middleware verified auth
     return processData();
   }

   // New
   export async function protectedAction() {
     const auth = await verifyAuth();
     if (!auth) throw new Error('Unauthorized');
     return processData();
   }
   ```

2. **Update session management**:

   ```typescript
   // Old
   const session = getSession();

   // New
   const auth = await getCurrentSession();
   ```

3. **Add tenant context**:

   ```typescript
   // Old
   const data = await repository.findAll();

   // New
   const auth = await verifyAuth();
   const data = await repository.findByTenant(auth.tenantId);
   ```

## Troubleshooting

### Common Issues

1. **JWT validation fails**
   - Check `JWT_SECRET` environment variable
   - Verify token expiration and issuer
   - Ensure clock synchronization

2. **Tenant context missing**
   - Verify JWT includes `org_id` or `app_metadata.tenant_id`
   - Check tenant ID format (UUID)
   - Ensure middleware sets tenant context

3. **Session not persisting**
   - Check cookie settings (httpOnly, secure, sameSite)
   - Verify domain and path configuration
   - Check browser cookie policies

### Debug Logging

Enable debug logging:

```typescript
// Set environment variable
process.env.AUDIT_LOG_STDOUT = 'true';

// Check audit logs
const entries = auditLogger.getEntries();
console.log(entries);
```

## Performance Considerations

### Session Validation Caching

The `validateSession` function uses React's `cache()` to ensure single validation per request:

```typescript
// Automatic caching - no duplicate validations
const auth1 = await getCurrentSession();
const auth2 = await getCurrentSession(); // Uses cached result
```

### JWT Verification Optimization

- Use HS256 for better performance than RS256
- Implement token refresh to reduce verification frequency
- Consider edge deployment for faster validation

## Security Audits

### Regular Security Reviews

1. **JWT secret rotation**: Every 90 days
2. **Session timeout review**: Based on threat model
3. **Rate limit tuning**: Based on traffic patterns
4. **Audit log analysis**: Monthly security review

### Compliance Checklist

- [ ] OAuth 2.1 compliance (PKCE required)
- [ ] Multi-tenant isolation enforced
- [ ] Defense-in-depth authentication
- [ ] Comprehensive audit logging
- [ ] Rate limiting implemented
- [ ] Secure session management
- [ ] MFA support for privileged operations
- [ ] Regular security updates

## Support

For authentication issues:

1. Check audit logs for error details
2. Verify environment configuration
3. Review security headers and CSP
4. Test with different user roles and tenants

## References

- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-01)
- [Next.js App Router Security](https://nextjs.org/docs/app/building-your-application/authentication)
- [CVE-2025-29927 Mitigation](https://nvd.nist.gov/vuln/detail/CVE-2025-29927)
- [Multi-Tenant Architecture Best Practices](https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenant)
