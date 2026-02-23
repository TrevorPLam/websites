<!--
/**
 * @file hubspot-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for hubspot documentation.
 * @entrypoints docs/guides/hubspot-documentation.md
 * @exports hubspot documentation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# hubspot-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


# HubSpot API Documentation: CRM Integration & Lead Management

## Overview

HubSpot provides a comprehensive suite of APIs for integrating with its CRM platform. For marketing and sales automation, the **Leads API** and **CRM Object API** are the primary tools for managing potential customers and synchronizing data between external platforms and HubSpot.

## Key APIs for Lead Management

### 1. Leads API (Released Aug 2024)

The Leads API is designed specifically for managing leads within the HubSpot CRM. It allows for creating, updating, and categorizing leads based on their engagement level.

- **Create a Lead**: `POST /crm/v3/objects/leads`
- **Update a Lead**: `PATCH /crm/v3/objects/leads/{leadsId}`

### 2. CRM Objects API

Manages standard objects such as **Contacts**, **Companies**, and **Deals**.

- **Contacts**: `POST /crm/v3/objects/contacts`
- **Companies**: `POST /crm/v3/objects/companies`

### 3. Associations API

Enables defining relationships between CRM records (e.g., associating a specific Contact with a Company).

## Property Management

Leads are categorized using standard properties:

- `hs_lead_name`: The name of the lead record.
- `hs_lead_label`: Categorizes leads as `Hot`, `Warm`, or `Cold`.
- `hs_lead_type`: Defines the lead source or intent (e.g., `New Business`, `Upsell`).

## Authentication & Security (2026 Updates)

HubSpot leverages **Private Apps** and **OAuth 2.0** for secure API access.

> [!IMPORTANT]
> **January 2026 Update**: HubSpot has introduced **OAuth v3 API Endpoints** and standardized error responses to enhance integration security and compliance.

### Legacy Support

- The **Contact Lists API (v1)** is scheduled for sunset on April 30, 2026. Developers must migrate to the **Lists v3 API**.

## Implementation Example: Syncing a Lead

```javascript
// Example: Creating a lead via HubSpot CRM API
const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({ accessToken: 'YOUR_ACCESS_TOKEN' });

const leadProperties = {
  hs_lead_name: 'John Doe - Inquiry',
  hs_lead_status: 'NEW',
  hs_lead_label: 'HOT',
};

const createLead = async () => {
  try {
    const apiResponse = await hubspotClient.crm.objects.basicApi.create('leads', {
      properties: leadProperties,
    });
    console.log(JSON.stringify(apiResponse, null, 2));
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
};

createLead();
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [HubSpot Developer Documentation](https://developers.hubspot.com/docs/api/overview)
- [HubSpot CRM Objects API Reference](https://developers.hubspot.com/docs/api/crm/objects)
- [HubSpot Leads API Guide](https://developers.hubspot.com/docs/api/crm/leads)
- [HubSpot OAuth v3 Migration Guide](https://developers.hubspot.com/docs/api/oauth-v3)


## Best Practices

[Add content here]


## Testing

[Add content here]
