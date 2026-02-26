I'll conduct deep research on your specific tool stack to ensure the Master Guide addresses cross-platform workflows, mobile constraints, and each tool's unique implementation of MCP/Skills.
Let me search for more specific details on Windsurf's implementation and mobile constraints.
Let me gather final details on Windsurf's specific implementation and the unified Agent Skills standard.
Based on my comprehensive research across your entire tool stack, here is the **Unified MCP & Agent Skills Master Guide** tailored for your multi-platform workflow.

---

# **THE UNIFIED MCP & AGENT SKILLS MASTER GUIDE**

**Cross-Platform Implementation for Windsurf, Cursor, GitHub Copilot, ChatGPT Codex, and Claude Code**  
**Version:** 2.0 | **Date:** February 26, 2026  
**Standard:** Agent Skills 1.0 (agentskills.io) + MCP 2025-11-25

---

## **EXECUTIVE SUMMARY**

You operate across five distinct AI coding platforms, each with different capabilities:

| Platform           | Skills Support              | MCP Support      | Key Differentiator                          |
| ------------------ | --------------------------- | ---------------- | ------------------------------------------- |
| **Claude Code**    | ✅ Native (Source of Truth) | ✅ Full          | Progressive disclosure, subagents, hooks    |
| **ChatGPT Codex**  | ✅ Native                   | ✅ Full          | `agents/openai.yaml` for UI/policy config   |
| **Cursor**         | ⚠️ Via Rules (`.mdc`)       | ✅ 40-tool limit | Agent Mode with parallel agents (up to 8)   |
| **Windsurf**       | ✅ Native (Cascade)         | ✅ SSE/stdio     | Cascade hybrid mode, followup_message hooks |
| **Copilot Mobile** | ❌ Limited                  | ❌ No            | Text-only, cloud-based, no file system      |

**Strategic Insight:** Claude Code serves as your **Skills Source of Truth** (most mature implementation), while MCP servers provide **cross-platform tool standardization**. Use the **Agent Skills Open Standard** (agentskills.io) for portable workflows, and **MCP** for external system access.

---

## **PART 1: THE AGENT SKILLS OPEN STANDARD**

### **1.1 Universal Specification (agentskills.io)**

All your tools (except Copilot Mobile) support the **Agent Skills Open Standard** released December 18, 2025 :

**File Structure (Universal):**

```
skill-name/                 # Directory: kebab-case, max 64 chars
├── SKILL.md               # Required: YAML frontmatter + Markdown
├── scripts/               # Optional: Executable code (Python, Bash)
├── references/            # Optional: Documentation (lazy-loaded)
├── assets/                # Optional: Templates, icons
└── agents/                # Platform-specific configs
    ├── openai.yaml        # Codex: UI metadata, dependencies
    └── cursor.mdc         # Cursor: Rules format (optional)
```

**SKILL.md Frontmatter (Universal):**

```yaml
---
name: skill-identifier # Required: kebab-case, unique
description: > # Required: Trigger conditions
  Use when [specific condition].
  Do not use when [boundary condition].
meta:
  version: '1.0.0'
  author: 'org/team'
---
```

### **1.2 Platform-Specific Paths**

| Platform        | Workspace (Project)                | User (Global)                 | Enterprise                   |
| --------------- | ---------------------------------- | ----------------------------- | ---------------------------- |
| **Claude Code** | `.claude/skills/`                  | `~/.claude/skills/`           | SSO/SCIM, managed configs    |
| **Codex CLI**   | `.agents/skills/` (CWD up to root) | `~/.codex/skills/`            | `/etc/codex/skills/` (Admin) |
| **Windsurf**    | `.windsurf/skills/`                | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` (team)   |
| **Cursor**      | `.cursor/rules/` (as `.mdc`)       | `~/.cursor/rules/`            | Hierarchical scoping         |
| **Copilot**     | ❌ Not applicable                  | ❌ Cloud only                 | Org-level content exclusion  |

**Critical:** Copilot Mobile has **no file system access** and cannot use Skills or MCP directly. It relies on cloud-based agent capabilities .

---

## **PART 2: PLATFORM-SPECIFIC IMPLEMENTATIONS**

### **2.1 Claude Code (The Source of Truth)**

**Why Claude Code Leads:**

- **Progressive Disclosure:** 40x context efficiency (1,000 vs 40,000 tokens)
- **Native MCP:** Full tool restriction support (`allowed-tools`), subagent spawning
- **Hooks:** Pre/post-tool execution automation
- **Sync Tools:** Robust dotfiles/symlink ecosystem

**Hybrid Workflow Pattern:**

```yaml
# .claude/skills/deploy-azure/SKILL.md
---
name: deploy-azure
description: |
  **WORKFLOW SKILL** - Deploy to Azure using azd.
  USE FOR: "deploy", "azd up", "provision infrastructure".
  DO NOT USE FOR: general Azure queries (use azure-mcp directly).
  INVOKES: azure-mcp, github-mcp, slack-mcp.
