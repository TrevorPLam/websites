**AI-Native SaaS Platform: Executable Task Checklist**
*Target: 1,124 Files | 1,000+ Tenants | Sub-100ms Loads*

---

## 🎯 PHASE MCP: Perfecting MCP + Skills System
*Complete prioritized game plan based on verified repository findings and 2026 enterprise best practices*

### PHASE 0 — EMERGENCY TRIAGE (Day 1, ~2 hours)
*Fix the three blockers that make everything else non-functional*

- [x] **0-A: Fix All Path Mismatches**
  - **Priority**: 🔴 Critical
  - **Effort**: 1 hour
  - **Issue**: Files reference `.mcp/config.json` which doesn't exist (should be `mcp/config/config.json`)
  - **Files to Update**:
    - [ ] `AGENTS.md` — Phase 1 Cold Start section, MCP Server Configurations section (`.mcp/` → `mcp/config/`)
    - [ ] `CLAUDE.md` — All `.mcp/` references → `mcp/config/`
    - [ ] `.cursorrules` — MCP config path fix
    - [ ] `.windsurfrules` — MCP config path fix
  - **Also Fix Skills Path**:
    - [ ] Every reference to `.claude/skills/` → `skills/` in all files above

- [x] **0-B: Fix CI Workflow Path Triggers**
  - **Priority**: 🔴 Critical
  - **Effort**: 30 min
  - **Issue**: CI never fires because `on.push.paths` filters don't match actual file locations
  - **Files**:
    - [ ] `.github/workflows/mcp-skills-validation.yml`
  - **Changes**:
    - [ ] Update `on.push.paths`:
      - `'skills/**'` (was: `.claude/skills/**`)
      - `'mcp/config/**'` (was: `.mcp/**`)
      - `'mcp/servers/**'` (was: `packages/mcp-servers/**`)
    - [ ] Update job steps: `jq empty .mcp/config.json` → `jq empty mcp/config/config.json`
    - [ ] Update job steps: `.claude/skills/*/SKILL.md` → `skills/*/SKILL.md`

- [x] **0-C: Fix MCP App Build Failure**
  - **Priority**: 🔴 Critical
  - **Effort**: 30 min
  - **Issue**: `mcp/apps/src/index.ts` imports `@repo/mcp-servers` which doesn't exist
  - **Files**:
    - [ ] `mcp/apps/src/index.ts`
  - **Subtasks**:
    - [ ] **Option B (Recommended)**: Create `packages/mcp-servers/` as real workspace package
      - [ ] `packages/mcp-servers/package.json` (name: `@repo/mcp-servers`)
      - [ ] `packages/mcp-servers/src/index.ts` (export shared types)
      - [ ] Add to `pnpm-workspace.yaml`
    - [ ] **Alternative Option A**: Remove import and inline types (temporary fix)
  - **Validation**:
    - [ ] `mcp/apps` builds without error
    - [ ] Type imports resolve correctly

---

### PHASE 1 — STRUCTURAL INTEGRITY (Days 2–4, ~8 hours)
*Make the existing system actually work end-to-end*

