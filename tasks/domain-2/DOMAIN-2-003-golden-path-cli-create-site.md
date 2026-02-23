---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-2-003
title: 'Implement golden path CLI pnpm create-site'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-2-003-golden-path-cli
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(pnpm:*)
---

# DOMAIN-2-003 · Implement golden path CLI pnpm create-site

## Objective

Implement the golden path CLI tool `pnpm create-site` that guides users through creating new client sites with interactive prompts, generates type-safe configuration files, and sets up the complete site structure.

## Context

**Current State Analysis:**

- Repository lacks automated site creation tooling
- No interactive CLI for new client onboarding
- Missing golden path for site creation
- No automated site.config.ts generation
- Missing directory structure creation for new sites

**Codebase area:** CLI tooling and site creation automation
**Related files:** `packages/create-site/`, `scripts/create-site.ts`
**Dependencies:** Inquirer.js for prompts, UUID generation, file system operations
**Prior work:** Basic scripts exist but lack comprehensive CLI functionality
**Constraints:** Must integrate with existing monorepo structure and config schema

**2026 Standards Compliance:**

- Golden path CLI for developer experience optimization
- Interactive prompts with validation and error handling
- Type-safe configuration generation
- AI agent-friendly CLI interface
- Automated site structure creation

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| CLI Framework      | Inquirer.js for interactive prompts |
| Validation         | Zod schema validation               |
| File Operations    | Node.js fs/promises                 |
| UUID Generation    | uuid v4 for tenant IDs              |
| Package Management | pnpm workspace integration          |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Interactive CLI implemented with comprehensive prompts
- [ ] **[Agent]** Site configuration generation with type-safe validation
- [ ] **[Agent]** Directory structure creation for new sites
- [ ] **[Agent]** Integration with config schema validation
- [ ] **[Agent]** Business type selection with archetype presets
- [ ] **[Agent]** Error handling and validation for all inputs
- [ ] **[Agent]** Package.json and workspace integration
- [ ] **[Human]** Documentation updated with CLI usage examples

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** **Create CLI package** - Set up create-site package structure
- [ ] **[Agent]** **Implement interactive prompts** - Add Inquirer.js prompts for site creation
- [ ] **[Agent]** **Add business type selection** - Implement archetype selection with presets
- [ ] **[Agent]** **Generate site configuration** - Create type-safe site.config.ts files
- [ ] **[Agent]** **Create directory structure** - Set up complete site directory structure
- [ ] **[Agent]** **Add validation and error handling** - Implement input validation and error messages
- [ ] **[Agent]** **Integrate with workspace** - Add pnpm workspace integration
- [ ] **[Agent]** **Create test suite** - Test CLI functionality and edge cases
- [ ] **[Human]** **Update documentation** - Document CLI usage and examples

> ⚠️ **Agent Question**: Ask human before proceeding if step 4 conflicts with existing config schema validation.

## Commands

```bash
# Create CLI package
mkdir -p packages/create-site/src
cd packages/create-site

# Initialize package
pnpm init

# Install dependencies
pnpm add @inquirer/prompts uuid zod chalk
pnpm add -D @types/node typescript vitest

# Create package structure
mkdir -p src/{prompts,templates,utils}

# Build package
pnpm build

# Install in workspace
cd ../../
pnpm install

# Test CLI
pnpm create-site --help

# Test interactive mode
echo -e "\n\n\n\n\n\n\n\n\n\n" | pnpm create-site
```

## Code Style

```typescript
// ✅ Correct - Interactive CLI with validation
import { input, select, confirm } from '@inquirer/prompts';
import { SiteConfigSchema, validateSiteConfigSafe } from '@repo/config-schema';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

async function createSite() {
  console.log('🚀 Create New Client Site\n');

  // Step 1: Basic Identity
  const tenantSlug = await input({
    message: 'Tenant slug (lowercase, alphanumeric + hyphens):',
    validate: (value) => /^[a-z0-9-]+$/.test(value) || 'Invalid format',
  });

  const siteName = await input({
    message: 'Site name (display):',
    validate: (value) => value.length > 0 || 'Site name is required',
  });

  const businessType = await select({
    message: 'Business type:',
    choices: [
      { value: 'LocalBusiness', name: 'Local Business' },
      { value: 'Attorney', name: 'Law Firm' },
      { value: 'Restaurant', name: 'Restaurant' },
    ],
  });

  // Generate configuration
  const config = generateSiteConfig({
    tenantSlug,
    siteName,
    businessType,
    // ... other fields
  });

  // Validate configuration
  const validation = validateSiteConfigSafe(config);
  if (!validation.success) {
    console.error(chalk.red('❌ Configuration validation failed:'));
    validation.error.issues.forEach((issue) => {
      console.error(chalk.red(`  - ${issue.path?.join('.')} ${issue.message}`));
    });
    process.exit(1);
  }

  // Create site directory and files
  await createSiteDirectory(tenantSlug, config);

  console.log(chalk.green(`✅ Site created successfully: sites/${tenantSlug}`));
}

// ❌ Incorrect - Missing validation and error handling
async function createSite() {
  const tenantSlug = await input({ message: 'Tenant slug:' });
  const siteName = await input({ message: 'Site name:' });

  // No validation, no error handling
  const config = { tenantSlug, siteName };

  await fs.writeFile(`sites/${tenantSlug}/site.config.ts`, JSON.stringify(config));
}
```

**Naming conventions:**

- Functions: `camelCase` - `createSite`, `generateSiteConfig`, `validateInput`
- Variables: `camelCase` - `tenantSlug`, `siteName`, `businessType`
- Files: `kebab-case` - `create-site.ts`, `site.config.ts`

## Boundaries

| Tier             | Scope                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create CLI package; implement interactive prompts; generate configurations; create directory structures; add validation         |
| ⚠️ **Ask first** | Modifying existing site templates; changing CLI interface; adding new business types; changing directory structure              |
| 🚫 **Never**     | Overwriting existing sites without confirmation; bypassing validation; creating invalid configurations; ignoring error handling |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Run `pnpm create-site --help` — CLI help displays correctly
- [ ] **[Agent]** Test interactive mode — CLI prompts work and validate input
- [ ] **[Agent]** Test site creation — CLI creates complete site structure
- [ ] **[Agent]** Test configuration generation — Generated site.config.ts is valid
- [ ] **[Agent]** Test error handling — Invalid inputs show clear error messages
- [ ] **[Agent]** Verify workspace integration — New site appears in pnpm list
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Input validation:** Must handle all edge cases for user input
- **File system permissions:** CLI must handle permission errors gracefully
- **Existing sites:** Must prevent overwriting existing sites without confirmation
- **Configuration conflicts:** Generated configs must pass schema validation
- **Workspace integration:** Must properly integrate with pnpm workspace

## Out of Scope

- Modifying existing site configurations
- Creating admin interfaces for site management
- Implementing site deployment automation
- Database schema changes

## References

- [Domain 2.4 Golden Path CLI](../../../docs/plan/domain-2/2.4-golden-path-cli-pnpm-create-site.md)
- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js)
- [Configuration Schema](../../../docs/plan/domain-2/2.2-full-zod-schema-with-all-configuration-options.md)
