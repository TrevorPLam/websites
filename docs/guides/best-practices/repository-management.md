# Master Brief: Internal Repository Management
### A Complete Reference from Basics to Enterprise Methodology

***

## PART I: BASICS

### What Is a Repository?

A repository is a centralized database of every historical version of a project — every edit, who made it, and why — making it possible to restore any prior state or audit how code evolved. Git, the dominant distributed version control system, gives every developer their own full copy of this database locally, enabling offline work and fast branching.

### The Three Local States

- **Working copy** — Files actively being edited on your machine
- **Staging area (index)** — A preparation zone where you select which changes to include in your next commit (`git add`)
- **Local repository** — The committed, permanent snapshot stored in `.git/`

Only staged changes are saved when you run `git commit` — this design lets you commit one file at a time, keeping commits focused and atomic.

### Core Daily Workflow

1. `git pull` — Sync with the latest remote changes before starting
2. `git branch <name>` + `git checkout <name>` — Create and switch to your feature branch
3. Edit files → `git status` / `git diff` — Review changes before staging
4. `git add` → `git commit -m "..."` — Stage and commit atomically
5. `git pull` again — Merge teammate changes before pushing
6. `git push` — Share changes with the remote

### Distributed vs. Centralized

| Concept | Centralized (SVN) | Distributed (Git) |
|---|---|---|
| Repositories | One shared central repo | Every developer has a full local repo |
| Commit scope | Goes directly to central server | Saved locally first, then pushed |
| Offline work | Not possible | Fully supported |
| Conflict timing | Exposed during `update` | Explicit `merge` step |
| Popularity | Declining | Dominant standard today |

### The Root Directory

The root is the front door of the repository. It should contain only high-level orientation files and top-level configuration — not application code. Standard root-level files:

- **`README.md`** — What the project is, how to install and run it, how the structure is organized
- **`LICENSE`** — Legal terms under which the code can be used
- **`CHANGELOG.md`** — Human-readable log of notable changes per version
- **`.gitignore`** — Files Git should never index (artifacts, secrets, editor configs)
- **`CONTRIBUTING.md`** — How contributors should submit changes
- **`CODE_OF_CONDUCT.md`** — Behavioral expectations for contributors
- **`SECURITY.md`** — Process for responsibly reporting vulnerabilities

### Core Directory Structure

```
project-root/
├── src/            # All production source code
├── tests/          # All test files, mirroring src/ structure
├── docs/           # Documentation, guides, architecture diagrams
├── scripts/        # Automation, build helpers, migration scripts
├── config/         # Configuration files (non-secret, environment templates)
├── assets/         # Static assets: images, fonts, icons
├── examples/       # Example usage code or demo scripts
└── .github/        # GitHub-specific: issue templates, PR templates, workflows
```

### The `src/` Directory — Organization Patterns

| Architecture | `src/` Organization |
|---|---|
| **Feature-based** | `src/auth/`, `src/billing/`, `src/dashboard/` |
| **Layer-based** | `src/controllers/`, `src/services/`, `src/models/` |
| **Domain-driven** | `src/domain/`, `src/application/`, `src/infrastructure/` |
| **Component-based** (UI) | `src/components/`, `src/hooks/`, `src/pages/`, `src/store/` |

Feature-based organization scales better because when you need to delete or refactor a feature, all related files are co-located rather than scattered across layer directories.

### The `tests/` Directory

Tests must mirror the structure of `src/` exactly:

```
src/auth/login.js       →    tests/auth/login.test.js
tests/
├── unit/
├── integration/
└── e2e/
```

Test fixtures belong in `tests/fixtures/` or `tests/__mocks__/` — never inline in test files and never mixed with production data.

### The `docs/` Directory

```
docs/
├── architecture/    # System design diagrams, ADRs, data flow
├── api/             # Endpoint references, schema definitions
├── guides/          # Step-by-step setup, deployment, onboarding
└── images/          # All images referenced by documentation
```

### Naming Conventions

- **Directories** — lowercase with hyphens: `user-auth/`, `data-pipeline/`
- **Source files** — match the primary export: `UserProfile.tsx`, `invoice-service.js`
- **Test files** — append `.test`, `.spec`, or `_test`: `invoice-service.test.js`
- **Config files** — environment-explicit: `config.development.json`
- **Scripts** — verb-first, hyphen-separated: `migrate-db.sh`, `seed-fixtures.py`
- **Never use** `final`, `v2`, `new`, or `old` as suffixes
- **Dates in filenames** — always ISO 8601: `YYYY-MM-DD`
- **Relative paths only** — never absolute paths inside a repository

### The `README.md` In Depth

A complete README covers: project title and one-line description; badges (build status, coverage, license); table of contents; installation; usage; project structure; configuration; contributing; license.

### Separation of Raw vs. Generated Files

- Generated files (`dist/`, `build/`, `out/`) must be listed in `.gitignore`
- Raw data must never be modified in place; transformations produce new output files
- Configuration templates (`.env.example`) belong in the repo; actual env files with values do not