- [x] **1-A: Register agents/* in pnpm workspace**
  - **Priority**: 🔴 Critical
  - **Effort**: 1 hour
  - **Issue**: 5 agent packages are invisible to Turborepo
  - **Files**:
    - [ ] `pnpm-workspace.yaml` (add `'agents/*'` and `'mcp/servers'`)
  - **Commands**:
    ```bash
    pnpm install # wire dependency graph
    ```
  - **Validation**:
    - [ ] `agents/*` packages recognized in dependency graph
    - [ ] Cross-package imports resolve (`@repo/agent-core` etc.)

- [x] **1-B: Fix enterprise-security Name Mismatch**
  - **Priority**: 🔴 Critical
  - **Effort**: 30 min
  - **Issue**: `deploy-production` skill invokes `enterprise-security` but config registers it as `enterprise-security-gateway`
  - **Files**:
    - [ ] `mcp/config/config.production.json` (standardize key name)
    - [ ] `mcp/servers/src/enterprise-security-gateway.ts` (standardize MCP name declaration)
    - [ ] All `SKILL.md` files referencing this server
  - **Standard**: Use `enterprise-security-gateway` as canonical name

- [x] **1-C: Add Redis Fallback to enterprise-auth-gateway**
  - **Priority**: 🔴 High
  - **Effort**: 1 hour
  - **Issue**: Crashes on startup if `REDIS_URL` not set
  - **Files**:
    - [ ] `mcp/servers/src/enterprise-auth-gateway.ts`
    - [ ] `mcp/config/config.json` (make `REDIS_URL` optional in env block)
  - **Implementation**:
    - [ ] Add in-memory fallback using Map-based store
    - [ ] Add error handler: `store.on('error', ...)` with fallback warning
  - **Validation**:
    - [ ] Server starts without `REDIS_URL`
    - [ ] Logs show fallback warning
    - [ ] Functions with Redis when available

- [x] **1-D: Fix SKILLS_PATH Resolution**
  - **Priority**: 🔴 High
  - **Effort**: 30 min
  - **Issue**: Relative path breaks when server launches from non-root directory
  - **Files**:
    - [ ] `mcp/servers/src/skillset-server.ts`
    - [ ] `mcp/config/config.json` (update env block)
  - **Changes**:
    - [ ] Use `path.resolve(process.cwd(), 'skills')` as default
    - [ ] Support absolute path via `process.env.SKILLS_PATH`
    - [ ] Update config: `"SKILLS_PATH": "${REPO_PATH:-$(pwd)}/skills"`

- [ ] **1-E: Register Missing MCP Tools for Broken Skills**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Issues**:
    - `secure-deployment` skill invokes `secure-deployment` (not registered)
    - Marketing skills invoke non-existent tools (`analytics`, `content-management`, `seo-tools`, `campaign-automation`)
  - **Files**:
    - [ ] `mcp/config/config.json` (register missing tools)
    - [ ] `mcp/servers/src/marketing-analytics.ts` (new - wraps fetch)
    - [ ] `mcp/servers/src/content-management.ts` (new - wraps github)
    - [ ] `mcp/servers/src/seo-tools.ts` (new - wraps fetch)
    - [ ] `mcp/servers/src/campaign-automation.ts` (new - wraps fetch)
  - **Subtasks**:
    - [ ] Option B (Recommended): Rewrite marketing SKILL.md to use existing servers (filesystem + fetch)
    - [ ] OR Option A: Stub as lightweight MCP servers using existing patterns
    - [ ] Ensure `secure-deployment` maps to `secure-deployment-manager.ts` or update skill name

- [ ] **1-F: Remove or Integrate index.ts Dead Code**
  - **Priority**: 🟡 Medium
  - **Effort**: 30 min
  - **Issue**: `mcp/servers/src/index.ts` contains duplicate unused classes
  - **Files**:
    - [ ] `mcp/servers/src/index.ts`
  - **Action**:
    - [ ] If unique logic exists → extract to appropriate dedicated server files
    - [ ] If true duplicates → delete `index.ts`
  - **Validation**:
    - [ ] No dead code remaining
    - [ ] All existing imports still resolve

- [x] **1-G: Fix agents/core Package Name**
  - **Priority**: 🔴 Critical
  - **Effort**: 30 min
  - **Issue**: `agents/core/src/index.ts` declares `@repo/context-engineering` but docs use `@repo/agent-core`
  - **Files**:
    - [ ] `agents/core/package.json` (update name field)
    - [ ] OR update all documentation and imports to use `@repo/context-engineering`
  - **Validation**:
    - [ ] Single canonical name used everywhere
    - [ ] Imports resolve without alias confusion

---

### PHASE 2 — HARDEN THE AGENT LAYER (Days 5–7, ~10 hours)
*Elevate stubs to production-grade implementations*

- [x] **2-A: Replace Math.random() Stubs in advanced-agent-plugins**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Files**:
    - [ ] `agents/plugins/src/index.ts` (or relevant plugin file)
  - **Changes**:
    - [ ] Replace `generatePluginMetrics()` random data with real system data:
      - `process.memoryUsage().heapUsed`
      - `os.loadavg()[0]`
      - `os.cpus().length`
      - Actual connection pool size
    - [ ] Replace `security_audit` setTimeout with real audit runner (ESLint security, npm audit, or static analysis)
  - **Validation**:
    - [ ] Metrics reflect actual system state
    - [ ] Audit results are deterministic

- [x] **2-B: Load policy/ai-agent-policy.yaml in PolicyEngine**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Issue**: `loadDefaultPolicies()` ignores YAML file, uses hardcoded rules only
  - **Files**:
    - [ ] `agents/governance/src/index.ts`
  - **Implementation**:
    - [ ] Add `readFileSync` and `parseYaml` imports
    - [ ] Load `policy/ai-agent-policy.yaml` first
    - [ ] Parse YAML rules and validate with `PolicySchema`
    - [ ] Apply hardcoded defaults as fallback only
  - **Validation**:
    - [ ] YAML changes reflect in policy engine without code deploy
    - [ ] Invalid YAML throws schema validation error

- [ ] **2-C: Fix SecurityAgent Threat Detection**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Issue**: Keyword-match approach produces false positives; two methods are stubs
  - **Files**:
    - [ ] `agents/security/src/index.ts` (or relevant security agent)
  - **Implementation**:
    - [ ] Replace `JSON.stringify(context).toLowerCase().includes()` with structured field targeting:
      - `checkDataExfiltration(outputDestinations, dataClassifications)`
      - `checkPromptInjection(userInputs)`
      - `checkToolPoisoning(requestedTools, approvedToolRegistry)`
      - `checkAnomalousBehavior(recentActions, baselineProfile)`
    - [ ] Implement `analyzeToolSwitching()` - compare tool sequence against known-good patterns
    - [ ] Implement `analyzeFailures()` - count recent failure rate and threshold-alert
  - **Validation**:
    - [ ] Targeted checks reduce false positives
    - [ ] Tool switching detection catches anomalous sequences
    - [ ] Failure rate alerting triggers correctly

- [x] **2-D: Implement agents/memory**
  - **Priority**: 🔴 High
  - **Effort**: 3 hours
  - **Issue**: `agents/memory/src/index.ts` is types-only, no logic
  - **Files**:
    - [ ] `agents/memory/src/index.ts`
    - [ ] `agents/memory/src/EnterpriseMemorySystem.ts`
  - **Implementation**:
    - [ ] Implement `store(entry)` with content-addressed ID (hash of content)
    - [ ] Implement `retrieve(query, limit)` with scoring algorithm:
      - Priority-based: recency × confidence × relevance
    - [ ] Use existing types (confidence scoring, priority, vector embeddings interface)
  - **Validation**:
    - [ ] Store returns consistent ID for duplicate content
    - [ ] Retrieve returns top-N most relevant entries
    - [ ] Vector embeddings interface functional (if implemented)

- [x] **2-E: Wire agents/orchestration to Other Agent Packages**
  - **Priority**: 🔴 High
  - **Effort**: 1 hour
  - **Issue**: `agents/orchestration/src/index.ts` has zero imports from other `agents/*` packages
  - **Files**:
    - [ ] `agents/orchestration/src/index.ts`
  - **Implementation**:
    - [ ] Import `EnterpriseMemorySystem` from `@repo/agent-memory`
    - [ ] Import `ToolContractRegistry` from `@repo/agent-tools`
    - [ ] Import `PolicyEngine` from `@repo/agent-governance`
    - [ ] Import `AgentContext` from `@repo/agent-core`
    - [ ] Implement `MultiAgentOrchestrator` class with constructor injection
    - [ ] Implement `orchestrate(plan)` method:
      - [ ] Call `this.policy.validate(plan)`
      - [ ] Call `this.memory.retrieve(plan.intent)`
      - [ ] Call `this.executeAssignments(assignments, context)`
  - **Validation**:
    - [ ] Governance checks run before execution
    - [ ] Memory context injected into assignments
    - [ ] End-to-end agent loop completes

---

### PHASE 3 — GATEWAY + OBSERVABILITY (Days 8–10, ~8 hours)
*Implement enterprise-grade control plane*

- [ ] **3-A: Implement MCP Gateway Pattern**
  - **Priority**: 🟡 High
  - **Effort**: 3 hours
  - **Issue**: `enterprise-security-gateway.ts` does auth but not unified traffic routing
  - **Files**:
    - [ ] `mcp/gateway/src/index.ts` (new)
    - [ ] `mcp/config/config.json` (register gateway)
  - **Implementation**:
    - [ ] Create `MCPGateway` class with `routeRequest(req)` method
    - [ ] Implement OpenTelemetry tracing spans with attributes:
      - `mcp.server`, `mcp.tool`, `mcp.correlation_id`, `tenant.id`
    - [ ] Implement middleware pipeline:
      1. [ ] Auth validation
      2. [ ] Rate limit check
      3. [ ] Policy enforcement
      4. [ ] Route to target server
      5. [ ] Audit logging
  - **Validation**:
    - [ ] All MCP traffic routes through gateway
    - [ ] Spans visible in tracing dashboard
    - [ ] Failed auth rejected before reaching target server

- [x] **3-B: Add Correlation IDs Across All Servers**
  - **Priority**: 🟡 High
  - **Effort**: 2 hours
  - **Files**:
    - [ ] `mcp/servers/src/shared/middleware.ts` (new)
    - [ ] All server files in `mcp/servers/src/`
  - **Implementation**:
    - [ ] Create `withCorrelation(handler)` wrapper
    - [ ] Generate `crypto.randomUUID()` if `_correlationId` not present in params
    - [ ] Log `tool_call_start` and `tool_call_end` with correlation ID and duration
    - [ ] Return `_correlationId` in response for chaining
    - [ ] Apply wrapper to all tool handlers
  - **Validation**:
    - [ ] Chain of 3+ tool calls carries same correlation ID
    - [ ] Logs queryable by correlation ID
    - [ ] Duration metrics accurate

- [ ] **3-C: Add Human Approval Gates for High-Impact Tools**
  - **Priority**: 🟡 High
  - **Effort**: 2 hours
  - **Scope**: Write operations (deploy, delete, schema changes)
  - **Files**:
    - [ ] `mcp/servers/src/secure-deployment-manager.ts`
    - [ ] `mcp/gateway/src/approval-gate.ts` (new)
  - **Implementation**:
    - [ ] Check `action.riskLevel === 'HIGH'`
    - [ ] Call `this.approvalGate.request()` with timeout (5 min)
    - [ ] Throw error if approval rejected or timeout
    - [ ] Add audit log entry for approval/rejection
  - **Validation**:
    - [ ] High-risk actions pause for approval
    - [ ] Timeout handling works (fails safe)
    - [ ] Audit trail records approver identity

- [x] **3-D: Fix .cursorrules Multi-Agent Gap**
  - **Priority**: 🟡 Medium
  - **Effort**: 30 min
  - **Issue**: `.cursorrules` lacks multi-agent instructions present in `.windsurfrules`
  - **Files**:
    - [ ] `.cursorrules`
  - **Add Section**:
    ```markdown
    ## Multi-Agent Orchestration (MANDATORY)
    - Coordinate with other agents via A2A Protocol (JSON-RPC + SSE)
    - Load MCP server config from `mcp/config/config.json`
    - Every agent action requires a correlation ID
    - High-risk actions (deploy, schema change) require approval gate
    - Use @repo/agent-core for context management
    ```
  - **Validation**:
    - [ ] AI agents follow multi-agent protocols
    - [ ] Correlation IDs present in generated code

---

### PHASE 4 — SKILLS ARCHITECTURE UPGRADE (Days 11–14, ~8 hours)
*Implement progressive disclosure + composable skills*

- [ ] **4-A: Implement Three-Tier Progressive Disclosure**
  - **Priority**: 🟡 Medium
  - **Effort**: 4 hours
  - **Issue**: Skills load everything at once, high token cost
  - **Restructure Each Skill Folder**:
    ```
    skills/
      domain/
        deploy-production/
          SKILL.md           # Tier 1: name + 50-word description ONLY
          instructions/
            full.md          # Tier 2: loaded on demand
          scripts/           # Tier 3: executables
          references/        # Tier 3: supporting docs
    ```
  - **Files to Update**:
    - [ ] All existing `SKILL.md` files (move detailed content to `instructions/full.md`)
    - [ ] Create `skills/[skill]/instructions/` directories
    - [ ] Create `skills/[skill]/scripts/` directories
  - **Tier 1 SKILL.md Template**:
    ```yaml
    ---
    name: deploy-production
    version: 2.0.0
    description: Orchestrates zero-downtime production deployments with security gates, rollback capability, and observability.
    tier2: instructions/full.md
    tier3: scripts/
    ---
    ```
  - **Validation**:
    - [ ] Agent startup token cost reduced by 60%+
    - [ ] Tier 2/3 content loaded only when referenced
    - [ ] All existing functionality preserved

- [ ] **4-B: Register Marketing Skills' Missing Tools**
  - **Priority**: 🔴 High
  - **Effort**: 3 hours
  - **Issue**: Four marketing tools broken (analytics, content-management, seo-tools, campaign-automation)
  - **Implementation** (Option B - wrap existing):
    - [ ] **marketing-analytics.ts**: Wrap `fetch` server + structured data parsing
    - [ ] **content-management.ts**: Wrap `github` server (content as code)
    - [ ] **seo-tools.ts**: Wrap `fetch` server + SEO API endpoints
    - [ ] **campaign-automation.ts**: Wrap `fetch` server + campaign platform APIs
  - **Files**:
    - [ ] Create above files in `mcp/servers/src/`
    - [ ] Update `mcp/config/config.json` (register all four)
    - [ ] Update `mcp/config/config.production.json` (register all four)
  - **Validation**:
    - [ ] Marketing skills execute without "tool not found" errors
    - [ ] API calls route through fetch/github adapters correctly

- [ ] **4-C: Add CI Skills Validation That Actually Works**
  - **Priority**: 🔴 Critical (Highest leverage action)
  - **Effort**: 1 hour
  - **Replace**: Broken `.claude/skills/` validation
  - **Files**:
    - [ ] `.github/workflows/mcp-skills-validation.yml` (fixed version)
  - **Implementation**:
    ```bash
    # Validation script
    for skill_dir in skills/*/; do
      skill_name=$(basename "$skill_dir")
      skill_md="$skill_dir/SKILL.md"
      
      # Verify YAML frontmatter
      if ! head -1 "$skill_md" | grep -q "^---"; then
        echo "❌ $skill_name: Missing YAML frontmatter"; exit 1
      fi
      
      # Cross-reference MCP tools with config
      if grep -q "INVOKES:" "$skill_md"; then
        while IFS= read -r tool; do
          if ! jq -e ".servers.\"$tool\"" mcp/config/config.json > /dev/null 2>&1; then
            echo "❌ $skill_name invokes '$tool' which is NOT in config.json"; exit 1
          fi
        done < <(grep "INVOKES:" "$skill_md" | grep -oP '\w[\w-]+')
      fi
      
      echo "✅ $skill_name validated"
    done
    ```
  - **Validation**:
    - [ ] CI catches broken skill-to-tool references pre-merge
    - [ ] YAML frontmatter validated
    - [ ] All skills pass before allowed to merge

---

### PHASE 5 — LONG-TERM EXCELLENCE (Ongoing)

- [ ] **5-A: Add Skill Auto-Discovery to skillset-server**
  - **Priority**: 🟢 Low
  - **Effort**: 2 hours
  - **Files**:
    - [ ] `mcp/servers/src/skillset-server.ts`
  - **Implementation**:
    - [ ] Add `discover_skills` tool
    - [ ] Accept `query` and `context` parameters
    - [ ] Load all skill manifests
    - [ ] Implement `rankByRelevance()` using semantic matching
    - [ ] Return ranked list of applicable skills
  - **Validation**:
    - [ ] Agent can query for skills matching a task
    - [ ] Relevance scoring accurate

- [ ] **5-B: memory.json Version Accuracy**
  - **Priority**: 🟢 Low
  - **Effort**: 15 min
  - **Files**:
    - [ ] `memory.json`
  - **Changes**:
    - [ ] Update Next.js version to 16 (remove inaccurate 16.1.5)
    - [ ] Add CI verification step to keep `memory.json` synchronized with actual deps

- [ ] **5-C: Enterprise Skills Packaging**
  - **Priority**: 🟢 Low
  - **Effort**: 4 hours
  - **Context**: Package for cross-platform consumption (Anthropic standard)
  - **Files**:
    - [ ] Ensure `anthropic/`, `claude/`, `codex/`, `connect/` subdirectories exist
    - [ ] Standardize `SKILL.md` schemas across all platforms
    - [ ] Create packaging script for distribution
  - **Validation**:
    - [ ] Skills installable on multiple AI platforms
    - [ ] Consistent behavior across platforms

---

## 🚨 Phase 1: Critical Production Blockers (P0)
*Execute in order. Do not proceed to Phase 2 until all checked.*

### Infrastructure & Tooling

- [ ] **TASK-CATALOG-001**: Configure pnpm Workspace Catalogs
  - **Priority**: 🔴 Critical
  - **Impact**: 60% slower installs, version drift risk
  - **Files**:
    - [ ] `pnpm-workspace.yaml` (add catalog definitions)
    - [ ] Root `package.json` (migrate to catalog: references)
  - **Commands**:
    ```bash
    grep -q "catalog:" pnpm-workspace.yaml 2>/dev/null && echo "✅" || echo "🔴 MISSING"
    ```
  - **Validation**:
    - [ ] All dependencies use `catalog:` protocol
    - [ ] Renovate bot recognizes catalog updates
    - [ ] Install time reduced by 40%+

- [ ] **TASK-GEN-001**: Configure Turborepo Generators
  - **Priority**: 🔴 Critical
  - **Files**:
    - [ ] `turbo/generators/config.ts`
    - [ ] `turbo/generators/fsd-slice/config.ts`
    - [ ] `turbo/generators/fsd-slice/generator.ts`
    - [ ] `turbo/generators/fsd-slice/templates/` (component, test, story files)
  - **Commands**:
    ```bash
    pnpm turbo gen fsd-slice --name design-system
    ```
  - **Validation**:
    - [ ] Generator creates 15+ files with correct FSD structure
    - [ ] Templates include `@x` notation placeholders
    - [ ] Steiger linting passes on generated code

- [ ] **TASK-RULES-001**: Create AI Coding Rules (.cursorrules)
  - **Priority**: 🔴 Critical
  - **Files**:
    - [ ] `.cursorrules` (root - global constraints)
    - [ ] `packages/entities/.cursorrules`
    - [ ] `packages/features/.cursorrules`
    - [ ] `packages/widgets/.cursorrules`
    - [ ] `packages/services/.cursorrules`
  - **Content Requirements**:
    - [ ] Enforce FSD import flow: `app → pages → widgets → features → entities → shared`
    - [ ] Mandate `Result<T,Error>` return types
    - [ ] Prohibit cross-layer imports
    - [ ] Require Hexagonal Port interfaces for external services

### Core Platform (Blocking All Other Work)
- [ ] **PROD-006**: Admin Dashboard Application
  - **Priority**: 🔴 Critical
  - **Impact**: Safe data operations without raw SQL; tenant management
  - **Dependencies**: TASK-009, TASK-010 (Foundation DB/Auth)
  - **Files**:
    - [ ] `apps/admin/app/layout.tsx`
    - [ ] `apps/admin/app/dashboard/page.tsx`
    - [ ] `apps/admin/app/tenants/page.tsx`
    - [ ] `packages/admin/components/DataEditor.tsx` (universal CRUD)
    - [ ] `packages/admin/components/TenantSwitcher.tsx`
    - [ ] `packages/admin/lib/audit-trail.ts`
  - **Subtasks**:
    - [ ] Scaffold FSD structure (app/pages/widgets/features/entities/shared)
    - [ ] Implement tenant data grid with RLS awareness
    - [ ] Build user impersonation flow
    - [ ] Add billing analytics view
    - [ ] Create system health dashboard
  - **Validation**:
    - [ ] Can edit tenant data without raw SQL
    - [ ] Tenant A cannot see Tenant B data (isolation test)
    - [ ] All mutations logged to audit trail
    - [ ] 148 total files in `apps/admin/src/` (per spec)

- [ ] **PROD-002**: Webhook Idempotency Layer
  - **Priority**: 🔴 Critical
  - **Impact**: Prevents duplicate processing/data corruption
  - **Files**:
    - [ ] `packages/infrastructure/webhooks/idempotency-store.ts`
    - [ ] `packages/infrastructure/webhooks/signature-verifier.ts`
    - [ ] `apps/web/app/api/webhooks/[service]/route.ts` (idempotency wrapper)
  - **Validation**:
    - [ ] Duplicate webhook payloads rejected with 200 OK (not processed)
    - [ ] Replay attack protection (<5 min timestamp tolerance)
    - [ ] Signature verification mandatory for all routes

- [ ] **PROD-004**: Background Job Queue System
  - **Priority**: 🔴 Critical
  - **Files**:
    - [ ] `packages/infrastructure/queue/client.ts`
    - [ ] `packages/infrastructure/queue/worker.ts`
    - [ ] `apps/web/app/api/inngest/route.ts` (or BullMQ equivalent)
  - **Subtasks**:
    - [ ] Configure Inngest (or BullMQ + Redis)
    - [ ] Implement job scheduling (cron)
    - [ ] Add dead letter queue (DLQ) handling
    - [ ] Create job recovery UI in admin

- [ ] **TASK-012**: Queue Workers Implementation
  - **Priority**: 🔴 Critical
  - **Files**:
    - [ ] `apps/workers/email-worker.ts`
    - [ ] `apps/workers/crm-sync-worker.ts`
    - [ ] `apps/workers/usage-rollup-worker.ts`
  - **Validation**:
    - [ ] Workers process jobs from queue
    - [ ] Failed jobs retry 3x then move to DLQ
    - [ ] Worker health check endpoint available

- [ ] **TASK-011**: Feature Flags System
  - **Priority**: 🔴 Critical
  - **Files**:
    - [ ] `packages/feature-flags/config.ts`
    - [ ] `packages/feature-flags/provider.tsx`
    - [ ] `packages/feature-flags/flags.ts`
    - [ ] `apps/web/app/layout.tsx` (integration)
  - **Dependencies**: `@vercel/flags` or Unleash
  - **Validation**:
    - [ ] Can toggle features per tenant
    - [ ] Feature evaluation <10ms (Edge Config)
    - [ ] Gradual rollout percentage works

### Performance & Security Foundation
- [ ] **PERF-001**: Core Web Vitals Optimization
  - **Priority**: 🔴 Critical
  - **Target**: LCP < 2.5s, INP < 200ms, CLS < 0.1
  - **Files**:
    - [ ] `scripts/performance/optimize-images.ts` (CI gate)
    - [ ] `scripts/performance/bundle-analysis.ts`
    - [ ] `apps/web/app/layout.tsx` (font optimization, preload)
    - [ ] `apps/web/next.config.ts` (image domains, bundling)
  - **Subtasks**:
    - [ ] Implement image optimization pipeline (WebP/AVIF)
    - [ ] Add bundle size limits (150KB marketing, 300KB dashboard)
    - [ ] Optimize Interaction to Next Paint (INP)
    - [ ] Add `<Suspense>` boundaries for streaming
  - **Validation**:
    - [ ] Lighthouse CI passes in GitHub Actions
    - [ ] `size-limit` CI gate passes
    - [ ] Real User Monitoring (RUM) shows INP < 200ms

- [ ] **TASK-PPR-001**: Next.js 16 PPR & Cache Components
  - **Priority**: 🔴 Critical (if not done per doc)
  - **Files**:
    - [ ] `apps/web/next.config.ts` (enable `ppr: true`, `dynamicIO`)
    - [ ] `apps/web/app/[site-slug]/[...path]/page.tsx` (PPR route)
    - [ ] `packages/core-engine/renderer/CacheComponent.tsx`
    - [ ] `packages/core-engine/renderer/fetchWithCache.ts`
  - **Validation**:
    - [ ] Marketing pages serve static shell instantly (<100ms)
    - [ ] Dynamic content streams in via Suspense
    - [ ] `CacheTag` revalidation works for granular updates

- [ ] **TASK-017**: Advanced Security & SOC 2 Compliance
  - **Priority**: 🔴 Critical
  - **Files**:
    - [ ] `packages/infrastructure/security/audit-logger.ts` (immutable logs)
    - [ ] `packages/infrastructure/security/encryption.ts` (AES-256-GCM field-level)
    - [ ] `apps/web/middleware.ts` (security headers, CSP)
    - [ ] `database/migrations/20240112000000_audit_logs.sql`
    - [ ] `database/triggers/audit-trigger.sql`
  - **Subtasks**:
    - [ ] Implement hash-chained audit logs (tamper-evident)
    - [ ] Add field-level encryption for PII
    - [ ] Configure CSP nonce generation
    - [ ] Add CVE-2025-29927 mitigation (middleware vulnerability)
  - **Validation**:
    - [ ] Delete user → verify audit chain integrity via `verifyAuditChain()`
    - [ ] SQL injection tests pass (RLS bypass attempts blocked)
    - [ ] Security headers A+ rating on securityheaders.com

### CMS & Content (The "Infinite UI" Foundation)
- [ ] **TASK-020**: Page Builder Core & CMS Foundation
  - **Priority**: 🔴 Critical
  - **Impact**: JSON-driven rendering engine; key differentiator
  - **Dependencies**: TASK-005 (UI Primitives), TASK-004 (Entities), TASK-011 (Feature Flags)
  - **Files**:
    - [ ] `packages/core/entities/page/Page.ts` (domain model)
    - [ ] `packages/core/entities/site/Site.ts`
    - [ ] `apps/web/app/[...slug]/page.tsx` (dynamic renderer)
    - [ ] `apps/web/widgets/page-builder-canvas/ui/Canvas.tsx`
    - [ ] `packages/core-engine/schema/page.schema.ts` (Zod validation)
    - [ ] `packages/core-engine/schema/component-registry.ts`
  - **Subtasks**:
    - [ ] Define Page entity with versioning support
    - [ ] Create JSON schema for block-based layouts
    - [ ] Implement dynamic component registry (Puck integration prep)
    - [ ] Build Canvas widget for visual editing
    - [ ] Add Preview mode with secret token
  - **Validation**:
    - [ ] Page structure persists to Supabase
    - [ ] Blocks render correctly via JSON config
    - [ ] Preview mode functional (secret routes)

- [ ] **TASK-PUCK-001**: Puck Editor Integration
  - **Priority**: 🔴 Critical
  - **Files**:
    - [ ] `packages/core-engine/puck/config.tsx` (component registry)
    - [ ] `packages/core-engine/puck/plugins/` (custom plugins)
    - [ ] `packages/core-engine/puck/theme-bridge.ts` (design tokens)
    - [ ] `apps/web/app/admin/editor/[pageId]/page.tsx` (editor route)
    - [ ] `database/migrations/20240113000000_add_puck_tables.sql` (RLS migration)
  - **Dependencies**: TASK-DS-001 (Design Tokens)
  - **Validation**:
    - [ ] Can drag-drop components in Puck UI
    - [ ] Changes save to JSON in Supabase
    - [ ] RLS policies prevent cross-tenant edits

---

## 🏗️ Phase 2: Enterprise Architecture (P1)
*Unblocks enterprise sales ($10k+ deals)*

- [ ] **TASK-034**: Complete apps/admin FSD Structure
  - **Target**: 148 files
  - **Command**: `pnpm turbo gen fsd-app --name admin --type dashboard`
  - **Check**:
    - [ ] Folders: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`
    - [ ] No cross-layer import violations (`npx steiger ./apps/admin`)

