# react-19-documentation.md

> **2026 Standards Compliance** | React 19.2 · React Compiler 1.0 Stable ·
> Activity API · useEffectEvent · View Transitions · Next.js 16 Integration

## Table of Contents

1. [Overview & What's New in 19.2](#overview--whats-new-in-192)
2. [React Compiler 1.0 — Stable](#react-compiler-10--stable)
3. [Activity Component](#activity-component)
4. [useEffectEvent Hook](#useeffectevent-hook)
5. [Actions & Form State (19.0 Recap)](#actions--form-state-190-recap)
6. [Server Components Patterns](#server-components-patterns)
7. [View Transitions](#view-transitions)
8. [Performance Patterns with Activity](#performance-patterns-with-activity)
9. [Migration Guide](#migration-guide)
10. [References](#references)

---

## Overview & What's New in 19.2

React 19.2, shipped in October 2025, is a significant update that stabilizes the React
Compiler and introduces first-class primitives for managing UI state complexity. [web:25][web:28]

| Feature                    | Status         | Description                                                       |
| -------------------------- | -------------- | ----------------------------------------------------------------- |
| React Compiler             | **Stable 1.0** | Build-time memoization; replaces `useMemo`/`useCallback` [web:34] |
| `<Activity />`             | **New**        | Hide/show UI preserving state without unmounting [web:28]         |
| `useEffectEvent`           | **New**        | Decouple event logic from effect dependencies [web:25]            |
| View Transitions           | **New**        | Declarative page/element transitions via browser API [web:31]     |
| Performance Tracks         | **New**        | Chrome DevTools integration for React render profiling [web:31]   |
| `use()`                    | **Stable**     | Read Promises and Context in render                               |
| Actions / `useActionState` | **Stable**     | Full-stack form mutations [web:34]                                |

---

## React Compiler 1.0 — Stable

The React Compiler is now **stable and production-ready**. It eliminates the need for
manual memoization by analyzing your component tree at build time and inserting optimal
`useMemo`/`useCallback` equivalents automatically. [web:34]

### Setup in Next.js 16

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true, // Enable stable React Compiler
  },
};

export default nextConfig;
```

```bash
# Install compiler babel plugin (used by Next.js internally)
pnpm add -D babel-plugin-react-compiler
```

### Before vs After Compiler

**Before (manual memoization — verbose and error-prone):**

```typescript
// ❌ Manual memoization — what you had to write before
function ProductList({ products, onSelect }: ProductListProps) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  )

  const handleSelect = useCallback(
    (id: string) => onSelect(id),
    [onSelect],
  )

  return (
    <ul>
      {sortedProducts.map(p => (
        <ProductItem key={p.id} product={p} onSelect={handleSelect} />
      ))}
    </ul>
  )
}
```

**After (compiler handles it — clean component logic):**

```typescript
// ✅ React Compiler handles memoization at build time
function ProductList({ products, onSelect }: ProductListProps) {
  // Compiler automatically memoizes derived values and callbacks
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <ul>
      {sortedProducts.map(p => (
        <ProductItem key={p.id} product={p} onSelect={id => onSelect(id)} />
      ))}
    </ul>
  )
}
```

### Compiler Linting Rules

```bash
# Install the compiler ESLint plugin
pnpm add -D eslint-plugin-react-compiler
```

```javascript
// eslint.config.js
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: {
      // Warns about patterns that prevent compiler optimization
      'react-compiler/react-compiler': 'warn',
    },
  },
];
```

### Rules of React Compiler (What Breaks Optimization)

The compiler can only optimize components that follow the Rules of React. Common
violations that prevent optimization:

```typescript
// ❌ Mutating props or state directly — breaks compiler
function BadComponent({ items }: { items: string[] }) {
  items.push('new') // Direct mutation — unpredictable
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
}

// ✅ Pure, immutable operations — compiler can optimize
function GoodComponent({ items }: { items: string[] }) {
  const withNew = [...items, 'new']
  return <ul>{withNew.map(i => <li key={i}>{i}</li>)}</ul>
}

// ❌ Calling hooks conditionally — breaks compiler
function ConditionalHook({ isAdmin }: { isAdmin: boolean }) {
  if (isAdmin) {
    const data = useAdminData() // Conditional hook — forbidden
  }
}

// ❌ Reading refs during render — breaks optimization
function RefDuringRender({ ref }: { ref: React.RefObject<HTMLElement> }) {
  const height = ref.current?.offsetHeight  // Side effect during render
}
```

---

## Activity Component

`<Activity>` is React 19.2's solution for managing hidden-but-retained UI — tabs,
drawers, wizard steps, and back-navigation state. [web:25][web:28]

### Core Behavior

```
mode="visible"  →  Component renders normally, is interactive, paints to screen
mode="hidden"   →  Component continues rendering (data fetches, state updates)
                   but does NOT paint — zero visual or layout impact
```

This means hidden activities can **prefetch data** and **warm up state** while
invisible, making the transition to `visible` instantaneous.

### Basic Usage

```typescript
import { Activity } from 'react'

function TabbedDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'settings'>('analytics')

  return (
    <div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ✅ All tabs render simultaneously; only active one paints */}
      <Activity mode={activeTab === 'analytics' ? 'visible' : 'hidden'}>
        <AnalyticsTab />    {/* Data fetches continue in background */}
      </Activity>

      <Activity mode={activeTab === 'leads' ? 'visible' : 'hidden'}>
        <LeadsTab />        {/* Form state preserved when switching away */}
      </Activity>

      <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsTab />     {/* Settings don't lose unsaved changes */}
      </Activity>
    </div>
  )
}
```

**Compared to previous patterns:**

```typescript
// ❌ Before — loses state on tab switch, refetches data every time
{activeTab === 'leads' && <LeadsTab />}

// ❌ Before — CSS hide (display: none) — component still in DOM but hidden
<div style={{ display: activeTab === 'leads' ? 'block' : 'none' }}>
  <LeadsTab />
</div>

// ✅ Activity — state preserved, data prefetched, zero paint overhead
<Activity mode={activeTab === 'leads' ? 'visible' : 'hidden'}>
  <LeadsTab />
</Activity>
```

### Route Prefetching with Activity

One of the most powerful uses: prefetch the next likely page while the current one
is visible:

```typescript
// components/NavigationPrefetcher.tsx
import { Activity } from 'react'

interface NavigationPrefetcherProps {
  currentPath: string
  children: React.ReactNode
}

export function NavigationPrefetcher({
  currentPath,
  children,
}: NavigationPrefetcherProps) {
  return (
    <>
      {children}

      {/* Prefetch dashboard while user is on login page */}
      {currentPath === '/login' && (
        <Activity mode="hidden">
          <DashboardShell />   {/* Prefetches dashboard data in background */}
        </Activity>
      )}

      {/* Prefetch settings while user is on dashboard */}
      {currentPath === '/dashboard' && (
        <Activity mode="hidden">
          <SettingsPage />
        </Activity>
      )}
    </>
  )
}
```

### Wizard / Multi-Step Form State Preservation

```typescript
// components/OnboardingWizard.tsx
import { Activity } from 'react'
import { useState } from 'react'

export function OnboardingWizard() {
  const [step, setStep] = useState(1)

  return (
    <div>
      <StepIndicator current={step} total={4} />

      {/* Each step retains its form state even when navigating back */}
      <Activity mode={step === 1 ? 'visible' : 'hidden'}>
        <BusinessInfoStep onNext={() => setStep(2)} />
      </Activity>

      <Activity mode={step === 2 ? 'visible' : 'hidden'}>
        <ServiceAreaStep onNext={() => setStep(3)} onBack={() => setStep(1)} />
      </Activity>

      <Activity mode={step === 3 ? 'visible' : 'hidden'}>
        <BillingStep onNext={() => setStep(4)} onBack={() => setStep(2)} />
      </Activity>

      <Activity mode={step === 4 ? 'visible' : 'hidden'}>
        <ReviewStep onBack={() => setStep(3)} />
      </Activity>
    </div>
  )
}
```

---

## useEffectEvent Hook

`useEffectEvent` separates **event-driven logic** (values read at the time of an
event) from **reactive dependencies** (values that should retrigger the effect). [web:25]

### The Problem It Solves

```typescript
// ❌ Before — verbose suppression or stale closure problems
function AnalyticsTracker({ eventName, userId }: { eventName: string; userId: string }) {
  useEffect(() => {
    // We want this to run when eventName changes
    // BUT userId should be current at time of event, not a dependency
    trackEvent(eventName, { userId }); // eslint-disable-line react-hooks/exhaustive-deps
  }, [eventName]); // Stale userId — but adding it causes unwanted re-runs
}
```

```typescript
// ✅ After — useEffectEvent: userId is always fresh, eventName triggers re-runs
import { useEffect, useEffectEvent } from 'react';

function AnalyticsTracker({ eventName, userId }: { eventName: string; userId: string }) {
  // track is an "effect event" — not reactive, always reads latest values
  const track = useEffectEvent(() => {
    trackEvent(eventName, { userId });
  });

  useEffect(() => {
    track();
  }, [eventName]); // Only eventName is a dependency — userId reads current value
}
```

### Real-World Pattern: Realtime Subscription with Non-Reactive Config

```typescript
// packages/realtime/src/use-realtime-channel.ts
import { useEffect, useEffectEvent } from 'react';
import { supabase } from '@/shared/api/supabase-client';

function useRealtimeChannel<T>(
  channel: string,
  onMessage: (payload: T) => void,
  options: { enabled: boolean; debug: boolean }
) {
  // Capture non-reactive values in effect event
  // onMessage and options.debug should not retrigger the subscription
  const handleMessage = useEffectEvent((payload: T) => {
    if (options.debug) console.log('[Realtime]', channel, payload);
    onMessage(payload);
  });

  useEffect(() => {
    if (!options.enabled) return;

    const sub = supabase
      .channel(channel)
      .on('broadcast', { event: '*' }, ({ payload }) => {
        handleMessage(payload as T);
      })
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, [channel, options.enabled]); // Only reactive to channel + enabled changes
}
```

---

## Actions & Form State (19.0 Recap)

React 19.0 (Dec 2024) introduced Actions as the canonical mutation pattern. In 19.2
these are now fully stable and integrated with the compiler.

```typescript
// features/contact-form/ui/ContactForm.tsx
'use client'
import { useActionState, useOptimistic, startTransition } from 'react'
import { submitContactAction } from '../api/submit-contact-action'

export function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactAction, null)

  // Optimistic UI: show "Submitting..." state immediately
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (_, newState: string) => ({ status: newState }),
  )

  return (
    <form
      action={action}
      aria-live="polite"
      aria-busy={isPending}
    >
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        aria-required="true"
        disabled={isPending}
      />
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        aria-required="true"
        disabled={isPending}
      />
      <textarea name="message" rows={4} disabled={isPending} />

      <button type="submit" disabled={isPending} aria-disabled={isPending}>
        {isPending ? 'Sending…' : 'Send Message'}
      </button>

      {state?.success && (
        <p role="status" className="text-green-600">
          Message sent! We'll be in touch within 24 hours.
        </p>
      )}
      {state?.error && (
        <p role="alert" className="text-red-600">
          {state.error}
        </p>
      )}
    </form>
  )
}
```

---

## Server Components Patterns

### Data Fetching Without `useEffect`

```typescript
// pages/dashboard/index.tsx — Server Component
// No useEffect, no useState for async data — just async/await
export async function DashboardPage({ tenantId }: { tenantId: string }) {
  // Parallel data fetching — compiler optimizes re-renders
  const [analytics, leads, team] = await Promise.all([
    fetchAnalyticsSummary(tenantId),
    fetchRecentLeads(tenantId, { limit: 10 }),
    fetchTeamMembers(tenantId),
  ])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <AnalyticsCard data={analytics} />
      <LeadFeed leads={leads} />
      <TeamPanel members={team} />
    </div>
  )
}
```

### `use()` for Deferred Data

```typescript
// Use the `use()` hook to read a Promise in a Client Component
// (enables streaming — the Suspense boundary above handles loading)
'use client'
import { use } from 'react'

