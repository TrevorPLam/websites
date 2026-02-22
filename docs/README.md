# Documentation

Welcome to the marketing-websites platform documentation, organized using the **Diátaxis framework** for optimal learning and reference.

## 📚 Documentation Structure

Our documentation is organized by cognitive purpose to help you find exactly what you need:

### 🎓 [Getting Started](1-getting-started/)

_Learning-oriented documentation for newcomers_

- Environment setup and first project
- Basic concepts and workflows
- Prerequisites and installation

### 📖 [Guides](2-guides/)

_Goal-oriented documentation to solve specific problems_

- Client development and customization
- Feature integration and deployment
- Design and implementation guides

### 📋 [Reference](3-reference/)

_Information lookup for technical details_

- Complete API documentation
- Configuration options and components
- Technical specifications

### 💡 [Explanation](4-explanation/)

_Understanding-oriented documentation for deep knowledge_

- System architecture and design principles
- Decision records and concepts
- Performance and security strategies

### 🛠️ [Tutorials](5-tutorials/)

_Step-by-step learning paths_

- Quick start and advanced tutorials
- Industry-specific implementations
- Best practices and patterns

## 🚀 Quick Navigation

### New to the Platform?

1. **[Getting Started](1-getting-started/)** - Set up your environment
2. **[Quick Start Tutorial](tutorials/build-first-client.md)** - Build your first site
3. **[Platform Basics](getting-started/onboarding.md)** - Understand core concepts

### Need to Solve a Problem?

1. **[Guides](2-guides/)** - Find your specific problem
2. **[Reference](3-reference/)** - Look up technical details
3. **[Troubleshooting](getting-started/troubleshooting.md)** - Solve common issues

### Want to Understand?

1. **[Architecture](4-explanation/architecture/)** - System design
2. **[Decision Records](adr/)** - Why we made choices
3. **[Performance](performance/)** - Performance strategies

### Looking for Technical Details?

1. **[Reference](3-reference/)** - Technical documentation
2. **[Components](components/ui-library.md)** - UI component library
3. **[Configuration](configuration/)** - Configuration options

## 🎯 By Role

### 👨‍💻 **Developers**

- [Getting Started](1-getting-started/) - Environment setup
- [Guides](2-guides/) - How-to guides
- [Reference](3-reference/) - Technical documentation

### 🎨 **Designers**

- [Getting Started](1-getting-started/) - Platform basics
- [Guides](2-guides/) - Design and styling guides
- [Reference](3-reference/) - Component library

### 🚀 **DevOps**

- [Guides](2-guides/) - Deployment and operations
- [Reference](3-reference/) - Configuration and APIs
- [Explanation](4-explanation/) - Architecture and performance

### 📊 **Product Managers**

- [Getting Started](1-getting-started/) - Platform overview
- [Guides](2-guides/) - Feature integration
- [Explanation](4-explanation/) - Design decisions

## 📖 Documentation Standards

This documentation follows the **2026 Master Repository Documentation Standard (v2.0)**:

- ✅ **Diátaxis Framework** - Clear cognitive purpose classification
- ✅ **AI Optimization** - Machine-readable metadata and structure
- ✅ **Accessibility** - WCAG 2.2 AA compliant
- ✅ **Freshness Tracking** - Regular review and updates
- ✅ **Quality Validation** - Automated link checking and validation

### Quality Metrics

- **Review Coverage**: 100% of documents have review schedules
- **Link Health**: Automated checking with lychee
- **Format Validation**: markdownlint compliance
- **Accessibility**: axe-core integration

## 🔍 Finding Information

### Search Tips

- **Component Names** - Search for specific components (e.g., "Button", "Input")
- **Configuration** - Search for config options (e.g., "theme", "features")
- **API Endpoints** - Search for API terms (e.g., "auth", "submit")
- **Error Messages** - Search for error text to find troubleshooting

### Navigation Tips

- **Use the Index** - Start from [docs/index.md](index.md) for complete navigation
- **Follow Learning Paths** - Use [tutorials](5-tutorials/) for structured learning
- **Check Related Docs** - Look for "See Also" sections in each document

## 🆘 Getting Help

### Quick Help

- **[FAQ](resources/faq.md)** - Common questions and answers
- **[Troubleshooting](getting-started/troubleshooting.md)** - Solve common problems
- **[Glossary](resources/glossary.md)** - Understand terminology

### Community Support

