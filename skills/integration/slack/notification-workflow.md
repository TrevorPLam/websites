---
name: notification-workflow
description: |
  **WORKFLOW SKILL** - Team notification and alert management workflows.
  USE FOR: "team notifications", "alert management", "status updates".
  DO NOT USE FOR: direct Slack API calls (use Slack integration directly).
  INVOKES: fetch, filesystem.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
  category: 'integration'
---

# Notification Workflow Automation

## Overview

This Skill orchestrates team notification workflows including status updates, alerts, deployment notifications, and team collaboration messages via webhook integrations.

## Prerequisites

- Webhook URLs configured for target services (Slack, Teams, Discord, etc.)
- Network access to external notification services
- Proper authentication tokens for notification services
- JSON payload format knowledge for target service

## Workflow Steps

### 1. Notification Preparation

**Action:** Prepare notification content and validate target service

- **Tool**: `filesystem` → `read-notification-template`
- **Purpose:** Load notification template and validate content
- **Validation:** Template exists and content is properly formatted
- **Failure:** Use default notification template

### 2. Message Formatting

**Action:** Format notification message for target service

- **Tool**: `filesystem` → `format-message-payload`
- **Purpose:** Convert message to service-specific JSON format
- **Validation:** Payload matches target service API requirements
- **Failure:** Use generic message format

### 3. Webhook Delivery

**Action:** Send notification via webhook to target service

- **Tool**: `fetch` → `send-webhook-notification`
- **Purpose:** Deliver formatted message to notification service
- **Validation:** Successful HTTP response from webhook
- **Failure:** Implement retry logic and fallback notifications

### 4. Delivery Confirmation

**Action:** Confirm notification delivery and log results

- **Tool**: `filesystem` → `log-notification-result`
- **Purpose:** Record delivery status and maintain audit trail
- **Validation:** Delivery log updated successfully
- **Failure:** Continue workflow, log logging failure

### 5. Error Handling

**Action:** Handle delivery failures and implement fallback strategies

- **Tool**: `fetch` → `retry-webhook-notification`
- **Purpose:** Retry failed notifications with exponential backoff
- **Validation:** Retry attempts exhausted or successful delivery
- **Failure:** Escalate to manual notification process

## Environment Variables Required

- `SLACK_WEBHOOK_URL`: Slack incoming webhook URL (optional)
- `TEAMS_WEBHOOK_URL`: Microsoft Teams webhook URL (optional)
- `DISCORD_WEBHOOK_URL`: Discord webhook URL (optional)
- `NOTIFICATION_SERVICE`: Default notification service (slack/teams/discord)
- `MAX_RETRY_ATTEMPTS`: Maximum retry attempts (default: 3)

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Template Load | Missing template | Use default template | No |
| Message Format | Invalid JSON | Use generic format | No |
| Webhook Delivery | HTTP error | Retry with backoff | No |
| Confirmation | Logging failure | Continue workflow | No |
| Retry Exhausted | All attempts failed | Escalate to manual | No |

## Success Criteria

- Notification content prepared and formatted correctly
- Webhook delivery successful or proper retry attempts made
- Delivery confirmation logged for audit trail
- Error handling implemented with fallback strategies
- Team receives timely notifications about workflow events

## MCP Server Dependencies

- `fetch`: HTTP requests for webhook delivery
- `filesystem`: Template management and logging

## Notification Templates

### Deployment Notification
```json
{
  "text": "🚀 Deployment Complete",
  "attachments": [
    {
      "color": "good",
      "fields": [
        {
          "title": "Environment",
          "value": "{{ENVIRONMENT}}",
          "short": true
        },
        {
          "title": "Version",
          "value": "{{VERSION}}",
          "short": true
        }
      ]
    }
  ]
}
```

### Alert Notification
```json
{
  "text": "🚨 System Alert",
  "attachments": [
    {
      "color": "danger",
      "fields": [
        {
          "title": "Alert Type",
          "value": "{{ALERT_TYPE}}",
          "short": true
        },
        {
          "title": "Severity",
          "value": "{{SEVERITY}}",
          "short": true
        }
      ]
    }
  ]
}
```

### Status Update
```json
{
  "text": "📊 Status Update",
  "attachments": [
    {
      "color": "warning",
      "fields": [
        {
          "title": "Service",
          "value": "{{SERVICE_NAME}}",
          "short": true
        },
        {
          "title": "Status",
          "value": "{{STATUS}}",
          "short": true
        }
      ]
    }
  ]
}
```

## Usage Examples

### Deployment Notification
```bash
# Send deployment notification
Agent: "Use notification-workflow to send deployment completion message"
```

### Alert Notification
```bash
# Send system alert
Agent: "Execute notification-workflow for critical system alert"
```

### Status Update
```bash
# Send status update
Agent: "Run notification-workflow to provide team status update"
```

## Integration Patterns

### Continuous Integration/Deployment
- Integrates with CI/CD pipelines for deployment notifications
- Supports automated build and deployment status updates
- Enables team awareness of system changes

### Monitoring and Alerting
- Works with monitoring systems for alert notifications
- Supports escalation procedures for critical issues
- Provides audit trail for all notifications

### Team Collaboration
- Facilitates team communication during incidents
- Supports automated status updates for long-running processes
- Enables cross-team coordination for complex workflows

## Service-Specific Configurations

### Slack Integration
- Uses Slack Incoming Webhooks API
- Supports rich message formatting with attachments
- Enables channel and user targeting
- Provides interactive message components

### Microsoft Teams Integration
- Uses Teams Incoming Webhooks API
- Supports Adaptive Cards for rich content
- Enables team and channel targeting
- Provides actionable message cards

### Discord Integration
- Uses Discord Webhooks API
- Supports embeds for rich content
- Enables channel and role targeting
- Provides custom avatar and username support

## Security Considerations

- Webhook URLs should be treated as sensitive credentials
- Use HTTPS for all webhook communications
- Implement rate limiting to prevent notification spam
- Validate webhook responses to prevent injection attacks
- Use environment variables for webhook URL storage

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook timeouts | Increase timeout values or check network connectivity |
| Invalid message format | Verify JSON payload matches service API requirements |
| Authentication failures | Check webhook URL validity and permissions |
| Rate limiting | Implement backoff strategies and respect service limits |
| Delivery failures | Check service status and webhook endpoint availability |

## Related Skills

- `azure-deploy`: Deployment workflows with notification integration
- `github-workflow`: Repository management with team notifications
- `production-deploy`: Production deployment with status updates

## References

- [Slack Webhooks API](https://api.slack.com/messaging/webhooks)
- [Teams Incoming Webhooks](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Webhook Security Best Practices](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/10-Testing_for_Insecure_Direct_Object_References)