- [ ] **TASK-035**: Complete apps/portal FSD Structure
  - **Target**: 200 files (client portal)
  - **Features**:
    - [ ] Client dashboard
    - [ ] Analytics view
    - [ ] White-label customization UI
    - [ ] Lead management interface

- [ ] **TASK-DS-001**: Design Tokens & Style Dictionary
  - **Priority**: 🟡 High
  - **Files**:
    - [ ] `sd.config.js` (Style Dictionary config)
    - [ ] `packages/design-tokens/tokens.ts` (source of truth)
    - [ ] `packages/design-tokens/puck-theme.ts` (Puck integration)
    - [ ] Figma sync pipeline (optional)
  - **Validation**:
    - [ ] Change primary color in `tokens.ts` → all apps update without code changes
    - [ ] Tokens available as CSS variables and JS constants
    - [ ] Dark mode tokens defined

- [ ] **TASK-SVC-001**: Hexagonal Service Ports
  - **Priority**: 🟡 High
  - **Files**:
    - [ ] `packages/services/config/ports/email.port.ts` (interface)
    - [ ] `packages/services/config/ports/crm.port.ts`
    - [ ] `packages/services/config/ports/analytics.port.ts`
    - [ ] `packages/services/config/ports/payments.port.ts`
  - **Subtasks**:
    - [ ] Define Port interfaces (contracts only, no implementation)
    - [ ] Map current direct integrations to Ports
  - **Validation**:
    - [ ] Business logic imports only from `config/ports/`, never from adapters

