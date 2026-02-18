# Cleanup, Documentation & Scripts (6.1–6.10) — Normalized Specs

---

## 6.1 Migrate Template Content

### 1️⃣ Objective Clarification
- Move reusable hair-salon components to @repo/marketing-components
- Define reusability rubric
- Layer: Migration

### 2️⃣ Dependency Check
- **Completed:** 5.1, 2.1–2.10 (target components exist)
- **Blockers:** marketing-components populated

### 3️⃣ File System Plan
- **Update:** templates/hair-salon → import from @repo/marketing-components where equivalent exists
- **Create:** docs/reusability-rubric.md
- **Delete:** None (until 6.3)

### 5️⃣ Data Contracts
- Rubric: config-driven, no industry-specific logic, no template-only deps

### 1️⃣5️⃣ Anti-Overengineering
- Don't migrate everything; only components matching marketing-components API
- Stop when template uses packages; leave non-reusable in template

---

## 6.2 Create Migration Guide

### 1️⃣ Objective Clarification
- Document template-to-client migration; steps, breaking changes, pitfalls
- Layer: Docs
- **File:** docs/migration/template-to-client.md

### 3️⃣ File System Plan
- **Create:** docs/migration/template-to-client.md
- **Delete:** None

### 1️⃣3️⃣ Checklist
1. Document copy-starter approach
2. List breaking changes (shared → packages)
3. Common pitfalls (env vars, config schema)
4. Rollback steps

---

## 6.2a Update clients/README

### 1️⃣ Objective Clarification
- CaCA workflow; starter-template as golden path; site.config.ts–only customization
- Remove references to templates/shared
- **File:** clients/README.md

### 2️⃣ Dependency Check
- **Completed:** 5.1

### 3️⃣ File System Plan
- **Update:** clients/README.md

---

## 6.3 Remove Templates Directory

### 1️⃣ Objective Clarification
- Delete templates/ after all clients migrated
- Layer: Destructive migration
- **Requires:** 6.1, 5.2–5.6; migration matrix sign-off

### 2️⃣ Dependency Check
- **Completed:** 6.1, 5.2–5.6
- **Blockers:** Migration matrix complete; grep for template references = 0 (or documented exceptions)

### 3️⃣ File System Plan
- **Delete:** templates/ (or templates/hair-salon)
- **Update:** Any imports pointing to templates/

### 1️⃣2️⃣ Failure Modes
- Broken imports; CI will fail
- Rollback: git revert; restore templates/

### 1️⃣5️⃣ Anti-Overengineering
- Don't delete until migration matrix signed off (per Dependency Health Matrix)

---

## 6.4 Component Library Documentation

### 1️⃣ Objective Clarification
- Storybook or Markdown docs; per-component usage, props, a11y, demos
- Layer: Docs
- **Batch:** H

### 2️⃣ Dependency Check
- **Completed:** 1.1–1.6, 2.1–2.10

### 3️⃣ File System Plan
- **Create:** Storybook config (6.4a) or docs/components/
- **Create:** Per-component stories/docs (6.4b)
- **Delete:** None

### 1️⃣3️⃣ Checklist
1. 6.4a: Storybook setup (or VitePress/MDX)
2. 6.4b: Stories for UI primitives + marketing components
3. Include: usage, props, a11y notes, dos/don'ts

### 1️⃣5️⃣ Anti-Overengineering
- Don't doc every prop; focus on usage patterns
- No auto-generation from types (optional later)

---

## 6.5 Configuration Reference

### 1️⃣ Objective Clarification
- Complete site.config.ts docs; all fields, type, default, required, examples
- **File:** docs/configuration/site-config.md
- **Dependency:** 1.8 (config complete)

### 3️⃣ File System Plan
- **Create:** docs/configuration/site-config.md (or split by section)

---

## 6.6 Feature Documentation

### 1️⃣ Objective Clarification
- Per-feature: usage, config options, integration guides, API reference
- State diagrams for workflows
- **File:** docs/features/
- **Dependency:** 2.12–2.19

---

## 6.7 Architecture Decision Records

### 1️⃣ Objective Clarification
- ADRs: feature-based architecture, Radix UI, pnpm catalog, industry-agnostic
- **File:** docs/adr/
- **Dependency:** All above

---

## 6.8 Create CLI Tooling

### 1️⃣ Objective Clarification
- `pnpm create-client`, `pnpm validate-config`, `pnpm generate-component`
- Layer: Tooling
- **Optional Mode:** Script → deterministic CLI + exit codes

