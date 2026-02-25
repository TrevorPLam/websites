
***

# `.mcp.json` for Your Marketing Monorepo

Place this file at the **root of your repository** as `.mcp.json`. Claude Code auto-detects it here. For VS Code/Cursor, it can also live at `.vscode/mcp.json` or `~/.cursor/mcp.json` respectively.[1]

***

## Full Configuration

```json
{
  "mcpServers": {

    // ── VERSION CONTROL ─────────────────────────────────────────
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "."]
    },

    // ── DATABASE (Supabase + Postgres) ───────────────────────────
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest",
               "--access-token", "${SUPABASE_ACCESS_TOKEN}"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres",
               "${DATABASE_URL}"]
    },

    // ── CACHE / QUEUE ────────────────────────────────────────────
    "redis": {
      "command": "uvx",
      "args": ["mcp-server-redis"],
      "env": {
        "REDIS_URL": "${UPSTASH_REDIS_URL}"
      }
    },

    // ── PAYMENTS ─────────────────────────────────────────────────
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    },

    // ── FILE SYSTEM (monorepo-scoped) ────────────────────────────
    "filesystem": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-filesystem",
        "/absolute/path/to/your/repo"
      ]
    },

    // ── UI COMPONENTS ────────────────────────────────────────────
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "registry-mcp"]
    },

    // ── LIVE DOCUMENTATION (Next.js, Supabase, Tailwind, etc.) ───
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },

    // ── WEB SEARCH / RESEARCH ────────────────────────────────────
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },

    // ── BROWSER / E2E TESTING (Playwright) ──────────────────────
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright"]
    },

    // ── DOCKER / CONTAINERS ──────────────────────────────────────
    "docker": {
      "command": "npx",
      "args": ["-y", "@docker/mcp-server"]
    },

    // ── MONITORING / OBSERVABILITY ───────────────────────────────
    "sentry": {
      "command": "uvx",
      "args": ["mcp-server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "your-org-slug"
      }
    },

    // ── NEXT.JS APP STATE (official) ─────────────────────────────
    "nextjs": {
      "command": "npx",
      "args": ["-y", "next", "mcp", "--dir", "./apps/web"]
    }

  }
}
```

> ⚠️ **Note:** JSON does not support comments. Strip all `// ...` lines before using this file. They are included here for explanation only.

***

## Server-by-Server Rationale

Each server below maps directly to a specific part of your `THEGOAL.md` stack.

### Version Control — `github` + `git`

Your repo uses GitHub Actions heavily (14 workflow files, Dependabot, CODEOWNERS). The **GitHub MCP** gives your AI agent full access to PRs, issues, GitHub Actions pipeline status, and security alerts — critical for a repo with `ci-gates.yml`, `security-audit.yml`, and `tenant-isolation.yml`. The local **Git MCP** handles branch creation, diffs, and commit preparation without fragile shell parsing.[2][3]

### Database — `supabase` + `postgres`

Your entire backend is Supabase-native with 25+ migration files, complex RLS policies, and a `set_config` tenant context system. The **official Supabase MCP** enables natural-language schema management, migration generation, TypeScript type generation (`supabase gen types`), branch management, and log retrieval. The **Postgres MCP** complements it by providing direct read-only SQL access for ad hoc queries against your local Docker test DB (`docker-compose.test.yml`).[3][4][2]

### Cache — `redis`

Your stack uses **Upstash Redis** for rate limiting, session storage, and the critical tenant-domain → tenantId lookup cache in `packages/infrastructure/cache/`. The Redis MCP lets the AI inspect cache state, debug tenant context resolution issues, and verify rate limit counters without leaving the IDE.[2]

### Payments — `stripe`

You have Stripe deeply integrated across billing webhooks (`/api/webhooks/stripe/route.ts`), the Customer Portal widget, and `packages/integrations/adapters/stripe/`. The **Stripe MCP** allows the AI to inspect subscription states, simulate webhook events, and debug payment flows using natural language.[3][2]

### Filesystem — `filesystem`

Your 1,124-file monorepo has strict FSD boundaries enforced by `steiger.config.ts` and `madge.config.js`. Scoping the filesystem MCP to your repo root lets the AI read and write files while your `madge`/`steiger` rules remain the enforcement layer for import violations.[2]

### UI Components — `shadcn`

Your `packages/ui-primitives/` contains 60+ Radix + shadcn/ui components. The **shadcn Registry MCP** allows the AI to install new components with full dependency resolution, and you can add custom registries for Aceternity UI or Magic UI as needed for `packages/ui-marketing/` blocks.[5][2]

### Live Documentation — `context7`

Your stack spans **Next.js 16.1.5, React 19, Tailwind v4, TanStack Query, Clerk, Supabase JS, Vitest, Playwright, Turbo** — all rapidly evolving. Context7 uses semantic vector search to pull version-accurate, library-specific documentation directly into the AI's context, preventing hallucinations about API signatures that changed between major versions.[5][2]

### Web Search — `brave-search`

Useful for researching CVEs relevant to your security stack (your `.gitleaks.toml` tracks 78 patterns, and you have `middleware-security.spec.ts` testing for CVE-2025-29927), and for checking community solutions when hitting Turborepo or FSD edge cases.[2]

