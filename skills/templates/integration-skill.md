---
name: integration-template
description: |
  **INTEGRATION SKILL TEMPLATE** - Template for third-party service integrations.
  USE FOR: API integrations, external service workflows.
  DO NOT USE FOR: Internal processes.
  INVOKES: [service-specific-mcp, github].
meta:
  version: '1.0.0'
  author: 'your-name'
  category: 'integration'
---

# [Service Name] Integration

## Overview

This Skill integrates with [Service Name] for [purpose of integration].

## Authentication

### Required Credentials

- [API Key/Token]
- [OAuth scopes]
- [Service-specific requirements]

### Setup Instructions

1. [Setup step 1]
2. [Setup step 2]
3. [Setup step 3]

## API Configuration

```yaml
service_config:
  base_url: 'https://api.service.com/v1'
  timeout: 30000
  retries: 3
  rate_limit:
    requests_per_minute: 100
```

## Integration Workflow

### 1. Authentication Setup

**Action:** Authenticate with [Service Name]

** MCP Server:** [service-mcp]

**Parameters:**

- `api_key`: Service API key
- `scope`: Required OAuth scopes

### 2. Data Synchronization

**Action:** [What data to sync]

** MCP Server:** [service-mcp]

**Parameters:**

- `source`: Data source
- `target`: Target destination
- `sync_mode`: Full/incremental

### 3. Error Handling

**Action:** Handle API errors and retries

** MCP Server:** [service-mcp]

**Strategy:**

- Exponential backoff
- Rate limit handling
- Authentication refresh

## Data Mapping

| Source Field | Target Field | Transformation |
| ------------ | ------------ | -------------- |
| [field1]     | [field1]     | [transform]    |
| [field2]     | [field2]     | [transform]    |

## Rate Limiting

- **Limits:** [API rate limits]
- **Strategy:** [How to handle limits]
- **Backoff:** [Backoff strategy]

## Error Scenarios

### Authentication Errors

- **Cause:** Invalid/expired credentials
- **Solution:** Refresh authentication
- **Retry:** Yes, after auth refresh

### Rate Limit Errors

- **Cause:** Too many requests
- **Solution:** Implement backoff
- **Retry:** Yes, with exponential backoff

### Data Validation Errors

- **Cause:** Invalid data format
- **Solution:** Data transformation
- **Retry:** No, manual intervention required

## Monitoring

### Metrics to Track

- API call success rate
- Response times
- Error rates by type
- Data sync status

### Alerts

- High error rate (>5%)
- Authentication failures
- Rate limit breaches

## Testing

### Unit Tests

- Mock API responses
- Error handling scenarios
- Data transformation logic

### Integration Tests

- Live API calls (test environment)
- End-to-end workflows
- Error recovery scenarios

## Security Considerations

- **Credential Storage:** Use secure storage
- **Data Privacy:** Filter sensitive data
- **Audit Logging:** Log all API calls
- **Compliance:** [GDPR/HIPAA/etc]

## Troubleshooting

| Symptom | Cause   | Solution   |
| ------- | ------- | ---------- |
| [Issue] | [Cause] | [Solution] |
| [Issue] | [Cause] | [Solution] |

## References

- [Service API Documentation]
- [Authentication Guide]
- [Rate Limiting Documentation]
- [Best Practices Guide]
