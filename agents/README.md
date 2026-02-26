# 🤖 Agent Framework

## Overview

Comprehensive AI agent framework with orchestration, governance, memory, and tools for enterprise-grade agentic coding.

## Structure

```
agents/
├── core/                    # Context engineering & core systems
├── governance/              # Policy enforcement & security
├── memory/                  # Memory systems (episodic, semantic, procedural)
├── orchestration/           # Multi-agent coordination
└── tools/                   # Tool contracts & execution
```

## Packages

### Core Systems
- **Core** - Context engineering with budget management and anti-pollution
- **Governance** - Enterprise governance with policy-as-code enforcement
- **Memory** - Advanced memory systems for AI agents
- **Orchestration** - Multi-agent orchestration with ACP communication
- **Tools** - Production-ready tool contract system

## Quick Start

```bash
# Install all agent packages
pnpm add @repo/agent-core @repo/agent-governance @repo/agent-memory @repo/agent-orchestration @repo/agent-tools

# Setup agent infrastructure
pnpm build:agents
```

## Documentation

See individual package READMEs for detailed documentation.
