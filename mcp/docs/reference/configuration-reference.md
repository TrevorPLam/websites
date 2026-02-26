---
title: "MCP Configuration Reference"
category: "reference"
level: "comprehensive"
estimated_time: "20 minutes"
---

# MCP Configuration Reference

## Overview

Complete reference for Model Context Protocol (MCP) configuration options, server definitions, and environment variables.

## Configuration Files

### Main Configuration

**Location**: `.mcp/config.json`

**Purpose**: Primary configuration file defining all MCP servers and their settings.

### Environment-Specific Configuration

- `.mcp/config.development.json` - Development environment settings
- `.mcp/config.production.json` - Production environment settings
- `.mcp/.env.development` - Development environment variables
- `.mcp/.env.production` - Production environment variables

## Configuration Structure

### Top-Level Schema

```json
{
  "servers": {
    "server-name": {
      "command": "string",
      "args": ["string"],
      "env": {
        "variable": "value"
      },
      "disabled": false
    }
  },
  "global": {
    "timeout": 30000,
    "retries": 3,
    "log_level": "info"
  }
}
```

### Server Configuration

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `command` | string | Command to execute the server |
| `args` | array | Arguments passed to the command |

#### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `env` | object | `{}` | Environment variables for the server |
| `disabled` | boolean | `false` | Whether the server is disabled |
| `timeout` | number | `30000` | Server timeout in milliseconds |
| `retries` | number | `3` | Number of retry attempts |

## Server Types

### Built-in MCP Servers

#### Filesystem Server

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"],
    "env": {
      "ALLOWED_DIRECTORIES": "/path/to/directory",
      "READ_ONLY_BY_DEFAULT": "true"
    }
  }
}
```

**Environment Variables**:
- `ALLOWED_DIRECTORIES`: Comma-separated list of allowed directories
- `READ_ONLY_BY_DEFAULT`: Default read-only access (`true`/`false`)

#### Git Server

```json
{
  "git": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-git", "/path/to/repo"],
    "env": {
      "GIT_REPO_PATH": "/path/to/repo",
      "ALLOW_PUSH": "false"
    }
  }
}
```

**Environment Variables**:
- `GIT_REPO_PATH`: Path to Git repository
- `ALLOW_PUSH`: Allow push operations (`true`/`false`)

### Custom MCP Servers

#### Enterprise Registry

```json
{
  "enterprise-registry": {
    "command": "npx",
    "args": ["tsx", "packages/mcp-servers/src/enterprise-registry.ts"],
    "env": {
      "NODE_ENV": "production",
      "REGISTRY_PORT": "3000"
    }
  }
}
```

#### Sequential Thinking

```json
{
  "sequential-thinking": {
    "command": "npx",
    "args": ["tsx", "packages/mcp-servers/src/sequential-thinking.ts"],
    "env": {
      "LOG_LEVEL": "info",
      "MAX_STEPS": "50"
    }
  }
}
```

#### Enterprise Security Gateway

```json
{
  "enterprise-security-gateway": {
    "command": "npx",
    "args": ["tsx", "packages/mcp-servers/src/enterprise-security-gateway.ts"],
    "env": {
      "SECURITY_LEVEL": "high",
      "AUDIT_LOGGING": "true"
    }
  }
}
```

## Environment Variables

### Global Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node.js environment | `development` |
| `LOG_LEVEL` | Logging level | `info` |
| `MCP_TIMEOUT` | Global timeout | `30000` |
| `MCP_RETRIES` | Global retry count | `3` |

### Server-Specific Environment Variables

#### Security Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub API token | `ghp_xxxxxxxxxxxx` |
| `AZURE_CLIENT_ID` | Azure client ID | `xxxxxxxx-xxxx-xxxx-xxxx` |
| `SLACK_WEBHOOK` | Slack webhook URL | `https://hooks.slack.com/...` |

#### Performance Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MAX_CONCURRENT_REQUESTS` | Maximum concurrent requests | `10` |
| `CACHE_TTL` | Cache time-to-live | `300` |
| `RATE_LIMIT_RPS` | Rate limit per second | `100` |

