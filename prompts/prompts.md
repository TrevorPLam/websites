Below is a **CTO-grade Windsurf Cascade Prompt Suite** built specifically for your:

> **marketing-websites-monorepo**
> Multi-tenant | 1000+ clients | FSD v2.1 | Supabase | MCP | Agent Framework | Enterprise Security

This suite is **much more advanced** than the one for The Barber Cave because:

* Multi-tenant isolation risk is extremely high
* FSD architectural drift is dangerous at scale
* MCP + Agent framework introduces AI governance risk
* Supabase RLS misconfiguration can be catastrophic
* 60+ packages means structural entropy risk

This suite is organized into 12 audit domains.

---

# 🧠 HOW TO USE THIS SUITE

For all structural changes:

1. PLAN mode first
2. Review risk matrix
3. Approve execution
4. Run Security Audit
5. Run Tenant Isolation Audit
6. Run Performance Audit
7. Run Contract Test Audit

This is enterprise protocol.

---

# 1️⃣ MONOREPO ARCHITECTURE INTEGRITY

---

## 1.1 FSD v2.1 Compliance Audit

```
MODE: PLAN

Audit Feature-Sliced Design v2.1 compliance across the entire monorepo.

Check:
- Layer violations (entities importing features)
- Improper cross-slice dependencies
- @x import misuse
- Shared layer overuse
- Feature bleeding into UI layer
- Infrastructure leaking into feature layer
- Circular dependencies across packages
- Slice cohesion integrity

Deliver:
1. Violations grouped by severity
2. Dependency graph anomalies
3. Architectural drift score (1-10)
4. Refactor plan prioritized by risk
5. Suggested Steiger rule additions
```

---

## 1.2 Monorepo Package Boundary Audit

```
MODE: PLAN

Audit package boundaries across 60+ packages.

Evaluate:
- Duplicate responsibilities
- Cross-package dependency bloat
- Hidden shared state
- Infra leakage into UI packages
- Config schema duplication
- Violations of single responsibility

Deliver:
- Boundary violations
- Overlapping packages
- Consolidation candidates
- Risk ranking
```

---

# 2️⃣ MULTI-TENANT ISOLATION AUDITS (CRITICAL)

---

## 2.1 Tenant Isolation Integrity Audit

```
MODE: PLAN

Perform deep multi-tenant isolation audit.

Check:
- RLS enforcement completeness
- Missing tenant filters in queries
- Supabase service role misuse
- AsyncLocalStorage tenant propagation leaks
- Cache key tenant collisions
- Rate limiting tenant enforcement
- API route tenant resolution correctness

Deliver:
- Isolation gaps
- Severity classification (critical/high/medium)
- Exploit scenario simulation
- Patch recommendations
```

---

## 2.2 Cross-Tenant Data Leak Simulation

```
MODE: PLAN

Simulate cross-tenant attack scenarios.

Evaluate:
- Shared analytics leakage
- Search query bleed
- Edge caching tenant contamination
- Session fixation risks
- Auth boundary weaknesses
- Webhook routing contamination

Deliver:
- Attack vectors
- Risk probability
- Hardening recommendations
```

---

# 3️⃣ SUPABASE + DATABASE AUDITS

---

## 3.1 RLS Policy Audit

```
MODE: PLAN

Audit Supabase RLS policies.

Check:
- Default deny posture
- Policy bypass scenarios
- Function execution context leakage
- Admin override misuse
- Missing row ownership checks

Deliver:
- Policy gaps
- Risk level
- Recommended SQL patches
```

---

## 3.2 Migration Safety Audit

```
MODE: PLAN

Audit database migrations for:

- Destructive changes
- Backward compatibility
- Tenant-safe schema evolution
- Index efficiency
- Locking risks at scale

Deliver:
- Migration safety score
- Production deployment risk
```

---

# 4️⃣ SECURITY & COMPLIANCE SUITE

---

## 4.1 Enterprise Security Audit

```
MODE: PLAN

Conduct enterprise security audit.

Evaluate:
- OAuth 2.1 correctness
- PKCE enforcement
- Token refresh handling
- Rate limiting robustness
- Secrets exposure risk
- CSP violations
- Edge middleware bypass risks
- Post-quantum abstraction correctness

Deliver:
- Vulnerability list
- CVSS-style severity ranking
- Immediate fixes
- Long-term hardening roadmap
```

---

## 4.2 Agent Framework Security Audit

```
MODE: PLAN

Audit agent-core, governance, memory, and orchestration layers.

Check:
- Tool contract enforcement
- Privilege escalation paths
- Memory poisoning risk
- Cross-agent data leakage
- Prompt injection attack surface
- Skill isolation enforcement
- MCP server exposure risks

Deliver:
- Agent risk score
- Injection vulnerabilities
- Governance bypass risks
- Recommended safeguards
```

---

# 5️⃣ MCP WORKSPACE AUDIT

---

## 5.1 MCP Server Hardening Review

```
MODE: PLAN

Audit all 15+ MCP servers.

Evaluate:
- Authentication enforcement
- Rate limiting
- Tenant boundary enforcement
- External API exposure
- Tool misuse risk
- Logging completeness
- Observability coverage

Deliver:
- Server risk matrix
- Hardening checklist
- Zero-trust compliance status
```

