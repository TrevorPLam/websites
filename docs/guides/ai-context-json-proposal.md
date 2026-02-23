<!--
/**
 * @file ai-context-json-proposal.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for ai context json proposal.
 * @entrypoints docs/guides/ai-context-json-proposal.md
 * @exports ai context json proposal
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

# ai-context-json-proposal.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Code Examples](#code-examples)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [2026 Standards Compliance](#2026-standards-compliance)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)

# AI Context JSON Proposal

> A proposal for a standardized `.well-known/ai-context.json` file that provides AI systems with explicit, machine-readable context about websites, applications, and services. This standard enables AI agents to understand the scope, capabilities, limitations, and interaction patterns of digital systems in a structured, predictable format.

## Overview

As AI agents and assistants become increasingly sophisticated in their interactions with digital systems, there's a growing need for explicit, standardized context about how these systems should interact with websites and applications. The `.well-known/ai-context.json` proposal addresses this by providing a standardized way for organizations to communicate their AI interaction policies, capabilities, and constraints to AI systems.

### Problem Statement

Currently, AI systems face several challenges when interacting with digital platforms:

- **Implicit Rules**: Interaction patterns are often undocumented and learned through observation
- **Scope Ambiguity**: Unclear what operations are permitted or intended
- **Capability Gaps**: AI systems don't know which features are available or optimized for AI interaction
- **Privacy Concerns**: Unclear data handling and retention policies
- **Context Limitations**: Difficulty understanding the purpose and boundaries of systems

### Solution Vision

The `.well-known/ai-context.json` file provides a standardized, machine-readable context definition that:

- **Explicitly defines** interaction capabilities and limitations
- **Communicates** privacy policies and data handling practices
- **Specifies** optimal interaction patterns and workflows
- **Establishes** scope boundaries and use case guidelines
- **Provides** technical requirements and constraints

## Specification

### File Location and Format

The AI context file should be served from:

```
https://domain.com/.well-known/ai-context.json
```

**Format**: JSON with UTF-8 encoding
**Content-Type**: `application/json`
**Caching**: Recommended cache-control of 1 hour with revalidation

### Core Schema

```json
{
  "$schema": "https://ai-context.org/schemas/v1.json",
  "version": "1.0.0",
  "metadata": {
    "generated_at": "2026-01-15T10:00:00Z",
    "expires_at": "2026-01-22T10:00:00Z",
    "generator": "organization-name/ai-context-generator@1.0.0"
  },
  "identity": {
    "name": "Example Service",
    "domain": "example.com",
    "type": "web-application",
    "description": "A web application for project management and collaboration",
    "version": "2.1.0",
    "languages": ["en", "es", "fr"],
    "contact": {
      "support": "support@example.com",
      "ai_inquiries": "ai@example.com",
      "security": "security@example.com"
    }
  },
  "capabilities": {
    "ai_optimized": true,
    "supported_interactions": [
      "data_retrieval",
      "content_creation",
      "task_management",
      "user_assistance"
    ],
    "authentication_methods": ["oauth2", "api_key", "session_based"],
    "data_formats": ["json", "markdown", "html", "plain_text"],
    "rate_limits": {
      "requests_per_minute": 100,
      "requests_per_hour": 1000,
      "burst_limit": 200
    },
    "features": {
      "natural_language_queries": true,
      "bulk_operations": true,
      "real_time_updates": false,
      "file_uploads": true,
      "export_capabilities": ["json", "csv", "pdf"]
    }
  },
  "constraints": {
    "scope": {
      "allowed_operations": ["read", "create", "update", "delete"],
      "restricted_areas": ["/admin", "/billing", "/user/settings/security"],
      "data_sensitivity": "mixed",
      "compliance_frameworks": ["GDPR", "CCPA", "SOC2"]
    },
    "privacy": {
      "data_retention": "30_days",
      "data_usage": "improvement_only",
      "third_party_sharing": false,
      "anonymization": true,
      "user_consent_required": true
    },
    "technical": {
      "max_payload_size": "10MB",
      "timeout": "30s",
      "concurrent_requests": 5,
      "supported_http_methods": ["GET", "POST", "PUT", "PATCH"],
      "authentication_required": true
    }
  },
  "interaction_patterns": {
    "preferred_workflows": [
      {
        "name": "project_setup",
        "description": "Create and configure new projects",
        "steps": [
          "validate_project_name",
          "create_project_structure",
          "configure_permissions",
          "notify_stakeholders"
        ],
        "estimated_time": "5-10 minutes"
      },
      {
        "name": "data_analysis",
        "description": "Analyze project data and generate insights",
        "steps": [
          "retrieve_dataset",
          "perform_analysis",
          "generate_report",
          "create_visualizations"
        ],
        "estimated_time": "2-5 minutes"
      }
    ],
    "communication_style": {
      "tone": "professional_but_friendly",
      "verbosity": "concise",
      "format_preference": "markdown",
      "include_explanations": true,
      "provide_examples": true
    },
    "error_handling": {
      "retry_strategy": "exponential_backoff",
      "max_retries": 3,
      "error_codes": {
        "rate_limit": "wait_and_retry",
        "authentication": "reauthenticate",
        "permission_denied": "escalate_to_user",
        "not_found": "suggest_alternatives"
      }
    }
  },
  "apis": {
    "rest": {
      "base_url": "https://api.example.com/v1",
      "documentation": "https://docs.example.com/api",
      "authentication": "Bearer token",
      "rate_limiting": {
        "headers": ["X-RateLimit-Remaining", "X-RateLimit-Reset"]
      }
    },
    "graphql": {
      "endpoint": "https://api.example.com/graphql",
      "schema_introspection": true,
      "documentation": "https://docs.example.com/graphql"
    },
    "webhooks": {
      "supported": true,
      "events": ["project.created", "task.completed", "user.updated"],
      "delivery_format": "json",
      "retry_policy": "3_attempts_with_backoff"
    }
  },
  "content_guidelines": {
    "supported_content_types": [
      "project_plans",
      "task_descriptions",
      "meeting_notes",
      "status_reports",
      "documentation"
    ],
    "formatting_requirements": {
      "max_length": "50000_characters",
      "allowed_formats": ["markdown", "plain_text", "html"],
      "forbidden_elements": ["scripts", "iframes", "external_links"]
    },
    "quality_standards": {
      "grammar_check": true,
      "spell_check": true,
      "readability_score": "grade_8_or_higher",
      "accessibility_compliance": "WCAG_2.1_AA"
    }
  },
  "monitoring": {
    "logging": {
      "ai_interactions": true,
      "performance_metrics": true,
      "error_tracking": true,
      "retention_period": "90_days"
    },
    "analytics": {
      "usage_tracking": true,
      "performance_monitoring": true,
      "user_satisfaction": false,
      "anonymization": true
    },
    "health_checks": {
      "endpoint": "/health",
      "includes_ai_status": true,
      "response_time_threshold": "500ms"
    }
  },
  "extensions": {
    "custom_fields": {
      "industry": "technology",
      "company_size": "enterprise",
      "integration_partners": ["slack", "microsoft_teams", "github"],
      "specialized_features": ["ai_code_review", "automated_testing"]
    },
    "experimental_features": {
      "beta_apis": true,
      "ai_model_switching": false,
      "custom_workflows": true
    }
  }
}
```

## Field Definitions

### Metadata Section

- **generated_at**: Timestamp when the file was generated
- **expires_at**: Timestamp when the context should be refreshed
- **generator**: Tool or system that generated the file

### Identity Section

- **name**: Human-readable name of the service
- **domain**: Primary domain the context applies to
- **type**: Type of service (web-application, api, mobile_app, etc.)
- **description**: Brief description of the service's purpose
- **version**: Current version of the service
- **languages**: Supported languages
- **contact**: Relevant contact information

### Capabilities Section

- **ai_optimized**: Whether the service is optimized for AI interactions
- **supported_interactions**: List of interaction types supported
- **authentication_methods**: Supported authentication approaches
- **data_formats**: Accepted data formats
- **rate_limits**: Rate limiting information
- **features**: Specific features and capabilities

### Constraints Section

- **scope**: Operational boundaries and restrictions
- **privacy**: Data handling and privacy policies
- **technical**: Technical limitations and requirements

### Interaction Patterns Section

- **preferred_workflows**: Recommended interaction workflows
- **communication_style**: Preferred communication approach
- **error_handling**: Error handling strategies

### APIs Section

- **rest**: REST API information
- **graphql**: GraphQL API information
- **webhooks**: Webhook capabilities and configuration

### Content Guidelines Section

- **supported_content_types**: Types of content that can be processed
- **formatting_requirements**: Content formatting requirements
- **quality_standards**: Quality and compliance standards

### Monitoring Section

- **logging**: Logging configuration and policies
- **analytics**: Analytics and monitoring setup
- **health_checks**: Health check configuration

### Extensions Section

- **custom_fields**: Organization-specific fields
- **experimental_features**: Beta or experimental capabilities

## Implementation Guidelines

### Best Practices

1. **Keep Current**: Regularly update the context file to reflect system changes
2. **Be Explicit**: Clearly define all capabilities and limitations
3. **Provide Examples**: Include concrete examples of preferred interactions
4. **Document Changes**: Maintain a changelog of context file updates
5. **Validate Schema**: Ensure the JSON follows the specified schema

### Security Considerations

- **Sensitive Data**: Never include API keys, passwords, or sensitive credentials
- **Access Control**: Ensure the context file is publicly accessible but doesn't reveal sensitive information
- **Rate Limiting**: Implement appropriate rate limiting for context file access
- **Monitoring**: Monitor access patterns to the context file for unusual activity

### Performance Optimization

- **Caching**: Use appropriate caching headers
- **Compression**: Enable gzip compression for the JSON file
- **CDN**: Serve from CDN for global performance
- **Size Optimization**: Keep the file size reasonable (target < 50KB)

## Use Cases

### AI Assistant Integration

AI assistants can use the context file to:

- Understand what operations are permitted
- Choose appropriate authentication methods
- Follow preferred interaction patterns
- Respect privacy and data handling policies

### Automated Workflows

Automated systems can:

- Discover available APIs and capabilities
- Implement proper error handling
- Optimize request patterns
- Comply with rate limiting requirements

### Development Tools

Development and integration tools can:

- Generate appropriate API clients
- Provide intelligent code completion
- Validate interaction patterns
- Suggest optimal workflows

## Relationship to Other Standards

### Complementary Standards

- **robots.txt**: Controls web crawler access
- **sitemap.xml**: Provides site structure for search engines
- **llms.txt**: Provides LLM-friendly content summaries
- **security.txt**: Security contact information

### Distinct Purpose

The `.well-known/ai-context.json` file specifically addresses:

- AI system interaction patterns
- Capability discovery and negotiation
- Privacy and data handling policies
- Technical constraints and requirements

## Adoption Strategy

### Phased Implementation

1. **Phase 1**: Basic identity and capability information
2. **Phase 2**: Detailed interaction patterns and workflows
3. **Phase 3**: Advanced monitoring and analytics configuration
4. **Phase 4**: Custom extensions and experimental features

### Community Engagement

- **Open Specification**: Community-driven development of the standard
- **Reference Implementations**: Sample implementations for common platforms
- **Validation Tools**: Tools to validate context file compliance
- **Documentation**: Comprehensive implementation guides

## Code Examples

### Complete AI Context JSON Example

```json
{
  "version": "1.0.0",
  "identity": {
    "name": "Project Management Platform",
    "description": "AI-powered project management and collaboration platform",
    "url": "https://app.example.com",
    "type": "web_application",
    "owner": {
      "name": "Example Corp",
      "contact": "ai-support@example.com",
      "website": "https://example.com"
    },
    "version": "2.4.1",
    "last_updated": "2026-02-23T10:00:00Z"
  },
  "capabilities": {
    "ai_optimized": true,
    "supported_interactions": [
      "data_retrieval",
      "content_creation",
      "task_management",
      "user_assistance"
    ],
    "authentication_methods": ["oauth2", "api_key", "session_based"],
    "data_formats": ["json", "markdown", "html", "plain_text"],
    "rate_limits": {
      "requests_per_minute": 100,
      "requests_per_hour": 1000,
      "burst_limit": 200
    },
    "features": {
      "natural_language_queries": true,
      "bulk_operations": true,
      "real_time_updates": false,
      "file_uploads": true,
      "export_capabilities": ["json", "csv", "pdf"]
    }
  },
  "constraints": {
    "scope": {
      "allowed_operations": ["read", "create", "update", "delete"],
      "restricted_areas": ["/admin", "/billing", "/user/settings/security"],
      "data_sensitivity": "mixed",
      "compliance_frameworks": ["GDPR", "CCPA", "SOC2"]
    },
    "privacy": {
      "data_retention": "30_days",
      "data_usage": "improvement_only",
      "third_party_sharing": false,
      "anonymization": true,
      "user_consent_required": true
    },
    "technical": {
      "max_payload_size": "10MB",
      "timeout": "30s",
      "concurrent_requests": 5,
      "supported_http_methods": ["GET", "POST", "PUT", "PATCH"],
      "authentication_required": true
    }
  }
}
```

### Implementation Examples

#### Node.js/Express Server

```javascript
// server.js
const express = require('express');
const path = require('path');

const app = express();

// Serve AI context file
app.get('/.well-known/ai-context.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-context.json'));
});

// Validate AI context requests
app.use('/api/ai/*', (req, res, next) => {
  const userAgent = req.get('User-Agent');
  if (!isValidAI(userAgent)) {
    return res.status(403).json({ error: 'AI agent not authorized' });
  }
  next();
});

function isValidAI(userAgent) {
  const aiAgents = ['claude', 'gpt', 'gemini', 'cursor', 'copilot'];
  return aiAgents.some((agent) => userAgent.toLowerCase().includes(agent));
}
```

#### Next.js API Route

```typescript
// pages/api/ai-context.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const aiContext = await import('../../../ai-context.json');
    res.status(200).json(aiContext.default);
  } catch (error) {
    res.status(500).json({ error: 'AI context not available' });
  }
}
```

#### Client-side Usage

```typescript
// ai-context-client.ts
interface AIContext {
  version: string;
  identity: {
    name: string;
    description: string;
    url: string;
    type: string;
  };
  capabilities: {
    ai_optimized: boolean;
    supported_interactions: string[];
    authentication_methods: string[];
  };
  constraints: {
    scope: {
      allowed_operations: string[];
      restricted_areas: string[];
    };
  };
}

class AIContextManager {
  private context: AIContext | null = null;
  private contextUrl: string;

  constructor(baseUrl: string) {
    this.contextUrl = `${baseUrl}/.well-known/ai-context.json`;
  }

  async loadContext(): Promise<AIContext> {
    if (this.context) return this.context;

    const response = await fetch(this.contextUrl);
    if (!response.ok) {
      throw new Error('Failed to load AI context');
    }

    this.context = await response.json();
    return this.context;
  }

  isOperationAllowed(operation: string): boolean {
    if (!this.context) return false;
    return this.context.constraints.scope.allowed_operations.includes(operation);
  }

  isAreaRestricted(area: string): boolean {
    if (!this.context) return true;
    return this.context.constraints.scope.restricted_areas.includes(area);
  }
}

// Usage
const aiManager = new AIContextManager('https://app.example.com');
const context = await aiManager.loadContext();
```

## Performance Optimization

### Caching Strategies

Implement efficient caching for AI context files:

```typescript
// ai-context-cache.ts
class AIContextCache {
  private cache = new Map<string, { data: AIContext; timestamp: number }>();
  private readonly CACHE_TTL = 300000; // 5 minutes

  async getContext(url: string): Promise<AIContext> {
    const cached = this.cache.get(url);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const response = await fetch(url);
    const context = await response.json();

    this.cache.set(url, { data: context, timestamp: now });
    return context;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
```

### Content Delivery Optimization

```javascript
// CDN configuration for AI context
const aiContextConfig = {
  '/.well-known/ai-context.json': {
    cacheControl: 'public, max-age=300', // 5 minutes
    edgeCache: true,
    compression: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  },
};
```

### Bundle Size Optimization

```typescript
// Minimal AI context client
interface MinimalAIContext {
  version: string;
  ai_optimized: boolean;
  supported_interactions: string[];
  rate_limits: {
    requests_per_minute: number;
  };
}

class LightweightAIManager {
  async getMinimalContext(url: string): Promise<MinimalAIContext> {
    const response = await fetch(`${url}?minimal=true`);
    return response.json();
  }
}
```

## 2026 Standards Compliance

### AI Integration Patterns

#### Multi-Agent Support

```json
{
  "ai_integration": {
    "supported_agents": [
      {
        "name": "Claude",
        "version": "3.5+",
        "capabilities": ["text_generation", "code_analysis", "file_operations"],
        "context_format": "json"
      },
      {
        "name": "GPT-4",
        "version": "turbo",
        "capabilities": ["text_generation", "function_calling", "web_browsing"],
        "context_format": "json"
      }
    ],
    "fallback_agent": "claude"
  }
}
```

#### Context Management

```json
{
  "context_management": {
    "hierarchical_loading": true,
    "priority_sections": ["identity", "capabilities", "constraints"],
    "optional_sections": ["extensions", "monitoring"],
    "compression": "gzip",
    "max_size": "50KB"
  }
}
```

### Multi-tenant Architecture

#### Tenant-Specific Context

```json
{
  "multi_tenant": {
    "supported": true,
    "tenant_context": {
      "enabled": true,
      "override_patterns": [
        "capabilities.rate_limits",
        "constraints.scope.restricted_areas",
        "privacy.data_retention"
      ],
      "tenant_identification": {
        "method": "subdomain",
        "fallback": "header"
      }
    }
  }
}
```

#### Isolation Patterns

```json
{
  "isolation": {
    "data_separation": true,
    "context_isolation": true,
    "rate_limiting_per_tenant": true,
    "audit_trail_per_tenant": true
  }
}
```

## Security Considerations

### Schema Validation

Use JSON Schema validation to ensure compliance:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AI Context JSON",
  "type": "object",
  "required": ["version", "identity", "capabilities", "constraints"],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    }
    // ... additional schema definitions
  }
}
```

### Testing Tools

- **Online Validator**: Web-based validation tool
- **CLI Tool**: Command-line validation for CI/CD integration
- **IDE Plugins**: Real-time validation in development environments
- **API Testing**: Automated testing of context file accessibility

## Future Enhancements

### Planned Features

- **Dynamic Context**: Support for context that changes based on user authentication
- **Multi-language**: Full internationalization support
- **Versioning**: Formal versioning and backward compatibility
- **Discovery**: Automatic discovery of related services and capabilities

### Extension Points

- **Industry-specific**: Extensions for specific industries (healthcare, finance, etc.)
- **Platform-specific**: Extensions for specific platforms (mobile, IoT, etc.)
- **Integration-specific**: Extensions for specific integration patterns

## References

- [AI Context JSON Specification](https://github.com/davidkimai/context.json) - Official specification and examples
- [Model Context Protocol](https://modelcontextprotocol.io/) - AI context management standards
- [Well-Known URIs (RFC 8615)](https://tools.ietf.org/html/rfc8615) - Standard for well-known URI paths
- [JSON Schema Specification](https://json-schema.org/) - Schema validation and structure
- [robots.txt Standard](https://www.robotstxt.org/) - Web crawler exclusion standard
- [llms.txt Specification](https://llmstxt.org/) - Large language model context standard
- [security.txt](https://securitytxt.org/) - Security information standard
- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-01) - Authentication framework
- [GDPR Compliance](https://gdpr.eu/) - Data protection regulations
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/) - Web accessibility standards
- [AI Integration Best Practices](https://github.com/openai/openai-cookbook) - OpenAI integration patterns
- [Multi-tenant Architecture Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) - Microsoft patterns
- [Performance Optimization](https://web.dev/performance/) - Web performance best practices
