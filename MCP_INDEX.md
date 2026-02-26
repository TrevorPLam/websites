# MCP/Skills Workspace Index

## 🚀 Quick Start

### New to MCP?

- [Getting Started](docs/mcp/tutorials/getting-started.md) - Introduction to MCP
- [MCP Basics](docs/mcp/tutorials/mcp-basics.md) - Core concepts and terminology
- [First Skill](docs/mcp/tutorials/first-skill.md) - Create your first skill

### Setup & Configuration

- [Configuration Reference](docs/mcp/reference/configuration-reference.md) - Complete configuration guide
- [Environment Setup](docs/mcp/how-to/setup-configuration.md) - Development environment setup

## 📁 Workspace Structure

```
marketing-websites/
├── mcp/                     # MCP Infrastructure
│   ├── config/              # Configuration files
│   │   └── config.json      # Main MCP server configuration
│   ├── servers/             # MCP Server Implementations
│   │   └── src/             # Server source code
│   ├── apps/                # MCP Applications with UI
│   │   └── src/             # App source code
│   ├── docs/                # MCP Documentation (Diátaxis)
│   │   ├── tutorials/       # Learning-oriented
│   │   ├── how-to/         # Task-oriented
│   │   ├── reference/      # Information-oriented
│   │   └── explanation/    # Understanding-oriented
│   └── scripts/             # Automation Scripts
├── skills/                  # Skills Definition
│   ├── core/               # Essential workflows
│   ├── integration/        # Third-party integrations
│   ├── domain/             # Business-specific
│   ├── templates/          # Skill templates
│   ├── claude/             # Claude-specific skills
│   └── codex/              # Codex-specific skills
├── packages/                # Monorepo Packages
│   ├── agent-orchestration/ # Multi-agent orchestration
│   ├── agent-governance/    # Enterprise governance
│   ├── agent-tools/         # Tool contract system
│   ├── agent-memory/        # Advanced memory systems
│   └── context-engineering/ # Context engineering
└── MCP_INDEX.md             # This file
```

## 🎯 Skills

### Core Skills

Essential workflows for development and operations:

- [Deploy](skills/core/deploy/) - Application deployment workflows
- [Test](skills/core/test/) - Testing and validation workflows
- [Review](skills/core/review/) - Code review and quality checks

### Integration Skills

Third-party service integrations:

- [Azure](skills/integration/azure/) - Azure services integration
- [GitHub](skills/integration/github/) - GitHub operations and workflows
- [Slack](skills/integration/slack/) - Slack notifications and interactions

### Domain Skills

Business-specific operations:

- [Marketing](skills/domain/marketing/) - Marketing workflows and campaigns
- [Sales](skills/domain/sales/) - Sales processes and automation
- [Analytics](skills/domain/analytics/) - Data analysis and reporting

### Skill Templates

Reusable templates for creating new skills:

- [Workflow Template](skills/templates/workflow-skill.md) - Multi-step workflow template
- [Integration Template](skills/templates/integration-skill.md) - Service integration template

## 🖥️ MCP Servers

### Core Enterprise Servers

- [Enterprise Registry](mcp/servers/src/enterprise-registry.ts) - Server discovery and management
- [Enterprise Security Gateway](mcp/servers/src/enterprise-security-gateway.ts) - Zero-trust security enforcement
- [Enterprise Auth Gateway](mcp/servers/src/enterprise-auth-gateway.ts) - OAuth 2.1 authentication
- [Observability Monitor](mcp/servers/src/observability-monitor.ts) - Distributed tracing and monitoring

### AI & Reasoning Servers

- [Sequential Thinking](mcp/servers/src/sequential-thinking-fixed.ts) - Structured AI reasoning with debugging
- [Knowledge Graph Memory](mcp/servers/src/knowledge-graph-memory-fixed.ts) - Persistent memory and knowledge management
- [AI-DLC Methodology](mcp/servers/src/ai-dlc-methodology.ts) - AI-Driven Development Lifecycle
- [Advanced Agent Plugins](mcp/servers/src/advanced-agent-plugins.ts) - Specialized agent modules

### Integration Servers