---

## 5.2 MCP Orchestration Stability Audit

```
MODE: PLAN

Audit parallel orchestration and load balancing logic.

Check:
- Deadlock risks
- Race conditions
- Retry storm risk
- Memory growth risk
- Failure cascade potential

Deliver:
- Stability risk score
- Concurrency improvements
```

---

# 6️⃣ PERFORMANCE AT SCALE (1000+ CLIENTS)

---

## 6.1 Multi-Tenant Performance Simulation

```
MODE: PLAN

Simulate 1000+ tenant performance behavior.

Evaluate:
- Edge function scaling
- Cache key explosion
- Database connection pool limits
- Cold start frequency
- Turbo build scaling
- Analytics ingestion stress

Deliver:
- Bottleneck projections
- Scaling risk areas
- Optimization roadmap
```

---

## 6.2 Core Web Vitals Enforcement Audit

```
MODE: PLAN

Audit CWV targets across apps.

Check:
- PPR misuse
- Client component overuse
- Hydration mismatch risk
- Dynamic import inefficiency
- React Compiler misalignment
- Bundle budgets compliance

Deliver:
- CWV risk ranking
- Bundle weight offenders
- Refactor candidates
```

---

# 7️⃣ AI + RAG + DOCUMENTATION INTEGRITY

---

## 7.1 Documentation Drift Audit

```
MODE: PLAN

Audit 300+ documentation files for drift.

Check:
- Outdated architecture claims
- Version mismatches
- Dead guides
- Broken cross-links
- Duplicate standards
- Inconsistent compliance claims

Deliver:
- Drift percentage estimate
- High-risk outdated docs
- Cleanup roadmap
```

---

## 7.2 AI Readiness Audit

```
MODE: PLAN

Audit AI-readiness claims.

Evaluate:
- Semantic chunking correctness
- AGENTS.md consistency
- RAG retrieval signal quality
- Context window optimization
- Tool contract clarity
- Cold-start checklist completeness

Deliver:
- AI readiness score
- Optimization recommendations
```

---

# 8️⃣ TESTING SYSTEM VALIDATION

---

## 8.1 100% Coverage Integrity Audit

```
MODE: PLAN

Audit test suite for true coverage integrity.

Check:
- Meaningless tests
- Snapshot abuse
- Missing failure path testing
- Contract testing completeness
- Tenant isolation test coverage
- E2E multi-tenant scenarios
- Security regression coverage

Deliver:
- Real coverage score
- Illusionary coverage areas
- Critical missing tests
```

---

# 9️⃣ ENTERPRISE RISK MATRIX

---

## 9.1 Executive Risk Assessment

```
MODE: PLAN

Conduct enterprise-level executive audit.

Evaluate:
- Architecture maturity
- Security maturity
- Scalability readiness
- Tenant isolation confidence
- AI governance robustness
- Compliance posture
- Operational resilience

Deliver:
1. Executive summary
2. Risk matrix (critical/high/medium/low)
3. Overall enterprise readiness score
4. 90-day stabilization plan
5. Catastrophic risk areas
```

---

# 🔟 FULL SYSTEM MASTER AUDIT (QUARTERLY)

---

## 10.1 Enterprise Nuclear Audit

This is your “board-level” audit.

```
MODE: PLAN

Perform full-system audit of marketing-websites-monorepo.

Context:
- 1000+ tenant scale target
- FSD v2.1 enforced
- Supabase RLS
- OAuth 2.1
- MCP 15+ servers
- Agent orchestration framework
- 60+ packages
- AI-optimized documentation

Evaluate:
- FSD compliance
- Multi-tenant isolation
- RLS enforcement
- Security architecture
- AI governance risk
- MCP server risk
- Scalability
- Performance
- Test integrity
- Documentation drift
- Package boundary entropy
- Long-term maintainability

Deliver:
1. Executive report
2. Risk heatmap
3. Isolation confidence score
4. Security score
5. Scalability score
6. AI governance score
7. Top 10 critical vulnerabilities
8. Architectural debt score
9. Immediate stabilization actions
10. 180-day strategic roadmap

Do NOT modify code.
```

---

# 🧠 IMPORTANT: ENTERPRISE NON-REGRESSION CLAUSE

For any change in this repo, add:

```
This change must NOT:
- Break tenant isolation
- Introduce cross-slice dependency violations
- Increase bundle size beyond budget
- Reduce Core Web Vitals compliance
- Reduce security posture
- Reduce test coverage
- Introduce agent privilege escalation paths
```

This dramatically improves Cascade behavior.

---

# 🔥 What You’ve Built

Compared to The Barber Cave, this repo is:

* 100x more complex
* Multi-dimensional risk surface
* AI-governed
* Tenant-sensitive
* Security critical

Prompt quality here is existential.

---

If you'd like next, I can:

* Build a **Prompt Governance System** for this monorepo
* Create a **Crisis Response Prompt Kit** (for production incidents)
* Design a **Tenant Isolation Red Team Simulation Suite**
* Or construct a **Board-Level Audit Reporting Template**

Which direction do you want to take this?
