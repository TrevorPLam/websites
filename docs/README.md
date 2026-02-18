<!--
/**
 * @file docs/README.md
 * @role docs
 * @summary Documentation overview and navigation hub for the marketing-websites platform.
 *
 * @entrypoints
 * - Primary entry point for all documentation
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - README.md (repository overview)
 * - docs/DOCUMENTATION_STANDARDS.md (documentation practices)
 * - docs/architecture/README.md (system understanding)
 *
 * @used_by
 * - All users seeking documentation guidance
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: repository documentation structure
 * - outputs: navigation and understanding of available docs
 *
 * @invariants
 * - Links must point to existing documentation files
 * - Structure must reflect actual documentation organization
 *
 * @gotchas
 * - Documentation evolves; keep navigation updated
 *
 * @issues
 * - [severity:low] Some sections need content completion
 *
 * @opportunities
 * - Add search functionality
 * - Create interactive documentation site
 *
 * @verification
 * - ✅ Verified: All links point to existing files
 * - ✅ Verified: Structure matches documentation plan
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Documentation Hub

**Last Updated:** 2026-02-18  
**Status:** Active Documentation  
**Navigation:** Use the sections below to find specific documentation

---

## Welcome to the Documentation Hub

This is your central navigation point for all documentation related to the marketing-websites platform. Whether you're a new developer, template creator, or system administrator, you'll find the information you need here.

### Quick Search

Looking for something specific? Use your browser's search (Ctrl+F / Cmd+F) or check these quick references:

- **[Glossary](resources/glossary.md)** - Definitions of terms and concepts
- **[FAQ](resources/faq.md)** - Frequently asked questions
- **[Troubleshooting](getting-started/troubleshooting.md)** - Common issues and solutions

> **Note:** Full-text search will be available when the documentation site is deployed.

### Quick Navigation

- **🚀 New Developers?** Start with [Getting Started](getting-started/)
- **🏗️ Architecture Overview?** See [Architecture Documentation](architecture/)
- **🧩 Component Usage?** Check [Components Documentation](components/)
- **⚙️ Development Standards?** Review [Documentation Standards](DOCUMENTATION_STANDARDS.md)
- **📚 Reference Materials?** See [Resources](resources/) (Glossary, FAQ, Learning Paths)

---

## Getting Started

### For New Developers

**[Developer Onboarding Guide](getting-started/onboarding.md)**  
*Estimated time: 2-4 hours*

Complete guide to setting up your development environment and understanding the codebase.

**[Quick Reference](getting-started/quick-reference.md)**  
*Essential commands and patterns*

Common commands, file patterns, and development workflows for daily use.

**[Troubleshooting](getting-started/troubleshooting.md)**  
*Solutions to common issues*

Frequently encountered problems and their solutions.

### For Template Users

**[Template Development Guide](guides/template-development.md)**  
*Creating and customizing templates*

How to create new industry templates and customize existing ones.

**[Client Setup Guide](guides/client-setup.md)**  
*Deploying client websites*

Step-by-step guide to setting up and deploying client projects.

---

## Architecture Documentation

### System Overview

**[Architecture Overview](architecture/README.md)**  
*System design and structure*

Comprehensive overview of the platform architecture, layers, and design principles.

**[Module Boundaries](architecture/module-boundaries.md)**  
*Dependency rules and constraints*

Allowed dependency directions and package boundaries.

**[Dependency Graph](architecture/dependency-graph.md)**  
*Visual dependency mapping*

Interactive diagrams showing package relationships and data flows.

### Decision Records

**[Architecture Decision Records](architecture/decision-records/)**  
*Historical architectural decisions*

Record of important architectural decisions and their rationale.

---

## Components Documentation

### UI Component Library

**[UI Library Documentation](components/ui-library.md)**  
*React components and usage guide*

Complete reference for all UI components, including examples and best practices.

**[Design System](components/design-system.md)**  
*Design tokens and theming*

Design tokens, color systems, and theming guidelines.

**[Storybook](components/storybook.md)**  
*Interactive component examples*

Live component playground and testing environment.

---

## Guides and Tutorials

### Development Guides

**[Template Development](guides/template-development.md)**  
*Creating industry templates*

Guide to developing new industry-specific templates.

**[Client Configuration](guides/configuration.md)**  
*Site configuration deep dive*

Comprehensive guide to site configuration options and patterns.

**[Deployment Strategies](guides/deployment.md)**  
*Production deployment methods**

Different deployment options and strategies for client websites.

### Integration Guides

**[Integration Overview](integrations/overview.md)**  
*Third-party service integration*

How to integrate with external services and APIs.

**[API Reference](integrations/api-reference.md)**  
*Internal API documentation*

Complete API reference for internal services and endpoints.

---

## Operations Documentation

### Monitoring and Maintenance

**[Performance Monitoring](operations/monitoring.md)**  
*Performance tracking and optimization*

How to monitor and optimize application performance.

**[Security Practices](operations/security.md)**  
*Security guidelines and best practices*

Security implementation and monitoring guidelines.

**[Documentation Maintenance](operations/maintenance.md)**  
*Keeping documentation updated*

Processes for maintaining and updating documentation.

---

## Resources and Reference

### Standards and Guidelines

**[Documentation Standards](DOCUMENTATION_STANDARDS.md)**  
*Writing and formatting standards*

Comprehensive guide to documentation standards and best practices.

**[Contributing Guidelines](../CONTRIBUTING.md)**  
*Code contribution process*

How to contribute code and documentation to the project.

### Reference Materials

**[Glossary](resources/glossary.md)**  
*Terminology and concepts*

Comprehensive definitions of technical terms, acronyms, and concepts used throughout the platform. Alphabetically organized for easy lookup.

**[FAQ](resources/faq.md)**  
*Frequently asked questions*

Common questions organized by topic (Getting Started, Development, Architecture, Deployment, Troubleshooting, etc.) with quick answers and links to detailed documentation.

**[Learning Paths](resources/learning-paths.md)**  
*Role-based learning guides*

Structured learning paths for different user types: Template Users, Developers, Administrators, and Architects.

**[Community Resources](resources/community.md)**  
*External resources and community*

Links to external resources, community forums, and support channels.

---

## Documentation by Role

### Template Users

- [Quick Start](../README.md#quick-start)
- [Client Setup Guide](guides/client-setup.md)
- [Configuration Guide](guides/configuration.md)
- [Troubleshooting](getting-started/troubleshooting.md)

### Developers

- [Developer Onboarding](getting-started/onboarding.md)
- [Architecture Overview](architecture/README.md)
- [UI Library](components/ui-library.md)
- [Documentation Standards](DOCUMENTATION_STANDARDS.md)

### System Administrators

- [Deployment Guide](guides/deployment.md)
- [Security Practices](operations/security.md)
- [Performance Monitoring](operations/monitoring.md)
- [Integration Overview](integrations/overview.md)

### Architects

- [Architecture Overview](architecture/README.md)
- [Module Boundaries](architecture/module-boundaries.md)
- [Decision Records](architecture/decision-records/)
- [Dependency Graph](architecture/dependency-graph.md)

---

## Documentation Structure

### File Organization

```
docs/
├── README.md                    # This file - documentation hub
├── DOCUMENTATION_STANDARDS.md   # Documentation standards
├── getting-started/             # New user documentation
│   ├── onboarding.md           # Developer onboarding
│   ├── quick-reference.md      # Common commands
│   └── troubleshooting.md      # Common issues
├── architecture/               # System architecture
│   ├── README.md               # Architecture overview
│   ├── module-boundaries.md    # Dependency rules
│   ├── dependency-graph.md     # Visual dependencies
│   └── decision-records/       # ADR collection
├── guides/                     # How-to guides
│   ├── template-development.md # Template creation
│   ├── client-setup.md         # Client setup
│   ├── configuration.md         # Site configuration
│   └── deployment.md           # Deployment strategies
├── components/                 # Component documentation
│   ├── ui-library.md           # UI components
│   ├── design-system.md        # Design tokens
│   └── storybook.md           # Interactive examples
├── integrations/               # Integration documentation
│   ├── overview.md             # Integration architecture
│   ├── api-reference.md        # API documentation
│   └── providers/              # Individual integrations
├── operations/                 # Operations documentation
│   ├── monitoring.md           # Performance monitoring
│   ├── security.md             # Security practices
│   └── maintenance.md         # Documentation maintenance
└── resources/                  # Reference materials
    ├── glossary.md             # Terminology
    ├── faq.md                  # FAQ
    └── community.md            # Community resources
```

### Documentation Types

#### **Conceptual Documentation**
Explains what and why - architecture, design principles, system overview.

#### **Procedural Documentation**  
Step-by-step instructions - tutorials, guides, setup instructions.

#### **Reference Documentation**
Technical specifications - API docs, configuration options, component props.

#### **Tutorial Documentation**
Hands-on learning - examples, walkthroughs, interactive guides.

---

## Quality Standards

### Documentation Standards

All documentation follows the [Documentation Standards](DOCUMENTATION_STANDARDS.md) which include:

- **Metaheaders** for file metadata and relationships
- **Accessibility compliance** (WCAG 2.2 AA)
- **Version control integration** with code changes
- **AI-assisted quality checks** for consistency
- **Regular review cycles** for accuracy

### Quality Metrics

- **Accuracy Rate**: 95%+ of documentation up-to-date
- **Completeness**: 90%+ of public APIs documented
- **User Satisfaction**: 4.5/5+ rating
- **Search Success**: 80%+ find answers quickly

---

## Contributing to Documentation

### How to Contribute

1. **Read the Standards** - Review [Documentation Standards](DOCUMENTATION_STANDARDS.md)
2. **Identify Need** - Find missing or outdated documentation
3. **Create Issue** - Propose changes in a GitHub issue
4. **Follow Template** - Use established templates and formats
5. **Submit PR** - Create pull request with documentation changes

### Quality Checklist

- [ ] Metaheader complete and accurate
- [ ] Content follows style guide
- [ ] Links validated and working
- [ ] Examples tested and functional
- [ ] Accessibility compliance verified
- [ ] Technical accuracy confirmed

### Review Process

1. **Self-Review** - Check against standards
2. **Peer Review** - Team member review
3. **Technical Review** - Subject matter expert review
4. **Accessibility Review** - A11y compliance check
5. **Final Approval** - Documentation maintainer approval

---

## Getting Help

### Finding Information

1. **Search This Hub** - Check relevant sections above
2. **Use Site Search** - Search across all documentation
3. **Check FAQ** - Review [Frequently Asked Questions](resources/faq.md)
4. **Ask Community** - Post in discussions or forums

### Reporting Issues

1. **Documentation Bugs** - Create GitHub issue with `documentation` label
2. **Missing Information** - Request additions via issues
3. **Accessibility Issues** - Report with specific WCAG guidelines
4. **Outdated Content** - Flag for review and updates

### Contact Information

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share knowledge
- **Team Chat**: Real-time help and discussion
- **Email Support**: For priority support needs

---

## Recent Updates

### Latest Changes (February 2026)

- ✅ **Architecture Overview** - Complete system architecture documentation
- ✅ **Documentation Standards** - Comprehensive style guide and standards
- ✅ **Developer Onboarding** - Complete setup and workflow guide
- ✅ **Dependency Graphs** - Visual architecture documentation
- ✅ **UI Library Docs** - Complete component reference
- ✅ **Automated Validation** - CI/CD documentation checks

### Upcoming Improvements

- 📋 **Interactive Documentation Site** - Enhanced navigation and search
- 📋 **Video Tutorials** - Visual learning resources
- 📋 **Component Playground** - Live component testing
- 📋 **API Explorer** - Interactive API documentation
- 📋 **Performance Metrics** - Documentation usage analytics

---

## Feedback and Improvement

### Providing Feedback

We welcome feedback on documentation quality and usefulness:

- **Rate Documentation** - Use feedback forms in documentation
- **Report Issues** - Create GitHub issues for problems
- **Suggest Improvements** - Submit enhancement requests
- **Contribute Content** - Add missing or improved documentation

### Continuous Improvement

Documentation is continuously improved through:

- **User Analytics** - Track usage and identify gaps
- **Community Feedback** - Incorporate user suggestions
- **Regular Reviews** - Quarterly accuracy and completeness checks
- **Automated Monitoring** - Link validation and quality checks

---

_This documentation hub is regularly updated. Last revised: 2026-02-18_

---

**Quick Links:**
- [🏠 Repository Home](../README.md)
- [🚀 Quick Start](../README.md#quick-start)
- [📖 Documentation Standards](DOCUMENTATION_STANDARDS.md)
- [🏗️ Architecture](architecture/README.md)
- [🧩 Components](components/ui-library.md)
- [🤝 Contributing](../CONTRIBUTING.md)