---
## Workflow

1. **Validate** with azure-mcp → `validate-config`
2. **Deploy** with azure-mcp → `azd-up`
3. **Notify** via slack-mcp → `post-message`
```

**MCP Configuration (`.mcp.json`):**

```json
{
  "mcpServers": {
    "azure-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["@azure/mcp@latest"],
      "env": { "AZURE_TOKEN": "${AZURE_TOKEN}" }
    }
  }
}
```

### **2.2 ChatGPT Codex CLI**

**Key Differences:**

- **Discovery:** Scans `.agents/skills/` from CWD up to git root
- **UI Config:** `agents/openai.yaml` for display names, icons, colors
- **Invocation:** `$skill-name` or `/skills` selector
- **Implicit Control:** `allow_implicit_invocation: false` for manual-only skills

**Codex-Specific Structure:**

```
my-skill/
├── SKILL.md
└── agents/
    └── openai.yaml      # Required for Codex UI integration
```

**openai.yaml Example:**

```yaml
interface:
  display_name: 'Human-Friendly Name'
  short_description: 'UI tooltip text'
  icon_small: './assets/icon.svg'
  brand_color: '#3B82F6'
  default_prompt: 'Optional surrounding context'

policy:
  allow_implicit_invocation: false # Default: true

dependencies:
  tools:
    - type: 'mcp'
      value: 'github'
      description: 'GitHub integration'
```

**Scopes:** `REPO` (project), `USER` (global), `ADMIN` (system), `SYSTEM` (built-in)

### **2.3 Cursor IDE**

**Architecture:**

- **Rules-based:** Uses `.cursor/rules/*.mdc` files instead of native Skills
- **MCP Limits:** 40-tool maximum; sends first 40 to Agent
- **Parallel Agents:** Up to 8 simultaneous agents (unique feature)
- **Agent Mode:** Autonomous planning with tool use

**Converting Skills to Cursor Rules:**

```markdown
---
description: 'When to apply this rule'
globs: '**/*.ts' # Optional file pattern
alwaysApply: true # Auto-apply vs manual
---

# Rule Content

## MCP Tools Available

- Use @mcp-server-name for external tools

## Workflow

1. Step one
2. Step two
```

**MCP Configuration:**

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

**Best Practice:** Use Cursor for **highly parallel tasks** (8 agents), Claude Code for **complex reasoning workflows** .

### **2.4 Windsurf (Cascade)**

**Unique Features:**

- **Cascade Mode:** Hybrid chat/agent with implicit tool use
- **Follow-up Messages:** Hooks with `followup_message` for looping workflows
- **Global vs Workspace:** Clear separation of scopes

**Cascade-Specific Configuration:**

```yaml
# .windsurf/skills/my-skill/SKILL.md
---
name: my-skill
description: Guides deployment with safety checks
---
## Pre-deployment Checklist
1. Run tests via mcp-testing-server
2. Check uncommitted changes
```

**Invoking Skills in Windsurf:**

- **Automatic:** Cascade matches description to task
- **Manual:** Type `@skill-name` in Cascade input

### **2.5 GitHub Copilot Mobile**

**Critical Limitations:**

- ❌ **No MCP support:** Cannot connect to external MCP servers
- ❌ **No Skills:** No file system access for SKILL.md loading
- ❌ **Single Repo:** Cannot work across multiple repositories
- ✅ **Copilot Coding Agent:** Available on desktop/web with MCP support

**Mobile Strategy:**
Use Copilot Mobile for **quick reviews and questions**. For Skills/MCP workflows, switch to **Copilot in VS Code** (desktop) or **Claude Code mobile** (if available).

**Sunset Notice:** GitHub deprecated Copilot Extensions (GitHub Apps) in favor of MCP servers (Nov 2025) .

---

## **PART 3: CROSS-PLATFORM SYNC STRATEGY**

### **3.1 The Skillshare Approach**

Use **`skillshare`** CLI to sync Skills across all tools :

```bash
# Install
brew tap runkids/skillshare && brew install skillshare

# Setup source directory
skillshare init

# Add targets for each tool
skillshare target add claude ~/.claude/skills
skillshare target add codex ~/.codex/skills
skillshare target add windsurf ~/.codeium/windsurf/skills

