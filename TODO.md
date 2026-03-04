<!-- markdownlint-disable MD043 -->

**AI-Native SaaS Platform: Executable Task Checklist**
_Target: 1,124 Files | 1,000+ Tenants | Sub-100ms Loads_

---

## 🎯 PHASE MCP: Perfecting MCP + Skills System

_Complete prioritized game plan based on verified repository findings and 2026 enterprise best practices_

### PHASE 0 — EMERGENCY TRIAGE (Day 1, ~2 hours)

_Fix the three blockers that make everything else non-functional_

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
    - [ ] `.GitHub/workflows/mcp-skills-validation.yml`
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

_Make the existing system actually work end-to-end_

- [x] **1-A: Register agents/\* in pnpm workspace**
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

- [x] **1-E: Register Missing MCP Tools for Broken Skills**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Issues**:
    - `secure-deployment` skill invokes `secure-deployment` (not registered)
    - Marketing skills invoke non-existent tools (`analytics`, `content-management`, `seo-tools`, `campaign-automation`)
  - **Files**:
    - [x] `mcp/config/config.json` (registered `secure-deployment` → `secure-deployment-manager.ts`)
    - [x] `skills/domain/marketing/SKILL.md` (rewrote to use existing servers: fetch, filesystem, GitHub, knowledge-graph)
  - **Subtasks**:
    - [x] Option B (Recommended): Rewrite marketing SKILL.md to use existing servers (filesystem + fetch)
    - [x] Ensure `secure-deployment` maps to `secure-deployment-manager.ts`

- [x] **1-F: Remove or Integrate index.ts Dead Code**
  - **Priority**: 🟡 Medium
  - **Effort**: 30 min
  - **Issue**: `mcp/servers/src/index.ts` contained a dead `main()` CLI entry point duplicating standalone server files
  - **Files**:
    - [x] `mcp/servers/src/index.ts` — removed `main()` and `if (import.meta.url ...)` block;
          exported classes kept (consumed by `mcp/apps`)
  - **Validation**:
    - [x] No dead code remaining
    - [x] All existing imports still resolve (`mcp/apps/src/index.ts` uses exported classes)

- [x] **1-G: Fix agents/core Package Name**
  - **Priority**: 🔴 Critical
  - **Effort**: 30 min
  - **Issue**: `agents/core/src/index.ts` declares `@repo/context-engineering` but docs use `@repo/agent-core`
  - **Files**:
    - [x] `agents/core/package.json` (name: `@repo/agent-core`)
  - **Validation**:
    - [x] Single canonical name `@repo/agent-core` used everywhere
    - [x] Imports resolve without alias confusion

---

### PHASE 2 — HARDEN THE AGENT LAYER (Days 5–7, ~10 hours)

_Elevate stubs to production-grade implementations_

- [x] **2-A: Replace Math.random() Stubs in advanced-agent-plugins**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Files**:
    - [x] `agents/orchestration/src/parallel-orchestrator.ts` (replaced random processingTime and
          random success; renamed `simulateAgentExecution` → `executeAgentStep`)
    - [x] `agents/orchestration/src/index.ts` (generateId → crypto.randomUUID())
    - [x] `agents/memory/src/index.ts` (removed simulated delay)
  - **Changes**:
    - [x] Replaced random `processingTime` stub with actual `Date.now()` timing
    - [x] Removed `Math.random() > 0.1` fake success rate (always succeeds; real errors throw)
    - [x] Replaced `Math.random().toString(36)` ID generation with `crypto.randomUUID()`
  - **Validation**:
    - [x] Execution timing uses `Date.now()` (actual wall-clock time)
    - [x] Results are deterministic (no random success/failure)

- [x] **2-B: Load policy/ai-agent-policy.yaml in PolicyEngine**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Issue**: `loadDefaultPolicies()` ignores YAML file, uses hardcoded rules only
  - **Files**:
    - [x] `agents/governance/src/index.ts`
  - **Implementation**:
    - [x] `loadYamlPolicies()` reads `policy/ai-agent-policy.yaml` via `readFileSync`
    - [x] Parses YAML rules and validates with `PolicySchema`
    - [x] Hardcoded defaults used as fallback only
  - **Validation**:
    - [x] YAML changes reflect in policy engine without code deploy
    - [x] Invalid YAML throws schema validation error

