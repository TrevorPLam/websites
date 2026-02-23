# Research Inventory (Documentation Quality)

## Next.js 16 Patterns (Stable PPR)

- [x] Stable Partial Pre-rendering (PPR): Use `<Suspense>` for dynamic holes in static shells.
- [x] `use cache` Directive: Fine-grained control over server component and data caching.
- [x] Turbopack FS Cache: Persistent disk caching for faster cold builds (16.1+).

## React 19.2 Concurrency (2026)

- [x] `<Activity />` Component: Manage background work and hidden pre-rendering (`visible` vs `hidden`).
- [x] `useEffectEvent` Hook: Stabilize event logic callbacks outside of reactive effects.
- [x] `cacheSignal` API: Abort/manage cached work.
- [x] Chrome DevTools Performance Tracks: React-specific internals monitoring.

## Post-Quantum Cryptography (PQC)

- [x] FIPS-203 (ML-KEM): Module-Lattice-Based Key-Encapsulation Mechanism (formerly Kyber).
- [x] FIPS-204 (ML-DSA): Module-Lattice-Based Digital Signature Algorithm (formerly Dilithium).
- [x] Noble Post-Quantum: Use `@noble/post-quantum` for minimalist, auditable implementations.
- [x] Hybrid Exchange: Mix classical (X25519) with PQC for fallback security.

## Multi-agent Orchestration

- [ ] Tiered Agent Hierarchies (Orchestrator/Researcher/Writer/Validator).
- [ ] Task Protocol JSON (Inter-agent communication format).
- [ ] Automated Verification Loops (Self-correcting documentation pipelines).