# Sync everywhere
skillshare sync
```

**Features:**

- **Bidirectional:** Pull improvements back from any tool
- **Modes:** `merge` (safe), `copy` (overwrite), `symlink` (reference)
- **Project Skills:** `.skillshare/` per repo for team sharing

### **3.2 Dotfiles Strategy (Advanced)**

For power users, use **symlinks** with validation :

```bash
# Directory structure
~/dotfiles/
├── .claude/
│   ├── skills/          # Source of truth
│   ├── CLAUDE.md        # Global rules
│   └── preferences.md   # Working style
├── sync.sh              # Cross-machine sync
└── install.sh           # First-time setup
```

**Sync Logic:**

```bash
# Example: sync.sh snippet
ln -sf ~/dotfiles/.claude/skills/deploy-azure ~/.claude/skills/deploy-azure
ln -sf ~/dotfiles/.claude/skills/code-review ~/.claude/skills/code-review
```

**Per-Tool Mapping:**
| Tool | Symlink Target |
|------|---------------|
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` |
| Cursor | `~/.cursor/rules/` (convert .mdc) |

---

## **PART 4: HYBRID MCP + SKILLS ARCHITECTURE**

### **4.1 The "Three-Tier" Universal Pattern**

Apply this across all platforms:

```
┌───────────────────────────────────────────────────────┐
│  TIER 1: Universal Rules (CLAUDE.md / .cursorrules)   │
│  - Loaded every session                               │
│  - Platform constraints, coding standards             │
└───────────────────────┬───────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────┐
│  TIER 2: Skills (Workflow Orchestration)              │
│  - Progressive disclosure (~30-50 tokens idle)        │
│  - Business logic, decision trees, error handling     │
│  - INVOKES: MCP servers for external actions          │
└───────────────────────┬───────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────┐
│  TIER 3: MCP Servers (External Integration)           │
│  - JSON-RPC 2.0 protocol                              │
│  - API calls, database queries, file system           │
│  - Stateless, sandboxed (process isolation)           │
└───────────────────────────────────────────────────────┘
```

### **4.2 Cross-Platform Workflow Example**

**Scenario:** Deploy to production with safety checks

**Claude Code:**

```yaml
# .claude/skills/deploy-prod/SKILL.md
---
name: deploy-prod
description: |
  **WORKFLOW SKILL** - Deploy to production with safety checks.
  USE FOR: "deploy to prod", "production release".
  INVOKES: github-mcp, ci-mcp, pagerduty-mcp.
---
1. Check GitHub status with github-mcp → `get-repo-status`
2. Run CI checks with ci-mcp → `run-tests`
3. If tests pass, deploy with ci-mcp → `deploy`
4. Notify on-call with pagerduty-mcp → `trigger-incident` (if failure)
```

**Codex CLI:**
Same `SKILL.md` + `agents/openai.yaml` for UI:

```yaml
# agents/openai.yaml
interface:
  display_name: 'Production Deploy'
  icon_small: './assets/deploy.svg'
policy:
  allow_implicit_invocation: false # Require explicit approval
```

**Cursor:**
Convert to `.cursor/rules/deploy-prod.mdc`:

```markdown
---
description: 'When deploying to production'
globs: '**/deploy.yml'
alwaysApply: false
---

## Production Deployment Workflow

Use MCP tools:

1. @github-mcp check status
2. @ci-mcp run tests
3. @ci-mcp deploy (if tests pass)
```

**Windsurf:**
Same `SKILL.md` in `.windsurf/skills/`, invoke with `@deploy-prod`

---

## **PART 5: MOBILE & EDGE CASES**

### **5.1 Copilot Mobile Workarounds**

Since Copilot Mobile lacks Skills/MCP:

**Option A:** Use **GitHub Copilot in VS Code Desktop** with MCP
**Option B:** Use **Claude iOS/Android app** with Skills (if available)
**Option C:** Pre-process with Skills on desktop, review on mobile

### **5.2 Context Window Management**

| Platform        | Skills Idle         | MCP Overhead   | Optimization            |
| --------------- | ------------------- | -------------- | ----------------------- |
| **Claude Code** | ~30-50 tokens       | ~8K per server | Use 2-3 skills max      |
| **Codex**       | ~30-50 tokens       | ~8K per server | Progressive disclosure  |
| **Cursor**      | Rules always loaded | 40-tool limit  | Use `.mdc` with `globs` |
| **Windsurf**    | ~30-50 tokens       | SSE streaming  | Cascade manages context |

**Critical:** Loading >4 Skills shows diminishing returns (+5.9pp vs +18.6pp for 2-3) .

---

## **PART 6: SECURITY & GOVERNANCE**

### **6.1 Cross-Platform Security Matrix**