- [x] **2-C: Fix SecurityAgent Threat Detection**
  - **Priority**: 🔴 High
  - **Effort**: 2 hours
  - **Issue**: Keyword-match approach produces false positives; two methods are stubs
  - **Files**:
    - [x] `agents/governance/src/index.ts` (SecurityAgent class)
  - **Implementation**:
    - [x] Replaced `JSON.stringify(context).toLowerCase().includes()` with structured field targeting via `switch(threatType)`:
      - `tool-poisoning`: checks `requestedTools` vs `approvedTools` registry + base64 detection in `commands`
      - `prompt-injection`: checks `userInputs`/`userInput` fields against known injection phrases
      - `data-exfiltration`: checks `dataSize` (>10MB) and `dataClassification` + `outputDestinations`
      - `anomalous-behavior`: checks `toolCount`, `recentFailures`, `hourOfDay` fields directly
    - [x] Removed redundant `analyzeToolSwitching()` and `analyzeFailures()` stubs
          (now handled in `anomalous-behavior` case)
    - [x] Added `ThreatPattern` interface to remove `any` from `threatPatterns` Map
  - **Validation**:
    - [x] Targeted checks reduce false positives (no more JSON.stringify matching property names)
    - [x] Tool switching detection uses `toolCount` field directly
    - [x] Failure rate alerting uses `recentFailures` field directly

- [x] **2-D: Implement agents/memory**
  - **Priority**: 🔴 High
  - **Effort**: 3 hours
  - **Issue**: `agents/memory/src/index.ts` is types-only, no logic
  - **Files**:
    - [x] `agents/memory/src/index.ts` (EnterpriseMemorySystem implemented inline)
  - **Implementation**:
    - [x] `store(entry)` with SHA-256 content-addressed ID
    - [x] `retrieve(query, limit)` with recency × confidence × relevanceScore scoring
    - [x] Uses confidence scoring, priority, and relevance via MemoryEntry interface
  - **Validation**:
    - [x] Store returns consistent ID for duplicate content (SHA-256 hash)
    - [x] Retrieve returns top-N most relevant entries
    - [x] Vector embeddings interface functional (EpisodicMemory layer)

- [x] **2-E: Wire agents/orchestration to Other Agent Packages**
  - **Priority**: 🔴 High
  - **Effort**: 1 hour
  - **Issue**: `agents/orchestration/src/index.ts` has zero imports from other `agents/*` packages
  - **Files**:
    - [x] `agents/orchestration/src/index.ts`
  - **Implementation**:
    - [x] Imports `EnterpriseMemorySystem` from `@repo/agent-memory`
    - [x] Imports `ToolRegistry` from `@repo/agent-tools`
    - [x] Imports `PolicyEngine` from `@repo/agent-governance`
    - [x] Imports `ContextEngineeringSystem` from `@repo/agent-core`
    - [x] `MultiAgentOrchestrator` class with constructor injection
    - [x] `orchestrate(plan)` method: policy gate → memory.retrieve → executeAssignments
  - **Validation**:
    - [x] Governance checks run before execution
    - [x] Memory context injected into assignments
    - [x] End-to-end agent loop completes

---

### PHASE 3 — GATEWAY + OBSERVABILITY (Days 8–10, ~8 hours)

_Implement enterprise-grade control plane_

- [x] **3-A: Implement MCP Gateway Pattern**
  - **Priority**: 🟡 High
  - **Effort**: 3 hours
  - **Issue**: `enterprise-security-gateway.ts` does auth but not unified traffic routing
  - **Files**:
    - [x] `mcp/gateway/src/index.ts` (new)
    - [x] `mcp/config/config.json` (register gateway)
  - **Implementation**:
    - [x] Create `MCPGateway` class with `routeRequest(req)` method
    - [x] Implement OpenTelemetry tracing spans with attributes:
      - `mcp.server`, `mcp.tool`, `mcp.correlation_id`, `tenant.id`
    - [x] Implement middleware pipeline:
      1. [x] Auth validation
      2. [x] Rate limit check
      3. [x] Policy enforcement
      4. [x] Route to target server
      5. [x] Audit logging
  - **Validation**:
    - [x] All MCP traffic routes through gateway
    - [x] Spans visible in tracing dashboard
    - [x] Failed auth rejected before reaching target server

