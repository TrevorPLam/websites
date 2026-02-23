# Turbopack — Official Documentation Reference

> **Version Reference:** Turbopack (Stable, Next.js 16) | Turbopack FS Cache (Stable, Next.js 16.1) | Last Updated: 2026-02-23
> **Purpose:** AI agent reference for Turbopack architecture, configuration, performance tuning,
> Webpack migration, and ecosystem compatibility.

---


## What is Turbopack?

Turbopack is a **Rust-based incremental bundler** developed by Vercel, purpose-built for
large-scale JavaScript and TypeScript applications. It is the successor to Webpack in the
Next.js ecosystem and became the **stable default bundler** in Next.js 16 (October 2025).

**Design goals:**

- Incremental computation — only re-process changed modules
- Demand-driven evaluation — only build what is needed for the current request
- Persistent caching — artifact reuse across restarts and builds
- Zero configuration for Next.js apps

---

## Architecture

```
Source Files (JS/TS/CSS/Assets)
        │
        ▼
   Turbopack Engine (Rust)
   ┌──────────────────────────────┐
   │  Turbo Task (Task Engine)    │
   │  - Reactive computation      │
   │  - Automatic invalidation    │
   │  - Memoized task results     │
   ├──────────────────────────────┤
   │  Module Graph                │
   │  - Demand-driven evaluation  │
   │  - Lazy chunk generation     │
   │  - Cross-boundary tracing    │
   ├──────────────────────────────┤
   │  Filesystem Cache (16.1)     │
   │  - Persistent disk storage   │
   │  - Cross-restart artifact    │
   │    reuse                     │
   └──────────────────────────────┘
        │
        ▼
   Output (JS Chunks + CSS + Assets)
```

### Turbo Tasks — The Core Engine

Turbopack is built on **Turbo Tasks**, a reactive computation framework written in Rust. Every
operation is a Turbo Task — a function that:

- Tracks its inputs and outputs
- Automatically invalidates when inputs change
- Stores results in an in-memory (and now disk) cache
- Only re-executes when its specific inputs have changed

This means editing `Button.tsx` only recompiles `Button.tsx` and its direct dependents — not the
entire application.

---

## Performance Benchmarks

### Real-World Benchmarks (Next.js 16, mid-sized app: 40+ pages, Tailwind, tRPC, Prisma)

| Metric             | Webpack | Turbopack | Improvement  |
| ------------------ | ------- | --------- | ------------ |
| Cold start (dev)   | 4.2s    | 1.1s      | 3.8× faster  |
| Fast Refresh (HMR) | ~800ms  | ~90ms     | ~9× faster   |
| Production build   | ~42s    | ~18s      | ~2.3× faster |

### Filesystem Cache Benchmarks (Next.js 16.1)

| App                       | Cold Compile | Cached Compile | Speedup     |
| ------------------------- | ------------ | -------------- | ----------- |
| react.dev                 | 3.7s         | 380ms          | ~10× faster |
| nextjs.org                | 3.5s         | 700ms          | ~5× faster  |
| Large Vercel internal app | 15s          | 1.1s           | ~14× faster |

### Claimed Maximum Performance

- Up to **700× faster incremental builds** (individual file change → HMR)
- Up to **10× faster Fast Refresh** vs Webpack
- Up to **2–5× faster production builds**

---

## Status in Next.js 16

| Feature | Next.js 15 | Next.js 16 |

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

## Configuration

[Add content here]

## Filesystem Caching

[Add content here]

## Aliases & Module Resolution

[Add content here]

## Loaders

[Add content here]

## Environment Variables

[Add content here]

## Tree Shaking & Code Splitting

[Add content here]

## Source Maps

[Add content here]

## Migrating from Webpack

[Add content here]

## Babel Config Detection

[Add content here]

## Bundle Analyzer (16.1)

[Add content here]

## serverExternalPackages & Transitive Deps

[Add content here]

## Debugging with --inspect

[Add content here]

## Known Limitations

[Add content here]