- [ ] **TASK-SVC-002-REV**: Contract Testing Implementation
  - **Priority**: 🟡 High
  - **Files**:
    - [ ] `packages/services/tests/contracts/email-service.contract.ts`
    - [ ] `packages/services/tests/contracts/contract-runner.ts`
    - [ ] `tests/contracts/crm-service.contract.ts`
  - **Validation**:
    - [ ] Swap Resend → Native adapter, all tests pass without modification
    - [ ] CI runs contract tests on PR

- [ ] **TASK-UI-003**: Puck Version History & Rollback
  - **Priority**: 🟡 High
  - **Files**:
    - [ ] `database/migrations/20240114000000_layout_versions.sql` (table)
    - [ ] `packages/core-engine/puck/history.tsx` (UI panel)
    - [ ] `packages/core-engine/puck/versioning.ts` (logic)
  - **Validation**:
    - [ ] Publish broken layout → restore previous version in <30 seconds
    - [ ] Version diff visualization works
    - [ ] History immutable (append-only)

---

## 🛡️ Phase 3: SaaS Hardening (P2)
*Unblocks SOC 2 and enterprise compliance*

- [ ] **TASK-COMP-001**: GDPR/CCPA Compliance Package
  - **Priority**: 🟡 Medium
  - **Files**:
    - [ ] `packages/compliance/gdpr/right-to-erasure.ts` (automated deletion)
    - [ ] `packages/compliance/gdpr/data-export.ts` (JSON/CSV download)
    - [ ] `packages/compliance/gdpr/consent-manager.ts` (cookie consent)
    - [ ] `packages/compliance/audit/trail-logger.ts` (hash-chained logs)
    - [ ] `packages/compliance/audit/trail-verifier.ts`
    - [ ] `packages/compliance/privacy/data-classification.ts` (PII tagging)
  - **Validation**:
    - [ ] GDPR export generates complete tenant data in <2 minutes
    - [ ] Right to erasure cascades through all tables (RLS-safe)
    - [ ] Consent preferences respected in analytics tracking

