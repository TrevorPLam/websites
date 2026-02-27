 Standards for Bimodal Documentation & Repository Governance
Document Status: Final / Regulatory Compliance
Effective Date: February 27, 2026
Compliance Deadline: August 2, 2026 (EU AI Act High-Risk Systems)
Scope: Universal (All Software Repositories, Services, and Knowledge Bases)
Classification: Internal Technical Standard
Authority: Office of the Chief Technology Officer (OCTO)
Review Cycle: Quarterly
Executive Summary
This specification consolidates all repository documentation requirements with "Best-in-Class" automation strategies reflecting current 2026 standards for AI-assisted development and Documentation-as-Code (DaC). It mandates bimodal documentation that serves both human developers (30-second Time-to-Value) and AI retrieval systems (RAG-optimized, semantically chunked).
Regulatory Context: By August 2, 2026, the EU AI Act mandates comprehensive technical documentation for High-Risk AI Systems . Non-compliance penalties reach EUR 35 million or 7% of global turnover . This specification ensures documentation infrastructure meets Articles 8-15 (Risk Management, Data Governance, Technical Documentation, Logging, Transparency, Human Oversight) .
1.  Project Entry & Discovery (Root Level)
These documents provide the first impression and essential legal/functional context. They must be bimodal—optimized for human scanning and AI retrieval.
1.1 Required Documents
Document	Human Purpose	AI Purpose	Compliance
README.md	Project identity, quickstart (<30 mins)	Primary RAG corpus, semantic chunking source	EU AI Act Art. 11 (Technical Documentation) 
LICENSE	Legal permissions	SPDX identifier for automated compliance scanning	License compatibility validation
CHANGELOG.md	Human-readable release history	Temporal context for version-specific queries	EU AI Act Art. 12 (Traceability) 
CONTRIBUTING.md	Contribution guidelines	Agent training data for PR review patterns	Governance
CODE_OF_CONDUCT.md	Community standards	Behavioral constraints for AI agents	ISO 42001 
SECURITY.md	Vulnerability disclosure	Incident response context for AI agents	EU AI Act Art. 9 (Risk Management) 
SUPPORT.md	Directs to Discord/Slack	Support channel metadata	Operational
AGENTS.md	(NEW 2026) AI agent constraints	Executable instructions for coding agents 	EU AI Act Art. 14 (Human Oversight) 
llms.txt	(NEW 2026) Machine-readable API context	LLM crawler optimization 	Emerging standard
1.2 Automation Strategy: The "Identity Agent"
AI-Generated READMEs: Use tools like README-AI or DocuWriter.ai to scan code structure and generate feature lists. Validation required: Human review mandatory before merge—AI-generated content must meet bimodal standards (Section 2.1) .
Conventional Commits: Enforce via commitlint in CI. This enables:
•  standard-version or semantic-release for automated CHANGELOG.md generation
•  Semantic versioning with automated git tagging
•  AI changelog generators (e.g., ai-changelog-generator , changeish ) that analyze git diffs and categorize changes
License Compliance: Run license-checker or fossa in CI to ensure dependency compatibility with project license (MIT/Apache-2.0/GPL) .
Implementation (GitHub Actions):
.github/workflows/identity-agent.yml
jobs:
generate-docs:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
- name: Generate README
uses: docuwriter-ai/readme-generator@v2
with:
template: bimodal-standard  # Enforces SBRI-2026 frontmatter
- name: Validate Bimodal Compliance
run: npx @sbri/validator --strict
- name: Check Licenses
run: npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD-3-Clause'
----
2.  Technical Knowledge Base (/docs Directory)
Following the Diátaxis Framework, organize by user intent: Tutorials (learning), How-To Guides (tasks), Reference (information), Explanation (understanding) .
2.1 Required Structure
/docs
├── /tutorials          # Learning-oriented, step-by-step lessons 
├── /how-to            # Goal-oriented, practical tasks 
├── /reference         # Technical specs, API endpoints, CLI flags 
├── /explanation       # Conceptual, "Why" vs "How" 
├── /adr               # Architecture Decision Records (numbered)
├── /glossary          # Domain-specific terminology
└── /dev               # Developer setup, troubleshooting
2.2 Bimodal Requirements for /docs
Semantic Chunking Compliance (SBRI-2026 Standard):
•  All Markdown files must include YAML frontmatter (Section 2.1 of SBRI-2026)
•  Section headers (##, ###) must create Self-Contained Functional Units (SCFUs) of 800-1200 tokens
•  Contextual Anchors: Each section must begin with a sentence establishing project context (e.g., "This section describes the authentication flow for the Payment Gateway Service...")
2.3 Automation Strategy: The "Mirror System"
API Auto-Documentation:
•  TypeDoc (TypeScript), Sphinx (Python), Swagger/OpenAPI (REST)
•  Integration: Auto-generate on every commit to main, commit to /docs/reference/api/
•  Validation: Ensure OpenAPI specs pass linting (spectral) before merge
Diagrams-as-Code:
•  Mermaid.js or PlantUML embedded in Markdown
•  CI Rendering: GitHub Action renders Mermaid to SVG on push:
.github/workflows/render-diagrams.yml
•  name: Render Mermaid diagrams
uses: mermaid-js/mermaid-cli-action@v1
with:
files: docs/**/*.md
output: docs/assets/diagrams/
Broken Link Sweeper:
•  Tool: lychee (Rust-based, fast)
•  Schedule: Weekly cron job + on every PR affecting /docs
•  Severity: Broken internal links = build failure; external links = warning
Schema Auto-Generation:
•  Database: dbdocs.io, Prisma-to-Markdown, or tbls (Table Schema)
•  Config: Auto-regenerate on schema changes, PR must include updated docs
RAG Optimization Pipeline :
.github/workflows/rag-optimize.yml
jobs:
optimize-docs:
steps:
- name: Chunk Validation
run: npx @sbri/chunk-validator --max-tokens 1200 --min-tokens 800
- name: Embedding Generation
run: npx @sbri/embed --model text-embedding-3-large --late-chunking
- name: Index to Vector DB
run: npx @sbri/index --destination pinecone --namespace docs
----
3.  Automation & AI Context (.github/ & Config)
These files ensure both human contributors and AI coding agents (GitHub Copilot Agent Mode, Cursor, Windsurf) follow organizational standards .
3.1 Required Configuration Files
File	Purpose	Standard
.github/copilot-instructions.md	(CRITICAL 2026) System instructions for GitHub Copilot Agent Mode 	GitHub Official Best Practices
AGENTS.md	Cross-platform AI agent constraints (Cursor, Claude, etc.) 	SBRI-2026 Section 3
llms.txt	Machine-readable API context for LLM crawlers 	Emerging standard (optional but recommended)
CODEOWNERS	Auto-assign reviewers based on file paths	GitHub native
Issue/PR Templates	Structured YAML/MD for reproduction steps	GitHub native
3.2 The copilot-instructions.md Standard (GitHub Copilot Agent Mode)
GitHub Copilot Agent Mode (launched 2025) requires explicit instructions to avoid "blind execution" . Location: .github/copilot-instructions.md
Required Sections :
Copilot Instructions for [Project Name]
Project Overview
[Brief description for AI context - Copilot doesn't inherently know your project]
Architecture
•  Tech stack: [e.g., .NET 9, Entity Framework Core, SQL Server]
•  Patterns: [e.g., Clean Architecture, Hexagonal]
•  Key files: App.tsx (routes), AppSideBar.tsx (navigation)
Coding Standards
•  Language: [German for UI, English for code]
•  Naming: [PascalCase for classes, camelCase for variables]
•  Forbidden: [Class-based components, direct fetch in components]
Safety & Permissions
Allowed without prompt:
•  Read files, list files
•  Type check single file (tsc, eslint, prettier)
•  Run single unit test
Ask first:
•  Package installs (npm install)
•  Git push
•  Deleting files
•  Database schema changes
•  Running full build or E2E tests
Context Rules (AGENTS.md Sync)
•  [CONSTRAINT] DO NOT use AWS Lambda for billing (see ADR-008)
•  [CONSTRAINT] All data access MUST use db/client.ts connection pool
Validation: Must sync with root AGENTS.md; drift detection in CI.
3.3 The AGENTS.md Standard (Cross-Platform)
For non-Copilots (Cursor, Claude Code, etc.), AGENTS.md provides executable constraints .
Required Structure:
AI Agent Constraints
Project Structure Hints
•  Routes: see App.tsx
•  Components: app/components/
•  API client: app/api/client.ts (ALWAYS use this, never fetch directly)
Good vs. Bad Examples
•  ✅ GOOD: Functional components with hooks (see Projects.tsx)
•  ❌ BAD: Class-based components (see legacy Admin.tsx - DO NOT COPY)
Constraint Enforcement
•  [CONSTRAINT] DO NOT use [X] for [Y] (failed [date], see ADR-[N])
•  [CONSTRAINT] Agent may update dependencies but MAY NOT alter DB schema without human override
3.4 The llms.txt Standard (Emerging 2026)
Status: Proposed standard, not universally enforced by crawlers (Google does not use it for search rankings) , but adopted by Anthropic, Vercel, and Hugging Face . Recommendation: Implement as low-effort, high-reward future-proofing .
Location: /llms.txt (root) and /llms-full.txt (comprehensive)
Format :
[Project Name]
[One-line description]
[Project context and overview]
API Overview
•  Endpoint: https://api.example.com/v1
•  Auth: Bearer token
•  Rate limit: 100 req/min
Key Resources
•  Users: /users
•  Payments: /payments
Docs
•  Full API: https://docs.example.com/openapi.json
•  Tutorials: https://docs.example.com/tutorials
Automation: Generate from OpenAPI spec via fern or mintlify .
3.5 Automation Strategy: The "Enforcer"
Agentic PR Reviews:
•  GitHub Copilot Agent can review PRs for documentation compliance before human review
•  Configuration: Block PR merge if copilot-instructions.md or AGENTS.md is violated
Stale-Doc Alerts:
.github/workflows/stale-docs.yml
on:
schedule:
- cron: '0 0 * * 0'  # Weekly
jobs:
stale-check:
steps:
- uses: actions/stale@v9
with:
stale-issue-message: 'Documentation outdated >6 months'
only-labels: 'documentation'
days-before-stale: 180
Doc-as-Code Deployment:
•  Vercel or GitHub Pages with MDX/Next.js
•  Trigger: Redeploy on every merge to main
•  Validation: Build fails if broken links, invalid frontmatter, or RAG chunking violations detected
4.  Operational & Compliance Docs
For production systems and high-stakes environments requiring audit trails .
4.1 Required Documents
Document	Purpose	Compliance
DEVELOPMENT.md	Day-1 setup, Docker, env vars, testing	Onboarding efficiency
TROUBLESHOOTING.md	Common errors, runbook solutions	Operational resilience
NOTICE	Third-party attribution (Apache-2.0 requirement)	License compliance 
/runbooks/	SRE deployment/rollback procedures	EU AI Act Art. 9 (Risk Management) 
/compliance/	SOC2 evidence, audit trails, data maps	SOC2 Type II, ISO 27001 
4.2 Automation Strategy: The "Audit Trail"
Immutable Logs:
•  Export CI/CD logs to tamper-proof storage (AWS S3 with Object Lock, Azure Immutable Storage)
•  Retention: 1-7 years depending on compliance framework (SOC2: 1 year, GDPR: duration of processing + audit period)
Dependency Auditing:
•  Tools: npm audit, Snyk, Trivy for container images
•  Integration: Auto-update SECURITY.md with current vulnerability status
•  SBOM: Generate CycloneDX/SPDX on every release, link in README (SBRI-2026 Section 4.2)
Automated Screenshots:
•  Tool: Playwright or Puppeteer headless browser
•  Trigger: After successful UI build in CI
•  Update: Auto-commit to /docs/assets/screenshots/ and reference in README/tutorials
EU AI Act Compliance Automation :
.github/workflows/ai-act-compliance.yml
jobs:
compliance-check:
steps:
- name: Verify Risk Management Doc
run: test -f docs/compliance/risk-assessment.md
- name: Verify Technical Documentation
run: test -f README.md && test -f AGENTS.md
- name: Check Data Governance
run: test -f docs/compliance/data-governance.md
- name: Validate Human Oversight (AGENTS.md permissions)
run: npx @sbri/validate-agents --human-oversight-required
- name: Generate Compliance Report
run: npx @sbri/ai-act-report --output compliance-report.json
----
5.  Enhanced Summary Matrix (2026 Standards)
Document Category	Update Frequency	Primary Automation	Bimodal Optimization	Compliance Driver
Identity (README)	Every Release	README-AI + human review	YAML frontmatter, 800-1200 token chunks	EU AI Act Art. 11 
API Reference	Every Commit	TypeDoc/Sphinx + OpenAPI lint	Late chunking for cross-references	Technical accuracy
Changelog	Every Merge	Conventional Commits + ai-changelog-generator 	Temporal metadata for version queries	EU AI Act Art. 12 
Architecture (ADR)	Per Decision	Mermaid.js + ADR-cli	Economic impact fields, Chesterton's Fence	Governance
AI Constraints	Per Pattern Change	AGENTS.md lint + drift detection	Constraint tagging ([CONSTRAINT])	EU AI Act Art. 14 
Quality/Linting	Every Push	Vale (prose), Markdownlint, lychee (links)	Header-based chunking validation	Quality gates
Compliance	Quarterly	Automated SBOM, SLSA provenance, audit trails	Immutable documentation versions	SOC2, ISO 27001, EU AI Act
----
6.  Tooling Stack Reference (2026 Validated)
Category	Tool	Version	Purpose	Validation
Doc Generation	DocuWriter.ai	2026.x	AI README generation	Bimodal output 
Changelog	ai-changelog-generator	1.x	AI commit analysis	Conventional commits 
Linting	Vale	3.x	Prose linting (style guide)	Markdown AST
Links	lychee	0.15.x	Broken link detection	Parallel HTTP checks
Diagrams	Mermaid	10.x	Diagrams-as-code	SVG rendering in CI
API Docs	Fern	2026.x	OpenAPI + llms.txt generation	AI-discoverable APIs 
Security	Snyk	2026.x	Vulnerability scanning	SBOM generation
Compliance	sbri-validator	2.x	SBRI-2026 spec validation	Schema + chunking checks
AI Agent	Copilot Agent Mode	2025.x	Agentic PR review	GitHub native 
----
7.  Implementation Roadmap
Phase 1: Foundation (Weeks 1-2)
•  [ ] Implement YAML frontmatter schema in all READMEs
•  [ ] Create copilot-instructions.md for top 5 repositories
•  [ ] Set up Conventional Commits + automated changelog
•  [ ] Configure lychee link checking in CI
•  [ ] Generate initial llms.txt for API repositories
Phase 2: AI Integration (Weeks 3-4)
•  [ ] Deploy AGENTS.md with constraint enforcement
•  [ ] Implement drift detection (AGENTS.md vs. code reality)
•  [ ] Set up RAG chunking validation (800-1200 tokens)
•  [ ] Configure automated SBOM generation
•  [ ] Enable Copilot Agent Mode for doc compliance review
Phase 3: Compliance (Weeks 5-6)
•  [ ] EU AI Act gap assessment (if applicable)
•  [ ] Implement immutable audit trails for CI/CD
•  [ ] Set up quarterly RAG evaluation (Hit Rate >90%)
•  [ ] Validate SLSA Level 3 provenance + verification
•  [ ] Deploy automated compliance reporting
Phase 4: Optimization (Ongoing)
•  [ ] Monthly: AGENTS.md/copilot-instructions.md sync review
•  [ ] Quarterly: Bimodal documentation audit (Grade A/B/C/D/F)
•  [ ] Quarterly: ADR economic impact validation
•  [ ] Annual: Full external compliance audit
----
References & Regulatory Mapping
: 12 Best AI Documentation Tools 2026, DocuWriter.ai
: Automate Repository Tasks with GitHub Agentic Workflows, GitHub Blog (2025)
: Releasing Open Source Documentation, Google Open Source
: What is Diátaxis Framework, I'd Rather Be Writing
: Diátaxis: A Systematic Approach to Technical Documentation, BSSW.io
: How to Write a Great agents.md, GitHub Blog (2025)
: SOC 2 Type II Contract Repository 2026, Sirion
: Emerging AI Tools for Open Access Repositories, Sourcely
: Top 10 CI/CD Pipeline Best Practices 2026, DocuWriter.ai
: EU AI Act 2026 Compliance Requirements, Legal Nodes
: EU AI Act High-Risk System Obligations, Secure Privacy
: AI Changelog Generator, GitHub (entro314-labs)
: What Is LLMs.txt? The Truth About Google Search Rankings 2026, LBN Tech Solutions
: Best llms.txt Platforms January 2026, Fern
: What Is Documentation as Code and Why Do You Need It?, ClickHelp (2026)
: GitHub Copilot Agent Mode Best Practices, LinkedIn (Oct 2025)
: What Is llms.txt? The New Sitemap for AI Search, Mint.ai (2026)
: Improve Your AI Code Output with AGENTS.md, Builder.io (2025)
Regulatory Compliance:
•  EU AI Act Articles 8-15 → Sections 1.1, 3.5, 4.2
•  ISO/IEC 42001 → Sections 3.2, 3.3
•  SOC2 Type II → Sections 4.1, 4.2
•  SBRI-2026 Bimodal Standard → Universal
Authorization:
Office of the Chief Technology Officer (OCTO)
Systems Architecture Review Board (SARB)
February 27, 2026
Next Review: May 27, 2026
