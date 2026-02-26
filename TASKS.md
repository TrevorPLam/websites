Here’s a concrete, implementation-ready task list that sits alongside the master guide. Each parent task has subtasks, targeted files, related files, Definition of Done, and explicit “Don’t Do” rules.

---

## DOC‑01 – Unify Documentation Trees (Single Source of Truth)

**Goal:** Collapse `docs/`, `docs/guides/`, `docs/guides-new/`, and `mcp/docs/` into a single, unified Diátaxis tree under `docs/`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

### Targeted Files / Directories

- `docs/guides/**` (legacy) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- `docs/guides-new/**` (current consolidated guides) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- `docs/tutorials/**`, `docs/how-to/**`, `docs/reference/**`, `docs/explanation/**` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- `mcp/docs/**` (MCP-specific Diátaxis tree) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- `docs/README.md` (docs overview) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- `MCP_INDEX.md` (MCP workspace index that links to `mcp/docs/`) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)

### Related Files / Context

- Root `README.md` (high‑level repo structure and docs block) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
- `INDEX.md` (shows `docs/guides/` as “Comprehensive technical guides”) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Subtasks

1. **Freeze legacy `docs/guides/`**
   - Add `docs/guides/_ARCHIVED.md` explaining that new content must go into `docs/{tutorials,how-to,reference,explanation}` or `docs/guides-new/`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
   - Add a CI check that fails if new files are added under `docs/guides/` (except `_ARCHIVED.md`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

2. **Merge `mcp/docs/` into `docs/`**
   - Move:
     - `mcp/docs/tutorials/**` → `docs/tutorials/mcp/**` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
     - `mcp/docs/how-to/**` → `docs/how-to/mcp/**` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
     - `mcp/docs/reference/**` → `docs/reference/mcp/**` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
     - `mcp/docs/explanation/**` → `docs/explanation/mcp/**` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
   - Update links in `MCP_INDEX.md` to point at `docs/...` instead of `mcp/docs/...`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
   - Optionally create a symlink `mcp/docs -> ../docs` for backwards compatibility (if your tooling supports it).

3. **Clarify the role of `guides-new/`**
   - In `docs/README.md`, state explicitly that `guides-new/` is the canonical home for domain‑specific deep guides (architecture, security, payments, SEO, etc.). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
   - Ensure all links in the docs top‑level README and business glossary point to `guides-new/` versions where they exist. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

4. **Update navigation docs**
   - Update `docs/README.md` and root `README.md` documentation sections to reflect the unified layout and the archived status of `docs/guides/`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
   - Update `INDEX.md` documentation entries so “Guides” points to the new structure (e.g., `docs/guides-new/` and Diátaxis folders). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Definition of Done

- No new content is being added to `docs/guides/` (CI blocks it).
- All MCP documentation is discoverable under `docs/...` and `MCP_INDEX.md` only references `docs/`, not `mcp/docs/`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- `docs/README.md`, root `README.md`, and `INDEX.md` all describe a single, coherent docs structure without contradictions. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Don’t Do

- Don’t add _any_ new `.md` files under `docs/guides/` (only `_ARCHIVED.md` is allowed). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Don’t leave duplicate versions of the same guide under both `guides/` and `guides-new/`; pick one canonical location. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Don’t keep MCP‑specific Diátaxis in a separate tree (`mcp/docs/`) once the merge is done. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)

---

## DOC‑02 – Implement Zod Frontmatter Schema (Replace JSON Schema)

**Goal:** Replace `docs/frontmatter-schema.json` with a Zod‑based TypeScript schema as the single source of truth for documentation metadata. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Targeted Files / Directories

- `docs/frontmatter-schema.json` (existing JSON schema) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
- `docs/.config/frontmatter.schema.ts` (new Zod schema file, to be created)
- All docs under `docs/**` and `packages/**/docs/**` that should carry frontmatter. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Related Files / Context

- Dependency map: Zod 3.25.76 already in use. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- Authoring rules & documentation standards in `docs/README.md` and `docs/guides/GUIDESINDEX.md`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

### Subtasks

1. **Design schema fields**
   - Include: `title`, `description`, `domain`, `type`, `layer`, `audience`, `phase`, `complexity`, `freshness_review`, `validation_status`, `related`, `last_updated`, `version`.
   - Add repo‑specific fields: `task_id` (e.g., `DOMAIN-37-2-3`), `legacy_path`, `tech_stack`, `prerequisites`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

