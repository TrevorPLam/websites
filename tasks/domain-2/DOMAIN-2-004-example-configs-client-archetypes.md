---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-2-004
title: 'Create example configs for three client archetypes'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-2-004-example-configs
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(pnpm:*)
---

# DOMAIN-2-004 · Create example configs for three client archetypes

## Objective

Create comprehensive example configurations for three client archetypes (Local Law Firm, Restaurant, E-commerce Store) that demonstrate the complete site.config.ts schema and serve as templates for new client sites.

## Context

**Current State Analysis:**

- Repository lacks example configurations for different business types
- Missing archetype templates for common client types
- No demonstration of complete schema usage
- Missing reference implementations for new site creation
- No validation examples for configuration schema

**Codebase area:** Example configurations and templates
**Related files:** `sites/` directory, site.config.ts examples
**Dependencies:** Config schema validation, TypeScript type safety
**Prior work:** Basic config schema exists but lacks examples
**Constraints:** Must follow complete schema and validation requirements

**2026 Standards Compliance:**

- Configuration-as-Code with complete examples
- Type-safe configuration templates
- Business archetype patterns for common industries
- AI agent-friendly configuration examples
- Comprehensive schema demonstration

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Configuration  | site.config.ts files         |
| Validation     | Zod schema validation        |
| Templates      | Example configurations       |
| Business Types | Industry-specific archetypes |
| Type Safety    | TypeScript strict mode       |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Local Law Firm configuration created with complete schema
- [ ] **[Agent]** Restaurant configuration created with industry-specific features
- [ ] **[Agent]** E-commerce Store configuration created with commerce features
- [ ] **[Agent]** All configurations pass schema validation
- [ ] **[Agent]** Business-specific features implemented for each archetype
- [ ] **[Agent]** Proper documentation and comments in configurations
- [ ] **[Agent]** Integration with CLI template generation
- [ ] **[Human]** Documentation updated with configuration examples

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** **Create example sites directory** - Set up sites directory structure
- [ ] **[Agent]** **Implement Local Law Firm config** - Create complete configuration for law firm archetype
- [ ] **[Agent]** **Implement Restaurant config** - Create configuration for restaurant archetype
- [ ] **[Agent]** **Implement E-commerce Store config** - Create configuration for e-commerce archetype
- [ ] **[Agent]** **Add business-specific features** - Implement archetype-specific configurations
- [ ] **[Agent]** **Validate all configurations** - Ensure all pass schema validation
- [ ] **[Agent]** **Create documentation** - Document configuration usage and features
- [ ] **[Agent]** **Test integration** - Verify CLI can use configurations as templates
- [ ] **[Human]** **Update CLI templates** - Integrate examples with create-site CLI

> ⚠️ **Agent Question**: Ask human before proceeding if step 8 conflicts with existing CLI template system.

## Commands

```bash
# Create example sites directory
mkdir -p sites/smith-associates-law
mkdir -p sites/bella-vista-restaurant
mkdir -p sites/tech-store-e-commerce

# Create Local Law Firm configuration
cat > sites/smith-associates-law/site.config.ts << 'EOF'
import { SiteConfig } from '@repo/config-schema';

export const config: SiteConfig = {
  version: '1.0',

  identity: {
    tenantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    tenantSlug: 'smith-associates-law',
    siteName: 'Smith & Associates',
    businessName: 'Smith & Associates, LLP',
    legalBusinessName: 'Smith & Associates, P.C.',
    tagline: 'Experienced Legal Representation in Dallas',
    domain: {
      primary: 'smithlawdallas.com',
      subdomain: 'smith-associates-law',
      customDomain: 'smithlawdallas.com',
      customDomains: ['smithlawdallas.com'],
    },
    contact: {
      email: 'info@smithlawdallas.com',
      phone: '+1-214-555-0199',
      address: {
        street: '1500 Main Street, Suite 400',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
        country: 'US',
      },
    },
  },

  theme: {
    colorPalette: {
      primary: '#1e3a8a',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#475569',
      background: '#ffffff',
      foreground: '#0f172a',
    },
    typography: {
      fontFamily: {
        heading: 'Merriweather, serif',
        body: 'Inter, sans-serif',
      },
    },
  },

  // ... rest of configuration
};
EOF

# Validate configurations
pnpm turbo run validate:configs

# Test CLI integration
echo -e "\n\n\n\n\n\n\n\n\n\n" | pnpm create-site --template=sites/smith-associates-law
```

## Code Style

```typescript
// ✅ Correct - Complete configuration with all sections
export const config: SiteConfig = {
  version: '1.0',

  identity: {
    tenantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    tenantSlug: 'smith-associates-law',
    siteName: 'Smith & Associates',
    businessName: 'Smith & Associates, LLP',
    tagline: 'Experienced Legal Representation in Dallas',
    domain: {
      primary: 'smithlawdallas.com',
      subdomain: 'smith-associates-law',
      customDomain: 'smithlawdallas.com',
    },
    contact: {
      email: 'info@smithlawdallas.com',
      phone: '+1-214-555-0199',
      address: {
        street: '1500 Main Street, Suite 400',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
        country: 'US',
      },
    },
  },

  theme: {
    colorPalette: {
      primary: '#1e3a8a', // Professional blue
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#475569',
      background: '#ffffff',
      foreground: '#0f172a',
    },
  },

  // ... all other sections
};

// ❌ Incorrect - Incomplete configuration
export const config = {
  identity: {
    tenantId: 'smith-associates-law',
    siteName: 'Smith & Associates',
  },
  theme: {
    colorPalette: {
      primary: '#1e3a8a',
    },
  },
};
```

**Naming conventions:**

- Config files: `kebab-case` - `site.config.ts`
- Tenant slugs: `kebab-case` - `smith-associates-law`
- Business names: `PascalCase` - `Smith & Associates`
- Domain names: `lowercase` - `smithlawdallas.com`

## Boundaries

| Tier             | Scope                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create example configurations; implement all schema sections; add business-specific features; validate configurations; document usage |
| ⚠️ **Ask first** | Adding new business types; modifying existing examples; changing schema structure; adding required fields                             |
| 🚫 **Never**     | Creating invalid configurations; bypassing schema validation; missing required sections; using placeholder values                     |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Run `pnpm turbo run validate:configs` — All example configs pass validation
- [ ] **[Agent]** Test schema completeness — All schema sections implemented
- [ ] **[Agent]** Verify business features — Industry-specific features implemented
- [ ] **[Agent]** Check type safety — TypeScript compilation with strict mode
- [ ] **[Agent]** Test CLI integration — CLI can use examples as templates
- [ ] **[Agent]** Verify documentation — Examples are well-documented
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Schema validation:** All configurations must pass complete schema validation
- **Business requirements:** Each archetype must include industry-specific features
- **Template integration:** Examples must work with CLI template system
- **Type safety:** All configurations must be type-safe with strict TypeScript
- **Documentation quality:** Examples must be well-documented for developers

## Out of Scope

- Creating actual client sites
- Implementing business logic for configurations
- Creating admin interfaces for configuration management
- Database schema changes

## References

- [Domain 2.5 Example Configs](../../../docs/plan/domain-2/2.5-example-configs-for-three-client-archetypes.md)
- [Configuration Schema](../../../docs/plan/domain-2/2.2-full-zod-schema-with-all-configuration-options.md)
- [Configuration-as-Code Philosophy](../../../docs/plan/domain-2/2.1-philosophy-configuration-as-code.md)