***

## PART II: FUNDAMENTALS

### Cohesion and Coupling: The Core Design Principle

Every internal organization decision traces back to two concepts:

- **Cohesion** — How well the elements *inside* a module belong together (intra-module concern)
- **Coupling** — The strength of connections *between* modules (inter-module concern)

The universal design target is **high cohesion + low coupling**.

### The Six Levels of Cohesion (Worst to Best)

| Level | Description | Example |
|---|---|---|
| **Coincidental** | Elements have no meaningful relationship | A `helpers.js` with unrelated utilities |
| **Logical** | Elements share a vague technical category | A `database/` folder mixing reads, writes, migrations, seeds |
| **Temporal** | Elements are executed at the same time | An `init.js` that runs everything on startup |
| **Communicational** | Elements operate on the same data | A `shipment/` module with all shipment logic |
| **Sequential** | Output of one element feeds into the next | A data transformation pipeline |
| **Functional** | All elements contribute to one single goal | A `calculateInvoiceTotal()` function |

### Types of Coupling (Strongest to Weakest)

1. **Content** — One module directly accesses internal data of another (worst)
2. **Common** — Modules share mutable global state
3. **Control** — One module passes a flag that changes another's internal logic
4. **External** — Modules communicate through an external file or system
5. **Stamp** — A module receives an object but uses only part of it
6. **Data** — Modules exchange only the exact data they need (best)

### Self-Documenting Code

- **Verb-noun function names** — `calculateInvoiceTotal()`, not `calc()`
- **Descriptive variable names** — `maxLoginAttempts` not `n`
- **No magic numbers** — `const MAX_LOGIN_ATTEMPTS = 3`
- **Small, single-purpose functions** — If a function is hard to name, it does too many things
- **Refactor instead of comment** — The impulse to write an explanatory comment is a signal to rename or extract

### Inline Comments: The Right Standard

Comments should explain **why**, never **what**. The most valuable comments:

- **Rationale** — `// Used custom sort here — V8's native sort is unstable for this data type`
- **Business rules** — `// User tier set to 'premium' if last 3 orders total > $500`
- **Workarounds** — `// Workaround for https://jira.example.com/browse/PROJ-123`
- **Rejected alternatives** — `// Considered caching here but write frequency makes this counterproductive`
- **TODO/FIXME tags** — Always include a ticket number: `// TODO: PROJ-456`

### The `.gitignore` In Depth

Falls into four categories: build artifacts, dependency directories, environment/secret files, and local editor configs.

```
# OS-generated files
.DS_Store
Thumbs.db

# Compiled output
dist/
build/
*.o
*.class

# Dependency trees
node_modules/
vendor/
__pycache__/

# Environment and secrets
.env
.env.local
*.pem
*.key

# Editor-specific
.vscode/
.idea/
*.swp
```

### The `.gitattributes` File

Tells Git how to handle tracked files:

```
* text=auto
*.sh text eol=lf
*.bat text eol=crlf
*.png binary
*.jpg binary
*.pdf binary
dist/* linguist-generated=true
package-lock.json linguist-generated=true
*.md diff=markdown
```

The most critical use is line ending normalization — without `text=auto`, a Windows developer committing with CRLF produces diffs showing every single line as changed.

### The `.editorconfig` File

Defines formatting rules enforced at the editor level:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true

[*.py]
indent_size = 4

[Makefile]
indent_style = tab
```

### Architecture Decision Records (ADRs)

Short Markdown files in `docs/adr/` capturing the context and reasoning behind significant decisions:

```
docs/adr/
├── 0001-use-postgres-over-mysql.md
├── 0002-adopt-feature-based-folder-structure.md
└── 0003-switch-from-rest-to-graphql.md
```

Each ADR records: context (what problem forced this), decision (what was chosen), alternatives considered and why rejected, and consequences (tradeoffs accepted).

### Docs-as-Code

- All documentation is Markdown stored in `docs/`
- Documentation updates are a required part of every PR
- Architecture diagrams written in Mermaid or PlantUML (text, not binary image files)
- A linter (`markdownlint`) runs on documentation in CI
- Comments in source code link to relevant doc files: `// See /docs/auth-flow.md`

***

## PART III: BEST PRACTICES

### Code Quality Metrics (Measurable Standards)

| Metric | What It Measures | Target |
|---|---|---|
| **Cyclomatic Complexity** | Independent logical paths through a function | ≤10 per function |
| **Maintainability Index** | Volume, complexity, comments composite | ≥85 |
| **Code Duplication** | Identical/near-identical code blocks | Near 0% |
| **Unit Test Pass Rate** | Tests passing on every commit | 100% |
| **Code Churn** | Frequency of add/modify/delete | High churn on stable modules = design instability |
| **Technical Debt Ratio** | Effort to fix maintainability issues | Track trend |
| **Dependency Graph Complexity** | Depth/density of inter-module connections | Flat, minimal |
| **Average Code Review Time** | PR open to first substantive review | Benchmark against DORA tier |