- [ ] **TASK-QUEUE-001**: Queue Observability & DLQ
  - **Priority**: 🟡 Medium
  - **Files**:
    - [ ] `packages/infrastructure/queue/observability.ts`
    - [ ] `apps/admin/app/queue-monitor/page.tsx` (DLQ dashboard)
    - [ ] Alerting rules for failed jobs
  - **Validation**:
    - [ ] Kill worker mid-job → DLQ alert fires within 30 seconds
    - [ ] Can retry failed jobs from dashboard
    - [ ] Job latency metrics visible in Grafana/Tinybird

- [ ] **TASK-AI-004-REV**: A/B Testing Mutex & Experiment Isolation
  - **Priority**: 🟡 Medium
  - **Files**:
    - [ ] `packages/core-engine/experiments/experiment-mutex.ts`
    - [ ] `packages/core-engine/experiments/component-overlap-checks.ts`
    - [ ] `packages/core-engine/experiments/traffic-split.ts`
  - **Validation**:
    - [ ] Cannot activate overlapping experiments (system prevents with error)
    - [ ] Traffic allocation respects mutual exclusion
    - [ ] Statistical validity maintained (no interaction effects)

- [ ] **TASK-TINYBIRD-001**: Unified Analytics Ingestion
  - **Priority**: 🟡 Medium
  - **Files**:
    - [ ] `packages/analytics/ingest.ts` (unified client)
    - [ ] `packages/analytics/tinybird-pipes/` (query definitions)
    - [ ] `packages/metering/buffer/tinybird-buffer.ts` (batching)
  - **Validation**:
    - [ ] Query 30 days of usage data in <100ms
    - [ ] Stripe meter events match actual usage within 0.1%
    - [ ] Real-time metering without API rate limits