### Browser/E2E — `playwright`

Your `playwright.config.ts` defines three browser projects and your `tests/e2e/` suite covers golden-path flows for signup → lead → booking. The **Playwright MCP** lets the AI agent run, debug, and inspect your E2E tests — and it can directly interact with your `localhost:3000` dev server to verify UI changes.[2]

### Docker — `docker`

Your `docker-compose.test.yml` spins up Postgres 15, Redis, MinIO, Mailhog, Elasticsearch, and a mockserver. The Docker MCP lets the AI manage containers without shell wrangling — critical for the full integration test environment.[2]

### Monitoring — `sentry`

Your `packages/infrastructure/monitoring/sentry.ts` initializes Sentry, and `instrumentation.ts` registers it at Phase 0. The Sentry MCP lets the AI pull recent errors, trace issues to specific files, and correlate production incidents with code paths.[2]

### Next.js App State — `nextjs`

The **official Next.js MCP** (new as of Feb 2026) gives the AI agent direct access to your running app's route structure, server component state, and build output  — scoped to `./apps/web` per your monorepo layout.[6]

***

## Environment Variables to Add to `.env`

All secrets used by the MCP config should already exist in your documented 34-variable `.env.example`, but ensure these are present:[2]

```bash
# MCP-specific additions
GITHUB_TOKEN=ghp_...
SUPABASE_ACCESS_TOKEN=sbp_...        # Supabase Management API token
DATABASE_URL=postgresql://...         # Direct Postgres URL (for local docker)
UPSTASH_REDIS_URL=rediss://...
STRIPE_SECRET_KEY=sk_live_...
BRAVE_API_KEY=BSA...
SENTRY_AUTH_TOKEN=sntrys_...
```

Add `.mcp.json` to your `.gitignore` if it contains hardcoded secrets, or better — use the `${ENV_VAR}` interpolation syntax shown above and keep all secrets in `.env` (already gitignored per your config).[2]

Sources
[1] MCP Server for Next.js Supabase - MakerKit https://makerkit.dev/docs/next-supabase-turbo/installation/mcp
[2] THEGOAL.md https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/157523827/0972c835-7470-4934-81bf-131834e76613/THEGOAL.md
[3] The Best MCP Servers for Developers in 2026 - Builder.io https://www.builder.io/blog/best-mcp-servers-2026
[4] MCP Server | Supabase Features https://supabase.com/features/mcp-server
[5] The Best MCP Servers of 2025 - YouTube https://www.youtube.com/watch?v=kRxdsv1ZY1E
[6] Guides: Next.js MCP Server https://nextjs.org/docs/app/guides/mcp
[7] The 10 Best MCP Servers for Platform Engineers in 2026 - StackGen https://stackgen.com/blog/the-10-best-mcp-servers-for-platform-engineers-in-2026
[8] Next.js & Turborepo Claude Code Skill | AI Web Development https://mcpmarket.com/tools/skills/next-js-turborepo-stack
[9] Has anyone ever successfully setup Turborepo + NextJS + ... - Reddit https://www.reddit.com/r/Supabase/comments/1mwindm/has_anyone_ever_successfully_setup_turborepo/
[10] supabase-nextjs-server MCP Server - LobeHub https://lobehub.com/mcp/tengfone-supabase-nextjs-server
[11] AIBase: Best MCP Servers 2025 - Global MCP Server Directory https://mcp.aibase.com
[12] modelcontextprotocol/servers: Model Context Protocol ... - GitHub https://github.com/modelcontextprotocol/servers
[13] wong2/awesome-mcp-servers: A curated list of Model ... - GitHub https://github.com/wong2/awesome-mcp-servers
[14] 10 Microsoft MCP Servers to Accelerate Your Development Workflow https://developer.microsoft.com/blog/10-microsoft-mcp-servers-to-accelerate-your-development-workflow
[15] What's are the best MCP servers you guys are using? : r/cursor https://www.reddit.com/r/cursor/comments/1j1ovbr/whats_are_the_best_mcp_servers_you_guys_are_using/
[16] Top 12 MCP Servers for AI Models in 2025 - LinkedIn https://www.linkedin.com/posts/alexxubyte_systemdesign-coding-interviewtips-activity-7352362961673306114-Ri3o

***

# Model Context Protocol (MCP): Full Briefing

MCP — the **Model Context Protocol** — is an open standard and open-source framework developed by Anthropic and first released in November 2024 that standardizes how AI systems, particularly large language models (LLMs), connect to external tools, data sources, APIs, and automated workflows. It has rapidly become one of the most influential infrastructure protocols in the AI ecosystem heading into 2026.[1][2][3]

***

## The Core Problem MCP Solves

Before MCP, integrating LLMs with external services required brittle, bespoke "glue code" for every combination of model and tool — an **M × N integration problem**. Every new tool required a new custom adapter, with hardcoded auth tokens, inconsistent interfaces, and no shared protocol. MCP collapses this into an **M + N problem**: each model and each resource implements MCP once, and everything interoperates. Think of it as **USB-C for AI** — one clean plug standard for connecting models to everything they need.[4][5]

