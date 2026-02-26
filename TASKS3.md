# Skills Layer — Executable Checklist

**25 issues across the skills/ tree**

- 🔴 **7 Critical** - Blockers preventing skill system from functioning
- 🟠 **11 High** - Major functionality gaps affecting agent capabilities
- 🟡 **7 Medium** - Documentation and template improvements

---

## 🔴 Category 1: Structural Emptiness (7 Critical Issues)

### S-01: Populate skills/ layer structure

- [x] **Task**: Populate 21 empty directories starting with agency workflows
- [x] **Priority**: Critical - Base foundation for all skills
- [x] **Files to Create**:
  - [x] `skills/domain/marketing/client-intake.md`
  - [x] `skills/domain/marketing/seo-audit.md`
  - [x] `skills/domain/marketing/lead-research.md`
  - [x] `skills/domain/marketing/website-build.md`
- [x] **Validation**: At least one skill per `core/` subdir exists

### S-02: Fix config.json → skillset mapping

- [x] **Task**: Ensure mcp-skillset can read skills/ at runtime
- [x] **Priority**: Critical - Agents have no skills available
- [x] **Action**: Verify config.json paths match actual directory structure
- [x] **Validation**: `mcp-skillset` returns populated skill list

### S-03: Create core operational skills

- [x] **Task**: Populate empty core subdirs (deploy/, review/, discovery/)
- [x] **Priority**: Critical - No operational capabilities
- [x] **Files to Create**:
  - [x] `skills/core/deploy/production-deploy.md`
  - [x] `skills/core/review/code-review.md`
  - [x] `skills/core/discovery/service-discovery.md`
- [x] **Template**: Use `skills/templates/workflow-skill.md` as base

### S-04: Create marketing domain skills

- [x] **Task**: Build primary agency use case skills
- [x] **Priority**: Critical - Core business functionality undefined
- [x] **Files to Create**:
  - [x] `skills/domain/marketing/client-intake.md`
  - [x] `skills/domain/marketing/seo-audit.md`
  - [x] `skills/domain/marketing/lead-research.md`
  - [x] `skills/domain/marketing/website-build.md`
- [x] **Tools**: Use existing fetch-mcp and filesystem-mcp

### S-05: Create integration skills

- [x] **Task**: Populate integration/azure/ and missing github/, slack/ dirs
- [x] **Priority**: Critical - Integration capabilities missing
- [x] **Files to Create**:
  - [x] `skills/integration/azure/azure-deploy.md` (already existed as SKILL.md)
  - [x] `skills/integration/github/github-workflow.md` (CREATED)
  - [x] `skills/integration/slack/notification-workflow.md` (CREATED - webhook-based notifications)
- [x] **Validation**: All integration dirs have content

### S-06: Populate claude/ subdirectories

- [x] **Task**: Fill 5 empty claude/ subdirs
- [x] **Priority**: Critical - Claude agent capabilities limited
- [x] **Priority Order**:
  - [x] `skills/claude/code-review/` (highest priority) - already had content
  - [x] `skills/claude/deploy-production/` (high priority) - already had content
  - [x] `skills/claude/agents/` - already had content
  - [x] `skills/claude/assets/` - already had content
  - [x] `skills/claude/references/` - POPULATED with claude-agent-patterns.md and mcp-integration-guide.md
  - [x] `skills/claude/scripts/` - POPULATED with setup, validation, and orchestrator scripts

### S-07: Populate codex/ subdirectories

- [x] **Task**: Fill 4 empty codex/ subdirs
- [x] **Priority**: Critical - Codex agent capabilities limited
- [x] **Priority Order**:
  - [x] `skills/codex/tenant-setup/client-onboard.md` (maps to agency workflow)
  - [x] `skills/codex/code-review/` (comprehensive review system)
  - [x] `skills/codex/` (all subdirs fully populated)
- [x] **Status**: COMPLETED - All codex subdirectories contain comprehensive content
- [x] **Files Verified**: 26 markdown files across all codex subdirectories
- [x] **MCP References Fixed**: Updated github-mcp → GitHub in SKILL.md files

---

## 🟠 Category 2: Broken MCP References (3 High Issues)

### S-10: Fix MCP server references in SKILL.md files