export function LazyAnalyticsChart({
  dataPromise,
}: {
  dataPromise: Promise<AnalyticsData>
}) {
  // `use()` suspends the component until the promise resolves
  // The nearest <Suspense fallback> handles loading state
  const data = use(dataPromise)
  return <LineChart data={data} />
}
```

---

## View Transitions

```typescript
// hooks/use-view-transition.ts
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

export function useViewTransition() {
  const router = useRouter();

  const navigateWithTransition = (href: string) => {
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }

    document.startViewTransition(() => {
      startTransition(() => {
        router.push(href);
      });
    });
  };

  return { navigateWithTransition };
}

// CSS for View Transitions
// app/globals.css
// ::view-transition-old(root) { animation: fade-out 0.15s ease; }
// ::view-transition-new(root) { animation: fade-in 0.15s ease; }
```

---

## Migration Guide

### From React 18 to 19.2

| React 18 Pattern                         | React 19.2 Replacement              | Notes                      |
| ---------------------------------------- | ----------------------------------- | -------------------------- |
| `useCallback(fn, deps)`                  | Remove — Compiler handles it        | Only if Compiler enabled   |
| `useMemo(fn, deps)`                      | Remove — Compiler handles it        | Only for pure computations |
| `useState` + `useEffect` for server data | Server Component + `async/await`    | For server-rendered data   |
| Manual loading/error state               | `useActionState`                    | For mutations              |
| `{cond && <Comp />}` for hidden UI       | `<Activity mode="hidden\|visible">` | For state preservation     |
| `useEffect` with stale closures          | `useEffectEvent` + `useEffect`      | For reactive effects       |

### Compiler Adoption Strategy

1. **Audit first**: Run `eslint-plugin-react-compiler` and fix violations
2. **Enable incrementally**: Start with `packages/ui` (pure components, easiest)
3. **Remove useMemo/useCallback** only after verifying with React DevTools Profiler
4. **Do not remove `memo()`** on list items yet — wait for performance profiling data

---

## References

- [React 19.2 Official Blog](https://react.dev/blog/2025/10/01/react-19-2) [web:28]
- [React Compiler Docs](https://react.dev/learn/react-compiler)
- [Activity API Docs](https://react.dev/reference/react/Activity)
- [useEffectEvent Docs](https://react.dev/reference/react/experimental_useEffectEvent)
- [React 19.2 — InfoQ Coverage](https://www.infoq.com/news/2025/10/meta-ships-react-19-2/) [web:25]
- [JSJ 670 — React 19.2 Deep Dive](https://www.youtube.com/watch?v=-BMm--uHb6s) [web:31]
- [Reddit: React 19 → 19.2 Key Features](https://www.reddit.com/r/react/comments/1rb7qub/) [web:34]
