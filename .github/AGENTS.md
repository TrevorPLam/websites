# .github/AGENTS.md — GitHub Configuration

Last Updated: 2026-01-21
Applies To: Any agent working in .github/

**Quick Reference:** See `/BESTPR.md` for comprehensive repo standards.

## Purpose
This folder contains GitHub-specific configuration files including issue templates, PR templates, and workflow definitions.

---

## Structure

```
.github/
├── AGENTS.md                   # This file
├── ISSUE_TEMPLATE/             # Issue templates for bug reports, features
├── PULL_REQUEST_TEMPLATE.md    # PR description template
├── dependabot.yml              # Dependabot configuration
├── lighthouse/                 # Lighthouse CI config
└── workflows/                  # GitHub Actions workflows (if enabled)
```

---

## Key Files

### Issue Templates (`ISSUE_TEMPLATE/`)
- **Purpose:** Standardize issue reporting
- **Modification:** Update when issue types change
- **Format:** YAML frontmatter + Markdown

### Pull Request Template
- **File:** `PULL_REQUEST_TEMPLATE.md`
- **Purpose:** Ensure PRs include necessary information
- **Sections:** Description, testing, checklist

### Dependabot Configuration
- **File:** `dependabot.yml`
- **Purpose:** Automated dependency updates
- **Cost:** Free (GitHub feature)

### Workflows (`workflows/`)
- **Status:** Workflows stored in `/githubactions/workflows/` by default (disabled)
- **Enable:** Move to `.github/workflows/` when approved
- **See:** `/githubactions/AGENTS.md` for workflow documentation

---

## GitHub Actions (Cost Control)

**GitHub Actions are OFF by default** to prevent unexpected costs.

### Current Status
- Workflows stored in `/githubactions/workflows/`
- Must be explicitly enabled by moving to `.github/workflows/`
- See `/githubactions/README.md` for instructions

---

## Modifying Templates

### Issue Template
1. Edit file in `ISSUE_TEMPLATE/`
2. Test by creating new issue on GitHub
3. Verify template loads correctly

### PR Template
1. Edit `PULL_REQUEST_TEMPLATE.md`
2. Test by creating new PR
3. Verify template loads correctly

---

## Dependabot Configuration

### Update Schedule
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Security Updates
- **Automatic:** Dependabot creates PRs for security vulnerabilities
- **Review:** Always review Dependabot PRs before merging
- **Testing:** Run tests before merging dependency updates

---

## Don't

- ❌ Enable GitHub Actions without cost approval
- ❌ Store secrets in config files (use GitHub Secrets)
- ❌ Remove issue/PR templates without replacement
- ❌ Modify Dependabot config without understanding impact

---

**See also:** 
- `/BESTPR.md` for complete best practices guide
- `/githubactions/AGENTS.md` for workflow documentation
- `/CODEBASECONSTITUTION.md` for cost control policy
