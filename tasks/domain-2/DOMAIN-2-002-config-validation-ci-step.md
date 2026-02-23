---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-2-002
title: 'Implement config validation CI step with conflict detection'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: 'GPT-5.2-Codex' # agent or human responsible
branch: feat/DOMAIN-2-002-config-validation-ci
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(pnpm:*)
---

# DOMAIN-2-002 · Implement config validation CI step with conflict detection

## Objective

Implement comprehensive config validation CI step that validates all site.config.ts files, detects duplicate tenantIds, and prevents invalid configurations from reaching production.

## Context

**Current State Analysis:**

- Repository lacks automated config validation in CI/CD pipeline
- No duplicate tenantId detection across sites
- Missing validation for site.config.ts files before deployment
- No conflict detection for configuration changes
- Missing automated checks for configuration compliance

**Codebase area:** CI/CD pipeline and configuration validation
**Related files:** `.github/workflows/ci.yml`, `scripts/check-config-conflicts.js`
**Dependencies:** GitHub Actions, Node.js, Zod validation
**Prior work:** Basic CI exists but lacks config validation
**Constraints:** Must integrate with existing CI/CD pipeline without breaking changes

**2026 Standards Compliance:**

- Configuration-as-Code validation before deployment
- Automated conflict detection for tenant isolation
- CI/CD pipeline integration with proper error handling
- Build-time validation with clear error messages
- Git-based configuration tracking and rollback

## Tech Stack

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| CI/CD              | GitHub Actions with workflow steps     |
| Validation         | Zod schema validation                  |
| Conflict Detection | Node.js script for duplicate detection |
| Error Handling     | Structured error reporting             |
| Integration        | Turbo task orchestration               |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [x] **[Agent]** CI workflow updated with config validation step
- [x] **[Agent]** Validation script implemented for all site.config.ts files
- [x] **[Agent]** Duplicate tenantId detection script created
- [x] **[Agent]** Turbo task configured for config validation
- [x] **[Agent]** Proper error handling and reporting in CI
- [x] **[Agent]** Integration with existing CI pipeline
- [x] **[Agent]** Tests for validation scripts and CI integration
- [ ] **[Human]** Documentation updated with CI configuration

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [x] **[Agent]** **Create validation scripts** - Implement config validation and conflict detection
- [x] **[Agent]** **Update CI workflow** - Add config validation step to GitHub Actions
- [x] **[Agent]** **Configure Turbo task** - Add validate:configs task to turbo.json
- [x] **[Agent]** **Implement error handling** - Add proper error reporting and exit codes
- [x] **[Agent]** **Add conflict detection** - Implement duplicate tenantId checking
- [x] **[Agent]** **Create test suite** - Test validation scripts and CI integration
- [x] **[Agent]** **Test CI integration** - Verify CI fails on invalid configs
- [ ] **[Human]** **Update documentation** - Document CI configuration and usage

> ⚠️ **Agent Question**: Ask human before proceeding if step 2 conflicts with existing GitHub Actions workflows.

## Commands

```bash
# Create validation scripts
mkdir -p scripts

# Create config validation script
cat > scripts/validate-configs.js << 'EOF'
#!/usr/bin/env node
const { glob } = require('glob');
const { validateSiteConfig } = require('@repo/config-schema');
const path = require('path');

async function validateAllConfigs() {
  const configFiles = await glob('sites/*/site.config.ts', {
    cwd: process.cwd(),
    absolute: true,
  });

  let hasErrors = false;

  for (const file of configFiles) {
    try {
      const config = await import(file);
      validateSiteConfig(config.default);
      console.log(`✅ ${path.basename(path.dirname(file))}: Valid`);
    } catch (error) {
      console.error(`❌ ${path.basename(path.dirname(file))}: Invalid`);
      console.error(error);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
}

validateAllConfigs();
EOF

# Create conflict detection script
cat > scripts/check-config-conflicts.js << 'EOF'
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const configPaths = glob.sync('sites/*/site.config.ts');
const tenantIds = new Set();
const duplicates = [];

configPaths.forEach((configPath) => {
  const config = require(path.resolve(configPath)).default;
  const tenantId = config.identity.tenantId;

  if (tenantIds.has(tenantId)) {
    duplicates.push({ configPath, tenantId });
  } else {
    tenantIds.add(tenantId);
  }
});

if (duplicates.length > 0) {
  console.error('❌ Duplicate tenantIds found:');
  duplicates.forEach(({ configPath, tenantId }) => {
    console.error(`  - ${configPath}: ${tenantId}`);
  });
  process.exit(1);
}

console.log(`✅ All ${configPaths.length} site configs valid (no duplicate tenantIds)`);
EOF

# Make scripts executable
chmod +x scripts/validate-configs.js
chmod +x scripts/check-config-conflicts.js

# Test validation
node scripts/validate-configs.js
node scripts/check-config-conflicts.js
```

## Code Style

```yaml
# ✅ Correct - CI workflow with config validation
jobs:
  validate-configs:
    name: Validate Site Configs
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Validate all site.config.ts files
        run: pnpm turbo run validate:configs

      - name: Check for config conflicts (duplicate tenantIds)
        run: node scripts/check-config-conflicts.js

# ❌ Incorrect - Missing validation and error handling
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
```

**Naming conventions:**

- Workflow jobs: `kebab-case` - `validate-configs`, `check-conflicts`
- Scripts: `kebab-case` - `validate-configs.js`, `check-config-conflicts.js`
- Turbo tasks: `kebab-case` - `validate:configs`, `check:conflicts`

## Boundaries

| Tier             | Scope                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Create validation scripts; update CI workflow; configure Turbo tasks; add error handling; test CI integration      |
| ⚠️ **Ask first** | Modifying existing GitHub Actions workflows; changing CI pipeline structure; adding new required checks            |
| 🚫 **Never**     | Bypassing config validation; ignoring validation errors; removing conflict detection; allowing duplicate tenantIds |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [x] **[Agent]** Run validation scripts locally — All scripts execute successfully
- [x] **[Agent]** Test invalid config — Validation fails with clear error message
- [x] **[Agent]** Test duplicate tenantId — Conflict detection identifies duplicates
- [x] **[Agent]** Run CI workflow — Config validation step executes properly
- [x] **[Agent]** Verify CI failure — CI fails on invalid configurations
- [x] **[Agent]** Check Turbo task — `pnpm turbo run validate:configs` works
- [x] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **CI permissions:** GitHub Actions may need additional permissions for scripts
- **Node version compatibility:** Scripts must work with specified Node version
- **File path resolution:** Ensure scripts work in CI environment
- **Error message formatting:** Clear, actionable error messages for developers
- **Performance:** Validation should not significantly slow down CI pipeline

## Out of Scope

- Modifying existing site.config.ts files
- Creating new configuration schemas
- Implementing configuration UI or admin interfaces
- Database schema changes

## References

- [Domain 2.3 Config Validation CI Step](../../../docs/plan/domain-2/2.3-config-validation-ci-step.md)
- [GitHub Actions Documentation](../../../docs/guides/github-actions-docs.md)
- [Turborepo Documentation](../../../docs/guides/turborepo-documentation.md)

## QA Evidence

- [x] Parent task QA executed after implementation updates.
- [x] Commands run: `pnpm --filter @repo/config-schema build`, `pnpm --filter @repo/config-schema test`, `pnpm validate:configs`, `pnpm create-site domain-2-demo --industry=restaurant --dry-run`.