---

## 🤖 Phase 4: AI-Native & Scale (P3)
*Force multipliers and 1,124 file target*

- [ ] **TASK-AI-003**: AI-to-JSON Layout Generation Pipeline
  - **Priority**: 🟢 Enhancement
  - **Files**:
    - [ ] `packages/core-engine/ai/generate-layout.ts`
    - [ ] `packages/core-engine/ai/prompts/marketing-layout.md`
    - [ ] `packages/core-engine/ai/prompts/system/puck-schema.md`
    - [ ] `packages/core-engine/ai/validators/layout-zod.ts`
  - **Validation**:
    - [ ] LLM generates valid Puck JSON from text prompt
    - [ ] Zod validation catches hallucinated component IDs
    - [ ] Respects ai_credits quota before generation

- [ ] **TASK-AI-005**: AI Content Generation (Copywriting)
  - **Priority**: 🟢 Enhancement
  - **Files**:
    - [ ] `packages/ai-bridge/copywriting/generate-headline.ts`
    - [ ] `packages/ai-bridge/copywriting/generate-seo-meta.ts`
    - [ ] `packages/ai-bridge/copywriting/generate-email.ts`
    - [ ] `packages/ui-dashboard/components/AIWriterModal.tsx`
  - **Validation**:
    - [ ] Generate headline from keyword prompt
    - [ ] SEO meta generation respects character limits
    - [ ] Content moderation catches disallowed topics

