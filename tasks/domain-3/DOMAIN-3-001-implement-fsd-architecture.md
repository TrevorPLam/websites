---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-3-001
title: 'Implement FSD v2.1 architecture with proper layer structure'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: refactor # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-3-001-fsd-architecture
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-3-001 · Implement FSD v2.1 architecture with proper layer structure

## Objective

Restructure all packages to follow Feature-Sliced Design v2.1 with proper layer hierarchy (app → pages → widgets → features → entities → shared) and unidirectional dependencies as specified in sections 3.1-3.2.

---

## Context

**Codebase area:** All packages/ directories — complete architectural restructuring

**Related files:** `packages/ui/src/`, `packages/features/src/`, `packages/marketing-components/src/`, all package exports

**Dependencies:** Existing components and features, FSD v2.1 methodology, Steiger linter

**Prior work:** Basic component structure exists but doesn't follow FSD layering properly

**Constraints:** Must maintain backward compatibility while restructuring to FSD layers

---

## Tech Stack

| Layer        | Technology                                |
| ------------ | ----------------------------------------- |
| Architecture | Feature-Sliced Design v2.1 methodology    |
| Validation   | Steiger FSD linter for rule enforcement   |
| Migration    | Automated refactoring tools and scripts   |
| Testing      | Vitest for component migration validation |

---

## Acceptance Criteria

- [ ] **[Agent]** Restructure packages/ui/src/ to follow FSD layers (app, pages, widgets, features, entities, shared)
- [ ] **[Agent]** Restructure packages/features/src/ to proper FSD layering
- [ ] **[Agent]** Restructure packages/marketing-components/src/ to FSD layers
- [ ] **[Agent]** Implement @x notation for cross-slice imports where needed
- [ ] **[Agent]** Update all package exports to follow FSD public API pattern
- [ ] **[Agent]** Create proper index.ts files for each slice
- [ ] **[Agent]** Ensure unidirectional dependencies (no upward imports)
- [ ] **[Agent]** Add Steiger configuration for FSD validation
- [ ] **[Agent]** Test all existing functionality still works after restructuring
- [ ] **[Agent]** Run Steiger linter to validate FSD compliance
- [ ] **[Human]** Verify FSD architecture follows section 3.2 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Backup existing structure** — Create backup of current package structures
- [ ] **[Agent]** **Create FSD layer directories** — Add app/, pages/, widgets/, features/, entities/, shared/ to packages/ui/src/
- [ ] **[Agent]** **Migrate existing components** — Move components to appropriate FSD layers
- [ ] **[Agent]** **Restructure features package** — Reorganize packages/features/src/ to FSD layers
- [ ] **[Agent]** **Update marketing components** — Apply FSD structure to packages/marketing-components/
- [ ] **[Agent]** **Implement @x notation** — Add @x/ directories for cross-slice imports
- [ ] **[Agent]** **Update package exports** — Ensure proper index.ts exports for each layer
- [ ] **[Agent]** **Configure Steiger** — Add .steiger.json with FSD rules
- [ ] **[Agent]** **Test functionality** — Verify all components and features work after migration
- [ ] **[Agent]** **Run FSD validation** — Execute Steiger linter to ensure compliance

> ⚠️ **Agent Question**: Ask human before proceeding if any critical components might break during restructuring.

---

## Commands

```bash
# Install Steiger linter
pnpm add -D @feature-sliced/steiger

# Run FSD validation
pnpm turbo run lint:fsd

# Test components after restructuring
pnpm test --filter="@repo/ui"
pnpm test --filter="@repo/features"

# Validate package exports
pnpm build --filter="@repo/ui"
pnpm build --filter="@repo/features"
```

---

## Code Style

```typescript
// ✅ Correct — FSD layer structure
packages/ui/src/
├── app/                      # Application layer (rare in shared packages)
├── pages/                    # Page layer (route-level compositions)
├── widgets/                  # Widget layer (complex UI compositions)
│   ├── header/
│   │   ├── ui/Header.tsx
│   │   └── index.ts
│   └── footer/
├── features/                 # Features layer (business logic)
│   ├── contact-form/
│   │   ├── ui/ContactForm.tsx
│   │   ├── model/validation.ts
│   │   └── index.ts
│   └── navigation/
├── entities/                 # Entities layer (domain models)
│   ├── lead/
│   │   ├── model/lead.ts
│   │   ├── @x/index.ts
│   │   └── index.ts
│   └── user/
└── shared/                   # Shared layer (infrastructure)
    ├── ui/
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── index.ts
    │   └── index.ts
    └── lib/
```

```typescript
// ✅ Correct — Cross-slice import with @x notation
// packages/ui/src/entities/order/model/order.ts
import { User, type UserDTO } from '@/entities/user/@x';

export interface Order {
  id: string;
  user: UserDTO; // Cross-reference via @x
  items: OrderItem[];
  total: number;
}
```

**FSD principles:**

- Unidirectional dependencies only
- Lower layers cannot import from upper layers
- Same-layer imports via @x notation only
- Public API through index.ts exports
- Layer-specific responsibilities clearly defined

---

## Boundaries

| Tier             | Scope                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Restructure to FSD layers; implement @x notation; follow section 3.2 specification; maintain backward compatibility        |
| ⚠️ **Ask first** | Breaking existing component APIs; changing public exports; modifying component interfaces used by other packages           |
| 🚫 **Never**     | Allow upward layer imports; ignore FSD rules; break existing functionality without migration path; skip Steiger validation |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm turbo run lint:fsd` — zero FSD violations
- [ ] **[Agent]** Run `pnpm build --filter="@repo/ui"` — builds successfully
- [ ] **[Agent]** Run `pnpm build --filter="@repo/features"` — builds successfully
- [ ] **[Agent]** Run component tests — all tests pass after restructuring
- [ ] **[Agent]** Verify imports — no upward layer imports detected
- [ ] **[Human]** Compare structure with section 3.2 specification — 100% compliance
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Import path updates:** All internal imports must be updated to new FSD structure
- **Component interfaces:** Ensure component props don't break during migration
- **Circular dependencies:** Watch for unintended circular dependencies during restructuring
- **Export consistency:** Ensure all slices have proper index.ts exports
- **Backward compatibility:** Maintain existing component APIs where possible

---

## Out of Scope

- Complete component redesign (only structural migration)
- New component creation during migration
- Performance optimization during restructuring
- Documentation updates beyond AGENTS.md files

## QA Status

**Quality Assurance:** ✅ COMPLETED - Comprehensive QA review passed
**QA Report:** [docs/qa-reports/domain-3-quality-assurance-report.md](docs/qa-reports/domain-3-quality-assurance-report.md)
**Quality Score:** 94% - EXCELLENT
**Ready for Execution:** 3-4 day timeline with high confidence

---

## Implementation Notes

- All tasks follow FSD v2.1 specification exactly
- Comprehensive AI agent context management implemented
- Steiger CI integration ready for architectural enforcement
- Per-package AGENTS.md stubs provide efficient AI navigation
- CLAUDE.md sub-agents enable specialized validation
- Cold-start checklist ensures consistent AI agent sessions

---

## References

- [Section 3.2 Complete Layer Architecture](docs/plan/domain-3/3.2-complete-layer-architecture.md)
- [Section 3.3 @x Notation](docs/plan/domain-3/3.3-x-notation-for-cross-slice-imports.md)
- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [Steiger Linter Documentation](https://github.com/feature-sliced/steiger)
- [QA Report](docs/qa-reports/domain-3-quality-assurance-report.md)
