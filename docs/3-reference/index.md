---
diataxis: reference
audience: developer
last_reviewed: 2026-02-19
review_interval_days: 180
project: marketing-websites
description: Technical reference documentation
tags: [reference, api, configuration, components, technical]
primary_language: typescript
---

# Reference

Complete technical reference documentation for the marketing-websites platform.

## 🔍 Quick Reference

### Configuration
- **[Site Configuration](configuration/)** - Complete `site.config.ts` reference
- **[Environment Variables](environment/)** - All environment variables
- **[Package Configuration](packages/)** - Package-specific settings

### Components
- **[UI Components](components/)** - Complete component library
- **[Feature Components](features/)** - Business logic components
- **[Marketing Components](marketing-components/)** - Industry-specific components

### APIs
- **[Client API](api/client/)** - Client-side API reference
- **[Server API](api/server/)** - Server-side API reference
- **[Integration APIs](api/integrations/)** - Third-party service integrations

## 📚 Complete Reference

### Configuration Reference

#### [Site Configuration](configuration/)
Complete reference for `site.config.ts` and all configuration options.

**Key Sections:**
- [Basic Settings](configuration/basic/) - Site name, description, metadata
- [Theme Configuration](configuration/theme/) - Colors, typography, styling
- [Feature Toggles](configuration/features/) - Enable/disable features
- [Navigation](configuration/navigation/) - Site navigation setup
- [SEO Configuration](configuration/seo/) - Search engine optimization
- [Contact Information](configuration/contact/) - Contact details and forms

#### [Environment Variables](environment/)
All environment variables used by the platform.

**Categories:**
- [Development](environment/development/) - Local development variables
- [Production](environment/production/) - Production deployment variables
- [Integrations](environment/integrations/) - Third-party service credentials
- [Analytics](environment/analytics/) - Tracking and analytics variables

#### [Package Configuration](packages/)
Configuration for individual packages in the monorepo.

**Packages:**
- [@repo/ui](packages/ui/) - UI component library configuration
- [@repo/features](packages/features/) - Feature module configuration
- [@repo/infra](packages/infra/) - Infrastructure and security configuration
- [@repo/types](packages/types/) - Type definitions and schemas

### Component Reference

#### [UI Components](components/)
Complete reference for the UI component library.

**Categories:**
- [Forms](components/forms/) - Input, Button, Select, etc.
- [Layout](components/layout/) - Container, Grid, Stack, etc.
- [Navigation](components/navigation/) - Header, Footer, Breadcrumb, etc.
- [Feedback](components/feedback/) - Alert, Toast, Modal, etc.
- [Media](components/media/) - Image, Video, Icon, etc.

#### [Feature Components](features/)
Business logic components and features.

**Features:**
- [Booking](features/booking/) - Appointment booking system
- [Contact](features/contact/) - Contact forms and management
- [Blog](features/blog/) - Blog and content management
- [Services](features/services/) - Service listings and details
- [Search](features/search/) - Search functionality

#### [Marketing Components](marketing-components/)
Industry-specific marketing components.

**Industries:**
- [Salon & Spa](marketing-components/salon/) - Beauty industry components
- [Restaurant](marketing-components/restaurant/) - Food service components
- [Professional Services](marketing-components/professional/) - B2B service components
- [Healthcare](marketing-components/healthcare/) - Medical industry components
- [Retail](marketing-components/retail/) - E-commerce components

### API Reference

#### [Client API](api/client/)
Client-side API reference for browser usage.

**Endpoints:**
- [Configuration API](api/client/config/) - Site configuration access
- [Content API](api/client/content/) - Content management
- [Analytics API](api/client/analytics/) - Tracking and events
- [Form API](api/client/forms/) - Form submission and validation

#### [Server API](api/server/)
Server-side API reference for backend integration.

**Endpoints:**
- [Authentication](api/server/auth/) - User authentication
- [Data Management](api/server/data/) - CRUD operations
- [File Upload](api/server/upload/) - File handling
- [Webhooks](api/server/webhooks/) - Event handling