***

## Architecture

MCP is built on a three-tier architecture with a clean separation of concerns:[3]

- **Host Application** — The external system being exposed (e.g., a CMS, CRM, or IDE). It houses the LLM and orchestrates tasks.
- **MCP Client** — Embedded in the host; handles the protocol layer, connects to MCP servers, negotiates capabilities, routes requests, and parses responses.
- **MCP Server** — A self-contained service that wraps a specific tool, dataset, or API and exposes its capabilities to the client via a self-describing manifest.

All communication happens over **JSON-RPC 2.0** encoded as UTF-8. The connection is stateful and persistent — unlike REST APIs — which means sessions can maintain memory and context across multiple interactions.[6][7]

***

## The Four Primitive Capabilities

Each MCP server exposes up to four types of primitives to the connected AI model:[4]

- **Resources** — Read-only data sources (files, database tables, CRM records) the model can query but not modify; they are the model's "eyes and ears"
- **Tools** — Callable functions that execute real-world actions (write a file, send a message, trigger a transaction); most require explicit user approval before execution
- **Prompts** — Reusable instruction templates or embedded strategies that help structure how the model approaches specific tasks
- **Sampling** — A powerful advanced feature allowing MCP *servers* to request completions from the host's LLM, turning the model into a cognitive sub-service usable within larger agentic workflows

***

## Transport Mechanisms

As of the current MCP specification (revision **2025-11-25**), two standard transports are defined:[8]

- **stdio** — The default and preferred transport; the client launches the MCP server as a subprocess and communicates via `stdin`/`stdout` with newline-delimited JSON-RPC messages
- **Streamable HTTP** — For remote/multi-client deployments; uses HTTP POST and GET with optional Server-Sent Events (SSE) for server-to-client streaming; this replaced the older HTTP+SSE transport from the 2024-11-05 revision[9][8]

The previous SSE-only transport is now **deprecated**.[9]

***

## Configuration & The `.mcp.json` File

A critical aspect for developers is understanding the `.mcp.json` configuration format, which has emerged as a de facto standard across the ecosystem.[10]

### Standard Structure
```json
{
  "mcpServers": {
    "server-name": {
      "command": "executable",
      "args": ["arg1", "arg2"],
      "env": {
        "VAR": "value"
      }
    }
  }
}
```


### Client-Specific File Locations

| Client | Config File Path |
|---|---|
| Claude Desktop | `~/.claude/claude_desktop_config.json` [10] |
| Cursor | `~/.cursor/mcp.json` [10] |
| VS Code | `.vscode/mcp.json` (workspace-level) [11][10] |
| Visual Studio | Workspace `mcp.json` via GitHub Copilot [12] |

Tools like **FastMCP** can auto-generate this configuration via `fastmcp install mcp-json server.py` for any compatible client.[10]

***

## Ecosystem & Adoption

MCP is no longer just an Anthropic product — it has been adopted broadly across the AI industry:[6]

- **OpenAI** integrated MCP for Codex tool access[13]
- **Microsoft** integrated MCP into **Semantic Kernel** and VS Code/Visual Studio via GitHub Copilot[12][14]
- **50+ enterprise partners** including Salesforce, ServiceNow, Workday, Accenture, and Deloitte are implementing MCP for enterprise agentic workflows[6]
- The **MCP Registry** (launched preview September 2025) provides a community-driven platform for discovering and sharing MCP servers, progressing toward general availability[15]

***

## Official Roadmap (As of Late 2025)

The next release priorities announced by the MCP team are:[15]

- **Asynchronous Operations** — Adding async support for long-running tasks (minutes or hours) that don't block the client; tracked in SEP-1686
- **Statelessness & Scalability** — Smoothing horizontal scaling for enterprise deployments via Streamable HTTP improvements; tracked in SEP-1442
- **Server Identity via `.well-known` URLs** — Servers will be able to advertise their capabilities without requiring a live connection, enabling automatic registry cataloging and better agent card discovery
- **Official Extensions** — Curated, officially recognized protocol extensions for specific verticals (healthcare, finance, education) to prevent ecosystem fragmentation
- **SDK Tiering System** — A formal compliance and maintenance tiering for MCP SDKs in Python, TypeScript, C#, and others so developers know exactly what level of support to expect
- **MCP Registry GA** — Stabilizing the v0.1 API for production readiness

***

## Security: Critical Vulnerabilities & Risks

MCP's rapid adoption has introduced a serious attack surface that is actively being exploited in 2025–2026:[16]

