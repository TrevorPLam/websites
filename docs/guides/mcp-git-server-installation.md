# MCP Git Server Installation Guide

## What Is the MCP Git Server

The Model Context Protocol (MCP) is an open standard developed by Anthropic for connecting AI assistants to external tools and data sources via a structured RPC-over-stdio or HTTP interface. The **MCP Git server** (`mcp-server-git`) exposes your local Git repositories as a set of structured tools that any MCP-compatible AI client (Claude Desktop, VS Code Copilot, Continue.dev, Cursor, etc.) can call directly, allowing the AI to read diffs, make commits, search history, and manipulate branches without leaving the chat interface.[6][7]

The **GitHub MCP Server** (`@modelcontextprotocol/server-github`) is distinct — it connects to the GitHub API rather than local git and provides access to issues, PRs, file contents, and repo metadata via your Personal Access Token.[8][9][10]

## Available Tools in mcp-server-git

| Tool | Description | Key Inputs |
|------|-------------|------------|
| `git_status` | Working tree status (staged, unstaged, untracked) | `repo_path` |
| `git_diff_staged` | Diff of staged changes (pre-commit review) | `repo_path`, `context_lines` |
| `git_diff` | Diff between branches or commits | `repo_path`, `target` |
| `git_commit` | Stage all and commit with a message | `repo_path`, `message` |
| `git_add` | Add files to staging area | `repo_path`, `files[]` |
| `git_reset` | Unstage files | `repo_path` |
| `git_log` | Commit history | `repo_path`, `max_count` |
| `git_create_branch` | Create new branch | `repo_path`, `branch_name`, `base_branch` |
| `git_checkout` | Switch branches | `repo_path`, `branch_name` |
| `git_show` | Show commit contents | `repo_path`, `revision` |
| `git_init` | Initialize a new repository | `repo_path`, `bare` |
| `git_search_log` | Search commit messages by regex | `repo_path`, `pattern`, `max_count` |
| `git_read_file` | Read file at specific revision | `repo_path`, `file_path`, `ref` |

[6]

## Installation: mcp-server-git (Local Repos)

The server is a Python package installable via `uvx` (recommended for isolation) or `pip`:[6]

```bash
# Option A: uvx (no global install, runs in ephemeral venv) — RECOMMENDED
uvx mcp-server-git --help

# Option B: pip install into your environment
pip install mcp-server-git

# Option C: pip install into isolated venv
python -m venv ~/.venvs/mcp-git
~/.venvs/mcp-git/bin/pip install mcp-server-git
```

**Verify installation:**
```bash
uvx mcp-server-git --version
# or
mcp-server-git --version
```

## Configuration: Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/path/to/your/repo"]
    }
  }
}
```

To expose multiple repos, run multiple server entries with different names:

```json
{
  "mcpServers": {
    "git-main": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/path/to/project-a"]
    },
    "git-docs": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/path/to/project-b/docs"]
    }
  }
}
```

## Configuration: VS Code Copilot (Agent Mode)

Edit `.vscode/mcp.json` in your workspace root or open the MCP configuration from the Copilot chat panel:[11][8]

```json
{
  "servers": {
    "git-local": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "${workspaceFolder}"],
      "type": "stdio"
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

## Configuration: Continue.dev

In `.continue/config.json`:[12]

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "uvx",
          "args": ["mcp-server-git", "--repository", "/path/to/repo"]
        }
      }
    ]
  }
}
```

## Installation: GitHub MCP Server (Remote GitHub API)

This server connects to GitHub's API and requires a Personal Access Token:[10][8]

```bash
# Install via npm (required — this is a Node.js package)
npm install -g @modelcontextprotocol/server-github

# Or run without installing using npx
npx -y @modelcontextprotocol/server-github
```

**Create a PAT:** Go to `github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens`. Required scopes depend on your use case:
- **Read-only**: `contents:read`, `metadata:read`
- **Read + Write**: `contents:write`, `pull_requests:write`, `issues:write`

**Claude Desktop config:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

> **Security note:** Never commit your PAT to source control. Use environment variables loaded from `.env` (gitignored), your OS keychain, or a secrets manager. Rotate tokens every 90 days.

## Tool-Specific Configuration (GitHub MCP Server)

As of December 2025, the GitHub MCP server supports tool-specific configuration to minimize context window usage. You can selectively enable only the tools your workflow needs:[10]

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-github",
        "--toolsets", "repos,issues,pull_requests,code_security"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

Available toolsets: `repos`, `issues`, `pull_requests`, `code_security`, `experiments`, `actions`, `notifications`, `users`, `search`, `context`.

## Verifying Your Setup

After configuring, restart your AI client and test with a natural language prompt:
- "Show me the git status of this repository"
- "What changed in the last 5 commits?"
- "Create a branch named feat/docs-validation"

If the MCP server is connected, the AI will call the relevant tool and return structured results from your actual repo.

## References

[6] MCP Git Server documentation - https://github.com/modelcontextprotocol/servers
[7] Model Context Protocol specification - https://modelcontextprotocol.io/
[8] GitHub MCP Server - https://github.com/modelcontextprotocol/server-github
[9] GitHub API documentation - https://docs.github.com/en/rest
[10] MCP Server toolsets documentation - https://github.com/modelcontextprotocol/server-github#toolsets
[11] VS Code Copilot MCP integration - https://docs.github.com/en/copilot
[12] Continue.dev MCP documentation - https://docs.continue.dev/
