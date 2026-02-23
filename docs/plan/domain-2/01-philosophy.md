# 2.1 Philosophy: Configuration-as-Code

**What it is:** Every client site is defined by a single, type-safe `site.config.ts` file. Change the config, re-deploy → instant tenant customization. No database migrations, no manual updates.

**Why it matters:**

- Single Source of Truth: All site behavior derived from config
- Type Safety: Zod validation catches errors at build time
- AI Agent Friendly: Agents modify config files, not databases
- Version Controlled: Config changes tracked in Git
- Instant Rollback: `git revert` to undo site changes

**When to build:** P0 (Week 1) — Foundation for tenant isolation.
