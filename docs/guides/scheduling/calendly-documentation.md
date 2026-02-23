# calendly-documentation.md

# Calendly API Documentation: Scheduling & Booking Integration

## Overview

Calendly's API platform enables developers to integrate automated scheduling directly into their applications. It provides tools for retrieving availability, sharing booking links, and programmatically creating events.

## Primary APIs

### 1. API v2 (REST)

The core REST API for managing users, organizations, and scheduled events. It uses JSON for data exchange and OAuth 2.0 or Personal Access Tokens for authentication.

- **Key Resource**: `https://api.calendly.com/v2`

### 2. Scheduling API

A high-level API designed for creating new Calendly events programmatically. This allow for native booking flows within an application without redirecting the user to the Calendly UI.

### 3. Embed API

Provides a seamless way to embed the Calendly booking interface into a website via an iFrame or a popup.

## Integration Patterns

### Webhooks for Real-Time Updates

Calendly Webhooks notify your application when an event is created, canceled, or rescheduled.

- **Supported Events**: `invitee.created`, `invitee.canceled`, `scheduling_site.setup`.

### Example: Creating a Webhook Subscription

```javascript
// Example: Registering a webhook in Calendly API v2
const axios = require('axios');

const registerWebhook = async () => {
  try {
    const response = await axios.post(
      'https://api.calendly.com/webhook_subscriptions',
      {
        url: 'https://your-app.com/webhooks/calendly',
        events: ['invitee.created', 'invitee.canceled'],
        organization: 'https://api.calendly.com/organizations/YOUR_ORG_ID',
        scope: 'organization',
      },
      {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Webhook registered:', response.data);
  } catch (error) {
    console.error('Error registering webhook:', error.response.data);
  }
};

registerWebhook();
```

## Best Practices

1. **OAuth for Multi-User Apps**: Always use OAuth 2.0 if your application will be used by multiple Calendly accounts.
2. **Error Handling**: Implement robust error handling for rate limits (429) and expired tokens (401).
3. **Availability Checks**: Use the `routing_forms` or `event_types` endpoints to determine which scheduling options should be presented to a user.

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Calendly Developer Portal](https://developer.calendly.com/)
- [Calendly API v2 Reference](https://developer.calendly.com/api-docs/ZG9jOjIxNzE2MDY-api-v2)
- [Calendly Embed API Documentation](https://developer.calendly.com/embed-api)
- [Calendly Webhooks Guide](https://developer.calendly.com/webhooks)

## Implementation

[Add content here]

## Testing

[Add content here]
