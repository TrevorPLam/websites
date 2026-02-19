# Documentation Standard Alignment — TODO

This checklist tracks alignment with the **2026 Master Repository Documentation Standard (v2.0)**.  
**Reference:** [docs/docs.md](docs/docs.md)  
**Target tier:** Extended  
**Repo metadata:** [repo-config.yml](repo-config.yml)

**Note:** This file is for _documentation-standard alignment_ only. For implementation backlog and task specs, see [TASKS.md](TASKS.md).

---

## Core Tier (7 mandatory)

- [x] **README.md** — Present. Optional: align to normative structure (badges, What & Why, Quick Start ~5 min, Features, Documentation links, Status, License); add YAML frontmatter for AI (`project`, `description`, `tags`, `primary_language`) in first 200 words.
- [x] **LICENSE** — Present (MIT).
- [x] **SECURITY.md** — Present. Confirm structure matches standard (Supported Versions, Reporting, Disclosure, Security Features, Threat Model link). See [SECURITY.md](SECURITY.md).
- [x] **CONTRIBUTING.md** — Present. Optional: align to normative (Code of Conduct ref, Getting Started, PR process, Style Guide with Conventional Commits, markdownlint/Vale, CLA/DCO if applicable). See [CONTRIBUTING.md](CONTRIBUTING.md).
- [x] **ARCHITECTURE.md** — Created. C4-aligned root file that delegates to [docs/architecture/README.md](docs/architecture/README.md).
- [x] **CODE_OF_CONDUCT.md** — Present.
- [x] **.github/CODEOWNERS** — Created for reviewer assignment (required Core).

---

## Extended Tier

- [x] **DEVELOPMENT.md** — Created at root: environment setup, build steps, debugging (Tutorial). References [docs/getting-started/onboarding.md](docs/getting-started/onboarding.md).
- [x] **TESTING.md** — Created at root: test strategy, how to run tests, coverage expectations (How-To + Reference).
- [ ] **GOVERNANCE.md** — Optional (multi-maintainer). Defer unless needed.
- [x] **ADRs** — Decided to use existing [docs/adr/](docs/adr/) location (10+ ADRs) as adaptation instead of creating root `ADRs/`.
- [x] **RUNBOOKS/** — Not needed (repo-config has `type: library`). Will add if type becomes service later.
- [x] **.context/MAP.md** — Created semantic index (concept → file) for AI discoverability.
- [x] **.context/RULES.md** — Created AI guardrails by migrating/merging [CLAUDE.md](CLAUDE.md).
- [x] **llms.txt** — Created AI doc index (~2K tokens): Core Documentation, Key Concepts, Decision Records, Getting Help.
- [x] **repo-config.yml** — Created. Keep updated as tier/type change.
- [x] **ROADMAP.md** — Created with strategic direction (Now/Next/Later). Complements [THEGOAL.md](THEGOAL.md) / [TASKS.md](TASKS.md).
- [x] **SUPPORT.md** — Created with issue triage, support channels.
- [x] **AUTHORS.md** — Created with contributors, funding information.
- [x] **CHANGELOG.md** — Present. Confirmed Keep a Changelog format. See [CHANGELOG.md](CHANGELOG.md).

---

## Cross-Cutting and Tooling

- [x] **Diátaxis frontmatter** — Added `diataxis`, `audience`, `last_reviewed`, `review_interval_days` to major docs (README.md, CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, plus all newly created docs).
- [x] **markdownlint** — Created [`.markdownlint.yml`](.markdownlint.yml) aligned with standard (replaces `.markdownlint.json`).
- [x] **Link checking** — Updated [`.github/workflows/docs-validation.yml`](.github/workflows/docs-validation.yml) to use lychee instead of markdown-link-check for faster, more reliable link validation.
- [ ] **Vale** — Optional. Standard recommends for tone/style. Track in TODO.
- [x] **REVIEW_SCHEDULE.md** — Created doc review cadence and owners; CI checks `last_reviewed` vs `review_interval_days` via [scripts/check-review-schedule.js](scripts/check-review-schedule.js).

---

## Optional / Comprehensive (Later)

- [ ] **SBOM.json** — [.github/workflows/sbom-generation.yml](.github/workflows/sbom-generation.yml) generates CycloneDX/SPDX to artifacts. Standard: root `SBOM.json` or documented location; separate from VEX.
- [ ] **VEX.json** — Vulnerability Exploitability eXchange (Comprehensive / regulated).
- [ ] **THREAT_MODEL.md** — STRIDE analysis (Comprehensive / regulated).
- [ ] **REVIEW_SCHEDULE.md** — See Cross-Cutting.
- [ ] **docs/i18n/** — Localization (Comprehensive, `audience: global`).
- [ ] **CITATION.cff**, **ro-crate-metadata.json**, **.zenodo.json** — Research outputs (Comprehensive).
- [ ] **COPYRIGHT**, **NOTICE** — If switching to Apache-2.0 or GÉANT (Comprehensive).

---

## Migration Phases (Standard Section 9)

| Phase               | Focus                       | Map to sections above                                                                                 |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| **1. Foundation**   | repo-config, Core tier gaps | Create ARCHITECTURE.md at root, .github/CODEOWNERS; normalize README/SECURITY/CONTRIBUTING if needed. |
| **2. Architecture** | C4, ADRs                    | Root ARCHITECTURE.md; decide ADRs location (root `ADRs/` vs `docs/adr/`).                             |
| **3. Operational**  | Builder docs, runbooks      | DEVELOPMENT.md, TESTING.md; RUNBOOKS/ if type becomes service.                                        |
| **4. Intelligence** | AI layer                    | llms.txt, .context/MAP.md, .context/RULES.md.                                                         |
| **5. Maturity**     | Freshness, tooling          | REVIEW_SCHEDULE.md, frontmatter, link-check (lychee), doc-health CI.                                  |

---

## Validation

- **Current:** [scripts/validate-documentation.js](scripts/validate-documentation.js) and [pnpm validate-docs](package.json) (metaheaders, markdown, links). [.github/workflows/docs-validation.yml](.github/workflows/docs-validation.yml) runs on push/PR for docs.
- **To add:** Checks for Core/Extended required files and repo-config.yml (e.g. in validate-documentation.js or a small script). Optional: integrate `docs-lint` (standard Section 8.1) when available.

---

## Coexistence with TASKS.md

**TODO.md** = documentation-standard alignment (this file).  
**TASKS.md** = implementation backlog and task specifications. No change to TASKS.md or existing references.
