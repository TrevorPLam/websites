---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-2-003
title: 'Implement golden path CLI pnpm create-site'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: 'GPT-5.2-Codex' # agent or human responsible
branch: feat/DOMAIN-2-003-golden-path-cli
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-2-003 · Implement golden path CLI pnpm create-site

## Objective

Implement the golden path CLI tool `pnpm create-site` that guides users through creating new client sites with interactive prompts, generates type-safe configuration files, and sets up the complete site structure following section 2.4 specification.

---

## Context

**Codebase area:** `tooling/create-client/` or new `packages/create-site/` — interactive CLI tool

**Related files:** `packages/config-schema/`, `sites/` directory, pnpm-workspace.yaml, site.config.ts templates

**Dependencies:** Inquirer.js for prompts, Zod for validation, fs-extra for file operations, existing config schema

**Prior work:** Basic CLI structure exists in `tooling/create-client/` but lacks interactive prompts and comprehensive site generation

**Constraints:** Must integrate with existing monorepo structure and pnpm workspace

---

## Tech Stack

| Layer              | Technology                           |
| ------------------ | ------------------------------------ |
| CLI Framework      | Inquirer.js for interactive prompts  |
| Validation         | Zod schema validation for inputs     |
| File Operations    | fs-extra for robust file handling    |
| Templates          | Handlebars or similar for templating |
| Package Management | pnpm workspace integration           |

---

## Acceptance Criteria

- [x] **[Agent]** Create comprehensive interactive CLI with all prompts from section 2.4
- [x] **[Agent]** Implement identity collection (tenant slug, site name, business info, contact)
- [x] **[Agent]** Add domain strategy selection (subdomain vs custom domain)
- [x] **[Agent]** Include billing tier selection with proper limits
- [x] **[Agent]** Add theme customization (colors, fonts, branding)
- [x] **[Agent]** Generate complete site.config.ts file with all sections
- [x] **[Agent]** Create site directory structure with proper files
- [x] **[Agent]** Add conflict detection for duplicate tenantIds and domains
- [x] **[Agent]** Integrate with pnpm workspace (add to pnpm-workspace.yaml)
- [x] **[Agent]** Add proper error handling and validation
- [x] **[Agent]** Test CLI with various input scenarios
- [ ] **[Human]** Verify CLI creates functional site configurations

---

## Implementation Plan

- [x] **[Agent]** **Update/create CLI package** — Enhance existing tooling/create-client or create new packages/create-site
- [x] **[Agent]** **Implement interactive prompts** — Add all prompts from section 2.4 specification
- [x] **[Agent]** **Add input validation** — Validate all user inputs with Zod schemas
- [x] **[Agent]** **Create site templates** — Generate site.config.ts and basic site structure
- [x] **[Agent]** **Add conflict detection** — Check for duplicate tenantIds and domain conflicts
- [x] **[Agent]** **Integrate workspace** — Update pnpm-workspace.yaml automatically
- [x] **[Agent]** **Add error handling** — Graceful error handling with helpful messages
- [x] **[Agent]** **Create documentation** — Document CLI usage and examples
- [x] **[Agent]** **Test thoroughly** — Test various scenarios and edge cases

> ⚠️ **Agent Question**: Ask human before deciding between enhancing existing tooling/create-client vs creating new packages/create-site.

---

## Commands

```bash
# Test CLI development
pnpm dev --filter="@repo/create-site"

# Run CLI locally
node packages/create-site/src/index.ts

# Test CLI with pnpm
pnpm create-site

# Validate generated config
pnpm run validate:configs
```

---

## Code Style