- [ ] **TASK-FINAL-001**: Achieve 1,124 File Target
  - **Priority**: 🟢 Enhancement
  - **Current**: ~593 (apps/web) + gaps in admin/portal
  - **Commands**:
    ```bash
    pnpm tsx scripts/verify-file-count.ts
    ```
  - **Breakdown**:
    - [ ] `apps/web`: 312 files (✅ likely complete)
    - [ ] `apps/admin`: 148 files (scaffold remaining)
    - [ ] `apps/portal`: 200 files (scaffold remaining)
    - [ ] `packages/`: 464 files (fill gaps in services, compliance, ai-bridge)

- [ ] **TASK-FINAL-002**: Integration Testing & Production Validation
  - **Priority**: 🟢 Enhancement
  - **Files**:
    - [ ] `tests/integration/tenant-isolation.spec.ts` (RLS bypass attempts)
    - [ ] `tests/integration/multi-tenant-security.spec.ts`
    - [ ] `tests/e2e/golden-path.spec.ts` (Signup → Lead → Booking → Payment)
    - [ ] `tests/load/k6/tenant-concurrency.js` (1000 concurrent tenants)
  - **Validation**:
    - [ ] 1000 concurrent tenants, 10k RPM sustained
    - [ ] E2E golden path passes in <2 minutes
    - [ ] Tenant A cannot access Tenant B data via any path (API/UI)