#### [Integration APIs](api/integrations/)
Third-party service integration APIs.

**Services:**
- [HubSpot](api/integrations/hubspot/) - CRM integration
- [Supabase](api/integrations/supabase/) - Database and auth
- [Analytics](api/integrations/analytics/) - Analytics platforms
- [Email](api/integrations/email/) - Email services
- [Payments](api/integrations/payments/) - Payment processing

### Development Reference

#### [TypeScript Reference](typescript/)
TypeScript patterns and type definitions.

**Topics:**
- [Type Definitions](typescript/types/) - Common type definitions
- [Utility Types](typescript/utilities/) - Helper types and functions
- [Patterns](typescript/patterns/) - Common TypeScript patterns
- [Best Practices](typescript/best-practices/) - TypeScript guidelines

#### [Styling Reference](styling/)
Complete styling and theming reference.

**Topics:**
- [Tailwind CSS](styling/tailwind/) - Tailwind configuration
- [Theme System](styling/themes/) - Theme customization
- [Responsive Design](styling/responsive/) - Breakpoint system
- [Animation](styling/animations/) - Animation utilities

#### [Testing Reference](testing/)
Testing patterns and utilities.

**Topics:**
- [Test Utilities](testing/utilities/) - Testing helper functions
- [Test Patterns](testing/patterns/) - Common testing patterns
- [Mock Data](testing/mocks/) - Mock data generation
- [Test Configuration](testing/config/) - Jest and testing setup

### Operations Reference

#### [Deployment Reference](deployment/)
Complete deployment and operations reference.

**Topics:**
- [Platforms](deployment/platforms/) - Supported deployment platforms
- [Configuration](deployment/config/) - Deployment configuration
- [Monitoring](deployment/monitoring/) - Performance and error monitoring
- [Troubleshooting](deployment/troubleshooting/) - Common deployment issues

#### [Security Reference](security/)
Security best practices and configurations.

**Topics:**
- [Authentication](security/auth/) - User authentication
- [Authorization](security/authorization/) - Access control
- [Data Protection](security/data/) - Data security and privacy
- [Compliance](security/compliance/) - Regulatory compliance

#### [Performance Reference](performance/)
Performance optimization and monitoring.

**Topics:**
- [Metrics](performance/metrics/) - Performance metrics and KPIs
- [Optimization](performance/optimization/) - Performance techniques
- [Monitoring](performance/monitoring/) - Performance monitoring tools
- [Benchmarks](performance/benchmarks/) - Performance benchmarks

## 🔧 Quick Lookups

### Common Tasks

| Task | Reference | Quick Link |
|------|-----------|------------|
| **Configure a new site** | [Site Configuration](configuration/) | [Basic Settings](configuration/basic/) |
| **Add a new component** | [UI Components](components/) | [Component Patterns](components/patterns/) |
| **Integrate a service** | [Integration APIs](api/integrations/) | [Integration Guide](api/integrations/guide/) |
| **Deploy to production** | [Deployment Reference](deployment/) | [Deployment Guide](deployment/guide/) |
| **Optimize performance** | [Performance Reference](performance/) | [Optimization Guide](performance/optimization/) |
| **Secure your site** | [Security Reference](security/) | [Security Checklist](security/checklist/) |

### Code Examples

#### Site Configuration
```typescript
// Basic site configuration
export const siteConfig = {
  siteName: "My Website",
  description: "A professional website",
  theme: {
    primaryColor: "174 100% 26%",
    secondaryColor: "210 100% 23%",
  },
  features: {
    hero: true,
    services: true,
    contact: true,
  },
};
```

#### Component Usage
```typescript
// Using UI components
import { Button, Input, Card } from "@repo/ui";

export default function ContactForm() {
  return (
    <Card>
      <Input placeholder="Your name" />
      <Input placeholder="Your email" type="email" />
      <Button>Send Message</Button>
    </Card>
  );
}
```