### The Coding Standards Document

Every repository contains a committed `docs/standards/coding-standards.md` covering:

- **Naming conventions** — `verbNoun` camelCase for methods; `PascalCase` for classes; `UPPER_SNAKE_CASE` for constants
- **File length limits** — No source file exceeds 400 lines; no function exceeds 40 lines; no parameter list exceeds 5 parameters
- **Import ordering** — Standard library first, third-party, then internal; blank lines between groups; alphabetical within each
- **Error handling patterns** — Define whether errors are returned, thrown, or logged
- **Comment standards** — Which style to use, when inline comments are required, doc comment format

Enforced by a linter configuration file committed to the repo (`.eslintrc`, `.pylintrc`, `rubocop.yml`).

### Internal Dependency Management

- **Pin exact versions** — `"lodash": "4.17.21"` not `"^4.0.0"`; floating ranges allow silent breaking changes
- **Lock files are sacred** — `package-lock.json`, `poetry.lock`, `Cargo.lock`, `go.sum` must always be committed and never edited by hand
- **Separate production from development dependencies** — `devDependencies` vs. `dependencies`; deployment environments should never install dev tools
- **Audit transitive dependencies** — A vulnerable transitive dependency is a vulnerability in your code
- **Prefer small, focused packages** — A dependency that does one thing is easier to replace, audit, and understand
- **Evaluate before adopting** — Active maintenance cadence, community size, test coverage, license compatibility, size impact

### Module and Interface Design

- **Define explicit public APIs per module** — Each module has an `index.js`/`__init__.py` that exports only what other modules are intended to consume
- **Depend on interfaces, not implementations** — Module A should depend on an abstract interface, not the concrete class
- **Enforce the dependency rule** — Inner domain modules must never import from outer infrastructure modules
- **No circular dependencies** — Detect with `madge` (JS) or `import-linter` (Python)
- **One responsibility per file** — Each file should have a clear, single purpose matching its filename

### Internal Test Organization

- **Arrange-Act-Assert (AAA) pattern** — Every test has three clearly separated sections
- **One assertion per test** — Each test verifies exactly one behavior
- **Test names describe behavior** — `test_returns_empty_list_when_user_has_no_orders` not `test_getUserOrders`
- **No logic in tests** — No `if/else`, `for` loops, or `try/catch` in test bodies
- **Fixtures and factories** — Test data created through factory functions, not raw hardcoded strings
- **80% line coverage as a floor** — Branches and edge cases matter more than inflating the percentage
- **Isolate external calls** — Database queries, API calls, file system operations in unit tests must be mocked

### Internal Documentation Tiers

1. **Inline code comments** — For non-obvious logic and business rules
2. **Doc comments** — Machine-readable annotations on every public function, class, and module
3. **Module-level READMEs** — A `README.md` inside complex subdirectories
4. **`docs/` directory content** — Architecture guides, ADRs, integration diagrams, runbooks

### The `CHANGELOG.md` Standard (Keep a Changelog format)

```markdown
## [Unreleased]
### Added
- New CSV export for invoice module

## [2.4.0] - 2026-02-10
### Added
- OAuth2 SSO login support
### Fixed
- Null pointer in billing service for EU tax
### Removed
- Legacy XML API endpoints
```

Every entry grouped under: Added, Changed, Deprecated, Removed, Fixed, Security.

### Configuration File Hygiene — Three-Tier Separation

- **`config/defaults.json`** — Committed; safe environment-agnostic defaults
- **`config/.env.example`** — Committed; template listing every required env variable with placeholder and inline comment
- **`.env`** — Never committed; contains actual secrets; listed in `.gitignore`

### Semantic Versioning Inside the Repository

`MAJOR.MINOR.PATCH`:
- **PATCH** — Backward-compatible bug fix only
- **MINOR** — New backward-compatible feature
- **MAJOR** — Breaking change

The version in the manifest must always match the corresponding `git tag` on the exact commit published.

### `scripts/` Directory Standards

- **Every script has a `--help` flag**
- **Scripts are idempotent** — Running twice produces the same result as running once
- **Documented in `scripts/README.md`** — Table listing every script, its purpose, required environment, example invocation
- **Scripts do not contain secrets** — They read from environment variables
- **Shebang lines are explicit** — `#!/usr/bin/env bash`

### Deprecation Patterns

- **Language-native annotations** — `@deprecated`, `#[deprecated]`, `[Obsolete]`
- **Comments include migration path** — `@deprecated since v2.4.0 — use calculateInvoiceTotal(order) instead`
- **Never silently remove** — Announce in `CHANGELOG.md` → deprecate → remove in next major version
- **Deprecation tests** — Verify deprecated functions still work and replacements produce identical output

### Workspace Protocol (Monorepos)