## Security Configuration

### Authentication

```json
{
  "servers": {
    "secure-server": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-servers/src/secure-server.ts"],
      "env": {
        "AUTH_REQUIRED": "true",
        "AUTH_METHOD": "oauth2",
        "OAUTH2_CLIENT_ID": "your-client-id",
        "OAUTH2_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

### Encryption

```json
{
  "servers": {
    "encrypted-server": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-servers/src/encrypted-server.ts"],
      "env": {
        "ENCRYPTION_KEY": "your-encryption-key",
        "ENCRYPTION_ALGORITHM": "aes-256-gcm"
      }
    }
  }
}
```

## Performance Configuration

### Caching

```json
{
  "global": {
    "cache": {
      "enabled": true,
      "ttl": 300,
      "max_size": "100MB"
    }
  }
}
```

### Rate Limiting

```json
{
  "global": {
    "rate_limit": {
      "enabled": true,
      "requests_per_second": 100,
      "burst_size": 200
    }
  }
}
```

## Monitoring Configuration

### Health Checks

```json
{
  "servers": {
    "monitored-server": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-servers/src/monitored-server.ts"],
      "env": {
        "HEALTH_CHECK_ENABLED": "true",
        "HEALTH_CHECK_INTERVAL": "30",
        "METRICS_ENABLED": "true"
      }
    }
  }
}
```

### Logging

```json
{
  "global": {
    "logging": {
      "level": "info",
      "format": "json",
      "file": "/var/log/mcp.log",
      "max_file_size": "10MB",
      "max_files": 5
    }
  }
}
```

## Development Configuration

### Development Settings

```json
{
  "servers": {
    "dev-server": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-servers/src/dev-server.ts"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "true",
        "HOT_RELOAD": "true"
      }
    }
  }
}
```

### Testing Configuration

```json
{
  "servers": {
    "test-server": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-servers/src/test-server.ts"],
      "env": {
        "NODE_ENV": "test",
        "MOCK_EXTERNAL_APIS": "true",
        "TEST_TIMEOUT": "5000"
      }
    }
  }
}
```

## Production Configuration

### Production Settings

```json
{
  "servers": {
    "prod-server": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-servers/src/prod-server.ts"],
      "env": {
        "NODE_ENV": "production",
        "CLUSTER_MODE": "true",
        "GRACEFUL_SHUTDOWN_TIMEOUT": "30"
      }
    }
  }
}
```

### Scaling Configuration

```json
{
  "global": {
    "scaling": {
      "enabled": true,
      "min_instances": 2,
      "max_instances": 10,
      "target_cpu_utilization": 70
    }
  }
}
```

## Troubleshooting

### Common Configuration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Server won't start | Invalid command path | Check command and args |
| Permission denied | Insufficient permissions | Check file/directory permissions |
| Port already in use | Port conflict | Change port or kill conflicting process |
| Authentication failed | Invalid credentials | Check environment variables |

### Validation

```bash
# Validate configuration syntax
npx @modelcontextprotocol/cli validate .mcp/config.json

# Test server connectivity
npx @modelcontextprotocol/cli test server-name

# Check environment variables
npx @modelcontextprotocol/cli env check
```

## Best Practices

1. **Environment Separation**: Use separate configs for dev/staging/prod
2. **Secret Management**: Never commit secrets to version control
3. **Validation**: Validate configuration before deployment
4. **Monitoring**: Enable health checks and metrics in production
5. **Security**: Use HTTPS and authentication for external servers

## Migration Guide

### From Old Configuration

1. Backup existing configuration
2. Update to new schema format
3. Test with validation tools
4. Deploy incrementally

### Version Compatibility

| MCP Version | Config Version | Breaking Changes |
|-------------|----------------|------------------|
| 1.0 | 1.0 | None |
| 1.1 | 1.1 | Added timeout field |
| 1.2 | 1.2 | Added global settings |