- [GitHub Server](mcp/servers/src/github-server.ts) - GitHub API integration
- [Skillset Server](mcp/servers/src/skillset-server.ts) - Skills management and execution
- [Documentation Server](mcp/scripts/documentation-server.ts) - Documentation RAG and search

### Deployment & Orchestration Servers

- [Secure Deployment Manager](mcp/servers/src/secure-deployment-manager.ts) - Infrastructure deployment
- [Multi-Tenant Orchestrator](mcp/servers/src/multi-tenant-orchestrator.ts) - Tenant management
- [Enterprise MCP Marketplace](mcp/servers/src/enterprise-mcp-marketplace.ts) - Server marketplace
- [MCP Apps Marketplace](mcp/servers/src/mcp-apps-marketplace.ts) - Application marketplace

### External Servers (Configured)

- **Filesystem** - `@modelcontextprotocol/server-filesystem` - File system access
- **Git** - `@modelcontextprotocol/server-git` - Git repository operations
- **Everything** - `@modelcontextprotocol/server-everything` - General purpose tools
- **SQLite** - `mcp-server-sqlite` - Database operations
- **Fetch** - `mcp-server-fetch` - HTTP requests
- **Azure MCP** - `@azure/mcp@latest` - Azure services integration
- **Ticketer** - `mcp-ticketer` - Issue tracking (Linear/Jira)

## 📚 Documentation

### Tutorials (Learning-oriented)

Step-by-step guides for beginners:

- [Getting Started](mcp/docs/tutorials/getting-started.md) - MCP introduction and setup
- [MCP Basics](mcp/docs/tutorials/mcp-basics.md) - Core concepts and terminology
- [First Skill](mcp/docs/tutorials/first-skill.md) - Create your first skill
- [First Server](mcp/docs/tutorials/first-server.md) - Build your first MCP server

### How-To Guides (Task-oriented)

Practical guides for specific tasks:

- [Setup Configuration](mcp/docs/how-to/setup-configuration.md) - Environment setup
- [AI Integration](mcp/docs/how-to/ai-integration.md) - AI agent integration
- [Git Server Setup](mcp/docs/how-to/git-server-setup.md) - Git server configuration
- [Production Deployment](mcp/docs/how-to/production-deployment.md) - Production deployment
- [A2A Integration](mcp/docs/how-to/a2a-integration.md) - Agent-to-Agent protocol

### Reference (Information-oriented)

Technical specifications and APIs:

- [Configuration Reference](mcp/docs/reference/configuration-reference.md) - Complete configuration guide
- [Skill Format](mcp/docs/reference/skill-format.md) - Skill file format specification
- [Skills Guide](mcp/docs/reference/skills-guide.md) - Skills usage guide
- [Comprehensive Guide](mcp/docs/reference/comprehensive-guide.md) - Complete reference
- [Server API](mcp/docs/reference/server-api.md) - MCP server API documentation

### Explanation (Understanding-oriented)

Conceptual background and architecture:

- [Implementation Guide](mcp/docs/explanation/implementation-guide.md) - Implementation patterns
- [Advanced Research 2026](mcp/docs/explanation/advanced-research-2026.md) - Cutting-edge research
- [Agentic Coding Techniques](mcp/docs/explanation/agentic-coding-techniques.md) - AI coding patterns
- [Agent Skills Research](mcp/docs/explanation/agent-skills-research.md) - Skills research
- [Research Results](mcp/docs/explanation/research-results.md) - Research findings

## 🛠️ Scripts & Automation

### Setup Scripts

- [Setup (Unix)](mcp/scripts/setup.sh) - Unix/Linux setup script
- [Setup (Windows)](mcp/scripts/setup.bat) - Windows setup script

### Development Scripts

- [Development Workflow](mcp/scripts/dev-workflow.js) - Development automation
- [Setup Development](mcp/scripts/setup-development.js) - Development environment setup

### Testing Scripts

- [Test AI Integration](mcp/scripts/test-ai-integration.js) - AI integration testing
- [Test Development](mcp/scripts/test-development.js) - Development testing
- [Test Integration](mcp/scripts/test-integration.js) - Integration testing

