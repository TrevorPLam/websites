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
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(gh:*)
---

# DOMAIN-2-002 · Implement config validation CI step with conflict detection

## Objective

Implement comprehensive config validation CI step that validates all site.config.ts files, detects duplicate tenantIds, prevents invalid configurations from reaching production, and integrates with the existing CI/CD pipeline.

---

## Context

**Documentation Reference:**

- Site Config Schema Documentation: `docs/guides/architecture/site-config-schema-documentation.md` ✅ COMPLETED
- Zod Documentation: `docs/guides/standards-specs/zod-documentation.md` ✅ COMPLETED
- Config Validation Ci Pipeline: `docs/guides/standards-specs/config-validation-ci-pipeline.md` ❌ MISSING (P0)
- Golden Path Cli Documentation: `docs/guides/standards-specs/golden-path-cli-documentation.md` ❌ MISSING (P0)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** `.github/workflows/` and validation scripts — CI/CD integration

**Related files:** `packages/config-schema/src/validation.ts`, `turbo.json`, all site.config.ts files

**Dependencies:** GitHub Actions, pnpm, existing validation script, turbo task orchestration

**Prior work:** Basic validation script exists but lacks CI integration and conflict detection

**Constraints:** Must integrate with existing CI/CD pipeline without breaking current workflows

---

## Tech Stack

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| CI/CD              | GitHub Actions with pnpm setup         |
| Validation         | TypeScript with Zod schema validation  |
| Conflict Detection | Node.js script for duplicate detection |
| Orchestration      | Turborepo task coordination            |

---

## Acceptance Criteria

- [ ] **[Agent]** Add validate:configs task to turbo.json with proper caching
- [ ] **[Agent]** Create comprehensive CI workflow step for config validation
- [ ] **[Agent]** Implement duplicate tenantId detection script
- [ ] **[Agent]** Add conflict detection for domain names and subdomains
- [ ] **[Agent]** Integrate validation into existing CI workflow
- [ ] **[Agent]** Add proper error reporting and failure handling
- [ ] **[Agent]** Create validation scripts with detailed logging
- [ ] **[Agent]** Test validation with valid and invalid configurations
- [ ] **[Agent]** Ensure CI fails on any validation errors
- [ ] **[Human]** Verify CI workflow runs and catches validation errors

<<<<<<< Updated upstream

- [x] **[Agent]** CI workflow updated with config validation step
- [x] **[Agent]** Validation script implemented for all site.config.ts files
- [x] **[Agent]** Duplicate tenantId detection script created
- [x] **[Agent]** Turbo task configured for config validation
- [x] **[Agent]** Proper error handling and reporting in CI
- [x] **[Agent]** Integration with existing CI pipeline
- [x] **[Agent]** Tests for validation scripts and CI integration
- [ ] # **[Human]** Documentation updated with CI configuration

---

> > > > > > > Stashed changes

## Implementation Plan

- [ ] **[Agent]** **Update turbo.json** — Add validate:configs task with proper inputs and outputs
- [ ] **[Agent]** **Enhance validation script** — Update validation.ts with better error handling
- [ ] **[Agent]** **Create conflict detection script** — Implement duplicate tenantId/domain detection
- [ ] **[Agent]** **Add CI workflow step** — Integrate validation into existing .github/workflows/ci.yml
- [ ] **[Agent]** **Add error handling** — Ensure proper failure modes and logging
- [ ] **[Agent]** **Test validation** — Create test cases for valid/invalid configurations
- [ ] **[Agent]** **Update CI dependencies** — Ensure proper pnpm and Node.js setup
- [ ] **[Agent]** **Document validation** — Add documentation for validation process

<<<<<<< Updated upstream

- [x] **[Agent]** **Create validation scripts** - Implement config validation and conflict detection
- [x] **[Agent]** **Update CI workflow** - Add config validation step to GitHub Actions
- [x] **[Agent]** **Configure Turbo task** - Add validate:configs task to turbo.json
- [x] **[Agent]** **Implement error handling** - Add proper error reporting and exit codes
- [x] **[Agent]** **Add conflict detection** - Implement duplicate tenantId checking
- [x] **[Agent]** **Create test suite** - Test validation scripts and CI integration
- [x] **[Agent]** **Test CI integration** - Verify CI fails on invalid configs
- [ ] # **[Human]** **Update documentation** - Document CI configuration and usage
  > ⚠️ **Agent Question**: Ask human before modifying existing CI workflow to avoid breaking current deployments.
  >
  > > > > > > > Stashed changes

---

## Commands

```bash
# Test validation locally
pnpm turbo run validate:configs

# Test conflict detection
node scripts/check-config-conflicts.js

# Run CI workflow locally (using act)
act -j validate-configs

# Test turbo task caching
pnpm turbo run validate:configs --force
```

