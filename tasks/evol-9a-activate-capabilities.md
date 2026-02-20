# EVOL-9a activateCapabilities + CapabilityProvider

## Metadata

- **Task ID**: evol-9a-activate-capabilities
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: Phase 4 (Weeks 17-19)
- **Related Epics / ADRs**: ROADMAP Phase 4, evol-9, evol-8
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-7, evol-8
- **Downstream Tasks**: evol-9b

## Context

Implement activateCapabilities(siteConfig.capabilities) and CapabilityProvider context. Resolves capability IDs to feature instances and provides them to the tree. Part of evol-9; evol-9b will consume these for UniversalPage. Per ROADMAP Phase 4 Weeks 17-19.

## Dependencies

- evol-7 (featureRegistry), evol-8 (capabilities in site.config)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **References**: ROADMAP Phase 4, [packages/page-templates/](../packages/page-templates/).

### Deep research (online)

- **React Server Components (RSC):** Server Components are async by default; you can `await` in render. Fetch data on the server and pass only serializable props to Client Components. Use Suspense boundaries to stream and avoid waterfalls. (React Server Components, Next.js data fetching 2024.)
- **Context and async data:** For RSC, resolve capabilities on the server (activateCapabilities) and pass resolved data as props or via a Server Component tree; avoid putting async resolution in client context. If CapabilityProvider is client-side, pass pre-resolved capability list from a parent Server Component. Minimize RSC payload by passing server components as children. (React 19, RSC payload optimization.)
- **Best practices:** Parallel data fetching with Suspense; use `use()` for streaming promises in client components if needed. Establish capability context early in the request so all consumers see the same resolved set.

## Related Files

- `packages/page-templates/src/activate-capabilities.ts` – create
- `packages/page-templates/src/CapabilityProvider.tsx` – create
- `packages/types/src/site-config.ts` – add renderer?: 'classic' | 'universal'

## Acceptance Criteria

- [ ] activateCapabilities(capabilityConfigs) returns resolved capability instances
- [ ] CapabilityProvider provides capabilities to React tree
- [ ] renderer: 'universal' in SiteConfig (opt-in)
- [ ] Tests for activation and provider

## Implementation Plan

- [ ] Add renderer to SiteConfig type
- [ ] Create activateCapabilities (async resolve from featureRegistry)
- [ ] Create CapabilityProvider (React context)
- [ ] Add tests
- [ ] Document

## Sample code / examples

```typescript
// activate-capabilities.ts — run in RSC; returns resolved capabilities for this site
import { featureRegistry } from '@repo/infra/features';

export async function activateCapabilities(
  capabilityConfigs: Array<{ id: string; enabled: boolean; config?: unknown }>
) {
  const registry = featureRegistry();
  const resolved = capabilityConfigs
    .filter((c) => c.enabled)
    .map((c) => registry.get(c.id))
    .filter(Boolean);
  return resolved;
}
```

```tsx
// CapabilityProvider.tsx — client or server; receives pre-resolved capabilities from parent RSC
'use client';
import { createContext, useContext } from 'react';

const CapabilityContext = createContext<ResolvedCapability[]>([]);
export function CapabilityProvider({
  capabilities,
  children,
}: {
  capabilities: ResolvedCapability[];
  children: React.ReactNode;
}) {
  return <CapabilityContext.Provider value={capabilities}>{children}</CapabilityContext.Provider>;
}
export function useCapabilities() {
  return useContext(CapabilityContext);
}
```

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] evol-9b can use activateCapabilities + CapabilityProvider in UniversalPage
