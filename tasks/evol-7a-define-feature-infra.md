# EVOL-7a defineFeature + featureRegistry (Infra)

## Metadata

- **Task ID**: evol-7a-define-feature-infra
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 3 (Weeks 11-13)
- **Related Epics / ADRs**: ROADMAP Phase 3, evol-7, inf-14
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-3, evol-5, evol-6
- **Downstream Tasks**: evol-7b, evol-8

## Context

Create defineFeature and featureRegistry in @repo/infra/features. Provides the capability declaration and registration API; evol-7b will implement BookingFeature using it. Per ROADMAP Phase 3 Weeks 11-13.

## Dependencies

- evol-3 (registry metadata), evol-5 (booking canonical), evol-6 (integration registry)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).
- **References**: ROADMAP Phase 3, inf-14.

### Deep research (online)

- **Plugin/capability registry pattern:** Central registry with `register()`, `get(id)`, `getAll()` (or `list()`). Use a generic registry that enforces a common interface (e.g. `Feature` with id, version, provides, configSchema, onActivate). TypeScript type registry patterns allow extensible registration across modules with compile-time safety. (Function/plugin registry pattern, designing plugin systems in TypeScript 2024.)
- **Lifecycle:** Common hooks include before/after register and before/after unregister; for capabilities, `onActivate(config, context)` runs when a capability is enabled for a site. Keep lifecycle sync unless async init is required (then support Promise in onActivate). (Registry lifecycle management patterns.)
- **Best practices:** Isolated modules that implement the interface; no core code changes to add capabilities; support dynamic feature loading and clear contracts (provides: sections, integrations, dataContracts).

## Related Files

- `packages/infra/features/` or `packages/infra/src/features/` – create
- Package exports for defineFeature, featureRegistry

## Acceptance Criteria

- [ ] defineFeature({ id, version, provides, configSchema, onActivate }) API
- [ ] featureRegistry.register(Feature)
- [ ] featureRegistry.get(id), list, resolve for site.config
- [ ] Document how to add new capability
- [ ] Unit tests for defineFeature and featureRegistry

## Implementation Plan

- [ ] Create @repo/infra/features package or module
- [ ] Implement defineFeature
- [ ] Implement featureRegistry
- [ ] Export from @repo/infra
- [ ] Add tests
- [ ] Document

## Sample code / examples

```typescript
// packages/infra/src/features/registry.ts (conceptual)
export interface FeatureDefinition {
  id: string;
  version: string;
  provides: { sections?: string[]; integrations?: string[]; dataContracts?: string[] };
  configSchema?: ZodType;
  onActivate?(config: unknown, context: ActivationContext): void | Promise<void>;
}

const registry = new Map<string, FeatureDefinition>();

export function defineFeature(def: FeatureDefinition): FeatureDefinition {
  return def;
}

export function featureRegistry() {
  return {
    register(feature: FeatureDefinition) {
      registry.set(feature.id, feature);
    },
    get(id: string) {
      return registry.get(id);
    },
    list() {
      return Array.from(registry.values());
    },
  };
}
```

## Sample code / examples

```typescript
// packages/infra/src/features/registry.ts (conceptual)
export interface FeatureDefinition {
  id: string;
  version: string;
  provides: { sections?: string[]; integrations?: string[]; dataContracts?: string[] };
  configSchema?: ZodType;
  onActivate?(config: unknown, context: ActivationContext): void | Promise<void>;
}
const registry = new Map<string, FeatureDefinition>();
export function defineFeature(def: FeatureDefinition): FeatureDefinition {
  return def;
}
export function featureRegistry() {
  return {
    register(feature: FeatureDefinition) {
      registry.set(feature.id, feature);
    },
    get(id: string) {
      return registry.get(id);
    },
    list() {
      return Array.from(registry.values());
    },
  };
}
```

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] evol-7b can register BookingFeature