### Primary Attack Vectors
- **Prompt Injection** — Attackers embed hidden malicious instructions within input prompts or external data, tricking the AI into executing unintended commands[16]
- **Tool Poisoning** — Malicious manipulation of a tool's metadata or descriptions causes the LLM agent to invoke compromised tools, enabling privilege escalation[16]
- **Rug Pull Attacks** — MCP servers can modify their tool definitions *between sessions*; a safe-looking tool approved on Day 1 can be silently rerouted to exfiltrate API keys by Day 7[17]
- **"Prompt Hijacking" (CVE-2025-6515)** — JFrog Security Research discovered a vulnerability in oatpp-mcp allowing attackers to hijack MCP session IDs and inject malicious code into development environments[18]
- **RCE via mcp-remote (CVE-2025-6514)** — A critical CVSS 9.6 vulnerability in mcp-remote versions 0.0.5–0.1.15 enables arbitrary OS command execution when MCP clients connect to untrusted servers; this is the **first documented full RCE in a real-world MCP deployment**[17]
- **The `eval()` Epidemic** — In February 2026, three separate MCP server CVEs were published to NVD, all sharing one root cause: unsafe `eval()` usage[19]
- **Over-Permissioned Tools** — Many MCP tools are granted excessive privileges (unrestricted filesystem R/W, network access, privileged API tokens), massively amplifying breach impact[16]
- **Supply Chain Attacks** — Fake or backdoored tools in MCP registries exploit the ecosystem's dependency on third-party servers[16]
- **Weak/Missing Authentication** — A BitSight TRACE report found roughly **1,000 exposed MCP servers** with no authorization in place[20]

### Key Mitigations
- Implement strict least-privilege tool permissions and scope all tool access by environment and credentials[3]
- Validate token issuance (avoid the "token passthrough" anti-pattern that creates confused deputy scenarios)[17]
- Pin MCP server versions and verify integrity before connecting to third-party servers[16]
- Gate all sensitive tool calls with explicit, real-time user approval workflows[4]

***

## MCP vs. Competing Approaches

| Dimension | Traditional API Integration | RAG | MCP |
|---|---|---|---|
| Tool Discovery | Manual, hardcoded | N/A | Dynamic, runtime, self-describing [4] |
| Statefulness | Stateless REST | Stateless | Stateful session [6] |
| Real-world Action | Possible but fragile | No | Yes — agents can modify systems [6] |
| Adding a New Tool | Requires new custom code | N/A | Connect an MCP server [4] |
| LLM Vendor Lock-in | High | Medium | None — model-agnostic [3] |
| Security Controls | Ad hoc | N/A | Built-in approval gating [4] |

***

## 2026 Outlook

Industry analysts are calling 2026 the year "AI stops being smart and starts being useful," specifically because MCP turns AI from a question-answering system into one that can take real, governed, auditable action in enterprise systems. New MCP spec features like the **"tasks" primitive** enable long-running asynchronous server-side capabilities that can trigger automatically on events rather than human prompts — enabling fully autonomous production incident response agents and similar agentic systems. With 50+ enterprise partners already committed and the MCP Registry moving to GA, the protocol is on track to become the dominant integration standard for agentic AI in 2026.[21][22][15][6]

Sources
[1] Introducing the Model Context Protocol - Anthropic https://www.anthropic.com/news/model-context-protocol
[2] The Model Context Protocol's impact on 2025 - Thoughtworks https://www.thoughtworks.com/en-us/insights/blog/generative-ai/model-context-protocol-mcp-impact-2025
[3] Model Context Protocol: The new AI connection standard - Contentful https://www.contentful.com/blog/model-context-protocol-introduction/
[4] Model Context Protocol (MCP) Comprehensive Guide for 2025 https://dysnix.com/blog/model-context-protocol
[5] The Complete Guide to Model Context Protocol https://machinelearningmastery.com/the-complete-guide-to-model-context-protocol/
[6] What is Model Context Protocol (MCP) - Benefits & Architecture 2026 https://onereach.ai/blog/what-to-know-about-model-context-protocol/
[7] Transports - Model Context Protocol https://modelcontextprotocol.io/specification/2025-03-26/basic/transports
[8] Transports - What is the Model Context Protocol (MCP)? https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
[9] Transport Overview | MCP Framework https://mcp-framework.com/docs/Transports/transports-overview/
[10] MCP JSON Configuration FastMCP https://gofastmcp.com/integrations/mcp-json-configuration
[11] MCP configuration reference - Visual Studio Code https://code.visualstudio.com/docs/copilot/reference/mcp-configuration
[12] Use MCP Servers - Visual Studio (Windows) | Microsoft Learn https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers?view=visualstudio
[13] Model Context Protocol - OpenAI for developers https://developers.openai.com/codex/mcp/
[14] Add and manage MCP servers in VS Code https://code.visualstudio.com/docs/copilot/customization/mcp-servers
[15] Roadmap - Model Context Protocol https://modelcontextprotocol.io/development/roadmap
[16] MCP Server Vulnerabilities 2026 - Prevent Prompt Injection Attacks https://www.practical-devsecops.com/mcp-security-vulnerabilities/
[17] Model Context Protocol Security: Critical Vulnerabilities Every CISO ... https://www.esentire.com/blog/model-context-protocol-security-critical-vulnerabilities-every-ciso-should-address-in-2025
[18] CVE-2025-6515: Prompt Hijacking Attack Affects MCP Ecosystem https://jfrog.com/blog/mcp-prompt-hijacking-vulnerability/
[19] The eval() Epidemic in MCP Servers: Three CVEs, One Root Cause https://dev.to/kai_security_ai/the-eval-epidemic-in-mcp-servers-three-cves-one-root-cause-2a1c
[20] Exposed MCP Servers: New AI Vulnerabilities & What to Do | Bitsight https://www.bitsight.com/blog/exposed-mcp-servers-reveal-new-ai-vulnerabilities
[21] AI Agents and MCP Protocol: Randy Bias 2026 Predictions - TFiR https://tfir.io/randy-bias-ai-agents-mcp-2026-predictions/
[22] Model Context Protocol (MCP): Why 2026 Will Be the Year “AI ... https://www.linkedin.com/pulse/model-context-protocol-mcp-why-2026-year-ai-stops-igor-van-der-burgh-zfghe
[23] What is MCP? Diving Deep into the Future of Remote AI Context https://konghq.com/blog/learning-center/what-is-mcp
[24] 2026 Guide to Securing MCP - Download now - Operant AI https://www.operant.ai/resources/2026-guide-to-securing-mcp
[25] Connect to local MCP servers - Model Context Protocol https://modelcontextprotocol.io/docs/develop/connect-local-servers
[26] Configuring MCP Tools in Claude Code - The Better Way https://scottspence.com/posts/configuring-mcp-tools-in-claude-code
[27] Model Context Protocol: Security Risks & Mitigations - SOC Prime https://socprime.com/blog/mcp-security-risks-and-mitigations/
[28] Three Flaws in Anthropic MCP Git Server Enable File Access and ... https://thehackernews.com/2026/01/three-flaws-in-anthropic-mcp-git-server.html
[29] MCP Security: Understanding Vulnerabilities in Model Context ... https://marmelab.com/blog/2026/02/16/mcp-security-vulnerabilities.html