### 2️⃣ Dependency Check
- **Completed:** 6.3 (templates removed; starter is source)

### 3️⃣ File System Plan
- **Create:** scripts/create-client.ts, validate-config.ts, generate-component.ts (optional)
- **Update:** root package.json scripts
- **Delete:** None

### 4️⃣ Public API (CLI)
```bash
pnpm create-client <name> [industry]   # exit 0 success, 1 validation error
pnpm validate-config [path]            # exit 0 valid, 1 invalid
pnpm generate-component <name>         # exit 0 success
```

### 5️⃣ Data Contracts
- validate-config: use siteConfigSchema; path defaults to cwd
- create-client: copies starter; seeds site.config.ts with industry

### 6️⃣ Internal
- 6.8a: create-client — copy starter → clients/<name>; optional industry seed
- 6.8b: validate-config — load site.config, run schema, exit code
- 6.8c: generate-component — scaffold in marketing-components (optional)

### 1️⃣2️⃣ Failure Modes
- Invalid name → exit 1, clear message
- Path not found → exit 1

### 1️⃣5️⃣ Anti-Overengineering
- No interactive prompts (args only); no cloud provisioning

---

## 6.9 Remove Dead Code and Unused Dependencies

### 1️⃣ Objective Clarification
- Post-migration hygiene; knip/depcheck
- Layer: Cleanup
- **Dependency:** 6.1, 6.3

### 3️⃣ File System Plan
- **Delete:** Unused files; remove unused deps from package.json
- **Update:** package.json
- **Validate:** No runtime deps accidentally removed (smoke tests)

---

## 6.10a Add validate-client Script

### 1️⃣ Objective Clarification
- Validate site.config.ts with siteConfigSchema; check routes exist; metadata; build smoke
- **Optional Mode:** Script → deterministic CLI + exit codes

### 2️⃣ Dependency Check
- **Completed:** 5.1 (starter exists)
- **Blockers:** None

### 3️⃣ File System Plan
- **Create:** scripts/validate-client.ts (or .js)
- **Update:** root package.json: `"validate-client": "node scripts/validate-client.js"`
- **Delete:** None

### 4️⃣ Public API (CLI)
```bash
pnpm validate-client [path]   # path = client dir; default cwd
# Exit 0: valid
# Exit 1: invalid config, missing routes, or build failed
```

### 5️⃣ Data Contracts
- Load site.config.ts; run siteConfigSchema.parse()
- Check app/ has required routes (home, services, contact, book)
- Run `pnpm build` in path; fail if non-zero exit

### 6️⃣ Internal
- Parse config; validate schema; fs check routes; spawn build
- Deterministic; no network (except build deps)

### 1️⃣3️⃣ Checklist
1. Create scripts/validate-client.ts
2. Add schema validation
3. Add route existence check
4. Add build smoke
5. Add root script
6. Document in README

### 1️⃣5️⃣ Anti-Overengineering
- No deployment check; no performance check
- Build = sufficient smoke

---

## 6.10b Add health-check Script

### 1️⃣ Objective Clarification
- Single `pnpm health` command: lint, type-check, build, test (or subset)
- **Dependency:** None

### 3️⃣ File System Plan
- **Create:** scripts/health-check.ts
- **Update:** root package.json: `"health": "node scripts/health-check.js"`

### 4️⃣ Public API
```bash
pnpm health   # runs: lint, type-check, build, test (or turbo pipeline)
# Exit 0: all pass; Exit 1: any fail
```

### 1️⃣3️⃣ Checklist
1. Create script
2. Invoke turbo lint type-check build test (or equivalent)
3. Aggregate exit codes

---

## 6.10c Add program:wave0–wave3 Scripts

### 1️⃣ Objective Clarification
- program:wave0 (repo integrity), wave1 (feature + parity), wave2 (templates), wave3 (starter verification)
- **Dependency:** 6.10a, 6.10b

### 3️⃣ File System Plan
- **Update:** root package.json
- **Scripts:**
  - program:wave0: turbo lint type-check + dep check
  - program:wave1: turbo build test + feature parity
  - program:wave2: template build + route check
  - program:wave3: validate-client for starter + luxe-salon + bistro-central

### 1️⃣5️⃣ Anti-Overengineering
- Don't run full E2E; smoke/build + validate-client sufficient