```json
"@company/shared-kernel": "workspace:*"
```

`workspace:*` means always use the local version — no version resolution, no risk of a published version and local version diverging.

***

## PART IV: HIGHEST STANDARDS

### Clean Architecture: The Dependency Rule

Source code dependencies can only point inward — business logic knows nothing about databases, frameworks, or APIs:

```
src/
├── domain/          # Zero external dependencies — pure business logic
├── application/     # Use cases — orchestrate domain logic; depends only on domain/
├── infrastructure/  # Adapters: DB, APIs, file I/O — implements interfaces from application/
└── interfaces/      # Transport: HTTP controllers, CLI — depends on application/ only
```

Any `import` in `domain/` referencing `infrastructure/` is a hard violation, detectable by static analysis and rejectable in CI.

### Hexagonal Architecture (Ports & Adapters)

Business logic should not care whether it is triggered by HTTP, a message queue, a CLI command, or a cron job, and should not care whether data comes from PostgreSQL, GraphQL, gRPC, or a CSV file:

- **Ports** — Interfaces defined inside the application core (`UserRepository`, `EmailSender`, `PaymentGateway`)
- **Adapters** — Concrete implementations in `infrastructure/` (`PostgresUserRepository`, `SendgridEmailSender`)

Netflix applied this pattern and was able to swap a data source from a JSON API to GraphQL in 2 hours with a single-line change.

### SOLID Principles Applied Inside a Repository

| Principle | Internal Repository Implication |
|---|---|
| **Single Responsibility** | One file, one class, one public purpose |
| **Open/Closed** | Add new behavior by creating new files, not modifying existing ones |
| **Liskov Substitution** | Any implementation of an interface must be swappable without changing the caller |
| **Interface Segregation** | Many small, role-specific interfaces over one large general one |
| **Dependency Inversion** | High-level modules import interfaces, never concrete classes |

### Quality Gates as Hard Internal Contracts

SonarQube "Sonar Way" quality gate conditions on new code:

- **Coverage** — ≥80% test coverage
- **Duplications** — ≤3% duplicated lines
- **Maintainability rating** — A (no new code smells above defined complexity)
- **Reliability rating** — A (zero new bugs)
- **Security rating** — A (zero new vulnerabilities)
- **Security hotspot review rate** — 100% of new hotspots reviewed

### Domain-Driven Design (DDD) Inside the Repository

```
src/domain/
├── billing/
│   ├── Invoice.ts          # Aggregate root
│   ├── LineItem.ts         # Entity
│   ├── Money.ts            # Value object (immutable)
│   └── InvoiceRepository.ts  # Port interface
├── identity/
│   └── ...
└── shipping/
    └── ...
```

Key distinction: **Entities** (mutable objects with identity) vs. **Value Objects** (immutable objects defined entirely by their data — no setters, replaced wholesale).

### Modular Monolith: The Hybrid Highest Standard

```
src/
├── modules/
│   ├── billing/
│   │   ├── public-api.ts    # The ONLY file other modules may import
│   │   ├── internal/        # Everything here is private
│   │   └── tests/
│   ├── identity/
│   └── shipping/
└── shared/
    └── kernel/              # Shared primitives: Money, DateTime, etc.
```

`import-linter` enforces at CI time that no file in `billing/internal/` is imported outside `billing/`. This allows the repository to be decomposed into true microservices in the future by simply extracting a module.

### Fitness Functions: Automated Architecture Enforcement

Tests committed to `tests/architecture/` that verify architectural properties:

```python
def test_domain_has_no_infrastructure_imports():
    violations = find_imports("src/domain/", importing_from="src/infrastructure/")
    assert violations == []

def test_no_circular_dependencies():
    graph = build_import_graph("src/")
    assert not has_cycles(graph)

def test_value_objects_are_immutable():
    for cls in find_classes("src/domain/", superclass="ValueObject"):
        assert has_no_setters(cls)
```

Tools: **ArchUnit** (Java), **Dependency Cruiser** (JS/TS), **import-linter** (Python), **cargo-deny** (Rust).

### Immutability as a First-Class Internal Standard

- All value objects are frozen on construction with no mutation methods
- All function parameters are treated as read-only; functions return new values
- State transitions on entities are explicit named methods (`order.markAsShipped()`)
- Collections passed between modules are frozen or copied before being stored

### The Internal Observability Standard

Every module emits structured log events at defined points:

- **Entry points** — Every use case logs incoming request context (correlation ID, user ID, action name) at `INFO`
- **Decision points** — Every significant branching decision logs context and outcome at `DEBUG`
- **Error boundaries** — Every caught exception logs full stack trace plus request context at `ERROR`
- **Performance boundaries** — Every external adapter call is wrapped in a timing span

Log format is **structured JSON** — never plain string concatenation. All logging routes through one shared `src/shared/observability/logger.ts`.

### ADR Governance Workflow