---

## Code Style

```yaml
# ✅ Correct — CI workflow step for config validation
- name: Validate Site Configurations
  run: |
    echo "🔍 Validating all site.config.ts files..."
    pnpm turbo run validate:configs

    echo "🔍 Checking for configuration conflicts..."
    node scripts/check-config-conflicts.js

    echo "✅ All configurations validated successfully"
```

```typescript
// ✅ Correct — Enhanced validation script
export async function validateAllConfigs() {
  const configPaths = await glob('sites/*/site.config.ts', {
    cwd: process.cwd(),
    absolute: true,
  });

  console.log(`📋 Found ${configPaths.length} site configuration files`);

  const errors: Array<{ path: string; error: string }> = [];
  const warnings: Array<{ path: string; warning: string }> = [];

  for (const configPath of configPaths) {
    try {
      const fileUrl = pathToFileURL(configPath).href;
      const module = await import(fileUrl);
      const config = module.default || module.config;

      validateSiteConfig(config);
      console.log(`✅ ${path.basename(path.dirname(configPath))}: Valid`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: configPath, error: message });
      console.error(`❌ ${path.basename(path.dirname(configPath))}: ${message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n💥 ${errors.length} configuration(s) failed validation\n`);
    process.exit(1);
  }

  console.log(`\n🎉 All ${configPaths.length} configurations are valid\n`);
}
```

**Validation principles:**

- Fail fast on any configuration errors
- Provide clear, actionable error messages
- Check for both schema validation and business logic conflicts
- Integrate seamlessly with existing CI/CD pipeline
- Use proper caching for performance optimization

---

## Boundaries

| Tier             | Scope                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Add validation to CI; implement conflict detection; follow section 2.3 specification; ensure proper error handling            |
| ⚠️ **Ask first** | Modifying existing CI workflow structure; changing validation failure behavior; updating turbo task dependencies              |
| 🚫 **Never**     | Ignore validation errors; allow invalid configs to reach production; bypass conflict detection; break existing CI/CD pipeline |

---

## Success Verification

<<<<<<< Updated upstream
How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [x] **[Agent]** Run validation scripts locally — All scripts execute successfully
- [x] **[Agent]** Test invalid config — Validation fails with clear error message
- [x] **[Agent]** Test duplicate tenantId — Conflict detection identifies duplicates
- [x] **[Agent]** Run CI workflow — Config validation step executes properly
- [x] **[Agent]** Verify CI failure — CI fails on invalid configurations
- [x] **[Agent]** Check Turbo task — `pnpm turbo run validate:configs` works
- [x] # **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box
- [ ] **[Agent]** Run `pnpm turbo run validate:configs` — executes successfully on valid configs
- [ ] **[Agent]** Test invalid config — validation fails with proper error message
- [ ] **[Agent]** Run conflict detection — detects duplicate tenantIds correctly
- [ ] **[Agent]** Test CI workflow — validation step runs and fails on errors
- [ ] **[Agent]** Verify turbo caching — subsequent runs use cache effectively
- [ ] **[Human]** Run full CI workflow — validation integrates properly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box
  > > > > > > > Stashed changes

---

## Edge Cases & Gotchas

- **Dynamic imports:** Handle TypeScript imports properly in validation script
- **CI environment:** Ensure scripts work in GitHub Actions environment
- **Error handling:** Provide clear error messages without exposing sensitive data
- **Performance:** Use turbo caching to avoid re-validating unchanged configs
- **Path resolution:** Handle both Windows and Unix path formats in scripts

---

## Out of Scope

- UI for viewing validation results
- Automatic fixing of configuration errors
- Configuration migration tools
- Performance monitoring of validation step

---

## References

<<<<<<< Updated upstream

- [Domain 2.3 Config Validation CI Step](../../../docs/plan/domain-2/2.3-config-validation-ci-step.md)
- [GitHub Actions Documentation](../../../docs/guides/github-actions-docs.md)
- [Turborepo Documentation](../../../docs/guides/turborepo-documentation.md)

## QA Evidence

- [x] Parent task QA executed after implementation updates.
- [x] # Commands run: `pnpm --filter @repo/config-schema build`, `pnpm --filter @repo/config-schema test`, `pnpm validate:configs`, `pnpm create-site domain-2-demo --industry=restaurant --dry-run`.
- [Section 2.3 Config Validation CI Step](docs/plan/domain-2/2.3-config-validation-ci-step.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turborepo Task Configuration](https://turbo.build/repo/docs/core-concepts/tasks)
- [Zod Validation Documentation](https://zod.dev/)
  > > > > > > > Stashed changes
