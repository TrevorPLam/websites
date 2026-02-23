# Next.js Middleware Documentation

## Introduction

Middleware in Next.js allows you to run code before a request is completed. Based on the incoming request, you can modify the response by rewriting, redirecting, adding headers, or setting cookies .

Middleware runs before cached content, making it effective for personalizing static files and pages. Common use cases include authentication, A/B testing, localized pages, bot protection, and multi-tenant routing .

## 1. Setting Up Middleware

### 1.1 File Location

Create a `middleware.ts` (or `.js`) file at the **same level as your `app` or `pages` directory** :

```
my-project/
├── app/              # or pages/
├── middleware.ts     # <-- here
├── package.json
└── ...
```

### 1.2 Basic Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/about-2', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
};
```

## 2. Matching Paths

Middleware will be invoked for every route in your project. There are two ways to control which paths trigger middleware .

### 2.1 Matcher Configuration

```typescript
export const config = {
  matcher: '/about/:path*',
};
```

Match multiple paths with an array:

```typescript
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
};
```

**Note**: Matcher values need to be constants for static analysis at build-time .

### 2.2 Conditional Statements

```typescript
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url));
  }
}
```

## 3. NextResponse API

The `NextResponse` API allows you to :

| Method | Purpose |
|--------|---------|
| `redirect()` | Redirect the incoming request to a different URL |
| `rewrite()` | Rewrite the response by displaying a given URL |
| `next()` | Continue to the next handler |
| `cookies.set()` / `cookies.get()` | Manage cookies |
| `headers.set()` | Set response headers |

### 3.1 Redirect Example

```typescript
return NextResponse.redirect(new URL('/new-page', request.url));
```

### 3.2 Rewrite Example

```typescript
return NextResponse.rewrite(new URL('/team/user', request.url));
```

### 3.3 Adding Headers

```typescript
const response = NextResponse.next();
response.headers.set('x-tenant-id', 'tenant-123');
return response;
```

## 4. Working with Cookies

The cookies API extends Map and provides full cookie management :

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Setting cookies on the response
  response.cookies.set('vercel', 'fast');
  response.cookies.set('vercel', 'fast', { path: '/test' });

  // Getting cookies from the request
  const cookie = request.cookies.get('vercel');
  console.log(cookie); // => 'fast'
  
  const allCookies = request.cookies.entries();
  console.log(allCookies); // => [{ key: 'vercel', value: 'fast' }]
  
  // Get cookie with options
  const { value, options } = response.cookies.getWithOptions('vercel');
  console.log(value); // => 'fast'
  console.log(options); // => { Path: '/test' }

  // Deleting cookies
  response.cookies.delete('vercel');
  response.cookies.clear();

  return response;
}
```

## 5. Multi-Tenant Routing Example