1. **Proposed** — Engineer opens a PR adding `docs/adr/NNNN-title.md` with status `Proposed`
2. **Discussion** — Reviewed in PR comments by affected stakeholders
3. **Accepted or Rejected** — Status updated; PR merge is the formal approval event
4. **Superseded** — Old ADR status updated to `Superseded by ADR-NNNN`; never deleted

***

## PART V: ENTERPRISE METHODOLOGIES

### Conway's Law: The Foundational Enterprise Constraint

*"Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure."*

The **Inverse Conway Maneuver**: restructure your teams to match the architecture you want, and the code will follow. Team boundaries become module boundaries; organizational communication pathways become dependency edges.

### Repository Architecture Strategy

| | **Monorepo** | **Polyrepo** | **Hybrid** |
|---|---|---|---|
| **Structure** | All projects in one repo | One repo per project/service | Related services grouped per repo |
| **Code sharing** | Instant — one commit updates all consumers | Requires versioned packages | Partial sharing within group repos |
| **CI/CD** | Unified pipeline with selective build/test | Each repo has an independent pipeline | Per-group pipelines |
| **Access control** | Harder; CODEOWNERS mitigates | Strict per-repo permissions naturally | Balanced |
| **Enterprise adopters** | Google, Meta, Microsoft, Uber, Twitter | Amazon, Netflix | Mid-size product companies |

### Monorepo Tooling at Scale

| Tool | Language Focus | Key Capability |
|---|---|---|
| **Bazel** | Java, C++, Go, multi-language | Hermetic builds, advanced caching, distributed execution |
| **Nx** | JavaScript/TypeScript | Dependency graph, smart task runner, Nx Cloud remote cache |
| **Turborepo** | JavaScript/TypeScript | Remote caching, task scheduling, incremental adoption |
| **Pants** | Python, Go, Java, Scala, Docker | File-level granularity, secure lockfile builds |
| **Rush** | JavaScript | Parallel/incremental builds, team version coordination |
| **Lerna** | JavaScript/TypeScript | Package publishing, distributed caching |

Universal principle: **affected-only builds** — only projects whose dependency graph includes the modified code are rebuilt and retested.

### InnerSource Methodology

Applying open-source collaboration patterns to internal private codebases:

| Role | Responsibilities |
|---|---|
| **Core Maintainers** | Define roadmap, review PRs, enforce standards |
| **Regular Contributors** | Deliver features, address review feedback |
| **Occasional Contributors** | Submit fixes, update docs |

Every contributor follows the same workflow: fork upstream → create feature branch → implement → open PR. This democratizes contribution while maintaining governance through code review and branch protection.

### Strategic DDD: Bounded Contexts as the Enterprise Unit

A **Bounded Context** is the primary unit of internal organization — a clearly delimited region where a specific domain model is valid and a specific team has ownership. The same word means different things across contexts:

| Term | Sales Context | Fulfillment Context | Accounting Context |
|---|---|---|---|
| **Customer** | Shopping history, preferences | Shipping address only | Billing info, credit limit |
| **Order** | Items, discounts, totals | Items to pack, tracking | Invoice, payment status, tax |

### Context Mapping: How Bounded Contexts Relate

| Relationship | Internal Structure | Use When |
|---|---|---|
| **Partnership** | Shared interfaces, coordinated changes | Tightly coupled contexts evolving together |
| **Customer-Supplier** | Upstream publishes versioned API; downstream consumes | One team depends on another's output |
| **Conformist** | Downstream adapts fully to upstream model | Integrating with a system you cannot influence |
| **Anti-Corruption Layer (ACL)** | Translation module between clean domain and external model | Preventing poorly structured external system from infecting your domain |
| **Shared Kernel** | Small set of shared value objects in `src/shared/kernel/` | Common primitives needed by multiple contexts |

The context map is a committed diagram in `docs/architecture/context-map.md` written in Mermaid, version-controlled alongside the code.

### Tactical DDD Building Blocks

**Aggregates and Aggregate Roots**
The Aggregate Root is the only object external code may hold a reference to. One transaction modifies one aggregate only. Cross-aggregate consistency is achieved through **Domain Events**, never through a spanning transaction.

**CQRS: Separating Read and Write Models**

```
src/application/orders/
├── commands/
│   ├── CreateOrderCommand.ts
│   ├── CreateOrderHandler.ts
│   └── CreateOrderValidator.ts
└── queries/
    ├── GetOrdersByCustomerQuery.ts
    └── GetOrdersByCustomerHandler.ts
```

Commands go through the full domain model. Queries bypass the domain model entirely and read directly from a denormalized read model. Rule: **queries never modify state; commands never return data** beyond a confirmation ID.

**Event Sourcing**
For domains requiring complete immutable audit trails — finance, healthcare, legal — the repository stores every event that produced a state rather than the current state itself. Used selectively only where audit trail has genuine business or regulatory value.

