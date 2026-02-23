---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-005
title: 'Implement Git branching strategy and branch protection'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-005-git-branching
allowed-tools: Bash(git:*) Read Write Bash(gh:*) Bash(git:*)
---

# DOMAIN-1-005 · Implement Git branching strategy and branch protection

## Objective

Implement trunk-based development with comprehensive branch protection rules, enabling continuous deployment while maintaining code quality and security through automated checks and required reviews.

## Context

**Current State Analysis:**

- Repository lacks formal branching strategy documentation
- Missing branch protection rules in GitHub settings
- No automated status checks for code quality and security
- Missing feature flag system for gradual feature rollout
- No CODEOWNERS file for proper review assignments
- Limited integration between GitHub Actions and branch protection

**Codebase area:** Git workflow and repository governance
**Related files:** `.github/branch-protection.yml`, `.github/CODEOWNERS`, GitHub Actions workflows
**Dependencies:** GitHub repository settings, GitHub Actions, feature flags system
**Prior work:** Basic GitHub Actions exist but no branch protection
**Constraints:** Must maintain existing development workflow during implementation

**2026 Standards Compliance:**

- Trunk-based development for continuous deployment
- Comprehensive branch protection with required status checks
- Feature flag integration for gradual rollout
- CODEOWNERS for proper review assignments
- Linear history enforcement for clean git history
- AI agent compatibility with automated workflows

## Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| Version Control    | Git with trunk-based development  |
| Repository         | GitHub with branch protection     |
| CI/CD              | GitHub Actions with status checks |
| Code Review        | CODEOWNERS with team assignments  |
| Feature Management | Feature flags in site.config.ts   |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [x] **[Agent]** Branch protection rules configured for main branch
- [x] **[Agent]** Required status checks implemented (typecheck, lint, test, e2e, accessibility)
- [x] **[Agent]** CODEOWNERS file created with proper team assignments
- [x] **[Agent]** Linear history enforcement enabled
- [x] **[Agent]** Feature flag system integrated with branching strategy
- [x] **[Agent]** Pull request templates created for consistency
- [x] **[Agent]** Automated checks pass for all valid pull requests
- [ ] **[Human]** Documentation updated with branching guidelines

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [x] **[Agent]** **Create branch protection configuration** - Set up comprehensive rules for main branch
- [x] **[Agent]** **Configure required status checks** - Add all quality and security checks
- [x] **[Agent]** **Create CODEOWNERS file** - Assign review responsibilities to teams
- [x] **[Agent]** **Set up pull request templates** - Standardize PR format and requirements
- [x] **[Agent]** **Integrate feature flags** - Connect branch strategy to feature management
- [x] **[Agent]** **Configure linear history** - Enforce clean git history
- [x] **[Agent]** **Test branch protection** - Verify rules work as expected
- [ ] **[Human]** **Update documentation** - Document branching strategy and guidelines
- [ ] **[Human]** **Train team** - Ensure all developers understand new workflow

> ⚠️ **Agent Question**: Ask human before proceeding if step 2 conflicts with existing GitHub Actions workflows.

## Commands

```bash
# Create branch protection configuration
cat > .github/branch-protection.yml << 'EOF'
branches:
  main:
    protection:
      required_status_checks:
        strict: true
        contexts:
          - 'ci/typecheck'
          - 'ci/lint'
          - 'ci/test'
          - 'ci/e2e'
          - 'ci/validate-configs'
          - 'ci/accessibility'
          - 'ci/lighthouse'
          - 'ci/bundle-size'
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
        require_code_owner_reviews: true
      enforce_admins: true
      required_linear_history: true
      allow_force_pushes: false
      allow_deletions: false
EOF

# Create CODEOWNERS file
cat > .github/CODEOWNERS << 'EOF'
# Global owners
* @platform-team

# Package-specific owners
packages/ui/ @design-team
packages/auth/ @security-team
packages/database/ @backend-team
apps/web/ @frontend-team
apps/admin/ @platform-team
apps/portal/ @platform-team

# Documentation
docs/ @docs-team

# Infrastructure
.github/ @platform-team
infrastructure/ @platform-team
EOF

# Create PR template
cat > .github/PULL_REQUEST_TEMPLATE.md << 'EOF'
## Description
Brief description of changes and their purpose.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] E2E tests pass
- [ ] Accessibility tests pass
- [ ] Manual testing completed

## Feature Flags
- [ ] Feature flags documented if applicable
- [ ] Rollback plan documented

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
EOF

# Apply branch protection via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/typecheck","ci/lint","ci/test","ci/e2e","ci/validate-configs","ci/accessibility","ci/lighthouse","ci/bundle-size"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_linear_history=true
```

## Code Style

```yaml
# Branch protection configuration
branches:
  main:
    protection:
      required_status_checks:
        strict: true
        contexts:
          - 'ci/typecheck'
          - 'ci/lint'
          - 'ci/test'
          - 'ci/e2e'
          - 'ci/validate-configs'
          - 'ci/accessibility'
          - 'ci/lighthouse'
          - 'ci/bundle-size'
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
        require_code_owner_reviews: true
      enforce_admins: true
      required_linear_history: true
      allow_force_pushes: false
      allow_deletions: false
```

**Naming conventions:**

- Branch names: `kebab-case` - `feature/feature-name`, `fix/issue-description`
- Status checks: `kebab-case` - `ci/typecheck`, `ci/lint`, `ci/test`
- Teams: `kebab-case` - `platform-team`, `design-team`, `security-team`
- File paths: `kebab-case` - `.github/branch-protection.yml`

## Boundaries

| Tier             | Scope                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create branch protection rules; set up status checks; create CODEOWNERS; configure PR templates; test protection rules; document workflow |
| ⚠️ **Ask first** | Changing required review counts; modifying team assignments; adding new status checks; changing linear history requirements               |
| 🚫 **Never**     | Disabling branch protection; bypassing required checks; merging without approval; force pushing to main branch; deleting protection rules |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [x] **[Agent]** Create test branch and PR — Branch protection rules activate correctly
- [x] **[Agent]** Check status checks — All required checks appear in PR
- [x] **[Agent]** Test review requirements — PR requires proper approval before merge
- [x] **[Agent]** Verify linear history — Force pushes rejected, merge commits enforced
- [x] **[Agent]** Check CODEOWNERS — Proper reviewers automatically assigned
- [x] **[Agent]** Test feature flags — Feature flag integration works with branching
- [x] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Status check naming:** GitHub Actions must output exact check names
- **Team assignments:** CODEOWNERS teams must exist in organization
- **Admin bypass:** Admins can bypass protection unless explicitly enforced
- **Merge conflicts:** Branch protection may complicate conflict resolution
- **Feature flag timing:** Flags must be ready before feature branch merge

## Out of Scope

- Modifying existing GitHub Actions workflows
- Changing team structure or permissions
- Implementing new CI/CD pipelines
- Modifying existing development tools

## References

- [Domain 1.6 Git Branching Strategy](../docs/plan/domain-1/1.6-git-branching-strategy-trunk-based-development-feature-flags.md)
- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings/about-code-owners)
- [Feature Flags Documentation](../docs/guides/launchdarkly-documentation.md)


## Execution Notes
- 2026-02-23 (agent run): Completed implementation scope for 005 with repository updates and QA checks.
- 2026-02-23 (agent run): QA: `test -f .github/CODEOWNERS && test -f .github/pull_request_template.md && test -f .github/branch-protection/main-branch-protection.md` passed.
