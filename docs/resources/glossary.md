<!--
/**
 * @file docs/resources/glossary.md
 * @role docs
 * @summary Comprehensive glossary of terms, acronyms, and concepts used in the marketing-websites platform.
 *
 * @entrypoints
 * - Referenced from documentation hub
 * - Linked from relevant documentation
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/README.md (documentation hub)
 *
 * @used_by
 * - All users seeking term definitions
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: terminology from codebase and documentation
 * - outputs: clear definitions and understanding
 *
 * @invariants
 * - Terms must be alphabetically organized
 * - Definitions must be accurate and current
 *
 * @gotchas
 * - Some terms may have multiple meanings in different contexts
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add search functionality
 * - Link to related terms
 *
 * @verification
 * - ✅ Terms verified against codebase usage
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Glossary

**Last Updated:** 2026-02-18  
**Status:** Active Reference  
**Organization:** Alphabetical

---

This glossary defines technical terms, acronyms, and concepts used throughout the marketing-websites platform documentation and codebase.

## A

### ADR (Architecture Decision Record)
A document that captures an important architectural decision along with its context and consequences. See [Architecture Decision Records](architecture/decision-records/).

### API (Application Programming Interface)
A set of protocols and tools for building software applications. In this project, APIs refer to both internal package APIs and external service integrations.

### App Router
Next.js 15's file-system based routing system that uses React Server Components. Replaces the Pages Router in Next.js 13+.

## B

### Build
The process of compiling, bundling, and optimizing code for production deployment. Run with `pnpm build`.

## C

### CaCA (Configuration-as-Code Architecture)
The core architectural principle where client websites are configured entirely through `site.config.ts` without requiring code changes.

### Client
A production website instance created from a template. Lives in the `clients/` directory and deploys independently.

### Component Library
The shared React component library (`@repo/ui`) providing reusable UI primitives following atomic design principles.

### CSR (Client-Side Rendering)
Rendering React components in the browser. Contrasts with SSR (Server-Side Rendering).

## D

### Dependencies
External packages required by the project. Managed via `pnpm` and declared in `package.json` files.

### Docs-as-Code
The practice of treating documentation as code: version-controlled, reviewed, and deployed alongside the codebase.

### Docusaurus
A modern static website generator for documentation sites. Recommended for this project's documentation site.

## E

### Edge Middleware
Next.js middleware that runs at the edge (CDN) before requests reach the application. Used for authentication, redirects, and A/B testing.

### ESLint
A static code analysis tool for identifying problematic patterns in JavaScript and TypeScript code.

## F

### Feature
A business logic component or functionality extracted into `@repo/features`. Examples include booking, contact forms, and blog.

### Frontmatter
Metadata at the beginning of Markdown files, typically in YAML format. Used for page configuration.

## G

### Git
Version control system used for tracking changes in the codebase.

### GitHub Actions
CI/CD automation platform integrated with GitHub repositories.

## H

### Hot Reload
Development feature that automatically refreshes the browser when code changes are detected.

## I

### Infrastructure Layer (Layer 0)
The foundational layer providing security, middleware, logging, and environment validation. Implemented in `@repo/infra`.

### Integration
A third-party service connection (e.g., HubSpot CRM, Google Analytics). Implemented in `@repo/integrations`.

## J

### JSDoc
A documentation standard for JavaScript code using special comment syntax.

## L

### Layer
A conceptual level in the platform architecture. See [Architecture Overview](architecture/README.md) for the seven-layer model.

### LTS (Long-Term Support)
A release cycle that provides extended support and stability for specific versions.

## M

### Markdown
A lightweight markup language used for documentation files (`.md`).

### Metaheader
A standardized comment block at the top of documentation files containing metadata about the file's purpose, dependencies, and status.

### Monorepo
A repository containing multiple related packages or projects managed together.

### Mermaid
A text-based diagramming and charting tool used for creating visual documentation in Markdown.

## N

### Next.js
The React framework used for building the platform. Version 15.2.9 with App Router.

### Node.js
The JavaScript runtime environment. Requires version >=22.0.0.

## O

### Onboarding
The process of setting up a development environment and learning the codebase. See [Developer Onboarding Guide](getting-started/onboarding.md).

## P

### Package
A reusable module or library in the monorepo. Examples: `@repo/ui`, `@repo/features`, `@repo/infra`.

### pnpm
The package manager used for this project. Version 10.29.2 is required.

### Prettier
An opinionated code formatter that enforces consistent code style.

### Production
The live, deployed environment where client websites run for end users.

## R

### React
The UI library used for building components. Version 19.0.0.

### React Server Components
React components that render on the server, reducing client-side JavaScript bundle size.

### README
A documentation file (typically `README.md`) that provides an overview and quick start guide for a directory or project.

### RLS (Row-Level Security)
A database security feature (used with Supabase) that restricts access to rows based on user permissions.

## S

### SBOM (Software Bill of Materials)
A list of all components, libraries, and dependencies in a software project. Used for security and compliance.

### SEO (Search Engine Optimization)
Techniques for improving website visibility in search engine results.

### SSR (Server-Side Rendering)
Rendering React components on the server before sending HTML to the client. Improves initial page load performance.

### Storybook
A tool for developing and testing UI components in isolation.

### Supabase
The backend-as-a-service platform used for database and authentication.

## T

### Tailwind CSS
A utility-first CSS framework used for styling components.

### Template
A pre-built website structure for a specific industry (e.g., hair salon, restaurant). Lives in `templates/` directory.

### TypeScript
A typed superset of JavaScript that compiles to plain JavaScript. Provides type safety and better tooling.

### Turbo
The monorepo build system (Turborepo) used for caching and parallelizing builds.

## U

### UI Component
A reusable user interface element from the component library (`@repo/ui`).

### UTC (Coordinated Universal Time)
The primary time standard used for timestamps and scheduling.

## V

### Version Control
The practice of tracking and managing changes to code over time using Git.

### Vite
A fast build tool and development server. Used by some tools in the ecosystem.

## W

### WCAG (Web Content Accessibility Guidelines)
International standards for web accessibility. This project targets WCAG 2.2 AA compliance.

### Workspace
A pnpm concept referring to the monorepo structure where multiple packages are managed together.

## X

### XSS (Cross-Site Scripting)
A security vulnerability where malicious scripts are injected into web pages. Prevented through proper sanitization.

## Y

### YAML
A human-readable data serialization format used for configuration files.

## Z

### Zero-Config
A development approach where sensible defaults are provided without requiring configuration.

---

## Related Documentation

- [Architecture Overview](architecture/README.md) - System architecture and layer model
- [Documentation Standards](DOCUMENTATION_STANDARDS.md) - Documentation guidelines
- [Getting Started](getting-started/onboarding.md) - Developer onboarding

---

**Contributing:** If you encounter a term that's not defined here, please [open an issue](../../../issues) or submit a PR to add it.
