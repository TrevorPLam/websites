# Next.js 16 — Official Reference Documentation

> **Version Reference:** Next.js 16.1 (stable) | Released: October 21, 2025 / Updated: December 18, 2025
> **Purpose:** AI agent reference for App Router, caching, Turbopack, React Compiler, proxy.ts,
> OpenTelemetry, and all major Next.js 16 architectural patterns.

---

1. [What's New in Next.js 16](#whats-new-in-nextjs-16)
2. [Installation & Upgrade](#installation--upgrade)
3. [Version Requirements](#version-requirements)
4. [Turbopack (Stable Default)](#turbopack-stable-default)
5. [Cache Components & "use cache"](#cache-components--use-cache)
6. [Caching APIs](#caching-apis)
7. [App Router Routing & Navigation](#app-router-routing--navigation)
8. [proxy.ts (Replaces middleware.ts)](#proxyts-replaces-middlewarets)
9. [React Compiler Integration](#react-compiler-integration)
10. [React 19.2 Features in Next.js 16](#react-192-features-in-nextjs-16)
11. [OpenTelemetry Instrumentation](#opentelemetry-instrumentation)
12. [after() API](#after-api)
13. [Build Adapters API (Alpha)](#build-adapters-api-alpha)
14. [DevTools MCP Integration](#devtools-mcp-integration)
15. [Breaking Changes](#breaking-changes)
16. [Deprecations](#deprecations)
17. [Best Practices](#best-practices)

---

## What's New in Next.js 16

Next.js 16 (released October 21, 2025) makes **Turbopack the default bundler**, introduces the
**Cache Components model** superseding experimental PPR flags, ships **React Compiler** as stable,
and replaces `middleware.ts` with `proxy.ts`. Next.js 16.1 (December 18, 2025) stabilized
Turbopack filesystem caching by default and shipped an experimental Bundle Analyzer.

| Area                   | Change                                                |
| ---------------------- | ----------------------------------------------------- |
| Default bundler        | Turbopack (was Webpack)                               |
| Caching model          | Explicit `"use cache"` (replaces implicit + PPR flag) |
| React version          | React 19.2 bundled                                    |
| Middleware replacement | `proxy.ts` replaces `middleware.ts`                   |
| Compiler               | React Compiler support stable                         |
| Minimum Node.js        | 20.9.0 LTS                                            |
| Minimum TypeScript     | 5.1.0                                                 |

---

## Installation & Upgrade

```bash
# Automated upgrade (recommended)
npx @next/codemod@canary upgrade latest

# Manual upgrade
npm install next@latest react@latest react-dom@latest

# New project
npx create-next-app@latest

# Future upgrades (16.1+)
npx next upgrade
```

### New Project Structure (create-next-app defaults)

```
my-app/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css
├── components/
├── lib/
├── public/
├── next.config.ts        # TypeScript config (native TS support)
├── tsconfig.json
├── tailwind.config.ts
└── eslint.config.mjs     # Flat config (ESLint v10 default)
```

---

## Version Requirements

| Dependency    | Minimum Version                   |
| ------------- | --------------------------------- |
| Node.js       | 20.9.0 (LTS) — Node.js 18 dropped |
| TypeScript    | 5.1.0                             |
| React         | 19.2+                             |
| Chrome / Edge | 111+                              |
| Firefox       | 111+                              |
| Safari        | 16.4+                             |

---

## Turbopack (Stable Default)

Turbopack is now the **default bundler** for all Next.js 16 projects — no configuration required.
More than 50% of development sessions and 20% of production builds on Next.js 15.3+ were already
running Turbopack before the 16.0 release.

### Performance Benchmarks

| Metric                              | Webpack | Turbopack | Improvement  |
| ----------------------------------- | ------- | --------- | ------------ |
| Cold start (dev)                    | ~4.2s   | ~1.1s     | ~3.8× faster |
| Fast Refresh (HMR)                  | ~800ms  | ~90ms     | ~9× faster   |
| Production build                    | ~42s    | ~18s      | ~2.3× faster |
| FS cache: first compile (react.dev) | 3.7s    | 380ms     | ~10× faster  |
| FS cache: large internal app        | 15s     | 1.1s      | ~14× faster  |

### Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is ON by default. Customize with:
  turbopack: {
    // Custom resolve aliases
    resolveAlias: {
      '@components': './components',
    },
    // Module ID strategy
    moduleIdStrategy: 'deterministic',
  },
};

export default nextConfig;
```

### Opt Out of Turbopack (Webpack Fallback)

```bash
# Development
next dev --webpack

# Production build
next build --webpack
```

### Turbopack Filesystem Caching (Stable in 16.1)

Filesystem caching stores compiler artifacts on disk between restarts. It is **on by default** in
Next.js 16.1. Previously opt-in via `experimental.turbopackFileSystemCacheForDev`, that flag has
been promoted to stable behavior.

```typescript
// next.config.ts — no config needed in 16.1; it's the default
// To explicitly control:
const nextConfig: NextConfig = {
  experimental: {
    // FS cache for builds (beta — coming after 16.1):
    // turbopackFileSystemCacheForBuild: true,
  },
};
```

### Bundle Analyzer (Experimental — 16.1)

```bash
# Inspect production bundles interactively
next experimental-analyze
```

Features:

- Filter bundles by route
- View full import chain (why a module is included)
- Trace server-to-client component boundaries
- View CSS and asset sizes
- Switch between client and server views

### Debugging

```bash
# Attach Node.js debugger to only your app process (not all spawned processes)
next dev --inspect
```

---

## Cache Components & "use cache"

Cache Components replace the previous `experimental.ppr` flag and make caching **explicit and
opt-in** at the component, page, and function level. All dynamic code executes at request time by
default — no implicit caching surprises.

### Enable Cache Components

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true, // replaces experimental.dynamicIO
};

export default nextConfig;
```

> ⚠️ `experimental.dynamicIO` and `experimental.ppr` flags are **removed**. Migrate to
> `cacheComponents: true`.

### "use cache" Directive

```typescript
// Cache a full page (file-level directive)
'use cache';

export default async function ProductsPage() {
  const products = await fetchProducts();
  return <ProductList products={products} />;
}
```

```typescript
// Cache a component (function-level)
import { unstable_cache as cache } from 'next/cache';

async function CachedProductCard({ id }: { id: string }) {
  'use cache';
  const product = await fetchProduct(id);
  return <ProductCard product={product} />;
}
```

```typescript
// Cache a data-fetching function
'use server';
import { unstable_cache as cache } from 'next/cache';

export async function getCachedUser(userId: string) {
  'use cache';
  // Cache key is auto-generated from function + arguments
  return await db.users.find(userId);
}
```

### Cache Keys

Unlike previous manual tagging models, Cache Components **automatically generate cache keys** via
the compiler based on function identity and arguments. Manual `cacheTag()` is available for
explicit invalidation control:

```typescript
import { cacheTag, cacheLife } from 'next/cache';

async function getArticles() {
  'use cache';
  cacheTag('articles'); // Tag for targeted invalidation
  cacheLife('hours'); // Built-in profile: seconds, minutes, hours, days, max
  return await db.articles.findAll();
}
```

### Cache vs No-Cache Decision Tree

```
Does this route/component use request-time data (cookies, headers, user data)?
  YES → Default behavior: runs at request time. Add "use cache" only to sub-components that are safe to cache.
  NO  → Add "use cache" to cache the entire page/component as static.

Does caching this component require different TTLs for different parts?
  YES → Use "use cache" on individual sub-components with different cacheLife profiles.
  NO  → Use "use cache" at the page level.
```

---

## Caching APIs

### revalidateTag() — Updated Signature

`revalidateTag()` now requires a `cacheLife` profile as the second argument for
stale-while-revalidate (SWR) behavior:

```typescript
import { revalidateTag } from 'next/cache';

// ✅ Recommended: use 'max' for most cases (SWR: serve stale, revalidate in background)
revalidateTag('blog-posts', 'max');

// Other built-in profiles:
revalidateTag('news-feed', 'hours');
revalidateTag('analytics', 'days');

// Custom TTL:
revalidateTag('products', { expire: 3600 });

// ⚠️ Deprecated: single-argument form
// revalidateTag('blog-posts');
```

### updateTag() — NEW (Server Actions Only)

Provides **read-your-writes** semantics — expires cache and immediately fetches fresh data within
the same request. Use in Server Actions where users must see their changes immediately:

```typescript
'use server';
import { updateTag } from 'next/cache';

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile);

  // Cache expired + fresh data fetched before responding to the client
  updateTag(`user-${userId}`);

  redirect('/profile');
}
```

### refresh() — NEW (Server Actions Only)

Refreshes **uncached dynamic data** without touching the cache layer. Use when you need to update
live UI data (notification counts, live metrics) after a Server Action:

```typescript
'use server';
import { refresh } from 'next/cache';

export async function markNotificationRead(id: string) {
  await db.notifications.markAsRead(id);

  // Refreshes dynamic data elsewhere on the page (not cached)
  refresh();
}
```

### API Comparison

| API                           | Scope                 | Cache Effect                          | Use Case                         |
| ----------------------------- | --------------------- | ------------------------------------- | -------------------------------- |
| `revalidateTag(tag, profile)` | Tagged cached entries | SWR: serve stale + background refresh | Blog posts, product catalogs     |
| `updateTag(tag)`              | Tagged cached entries | Immediate expire + re-fetch           | User profile, form submissions   |
| `refresh()`                   | Uncached dynamic data | No cache interaction                  | Notification counts, live status |
| `revalidatePath(path)`        | Route path            | Invalidate all cache for path         | Full page invalidation           |

---

## App Router Routing & Navigation

### Layout Deduplication

When prefetching multiple URLs sharing a layout, Next.js 16 downloads the layout **once**. A page
with 50 product links now transfers the shared layout once instead of 50 times.

### Incremental Prefetching

- Cancels requests when a link leaves the viewport
- Prioritizes links on hover or re-entry into viewport
- Re-prefetches when cached data is invalidated
- Downloads only the delta (parts not already in cache)

No code changes required — this is automatic behavior in Next.js 16.

### Parallel Routes — default.js Now Required

All parallel route slots must have explicit `default.js` files. Builds fail without them.

```typescript
// app/@modal/default.js — required for all parallel route slots
export default function Default() {
  return null; // Or call notFound()
}
```

### Async params and searchParams

`params` and `searchParams` props are now async and must be awaited:

```typescript
// ✅ Next.js 16
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  return <div>{slug}</div>;
}
```

### Async cookies/headers/draftMode

```typescript
import { cookies, headers, draftMode } from 'next/headers';

// ✅ Next.js 16 — all are async
export default async function Page() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const { isEnabled } = await draftMode();

  const token = cookieStore.get('token');
  return <div>{token?.value}</div>;
}
```

---

## proxy.ts (Replaces middleware.ts)

`proxy.ts` replaces `middleware.ts` and explicitly declares the app's network boundary. It runs
on the **Node.js runtime** (not Edge). `middleware.ts` is still supported for Edge runtime use
cases but is **deprecated**.

### Migration

```bash
# Rename file
mv middleware.ts proxy.ts
```

```typescript
// proxy.ts — same logic as middleware.ts, renamed export
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Auth check
  const token = request.cookies.get('auth-token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Tenant routing
  const hostname = request.headers.get('host') ?? '';
  const tenant = hostname.split('.');
  request.headers.set('x-tenant-id', tenant);

  return NextResponse.next({
    request: { headers: request.headers },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/public).*)'],
};
```

> `middleware.ts` (Edge runtime) remains valid for cases requiring Edge execution, but expect
> removal in a future major version.

---

## React Compiler Integration

React Compiler 1.0 support is **stable** in Next.js 16. It automatically memoizes components and
hooks without manual `useMemo`/`useCallback` code changes.

### Enable React Compiler

```bash
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true, // Promoted from experimental to stable
};

export default nextConfig;
```

> ⚠️ The compiler is **not enabled by default** even though it's stable — Vercel is still
> gathering build performance data across app types. Enabling it increases compile times since
> it relies on Babel.

### Opt-In (Annotation) Mode

Roll out incrementally by annotating only specific components:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: {
    compilationMode: 'annotation', // Only compile annotated code
  },
};
```

```typescript
// Opt specific components INTO compilation
'use memo';

export function ExpensiveComponent({ data }: Props) {
  // This component will be auto-memoized by the compiler
  return <HeavyList items={data} />;
}
```

```typescript
// Opt specific components OUT of compilation
'use no memo';

export function ComponentWithSideEffects() {
  // Compiler skips this component
}
```

### swc Support (Experimental)

An SWC plugin for React Compiler is in development (collaboration with `@kdy1dev`). When enabled
in Next.js apps, build performance is considerably faster than the Babel-based approach. Use
Next.js 15.3.1+ for best performance with the experimental SWC plugin.

---

## React 19.2 Features in Next.js 16

Next.js 16 bundles React 19.2 (released October 1, 2025) with full App Router support.

### View Transitions

```typescript
'use client';
import { useTransition } from 'react';
import { ViewTransition } from 'react';

function NavigationButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          router.push(href);
        });
      }}
    >
      <ViewTransition>
        {children}
      </ViewTransition>
    </button>
  );
}
```

### Activity Component

Pre-render and preserve state of hidden/background UI without impacting visible performance:

```typescript
import { Activity } from 'react';

export function TabPanel({ activeTab }: { activeTab: string }) {
  return (
    <>
      {/* Hidden tabs keep state, pre-render in background */}
      <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>
        <ProfileTab />
      </Activity>
      <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsTab />
      </Activity>
    </>
  );
}
```

### useEffectEvent

Separates "event" logic from Effect dependencies to avoid unnecessary re-runs:

```typescript
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }: { roomId: string; theme: string }) {
  // onConnected is an "Effect Event" — not a dependency
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme); // Always reads latest 'theme'
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only roomId — theme not needed as dependency
}
```

---

## OpenTelemetry Instrumentation

Next.js has built-in OpenTelemetry instrumentation. It emits spans for every request, middleware
execution, and render operation with full route attribution.

### Setup

```bash
npm install @vercel/otel @opentelemetry/sdk-node
```

```typescript
// instrumentation.ts (project root — not in /app)
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'my-next-app',
  });
}
```

### Custom Spans

```typescript
// instrumentation.ts
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('my-app');

export async function fetchUserWithTracing(userId: string) {
  return tracer.startActiveSpan('fetchUser', async (span) => {
    span.setAttribute('user.id', userId);
    try {
      const user = await db.users.find(userId);
      span.setStatus({ code: 0 }); // OK
      return user;
    } catch (error) {
      span.setStatus({ code: 2, message: String(error) }); // ERROR
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Automatic Span Attributes

Next.js automatically emits these attributes on spans:

| Attribute          | Value                                           |
| ------------------ | ----------------------------------------------- |
| `next.route`       | Matched route pattern (e.g., `/products/[id]`)  |
| `http.method`      | HTTP method                                     |
| `http.status_code` | Response status                                 |
| `next.span_type`   | `BaseServer.handleRequest`, `RenderRoute`, etc. |
| `next.rsc`         | `true` if React Server Component render         |

### Noisy Span Filtering

```typescript
// instrumentation.ts
export function register() {
  registerOTel({
    serviceName: 'my-next-app',
    spanProcessors: [
      {
        onStart(span) {},
        onEnd(span) {
          // Drop static asset spans
          const route = span.attributes['next.route'] as string;
          if (route?.startsWith('/_next/static')) {
            span.drop();
          }
        },
        shutdown() {
          return Promise.resolve();
        },
        forceFlush() {
          return Promise.resolve();
        },
      },
    ],
  });
}
```

---

## after() API

`after()` runs code **after a response has been sent** to the client — ideal for logging, analytics,
and cleanup without blocking response time.

```typescript
import { after } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const result = await processOrder(body);

  // This runs AFTER the response is sent
  after(async () => {
    await analytics.track('order.created', {
      orderId: result.id,
      userId: body.userId,
    });
    await auditLog.write('order_created', result);
  });

  return Response.json({ orderId: result.id });
}
```

```typescript
// In Server Components (useful for non-blocking analytics)
import { after } from 'next/server';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  after(async () => {
    await analytics.recordProductView(id);
  });

  return <ProductDetail product={product} />;
}
```

> `after()` is available in App Router pages, layouts, Server Actions, and Route Handlers.
> It is NOT available in `proxy.ts` (formerly `middleware.ts`).

---

## Build Adapters API (Alpha)

Build Adapters allow deployment platforms and custom tooling to hook into the Next.js build process:

```javascript
// my-adapter.js
module.exports = {
  name: 'my-custom-adapter',
  async adapt(buildConfig, buildOutput) {
    // Modify build config
    buildConfig.outputDirectory = './custom-dist';

    // Process build output
    for (const page of buildOutput.pages) {
      await customDeploy(page);
    }
  },
};
```

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
};
```

---

## DevTools MCP Integration

Next.js 16 includes a **Model Context Protocol (MCP)** server for AI-assisted debugging:

```bash
# Start MCP server alongside dev server
next dev --mcp
```

Capabilities provided to AI agents:

- Full Next.js routing knowledge
- Unified browser + server logs
- Automatic error access with stack traces
- Active route awareness
- `get_routes` tool (added in 16.1) — lists all routes in the app

---

## Breaking Changes

### Removed Features

| Removed                                                                | Migration                                           |
| ---------------------------------------------------------------------- | --------------------------------------------------- |
| AMP support (`useAmp`, `amp: true`)                                    | No equivalent — AMP deprecated by Google            |
| `next lint` command                                                    | Use `eslint` directly; `next build` no longer lints |
| `devIndicators.appIsrStatus`, `buildActivity`, `buildActivityPosition` | Removed from config                                 |
| `serverRuntimeConfig`, `publicRuntimeConfig`                           | Use `.env` files                                    |
| `experimental.turbopack`                                               | Moved to top-level `turbopack`                      |
| `experimental.dynamicIO`                                               | Renamed to `cacheComponents`                        |
| `experimental.ppr`                                                     | Replaced by `cacheComponents`                       |
| `export const experimental_ppr`                                        | Replaced by Cache Components model                  |
| Sync `params`/`searchParams` access                                    | Must `await params`, `await searchParams`           |
| Sync `cookies()`, `headers()`, `draftMode()`                           | Must `await` all three                              |
| `next/legacy/image`                                                    | Use `next/image`                                    |

### Behavior Changes

| Change                       | Details                                         |
| ---------------------------- | ----------------------------------------------- |
| Default bundler              | Turbopack (opt out with `--webpack`)            |
| `images.minimumCacheTTL`     | 60s → 4 hours (14400s)                          |
| `images.imageSizes` default  | `16` removed (used by only 4.2% of projects)    |
| `images.qualities` default   | `[1..100]` → `[75]`                             |
| `revalidateTag()` signature  | Requires `cacheLife` profile as second argument |
| `@next/eslint-plugin-next`   | Flat Config format by default                   |
| Prefetch cache               | Layout deduplication + incremental prefetching  |
| Parallel routes              | All slots require explicit `default.js`         |
| Babel in Turbopack           | Auto-detected (no longer errors)                |
| Dev/build output directories | Separate directories (can run concurrently)     |

---

## Deprecations

| Deprecated                        | Replacement                                       |
| --------------------------------- | ------------------------------------------------- |
| `middleware.ts`                   | `proxy.ts`                                        |
| `next/legacy/image`               | `next/image`                                      |
| `images.domains`                  | `images.remotePatterns`                           |
| `revalidateTag()` single argument | `revalidateTag(tag, profile)` or `updateTag(tag)` |

---

## Best Practices

### Caching

1. **Default to dynamic** — Cache Components default to request-time execution; add `"use cache"` explicitly
2. **Use `cacheLife` profiles** — Prefer `'max'` for content that tolerates eventual consistency
3. **Use `updateTag()` in forms** — Ensures users see their submissions reflected immediately
4. **Tag granularly** — `cacheTag('user-{id}')` over `cacheTag('users')` for targeted invalidation
5. **Never mix `"use cache"` and request-time data** — cookies/headers in a cached component will throw

### Performance

6. **Enable React Compiler** — Set `reactCompiler: true` for automatic memoization in production apps
7. **Use annotation mode first** — Roll out compiler with `compilationMode: 'annotation'` before enabling globally
8. **Enable FS caching** — Turbopack FS caching is default in 16.1; verify it's active for large repos
9. **Use `after()` for analytics** — Never block response time for non-critical side effects
10. **Leverage `<Activity>`** — Pre-render likely-next screens in hidden mode for instant navigation

### Architecture

11. **Migrate `middleware.ts` → `proxy.ts`** — Future-proof before `middleware.ts` is removed
12. **Await all Next.js async APIs** — `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()`
13. **Add `default.js` to all parallel route slots** — Required or build fails
14. **Use OpenTelemetry for observability** — Built-in span emission; no custom instrumentation needed for routes
15. **Pin compiler to exact version** — Use `--save-exact` when installing `babel-plugin-react-compiler`

---

## Security Considerations

### 1. Next.js 16 Security Features

#### Enhanced Security Headers

```typescript
// next.config.ts - Security headers configuration
const securityConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = securityConfig;
```

#### Secure Cache Implementation

```typescript
// app/components/SecureCacheComponent.tsx
import { cache } from 'react';

// Secure cached component with proper validation
const SecureUserData = cache(async (userId: string) => {
  // Validate input to prevent injection
  if (!userId || typeof userId !== 'string' || !/^[a-zA-Z0-9-_]+$/.test(userId)) {
    throw new Error('Invalid user ID format');
  }

  // Use parameterized queries to prevent SQL injection
  const userData = await db.query(
    'SELECT id, name, email FROM users WHERE id = $1 AND active = true',
    [userId]
  );

  // Sanitize output data
  return {
    id: userData.id,
    name: sanitizeHtml(userData.name),
    email: userData.email.toLowerCase().trim()
  };
}, {
  tags: ['user-data'],
  revalidate: 3600 // 1 hour
});

// Usage in component
export default async function UserProfile({ userId }: { userId: string }) {
  "use cache";

  const user = await SecureUserData(userId);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### 2. Advanced Security Patterns

#### Rate Limiting with proxy.ts

```typescript
// proxy.ts - Advanced rate limiting
import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || 'unknown',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 300, // Block for 5 minutes
});

export async function middleware(request: NextRequest) {
  try {
    // Check rate limit
    await rateLimiter.consume(request.ip || 'unknown');

    // Add security headers
    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  } catch (rejRes) {
    // Rate limit exceeded
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': Math.round(rejRes.msBeforeNext / 1000).toString(),
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + rejRes.msBeforeNext).toISOString(),
      },
    });
  }
}
```

#### CSRF Protection

```typescript
// app/lib/csrf.ts
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export class CSRFProtection {
  private static readonly CSRF_COOKIE_NAME = 'csrf-token';
  private static readonly CSRF_HEADER_NAME = 'x-csrf-token';
  private static readonly TOKEN_LENGTH = 32;

  // Generate CSRF token
  static generateToken(): string {
    return randomBytes(this.TOKEN_LENGTH).toString('base64');
  }

  // Set CSRF token in HTTP-only cookie
  static setToken(token: string): void {
    cookies().set(this.CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
  }

  // Validate CSRF token
  static validateToken(requestToken: string): boolean {
    const cookieToken = cookies().get(this.CSRF_COOKIE_NAME)?.value;

    if (!cookieToken || !requestToken) {
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken, 'base64'),
      Buffer.from(requestToken, 'base64')
    );
  }

  // Extract token from request headers
  static extractToken(request: Request): string | null {
    return request.headers.get(this.CSRF_HEADER_NAME);
  }
}

// Usage in API routes
export async function POST(request: Request) {
  const token = CSRFProtection.extractToken(request);

  if (!CSRFProtection.validateToken(token || '')) {
    return Response.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  // Process request...
}
```

---

## Advanced Implementation Patterns

### 1. Edge-Native Architecture

#### Edge Computing with Next.js 16

```typescript
// app/api/edge-function/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  // Use edge-optimized APIs
  const geoData = request.geo || {};
  const userLocation = location || geoData.city || 'unknown';

  // Edge-optimized data fetching
  const data = await fetch(`https://api.example.com/data?location=${userLocation}`, {
    headers: {
      'X-Edge-Compute': 'true',
      'X-User-Location': userLocation,
    },
  });

  return Response.json({
    location: userLocation,
    data: await data.json(),
    edge: true,
    timestamp: Date.now(),
  });
}
```

#### Predictive Prefetching

```typescript
// app/components/PredictivePrefetch.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function PredictivePrefetch({
  probableRoutes,
  userBehavior,
}: {
  probableRoutes: string[];
  userBehavior: any;
}) {
  const router = useRouter();
  const prefetchedRoutes = useRef(new Set<string>());

  useEffect(() => {
    // Analyze user behavior to predict next navigation
    const predictedRoute = predictNextRoute(userBehavior, probableRoutes);

    if (predictedRoute && !prefetchedRoutes.current.has(predictedRoute)) {
      // Prefetch the predicted route
      router.prefetch(predictedRoute);
      prefetchedRoutes.current.add(predictedRoute);

      // Log prefetch for analytics
      console.log(`Prefetched predicted route: ${predictedRoute}`);
    }
  }, [userBehavior, probableRoutes, router]);

  function predictNextRoute(behavior: any, routes: string[]): string | null {
    // Simple prediction logic (replace with ML model in production)
    if (behavior.timeOnPage > 30000 && behavior.scrollDepth > 0.8) {
      return routes[0]; // User is engaged, likely to continue
    }

    return null;
  }

  return null;
}
```

### 2. Advanced Caching Strategies

#### Multi-Layer Caching

```typescript
// app/lib/advanced-cache.ts
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// Layer 1: React cache (component-level)
const reactCache = cache(async (key: string) => {
  return await fetchDataFromDatabase(key);
});

// Layer 2: Next.js unstable_cache (API-level)
const nextCache = unstable_cache(
  async (key: string) => {
    return await reactCache(key);
  },
  ['advanced-cache'],
  {
    revalidate: 3600,
    tags: ['data-layer'],
  }
);

// Layer 3: Edge cache (CDN-level)
export async function getMultiLayerData(key: string) {
  // Check React cache first
  const cached = await reactCache(key);

  if (cached) {
    // Set edge cache headers
    return new Response(JSON.stringify(cached), {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, max-age=3600',
        Vary: 'Accept-Encoding',
      },
    });
  }

  // Fetch fresh data
  const freshData = await nextCache(key);

  return new Response(JSON.stringify(freshData), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

#### Intelligent Cache Invalidation

```typescript
// app/lib/smart-cache.ts
import { revalidateTag, revalidatePath } from 'next/cache';

export class SmartCacheManager {
  private static readonly CACHE_STRATEGIES = {
    USER_DATA: {
      tags: ['user-data'],
      ttl: 300, // 5 minutes
      invalidationTriggers: ['user-update', 'profile-change'],
    },
    CONTENT: {
      tags: ['content'],
      ttl: 3600, // 1 hour
      invalidationTriggers: ['content-update', 'publish'],
    },
    ANALYTICS: {
      tags: ['analytics'],
      ttl: 1800, // 30 minutes
      invalidationTriggers: ['page-view', 'interaction'],
    },
  };

  // Smart invalidation based on event type
  static async invalidateCache(eventType: string, data: any): Promise<void> {
    const strategies = Object.values(this.CACHE_STRATEGIES);

    for (const strategy of strategies) {
      if (strategy.invalidationTriggers.includes(eventType)) {
        // Invalidate all related tags
        for (const tag of strategy.tags) {
          await revalidateTag(tag);
        }

        // Log invalidation for monitoring
        console.log(`Cache invalidated for tags: ${strategy.tags.join(', ')} due to: ${eventType}`);
      }
    }

    // Path-based invalidation for specific routes
    if (data.userId) {
      await revalidatePath(`/user/${data.userId}`);
    }

    if (data.contentId) {
      await revalidatePath(`/content/${data.contentId}`);
    }
  }

  // Predictive cache warming
  static async warmCache(userContext: any): Promise<void> {
    const probableRoutes = this.predictUserRoutes(userContext);

    for (const route of probableRoutes) {
      // Trigger cache warming
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${route}`, {
        method: 'HEAD',
        headers: {
          'X-Cache-Warm': 'true',
        },
      });
    }
  }

  private static predictUserRoutes(context: any): string[] {
    // Simple prediction based on user behavior
    const routes = [];

    if (context.recentlyViewed) {
      routes.push(...context.recentlyViewed);
    }

    if (context.userType === 'premium') {
      routes.push('/dashboard', '/analytics', '/reports');
    }

    return routes;
  }
}
```

### 3. Performance Optimization

#### React Compiler Integration

```typescript
// next.config.ts - React Compiler configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: {
      // Enable compiler in production
      compilationMode: 'full',

      // Compiler options
      options: {
        // Optimize for production builds
        optimize: true,

        // Enable source maps for debugging
        sourceMap: process.env.NODE_ENV === 'development',

        // Custom compiler plugins
        plugins: [
          // Add custom optimization plugins
        ],
      },
    },
  },

  // Enable Turbopack with custom configuration
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      '@': './src',
    },
  },
};