Here is a complete, step-by-step guide to setting up and configuring an MCP server from scratch.

***

# Setting Up & Configuring an MCP Server

There are two distinct tasks here: **building** a custom MCP server (authoring tools your AI can call) and **connecting** a pre-built or third-party MCP server to your client. Both are covered below.

***

## Prerequisites

Before starting, you'll need:[1]
- **Python 3.10+** (for Python servers) or **Node.js 18+** (for TypeScript/JS servers)
- Basic familiarity with your language's package manager (`uv`/`pip` for Python, `npm`/`npx` for Node)
- An MCP host client installed: Claude Desktop, VS Code with GitHub Copilot, Cursor, or Windsurf

***

## Option A: Python Server (Recommended for Speed)

This follows the official MCP quickstart using **FastMCP**.[1]

### 1. Set Up the Environment

```bash
# Install uv (fast Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create and enter project directory
uv init weather
cd weather

# Create virtual env and install MCP
uv venv
source .venv/bin/activate
uv add "mcp[cli]" httpx

# Create your server file
touch weather.py
```


### 2. Initialize the Server

```python
from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize — give your server a name
mcp = FastMCP("weather")
```

FastMCP automatically generates tool definitions from Python type hints and docstrings, eliminating boilerplate.[1]

### 3. Define Tools with the `@mcp.tool()` Decorator

```python
@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Get weather forecast for a location.
    Args:
        latitude: Latitude of the location
        longitude: Longitude of the location
    """
    # ... fetch and return data
```

The docstring becomes the tool description the LLM reads to decide when to call the tool.[1]

### 4. Run the Server

```python
def main():
    mcp.run(transport="stdio")

if __name__ == "__main__":
    main()
```

Run with `uv run weather.py` to start listening for JSON-RPC messages.[1]

> ⚠️ **Critical logging gotcha**: For stdio-based servers, **never use `print()`** — it writes to `stdout` and corrupts JSON-RPC messages. Use `print("msg", file=sys.stderr)` or the `logging` module instead.[1]

***

## Option B: TypeScript/Node.js Server

### 1. Initialize the Project

```bash
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod dotenv
```


### 2. Create the Server

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
});

// Register a tool
server.tool(
  "myToolName",
  { param: z.string() },         // Zod schema for input validation
  async ({ param }) => {
    return {
      content: [{ type: "text", text: `Result: ${param}` }]
    };
  }
);

// Connect stdio transport
async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

init();
```


Use **Zod** for runtime input validation on all tool parameters — it prevents malformed inputs from crashing your server.[2][3]

***

## Registering Your Server with a Client

Once your server is running, you need to tell your MCP client how to launch it.

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):[1]

```json
{
  "mcpServers": {
    "weather": {
      "command": "uv",
      "args": [
        "--directory", "/absolute/path/to/weather",
        "run", "weather.py"
      ]
    }
  }
}
```

For Node.js servers, replace `uv` with `node` and `args` with the path to your compiled JS file. **Always use absolute paths** — relative paths cause silent failures.[3][1]

### VS Code (GitHub Copilot)

Create `.vscode/mcp.json` in your workspace root:[4]

```json
{
  "servers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/server.js"],
      "env": {
        "MY_API_KEY": "your-key-here"
      }
    }
  }
}
```

Or use the Command Palette shortcut: `Ctrl+Shift+P` → **MCP: Add Server** for a guided setup flow. You can also sync MCP configs across devices via VS Code Settings Sync by enabling the **MCP Servers** option.[5]

### Cursor

Create `~/.cursor/mcp.json` with the same `mcpServers` block format as Claude Desktop.[3]

### Command-Line Install (VS Code)

```bash
code --add-mcp '{"name":"my-server","command":"uvx","args":["mcp-server-fetch"]}'
```


***

## Using Pre-Built Third-Party Servers

You don't have to build from scratch. Many teams publish ready-to-use servers installable via `npx` or `uvx`:[5]

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_your_token" }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright"]
    }
  }
}
```