| Feature               | Claude Code             | Codex      | Cursor                   | Windsurf   | Copilot   |
| --------------------- | ----------------------- | ---------- | ------------------------ | ---------- | --------- |
| **Skill Sandboxing**  | ✅ Yes (OpenClaw/Cloud) | ✅ Yes     | ⚠️ No (full permissions) | ⚠️ No      | N/A       |
| **MCP Isolation**     | ✅ Process              | ✅ Process | ✅ Process               | ✅ Process | ❌ No MCP |
| **Tool Restrictions** | ✅ `allowed-tools`      | ❌ No      | ❌ No                    | ❌ No      | N/A       |
| **Enterprise SSO**    | ✅ SAML/OIDC            | ❌ No      | ❌ No                    | ❌ No      | ✅ Yes    |
| **Audit Logs**        | ✅ 30-day               | ❌ No      | ❌ No                    | ❌ No      | ✅ Yes    |

### **6.2 Supply Chain Safety**

**Risk:** 341 malicious skills identified (12% infection rate)

**Mitigation Strategy:**

1. **Vet Skills:** Review before installing (SKILL.md + scripts)
2. **Pin Versions:** Use `version` metadata (informational only, but trackable)
3. **MCP for External Calls:** Use MCP servers for network operations (isolated process) instead of Skills with `fetch` scripts
4. **Sync Validation:** Use `skillshare` security audit feature

---

## **PART 7: IMPLEMENTATION ROADMAP**

### **Week 1: Foundation**

1. **Choose Source of Truth:** Claude Code recommended for Skills
2. **Set up Sync:** Install `skillshare` or create dotfiles repo
3. **Create Universal Skills:** Start with 2-3 high-impact workflows
4. **Configure MCP:** Add 2-3 essential servers (GitHub, Linear, etc.)

### **Week 2: Platform Expansion**

1. **Codex:** Add `agents/openai.yaml` to existing Skills
2. **Cursor:** Convert Skills to `.mdc` rules
3. **Windsurf:** Test Cascade integration
4. **Document:** Map which Skills work on which platforms

### **Week 3: Optimization**

1. **Description Engineering:** Tune triggers for auto-invocation
2. **Context Profiling:** Measure token usage per platform
3. **Security Audit:** Review all Skills and MCP servers
4. **Team Onboarding:** Share `.skillshare/` repo

### **Week 4: Advanced Patterns**

1. **Subagents:** Implement in Claude Code for complex workflows
2. **Sampling:** Use MCP sampling for LLM-in-the-loop Skills
3. **Progressive Discovery:** Enable Tool Search (Jan 2026 spec)
4. **CI/CD Integration:** Automated testing of Skills

---

## **PART 8: QUICK REFERENCE**

### **8.1 Skill Trigger Cheat Sheet**

| Platform        | Explicit Invocation   | Implicit Trigger         | Mention Syntax |
| --------------- | --------------------- | ------------------------ | -------------- |
| **Claude Code** | `/skill-name`         | Auto (description match) | N/A            |
| **Codex**       | `/skills` then select | Auto (description match) | `$skill-name`  |
| **Cursor**      | Rules panel           | `alwaysApply: true`      | N/A            |
| **Windsurf**    | `@skill-name`         | Auto (description match) | `@skill-name`  |

### **8.2 MCP Server Recommendations**

| Use Case            | Recommended Server                    | Platforms                |
| ------------------- | ------------------------------------- | ------------------------ |
| **GitHub**          | `@modelcontextprotocol/server-github` | All                      |
| **Database**        | `mcp-server-sqlite` (local)           | Claude, Cursor, Windsurf |
| **Documentation**   | `mcp-server-fetch`                    | All                      |
| **Ticketing**       | `mcp-ticketer` (Linear/Jira)          | Claude                   |
| **Skill Discovery** | `mcp-skillset` (RAG-based)            | Claude                   |

### **8.3 File Conversion Matrix**

| From               | To                 | Tool/Method                     |
| ------------------ | ------------------ | ------------------------------- |
| Skill (SKILL.md)   | Cursor Rule (.mdc) | Manual: Add frontmatter, rename |
| Skill (SKILL.md)   | Codex Skill        | Add `agents/openai.yaml`        |
| Cursor Rule (.mdc) | Skill (SKILL.md)   | Remove frontmatter, add YAML    |
| MCP Tool           | Skill              | Wrap in SKILL.md workflow       |

---

## **CONCLUSION**

Your multi-platform setup requires a **hybrid strategy**:

1. **Claude Code** = Skills Source of Truth (most mature, progressive disclosure)
2. **MCP** = Cross-platform tool standard (connects all desktop tools)
3. **Skillshare/Dotfiles** = Synchronization layer (keeps all tools aligned)
4. **Copilot Mobile** = Limited to cloud features (use desktop for Skills/MCP)

**Golden Rule:** Skills encode **how** (procedural knowledge); MCP provides **what** (external access). Use both, sync across tools, and maintain Claude Code as your canonical reference.

**Sources:**