### Validation Scripts

- [Validate Production](mcp/scripts/validate-production.js) - Production validation
- [Migration Script](mcp/scripts/migrate.sh) - Workspace migration
- [Validation Script](mcp/scripts/validate.sh) - Structure validation

### Performance Scripts

- [Performance Analysis](mcp/scripts/performance/performance-analysis.js) - Performance monitoring
- [Documentation Server](mcp/scripts/documentation-server.ts) - Documentation RAG server

## 📦 Packages

### MCP Infrastructure

- [MCP Servers](mcp/servers/) - Core MCP server implementations
- [MCP Applications](mcp/apps/) - Interactive MCP applications with UI

### 🤖 Agent Packages (2026 Agentic Coding)

These packages provide the foundational AI agent infrastructure that works with MCP:

#### Core Agent Framework

- [@repo/agent-orchestration](packages/agent-orchestration/) - Multi-agent orchestration with ACP communication
- [@repo/agent-governance](packages/agent-governance/) - Enterprise governance with policy-as-code
- [@repo/agent-tools](packages/agent-tools/) - Tool contract system with 2026 standards compliance
- [@repo/agent-memory](packages/agent-memory/) - Advanced memory systems (episodic, semantic, procedural)

#### Context & Intelligence

- [@repo/context-engineering](packages/context-engineering/) - Context engineering with budget management and anti-pollution

### MCP Apps (Interactive UI)

- [Interactive Dashboard](mcp/apps/src/interactive-dashboard.ts) - Real-time dashboards with bidirectional communication
- [MCP Apps Index](mcp/apps/src/index.ts) - Apps registry and management

### Integration Architecture

```
AI Agent Ecosystem:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Agent Orchestration│────│ MCP Servers      │────│ External Systems │
│   (Coordinator)   │    │ (Tools/Actions)  │    │ (GitHub/Azure)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Agent Governance │    │ Agent Skills     │    │ Agent Memory    │
│ (Policy/Security) │    │ (Workflows)      │    │ (Context/State) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Agent Tools      │    │ Context Engineering│    │ MCP Applications│
│ (Contracts/API)  │    │ (Budget/Optimize) │    │ (UI/Dashboards) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Configuration

### Main Configuration

- [config.json](mcp/config/config.json) - Primary MCP configuration with all servers

### Configuration Structure

The MCP configuration includes:

- **Enterprise Servers**: Registry, Security Gateway, Auth Gateway, Observability
- **AI & Reasoning**: Sequential Thinking, Knowledge Graph, AI-DLC Methodology
- **Integration**: GitHub, Skillset, Documentation
- **External Services**: Filesystem, Git, Everything, SQLite, Fetch, Azure, Ticketer

### Server Status

✅ **Production Ready**: Enterprise Registry, Security Gateway, Observability Monitor  
✅ **AI Enhanced**: Sequential Thinking (with debugging), Knowledge Graph Memory  
✅ **Integration Tested**: GitHub Server, Skillset Server, Documentation Server  
🔄 **In Development**: AI-DLC Methodology, Advanced Agent Plugins

### Environment Variables

Required environment variables for configured servers:

- `GITHUB_TOKEN` - GitHub API access
- `AZURE_TOKEN` - Azure services access
- `LINEAR_TOKEN` - Linear issue tracking
- `JIRA_TOKEN` - Jira issue tracking
- `REPO_PATH` - Repository path (default: current directory)

## 🚀 Getting Started

### 1. Clone and Setup

```bash
git clone <repository-url>
cd marketing-websites
pnpm install
```

### 2. Configure Environment

```bash
# Set required environment variables
export GITHUB_TOKEN="your-github-token"
export AZURE_TOKEN="your-azure-token"  # Optional
export LINEAR_TOKEN="your-linear-token"  # Optional
export JIRA_TOKEN="your-jira-token"  # Optional
```

### 3. Run Setup Script

```bash
# Unix/Linux
./mcp/scripts/setup.sh

# Windows
./mcp/scripts/setup.bat
```

### 4. Validate Configuration

```bash
./mcp/scripts/validate.sh
```

### 5. Start Development

```bash
pnpm dev
```

### 6. Test MCP Servers

```bash
# Test individual servers
npx tsx mcp/servers/src/sequential-thinking-fixed.ts

