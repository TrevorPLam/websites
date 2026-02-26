# MCP Environment Variables

## Required Environment Variables

### GitHub Integration

- `GITHUB_TOKEN`: Personal access token for GitHub API access
  - Required for: GitHub MCP server
  - Permissions: repo (read), read:org, read:user
  - Create at: https://github.com/settings/tokens

### Brave Search

- `BRAVE_API_KEY`: API key for Brave Search service
  - Required for: Brave Search MCP server
  - Get API key at: https://brave.com/search/api/
  - Free tier: 2,000 queries per month

## Optional Environment Variables

### Enhanced Memory

- `MEMORY_FILE`: Path to memory storage file (default: `.mcp/memory.json`)
  - Used by: Memory MCP server
  - Automatically created if not exists

### Security Considerations

- Store sensitive tokens in system environment variables, not in `.env` files
- Use least-privilege scopes for GitHub tokens
- Rotate API keys regularly
- Monitor MCP server logs for unusual activity

## Server Descriptions

### Core Servers

- **dependency-graph**: Analyzes project dependencies and relationships
- **filesystem**: Safe file system access with directory restrictions
- **git**: Git operations and repository analysis
- **github**: GitHub API integration for issues, PRs, and repository data
- **brave-search**: Web search capabilities for current information
- **sequential-thinking**: Structured reasoning and planning
- **memory**: Persistent project context and learning

## Security Best Practices

1. **Read-First Default**: All servers start in read-only mode
2. **Scoped Access**: Each server limited to necessary directories
3. **Audit Logging**: Enable logging for all MCP interactions
4. **Token Rotation**: Regularly rotate GitHub and API tokens
5. **Network Security**: Use VPN or restricted network for sensitive operations

## Troubleshooting

### Common Issues

- **Permission Denied**: Check directory permissions for ALLOWED_DIRECTORIES
- **API Rate Limits**: Monitor Brave Search and GitHub API usage
- **Memory File**: Ensure `.mcp/` directory is writable
- **Git Operations**: Verify git repository is properly initialized

### Server Status

Check MCP server status with:

```bash
npx @modelcontextprotocol/cli list-servers
```

### Configuration Validation

Validate MCP configuration with:

```bash
npx @modelcontextprotocol/cli validate-config .mcp/config.json
```
