Standards for Bimodal Retrieval Infrastructure
Document Status: Final / Regulatory Compliance
Effective Date: February 27, 2026
Compliance Deadline: August 2, 2026 (EU AI Act High-Risk Systems)
Scope: Universal (All Software Repositories, Services, and Knowledge Bases)
Classification: Internal Technical Standard / Regulatory Mandate
Authority: Office of the Chief Technology Officer (OCTO)
Review Cycle: Quarterly (Q1, Q2, Q3, Q4)
1.  Executive Mandate
1.1 Regulatory Context (2026 Compliance Imperative)
By August 2, 2026, the EU AI Act mandates comprehensive technical documentation, risk management systems, and post-market monitoring for all High-Risk AI Systems . This specification aligns bimodal documentation standards with:
•  EU AI Act Articles 8–15: Risk management, data governance, technical documentation
•  ISO/IEC 42001: AI Management Systems (AIMS) lifecycle governance
•  NIST AI RMF: Govern, Map, Measure, Manage framework integration
Penalties for Non-Compliance: Up to EUR 35 million or 7% of worldwide turnover for prohibited AI practices; 3% for high-risk documentation failures .
1.2 Bimodal Mandate
All repository documentation must simultaneously satisfy:
2.  Human Cognitive Requirements: 30-second Time-to-Value (TTV), scannable hierarchy, progressive disclosure
3.  LLM Structural Requirements: Semantic chunk boundaries (<1000 tokens), machine-readable metadata, self-contained retrieval units
Governance Principle: Documentation is no longer a static artifact; it is a dynamic data source for Retrieval-Augmented Generation (RAG) and autonomous coding agents subject to regulatory audit.
----
2.  Structural Requirements (The Bimodal Standard)
2.1 Technical Frontmatter (YAML Schema v2.0)
Every primary documentation file must begin with a YAML-compliant metadata block. This enables indexing agents to pre-filter content without token-consuming semantic analysis.
Required Schema Fields:
----
Document Identity
doc_id: "SBRI-2026-UNIQUE-ID"
doc_version: "2.0.0"  # Semantic versioning
last_updated: "2026-02-27"
next_review: "2026-05-27"
document_owner: "platform-team@company.com"
Bimodal Classification
ai_readiness_score: 0.92  # 0.0-1.0 based on header-to-token ratio
human_ttv_seconds: 25  # Measured time-to-value
bimodal_grade: "A"  # A-F scale per Appendix A
Technical Context
type: service  # service | library | infrastructure | documentation
language: typescript
framework: hono
runtime: node-20
complexity: medium  # low | medium | high | enterprise
Compliance & Governance
compliance_frameworks:
•  "SOC2-Type-II"
•  "GDPR-Article-32"
•  "ISO-27001"
•  "EU-AI-Act-High-Risk"  # If applicable
risk_classification: "high-risk"  # minimal | limited | high-risk | prohibited
data_governance: "PII-Encrypted"  # PII-Encrypted | Anonymous | Public
AI Retrieval Optimization
rag_optimization:
chunk_strategy: "recursive-headers"
chunk_size: 1000  # Target: 800-1200 tokens
chunk_overlap: 150  # 10-15%
late_chunking: true  # For cross-references
embedding_model: "text-embedding-3-large"
hybrid_search: true  # Keyword + vector
Executable Documentation
executable_status: true  # Runme integration
ci_validation: true  # Blocks release on doc drift
last_executed: "2026-02-27T14:30:00Z"
Maintenance & Quality
maintenance_mode: "active"  # active | deprecated | archived
stale_threshold_days: 90  # Sev2 bug if exceeded
audit_trail: "github-actions"  # Source of validation logs
Validation: Frontmatter must pass yamllint and schema validation in CI. Non-compliance blocks release.
2.2 Semantic Chunking Protocols (SCFU Standard)
To prevent "Contextual Drift" during RAG retrieval, documentation must be structured into Self-Contained Functional Units (SCFUs).
SCFU Requirements:
Parameter	Specification	Rationale
Header Depth	H2 (##) for primary units, H3 (###) for sub-units	Creates semantic boundaries for chunking algorithms 
Token Density	800–1200 tokens per SCFU	Optimal for retrieval precision (88-92% nDCG@10) 
Recursive Context	Contextual Anchor required	Single sentence: "This section describes [X] for [Project Name]"
Self-Containment	No cross-SCFU dependencies	Each unit must make sense in isolation (chunk expansion problem solution) 
Prohibited Patterns:
•  Code blocks split across SCFUs
•  Acronyms defined in one unit, used in another without redefinition
•  "See above/below" references without hyperlinks
2.3 Visual Hierarchy for Bimodal Consumption
Element	Human UX	Machine UX	Compliance
Badges	Trust signals (CI, SLSA, Coverage)	Metadata for filtering	EU AI Act transparency 
Alert Blocks ([!WARNING])	Critical callouts	Priority weighting in retrieval	Risk management documentation 
Mermaid Diagrams	Architecture visualization	Structured graph data	Technical documentation requirement 
Collapsible Sections	Progressive disclosure	Optional context for deep queries	Data minimization (GDPR) 
Task Lists	Roadmap visibility	Structured status for agents	Project tracking evidence
3.  The AGENTS.md Protocol (Normative)
3.1 Purpose & Authority
Traditional ADRs document the past. AGENTS.md governs the future behavior of AI assistants within the repository, serving as executable constraints under ISO/IEC 42001 AI governance requirements .
Location: /AGENTS.md (repository root)
Status: Mandatory for all repositories using AI coding assistants (GitHub Copilot, Cursor, etc.)
Enforcement: Linted against architecture-rules.json in CI pipeline
3.2 Required Sections
3.2.1 Constraint Enforcement (Chesterton's Fence)
All anti-patterns must be explicitly prefixed with [CONSTRAINT]:
[CONSTRAINT] Forbidden Patterns
•  [CONSTRAINT] DO NOT use AWS Lambda for billing-calculation module.
•  Rationale: Attempted Q3 2024, failed due to 15min timeout limits.
•  Economic Impact: Prevented $15k/month overage.
•  Reference: ADR-008
•  [CONSTRAINT] DO NOT introduce Express.js alternatives.
•  Rationale: Hono framework selected for 30% memory reduction (ADR-001).
•  Exception: None without CTO approval.
Compliance Note: Constraints map to EU AI Act Article 10 (Data Governance) and Article 15 (Accuracy/Robustness) requirements for preventing recurring failures .
3.2.2 Agentic Permissions (Autonomy Boundaries)
Explicitly define autonomous action boundaries per ISO 42001 accountability requirements:
Agentic Permissions Matrix
Action	Autonomy Level	Human Override Required	Verification Method
Dependency updates	Full auto	None	CI tests pass
Refactoring (<100 LOC)	Assisted	Code review	SonarQube gates
Database schema changes	Prohibited	Always	Architecture review
API endpoint additions	Assisted	Security review	OpenAPI validation
Configuration changes	Full auto	None	GitOps pipeline
Rationale: EU AI Act Article 14 requires "human-in-command" oversight for high-risk AI systems . This matrix operationalizes that requirement for AI agents.
3.2.3 Validation Schema
AGENTS.md must include a machine-readable validation block:
validation_schema: "agents-md-v1.0"
lint_rules:
•  constraint_prefix_required: true
•  economic_impact_documented: true
•  exception_process_defined: true
•  reference_adr_required: true
automated_checks:
•  architecture_rules_sync: true  # Matches architecture-rules.json
•  constraint_test_coverage: 0.8  # 80% of constraints have tests
review_cycle: "monthly"
owner: "architecture-team"
----
3.3 Drift Detection
Automated Validation: CI pipeline must:
1.  Parse AGENTS.md constraints
2.  Verify all constraints have corresponding tests in /tests/constraints/
3.  Check that no constraint violations exist in codebase (via static analysis)
4.  Validate economic impact references match ADR-E records
Non-Compliance: Drift between AGENTS.md and code reality triggers Severity 2 (Sev2) bug with 48-hour SLA.
----
4.  Verification and Trust Layers
4.1 Executable Integrity (Runme Integration)
Mandate: Static installation instructions are classified as security risks. All repositories must use CNCF Runme (Sandbox project since Jan 2025)  or equivalent executable markdown providers.
Implementation Requirements:
Quick Start (Executable)
npm install

curl http://localhost:8080/health | jq '.status'

Validation Gate:
•  Documentation blocks must execute in CI/CD on every PR
•  If "Quick Start" fails in build environment, documentation marked STALE
•  STALE documentation blocks release pipeline until resolved
CI Configuration (Required):
# .github/workflows/docs-executable.yml
jobs:
  validate-executable-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: stateful/runme-action@v2
        with:
          run-all: true
          fail-on-error: true
          report-format: junit

Compliance: Executable documentation satisfies EU AI Act Article 11 (Technical Documentation) and Article 12 (Logging/Traceability) requirements for reproducibility .
4.2 SLSA Level 3 Provenance & Verification
Mandate: All binaries must include SLSA Level 3 provenance with verification at deployment time .
README.md Requirements:
## Supply Chain Security

### SLSA Level 3 Compliance
| Requirement | Implementation | Verification Command |
|-------------|---------------|---------------------|
| Isolated builds | Ephemeral GitHub Actions runners | See attestation |
| Protected signing | Sigstore/cosign with OIDC | See attestation |
| Provenance | in-toto attestation | See below |

### Verification (Required Before Deployment)

```bash
# Verify artifact provenance
slsa-verifier verify-artifact \
  --provenance-path .github/attestations/intoto.jsonl \
  --source-uri github.com/org/repo \
  --source-tag v1.2.3 \
  --builder-id "https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml"

Failure Mode: Deployment blocked if verification fails. See SLSA Verification Guide docs/security/slsa.md.
SBOM Distribution
•  CycloneDX: sbom.cdx.json sbom.cdx.json - Updated every release
•  SPDX: sbom.spdx.json sbom.spdx.json - Machine-readable format
•  Hash Verification: SHA-256 checksums in release notes

**Critical Note**: Generating provenance without verification provides **zero security benefit**. Verification must occur at deployment time using `slsa-verifier` [^40^][^64^].

---

## 5. Economic Accountability (ADR-E)

### 5.1 ADR-E Format (Architecture Decision Record - Economic)

The ADR-E is the required format for justifying technical shifts under financial governance. All ADRs must include:

**Required Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| **Direct Cost Impact** | Cloud spend delta (OPEX) | "-$240/month compute" |
| **Velocity Gain** | Engineering hours saved | "15 hrs/sprint → 12 hrs/sprint" |
| **Risk-Adjusted ROI** | Break-even with uncertainty | "8 months ± 2 months" |
| **Chesterton's Fence** | Historical failure documentation | "Q3 2024 Lambda attempt failed" |
| **Rollback Cost** | Reversion expense if wrong | "$5k + 2 weeks" |

### 5.2 ADR-E Template

```markdown
## ADR-012: [Title]

**Status**: Proposed | Accepted | Deprecated | Superseded  
**Date**: 2026-02-27  
**Confidence**: High | Medium | Low  
**Economic Owner**: @cfo-proxy  
**Technical Owner**: @tech-lead

### Context
[Forces at play: business, technical, political, temporal]

### Decision
[The choice made]

### Economic Analysis
| Metric | Baseline | Projected | Delta |
|--------|----------|-----------|-------|
| Monthly cloud cost | $2,400 | $2,040 | -$360 |
| Engineering hours/mo | 80 | 64 | -16 |
| Maintenance burden | Medium | Low | Improvement |
| **Risk-adjusted NPV** | - | - | **+$45k over 3yr** |

### Chesterton's Fence
[Explicit "Why this exists" to prevent AI "optimizations" that ignore history]

> ⚠️ **Historical Guardrail**: DO NOT use [X] for [Y] because [specific failure 
> event]. Attempted [DATE], resulted in [measurable negative outcome].

### Complexity Analysis
- **Cognitive Load**: O(n) where n = microservice count
- **Training Required**: 2 days per engineer
- **Architectural Coupling**: Low (bounded context maintained)

### Validation Criteria
- [ ] Cost reduction verified in production (30 days)
- [ ] Performance metrics meet SLO (99.99% availability)
- [ ] Team velocity improvement measured (2 sprints)
- [ ] Rollback procedure tested

### References
- Supersedes: ADR-003 (if applicable)
- Related: ADR-008 (contextual dependency)

5.3 Governance Integration
ADR-Es must be:
•  Version-controlled in /docs/adr/ with immutable history
•  Reviewed quarterly by Architecture Review Board (ARB)
•  Referenced in AGENTS.md for AI agent constraint validation
•  Audited annually for economic accuracy (actual vs. projected)
----
6. Maintenance, Monitoring & Compliance
6.1 Quarterly RAG Evaluation (Mandatory)
Per enterprise RAG best practices , knowledge managers must perform Synthetic Query Testing to ensure README is correctly retrieved by corporate LLM.
Evaluation Metrics (Required):
Metric	Target	Measurement Method	Frequency
Hit Rate@5	>90%	Proportion of queries with relevant doc in top-5	Quarterly
Precision@5	>85%	Relevant docs / total docs in top-5	Quarterly
MRR	>0.85	Mean Reciprocal Rank of first relevant doc	Quarterly
nDCG@5	>0.88	Normalized Discounted Cumulative Gain	Quarterly
Answer Faithfulness	>90%	LLM-as-judge scoring	Monthly
User Satisfaction	>4.0/5	Thumbs up/down signals	Continuous
Procedure:
1.  Generate 50 synthetic queries from actual support tickets
2.  Execute retrieval against vector database
3.  Score using RAGAS or ARES framework 
4.  Log failures as documentation bugs with rag-quality label
5.  Review trends in quarterly knowledge management review
6.2 Decentralized Updates & Drift Detection
Severity Classification:
•  Sev1 (Critical): Security-related doc drift (4-hour SLA)
•  Sev2 (High): Functional documentation drift (48-hour SLA)
•  Sev3 (Medium): Outdated examples, broken links (1-week SLA)
Automation Requirements:
•  Daily: Link checker, code block syntax validation
•  Weekly: AGENTS.md constraint drift detection
•  Monthly: Full RAG evaluation suite
•  Quarterly: Economic impact validation against ADR-E projections
6.3 EU AI Act Compliance Checklist (August 2026 Deadline)
For High-Risk AI Systems :
Requirement	Documentation Evidence	Owner	Due Date
Risk Management System (Article 9)	`/docs/risk-assessment.md`	Risk Team	2026-07-01
Data Governance (Article 10)	`/docs/data-governance.md` + DMP	Data Team	2026-07-01
Technical Documentation (Article 11)	README + ADRs + AGENTS.md	Tech Lead	2026-07-15
Record-Keeping (Article 12)	Automated logging in `/logs/`	Platform	Continuous
Transparency (Article 13)	`README.md` + User-facing docs	Product	2026-07-15
Human Oversight (Article 14)	`AGENTS.md` permission matrix	Compliance	2026-07-01
Accuracy/Robustness (Article 15)	Test results in `/tests/`	QA	2026-07-15
Conformity Assessment	Third-party audit report	Compliance	2026-07-30
CE Marking	Badge in README	Compliance	2026-08-01
EU Database Registration	Registration confirmation	Legal	2026-08-01
Non-Compliance Penalty: Up to EUR 35 million or 7% global turnover .
----
7. Audit & Governance Framework
7.1 Internal Audit Checklist (Quarterly)
Documentation Audit :
•  [ ] All READMEs have valid YAML frontmatter (schema compliance)
•  [ ] AGENTS.md constraints match architecture-rules.json (drift check)
•  [ ] ADR-E economic impacts documented and reviewed
•  [ ] SLSA Level 3 provenance verification passing in CI
•  [ ] Executable documentation blocks all passing (Runme)
•  [ ] SBOMs generated and linked (CycloneDX/SPDX)
•  [ ] RAG evaluation metrics meeting targets (Hit Rate >90%)
•  [ ] EU AI Act compliance evidence collected (if high-risk)
•  [ ] Stale documentation flagged and remediated (<90 days)
•  [ ] Third-party dependencies documented with risk tiers
7.2 Governance Roles & Responsibilities
Role	Responsibility	Accountability
CTO / OCTO	Overall standard enforcement, exception approval	Regulatory compliance
Systems Architecture Review Board (SARB)	ADR-E review, AGENTS.md validation	Technical consistency
Knowledge Management Team	RAG evaluation, chunking optimization	Retrieval quality
Security & Compliance	SLSA verification, EU AI Act readiness	Audit readiness
Platform Engineering	CI/CD integration, Runme maintenance	Automation reliability
Document Owners	Content accuracy, timeliness updates	Drift remediation
7.3 Exception Process
Exception Criteria: Only for legacy systems with retirement plans (<6 months) or external vendor constraints.
Process:
1.  Submit exception request to SARB with risk assessment
2.  CTO approval required for >30-day exceptions
3.  Exception logged in /docs/exceptions/ with expiration date
4.  Automated monitoring for exception expiration (30-day warning)
----
8. Appendices
Appendix A: Bimodal Grading Rubric
Grade	Criteria	Action
A	AI readiness >0.9, TTV <30s, all compliance met	Exemplary, promote as standard
B	AI readiness >0.8, TTV <60s, minor gaps	Acceptable, address gaps in next sprint
C	AI readiness >0.7, TTV <2min, missing metadata	Requires improvement plan
D	AI readiness <0.7, TTV >2min, no frontmatter	Block release until remediated
F	No executable docs, no ADRs, stale >90 days	Critical violation, Sev2 bug
Appendix B: RAG Chunking Decision Matrix
Content Type	Chunk Strategy	Size	Overlap	Late Chunking
API documentation	Header-based	1000	150	No
Architecture decisions	Semantic	800	100	Yes
Runbook procedures	Fixed-size	600	50	No
Legal/compliance	Late chunking	1200	200	Yes
Troubleshooting guides	Header-based	800	100	No
Appendix C: Tooling Requirements
Category	Tool	Purpose	Validation
Executable Docs	Runme (CNCF)	Markdown execution	CI integration
SLSA Verification	slsa-verifier	Provenance validation	Deployment gate
SBOM Generation	CycloneDX / SPDX	Supply chain transparency	Release artifact
RAG Evaluation	RAGAS / ARES	Retrieval quality metrics	Quarterly audit
Schema Validation	yamllint + jsonschema	Frontmatter compliance	CI check
Drift Detection	custom linter	AGENTS.md sync	Daily check
----
9. References & Regulatory Mapping
: 7 Best Practices for RAG Implementation, ChatRAG.ai (2026)
: Runme CNCF Sandbox Project, Cloud Native Computing Foundation (2025)
: AGENTS.md is the New ADR, Medium (2026)
: SLSA Framework Guide 2026, Practical DevSecOps
: Chunk Expansion Problem, LlamaIndex (2025)
: Late Chunking with Jina Embeddings, Jina AI (2025)
: Enterprise Knowledge Retrieval Framework, arXiv (2025)
: SLSA Provenance Verification, SLSA.dev Spec v1.0
: RAG Evaluation Metrics for Enterprise AI, LabelYourData (2025)
: slsa-verifier GitHub Repository, SLSA Framework (2025)
: EU AI Act 2026 Compliance Requirements, Legal Nodes (2026)
: EU AI Act High-Risk System Obligations, Secure Privacy (2026)
: Security, Risk, and AI Governance Frameworks 2026, CyberSaint
: EU AI Act Enforcement Timeline, Pearl Cohen (2025)
: Compliance Audit Checklist, Hyperproof (2026)
: ISO 27001 Documentation Checklist, ISMS.online (2025)
: AI Compliance Standards 2026, Wiz Academy
Regulatory Mapping:
•  EU AI Act Articles 8-15 → Sections 4.2, 5, 6.3
•  ISO/IEC 42001 → Sections 3, 6.1, 7
•  NIST AI RMF → Sections 2.1, 3, 5
•  SOC2 Type II → Sections 2.1, 4.2, 6.2
----
Governance Checklist (Immediate Action Required)
Phase 1: Foundation (Weeks 1-2)
•  [ ] Inventory all repositories against SBRI-2026
•  [ ] Implement YAML frontmatter schema in CI
•  [ ] Create AGENTS.md templates for all active services
•  [ ] Integrate Runme executable documentation
•  [ ] Set up SLSA Level 3 provenance generation
Phase 2: Compliance (Weeks 3-4)
•  [ ] Complete EU AI Act gap assessment (if high-risk AI)
•  [ ] Implement RAG evaluation pipeline (quarterly)
•  [ ] Create ADR-E template and backfill economic data
•  [ ] Set up automated drift detection (AGENTS.md vs. code)
•  [ ] Configure SBOM generation in CI/CD
Phase 3: Validation (Weeks 5-6)
•  [ ] Conduct first quarterly RAG evaluation
•  [ ] Perform internal audit against Appendix A rubric
•  [ ] Validate SLSA verification at deployment (all services)
•  [ ] Test exception process end-to-end
•  [ ] Brief Architecture Review Board on new standards
Phase 4: Continuous (Ongoing)
•  [ ] Monthly: AGENTS.md drift detection reports
•  [ ] Quarterly: RAG evaluation and bimodal grading
•  [ ] Quarterly: ADR-E economic impact review
•  [ ] Annual: Full compliance audit (external)
•  [ ] Continuous: Documentation freshness monitoring
----
Authorization:
Office of the Chief Technology Officer (OCTO)
Systems Architecture Review Board (SARB)
February 27, 2026
Next Review: May 27, 2026 (Q2 2026)
Document Owner: Chief Architect
Technical Lead: Principal Knowledge Engineer
Compliance Officer: AI Governance Lead