**Domain Events**
When `Order.Confirm()` is called, it raises an `OrderConfirmedEvent`. Handlers in the application layer react — without the `Order` aggregate knowing anything about email or inventory. This keeps the `domain/` import graph flat: zero outward dependencies.

### Vertical Slice Architecture

Organizes around features rather than layers:

```
src/features/orders/
├── create-order/
│   ├── CreateOrderCommand.ts
│   ├── CreateOrderHandler.ts
│   ├── CreateOrderValidator.ts
│   └── CreateOrderEndpoint.ts
└── get-orders/
    ├── GetOrdersQuery.ts
    ├── GetOrdersHandler.ts
    └── GetOrdersEndpoint.ts
```

Hybrid approach — Vertical Slices at the application layer with a shared Clean Architecture domain layer underneath — is the emerging enterprise standard.

### Module Federation (Enterprise Frontend)

Each application exposes specific modules through a `federation.config.js`:

```js
exposes: {
    './InvoiceWidget': './src/components/InvoiceWidget',
    './useBillingData': './src/hooks/useBillingData',
}
```

Exposed modules must be treated as **public APIs** with the same versioning, backward compatibility, and documentation requirements as an external REST API.

### The `shared/kernel/` Pattern

Governance rules:
- Only **pure value objects** — no business logic, no domain services
- **Changes require sign-off from all consuming teams**
- **Fitness function enforces size** — a growing shared kernel is a warning sign of insufficient bounded context isolation
- **Zero inward imports** — the kernel imports from nothing else in `src/`

### Dependency and Versioning Governance

- **SemVer** for all versioned packages
- **Renovate Bot** or **Dependabot** automates dependency update PRs
- **Changesets** (JS/TS) or **Release Please** (multi-language) automates version bumping and changelog generation from commit history

***

## PART VI: NOVEL AND UNIQUE TECHNIQUES

### Stacked Pull Requests (Stacked Diffs)

Instead of waiting for one large PR to be reviewed, branch off your in-progress feature branch and open dependent PRs in a chain:

- PR 1: Add checkout button UI → open for review immediately
- PR 2: Build checkout form (branched off PR 1) → open in parallel
- PR 3: Integrate payment gateway (branched off PR 2) → open in parallel
- PR 4: Handle order submission (branched off PR 3) → open in parallel

Each PR is under 200 lines, making reviews faster. **Graphite** solves the rebase propagation problem with a single `gt modify` command that auto-restacks all downstream branches.

### Sparse Checkout + Partial Clones

```bash
git clone --filter=blob:none --sparse https://github.com/company/monorepo.git
cd monorepo
git sparse-checkout set frontend backend/api
```

`--filter=blob:none` enables a partial clone — Git downloads tree and commit objects but defers downloading file contents until actually accessed. A developer working on `frontend/` of a 10GB monorepo may clone under 200MB.

### Mutation Testing: Verifying the Verifiers

Automatically introduces small defects into source code and checks whether any test fails. The **mutation score** is the percentage of mutants killed — the true measure of test suite effectiveness. A codebase with 90% line coverage and 45% mutation score has a dangerously false sense of security.

```js
// stryker.config.js — committed to root
// CI gate blocks merge if mutation score < 80%
```

Run full mutation testing nightly; run incremental mutation testing (only against `git diff` changed files) on every PR.

Tools: **Stryker** (JS/TS/.NET), **PIT/PITest** (Java), **mutmut** (Python), **cargo-mutants** (Rust).

### Property-Based Testing: Mathematical Correctness

Verifies that invariants hold for *all possible inputs* rather than specific examples:

```typescript
// fast-check (TypeScript)
test("encode/decode round-trip", () => {
    fc.assert(fc.property(
        fc.string(),
        (s) => decode(encode(s)) === s
    ));
});
```

When failing, automatically **shrinks** to the simplest failing input. Target pure domain functions — value object constructors, validators, serializers, parsers, mathematical operations.

Tools: **fast-check** (JS/TS), **Hypothesis** (Python), **QuickCheck** (Haskell), **Rapid** (Go), **proptest** (Rust).

Place in `tests/property/`.

### Spec-Driven Development: GitHub Spec-Kit (August 2025)

Initializes a `specs/` directory:

```
specs/
├── features/
│   ├── user-authentication.md
│   └── billing-engine.md
├── technical-plan.md
└── tasks/
    ├── phase-1/
    └── phase-2/
```

Three-command workflow:
- `/specify` — Transforms ideas into structured, detailed Markdown specs
- `/plan` — Generates sequential technical implementation plan from spec
- `/tasks` — Breaks plan into phased, atomic AI-executable chunks

Specs are **version-controlled and diffable** — a spec change is reviewable in a PR just like a code change.

### Living Documentation

Tests written in Gherkin syntax are simultaneously requirements documents, automated tests, and living documentation:

```gherkin
Feature: Invoice Calculation
  Scenario: Apply discount code to order
    Given a customer has an order totaling $200.00
    When they apply discount code "SAVE10"
    Then the order total should be $180.00
```