2. **Implement `docs/.config/frontmatter.schema.ts`**
   - Use Zod 3.x (matching `Zod 3.25.76` in dependencies). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
   - Export `docSchema`, `DocFrontmatter` type, and helper functions (`validateFrontmatter`, `safeParseFrontmatter`).

3. **Backfill frontmatter in key docs**
   - Add frontmatter to:
     - High‑traffic guides under `docs/guides-new/**` (architecture, security, payments, SEO, testing, AI). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
     - Core Diátaxis nodes (`docs/tutorials/**`, `docs/how-to/**`, etc.). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
     - Any package‑local `docs/**` and important `packages/**/README.md`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

4. **Deprecate JSON schema**
   - Mark `docs/frontmatter-schema.json` as deprecated in a comment header (or rename to `frontmatter-schema.legacy.json`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
   - Update any references in docs that mention “frontmatter-schema.json” to point to the Zod schema file. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Definition of Done

- `docs/.config/frontmatter.schema.ts` compiles and can successfully parse representative frontmatter from multiple domains (architecture, security, payments, etc.). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- The majority of high‑value docs (especially under `guides-new/`) have valid frontmatter that passes the schema. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- No new references in documentation point to the old JSON schema as the canonical source. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Don’t Do

- Don’t upgrade Zod to v4 as part of this task; stay aligned with the current dependency (`3.25.76`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- Don’t try to retrofit _every_ single doc at once; prioritize core and high‑traffic guides. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Don’t keep the JSON schema and Zod schema both “authoritative”; Zod is the single source of truth. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

---

## DOC‑03 – Wire Docs Validation into CI/CD

**Goal:** Add a dedicated CI workflow that validates frontmatter, checks freshness, lints prose, verifies links, and enforces the legacy‑guides freeze. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Targeted Files / Directories

- `.github/workflows/docs-validation.yml` (new workflow) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- `scripts/validate-frontmatter.ts` (new)
- `scripts/check-freshness.ts` (new)
- `docs/**/*.md`, `packages/**/docs/**/*.md`, `packages/**/README.md` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Related Files / Context

- Existing CI under `.github/workflows/` for build/tests. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- Authoring rules & documentation standards in `docs/README.md`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

### Subtasks

1. **Create `scripts/validate-frontmatter.ts`**
   - Use `glob` + `gray-matter` + `docSchema` to validate all `.md` files (excluding `docs/guides/**`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
   - Print clear per‑file errors and warnings; exit non‑zero on any validation failures.

2. **Create `scripts/check-freshness.ts`**
   - Compute staleness based on `freshness_review`.
   - Print a summary (total docs, stale docs, staleness rate).
   - Optionally, use `GITHUB_TOKEN` to open issues for stale docs.

3. **Create `.github/workflows/docs-validation.yml`**
   - Trigger on:
     - Push and PR to any `docs/**/*.md`, `packages/**/docs/**/*.md`, or `packages/**/README.md`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
   - Jobs:
     - `validate-frontmatter`
     - `check-freshness` (for scheduled runs)
     - `lint-prose` (Vale over docs + READMEs)
     - `check-links` (Lychee over docs + READMEs)
     - `block-legacy-changes` (fail if new files added under `docs/guides/` other than `_ARCHIVED.md`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

4. **Wire into branch protection**
   - Require `docs-validation` workflow to pass before merging into `main`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Definition of Done

- CI fails if any doc under `docs/**` or `packages/**/docs/**` has invalid frontmatter. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- CI fails if new files are introduced under `docs/guides/` (except `_ARCHIVED.md`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Basic freshness and link checks are running on each PR touching docs.

### Don’t Do

- Don’t run link checking on _every_ push if performance becomes an issue; you can scope it to PRs.
- Don’t enforce 0 stale docs initially; use the freshness metrics to prioritize cleanup rather than blocking all merges on day one.
- Don’t include `docs/.output/**` or `node_modules/**` in validation glob patterns.

---

## DOC‑04 – Promote & Configure MCP Documentation Server

**Goal:** Turn the existing `mcp/scripts/documentation-server.ts` into a first‑class MCP server with `search_document`, `get_document`, `find_examples`, `check_freshness`, and `get_agent_context` tools. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)

### Targeted Files / Directories

- `mcp/scripts/documentation-server.ts` (current RAG server script) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- `mcp/servers/src/` (MCP server implementations) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- `mcp/config/config.json` (main MCP configuration) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- `docs/.output/manifest.json` (docs manifest to be generated by CI)

### Related Files / Context

- `MCP_INDEX.md` listing “Documentation Server – Documentation RAG and search”. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- AI agent packages under `packages/agent-*` and context‑engineering. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
- `AGENTS.md` and per‑package agent context files. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Subtasks

1. **Relocate server**
   - Move `mcp/scripts/documentation-server.ts` → `mcp/servers/src/documentation-server.ts`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
   - Update imports / paths accordingly.

2. **Implement MCP tools**
   - `search_document` — search over `docs/.output/manifest.json` with filters (`domain`, `type`, `audience`).
   - `get_document` — read a single doc from `docs/` and validate frontmatter with `docSchema`.
   - `find_examples` — find docs with `validation_status: "tested"` and matching `tech_stack` or `fsd_layer`.
   - `check_freshness` — report staleness metrics (total, stale, unverified).
   - `get_agent_context` — map package names (e.g., `@repo/ui`) to their `AGENTS.md` and return contents. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

3. **Update `mcp/config/config.json`**
   - Register the documentation server with `command: "npx"` and `args: ["tsx", "mcp/servers/src/documentation-server.ts"]`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
   - Set env vars: `DOCS_ROOT`, `SCHEMA_PATH`, `MANIFEST_PATH`.

4. **Update MCP index**
   - Update `MCP_INDEX.md` to:
     - Point to the new server path. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
     - Document available tools and example calls.

### Definition of Done

- Documentation MCP server runs from `mcp/servers/src/documentation-server.ts` and is configured in `mcp/config/config.json`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- Tools `search_document`, `get_document`, `find_examples`, `check_freshness`, `get_agent_context` all return valid JSON for sample requests.
- `MCP_INDEX.md` clearly explains how to use the documentation server for search and retrieval. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)

### Don’t Do

- Don’t leave the old script copy under `mcp/scripts/documentation-server.ts` active; avoid two divergent implementations. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- Don’t bypass the Zod schema when returning frontmatter; always validate.
- Don’t load full document contents into memory for search if you can rely on the manifest index instead.

---

## DOC‑05 – Automate INDEX & Freshness Monitoring

**Goal:** Ensure `INDEX.md`, `MCP_INDEX.md`, and docs freshness metrics stay up to date via scheduled workflows. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Targeted Files / Directories

- `INDEX.md` (repo index, currently generated by Windsurf) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- `MCP_INDEX.md` (MCP/skills index) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- `.github/workflows/index-regen.yml` (new)
- `.github/workflows/freshness-audit.yml` or scheduled job inside `docs-validation.yml`

### Related Files / Context

- `scripts/regen-index.ts` (to be created) operating over current repo structure. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- `scripts/regen-mcp-index.ts` (to be created). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
- `scripts/check-freshness.ts` (from DOC‑03).

### Subtasks

1. **Implement regen scripts**
   - `scripts/regen-index.ts`:
     - Use `INDEX.md` structure as template. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
     - Re-scan key directories (`apps/`, `packages/`, `docs/`, `agents/`, `mcp/`, `tests/`, `e2e/`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
   - `scripts/regen-mcp-index.ts`:
     - Re-scan `mcp/servers/src/`, `mcp/apps/src/`, `skills/**`, `mcp/docs/**` (or unified `docs/`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)

2. **Add scheduled workflows**
   - `index-regen.yml`: weekly (e.g., Monday 6 AM) regenerate `INDEX.md` and commit if changed. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
   - Extend docs validation workflow (or add `freshness-audit.yml`) to run `check-freshness.ts` on a weekly cron and optionally create stale-doc issues.

3. **Footer consistency**
   - Update `INDEX.md` and `MCP_INDEX.md` footers to mention that they are auto-generated and point to the regen scripts. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

### Definition of Done

- `INDEX.md` and `MCP_INDEX.md` are regenerated on a schedule, and changes are auto‑committed via CI. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- Freshness audit runs weekly and outputs a summary (and optionally GitHub Issues) from `scripts/check-freshness.ts`.

### Don’t Do

- Don’t manually hand‑edit `INDEX.md` or `MCP_INDEX.md` after automation is in place; treat them as generated artifacts. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- Don’t create multiple overlapping cron jobs that regenerate the same file differently.
- Don’t use an excessive schedule (hourly); weekly is usually enough.

---

## DOC‑06 – CODEOWNERS & Governance

**Goal:** Assign clear ownership for docs, MCP, and packages so reviews are automatic and no docs are orphaned. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Targeted Files / Directories

- `.github/CODEOWNERS` (new or updated) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- `docs/**`, `mcp/**`, `packages/**`, `agents/**`, `skills/**` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Related Files / Context

- Agent context & architectural rules in `INDEX.md` (FSD isolation, Zod usage, etc.). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)
- Docs domains and audiences from `docs/README.md` & `guides-new/`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

### Subtasks

1. **Define ownership mapping**
   - Examples:
     - `/docs/explanation/architecture/` → `@lead-architect` + `@docs-team`
     - `/docs/guides-new/security/` → `@security-team` + `@docs-team` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
     - `/docs/guides-new/payments/` → `@payments-team` + `@docs-team` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
     - `/mcp/servers/src/` → `@mcp-team` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
     - `/agents/**` + `/skills/**` → `@ai-team` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

2. **Create / update `.github/CODEOWNERS`**
   - Add patterns for:
     - Core docs paths under `docs/`
     - MCP infrastructure under `mcp/` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
     - Package docs under `packages/**/docs/` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

3. **Enforce via branch protection**
   - In GitHub settings, require CODEOWNER review for `main`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/dc3cc46d-c7e5-4341-8e82-533a88326a68/INDEX.md)

4. **Document governance rules**
   - In `CONTRIBUTING.md`, add:
     - Who approves which areas. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
     - Expectations for keeping `freshness_review` up to date.
     - Link to docs validation CI.

### Definition of Done

- `.github/CODEOWNERS` covers all major docs and MCP areas with team‑level owners. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)
- PRs touching docs automatically request review from the correct owners.
- Governance rules are documented in `CONTRIBUTING.md`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Don’t Do

- Don’t assign single individuals as the only owners for critical paths; use GitHub teams where possible.
- Don’t leave `docs/` or `mcp/` root paths without owners. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Don’t rely solely on social norms for docs review; enforce via branch protection.

---

## DOC‑07 – Legacy Guides Migration

**Goal:** Systematically migrate high‑value content from `docs/guides/` (legacy) into the unified Diátaxis structure and `guides-new/`, then fully archive the legacy tree. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

### Targeted Files / Directories

- `docs/guides/**` (25+ categories, 200+ docs) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- `docs/guides-new/**` (new primary domain guides) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- `docs/guides/GUIDESINDEX.md` (legacy spec/roadmap). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

### Related Files / Context

- Top‑level layout & domain mapping in `docs/README.md`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Root `README.md` that points to architecture, AI, multi‑tenant, security docs. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/e9e0f246-d164-4f67-a5e3-237083dcee4a/README.md)