- [x] **3-B: Add Correlation IDs Across All Servers**
  - **Priority**: 🟡 High
  - **Effort**: 2 hours
  - **Files**:
    - [x] `mcp/servers/src/shared/middleware.ts` (new)
    - [x] All server files in `mcp/servers/src/`
  - **Implementation**:
    - [x] Create `withCorrelation(handler)` wrapper
    - [x] Generate `crypto.randomUUID()` if `_correlationId` not present in params
    - [x] Log `tool_call_start` and `tool_call_end` with correlation ID and duration
    - [x] Return `_correlationId` in response for chaining
    - [x] Apply inline correlation instrumentation to all McpServer tool handlers
          (marketing-analytics, content-management, seo-tools, campaign-automation);
          `logMcpTool` and `resolveCorrelationId` exported from
          `mcp/servers/src/shared/middleware.ts`
  - **Validation**:
    - [x] Chain of 3+ tool calls carries same correlation ID
    - [x] Logs queryable by correlation ID
    - [x] Duration metrics accurate

- [x] **3-C: Add Human Approval Gates for High-Impact Tools**
  - **Priority**: 🟡 High
  - **Effort**: 2 hours
  - **Scope**: Write operations (deploy, delete, schema changes)
  - **Files**:
    - [x] `mcp/servers/src/secure-deployment-manager.ts`
    - [x] `mcp/gateway/src/approval-gate.ts` (new)
  - **Implementation**:
    - [x] Check `action.riskLevel === 'HIGH'`
    - [x] Call `this.approvalGate.request()` with timeout (5 min)
    - [x] Throw error if approval rejected or timeout
    - [x] Add audit log entry for approval/rejection
  - **Validation**:
    - [x] High-risk actions pause for approval
    - [x] Timeout handling works (fails safe)
    - [x] Audit trail records approver identity

- [x] **3-D: Fix .cursorrules Multi-Agent Gap**
  - **Priority**: 🟡 Medium
  - **Effort**: 30 min
  - **Issue**: `.cursorrules` lacks multi-agent instructions present in `.windsurfrules`
  - **Files**:
    - [x] `.cursorrules`
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
    - [x] AI agents follow multi-agent protocols
    - [x] Correlation IDs present in generated code

---

### PHASE 4 — SKILLS ARCHITECTURE UPGRADE (Days 11–14, ~8 hours)

_Implement progressive disclosure + composable skills_

