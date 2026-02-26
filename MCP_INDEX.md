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
mcp-skills-workspace/
├── .mcp/                    # MCP Configuration
│   ├── config.json          # Main configuration
│   ├── config.development.json
│   ├── config.production.json
│   └── manifests/            # Security & compliance
├── skills/                  # Skills Definition
│   ├── core/                 # Essential workflows
│   ├── integration/          # Third-party integrations
│   ├── domain/               # Business-specific
│   └── templates/            # Skill templates
├── packages/mcp-servers/     # MCP Server Implementation
├── packages/mcp-apps/        # MCP Applications with UI
├── docs/mcp/                 # Documentation (Diátaxis)
│   ├── tutorials/            # Learning-oriented
│   ├── how-to/              # Task-oriented
│   ├── reference/           # Information-oriented
│   └── explanation/        # Understanding-oriented
├── scripts/mcp/              # Automation Scripts
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

### Core Servers

- [Enterprise Registry](packages/mcp-servers/src/enterprise-registry.ts) - Server discovery and management
- [Security Gateway](packages/mcp-servers/src/enterprise-security-gateway.ts) - Zero-trust security enforcement
- [Observability Monitor](packages/mcp-servers/src/observability-monitor.ts) - Distributed tracing and monitoring

### AI & Reasoning Servers

- [Sequential Thinking](packages/mcp-servers/src/sequential-thinking.ts) - Structured AI reasoning
- [Knowledge Graph](packages/mcp-servers/src/knowledge-graph-memory.ts) - Memory and knowledge management

### Integration Servers

- [GitHub Server](packages/mcp-servers/src/github-server.ts) - GitHub API integration
- [Database Server](packages/mcp-servers/src/database-server.ts) - Database operations
- [Filesystem Server](packages/mcp-servers/src/filesystem-server.ts) - File system access

### Deployment Servers

- [Secure Deployment Manager](packages/mcp-servers/src/secure-deployment-manager.ts) - Infrastructure deployment
- [Multi-Tenant Orchestrator](packages/mcp-servers/src/multi-tenant-orchestrator.ts) - Tenant management

## 📚 Documentation

### Tutorials (Learning-oriented)

Step-by-step guides for beginners:

- [Getting Started](docs/mcp/tutorials/getting-started.md) - MCP introduction and setup
- [MCP Basics](docs/mcp/tutorials/mcp-basics.md) - Core concepts and terminology
- [First Skill](docs/mcp/tutorials/first-skill.md) - Create your first skill
- [First Server](docs/mcp/tutorials/first-server.md) - Build your first MCP server

### How-To Guides (Task-oriented)

Practical guides for specific tasks:

- [Setup Configuration](docs/mcp/how-to/setup-configuration.md) - Environment setup
- [AI Integration](docs/mcp/how-to/ai-integration.md) - AI agent integration
- [Git Server Setup](docs/mcp/how-to/git-server-setup.md) - Git server configuration
- [Production Deployment](docs/mcp/how-to/production-deployment.md) - Production deployment
- [A2A Integration](docs/mcp/how-to/a2a-integration.md) - Agent-to-Agent protocol

### Reference (Information-oriented)

Technical specifications and APIs:

- [Configuration Reference](docs/mcp/reference/configuration-reference.md) - Complete configuration guide
- [Skill Format](docs/mcp/reference/skill-format.md) - Skill file format specification
- [Skills Guide](docs/mcp/reference/skills-guide.md) - Skills usage guide
- [Comprehensive Guide](docs/mcp/reference/comprehensive-guide.md) - Complete reference
- [Server API](docs/mcp/reference/server-api.md) - MCP server API documentation

### Explanation (Understanding-oriented)

Conceptual background and architecture:

- [Implementation Guide](docs/mcp/explanation/implementation-guide.md) - Implementation patterns
- [Advanced Research 2026](docs/mcp/explanation/advanced-research-2026.md) - Cutting-edge research
- [Agentic Coding Techniques](docs/mcp/explanation/agentic-coding-techniques.md) - AI coding patterns
- [Agent Skills Research](docs/mcp/explanation/agent-skills-research.md) - Skills research
- [Research Results](docs/mcp/explanation/research-results.md) - Research findings

## 🛠️ Scripts & Automation

### Setup Scripts

- [Setup (Unix)](scripts/mcp/setup.sh) - Unix/Linux setup script
- [Setup (Windows)](scripts/mcp/setup.bat) - Windows setup script

### Development Scripts

- [Development Workflow](scripts/mcp/dev-workflow.js) - Development automation
- [Setup Development](scripts/mcp/setup-development.js) - Development environment setup

### Testing Scripts

- [Test AI Integration](scripts/mcp/test-ai-integration.js) - AI integration testing
- [Test Development](scripts/mcp/test-development.js) - Development testing
- [Test Integration](scripts/mcp/test-integration.js) - Integration testing

### Validation Scripts

- [Validate Production](scripts/mcp/validate-production.js) - Production validation
- [Migration Script](scripts/mcp/migrate.sh) - Workspace migration
- [Validation Script](scripts/mcp/validate.sh) - Structure validation