- [x] **Task**: Skills reference non-existent github-mcp and slack-mcp servers
- [x] **Priority**: High - Skills cannot invoke required tools
- [x] **Actions**:
  - [x] Fix `github-server.ts` (MCP Issue #1)
  - [x] Add `slack-mcp` server to config.json
  - [x] Update both SKILL.md files with correct server names
- [x] **Validation**: All MCP server references exist in config.json

### S-11: Verify Azure MCP tool names

- [x] **Task**: Validate azure-mcp tool names against actual @azure/mcp tools
- [x] **Priority**: High - Skills may invoke non-existent tools
- [x] **Actions**:
  - [x] Run `@azure/mcp` locally
  - [x] List all available tools
  - [x] Update skill files with exact tool names
- [x] **Tools to Verify**:
  - [x] `validate-config` → `group` → `list`
  - [x] `azd-up` → `appservice` → `webapp` → `create`

### S-12: Fix CLI command references

- [ ] **Task**: Replace fake `skill invoke [skill-name]` CLI with actual MCP patterns
- [ ] **Priority**: High - Documentation shows non-existent commands
- [ ] **Actions**:
  - [ ] Remove CLI command from `workflow-skill.md` template
  - [ ] Add actual MCP tool invocation pattern for Windsurf/Cursor
  - [ ] Document real agent interaction patterns

---

## 🔴/🟠 Category 3: Duplicate & Misnamed Content (2 Issues)

### S-08: Differentiate Claude vs Codex SKILL.md files

- [ ] **Task**: Fix byte-for-byte identical SKILL.md files
- [ ] **Priority**: High - No agent-specific differentiation
- [ ] **Actions**:
  - [ ] Add Claude-specific prompting to `skills/claude/SKILL.md`
  - [ ] Add Codex-specific syntax to `skills/codex/SKILL.md`
  - [ ] Ensure each agent has unique optimization

### S-09: Fix skill filename vs name mismatch

- [ ] **Task**: Rename SKILL.md to match frontmatter name (azure-deploy)
- [ ] **Priority**: High - mcp-skillset registers wrong skill name
- [ ] **Actions**:
  - [ ] Rename `skills/claude/SKILL.md` → `skills/claude/azure-deploy.md`
  - [ ] Rename `skills/codex/SKILL.md` → `skills/codex/azure-deploy.md`
  - [ ] Verify registration uses correct skill names

---

## 🟠 Category 4: Documentation Drift (7 High Issues)

### S-13: Fix skills/README.md directory listings

- [ ] **Task**: Update README to match actual directory structure
- [ ] **Priority**: High - Documentation misleads users
- [ ] **Changes**:
  - [ ] Remove `core/test/` reference (doesn't exist)
  - [ ] Add `core/discovery/` reference (exists but not listed)

### S-14: Fix domain directory listings

- [ ] **Task**: Update domain section in README
- [ ] **Priority**: High - Missing existing domain, listing non-existent ones
- [ ] **Changes**:
  - [ ] Remove `domain/sales/` and `domain/analytics/` (don't exist)
  - [ ] Add `domain/platform/` (exists but not listed)
  - [ ] Create missing dirs or update accordingly

### S-15: Fix integration directory listings

- [ ] **Task**: Update integration section in README
- [ ] **Priority**: High - Only azure/ exists but github/ and slack/ listed
- [ ] **Actions**:
  - [ ] Create `integration/github/` and `integration/slack/` dirs
  - [ ] Add skill files to each directory
  - [ ] Or update README to reflect actual state

### S-16: Fix README Quick Start command

- [ ] **Task**: Fix failing `cp` command in Quick Start
- [ ] **Priority**: High - Users cannot follow setup instructions
- [ ] **Fix**: Prepend `mkdir -p skills/my-domain &&` to the cp command

### S-17: Add missing package.json scripts

- [ ] **Task**: Create scripts referenced in README
- [ ] **Priority**: High - Documentation references non-existent commands
- [ ] **Scripts to Add**:
  - [ ] `pnpm test:skill`
  - [ ] `pnpm validate:skills`
- [ ] **Alternative**: Remove from README if not needed

### S-18: Fix misleading implementation status

- [ ] **Task**: Correct false "IMPLEMENTATION COMPLETE" claims
- [ ] **Priority**: High - Misleading project status
- [ ] **Actions**:
  - [ ] Rename `AI_AGENT_SKILLS_IMPLEMENTATION_SUMMARY.md` → `ARCHITECTURE_PLAN.md`
  - [ ] Add status column: Planned/In Progress/Complete
  - [ ] Mark 4 of 6 packages as "Planned"

### S-19: Fix dependency implementation claims

- [ ] **Task**: Move unimplemented dependencies to planned section
- [ ] **Priority**: High - False claims about Bcrypt + Redis
- [ ] **Actions**:
  - [ ] Remove Bcrypt and Redis from "implemented" section
  - [ ] Add both to "Planned Dependencies" section
  - [ ] Update implementation timeline

---

## 🟡 Category 5: Template Quality (4 Medium Issues)

### S-20: Fix template INVOKES section

- [ ] **Task**: Replace human comment with parseable MCP server list
- [ ] **Priority**: Medium - Template usability
- [ ] **Fix**: Change `INVOKES: [list-mcp-servers-needed]` → `INVOKES: [azure-mcp, github-mcp]`

### S-21: Add structured error handling to template

- [ ] **Task**: Replace generic error handling with step-level structure
- [ ] **Priority**: Medium - Template robustness
- [ ] **Add**: Error table with columns: `| Step | Error | Recovery | Rollback? |`

### S-22: Fix hardcoded API URL in template

- [ ] **Task**: Replace realistic-looking URL with obvious placeholder
- [ ] **Priority**: Medium - Prevent accidental shipping of template URLs
- [ ] **Fix**: Change `api.service.com` → `api.REPLACE-ME.com` or `api.[SERVICE_NAME].com # REPLACE THIS`

### S-23: Add changelog section to template

- [ ] **Task**: Add versioning section for tracking skill updates
- [ ] **Priority**: Medium - Skill maintenance
- [ ] **Add**: `## Changelog` section with `| Version | Date | Change |` table

---

## 🔴 Category 6: Missing High-Priority Skills (2 Critical Issues)

### S-24: Create marketing agency skills

- [ ] **Task**: Build core business use case skills
- [ ] **Priority**: Critical - Primary agency functionality missing
- [ ] **Skills to Create**:
  - [ ] `skills/domain/marketing/client-intake.md`
  - [ ] `skills/domain/marketing/seo-audit.md`
  - [ ] `skills/domain/marketing/lead-research.md`
  - [ ] `skills/domain/marketing/website-build.md`
- [ ] **Tools Available**: fetch-mcp and filesystem-mcp already in config.json
- [ ] **Impact**: Immediately usable by Windsurf/Cursor agents

### S-25: Create operational core skills

- [ ] **Task**: Build skills to prevent session re-derivation
- [ ] **Priority**: Critical - Agents re-derive deployment steps every session
- [ ] **Skills to Create**:
  - [ ] `skills/core/deploy/production-deploy.md`
  - [ ] `skills/core/review/code-review.md`
  - [ ] `skills/core/discovery/service-discovery.md`
- [ ] **Impact**: Persistent operational knowledge across sessions

---

## Execution Tracker

### Highest ROI Fixes (Execute in Order):

1. **Fix config.production.json paths** (`packages/` → `mcp/servers/`)
   - [ ] **Impact**: Instantly activates 9 servers
   - [ ] **Effort**: 15 minutes
   - [ ] **Status**: ⏳ Pending

2. **Fix MCP response format in 5 dead servers**
   - [ ] **Impact**: Unlocks 46 new tools
   - [ ] **Effort**: 2 hours
   - [ ] **Status**: ⏳ Pending

3. **Create 4 marketing domain skills**
   - [ ] **Impact**: Immediately usable by agents today
   - [ ] **Effort**: 4 hours
   - [ ] **Status**: ⏳ Pending

### Progress Summary:

- [x] **Critical Issues (7/7 completed)**: S-01, S-02, S-03, S-04, S-05, S-06, S-07 completed
- [x] **High Issues (2/11 completed)**: S-10, S-11 completed
- [ ] **Medium Issues (7)**: 0/7 completed
- [x] **Overall Progress**: 9/25 completed (36%)

### Next Actions:

1. ✅ S-01 (structural foundation) - COMPLETED
2. ✅ S-02 (skillset mapping) - COMPLETED
3. ✅ S-03 (core operational skills) - COMPLETED
4. ✅ S-04 (marketing domain skills) - COMPLETED
5. ✅ S-05 (integration skills) - COMPLETED
6. ✅ S-06 (populate claude subdirs) - COMPLETED
7. ✅ S-07 (populate codex subdirs) - COMPLETED
8. ✅ S-10/S-11 (MCP references) - COMPLETED
9. ⏳ S-12 to S-19 (documentation drift) - NEXT PRIORITY

---

## Grand Total: 110 Issues Across Full Infrastructure

| Layer                | Critical | High   | Medium | Total   |
| -------------------- | -------- | ------ | ------ | ------- |
| MCP Servers + Config | 19       | 33     | 33     | **85**  |
| Skills Layer         | 7        | 11     | 7      | **25**  |
| **Combined**         | **26**   | **44** | **40** | **110** |

### Success Criteria:

✅ All 7 Critical issues resolved  
✅ All 11 High issues resolved  
✅ Marketing agency skills functional  
✅ MCP integration working  
✅ Documentation accurate and helpful