### Subtasks

1. **Prioritize categories**
   - Start with:
     - `architecture/`, `multi-tenant/`, `security/`, `payments-billing/`, `ai-automation/`, `seo-metadata/`, `testing/`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
   - Use `GUIDESINDEX.md` to identify high‑impact docs and their roadmap items. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

2. **For each legacy doc**
   - Decide the target Diátaxis type:
     - Tutorial vs How‑to vs Reference vs Explanation. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
   - Move content into:
     - `docs/tutorials/**`, `docs/how-to/**`, `docs/reference/**`, or `docs/explanation/**`, and/or
     - `docs/guides-new/<domain>/...` for domain‑deep dives (architecture, security, etc.). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
   - Add/normalize frontmatter to match `docSchema`.

3. **Update links and delete duplicates**
   - Update all internal links (including from `docs/README.md`, `INDEX.md`, `MCP_INDEX.md`). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/914d84c7-a81b-40d4-9dc3-04c75f28b56b/MCP_INDEX.md)
   - Delete or archive obsolete legacy files once their content exists in the new structure.

4. **Finalize archive**
   - Once migration is complete, leave only:
     - `docs/guides/_ARCHIVED.md` explaining historical context. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

### Definition of Done

- No remaining “live” content exists solely in `docs/guides/`; all important material has a home in Diátaxis folders or `guides-new/`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- All legacy links either:
  - Point to the new locations, or
  - Are clearly marked as archived.
- CI legacy‑directory gate is still active and passing (no new files there).

### Don’t Do

- Don’t do a blind bulk copy of `docs/guides/` → `guides-new/` without revisiting structure and Diátaxis type. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Don’t leave duplicate topics under both `guides/` and `guides-new/` without a clear canonical version. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)
- Don’t attempt to migrate every low‑value or obsolete page; use `GUIDESINDEX.md` and business priorities to decide. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/9bb3c446-16e0-46db-9976-f064db7e1bbc/README.md)

---

If you’d like, next step can be a **GitHub issue template set** that encodes these parent tasks (DOC‑01…DOC‑07) so you can spin them out into trackable epics and sub‑issues directly in your repo.