The `-y` flag auto-confirms the `npx` install so it runs without user prompts.

***

## Environment Variables & Secrets

Never hardcode API keys in config files. Pass them through the `env` block in your `mcp.json` or `claude_desktop_config.json`:[3]

```json
"env": {
  "GOOGLE_API_KEY": "your-key",
  "DATABASE_URL": "postgresql://..."
}
```

Inside your server code, read them with `process.env.GOOGLE_API_KEY` (Node) or `os.environ["GOOGLE_API_KEY"]` (Python).[3]

***

## Troubleshooting Common Issues

| Problem | Cause | Fix |
|---|---|---|
| Server not appearing in Claude | Relative path or JSON syntax error | Use absolute paths; validate JSON [1] |
| Tool calls failing silently | Server crashes on startup | Check `~/Library/Logs/Claude/mcp-server-*.log` (macOS) [1] |
| `stdout` corruption (Python) | `print()` writing to stdout in stdio mode | Use `sys.stderr` or `logging` [1] |
| Server works locally but not in client | Missing `env` vars in config | Add all required env vars to the config's `env` block [3] |
| Tool not being invoked | Poor tool name/description | Write clear, action-oriented docstrings — the LLM reads these to decide which tool to call [6] |

***

## Auto-Registration with `uv run mcp install`

For Python servers using `uv`, the fastest registration path is:[7]

```bash
uv run mcp install
```

This reads your `main.py`, auto-detects it as an MCP server, and writes the correct config to Claude Desktop automatically — no manual JSON editing needed.[7]

Sources
[1] Build an MCP server - Model Context Protocol https://modelcontextprotocol.io/docs/develop/build-server
[2] How to Build an MCP Server (Step-by-Step Guide) 2026 - Leanware https://www.leanware.co/insights/how-to-build-mcp-server
[3] Custom MCP Server with TypeScript - A Handbook for Developers https://www.freecodecamp.org/news/how-to-build-a-custom-mcp-server-with-typescript-a-handbook-for-developers/
[4] How to Set Up and Use an MCP Server: A Step-by-Step Tutorial https://www.workato.com/the-connector/mcp-server-tutorial/
[5] Add and manage MCP servers in VS Code https://code.visualstudio.com/docs/copilot/customization/mcp-servers
[6] Build Your First MCP Server in 6 Steps - Towards Data Science https://towardsdatascience.com/model-context-protocol-mcp-tutorial-build-your-first-mcp-server-in-6-steps/
[7] Build an MCP Server: Complete MCP Tutorial for Beginners https://www.codecademy.com/article/build-an-mcp-server
[8] Quickstart - Create a minimal MCP server and publish to NuGet - .NET https://learn.microsoft.com/en-us/dotnet/ai/quickstarts/build-mcp-server
[9] Build a Real-world MCP Server with One TypeScript File | Full Tutorial https://www.youtube.com/watch?v=kXuRJXEzrE0
[10] Ultimate Guide to Claude MCP Servers & Setup | 2026 - Generect https://generect.com/blog/claude-mcp/
[11] MCP developer guide | Visual Studio Code Extension API https://code.visualstudio.com/api/extension-guides/ai/mcp
[12] How to Set Up MCP Servers in VS Code - 2026 Guide - Fast.io https://fast.io/resources/vscode-mcp-server-setup/
[13] Building Your First MCP Server: A Beginners Tutorial https://dev.to/debs_obrien/building-your-first-mcp-server-a-beginners-tutorial-5fag
[14] How to Build Your Own MCP Server from Scratch [6 Steps] - Intuz https://www.intuz.com/blog/how-to-build-mcp-server
[15] MCP Setup for Claude - Cursor - Windsurf - VS Code in 4 mins https://www.youtube.com/watch?v=bhc9aXYhgzQ


Here is a thorough reference guide to the most common MCP server errors and their fixes.

***

# Common MCP Server Errors & Fixes

Most MCP server problems fall into four root-cause categories: configuration/connection errors, stdout protocol corruption, tool registration failures, and protocol version mismatches. The table below covers the most frequent symptoms encountered by developers, followed by deep-dives on each category.[1]

## Quick-Reference Error Table