After each test run, a browsable HTML report is generated showing passing (green), failing (red), and pending (yellow) scenarios — a real-time project status dashboard derived automatically from the test suite.

### Golden File Testing

Verifies complex deterministic outputs without exhaustive assertion code:

```
tests/golden/
├── api/
│   ├── get-invoice-response.json
│   └── create-order-response.json
├── codegen/
│   └── generated-client.ts
└── reports/
    └── monthly-summary-format.html
```

First run saves output as the golden file. Every subsequent run diffs output against the committed baseline. Update with `--update-golden` flag when intentional changes occur.

### Dependency Injection Composition Root

All dependency construction is centralized in a single `src/composition-root.ts` — the only file that imports concrete classes:

```typescript
// src/composition-root.ts — ONLY file that imports concrete implementations
import { PostgresUserRepository } from "./infrastructure/db/PostgresUserRepository";
import { SendgridEmailService } from "./infrastructure/email/SendgridEmailService";

export const container = {
    userRepository: new PostgresUserRepository(config.db),
    emailService: new SendgridEmailService(config.sendgrid),
};
```

A fitness function in CI verifies no file in `src/application/` or `src/domain/` instantiates infrastructure classes directly.

### Internal Contract Testing

Each module defines a contract that describes exactly what it exposes:

```
src/modules/billing/
├── public-api.ts             # The contract
├── contract.test.ts          # Verifies public-api.ts matches actual implementation
└── consumer.test.ts          # Verifies callers only use what's in public-api.ts
```

### `CODEOWNERS` as a Knowledge Graph + Bus Factor Report

A scheduled CI job queries `CODEOWNERS` programmatically to generate weekly **bus factor reports** — identifying files or modules with only one owner — committed to `docs/reports/bus-factor.md`.

### Temporal Coupling Detection via Commit History

Identifies files that change together frequently but have no explicit import relationship:

```bash
git log --all --numstat --date=short --pretty=format:'--%h--%ad--%aN' \
  > git-history.log
maat -l git-history.log -c git2 -a coupling
```

Output is a ranked list of co-change pairs with coupling percentage. Files with high temporal coupling but no structural relationship are candidates for refactoring or explicit decoupling. Tool: **Code Maat**.

### Commit Graph Acceleration

```bash
git config --global fetch.writeCommitGraph true
git commit-graph write --reachable --changed-paths
```

Precomputes and caches reachability data for the commit DAG, dramatically accelerating `git log`, `git merge-base`, `git blame`, and push/fetch negotiation. Combined with `git multi-pack-index write`, these are the same optimizations Microsoft applied to the Windows repository after migrating to Git.

***

## PART VII: ADDITIONAL CRITICAL GAPS

### Technical Debt Hotspot Analysis (CodeScene)

Only 2–3% of a typical codebase's files account for 11–16% of all commits. These **hotspots** — files that are both complex *and* frequently modified — are the only technical debt worth prioritizing immediately.

```
docs/reports/
├── hotspots.md            # Weekly auto-generated hotspot ranking
├── change-coupling.md     # Files that change together — hidden dependencies
├── bus-factor.md          # Files owned by a single developer
└── code-health-trend.md   # CodeHealth score over time, per module
```

A 1-point decline in Code Health (1–10 scale) correlates with a **25% increase in development time** for that module. This makes technical debt quantifiable in dollars: `(avg_engineering_cost_per_hour) × (hours_lost_per_week_in_hotspot) = weekly_debt_interest`.

### Database Migration Files

Versioned, sequential migration files tracked inside the repository:

```
src/infrastructure/db/migrations/
├── V1__create_users_table.sql
├── V2__add_email_verification.sql
├── V3__create_orders_table.sql
└── V4__add_billing_address_to_orders.sql
```

**Flyway vs. Liquibase:**

| | **Flyway** | **Liquibase** |
|---|---|---|
| **Format** | SQL files only | SQL, XML, YAML, or JSON |
| **Rollback** | Manual undo scripts | Built-in rollback commands |
| **Best for** | Straightforward schemas | Complex multi-environment schemas |

Critical rules:
- **Never modify a committed migration file** — checksum validation breaks all environments
- **Never delete a migration file** — breaks fresh environment setup
- **One concern per migration**
- **Migrations must be backward-compatible**

**Expand/Contract Pattern** for breaking schema changes:

```
20240115_expand_add_new_column.sql    # Step 1: Add nullable column
20240116_migrate_data.sql             # Step 2: Backfill existing rows
20240117_contract_drop_old_column.sql # Step 3: Remove old column (after deploy confirmed)
```

### Schema Versioning for Application Data

Embed a `schemaVersion` field in every persisted document:

```json
{
  "schemaVersion": "2",
  "orderId": "ORD-4521"
}
```

Migration logic lives in `src/infrastructure/migrations/document-migrations/` — pure functions transforming version N documents to version N+1. Application migrates lazily on read. Every schema version change requires a committed migration function and a corresponding test.

