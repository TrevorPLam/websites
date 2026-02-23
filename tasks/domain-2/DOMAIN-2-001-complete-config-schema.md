---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-2-001
title: 'Implement complete Zod config schema with all options'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-2-001-complete-config-schema
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-2-001 · Implement complete Zod config schema with all options

## Objective

Implement the complete Zod schema for `site.config.ts` matching section 2.2 specification, providing comprehensive validation for identity, theme, SEO, integrations, compliance, and all configuration options for 1000+ client sites.

---

## Context

**Codebase area:** `packages/config-schema/src/schema.ts` — complete configuration schema

**Related files:** `packages/config-schema/src/index.ts`, `packages/config-schema/src/validation.ts`, all site.config.ts files

**Dependencies:** Zod v3.24.0+, TypeScript 5.7.2+, existing partial schema

**Prior work:** Basic schema exists with identity and theme sections only

**Constraints:** Must maintain backward compatibility with existing site configurations

---

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Validation  | Zod v3.24.0+ with comprehensive schemas |
| Type Safety | TypeScript 5.7.2+ with strict typing    |
| Testing     | Vitest for schema validation tests      |
| Build       | TypeScript compiler for distribution    |

---

## Acceptance Criteria

- [ ] **[Agent]** Complete schema implementation with all sections from section 2.2 specification
- [ ] **[Agent]** Identity schema with tenantId, siteName, businessName, domain, contact information
- [ ] **[Agent]** Theme schema with colors, typography, logos, design tokens
- [ ] **[Agent]** SEO schema with metadata, sitemap, robots, schema.org configuration
- [ ] **[Agent]** Integrations schema for Google Analytics, CRM, email, payments, CMS
- [ ] **[Agent]** Compliance schema for GDPR, CCPA, WCAG 2.2, privacy settings
- [ ] **[Agent]** Features schema for A/B testing, feature flags, experimental features
- [ ] **[Agent]** Advanced schema for performance, security, analytics, monitoring
- [ ] **[Agent]** Comprehensive validation with detailed error messages
- [ ] **[Agent]** All TypeScript types exported properly from index.ts
- [ ] **[Agent]** Schema builds and tests successfully
- [ ] **[Human]** Verify schema matches section 2.2 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Backup existing schema** — Copy current schema.ts to schema.ts.backup
- [ ] **[Agent]** **Implement Identity section** — Complete identity schema with all fields from 2.2
- [ ] **[Agent]** **Implement Theme section** — Add comprehensive theme and branding schema
- [ ] **[Agent]** **Implement SEO section** — Add SEO, metadata, and search optimization schema
- [ ] **[Agent]** **Implement Integrations section** — Add third-party service integration schemas
- [ ] **[Agent]** **Implement Compliance section** — Add GDPR, CCPA, accessibility compliance schema
- [ ] **[Agent]** **Implement Features section** — Add feature flags and A/B testing schema
- [ ] **[Agent]** **Implement Advanced section** — Add performance, security, monitoring schema
- [ ] **[Agent]** **Update exports** — Ensure all schemas and types exported from index.ts
- [ ] **[Agent]** **Add validation tests** — Create comprehensive test suite for schema validation
- [ ] **[Agent]** **Test compatibility** — Verify existing configurations still validate

> ⚠️ **Agent Question**: Ask human before proceeding if any existing site configurations might break with new schema.

---

## Commands

```bash
# Build the schema package
pnpm build --filter="@repo/config-schema"

# Test schema validation
pnpm test --filter="@repo/config-schema"

# Validate existing site configs
pnpm run validate:configs --filter="@repo/config-schema"

# Type check the schema
pnpm type-check --filter="@repo/config-schema"
```

---

## Code Style

```typescript
// ✅ Correct — Complete schema implementation following section 2.2
import { z } from 'zod';

// ============================================================================
// IDENTITY
// ============================================================================

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
  legalBusinessName: z.string().min(1).max(200).optional(),
  tagline: z.string().max(200).optional(),
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
      state: z.string().length(2),
      zip: z.string().regex(/^\d{5}(-\d{4})?$/),
      country: z.string().length(2).default('US'),
    }),
  }),
});

// Complete SiteConfig schema
export const SiteConfigSchema = z.object({
  identity: IdentitySchema,
  theme: ThemeSchema,
  seo: SEOSchema,
  integrations: IntegrationsSchema,
  compliance: ComplianceSchema,
  features: FeaturesSchema,
  advanced: AdvancedSchema.optional(),
});
```

**Schema principles:**

- Follow section 2.2 specification exactly
- Use descriptive error messages for validation
- Make optional fields truly optional with sensible defaults
- Use regex patterns for format validation
- Group related fields in logical sections

---

## Boundaries

| Tier             | Scope                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Implement complete schema from section 2.2; add comprehensive validation; maintain backward compatibility; follow Zod best practices |
| ⚠️ **Ask first** | Changing existing field types; making required fields optional; modifying validation rules that might break existing configs         |
| 🚫 **Never**     | Remove existing schema sections; break backward compatibility; ignore section 2.2 specification; skip comprehensive testing          |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm build --filter="@repo/config-schema"` — builds successfully
- [ ] **[Agent]** Run `pnpm type-check --filter="@repo/config-schema"` — zero TypeScript errors
- [ ] **[Agent]** Run `pnpm test --filter="@repo/config-schema"` — all tests pass
- [ ] **[Agent]** Run `pnpm run validate:configs` — existing configs still validate
- [ ] **[Human]** Compare schema with section 2.2 specification — 100% coverage
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Backward compatibility:** Ensure existing site.config.ts files still validate
- **Optional fields:** Make sure optional fields have sensible defaults
- **Regex validation:** Test regex patterns with valid and invalid inputs
- **Type exports:** Ensure all types are properly exported for consumer use
- **Error messages:** Provide clear, actionable validation error messages

---

## Out of Scope

- Migration of existing site configurations to new schema format
- UI for configuration management
- Database storage of configurations
- Configuration versioning and migration

---

## References

- [Section 2.2 Full Zod Schema Specification](docs/plan/domain-2/2.2-full-zod-schema-with-all-configuration-options.md)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Configuration-as-Code Philosophy](docs/plan/domain-2/2.1-philosophy-configuration-as-code.md)