| Symptom | Root Cause | Fix |
|---|---|---|
| `MCP server not found` at startup | Wrong binary path in config | Use absolute path in `claude_desktop_config.json` [2] |
| `Connection refused` | Port in use or server not started | Run `lsof -i :<port>` to find and free the port [2] |
| Tools missing from client | Config file not reloaded | **Fully restart** the client app — a window reload is not enough [2] |
| `Invalid JSON in config` | Trailing comma or missing brace | Validate with `jq . < config.json` [2] |
| `Permission denied` at startup | Binary not executable | Run `chmod +x /path/to/server` [2] |
| Timeout after 30 seconds | Server too slow to initialize | Add `"timeout": 60000` to server config [2] |
| `Protocol version not supported` | Client/server SDK version mismatch | Update MCP server SDK to >= 1.0 [2] |
| `Schema validation error` | Tool params don't match declared schema | Compare params against `/tools/list` output [2] |
| Intermittent `ECONNRESET` | Proxy or unstable network | Check `HTTP_PROXY` and `NO_PROXY` env vars [2] |
| Truncated responses | Response size limit hit | Add `"maxResponseSize": "10mb"` to server config [2] |
| `SIGTERM` crash on disconnect | No graceful shutdown handler | Implement `SIGTERM` handler in your server [2] |
| Tools listed but never invoked | Vague or ambiguous tool description | Rewrite docstrings to be action-specific and unambiguous [1] |

***

## Error 1: stdout Corruption (The Silent Killer)

This is the single most common and hardest-to-diagnose error in MCP. Since stdio transport uses `stdout` as the JSON-RPC pipe, **any non-protocol output written to stdout immediately corrupts the message stream** and causes the client to silently drop the connection.[1]

**Broken (Node.js):**
```js
console.log("Server started"); // ❌ writes to stdout — breaks protocol
```

**Broken (Python):**
```python
print("Server started")  # ❌ same problem
```

**Fixed (Node.js):**
```js
console.error("Server started"); // ✅ stderr is safe
```

**Fixed (Python):**
```python
import logging, sys
logging.basicConfig(level=logging.DEBUG, stream=sys.stderr)  # ✅
```

Set up structured stderr-only logging from day one:[1]
```js
const logger = {
  info: (msg, data) => console.error(`[INFO] ${msg}`, data || ''),
  error: (msg, err) => console.error(`[ERROR] ${msg}`, err?.stack || err || '')
};
```

***

## Error 2: Configuration & Path Errors

The most common startup failure is simply that the client can't find or launch the server process.[1]

**Checklist to run before anything else:**

```bash
# 1. Validate JSON syntax
cat ~/.claude/claude_desktop_config.json | jq .

# 2. Confirm the binary exists
which node
which npx
which python3

# 3. Test launching the server manually
node /absolute/path/to/server.js
# or
npx -y @modelcontextprotocol/server-filesystem /some/path
```

If the server starts manually but not from your client, the config path is wrong. The `mcpServers` block must be at the **root level** of the JSON document — if it's nested one level too deep, the client silently ignores it with no error.[2]

**Wrong (nested accidentally):**
```json
{
  "settings": {
    "mcpServers": { ... }  // ❌ wrong level — ignored silently
  }
}
```

**Correct:**
```json
{
  "mcpServers": { ... }  // ✅ must be at root
}
```

***

## Error 3: Tools Not Appearing

About 25% of new MCP users see their server start successfully but no tools show up in the client. There are three distinct sub-causes:[2]

- **Client not restarted** — After modifying `claude_desktop_config.json` or `.vscode/mcp.json`, you must do a **full application restart**, not just a window reload[2]
- **Empty `tools/list` response** — Your server is running but returns no tools; check that each tool is declared with `name`, `description`, and `inputSchema` in the schema[2]
- **`ListTools` method missing** — Some custom servers built without the SDK forget to implement the `tools/list` method handler; clients like Cursor will log `Error: No tools found`[3]

Verify your server properly exposes tools by running the MCP Inspector directly:

```bash
npx @modelcontextprotocol/inspector npx -y ./my-mcp-server.js
```

This opens a web UI at `http://localhost:6274` where you can manually trigger `tools/list` and inspect the raw JSON-RPC response.[2]

***

## Error 4: Tool Execution Failures & Unhandled Exceptions

When a tool runs but fails, an unhandled exception crashes the server process entirely, taking down all other tools with it. Wrap every single tool handler in a try/catch and return a proper `McpError` rather than letting the exception propagate:[1]

**Node.js pattern:**
```js
server.tool("fetchData", { url: z.string() }, async ({ url }) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { content: [{ type: "text", text: await res.text() }] };
  } catch (error) {
    console.error("fetchData error:", error);
    throw new McpError(McpErrorCode.ServerError, `Failed: ${error.message}`);
  }
});
```


**Python pattern:**
```python
@mcp.tool()
async def fetch_data(url: str) -> str:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.text
    except Exception as e:
        raise McpError(f"Tool failed: {str(e)}")
```

Use **Zod** (Node) or **Pydantic** (Python) for input validation at the tool boundary — this catches malformed inputs before they reach your logic and produces clean, descriptive errors back to the LLM.[1]

***

## Error 5: Protocol Version Mismatches

MCP uses **date-based versioning** (e.g., `2025-03-26`, `2025-11-25`). During the initialization handshake, the client proposes a version and the server must accept or counter-propose a compatible one. If they can't agree, the connection closes immediately after the handshake.[1]