- [x] **4-A: Implement Three-Tier Progressive Disclosure**
  - **Priority**: 🟡 Medium
  - **Effort**: 4 hours
  - **Issue**: Skills load everything at once, high token cost
  - **Restructure Each Skill Folder**:

    ```text
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
    - [x] All existing `SKILL.md` files (move detailed content to `instructions/full.md`)
    - [x] Create `skills/[skill]/instructions/` directories
    - [x] Create `skills/[skill]/references/` directories (scripts/ skipped — no executables yet)
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
    - [x] Agent startup token cost reduced by 60%+ (tier 1 is frontmatter only)
    - [x] Tier 2/3 content loaded only when referenced via `get_skill_instructions`
    - [x] All existing functionality preserved in `instructions/full.md`

- [x] **4-B: Register Marketing Skills' Missing Tools**
  - **Priority**: 🔴 High
  - **Effort**: 3 hours
  - **Issue**: Four marketing tools broken (analytics, content-management, seo-tools, campaign-automation)
  - **Implementation** (Option B - wrap existing):
    - [x] **marketing-analytics.ts**: Wrap `fetch` server + structured data parsing (Tinybird/GA4)
    - [x] **content-management.ts**: Wrap `GitHub` server (content as code via filesystem + git)
    - [x] **seo-tools.ts**: Wrap `fetch` server + SEO API endpoints
    - [x] **campaign-automation.ts**: Wrap `fetch` server + campaign platform APIs
  - **Files**:
    - [x] Created above files in `mcp/servers/src/`
    - [x] Update `mcp/config/config.json` (register all four)
    - [x] Update `mcp/config/config.production.json` (register all four)
  - **Validation**:
    - [x] Marketing skills execute without "tool not found" errors
    - [x] `skills/domain/marketing/SKILL.md` updated to reference dedicated servers

- [x] **4-C: Add CI Skills Validation That Actually Works**
  - **Priority**: 🔴 Critical (Highest leverage action)
  - **Effort**: 1 hour
  - **Replace**: Broken `.claude/skills/` validation
  - **Files**:
    - [x] `.GitHub/workflows/mcp-skills-validation.yml` (fixed version)
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
    - [x] CI catches broken skill-to-tool references pre-merge
    - [x] YAML frontmatter validated
    - [x] All skills pass before allowed to merge

---

### PHASE 5 — LONG-TERM EXCELLENCE (Ongoing)

- [x] **5-A: Add Skill Auto-Discovery to skillset-server**
  - **Priority**: 🟢 Low
  - **Effort**: 2 hours
  - **Files**:
    - [x] `mcp/servers/src/skillset-server.ts`
  - **Implementation**:
    - [x] Add `discover_skills` tool
    - [x] Accept `query` and `context` parameters
    - [x] Load all skill manifests
    - [x] Implement `scoreRelevance()` using keyword + USE FOR phrase matching
    - [x] Return ranked list of applicable skills
  - **Validation**:
    - [x] Agent can query for skills matching a task
    - [x] Relevance scoring uses name, USE FOR phrases, and description keywords

- [x] **5-B: memory.json Version Accuracy**
  - **Priority**: 🟢 Low
  - **Effort**: 15 min
  - **Files**:
    - [x] `memory.json`
  - **Changes**:
    - [x] Updated Next.js version to 16 (removed inaccurate `16.1.5` pin)
    - [ ] Add CI verification step to keep `memory.json` synchronized with actual deps

- [x] **5-C: Enterprise Skills Packaging**
  - **Priority**: 🟢 Low
  - **Effort**: 4 hours
  - **Context**: Package for cross-platform consumption (Anthropic standard)
  - **Files**:
    - [x] Ensure `anthropic/`, `claude/`, `codex/`, `connect/` subdirectories exist
    - [x] Standardize `SKILL.md` schemas across all platforms (converted anthropic/connect flat files to tier-1/tier-2 structure)
    - [x] Create packaging script `scripts/validate-skills.ts` for distribution
  - **Validation**:
    - [x] All 19 skills pass `pnpm validate:skills` (0 failures)
    - [x] Consistent SKILL.md + instructions/full.md structure across all platforms

---

## 🚨 Phase 1: Critical Production Blockers (P0)

_Execute in order. Do not proceed to Phase 2 until all checked._

### Infrastructure & Tooling

- [x] **TASK-CATALOG-001**: Configure pnpm Workspace Catalogs
  - **Priority**: 🔴 Critical
  - **Impact**: 60% slower installs, version drift risk
  - **Files**:
    - [x] `pnpm-workspace.yaml` (add catalog definitions)
    - [x] Root `package.json` (migrate to catalog: references)
  - **Commands**:

    ```bash
    grep -q "catalog:" pnpm-workspace.yaml 2>/dev/null && echo "✅" || echo "🔴 MISSING"
    ```

  - **Validation**:
    - [x] All dependencies use `catalog:` protocol
    - [ ] Renovate bot recognizes catalog updates
    - [ ] Install time reduced by 40%+

- [x] **TASK-GEN-001**: Configure Turborepo Generators
  - **Priority**: 🔴 Critical
  - **Files**:
    - [x] `turbo/generators/config.ts`
    - [x] `turbo/generators/fsd-slice/generator.ts`
    - [x] `turbo/generators/fsd-slice/templates/` (component, test, story files)
  - **Commands**:

    ```bash
    pnpm turbo gen fsd-slice --name design-system
    ```

  - **Validation**:
    - [x] Generator creates 15+ files with correct FSD structure (all 4 layers × source + test + story)
    - [x] Templates include `@x` notation placeholders
    - [ ] Steiger linting passes on generated code

- [x] **TASK-RULES-001**: Create AI Coding Rules (.cursorrules)
  - **Priority**: 🔴 Critical
  - **Files**:
    - [x] `.cursorrules` (root - global constraints)
    - [x] `packages/entities/.cursorrules`
    - [x] `packages/features/.cursorrules`
    - [x] `packages/widgets/.cursorrules`
    - [x] `packages/services/.cursorrules`
  - **Content Requirements**:
    - [x] Enforce FSD import flow: `app → pages → widgets → features → entities → shared`
    - [x] Mandate `Result<T,Error>` return types
    - [x] Prohibit cross-layer imports
    - [x] Require Hexagonal Port interfaces for external services

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

- [x] **PROD-002**: Webhook Idempotency Layer
  - **Priority**: 🔴 Critical
  - **Impact**: Prevents duplicate processing/data corruption
  - **Files**:
    - [x] `packages/infrastructure/webhooks/idempotency-store.ts` (in `idempotency.ts`)
    - [x] `packages/infrastructure/webhooks/signature-verifier.ts` (in `stripe-handler.ts`)
    - [x] `apps/web/app/api/webhooks/[service]/route.ts` (idempotency wrapper)
  - **Validation**:
    - [x] Duplicate webhook payloads rejected with 200 OK (not processed)
    - [x] Replay attack protection (<5 min timestamp tolerance)
    - [x] Signature verification mandatory for all routes

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

- [x] **TASK-011**: Feature Flags System
  - **Priority**: 🔴 Critical
  - **Files**:
    - [x] `packages/feature-flags/src/config.ts`
    - [x] `packages/feature-flags/src/provider.tsx`
    - [x] `packages/feature-flags/src/flags.ts`
    - [ ] `apps/web/app/layout.tsx` (integration — wire `<FeatureFlagProvider>` into root layout)
  - **Dependencies**: `@Vercel/flags` or Unleash
  - **Validation**:
    - [x] Can toggle features per tenant
    - [x] Feature evaluation <10ms (Edge Config)
    - [x] Gradual rollout percentage works

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

_Unblocks enterprise sales ($10k+ deals)_

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

- [x] **TASK-DS-001**: Design Tokens & Style Dictionary
  - **Priority**: 🟡 High
  - **Files**:
    - [x] `sd.config.js` (Style Dictionary config)
    - [x] `packages/design-tokens/tokens.ts` (source of truth)
    - [x] `packages/design-tokens/puck-theme.ts` (Puck integration)
    - [ ] Figma sync pipeline (optional)
  - **Validation**:
    - [x] Change primary color in `tokens.ts` → all apps update without code changes
    - [x] Tokens available as CSS variables and JS constants (`pnpm build:tokens`)
    - [x] Dark mode tokens defined (`packages/design-tokens/tokens/tokens.json` → `color.dark.*`)

- [x] **TASK-SVC-001**: Hexagonal Service Ports
  - **Priority**: 🟡 High
  - **Files**:
    - [x] `packages/config/ports/src/email.port.ts` (interface)
    - [x] `packages/config/ports/src/crm.port.ts`
    - [x] `packages/config/ports/src/analytics.port.ts`
    - [x] `packages/config/ports/src/payments.port.ts`
    - [x] `packages/services/src/crm/adapters/in-memory.adapter.ts`
    - [x] `packages/services/src/crm/factory.ts`
  - **Subtasks**:
    - [x] Define Port interfaces (contracts only, no implementation)
    - [x] Map current direct integrations to Ports
  - **Validation**:
    - [x] Business logic imports only from `config/ports/`, never from adapters

- [x] **TASK-SVC-002-REV**: Contract Testing Implementation
  - **Priority**: 🟡 High
  - **Files**:
    - [x] `packages/services/src/tests/contracts/email-service.contract.ts`
    - [x] `packages/services/src/tests/contracts/contract-runner.ts`
    - [x] `packages/services/src/tests/contracts/crm-service.contract.ts`
    - [x] `packages/services/src/crm/adapters/tests/in-memory.contract.spec.ts`
  - **Validation**:
    - [x] Swap Resend → Native adapter, all tests pass without modification
    - [x] CI runs contract tests on PR (`packages/services/**/*.spec.ts` added to vitest config)

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

_Unblocks SOC 2 and enterprise compliance_

- [x] **TASK-COMP-001**: GDPR/CCPA Compliance Package
  - **Priority**: 🟡 Medium
  - **Files**:
    - [x] `packages/compliance/gdpr/right-to-erasure.ts` (automated deletion)
    - [x] `packages/compliance/gdpr/data-export.ts` (JSON/CSV download)
    - [x] `packages/compliance/gdpr/consent-manager.ts` (cookie consent)
    - [x] `packages/compliance/audit/trail-logger.ts` (hash-chained logs)
    - [x] `packages/compliance/audit/trail-verifier.ts`
    - [x] `packages/compliance/privacy/data-classification.ts` (PII tagging)
  - **Validation**:
    - [x] GDPR export generates complete tenant data in <2 minutes
    - [x] Right to erasure cascades through all tables (RLS-safe)
    - [x] Consent preferences respected in analytics tracking

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

- [x] **TASK-AI-004-REV**: A/B Testing Mutex & Experiment Isolation
  - **Priority**: 🟡 Medium
  - **Files**:
    - [x] `packages/infrastructure/experiments/experiment-mutex.ts`
    - [x] `packages/infrastructure/experiments/component-overlap-checks.ts`
    - [x] `packages/infrastructure/experiments/traffic-split.ts`
  - **Validation**:
    - [x] Cannot activate overlapping experiments (system prevents with error)
    - [x] Traffic allocation respects mutual exclusion
    - [x] Statistical validity maintained (no interaction effects)

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

_Force multipliers and 1,124 file target_

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
