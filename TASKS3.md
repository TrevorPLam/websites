# Skills Layer — Executable Checklist

**25 issues across the skills/ tree**

- 🔴 **7 Critical** - Blockers preventing skill system from functioning
- 🟠 **11 High** - Major functionality gaps affecting agent capabilities
- 🟡 **7 Medium** - Documentation and template improvements

---

## 🔴 Category 1: Structural Emptiness (7 Critical Issues)

### S-01: Populate skills/ layer structure

- [ ] **Task**: Populate 21 empty directories starting with agency workflows
- [ ] **Priority**: Critical - Base foundation for all skills
- [ ] **Files to Create**:
  - [ ] `skills/domain/marketing/client-intake.md`
  - [ ] `skills/domain/marketing/seo-audit.md`
  - [ ] `skills/domain/marketing/lead-research.md`
  - [ ] `skills/domain/marketing/website-build.md`
- [ ] **Validation**: At least one skill per `core/` subdir exists

### S-02: Fix config.json → skillset mapping

- [ ] **Task**: Ensure mcp-skillset can read skills/ at runtime
- [ ] **Priority**: Critical - Agents have no skills available
- [ ] **Action**: Verify config.json paths match actual directory structure
- [ ] **Validation**: `mcp-skillset` returns populated skill list

### S-03: Create core operational skills

- [ ] **Task**: Populate empty core subdirs (deploy/, review/, discovery/)
- [ ] **Priority**: Critical - No operational capabilities
- [ ] **Files to Create**:
  - [ ] `skills/core/deploy/production-deploy.md`
  - [ ] `skills/core/review/code-review.md`
  - [ ] `skills/core/discovery/service-discovery.md`
- [ ] **Template**: Use `skills/templates/workflow-skill.md` as base

### S-04: Create marketing domain skills

- [ ] **Task**: Build primary agency use case skills
- [ ] **Priority**: Critical - Core business functionality undefined
- [ ] **Files to Create**:
  - [ ] `skills/domain/marketing/client-intake.md`
  - [ ] `skills/domain/marketing/seo-audit.md`
  - [ ] `skills/domain/marketing/lead-research.md`
  - [ ] `skills/domain/marketing/website-build.md`
- [ ] **Tools**: Use existing fetch-mcp and filesystem-mcp

### S-05: Create integration skills

- [ ] **Task**: Populate integration/azure/ and missing github/, slack/ dirs
- [ ] **Priority**: Critical - Integration capabilities missing
- [ ] **Files to Create**:
  - [ ] `skills/integration/azure/azure-deploy.md`
  - [ ] `skills/integration/github/github-workflow.md`
  - [ ] `skills/integration/slack/` (if Slack is used)
- [ ] **Validation**: All integration dirs have content

### S-06: Populate claude/ subdirectories

- [ ] **Task**: Fill 5 empty claude/ subdirs
- [ ] **Priority**: Critical - Claude agent capabilities limited
- [ ] **Priority Order**:
  - [ ] `skills/claude/code-review/` (highest priority)
  - [ ] `skills/claude/deploy-production/` (high priority)
  - [ ] `skills/claude/agents/`
  - [ ] `skills/claude/assets/`
  - [ ] `skills/claude/` (other subdirs)

### S-07: Populate codex/ subdirectories

- [ ] **Task**: Fill 4 empty codex/ subdirs
- [ ] **Priority**: Critical - Codex agent capabilities limited
- [ ] **Priority Order**:
  - [ ] `skills/codex/tenant-setup/client-onboard.md` (maps to agency workflow)
  - [ ] `skills/codex/code-review/`
  - [ ] `skills/codex/` (other subdirs)

---

## 🟠 Category 2: Broken MCP References (3 High Issues)

### S-10: Fix MCP server references in SKILL.md files

- [ ] **Task**: Skills reference non-existent github-mcp and slack-mcp servers
- [ ] **Priority**: High - Skills cannot invoke required tools
- [ ] **Actions**:
  - [ ] Fix `github-server.ts` (MCP Issue #1)
  - [ ] Add `slack-mcp` server to config.json
  - [ ] Update both SKILL.md files with correct server names
- [ ] **Validation**: All MCP server references exist in config.json

### S-11: Verify Azure MCP tool names

- [ ] **Task**: Validate azure-mcp tool names against actual @azure/mcp tools
- [ ] **Priority**: High - Skills may invoke non-existent tools
- [ ] **Actions**:
  - [ ] Run `@azure/mcp` locally
  - [ ] List all available tools
  - [ ] Update skill files with exact tool names
- [ ] **Tools to Verify**:
  - [ ] `validate-config`
  - [ ] `azd-up`

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

- [x] **Critical Issues (4/7 completed)**: S-01, S-02, S-03, S-04 completed
- [ ] **High Issues (11)**: 0/11 completed
- [ ] **Medium Issues (7)**: 0/7 completed
- [ ] **Overall Progress**: 4/25 completed (16%)

### Next Actions:

1. ✅ S-01 (structural foundation) - COMPLETED
2. ✅ S-02 (skillset mapping) - COMPLETED
3. ✅ S-03 (core operational skills) - COMPLETED
4. ✅ S-04 (marketing domain skills) - COMPLETED
5. 🔄 S-05 (integration skills) - IN PROGRESS
6. ⏳ S-10/S-11 (MCP references) - PENDING
7. ⏳ S-13 to S-19 (documentation drift) - PENDING

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