module.exports = nextConfig;
```

#### Advanced Performance Monitoring

```typescript
// app/lib/performance-monitor.ts
import { getServerSnapshot } from 'next/dist/client/app-index';

export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  // Track component render performance
  static trackComponentRender(componentName: string, renderTime: number): void {
    this.metrics.set(`${componentName}-render`, renderTime);

    // Alert if render time exceeds threshold
    if (renderTime > 100) { // 100ms threshold
      console.warn(`Slow render detected: ${componentName} took ${renderTime}ms`);
    }
  }

  // Track API response times
  static trackApiResponse(endpoint: string, responseTime: number): void {
    this.metrics.set(`${endpoint}-api`, responseTime);

    // Log slow APIs
    if (responseTime > 500) { // 500ms threshold
      console.warn(`Slow API response: ${endpoint} took ${responseTime}ms`);
    }
  }

  // Get performance summary
  static getPerformanceSummary(): PerformanceSummary {
    const summary: PerformanceSummary = {
      slowComponents: [],
      slowApis: [],
      averageRenderTime: 0,
      averageApiResponseTime: 0
    };

    // Analyze component performance
    for (const [key, value] of this.metrics.entries()) {
      if (key.endsWith('-render') && value > 100) {
        summary.slowComponents.push({
          name: key.replace('-render', ''),
          renderTime: value
        });
      }

      if (key.endsWith('-api') && value > 500) {
        summary.slowApis.push({
          endpoint: key.replace('-api', ''),
          responseTime: value
        });
      }
    }

    return summary;
  }

  // Performance optimization suggestions
  static getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const summary = this.getPerformanceSummary();

    if (summary.slowComponents.length > 0) {
      suggestions.push('Consider using React.memo() for slow components');
      suggestions.push('Enable React Compiler for automatic optimization');
    }

    if (summary.slowApis.length > 0) {
      suggestions.push('Implement API response caching');
      suggestions.push('Consider edge computing for faster responses');
    }

    return suggestions;
  }
}

// Usage in components
export function withPerformanceTracking<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function TrackedComponent(props: T) {
    const startTime = performance.now();

    useEffect(() => {
      const endTime = performance.now();
      PerformanceMonitor.trackComponentRender(componentName, endTime - startTime);
    });

    return <Component {...props} />;
  };
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Next.js Documentation

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [Turbopack Documentation](https://turbo.build/pack/docs)

### Security Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/security)
- [OWASP Next.js Security Guide](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/)
- [Content Security Policy Guide](https://csp.withgoogle.com/docs/)

### Performance Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

### Advanced Patterns

- [Edge Computing with Next.js](https://vercel.com/docs/concepts/functions/edge-functions)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)

## Overview

[Add content here]

## Implementation

[Add content here]

## Testing

[Add content here]