---

## 🔧 Daily Execution Commands

**Start of Day Validation:**
```bash
# 1. Environment Check
pnpm verify  # TASK-DEV-001 validation

# 2. Architecture Guardrails
npx steiger ./packages  # FSD boundary check
pnpm test:contracts  # If implemented
pnpm test:webhooks  # PROD-002 idempotency
pnpm test:queues  # PROD-004 queue health

# 3. Performance Gates
pnpm run performance:audit  # PERF-001
pnpm run size-limit  # Bundle budgets
```

**File Count Tracking:**
```bash
find apps web admin portal -type f | wc -l  # Should trend toward 660
find packages -type f | wc -l  # Should trend toward 464
```

**Dependency Resolution Order:**
1. **Foundation**: TASK-CATALOG-001 → TASK-GEN-001 → TASK-RULES-001
2. **Core**: PROD-006 (Admin) → PROD-002 (Webhooks) → PROD-004 (Queues)
3. **CMS**: TASK-PUCK-001 → TASK-020 → TASK-UI-003 (Versioning)
4. **Scale**: TASK-SVC-001 → TASK-SVC-002-REV → TASK-TINYBIRD-001
5. **AI**: TASK-AI-003 → TASK-AI-005 → TASK-FINAL-002

**⚠️ Blockers**: Do not start Phase 2 until PROD-006, PROD-002, PROD-004 are complete.