Symptoms include:
- `Protocol version not supported`
- `Incompatible version`
- Connection drops with no error message within the first 200ms[1]

The MCP SDKs handle version negotiation automatically, so the fix is almost always just **updating your SDK**:

```bash
# Node.js
npm update @modelcontextprotocol/sdk

# Python
uv add --upgrade "mcp[cli]"
```

Node.js 22 LTS is the recommended runtime in 2026 — versions below Node.js 18 cause protocol incompatibilities.[2]

***

## Error 6: Windows-Specific stdio Failures

On Windows, `stdio` transport has a known silent failure mode where the server process is spawned but the pipe never connects, resulting in a 60-second timeout with empty logs. The root causes are:[4]

- `python` not resolving correctly in the PATH — use `python3` or the full path
- Shell quoting issues when using `cmd /c` wrappers
- Missing `sys.stdout.flush()` after every JSON write

**Windows config fix — use explicit Python path:**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "C:\\Users\\you\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
      "args": ["C:\\absolute\\path\\to\\server.py"]
    }
  }
}
```

And in your Python server, always flush stdout explicitly:[4]
```python
import sys, json

response = {"jsonrpc": "2.0", "result": ..., "id": req_id}
print(json.dumps(response))
sys.stdout.flush()  # ✅ required on Windows
```

***

## Error 7: Performance & Timeout Errors

The default MCP client timeout is **30 seconds** — any tool that doesn't respond within that window gets killed and the server may be marked as failed. Common causes and targeted fixes:[2]

- **Slow startup with large data loads** → use lazy/deferred loading so initialization is fast
- **No connection pooling** → reuse HTTP connections across tool calls; don't open a new one per request
- **Large responses** → paginate results and cap individual response size at ~1 MB[2]
- **No caching** → add a local cache with a 60-second TTL for repeated external API calls

Anthropic's own benchmarks target under **200ms** for 95% of MCP tool responses. You can measure yours with:[2]

```bash
time claude mcp test my-server --tool list_files --params '{"path": "."}'
```

***

## The MCP Diagnostic Command Sequence

Run these in order to resolve 85% of issues in under two minutes:[2]

```bash
# 1. Check Claude Code / client version
claude --version

# 2. See all servers and their live status
claude mcp list

# 3. View server-specific logs
claude mcp logs <server-name>

# 4. Ping server and verify tools list
claude mcp test <server-name>

# 5. Full config validation
claude config check

# 6. Enable verbose debug mode for deep inspection
CLAUDE_MCP_DEBUG=1 claude
```

For Claude Desktop on macOS, you can also tail server logs directly:
```bash
tail -f ~/Library/Logs/Claude/mcp-server-<server-name>.log
```

Sources
[1] Error Handling And Debugging MCP Servers - Stainless https://www.stainless.com/mcp/error-handling-and-debugging-mcp-servers
[2] Troubleshooting - MCP: Model Context Protocol - SFEIR Institute https://institute.sfeir.com/en/claude-code/claude-code-mcp-model-context-protocol/troubleshooting/
[3] MCP Servers No tools found - Bug Reports - Cursor https://forum.cursor.com/t/mcp-servers-no-tools-found/49094
[4] MCP Server Fails to Launch on Windows via stdio Transport #5462 https://github.com/RooCodeInc/Roo-Code/issues/5462
[5] When MCP Meets OAuth: Common Pitfalls Leading to One-Click ... https://www.obsidiansecurity.com/blog/when-mcp-meets-oauth-common-pitfalls-leading-to-one-click-account-takeover
[6] Debugging in Cursor with the Observe MCP Server: What I Learned https://www.observeinc.com/blog/debugging-in-cursor-with-observe-mcp-server
[7] A Developer's Guide to MCP Servers: Bridging AI's Knowledge Gaps https://konghq.com/blog/engineering/mcp-servers-guide
[8] Error executing MCP tool: Not connected · Issue #1082 - GitHub https://github.com/modelcontextprotocol/servers/issues/1082
[9] Sentry MCP and Cursor - How to Set Up https://blog.sentry.io/smarter-debugging-sentry-mcp-cursor/
[10] The Python MCP server with STDIO transport throws an 'Error https://stackoverflow.com/questions/79582846/the-python-mcp-server-with-stdio-transport-throws-an-error-sse-connection-not
[11] MCP Error: "could not connect to MCP server" : r/ClaudeAI - Reddit https://www.reddit.com/r/ClaudeAI/comments/1h18ep6/mcp_error_could_not_connect_to_mcp_server/
[12] MCP best practices and Live Debugger boost developer experience https://www.dynatrace.com/news/blog/mcp-best-practices-cline-live-debugger-developer-experience/
[13] MCP server instances not cleaned up in STDIO transport mode #9064 https://github.com/langflow-ai/langflow/issues/9064
[14] Unable to connect to MCP using STDIO transport! - Bug Reports https://forum.cursor.com/t/unable-to-connect-to-mcp-using-stdio-transport/86218
[15] Error “Could not connect to your MCP server” when integrating ... https://community.n8n.io/t/error-could-not-connect-to-your-mcp-server-when-integrating-external-tool-via-sse-in-ai-agent/100957