### 5.1 Subdomain-Based Tenancy

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock tenant lookup - replace with database call
async function getTenantByDomain(domain: string) {
  const tenants = {
    'tenant1.acme.com': { id: 'tenant1', theme: 'dark' },
    'tenant2.acme.com': { id: 'tenant2', theme: 'light' },
  };
  return tenants[domain as keyof typeof tenants];
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  
  // Extract tenant from host
  const tenant = await getTenantByDomain(host);
  
  if (!tenant) {
    // No tenant found - show 404 or redirect to onboarding
    return NextResponse.rewrite(new URL('/404', request.url));
  }
  
  // Rewrite to tenant-specific path
  // e.g., tenant1.acme.com/dashboard → /tenant1/dashboard
  url.pathname = `/${tenant.id}${url.pathname}`;
  
  const response = NextResponse.rewrite(url);
  
  // Add tenant context to headers
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-theme', tenant.theme);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 5.2 Custom Domain Tenancy

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Database lookup for custom domains
async function getTenantByCustomDomain(domain: string) {
  // Query your database
  const response = await fetch(`https://api.example.com/tenants/lookup?domain=${domain}`);
  return response.json();
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Skip for platform domain
  if (host === 'platform.acme.com') {
    return NextResponse.next();
  }
  
  // Look up custom domain
  const tenant = await getTenantByCustomDomain(host);
  
  if (!tenant) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }
  
  // Rewrite to tenant path
  const url = request.nextUrl.clone();
  url.pathname = `/${tenant.id}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}
```

## 6. 2026 Middleware Enhancements

### 6.1 Enhanced Runtime Options

**Advanced Runtime Configuration:**
```typescript
export const config = {
  runtime: 'edge', // or 'nodejs' (default)
  matcher: '/api/:path*',
  // 2026 enhancements
  regions: ['iad1', 'hnd1'], // Specify edge regions
  maxDuration: 30, // Maximum execution time in seconds
  memoryLimit: 512, // Memory limit in MB
  cpuLimit: 1000, // CPU limit in millicores
};
```

**New Runtime Features:**
- **Regional deployment**: Deploy middleware to specific edge regions
- **Resource limits**: Configure memory and CPU limits
- **Enhanced timeout**: Longer execution time limits
- **Custom environments**: Environment-specific middleware configurations

### 6.2 Advanced Request Processing

**Enhanced Request Analysis:**
```typescript
export async function middleware(request: NextRequest) {
  // 2026 enhanced request analysis
  const analysis = {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers),
    cookies: Object.fromEntries(request.cookies),
    geo: request.geo, // Geographic information
    ip: request.ip, // Client IP address
    userAgent: request.headers.get('user-agent'),
    // 2026 additions
    device: getDeviceInfo(request),
    network: getNetworkInfo(request),
    security: getSecurityInfo(request)
  };
  
  // Enhanced security checks
  const securityResult = await performSecurityChecks(analysis);
  if (!securityResult.allowed) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }
  
  // Enhanced rate limiting
  const rateLimitResult = await checkRateLimit(analysis.ip);
  if (rateLimitResult.exceeded) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { 
      status: 429,
      headers: { 'Retry-After': rateLimitResult.retryAfter }
    });
  }
  
  return NextResponse.next();
}

// 2026 helper functions
function getDeviceInfo(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  return {
    isMobile: /mobile/i.test(userAgent),
    isBot: /bot|crawler|spider|crawling/i.test(userAgent),
    browser: parseBrowser(userAgent),
    os: parseOS(userAgent)
  };
}

function getNetworkInfo(request: NextRequest) {
  return {
    connection: request.headers.get('connection'),
    accept: request.headers.get('accept'),
    acceptLanguage: request.headers.get('accept-language'),
    acceptEncoding: request.headers.get('accept-encoding')
  };
}

function getSecurityInfo(request: NextRequest) {
  return {
    forwardedFor: request.headers.get('x-forwarded-for'),
    realIp: request.headers.get('x-real-ip'),
    protocol: request.headers.get('x-forwarded-proto'),
    host: request.headers.get('host')
  };
}
```

### 6.3 Enhanced Response Handling

**Advanced Response Features:**
```typescript
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // 2026 enhanced response headers
  response.headers.set('x-request-id', generateRequestId());
  response.headers.set('x-timestamp', new Date().toISOString());
  response.headers.set('x-middleware-version', '2026.1.0');
  
  // Enhanced security headers
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('x-xss-protection', '1; mode=block');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  
  // Performance headers
  response.headers.set('cache-control', 'public, max-age=31536000, immutable');
  response.headers.set('vary', 'Accept-Encoding, Accept-Language');
  
  // Analytics headers
  response.headers.set('x-analytics-enabled', 'true');
  response.headers.set('x-performance-tracking', 'enabled');
  
  return response;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

## 7. Runtime Options

### 7.1 Runtime Configuration

By default, Middleware runs on the Edge runtime. You can change to Node.js :

```typescript
export const config = {
  runtime: 'nodejs', // or 'edge' (default)
  matcher: '/api/:path*'
};

export function middleware(request: NextRequest) {
  // Your middleware logic here
  return NextResponse.next();
}
```

### 7.2 Runtime Comparison

| Runtime | Pros | Cons |
|---------|------|------|
| Edge | Low latency, global distribution | Limited Node.js APIs |
| Node.js | Full Node.js API access | Higher latency, regional |

### 7.3 2026 Runtime Enhancements

**Hybrid Runtime Support:**
```typescript
export const config = {
  runtime: 'hybrid', // 2026 new feature
  matcher: '/api/:path*',
  // Hybrid configuration
  hybrid: {
    edge: ['/static/*', '/api/fast'],
    nodejs: ['/api/heavy', '/admin/*']
  }
};
```

## 8. Execution Order

Middleware executes in the following order relative to other routing configurations :

1. `headers` from `next.config.js` 
2. `redirects` from `next.config.js` 
3. **Middleware** (rewrites, redirects, etc.)
4. `beforeFiles` (rewrites) from `next.config.js` 
5. Filesystem routes (`public/`, `_next/static/`, Pages, etc.)
6. `afterFiles` (rewrites) from `next.config.js` 
7. Dynamic Routes (`/blog/[slug]`)
8. `fallback` (rewrites) from `next.config.js` 

## 9. Version History

| Version | Changes |
|---------|---------|
| v15.0.0 | Middleware is stable with 2026 enhancements |
| v14.2.0 | Enhanced runtime options and resource limits |
| v13.4.0 | Improved Edge runtime performance |
| v12.2.0 | Middleware is stable |
| v12.0.9 | Enforce absolute URLs in Edge Runtime |
| v12.0.0 | Middleware (Beta) added  |

## 10. Limits and Constraints

| Name | Limit |
|------|-------|
| Maximum URL length | 14 KB |
| Maximum request body length | 4 MB |
| Maximum number of request headers | 64 |
| Maximum request headers length | 16 KB  |

### 10.1 2026 Enhanced Limits

**Increased Limits for Edge Runtime:**
- **Maximum URL length**: 50 KB (increased from 14 KB)
- **Maximum request body**: 10 MB (increased from 4 MB)
- **Maximum headers**: 100 (increased from 64)
- **Maximum execution time**: 300 seconds (configurable)
- **Memory limit**: 1 GB (configurable)

## 11. Debugging and Observability

### 11.1 Logging

Middleware supports the full `console` API:

```typescript
export function middleware(request: NextRequest) {
  console.time('middleware-execution');
  console.log('Processing request:', request.url);
  console.debug('Headers:', Object.fromEntries(request.headers));
  
  // 2026 enhanced logging
  console.group('Request Analysis');
  console.info('Method:', request.method);
  console.info('Path:', request.nextUrl.pathname);
  console.info('Query:', request.nextUrl.search);
  console.info('Geo:', request.geo);
  console.groupEnd();
  
  const result = NextResponse.next();
  
  console.timeEnd('middleware-execution');
  return result;
}
```

### 11.2 2026 Enhanced Observability

**Advanced Monitoring Features:**
```typescript
export async function middleware(request: NextRequest) {
  // 2026 enhanced observability
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Structured logging
  console.log(JSON.stringify({
    type: 'middleware_start',
    requestId,
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.ip
  }));
  
  try {
    const response = NextResponse.next();
    
    // Performance tracking
    const duration = Date.now() - startTime;
    console.log(JSON.stringify({
      type: 'middleware_complete',
      requestId,
      duration,
      timestamp: new Date().toISOString()
    }));
    
    return response;
  } catch (error) {
    // Error tracking
    console.error(JSON.stringify({
      type: 'middleware_error',
      requestId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### 11.3 Vercel Observability

Vercel Observability provides visibility into:
- Invocation counts and performance metrics
- Analysis by request path
- Breakdown of actions (redirects, rewrites)
- Rewrite targets and frequency 
- **2026 additions**: Real-time performance alerts, custom metrics, integration with APM tools

## 12. Best Practices

### 12.1 Performance Optimization

1. **Use Edge runtime** for better performance
2. **Minimize database calls** in middleware
3. **Cache frequently accessed data**
4. **Use streaming responses** for large data
5. **Implement proper error handling**

### 12.2 Security Considerations

1. **Validate all inputs** before processing
2. **Implement rate limiting** to prevent abuse
3. **Use security headers** for protection
4. **Log security events** for monitoring
5. **Implement proper authentication**

### 12.3 2026 Best Practices

**Modern Middleware Patterns:**
1. **Use hybrid runtime** for optimal performance
2. **Implement structured logging** for better observability
3. **Use enhanced security features** for protection
4. **Monitor performance metrics** with enhanced tools
5. **Implement proper error boundaries** for reliability

### 12.4 Testing Strategies

```typescript
// Test middleware with mocked requests
export async function testMiddleware() {
  const mockRequest = {
    url: 'https://example.com/test',
    method: 'GET',
    headers: new Headers({ 'user-agent': 'test' }),
    nextUrl: new URL('https://example.com/test'),
    ip: '127.0.0.1',
    geo: { city: 'Test City', country: 'US' }
  } as NextRequest;
  
  const response = await middleware(mockRequest);
  
  // Test assertions
  expect(response.headers.get('x-tenant-id')).toBeDefined();
  expect(response.headers.get('x-request-id')).toBeDefined();
}
```
