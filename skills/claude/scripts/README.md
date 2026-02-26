# Claude Agent Scripts

This directory contains automation scripts for Claude agent environment setup, validation, and workflow orchestration following 2026 agentic coding standards.

## Available Scripts

### setup-claude-environment.mjs
Initializes the optimal Claude agent environment with proper configuration files and MCP integration patterns.

**Usage:**
```bash
node setup-claude-environment.mjs
```

**Creates:**
- `.claude/settings.json` - Claude agent preferences and MCP configuration
- `.claude/memory.json` - Memory system configuration with consent management
- `.claude/optimization.json` - Performance optimization patterns

### validate-claude-setup.mjs
Validates that the Claude agent environment is properly configured according to 2026 standards.

**Usage:**
```bash
node validate-claude-setup.mjs
```

**Validates:**
- Claude configuration files structure and content
- MCP server configuration and critical servers availability
- Memory system setup and consent settings
- Optimization settings for parallel execution
- Repository structure and code quality setup

### claude-workflow-orchestrator.mjs
Orchestrates complex workflows using Claude agents with MCP integration and parallel execution patterns.

**Usage:**
```bash
# List available workflows
node claude-workflow-orchestrator.mjs list

# Execute a workflow
node claude-workflow-orchestrator.mjs run research-implement-validate

# Check session status
node claude-workflow-orchestrator.mjs status

# Cancel active session
node claude-workflow-orchestrator.mjs cancel <session-id>
```

**Available Workflows:**
- `research-implement-validate` - Research problem, implement solution, validate results
- `code-review-security` - Comprehensive code review with security analysis
- `multi-tenant-setup` - Set up multi-tenant architecture with proper isolation

## Claude Agent Patterns

These scripts implement the following Claude-specific patterns:

### 1. Parallel Execution
- Maximum parallel tool calls for independent operations
- Batch similar operations together for efficiency
- Non-blocking workflow orchestration

### 2. Memory Management
- Four-layer memory architecture (working, conversation, task, long-term)
- Consent-based data collection and storage
- Pattern extraction and consolidation

### 3. MCP Integration
- Sequential-thinking for complex reasoning
- Knowledge-graph for persistent memory
- GitHub server for repository operations
- Documentation server for context retrieval

### 4. Error Handling
- Graceful failure with recovery strategies
- Exponential backoff for retry operations
- Comprehensive error classification and reporting

## Configuration

### Environment Variables
```bash
# GitHub authentication for MCP integration
GITHUB_TOKEN=your_github_token

# Azure authentication for deployment workflows
AZURE_TOKEN=your_azure_token

# Project management integration
LINEAR_TOKEN=your_linear_token
JIRA_TOKEN=your_jira_token
```

### Claude Settings
The `.claude/settings.json` file contains:
- Agent role and stack configuration
- MCP server preferences and parallel execution settings
- Memory system configuration with consent management
- Optimization patterns for performance

## Best Practices

### DO
- Use parallel execution whenever possible
- Implement proper error handling and recovery
- Follow security-first architecture patterns
- Use memory systems for persistent context
- Monitor performance and optimize bottlenecks

### DON'T
- Don't hardcode credentials or tokens
- Don't ignore error conditions
- Don't use blocking operations in parallel workflows
- Don't store sensitive data without consent
- Don't skip validation steps

## Troubleshooting

### Common Issues
1. **MCP Server Connection Failed**
   - Verify server configuration in `mcp/config/config.json`
   - Check environment variables for authentication
   - Ensure required MCP servers are installed

2. **Memory System Errors**
   - Validate `.claude/memory.json` structure
   - Check consent settings for data collection
   - Verify file permissions for `.claude/` directory

3. **Workflow Execution Failures**
   - Run validation script to check setup
   - Verify MCP server availability
   - Check workflow configuration and dependencies

### Debug Mode
Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

## Integration with IDE

These scripts are designed to work seamlessly with:
- Windsurf IDE with Claude integration
- Cursor AI with MCP support
- VS Code with Claude extensions

## References

- [Claude Agent Patterns Reference](../references/claude-agent-patterns.md)
- [MCP Integration Guide](../references/mcp-integration-guide.md)
- [2026 Agentic Coding Standards](../../../../docs/guides/)
- [Feature-Sliced Design v2.1](../../../../docs/guides/architecture/feature-sliced-design.md)