## 📦 Packages

### MCP Servers

- [@repo/mcp-servers](packages/mcp-servers/) - Core MCP server implementations

### MCP Applications

- [@repo/mcp-apps](packages/mcp-apps/) - Interactive MCP applications with UI

### 🤖 Agent Packages (2026 Agentic Coding)

These packages provide the foundational AI agent infrastructure that works with MCP:

#### Core Agent Framework

- [@repo/agent-orchestration](packages/agent-orchestration/) - Multi-agent orchestration with ACP communication
- [@repo/agent-governance](packages/agent-governance/) - Enterprise governance with policy-as-code
- [@repo/agent-tools](packages/agent-tools/) - Tool contract system with 2026 standards compliance
- [@repo/agent-memory](packages/agent-memory/) - Advanced memory systems (episodic, semantic, procedural)

#### Context & Intelligence

- [@repo/context-engineering](packages/context-engineering/) - Context engineering with budget management and anti-pollution

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

- [config.json](.mcp/config.json) - Primary MCP configuration
- [config.development.json](.mcp/config.development.json) - Development settings
- [config.production.json](.mcp/config.production.json) - Production settings

### Security & Compliance

- [Security Audit](.mcp/manifests/security-audit.json) - Security audit results
- [Supply Chain Safety](.mcp/manifests/supply-chain-safety.json) - Supply chain security
- [Trusted Manifest](.mcp/manifests/trusted-manifest.json) - Trusted components

## 🚀 Getting Started

### 1. Clone and Setup

```bash
git clone <repository-url>
cd marketing-websites
pnpm install
```

### 2. Run Setup Script

```bash
# Unix/Linux
./scripts/mcp/setup.sh

# Windows
./scripts/mcp/setup.bat
```

### 3. Validate Configuration

```bash
./scripts/mcp/validate.sh
```

### 4. Start Development

```bash
pnpm dev
```

## 📖 Learning Path

### Beginner Path

1. [Getting Started](docs/mcp/tutorials/getting-started.md) - Learn MCP basics
2. [MCP Basics](docs/mcp/tutorials/mcp-basics.md) - Understand core concepts
3. [First Skill](docs/mcp/tutorials/first-skill.md) - Create your first skill
4. [First Server](docs/mcp/tutorials/first-server.md) - Build your first server

### Intermediate Path

1. [Configuration Reference](docs/mcp/reference/configuration-reference.md) - Master configuration
2. [Skill Format](docs/mcp/reference/skill-format.md) - Understand skill format
3. [AI Integration](docs/mcp/how-to/ai-integration.md) - Integrate with AI agents
4. [Production Deployment](docs/mcp/how-to/production-deployment.md) - Deploy to production

### Advanced Path

1. [Implementation Guide](docs/mcp/explanation/implementation-guide.md) - Advanced patterns
2. [Advanced Research 2026](docs/mcp/explanation/advanced-research-2026.md) - Cutting-edge techniques
3. [Agentic Coding Techniques](docs/mcp/explanation/agentic-coding-techniques.md) - AI coding patterns
4. [A2A Integration](docs/mcp/how-to/a2a-integration.md) - Agent-to-Agent communication

## 🔍 Search & Discovery

### Find Skills

- Browse by [category](#-skills)
- Search in [skills/](skills/) directory
- Check [skill templates](skills/templates/) for examples

### Find Servers

- Browse [MCP servers](#-mcp-servers) list
- Check [packages/mcp-servers/](packages/mcp-servers/) directory
- See [server API](docs/mcp/reference/server-api.md) documentation

### Find Documentation

- Use [Diátaxis framework](#-documentation) navigation
- Search by topic in relevant sections
- Check [comprehensive guide](docs/mcp/reference/comprehensive-guide.md)

## 🤝 Contributing

### Add New Skill

1. Use [skill templates](skills/templates/) as starting point
2. Follow [skill format](docs/mcp/reference/skill-format.md) specification
3. Add to appropriate [category](#-skills) directory
4. Update documentation

### Add New Server

1. Follow [server patterns](packages/mcp-servers/) in existing servers
2. Update [configuration](.mcp/config.json) to include new server
3. Add [API documentation](docs/mcp/reference/server-api.md)
4. Update this index

### Improve Documentation

1. Follow [Diátaxis framework](#-documentation) guidelines
2. Update relevant sections
3. Add cross-references
4. Validate links

## 📞 Support & Help

### Common Issues

- [Troubleshooting Guide](docs/mcp/how-to/troubleshooting.md) - Common problems and solutions
- [FAQ](docs/mcp/explanation/faq.md) - Frequently asked questions

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

- Run [validation script](scripts/mcp/validate.sh) to check structure
- Monitor [CI/CD pipeline](https://ci.your-domain.com) for build status
- Check [coverage reports](https://coverage.your-domain.com) for test coverage

### Performance Metrics

- MCP server response times
- Skill execution performance
- Documentation usage analytics
- Community engagement metrics

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Maintainers**: MCP Team

_This index is automatically generated and maintained. For updates, see the [contribution guidelines](#-contributing)._