# Test with configuration
node mcp/scripts/test-integration.js
```

## 📖 Learning Path

### Beginner Path

1. [Getting Started](mcp/docs/tutorials/getting-started.md) - Learn MCP basics
2. [MCP Basics](mcp/docs/tutorials/mcp-basics.md) - Understand core concepts
3. [First Skill](mcp/docs/tutorials/first-skill.md) - Create your first skill
4. [First Server](mcp/docs/tutorials/first-server.md) - Build your first MCP server

### Intermediate Path

1. [Configuration Reference](mcp/docs/reference/configuration-reference.md) - Master configuration
2. [Skill Format](mcp/docs/reference/skill-format.md) - Understand skill format
3. [AI Integration](mcp/docs/how-to/ai-integration.md) - Integrate with AI agents
4. [Production Deployment](mcp/docs/how-to/production-deployment.md) - Deploy to production

### Advanced Path

1. [Implementation Guide](mcp/docs/explanation/implementation-guide.md) - Advanced patterns
2. [Advanced Research 2026](mcp/docs/explanation/advanced-research-2026.md) - Cutting-edge techniques
3. [Agentic Coding Techniques](mcp/docs/explanation/agentic-coding-techniques.md) - AI coding patterns
4. [A2A Integration](mcp/docs/how-to/a2a-integration.md) - Agent-to-Agent communication

## 🔍 Search & Discovery

### Find Skills

- Browse by [category](#-skills)
- Search in [skills/](skills/) directory
- Check [skill templates](skills/templates/) for examples
- Explore [Claude skills](skills/claude/) and [Codex skills](skills/codex/)

### Find Servers

- Browse [MCP servers](#-mcp-servers) list
- Check [mcp/servers/src/](mcp/servers/src/) directory
- See [server API](mcp/docs/reference/server-api.md) documentation

### Find Documentation

- Use [Diátaxis framework](#-documentation) navigation
- Search by topic in relevant sections
- Check [comprehensive guide](mcp/docs/reference/comprehensive-guide.md)

## 🤝 Contributing

### Add New Skill

1. Use [skill templates](skills/templates/) as starting point
2. Follow [skill format](mcp/docs/reference/skill-format.md) specification
3. Add to appropriate [category](#-skills) directory
4. Update documentation

### Add New Server

1. Follow [server patterns](mcp/servers/src/) in existing servers
2. Update [configuration](mcp/config/config.json) to include new server
3. Add [API documentation](mcp/docs/reference/server-api.md)
4. Update this index

### Improve Documentation

1. Follow [Diátaxis framework](#-documentation) guidelines
2. Update relevant sections
3. Add cross-references
4. Validate links

## 📞 Support & Help

### Common Issues

- [Troubleshooting Guide](mcp/docs/how-to/troubleshooting.md) - Common problems and solutions
- [FAQ](mcp/docs/explanation/faq.md) - Frequently asked questions

### Get Help

- Check [existing issues](https://github.com/your-org/marketing-websites/issues)
- Create [new issue](https://github.com/your-org/marketing-websites/issues/new)
- Join [discussions](https://github.com/your-org/marketing-websites/discussions)

### Community

- [Discord Server](https://discord.gg/your-server) - Real-time chat
- [Forum](https://forum.your-domain.com) - Discussion forum
- [Blog](https://blog.your-domain.com) - Latest updates and tutorials

## 📊 Metrics & Monitoring

### Workspace Health

- Run [validation script](mcp/scripts/validate.sh) to check structure
- Monitor [CI/CD pipeline](https://ci.your-domain.com) for build status
- Check [coverage reports](https://coverage.your-domain.com) for test coverage

### Performance Metrics

- MCP server response times
- Skill execution performance
- Documentation usage analytics
- Community engagement metrics

---

**Last Updated**: 2026-02-26  
**Version**: 2.0.0  
**Maintainers**: MCP Team

_This index is automatically generated and maintained. For updates, see the [contribution guidelines](#-contributing)._
