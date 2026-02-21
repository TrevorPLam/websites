<!--
/**
 * @file docs/operations/maintenance.md
 * @role docs
 * @summary Documentation maintenance processes and automation.
 *
 * @entrypoints
 * - Referenced from documentation hub
 * - Operations documentation
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/DOCUMENTATION_STANDARDS.md (standards)
 * - scripts/validate-documentation.js (validation)
 *
 * @used_by
 * - Documentation maintainers
 * - CI/CD systems
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: documentation changes
 * - outputs: validated and maintained documentation
 *
 * @invariants
 * - Maintenance processes must be automated
 * - Regular reviews must be scheduled
 *
 * @gotchas
 * - Some checks require manual review
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add more automated checks
 * - Integrate with code changes
 *
 * @verification
 * - ✅ Processes verified
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Documentation Maintenance

**Last Updated:** 2026-02-18  
**Status:** Active Guide  
**Related:** [Documentation Standards](DOCUMENTATION_STANDARDS.md), [Validation Script](../../scripts/validate-documentation.js)

---

This guide describes the processes and automation for maintaining documentation quality and keeping it up-to-date.

## Automated Maintenance

### CI/CD Validation

Documentation is automatically validated on every PR and push:

**Triggered when:**

- Files in `docs/` change
- Any `.md` file changes
- Manual workflow dispatch

**Checks performed:**

- Metaheader validation
- Markdown formatting
- Link validation
- Accessibility compliance
- Code example validation

**See:** [`.github/workflows/docs-validation.yml`](../../.github/workflows/docs-validation.yml)

### Pre-commit Hooks (Recommended)

Add to your `.husky/pre-commit` or similar:

```bash
#!/bin/sh
# Run documentation validation before commit
pnpm validate-docs || exit 1
```

## Manual Maintenance Tasks

### Weekly Tasks

**Link Validation**

```bash
# Check for broken links
pnpm validate-docs
```

**Review Recent Changes**

- Check PRs for documentation updates
- Verify new documentation follows standards
- Ensure links are valid

### Monthly Tasks

**Content Freshness Check**

- Review "Last Updated" dates
- Identify outdated sections
- Update examples and code snippets
- Check version numbers

**Coverage Review**

- Identify undocumented features
- Check for missing tutorials
- Verify all packages have documentation

**Quality Metrics**

- Review validation results
- Check accessibility compliance
- Verify search functionality

### Quarterly Tasks

**Comprehensive Review**

- Full documentation audit
- Update all "Last Updated" dates
- Review and update standards
- Check for deprecated content
- Update roadmap and plans

**Community Feedback**

- Review documentation issues
- Analyze search queries
- Check FAQ for new questions
- Update based on feedback

## Update Triggers

### Code Changes

When code changes, documentation should be updated:

**Automatic Triggers:**

- API changes → Update API docs
- Component changes → Update component docs
- Configuration changes → Update config docs
- Feature additions → Add feature docs

**Manual Review Needed:**

- Architecture changes → Update architecture docs
- Process changes → Update guides
- Breaking changes → Update migration guides

### Issue Labels

Use GitHub issue labels to track documentation needs:

- `documentation` - Documentation issue
- `documentation/outdated` - Outdated content
- `documentation/missing` - Missing documentation
- `documentation/improvement` - Enhancement needed

## Maintenance Checklist

### For Each Documentation Update

- [ ] Metaheader updated with current date
- [ ] Links validated (`pnpm validate-docs`)
- [ ] Code examples tested
- [ ] Accessibility compliance verified
- [ ] Related documentation updated
- [ ] Changelog updated (if significant)

### For New Documentation

- [ ] Follows [Documentation Standards](DOCUMENTATION_STANDARDS.md)
- [ ] Includes complete metaheader
- [ ] Linked from appropriate index/README
- [ ] Added to navigation (if applicable)
- [ ] Reviewed for clarity and accuracy

### For Documentation Removal

- [ ] All references removed
- [ ] Links updated
- [ ] Navigation updated
- [ ] Deprecation notice added (if temporary)

## Automation Scripts

### Validation Script

```bash
# Run full validation
pnpm validate-docs

# Strict mode (treats warnings as errors)
pnpm validate-docs:strict
```

**Features:**

- Metaheader validation
- Link checking
- Accessibility checks
- Code example validation
- Markdown linting

### Link Checking

```bash
# Validate all links
pnpm validate-docs

# Check external links (with rate limiting)
# Note: External link checking is limited to avoid rate limits
```

### Freshness Check

Manual process:

1. Search for "Last Updated" dates older than 6 months
2. Review content for accuracy
3. Update dates and content as needed

## Quality Metrics

### Target Metrics

- **Coverage**: 95%+ of public APIs documented
- **Accuracy**: 95%+ documentation up-to-date
- **Link Validity**: 98%+ links working
- **Accessibility**: 100% WCAG 2.2 AA compliance
- **Validation**: 100% pass rate in CI

### Monitoring

Track metrics through:

- CI/CD validation results
- GitHub issue labels
- Community feedback
- Documentation analytics (when available)

## Update Process

### Standard Update

1. **Identify need**: Issue, PR, or review
2. **Create branch**: `docs/update-[topic]`
3. **Make changes**: Follow standards
4. **Validate**: Run `pnpm validate-docs`
5. **Test**: Verify links and examples
6. **Submit PR**: Use documentation template
7. **Review**: Get approval
8. **Merge**: Update is live

### Major Update

1. **Plan**: Create issue with update plan
2. **Discuss**: Get feedback from team
3. **Implement**: Follow standard process
4. **Review**: Comprehensive review
5. **Deploy**: Merge and verify

## Troubleshooting

### Validation Failures

**Common issues:**

- Missing metaheaders → Add complete metaheader
- Broken links → Fix or remove links
- Formatting errors → Run `pnpm format`
- Accessibility issues → Fix per WCAG guidelines

**Solutions:**

```bash
# Check specific file
node scripts/validate-documentation.js --docs-path docs/specific-file.md

# Fix formatting
pnpm format

# Re-validate
pnpm validate-docs
```

### Link Issues

**Broken internal links:**

- Check file paths
- Verify file exists
- Check for typos
- Update relative paths

**Broken external links:**

- Verify URL is correct
- Check if site is down
- Find alternative source
- Remove if obsolete

## Best Practices

### Regular Updates

- Update documentation with code changes
- Review quarterly for freshness
- Respond to community feedback
- Keep examples current

### Version Control

- Commit documentation with code
- Use descriptive commit messages
- Link to related issues/PRs
- Tag releases appropriately

### Collaboration

- Review documentation in PRs
- Provide constructive feedback
- Recognize contributions
- Share knowledge

## Related Documentation

- [Documentation Standards](DOCUMENTATION_STANDARDS.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [Validation Script](../../scripts/validate-documentation.js)
- [CI/CD Workflow](../../.github/workflows/docs-validation.yml)

---

**Maintainers:** Keep this guide updated as processes evolve!
