---
name: api-connect
description: |
  **API INTEGRATION WORKFLOW** - Connect to REST APIs and web services.
  USE FOR: API integration, web service automation, data synchronization.
  DO NOT USE FOR: Simple HTTP requests, basic data fetching.
  INVOKES: [fetch, filesystem].
meta:
  version: '1.0.0'
  author: 'connect-ecosystem'
  category: 'integration'
---

# API Integration Workflow

## Overview

This Skill orchestrates API integration workflows including authentication, request handling, error management, and data synchronization across multiple services.

## Prerequisites

- API documentation and endpoints available
- Authentication credentials configured
- Rate limiting and throttling understood
- Data mapping and transformation rules defined
- Error handling and retry policies established

## Workflow Steps

### 1. Configure API Connection

**Action:** Set up API connection parameters and authentication

**Validation:**
- API endpoints accessible and responsive
- Authentication credentials valid
- Rate limits understood and configured
- Connection parameters validated

**MCP Server:** fetch (for API testing) or filesystem (for config files)

**Expected Output:** Validated API connection configuration

### 2. Implement Authentication

**Action:** Configure authentication method and credentials management

**Validation:**
- Authentication method supported by API
- Credentials properly stored and secured
- Token refresh mechanisms configured
- API key rotation policies applied

**MCP Server:** fetch (for auth testing) or filesystem (for credential storage)

**Expected Output:** Configured authentication with secure credential management

### 3. Handle API Requests

**Action:** Implement request handling with proper error management

**Validation:**
- Request format matches API requirements
- Headers and parameters properly formatted
- Error handling implemented for all scenarios
- Retry logic configured for transient failures

**MCP Server:** fetch (for API requests) or filesystem (for request templates)

**Expected Output:** Robust API request handling with error management

### 4. Process API Responses

**Action:** Process and transform API responses according to requirements

**Validation:**
- Response parsing successful
- Data transformation applied correctly
- Error responses handled appropriately
- Response validation rules applied

**MCP Server:** fetch (for response processing) or filesystem (for transformation logic)

**Expected Output:** Processed API responses ready for consumption

### 5. Synchronize Data

**Action:** Synchronize data between systems using API integration

**Validation:**
- Data mapping rules applied correctly
- Synchronization conflicts resolved
- Data integrity maintained
- Sync status tracked and reported

**MCP Server:** fetch (for sync operations) or filesystem (for data storage)

**Expected Output:** Synchronized data with conflict resolution

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Connection Setup | API unavailable | Use fallback endpoint | No |
| Authentication | Invalid credentials | Refresh tokens or use backup | No |
| Request Handling | Rate limiting | Implement backoff and retry | No |
| Response Processing | Invalid response | Use default response format | Partial |
| Data Sync | Data conflicts | Apply conflict resolution | Partial |

## Success Criteria

- API connection properly configured and validated
- Authentication implemented with secure credential management
- Request handling robust with comprehensive error management
- Response processing successful with data transformation
- Data synchronization completed with conflict resolution
- Integration monitoring and alerting configured

## Environment Variables

```bash
# Required
API_BASE_URL=https://api.example.com
API_VERSION=v1
AUTH_METHOD=bearer
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Optional
API_KEY=your_api_key
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
TOKEN_REFRESH_URL=https://auth.example.com/token
WEBHOOK_URL=https://your-app.example.com/webhook
```

## Usage Examples

### Agent Invocation Patterns

**For Claude/Windsurf:**

```text
claude, execute the api-connect workflow with the following parameters:
- api-endpoint: "https://api.example.com/users"
- auth-method: "bearer"
- data-sync: true
- error-retry: true
```

**For Cursor/Claude Code:**

```text
Execute skill api-connect with:
--api-endpoint=https://api.example.com/users
--auth-method=bearer
--data-sync=true
--error-retry=true
```

**Direct MCP Tool Usage:**

```text
Use the fetch MCP server for API requests and the filesystem server for configuration management.
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API unavailable | Check endpoint status and use fallback |
| Authentication failures | Verify credentials and refresh tokens |
| Rate limiting | Implement backoff strategies and respect limits |
| Data conflicts | Apply conflict resolution rules |
| Network issues | Use retry logic and alternative endpoints |

## Related Skills

- [webhook-setup](webhook-setup.md) - For webhook endpoint configuration
- [auth-manage](auth-manage.md) - For authentication management
- [rate-limit](rate-limit.md) - For rate limiting implementation

## References

- REST API documentation
- Authentication standards (OAuth 2.0, JWT)
- Rate limiting best practices
- Data synchronization patterns