#### API Integration
```typescript
// Using the client API
import { useSiteConfig, submitContactForm } from "@repo/client-api";

export default function ContactPage() {
  const config = useSiteConfig();
  
  const handleSubmit = async (data) => {
    await submitContactForm(data);
  };
  
  return (
    <div>
      <h1>{config.siteName}</h1>
      {/* Contact form */}
    </div>
  );
}
```

## 📖 Glossary

### Key Terms

- **CaCA** - Configuration-as-Code Architecture
- **Client** - A specific website implementation
- **Feature** - A business logic component
- **Integration** - Third-party service connection
- **Package** - A reusable module in the monorepo
- **Template** - A pre-configured client setup
- **Theme** - Visual appearance configuration

### Acronyms

- **ADR** - Architecture Decision Record
- **API** - Application Programming Interface
- **CI/CD** - Continuous Integration/Continuous Deployment
- **CRUD** - Create, Read, Update, Delete
- **SEO** - Search Engine Optimization
- **UI** - User Interface
- **UX** - User Experience

## 🔍 Search and Navigation

### Finding Information

1. **By Category** - Use the navigation above to browse by topic
2. **By Component** - Look up specific components in the [Components](components/) section
3. **By API** - Find API endpoints in the [API Reference](api/) section
4. **By Task** - Use the [Common Tasks](#common-tasks) table for quick access

### Search Tips

- **Component Names** - Search for component names (e.g., "Button", "Input")
- **Configuration** - Search for config options (e.g., "theme", "features")
- **API Endpoints** - Search for API terms (e.g., "auth", "submit")
- **Error Messages** - Search for error text to find troubleshooting guides

## 📚 Related Documentation

### For Learning
- **[Getting Started](../1-getting-started/)** - Beginner's guide
- **[Tutorials](../5-tutorials/)** - Step-by-step tutorials
- **[Guides](../2-guides/)** - How-to guides

### For Understanding
- **[Architecture](../4-explanation/)** - System design and principles
- **[Decision Records](../4-explanation/adr/)** - Architecture decisions
- **[Performance](../4-explanation/performance/)** - Performance strategies

### For Reference
- **[API Documentation](api/)** - Complete API reference
- **[Component Library](components/)** - All components
- **[Configuration Options](configuration/)** - All settings

## 🤝 Contributing

### Adding to Reference

Found missing information? We'd love your help!

1. **Create an Issue** - Report missing documentation
2. **Submit a PR** - Add the missing reference content
3. **Review Guidelines** - Follow our [documentation standards](../../docs/DOCUMENTATION_STANDARDS.md)

### Reference Template

Use this template for new reference pages:

```markdown
---
diataxis: reference
audience: developer
last_reviewed: [date]
review_interval_days: [frequency]
project: marketing-websites
description: [brief description]
tags: [relevant tags]
primary_language: typescript
---

# [Title]

Brief description of what this reference covers.

## Overview

High-level overview of the topic.

## API Reference

### [Method/Component/Setting]

**Type:** [Type signature]
**Default:** [Default value]
**Description:** [What it does]

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| [name] | [type] | [yes/no] | [description] |

#### Returns

[Return type and description]

#### Example

```typescript
// Example code
```

## Usage

How to use this feature/component/API.

## See Also

Related documentation and references.
```

## 🆘 Getting Help

### Quick Questions
- **FAQ** - [Common questions](../2-guides/faq/)
- **Troubleshooting** - [Solve problems](../2-guides/troubleshooting/)

### Community Support
- **GitHub Discussions** - Ask technical questions
- **GitHub Issues** - Report documentation issues
- **Stack Overflow** - Search for answers

### Professional Support
- **Email Support** - Contact the team directly
- **Consulting** - Get expert help
- **Training** - Schedule team training

---

*Looking for something specific? Use the search function or check the [index](../index.md).* 📚

*Last updated: 2026-02-19 | Review interval: 180 days*
