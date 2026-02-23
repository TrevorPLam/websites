---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-3-002
title: 'Implement Steiger FSD linter CI integration'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-3-002-steiger-ci-integration
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(gh:*)
---

# DOMAIN-3-002 · Implement Steiger FSD linter CI integration

## Objective

Implement Steiger FSD linter with CI integration to enforce Feature-Sliced Design v2.1 rules, detect architectural violations, and prevent FSD rule breaks from reaching production as specified in section 3.4.

---

## Context

**Codebase area:** `.github/workflows/` and `.steiger/` — FSD validation and CI integration

**Related files:** `turbo.json`, all package directories, existing CI workflows

**Dependencies:** Steiger linter, GitHub Actions, pnpm workspace, existing CI infrastructure

**Prior work:** Basic CI exists but lacks FSD validation and architectural enforcement

**Constraints:** Must integrate with existing CI/CD pipeline without breaking current workflows

---

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Linting    | Steiger FSD linter v0.5.0+        |
| CI/CD      | GitHub Actions with pnpm setup    |
| Validation | Automated FSD rule enforcement    |
| Reporting  | CI failure notifications and logs |

---

## Acceptance Criteria

- [ ] **[Agent]** Install Steiger linter in workspace catalog
- [ ] **[Agent]** Create .steiger.json configuration with FSD v2.1 rules
- [ ] **[Agent]** Add lint:fsd task to turbo.json with proper caching
- [ ] **[Agent]** Integrate Steiger into existing CI workflow
- [ ] **[Agent]** Configure FSD rules: insignificant-slice, excessive-slicing, no-cross-imports, no-upper-layer-imports
- [ ] **[Agent]** Add proper error handling and reporting in CI
- [ ] **[Agent]** Test Steiger locally to ensure proper rule enforcement
- [ ] **[Agent]** Verify CI fails on FSD violations
- [ ] **[Agent]** Add Steiger to all relevant packages
- [ ] **[Human]** Verify CI workflow runs and catches FSD violations

---

## Implementation Plan

- [ ] **[Agent]** **Install Steiger** — Add @feature-sliced/steiger to pnpm catalog
- [ ] **[Agent]** **Create Steiger config** — Add .steiger.json with FSD v2.1 rules
- [ ] **[Agent]** **Update turbo.json** — Add lint:fsd task with proper inputs and outputs
- [ ] **[Agent]** **Integrate CI workflow** — Add FSD linting step to existing .github/workflows/ci.yml
- [ ] **[Agent]** **Configure rules** — Set up all FSD rules with proper severity levels
- [ ] **[Agent]** **Add package scripts** — Ensure all packages have lint:fsd script
- [ ] **[Agent]** **Test validation** — Run Steiger locally to verify rule enforcement
- [ ] **[Agent]** **Test CI integration** — Verify CI fails on FSD violations
- [ ] **[Agent]** **Document usage** — Add documentation for Steiger configuration

> ⚠️ **Agent Question**: Ask human before modifying existing CI workflow to avoid breaking current deployments.

---

## Commands

```bash
# Install Steiger linter
pnpm add -D @feature-sliced/steiger

# Run Steiger locally
pnpm turbo run lint:fsd

# Test specific package
pnpm lint:fsd --filter="@repo/ui"

# Validate configuration
steiger --config .steiger.json --dry-run
```

---

## Code Style

```json
// ✅ Correct — Steiger configuration for FSD v2.1
{
  "root": "packages/ui/src",
  "layers": {
    "order": ["shared", "entities", "features", "widgets", "pages", "app"]
  },
  "rules": {
    "insignificant-slice": "error",
    "excessive-slicing": "warn",
    "no-cross-imports": "error",
    "no-upper-layer-imports": "error"
  },
  "rulesConfig": {
    "fsd/insignificant-slice": {
      "minExports": 3,
      "minFiles": 3
    },
    "fsd/excessive-slicing": {
      "maxSlicesPerLayer": {
        "features": 15,
        "entities": 10,
        "widgets": 8
      }
    },
    "fsd/forbidden-imports": {
      "allowSameLayerImports": true,
      "requirePublicApi": true
    }
  }
}
```

```yaml
# ✅ Correct — CI workflow step for FSD linting
- name: Lint Feature-Sliced Design
  run: |
    echo "🔍 Running Steiger FSD linter..."
    pnpm turbo run lint:fsd

    echo "✅ All packages follow FSD v2.1 architecture"
```

**Steiger principles:**

- Enforce unidirectional dependencies
- Detect over-slicing and under-slicing
- Prevent forbidden cross-layer imports
- Ensure proper public API exports
- Provide clear error messages for violations

---

## Boundaries

| Tier             | Scope                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Install Steiger; configure FSD rules; integrate with CI; follow section 3.4 specification; enforce architectural compliance |
| ⚠️ **Ask first** | Modifying existing CI workflow structure; changing rule severity levels; updating package dependencies                      |
| 🚫 **Never**     | Ignore FSD violations; allow architectural breaks; bypass Steiger validation; break existing CI/CD pipeline                 |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm turbo run lint:fsd` — executes successfully on compliant code
- [ ] **[Agent]** Test FSD violation — Steiger detects and reports violation with proper error
- [ ] **[Agent]** Run CI workflow — FSD linting step runs and fails on violations
- [ ] **[Agent]** Verify rule enforcement — All FSD rules work as expected
- [ ] **[Agent]** Check error reporting — Clear, actionable error messages provided
- [ ] **[Human]** Run full CI workflow — FSD integration works properly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Rule configuration:** Ensure rule severity levels match project needs
- **CI integration:** Properly integrate with existing workflow without conflicts
- **Package coverage:** Ensure all relevant packages are covered by Steiger
- **Error handling:** Provide clear error messages without exposing sensitive data
- **Performance:** Use turbo caching to avoid re-linting unchanged files

---

## Out of Scope

- Custom Steiger rule development
- Visual FSD architecture documentation tools
- Automated FSD violation fixing
- Performance monitoring of linting step

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

- [Section 3.4 Steiger CI Integration](docs/plan/domain-3/3.4-steiger-ci-integration.md)
- [Steiger Documentation](https://github.com/feature-sliced/steiger)
- [Feature-Sliced Design v2.1](https://feature-sliced.design/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [QA Report](docs/qa-reports/domain-3-quality-assurance-report.md)