### Structured Logging Standards

Five internal logging standards:
- **Structured JSON always** — Every log line is machine-parseable JSON
- **Five levels with precise semantics** — `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`
- **Correlation IDs on every line** — Same `correlationId` threads through every log line from a single user request
- **No logging in domain layer** — Domain objects emit Events; application layer logs them
- **One shared logger module** — All logging routes through `src/shared/observability/logger.ts`

### Typed, Validated Configuration

```typescript
// src/config/index.ts
const ConfigSchema = z.object({
    database: z.object({
        host: z.string().min(1),
        port: z.coerce.number().int().positive(),
    }),
});

export const config = ConfigSchema.parse({
    database: { host: process.env.DB_HOST, port: process.env.DB_PORT },
});
```

If a required environment variable is missing or malformed, **the application fails at startup with a precise error** rather than failing silently at runtime. No `process.env` call ever appears outside `src/config/`.

***

## PART VIII: YOUR REPOSITORY — SPECIFIC GAPS (THEGOAL.md)

Based on analysis of your Marketing Websites Monorepo (FSD v2.1 + Zero-Trust Multi-Tenancy), here are the specific gaps not yet addressed:

### 1. FSD Public API Contract Testing
`index.ts` barrel exports at each FSD layer serve as the public API but have no **contract test** validating runtime shapes. Add `tests/architecture/` fitness functions verifying no `internal/` path is re-exported through an `index.ts` and `packages/core/src/index.ts` matches `packages/types/`.

### 2. `Result<T, E>` Monad Usage Convention Document
You have `packages/core/src/shared/Result.ts` but no committed `docs/guides/development/result-monad.md` specifying when to use `Result<T, E>` vs. throwing vs. returning `null`. Without it, all three patterns accumulate inconsistently:
- **Domain layer** — Always returns `Result<T, DomainError>`; never throws
- **Application layer** — Unwraps `Result`, maps to transport errors
- **Infrastructure layer** — Catches exceptions, maps to `Result` before surfacing

### 3. Database Migration Expand/Contract Pattern Enforcement
`docs/guides/development/database-migrations.md` references the expand/contract pattern but no CI check verifies that migrations touching existing columns always come in sets of three. Add a `database/migrations/README.md` enforcing the naming convention.

### 4. `packages/core/` Isolation Fitness Functions
`madge.config.js` checks circular dependencies but no dedicated fitness function verifies `packages/core/`'s zero-dependency constraint at CI time:
```typescript
test("packages/core has no external dependencies", () => {
    const pkg = JSON.parse(fs.readFileSync("packages/core/package.json"));
    expect(Object.keys(pkg.dependencies ?? {})).toEqual([]);
});
```

### 5. RLS Policy Golden File Tests
`tests/integration/rls-bypass.spec.ts` exists but there is no committed golden file baseline of exactly which RLS policies exist on every table. Add `database/policies/golden/` with one JSON file per table, auto-generated by `scripts/generate-policy-snapshots.ts`.

### 6. Webhook Idempotency Registry
`packages/integrations/webhooks/idempotency.ts` stores keys in Redis but there is no committed registry document specifying key format, TTL, and behavior per integration. Also add an `idempotency_keys` database table as fallback for Redis restarts.

### 7. `clients/` White-Label Override Contract
`clients/_template/` exists but no committed `clients/OVERRIDE_CONTRACT.md` specifying what enterprise clients cannot override (security headers, RLS context injection, audit logging). Add a CI workflow step validating each client's middleware against a security baseline.

### 8. Feature Flag Lifecycle Management
`packages/flags/` lacks a flag lifecycle document governing naming convention, a registry with owner and planned removal milestone, a stale flag detector, and a removal checklist in `CONTRIBUTING.md`.

### 9. `packages/email/` Visual Regression Tests
No visual regression tests exist for email templates. Add either a Litmus/Email on Acid integration in `ci-nightly.yml` or committed golden HTML files in `packages/email/src/templates/__golden__/` with a CI diff check.

### 10. `scripts/` Idempotency Annotations
Each script should have a header block declaring idempotency status, destructiveness, required environment variables, and side effects. `db-reset.sh` specifically needs a mandatory confirmation prompt and must be blocked when `NODE_ENV=production`.

### 11. `packages/types/` vs `packages/core/` Boundary Clarification
A missing document clarifying the exact rule:
- **`packages/types/`** — Pure structural TypeScript interfaces; no logic; used by infrastructure adapters and UI
- **`packages/core/`** — Rich domain objects with business methods and validation; never imported by infrastructure

### 12. Temporal Coupling Tracking
`scripts/analyze/dependency-graph.js` generates import graph visualizations but no change coupling analysis. Add `scripts/analyze/change-coupling.sh` using Code Maat or Git log analysis, regenerating `docs/reports/change-coupling.md` weekly in CI to surface hidden dependencies between `packages/integrations/` adapters and `database/migrations/`.
