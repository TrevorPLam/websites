---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-2-001
title: 'Implement complete Zod config schema with validation'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-2-001-config-schema
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(pnpm:*)
---

# DOMAIN-2-001 · Implement complete Zod config schema with validation

## Objective

Implement the complete Zod schema for `site.config.ts` with all configuration options, providing type-safe validation for 1000+ client sites with comprehensive error handling and AI agent compatibility.

## Context

**Current State Analysis:**

- Repository lacks comprehensive config schema validation
- Missing type-safe configuration for client sites
- No validation pipeline for site.config.ts files
- Missing schema for identity, theme, SEO, integrations, compliance
- No AI agent-friendly configuration structure

**Codebase area:** Configuration schema and validation
**Related files:** `packages/config-schema/`, site.config.ts files
**Dependencies:** Zod for validation, TypeScript for type safety
**Prior work:** Basic configuration exists but lacks comprehensive schema
**Constraints:** Must maintain compatibility with existing site configurations

**2026 Standards Compliance:**

- Configuration-as-Code philosophy with single source of truth
- Type safety with Zod validation at build time
- AI agent friendly schema structure
- Version controlled configuration changes
- Instant rollback capability through Git

## Tech Stack

| Layer             | Technology                        |
| ----------------- | --------------------------------- |
| Schema Validation | Zod 3.x for type-safe validation  |
| Type Safety       | TypeScript 5.x strict mode        |
| Configuration     | site.config.ts files              |
| Validation        | Build-time and runtime validation |
| AI Compatibility  | Schema optimized for AI agents    |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Complete Zod schema implemented with all configuration sections
- [ ] **[Agent]** Identity schema with tenant validation and domain configuration
- [ ] **[Agent]** Theme schema with color palette and typography validation
- [ ] **[Agent]** SEO schema with metadata and schema.org validation
- [ ] **[Agent]** Integrations schema for third-party services
- [ ] **[Agent]** Compliance schema with WCAG 2.2 and GDPR settings
- [ ] **[Agent]** Export validation functions for runtime checking
- [ ] **[Human]** Documentation updated with schema examples and usage

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** **Create config schema package** - Set up package structure and dependencies
- [ ] **[Agent]** **Implement identity schema** - Add tenant, domain, and contact validation
- [ ] **[Agent]** **Implement theme schema** - Add color palette, typography, and design tokens
- [ ] **[Agent]** **Implement SEO schema** - Add metadata, social media, and schema.org validation
- [ ] **[Agent]** **Implement integrations schema** - Add analytics, forms, and third-party services
- [ ] **[Agent]** **Implement compliance schema** - Add accessibility and privacy settings
- [ ] **[Agent]** **Create validation functions** - Export runtime validation utilities
- [ ] **[Agent]** **Add comprehensive tests** - Test schema validation and edge cases
- [ ] **[Human]** **Update documentation** - Document schema usage and examples

> ⚠️ **Agent Question**: Ask human before proceeding if step 2 conflicts with existing site.config.ts files.

## Commands

```bash
# Create config schema package
mkdir -p packages/config-schema/src
cd packages/config-schema

# Initialize package
pnpm init

# Install dependencies
pnpm add zod
pnpm add -D vitest @types/node typescript

# Create package structure
mkdir -p src/{identity,theme,seo,integrations,compliance}

# Build package
pnpm build

# Run tests
pnpm test

# Install in workspace
cd ../../
pnpm install
```

## Code Style

```typescript
// ✅ Correct - Comprehensive schema with validation
export const IdentitySchema = z.object({
  tenantId: z.string().regex(/^[a-z0-9-]+$/, 'Lowercase alphanumeric with hyphens'),
  tenantSlug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Must be lowercase alphanumeric with hyphens')
    .optional(),
  siteName: z.string().min(1).max(100),
  businessName: z.string().min(1).max(200),
  domain: z.object({
    primary: z.string().regex(/^[a-z0-9-]+\.[a-z]{2,}$/, 'Invalid domain format'),
    subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Invalid subdomain'),
    customDomain: z.string().optional(),
    customDomains: z.array(z.string().regex(/^[a-z0-9-]+\.[a-z]{2,}$/)).optional(),
    pathBased: z.boolean().default(false),
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'E.164 format required'),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    }),
  }),
});

// ❌ Incorrect - Missing validation and incomplete schema
export const IdentitySchema = z.object({
  tenantId: z.string(),
  siteName: z.string(),
  domain: z.object({
    primary: z.string(),
  }),
});
```

**Naming conventions:**

- Schema names: `PascalCase` - `IdentitySchema`, `ThemeSchema`, `SeoSchema`
- Validation functions: `camelCase` - `validateSiteConfig`, `validateIdentity`
- Package exports: `camelCase` - `identitySchema`, `themeSchema`, `seoSchema`

## Boundaries

| Tier             | Scope                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create schema package; implement all schema sections; add validation functions; test schema validation; document usage patterns              |
| ⚠️ **Ask first** | Modifying existing site.config.ts files; changing schema structure; adding new required fields; breaking existing configurations             |
| 🚫 **Never**     | Removing existing configuration options; breaking backward compatibility; ignoring validation errors; modifying package.json without testing |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Run `pnpm -r build` — All packages build successfully with new schema
- [ ] **[Agent]** Run `pnpm -r test` — All schema validation tests pass
- [ ] **[Agent]** Test schema validation — Invalid configs fail validation with clear errors
- [ ] **[Agent]** Verify type safety — TypeScript compilation with strict mode
- [ ] **[Agent]** Check package exports — All schemas properly exported and accessible
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Schema conflicts:** Existing site.config.ts files may not match new schema
- **Validation errors:** Must provide clear, actionable error messages
- **Type compatibility:** Ensure schema types work with existing code
- **Performance:** Schema validation should be fast for CI/CD pipelines
- **Backward compatibility:** Must handle optional fields gracefully

## Out of Scope

- Modifying existing site.config.ts files
- Creating site configuration files
- Implementing configuration UI or admin interfaces
- Database schema changes

## References

- [Domain 2.2 Full Zod Schema](../../../docs/plan/domain-2/2.2-full-zod-schema-with-all-configuration-options.md)
- [Zod Documentation](../../../docs/guides/zod-documentation.md)
- [Configuration-as-Code Philosophy](../../../docs/plan/domain-2/2.1-philosophy-configuration-as-code.md)
