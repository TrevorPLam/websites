# MCP AI Assistant Integration Guide

## Overview

This guide covers the integration of Model Context Protocol (MCP) servers with AI assistants including Cursor, Windsurf, and Claude Desktop for the marketing websites monorepo.

## Configuration Status

✅ **PRODUCTION READY** - All MCP servers are configured and tested
✅ **AI Assistant Compatible** - Configuration validated for Cursor, Windsurf, and Claude Desktop
✅ **Security Configured** - Directory restrictions and read-only defaults in place

## MCP Servers Configured

### 1. Filesystem Server
- **Package**: `@modelcontextprotocol/server-filesystem`
- **Purpose**: Secure file operations within the marketing websites directory
- **Security**: Read-only by default, directory restrictions enforced
- **Tools**: `read_file`, `write_file`, `list_directory`, `create_directory`

### 2. Git Server
- **Package**: `@modelcontextprotocol/server-git`
- **Purpose**: Git repository operations and version control
- **Security**: Push disabled by default, repository path restricted
- **Tools**: `git_status`, `git_add`, `git_commit`, `git_log`, `git_diff`

### 3. Everything Server
- **Package**: `@modelcontextprotocol/server-everything`
- **Purpose**: Reference/test server with basic utilities
- **Security**: Informational logging level
- **Tools**: `echo`, `add`, `subtract`, `multiply`, `divide`

## AI Assistant Integration

### Cursor Integration

1. **Configuration**: Cursor automatically detects `.mcp/config.json`
2. **Setup**: No additional configuration required
3. **Usage**: AI assistants can now access file system and git operations
4. **Security**: Respects all configured directory restrictions

```json
// Cursor automatically reads this configuration
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "c:\\dev\\marketing-websites"]
    }
  }
}
```

### Windsurf Integration

1. **Configuration**: Windsurf uses the same MCP configuration format
2. **Environment Variables**: Properly configured for security
3. **Usage**: Enhanced with environment-based security controls
4. **Features**: Supports multi-tenant development workflows

### Claude Desktop Integration

1. **Configuration File**: Create `~/.config/claude/claude_desktop_config.json`
2. **Format**: Standard MCP server configuration
3. **Usage**: Full AI assistant capabilities with file system access
4. **Security**: Inherits all security restrictions from MCP config

```json
// Claude Desktop configuration example
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "c:\\dev\\marketing-websites"],
      "env": {
        "ALLOWED_DIRECTORIES": "c:\\dev\\marketing-websites",
        "READ_ONLY_BY_DEFAULT": "true"
      }
    }
  }
}
```

## Security Features

### Directory Restrictions
- **Allowed Directories**: Limited to `c:\dev\marketing-websites`
- **Read-Only Default**: Filesystem operations default to read-only
- **Path Validation**: All paths validated against allowed directories

### Git Security
- **Push Disabled**: `ALLOW_PUSH: false` prevents accidental pushes
- **Repository Path**: Fixed to marketing websites directory
- **Operation Logging**: All git operations logged for audit

### Environment Controls
- **LOG_LEVEL**: Set to `info` for appropriate verbosity
- **Environment Variables**: Properly scoped and controlled
- **No Secret Exposure**: No environment variables contain secrets

## Testing and Validation

### Automated Tests

Two test suites are available:

1. **MCP Integration Tests** (`scripts/test-mcp-integration.js`)
   - Validates server startup
   - Tests configuration format
   - Verifies JSON-RPC communication

2. **AI Assistant Integration Tests** (`scripts/test-mcp-ai-integration.js`)
   - Tests Cursor compatibility
   - Tests Windsurf compatibility
   - Tests Claude Desktop compatibility
   - Validates real-world scenarios

### Running Tests

```bash
# Test MCP server functionality
node scripts/test-mcp-integration.js

# Test AI assistant integration
node scripts/test-mcp-ai-integration.js
```

## Usage Examples

### File Operations with AI Assistant

```
User: "Read the package.json file and analyze the dependencies"
AI: [Uses MCP filesystem server to read and analyze the file]
```

### Git Operations with AI Assistant

```
User: "Check the git status and commit any changes"
AI: [Uses MCP git server to check status and create commits]
```

### Code Analysis with AI Assistant

```
User: "Analyze the TypeScript files in the packages/ui directory"
AI: [Uses MCP filesystem server to read and analyze multiple files]
```

## Production Deployment

### Environment Setup

1. **Node.js**: Version 22.x required
2. **npm/npx**: Available in system PATH
3. **Directory Permissions**: Read access to marketing websites directory
4. **Network**: Internet access for npm package downloads

### Configuration Validation

```bash
# Validate MCP configuration
node scripts/test-mcp-integration.js

# Validate AI assistant integration
node scripts/test-mcp-ai-integration.js
```

### Monitoring and Maintenance

- **Server Logs**: Monitor MCP server startup and operation logs
- **Security Audit**: Regular review of directory restrictions
- **Package Updates**: Keep MCP servers updated to latest versions
- **Performance**: Monitor server response times and resource usage

## Troubleshooting

### Common Issues

1. **Server Not Starting**
   - Check Node.js version (requires 22.x)
   - Verify npx is in PATH
   - Check network connectivity for npm downloads

2. **Permission Denied**
   - Verify directory permissions
   - Check ALLOWED_DIRECTORIES configuration
   - Ensure read-only settings are appropriate

3. **AI Assistant Not Connecting**
   - Verify MCP configuration format
   - Check AI assistant MCP settings
   - Restart AI assistant after configuration changes

### Debug Commands

```bash
# Test MCP server manually
npx -y @modelcontextprotocol/server-filesystem "c:\dev\marketing-websites"

# Check configuration
cat .mcp/config.json

# Run test suites
node scripts/test-mcp-integration.js
node scripts/test-mcp-ai-integration.js
```

## Future Enhancements

### Planned Additions

1. **Database Server**: Add Supabase integration MCP server
2. **Analytics Server**: Add Google Analytics MCP server
3. **Deployment Server**: Add Vercel deployment MCP server
4. **Testing Server**: Add automated testing MCP server

### Integration Expansion

1. **More AI Assistants**: Support for additional AI assistants
2. **Advanced Security**: Role-based access control for MCP operations
3. **Performance Optimization**: Caching and optimization for large codebases
4. **Monitoring**: Advanced monitoring and alerting for MCP operations

## Conclusion

The MCP integration is production-ready and provides a solid foundation for AI assistant-enhanced development workflows. The configuration is secure, tested, and compatible with major AI assistants.

For support or issues, refer to the test results and troubleshooting sections above.
