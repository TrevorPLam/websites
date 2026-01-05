# Development Context

> **Last Updated:** 2026-01-05  
> **Canonical Status:** Canonical  
> **Purpose:** Project constraints, requirements, and technical decisions  
> **See Also:** [DECISIONS.md](../../DECISIONS.md), [DOCS_INDEX.md](../DOCS_INDEX.md)

## Project Constraints
- **Budget**: Free tier (Cloudflare Pages)
- **Compliance**: GDPR compliant, CAN-SPAM Act compliant
- **Performance**: Lighthouse scores >90 across all metrics, <2s page load
- **Platform**: Web-first, mobile-responsive

## Technical Requirements
- **Language**: TypeScript 5.x, Node.js 20.x LTS
- **Package manager**: npm (package-lock.json)
- **Framework**: Next.js 14 (App Router), React 18
- **Browser/Runtime support**: Last 2 versions of major browsers
- **Accessibility**: WCAG 2.1 AA minimum

## Architecture Decisions

### Why This Stack
- **Next.js 14**: Best-in-class React framework with excellent performance and SEO
- **TypeScript**: Type safety reduces bugs and improves developer experience
- **Tailwind CSS**: Utility-first CSS for rapid development and small bundle sizes
- **Cloudflare Pages**: Zero-cost hosting with global CDN and automatic HTTPS
- **Static Generation**: Pre-render all pages at build time for maximum performance

### Infrastructure Tier
- **Cloudflare Pages**: Free tier for static site hosting
- **Resend API**: Contact form email delivery
- **Rationale**: Zero hosting costs while maintaining excellent performance and reliability

### Data Model Philosophy
- Static site with no database
- Contact form submissions sent via email (no storage)
- Blog content stored as MDX files in repository

## Development Guidelines
- **Code style**: Prettier with default config, ESLint with TypeScript rules
- **Testing requirements**: Unit tests for components, E2E tests for critical paths
- **Documentation**: JSDoc for all public APIs and complex components
- **Commit conventions**: Conventional Commits (feat:, fix:, docs:, chore:)

## What NOT to Do
- Don't add runtime dependencies that increase bundle size unnecessarily
- Don't introduce client-side JavaScript for static content
- Don't change core architecture (Next.js App Router, static generation)
- Don't add external analytics without privacy review

## Security and Privacy Model
- **Forms**: Validation with Zod, rate limiting on contact form
- **Email**: Resend API for transactional emails
- **No user data storage**: Contact forms immediately forwarded via email
- **No cookies**: Static site requires no authentication or session management
- **HTTPS**: Enforced via Cloudflare