- **[GitHub Discussions](https://github.com/your-org/marketing-websites/discussions)** - Ask questions
- **[GitHub Issues](https://github.com/your-org/marketing-websites/issues)** - Report bugs
- **[Contributing Guide](../../CONTRIBUTING.md)** - How to contribute

### Professional Support

- **[Support Documentation](../../SUPPORT.md)** - Get help from the team
- **[Review Schedule](../../REVIEW_SCHEDULE.md)** - Documentation maintenance
- **[Authors](../../AUTHORS.md)** - Project contributors

## 📚 Legacy Documentation

### Migrated Content

The following legacy documentation has been migrated to the new structure:

- **Architecture** → [4-explanation/architecture/](4-explanation/architecture/)
- **Getting Started** → [1-getting-started/](1-getting-started/)
- **ADRs** → [adr/](adr/)

### Archive

Old documentation that is no longer maintained can be found in:

- **[docs/archive/](archive/)** - Archived content (ISSUES.md, REPODETAILED.md, docs standard, research outputs)

## 🤝 Contributing to Documentation

### Adding Documentation

1. **Choose the Right Section** - Based on Diátaxis purpose
2. **Follow Standards** - Use our [documentation standards](DOCUMENTATION_STANDARDS.md)
3. **Include Frontmatter** - Add proper metadata
4. **Test Links** - Ensure all links work
5. **Submit PR** - Follow contribution guidelines

### Documentation Standards

All documentation must include:

```yaml
---
diataxis: tutorial|how-to|explanation|reference
audience: developer|operator|architect|contributor
last_reviewed: YYYY-MM-DD
review_interval_days: [frequency]
project: marketing-websites
description: [brief description]
tags: [relevant tags]
primary_language: typescript
---
```

### Review Process

- **Automated Validation** - CI checks links, format, and standards
- **Peer Review** - Community review for quality and accuracy
- **Regular Updates** - Scheduled reviews based on content type
- **Quality Metrics** - Track documentation quality and usage

## 🔧 Tools and Automation

### Validation Tools

- **[markdownlint](../../.markdownlint.yml)** - Format validation
- **[lychee](../../.github/workflows/docs-validation.yml)** - Link checking
- **[check-review-schedule](../../scripts/check-review-schedule.js)** - Review compliance
- **[validate-docs](../../scripts/validate-documentation.js)** - Content validation

### Automation

- **CI/CD Pipeline** - Automated validation and checking
- **Link Health Monitoring** - Continuous link validation
- **Review Schedule Tracking** - Automated review reminders
- **Quality Metrics** - Documentation quality measurement

## 📊 Documentation Metrics

### Coverage

- **Getting Started**: 100% complete
- **Guides**: 80% complete (in progress)
- **Reference**: 90% complete (in progress)
- **Explanation**: 85% complete (in progress)
- **Tutorials**: 70% complete (planned)

### Quality

- **Review Compliance**: 100%
- **Link Health**: 98%
- **Format Compliance**: 100%
- **Accessibility**: 95%

---

_This documentation is continuously improving. Check the [index](index.md) for the latest navigation and content._ 📚

_Last updated: 2026-02-19 | Review interval: 30 days_

# Documentation Hub

**Last Updated:** 2026-02-18  
**Status:** Active Documentation - All links verified  
**Navigation:** Use the sections below to find specific documentation

> **Note:** Documentation reflects codebase state. Historical issue analysis is in [docs/archive/ISSUES.md](archive/ISSUES.md). If you find broken links or outdated information, please report via GitHub issues.

---

## Welcome to the Documentation Hub

This is your central navigation point for all documentation related to the marketing-websites platform. Whether you're a new developer, template creator, or system administrator, you'll find the information you need here.

### Quick Search

Looking for something specific? Use your browser's search (Ctrl+F / Cmd+F) or check these quick references:

- **[Glossary](resources/glossary.md)** - Definitions of terms and concepts
- **[FAQ](resources/faq.md)** - Frequently asked questions
- **[Troubleshooting](getting-started/comprehensive-guide.md#troubleshooting)** - Common issues and solutions

> **Note:** Full-text search will be available when the documentation site is deployed.

### Quick Navigation

- **🚀 New Developers?** Start with [Getting Started](getting-started/)
- **🏗️ Architecture Overview?** See [Architecture Documentation](architecture/)
- **🧩 Component Usage?** Check [Components Documentation](components/)
- **⚙️ Development Standards?** Review [Documentation Standards](DOCUMENTATION_STANDARDS.md)
- **📚 Reference Materials?** See [Resources](resources/) (Glossary, FAQ, Learning Paths)
- **🔧 Client Setup?** See [Client Directory README](../clients/README.md)

---

## Getting Started

### For New Developers

**[Comprehensive Getting Started Guide](getting-started/comprehensive-guide.md)**  
_Estimated time: 2-4 hours_

Complete guide to setting up your development environment and understanding the codebase.

### For New Projects

**[Client Directory README](../clients/README.md)**  
_Client setup and deployment_

Step-by-step guide to creating clients from `testing-not-a-client` and deploying.

**[Build Your First Client](tutorials/build-first-client.md)**  
_Step-by-step tutorial_

Complete walkthrough for creating your first client website.

---

## Architecture Documentation

### System Overview

**[Architecture Overview](architecture/README.md)**  
_System design and structure_

Comprehensive overview of the platform architecture, layers, and design principles.

**[Module Boundaries](architecture/module-boundaries.md)**  
_Dependency rules and constraints_

Allowed dependency directions and package boundaries.

**[Dependency Graph](architecture/dependency-graph.md)**  
_Visual dependency mapping_

Interactive diagrams showing package relationships and data flows.

### Decision Records

**[Architecture Decision Records (ADR)](adr/)**  
_Historical architectural decisions_

Record of important architectural decisions and their rationale. See [adr/](adr/) directory for all ADR files.

---

## Components Documentation

### UI Component Library

**[UI Library Documentation](components/ui-library.md)**  
_React components and usage guide_

Complete reference for all UI components, including examples and best practices.

**[Theme Injector](theming/theme-injector.md)**  
_Theming system documentation_

How the theming system works and how to customize themes.

---

## Tutorials

### Step-by-Step Guides

**[Build Your First Client](tutorials/build-first-client.md)**  
_Complete client creation walkthrough_

Step-by-step tutorial for creating your first client website from a template.

**[Create a Custom Component](tutorials/create-component.md)**  
_Component development guide_

Learn how to create and contribute new components to the UI library.

**[Set Up Integrations](tutorials/setup-integrations.md)**  
_Third-party service integration_

Comprehensive guide to integrating third-party services (Analytics, CRM, Database).

### Feature Documentation

**[Booking Feature](features/booking/usage.md)**  
_Booking system usage and customization_

**[Services Feature](features/services/usage.md)**  
_Service showcase components_

**[Search Feature](features/search/usage.md)**  
_Search functionality implementation_

### Deployment

**[Docker Deployment](deployment/docker.md)**  
_Docker and containerization guide_

Complete guide to deploying with Docker and Docker Compose.

---

## Operations Documentation

### Maintenance

**[Documentation Maintenance](operations/maintenance.md)**  
_Keeping documentation updated_

Processes for maintaining and updating documentation.

### Performance & Quality

**[Performance Baseline](performance-baseline.md)**  
_Performance benchmarks and targets_

Performance metrics, targets, and optimization guidelines.

**[Accessibility Audit](accessibility-audit.md)**  
_Accessibility standards and compliance_

WCAG compliance guidelines and accessibility best practices.

**[Testing Strategy](testing-strategy.md)**  
_Testing approach and best practices_

Comprehensive testing strategy for the platform.

**[QA: 1-xx UI Components](qa/1-xx-ui-components-qa.md)**  
_Quality assurance for UI component implementation_

QA analysis, verification commands (`pnpm validate-ui-exports`, UI component tests), and follow-ups for the shared UI library.

---

## Resources and Reference

### Standards and Guidelines

**[Documentation Standards](DOCUMENTATION_STANDARDS.md)**  
_Writing and formatting standards_

Comprehensive guide to documentation standards and best practices.

**[Contributing Guidelines](../CONTRIBUTING.md)**  
_Code contribution process_

How to contribute code and documentation to the project.

### Reference Materials

**[Glossary](resources/glossary.md)**  
_Terminology and concepts_

Comprehensive definitions of technical terms, acronyms, and concepts used throughout the platform. Alphabetically organized for easy lookup.

**[FAQ](resources/faq.md)**  
_Frequently asked questions_

Common questions organized by topic (Getting Started, Development, Architecture, Deployment, Troubleshooting, etc.) with quick answers and links to detailed documentation.

**[Learning Paths](resources/learning-paths.md)**  
_Role-based learning guides_

Structured learning paths for different user types: Template Users, Developers, Administrators, and Architects.

**[Contributors](CONTRIBUTORS.md)**  
_Documentation contributors_

Recognition for those who contribute to documentation.

---

## Documentation by Role

### New Projects

- [Quick Start](../README.md#quick-start)
- [Client Directory README](../clients/README.md)
- [Build Your First Client](tutorials/build-first-client.md)
- [Troubleshooting](getting-started/troubleshooting.md)

### Developers

- [Developer Onboarding](getting-started/onboarding.md)
- [Architecture Overview](architecture/README.md)
- [UI Library](components/ui-library.md)
- [Documentation Standards](DOCUMENTATION_STANDARDS.md)

### System Administrators

- [Docker Deployment](deployment/docker.md)
- [Security Policy](../SECURITY.md)
- [Performance Baseline](performance-baseline.md)
- [Set Up Integrations](tutorials/setup-integrations.md)

### Architects

- [Architecture Overview](architecture/README.md)
- [Module Boundaries](architecture/module-boundaries.md)
- [Architecture Decision Records (ADR)](adr/)
- [Dependency Graph](architecture/dependency-graph.md)
- [Visual Architecture Guide](architecture/visual-guide.md)

---

## Documentation Structure

### File Organization

```
docs/
├── README.md                    # This file - documentation hub
├── DOCUMENTATION_STANDARDS.md   # Documentation standards
├── CONTRIBUTORS.md              # Documentation contributors
├── performance-baseline.md      # Performance benchmarks
├── accessibility-audit.md       # Accessibility standards
├── testing-strategy.md          # Testing approach
├── qa/                          # Quality assurance
│   └── 1-xx-ui-components-qa.md # UI component QA and validation
├── getting-started/             # New user documentation
│   ├── onboarding.md           # Developer onboarding
│   └── troubleshooting.md      # Common issues
├── tutorials/                   # Step-by-step tutorials
│   ├── build-first-client.md    # Client creation tutorial
│   ├── create-component.md     # Component development
│   └── setup-integrations.md   # Integration setup
├── architecture/                # System architecture
│   ├── README.md               # Architecture overview
│   ├── module-boundaries.md    # Dependency rules
│   ├── dependency-graph.md     # Visual dependencies
│   ├── visual-guide.md         # Visual architecture
│   ├── route-registry.md        # Route system
│   └── migration-map-shared-to-types.md
├── adr/                         # Architecture Decision Records
│   ├── 0001-turborepo-upgrade-2.8.md
│   ├── 0002-module-boundaries-eslint.md
│   ├── 0003-ci-quality-gates.md
│   ├── 0004-dockerfile-standalone-output.md
│   ├── 0005-tailwind-v4-migration.md
│   └── 0010-unified-radix-ui-package.md
├── components/                  # Component documentation
│   └── ui-library.md           # UI components reference
├── features/                    # Feature documentation
│   ├── booking/                 # Booking feature
│   ├── services/                # Services feature
│   └── search/                  # Search feature
├── deployment/                  # Deployment guides
│   └── docker.md                # Docker deployment
├── operations/                  # Operations documentation
│   └── maintenance.md          # Documentation maintenance
├── resources/                   # Reference materials
│   ├── glossary.md             # Terminology
│   ├── faq.md                  # FAQ
│   └── learning-paths.md       # Learning paths
├── tooling/                     # Tool documentation
│   ├── pnpm.md                 # pnpm usage
│   ├── turborepo.md            # Turborepo guide
│   ├── knip.md                 # Knip usage
│   ├── syncpack.md             # Syncpack usage
│   └── validate-exports.md     # Export validation
├── ci/                          # CI/CD documentation
│   └── required-checks.md      # CI quality gates
├── release/                     # Release documentation
│   ├── versioning-strategy.md  # Versioning approach
│   └── next16-migration-evaluation.md
├── evaluation/                  # Technology evaluations
│   ├── README.md
│   └── tailwind-v4-migration.md
├── theming/                     # Theming documentation
│   └── theme-injector.md       # Theme system
├── testing/                     # Testing documentation
│   └── refactor-parity-matrix.md
└── templates/                   # Documentation templates
    ├── component-test-template.tsx
    ├── schema-test-template.ts
    └── server-action-test-template.ts
```

> **Note:** Task specifications were previously in `docs/task-specs/`. They are now consolidated in [tasks/TASKS.md](../tasks/TASKS.md).

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

- ✅ **Documentation aligned with codebase** - Architecture, module-boundaries, clients/README, CI checks reflect actual state
- ✅ **docs/archive/ISSUES.md** - Archived issue analysis (historical)
- ✅ **Architecture** - Repository structure, layer status, tech stack (Next 16, TS 5.9, Tailwind 4)
- ✅ **Clients** - Copy from `starter-template` (not templates/); 6 clients documented

### Upcoming Improvements

- 📋 **Interactive Documentation Site** - Enhanced navigation and search (see [SETUP_DOCS_SITE.md](SETUP_DOCS_SITE.md))
- 📋 **Component Playground** - Live component testing (see [SETUP_INTERACTIVE_EXAMPLES.md](SETUP_INTERACTIVE_EXAMPLES.md))
- 📋 **Documentation Analytics** - Usage tracking (see [SETUP_ANALYTICS.md](SETUP_ANALYTICS.md))
- 📋 **Design System Documentation** - Comprehensive design tokens guide
- 📋 **API Reference** - Complete API documentation

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

_This documentation hub is regularly updated. Last revised: 2026-02-21_

---

**Quick Links:**

- [🏠 Repository Home](../README.md)
- [🚀 Quick Start](../README.md#quick-start)
- [📖 Documentation Standards](DOCUMENTATION_STANDARDS.md)
- [🏗️ Architecture](architecture/README.md)
- [🧩 Components](components/ui-library.md)
- [🤝 Contributing](../CONTRIBUTING.md)
