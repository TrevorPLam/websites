<!--
/**
 * @file docs/resources/faq.md
 * @summary Frequently asked questions about the marketing-websites platform.
 *
 * @entrypoints
 * - Referenced from documentation hub
 * - Common questions and answers
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/README.md (documentation hub)
 *
 * @used_by
 * - Users seeking quick answers
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: common questions from users
 * - outputs: quick answers and solutions
 *
 * @invariants
 * - Answers must be accurate and up-to-date
 * - Questions organized by topic
 *
 * @gotchas
 * - Some questions may have multiple valid answers
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add search functionality
 * - Link to detailed documentation
 *
 * @verification
 * - ✅ Questions based on common issues and PRs
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Frequently Asked Questions (FAQ)

**Last Updated:** 2026-02-18  
**Status:** Active Reference  
**Organization:** By Topic and Audience

---

Quick answers to common questions about the marketing-websites platform. For detailed information, see the [Documentation Hub](README.md).

## Getting Started

### Q: What are the system requirements?

**A:** You need:
- Node.js >=22.0.0
- pnpm 10.29.2 (exactly)
- Git 2.30.0+

See [Developer Onboarding](getting-started/onboarding.md) for complete setup instructions.

### Q: How do I create a new client website?

**A:** 
1. Choose a template from `templates/`
2. Copy it to `clients/[client-name]`
3. Configure `site.config.ts`
4. Customize branding and content
5. Deploy independently

See [Client Setup Guide](../clients/README.md) for details.

### Q: Can I use a different package manager?

**A:** No. This project requires pnpm 10.29.2 exactly. The workspace configuration and dependency resolution depend on pnpm's specific features.

## Development

### Q: How do I add a new component to the UI library?

**A:**
1. Create component in `packages/ui/src/components/`
2. Follow existing component patterns
3. Add tests in `__tests__/`
4. Export from `packages/ui/src/index.ts`
5. Document in component library docs

See [UI Library Documentation](components/ui-library.md).

### Q: How do I add a new feature?

**A:**
1. Create feature in `packages/features/src/`
2. Follow feature extraction patterns
3. Add to appropriate template/client
4. Document usage

See [Feature Documentation](../features/) for examples.

### Q: Why is my build failing?

**A:** Common causes:
- Missing dependencies: Run `pnpm install`
- Type errors: Run `pnpm type-check`
- Lint errors: Run `pnpm lint`
- Version mismatch: Ensure Node.js >=22.0.0 and pnpm 10.29.2

See [Troubleshooting Guide](getting-started/troubleshooting.md) for more solutions.

## Architecture

### Q: What is the difference between templates and clients?

**A:**
- **Templates**: Reusable starting points for specific industries (e.g., hair salon template)
- **Clients**: Production websites created from templates, customized for specific businesses

Templates live in `templates/`, clients in `clients/`.

### Q: What is Configuration-as-Code Architecture (CaCA)?

**A:** The principle that client websites are configured entirely through `site.config.ts` without requiring code changes. Config drives theming, features, and content.

### Q: How do packages depend on each other?

**A:** Follow the layer model:
- Lower layers can't depend on higher layers
- Packages declare dependencies in `package.json`
- Use `workspace:*` for internal package references

See [Module Boundaries](architecture/module-boundaries.md) for rules.

## Configuration

### Q: Where do I configure environment variables?

**A:** 
- Development: `.env.local` in the project root
- Production: Set in your deployment platform (Vercel, Netlify, etc.)
- Template: `.env.example` shows required variables

Never commit `.env.local` or secrets to Git.

### Q: How do I customize branding?

**A:** Edit `site.config.ts` in your client directory:
- Colors: `theme.colors`
- Fonts: `theme.fonts`
- Logo: `branding.logo`

Changes reflect immediately in development.

## Deployment

### Q: How do I deploy a client website?

**A:** Options:
- **Vercel**: Connect GitHub repo, select client directory
- **Netlify**: Similar to Vercel
- **Docker**: Use provided Dockerfile
- **Self-hosted**: Build and serve `.next` output

See [Deployment Guide](../deployment/) for details.

### Q: Can I deploy multiple clients from one repository?

**A:** Yes! Each client deploys independently. Configure your deployment platform to:
- Build from the specific client directory
- Use client-specific environment variables
- Deploy to separate domains

## Troubleshooting

### Q: Port already in use error

**A:** 
- Use a different port: `pnpm dev --port 3001`
- Kill the process using the port
- Check for other dev servers running

### Q: Module not found errors

**A:**
- Run `pnpm install` to ensure dependencies are installed
- Check that package is in `pnpm-workspace.yaml`
- Verify import paths are correct
- Clear `.next` cache and rebuild

### Q: TypeScript errors

**A:**
- Run `pnpm type-check` to see all errors
- Ensure types package (`@repo/types`) is up to date
- Check that imports use correct types
- Review [TypeScript Configuration](../tooling/typescript.md)

### Q: Build succeeds locally but fails in CI

**A:** Common causes:
- Node.js version mismatch (CI may use different version)
- Missing environment variables
- Cache issues: Clear CI cache and rebuild
- Platform-specific differences

## Contributing

### Q: How do I contribute?

**A:**
1. Read [CONTRIBUTING.md](../../CONTRIBUTING.md)
2. Review [Code of Conduct](../../CODE_OF_CONDUCT.md)
3. Fork the repository
4. Create a feature branch
5. Make changes following code standards
6. Submit a pull request

### Q: What should I document in my PR?

**A:** Include:
- What changed and why
- How to test the changes
- Screenshots for UI changes
- Breaking changes (if any)
- Related issues

### Q: How do I report a bug?

**A:**
1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js, pnpm versions)
   - Error messages/logs

## Security

### Q: How do I report a security vulnerability?

**A:** Use GitHub's private vulnerability reporting feature or email `security@example.com`. **Do not** report security issues in public issues.

See [SECURITY.md](../../SECURITY.md) for details.

### Q: Are dependencies scanned for vulnerabilities?

**A:** Yes. The CI pipeline includes:
- Automated dependency scanning
- Secret scanning
- SBOM generation
- Regular security audits

## Performance

### Q: How do I optimize bundle size?

**A:**
- Use dynamic imports for large components
- Enable tree shaking (automatic with proper imports)
- Review bundle analyzer output
- Remove unused dependencies

### Q: How do I improve page load performance?

**A:**
- Use Next.js Image component for images
- Enable static generation where possible
- Optimize fonts and assets
- Use React Server Components
- Monitor Core Web Vitals

## Integration

### Q: How do I add a new integration?

**A:**
1. Create integration in `packages/integrations/src/`
2. Add configuration to `site.config.ts`
3. Implement adapter pattern
4. Add error handling
5. Document usage

See [Integration Documentation](../integrations/) for examples.

### Q: How do I configure analytics?

**A:** 
- Set up in `site.config.ts` under `integrations.analytics`
- Configure consent management
- Add tracking code (if needed)
- Test in development

See [Analytics & Consent Flow](../ANALYTICS_CONSENT_FLOW.md).

## Documentation

### Q: How do I update documentation?

**A:**
1. Edit the relevant `.md` file
2. Follow [Documentation Standards](DOCUMENTATION_STANDARDS.md)
3. Include proper metaheaders
4. Test links and examples
5. Submit PR with documentation changes

### Q: Where do I find documentation for a specific feature?

**A:**
- Check [Documentation Hub](README.md) for navigation
- Use search (if available)
- Check feature-specific docs in `docs/features/`
- Review component docs in `docs/components/`

---

## Still Have Questions?

- Check [Troubleshooting Guide](getting-started/troubleshooting.md)
- Search existing [GitHub Issues](https://github.com/your-org/marketing-websites/issues)
- Ask in [GitHub Discussions](https://github.com/your-org/marketing-websites/discussions)
- Review [Architecture Documentation](architecture/README.md)

---

**Contributing:** Have a question that's not answered here? [Open an issue](https://github.com/your-org/marketing-websites/issues) or submit a PR to add it!