```typescript
// ✅ Correct — Interactive CLI implementation
#!/usr/bin/env node
import { input, select, confirm } from '@inquirer/prompts';
import { SiteConfigSchema, validateSiteConfigSafe } from '@repo/config-schema';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

async function createSite() {
  console.log(chalk.blue('🚀 Create New Client Site\n'));

  // Step 1: Basic Identity
  const tenantSlug = await input({
    message: 'Tenant slug (lowercase, alphanumeric + hyphens):',
    validate: (value) => /^[a-z0-9-]+$/.test(value) || 'Invalid format',
  });

  const siteName = await input({
    message: 'Site name (display):',
    validate: (value) => value.length > 0 || 'Site name is required',
  });

  const businessName = await input({
    message: 'Legal business name:',
    validate: (value) => value.length > 0 || 'Required',
  });

  // Step 2: Contact Information
  const contactEmail = await input({
    message: 'Contact email:',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email',
  });

  const contactPhone = await input({
    message: 'Contact phone (E.164 format, e.g., +14155552671):',
    validate: (value) => /^\+?[1-9]\d{1,14}$/.test(value) || 'Invalid phone number',
  });

  // Step 3: Domain Strategy
  const domainStrategy = await select({
    message: 'Domain strategy:',
    choices: [
      { value: 'subdomain', name: `Subdomain (${tenantSlug}.platform.com)` },
      { value: 'custom', name: 'Custom domain (clientdomain.com)' },
    ],
  });

  // Step 4: Business Type
  const businessType = await select({
    message: 'Business type:',
    choices: [
      { value: 'LocalBusiness', name: 'Local Business' },
      { value: 'Attorney', name: 'Law Firm' },
      { value: 'Restaurant', name: 'Restaurant' },
      { value: 'HomeAndConstructionBusiness', name: 'Home Services' },
      { value: 'MedicalBusiness', name: 'Medical Practice' },
      { value: 'ProfessionalService', name: 'Professional Service' },
      { value: 'Store', name: 'Store' },
    ],
  });

  // Step 5: Billing Tier
  const tier = await select({
    message: 'Billing tier:',
    choices: [
      { value: 'free', name: 'Free (100 requests/10s, 1000 leads/mo)' },
      { value: 'starter', name: 'Starter (500 requests/10s, 5000 leads/mo)' },
      { value: 'professional', name: 'Professional (1000 requests/10s, unlimited leads)' },
      { value: 'enterprise', name: 'Enterprise (custom limits)' },
    ],
  });

  // Step 6: Theme Customization
  const primaryColor = await input({
    message: 'Primary Brand Color (hex):',
    default: '#3b82f6',
    validate: (value) => /^#[0-9A-Fa-f]{6}$/.test(value) || 'Must be hex color',
  });

  // Generate configuration
  const config = generateSiteConfig({
    tenantSlug,
    siteName,
    businessName,
    contactEmail,
    contactPhone,
    domainStrategy,
    businessType,
    tier,
    primaryColor,
  });

  // Create site
  await createSiteStructure(tenantSlug, config);

  console.log(chalk.green(`\n✅ Site "${tenantSlug}" created successfully!`));
  console.log(chalk.gray(`📁 Location: sites/${tenantSlug}`));
  console.log(chalk.gray(`⚙️  Config: sites/${tenantSlug}/site.config.ts`));
}
```

**CLI principles:**

- Use clear, helpful prompts with validation
- Provide sensible defaults where appropriate
- Generate complete, type-safe configurations
- Handle errors gracefully with helpful messages
- Integrate seamlessly with existing monorepo structure

---

## Boundaries

| Tier             | Scope                                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Implement all prompts from section 2.4; generate complete site.config.ts; follow CLI best practices; integrate with pnpm workspace |
| ⚠️ **Ask first** | Modifying existing tooling/create-client structure; changing pnpm workspace integration; updating site template structure          |
| 🚫 **Never**     | Skip input validation; generate incomplete configurations; ignore conflict detection; break existing workspace structure           |

---

## Success Verification

- [x] **[Agent]** Run `pnpm create-site` — CLI launches and prompts for all required information
- [x] **[Agent]** Test with valid inputs — Creates complete site structure and configuration
- [x] **[Agent]** Test conflict detection — Rejects duplicate tenantIds and domains
- [x] **[Agent]** Validate generated config — Generated site.config.ts passes validation
- [x] **[Agent]** Test workspace integration — New site recognized by pnpm workspace
- [ ] **[Human]** Test CLI interactively — User experience is intuitive and helpful
- [x] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Input validation:** Ensure all user inputs are properly validated before site creation
- **File permissions:** Handle file system operations with proper error handling
- **Workspace conflicts:** Check for existing sites with same tenantId or domain
- **Template errors:** Ensure generated templates are valid TypeScript and pass validation
- **Cross-platform:** Handle Windows/Unix path differences in file operations

---

## Out of Scope

- Web-based site creation interface
- Automatic DNS configuration
- Site deployment automation
- Ongoing site management through CLI

---

## References

- [Section 2.4 Golden Path CLI Specification](docs/plan/domain-2/2.4-golden-path-cli-pnpm-create-site.md)
- [Inquirer.js Documentation](https://www.npmjs.com/package/inquirer)
- [Zod Validation Documentation](https://zod.dev/)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)

## QA Evidence

- [x] Parent task QA executed after implementation updates.
- [x] Commands run: `pnpm --filter @repo/config-schema build`, `pnpm --filter @repo/config-schema test`, `pnpm validate:configs`, `pnpm create-site domain-2-demo --industry=restaurant --dry-run`.
