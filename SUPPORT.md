---
diataxis: tutorial
audience: user
last_reviewed: 2026-02-19
review_interval_days: 90
project: marketing-websites
description: Support channels and getting help
tags: [support, help, community, issues]
primary_language: typescript
---

# Support

This guide explains how to get help with the marketing-websites platform, report issues, and engage with the community.

## Getting Help

### Quick Start

If you're new to the platform, start here:

1. **Read the Documentation**
   - [README.md](README.md) - Project overview and quick start
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Development setup
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System understanding

2. **Check Common Issues**
   - Review [Common Pitfalls](.context/RULES.md#common-pitfalls-to-avoid)
   - Search existing [GitHub Issues](https://github.com/your-org/marketing-websites/issues)

3. **Join the Community**
   - GitHub Discussions for questions
   - Code reviews for contribution feedback

### Support Channels

#### GitHub Issues

**Use for:** Bug reports, feature requests, technical problems

**Before creating an issue:**

- Search existing issues first
- Check if you're using the correct versions (Node.js >=22.0.0, pnpm 10.29.2)
- Run `pnpm validate-docs` to check for common configuration issues

**Issue templates:**

- **Bug Report:** For unexpected behavior or errors
- **Feature Request:** For new functionality
- **Documentation:** For documentation improvements
- **Question:** For help with usage (consider Discussions first)

#### GitHub Discussions

**Use for:** Questions, ideas, community conversation

**Discussion categories:**

- **Q&A:** Help with using the platform
- **Ideas:** Feature suggestions and brainstorming
- **Show and Tell:** Share what you've built
- **General:** Community topics

#### Code Reviews

**Use for:** Feedback on contributions, technical guidance

**Process:**

1. Submit pull request with clear description
2. Request review from maintainers
3. Address feedback promptly
4. Engage in constructive discussion

## Issue Triage

### Response Times

| Issue Type                               | Initial Response | Resolution Target |
| ---------------------------------------- | ---------------- | ----------------- |
| **Critical** (security, production down) | 2 hours          | 24 hours          |
| **High** (blocking development)          | 1 business day   | 1 week            |
| **Normal** (bugs, features)              | 3 business days  | 2 weeks           |
| **Low** (documentation, minor issues)    | 1 week           | 1 month           |

### Priority Levels

**Critical**

- Security vulnerabilities
- Production outages
- Data loss scenarios

**High**

- Blocking development for multiple users
- Broken core functionality
- Performance regressions

**Normal**

- Feature requests
- Non-critical bugs
- Documentation issues

**Low**

- Minor improvements
- Typos and formatting
- Nice-to-have enhancements

### Escalation Process

1. **Initial Response:** Acknowledge receipt and assess priority
2. **Investigation:** Reproduce issue, gather additional information
3. **Resolution:** Fix issue, provide workaround, or document limitation
4. **Communication:** Keep issue reporter updated on progress
5. **Closure:** Verify resolution and close issue

## Reporting Issues

### Bug Reports

**Required Information:**

- **Environment:** Node.js version, pnpm version, OS
- **Reproduction Steps:** Clear steps to reproduce the issue
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happened
- **Error Messages:** Full error output and stack traces
- **Configuration:** Relevant `site.config.ts` or environment variables

**Bug Report Template:**

```markdown
## Bug Description

Brief description of the issue

## Environment

- Node.js: v22.x.x
- pnpm: 10.29.2
- OS: [Your OS]
- Browser: [If applicable]

## Reproduction Steps

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Error Messages
```

Paste error output here

```

## Additional Context
Any other relevant information
```

### Feature Requests

**Required Information:**

- **Problem Statement:** What problem are you trying to solve?
- **Proposed Solution:** How should the feature work?
- **Alternatives Considered:** What other approaches did you consider?
- **Use Case:** Why is this feature important to you?

**Feature Request Template:**

```markdown
## Problem Statement

Clear description of the problem

## Proposed Solution

Detailed description of the proposed feature

## Alternatives Considered

Other approaches you've considered

## Use Case

Why this feature is important and how you'd use it

## Implementation Ideas (Optional)

Any thoughts on how this could be implemented
```

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication Guidelines

- **Be Respectful:** Treat all community members with respect
- **Be Constructive:** Focus on solutions, not criticism
- **Be Patient:** Remember that maintainers are volunteers
- **Be Helpful:** Help others when you can

### Contribution Guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed information on:

- Development setup
- Code style and standards
- Pull request process
- Testing requirements

## Troubleshooting

### Common Development Issues

#### Installation Problems

```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install

# Check version compatibility
node --version  # Should be >=22.0.0
pnpm --version  # Should be 10.29.2
```

#### Build Errors

```bash
# Clear build cache
pnpm clean

# Check TypeScript configuration
pnpm type-check

# Validate package exports
pnpm validate-exports
```

#### Test Failures

```bash
# Run tests with verbose output
pnpm test --verbose

# Run specific test file
pnpm test packages/ui/src/components/__tests__/Button.test.tsx

# Check test configuration
cat jest.config.js
```

### Common Configuration Issues

#### Client Configuration

```bash
# Validate client configuration
pnpm validate-client clients/starter-template

# Check site.config.ts syntax
pnpm --filter @clients/starter-template type-check
```

#### Environment Variables

```bash
# Check required environment variables
cp .env.example clients/starter-template/.env.local
# Edit .env.local with your values

# Validate environment schema
pnpm --filter @clients/starter-template dev
```

### Performance Issues

#### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true pnpm --filter @clients/starter-template build

# Check for unused dependencies
pnpm knip

# Validate performance budgets
pnpm build  # Check build output size
```

## Resources

### Documentation

- **[README.md](README.md)** - Project overview and quick start
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development setup and workflows
- **[TESTING.md](TESTING.md)** - Testing strategy and execution
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[ROADMAP.md](ROADMAP.md)** - Development roadmap
- **[docs/](docs/)** - Comprehensive documentation

### Reference Materials

- **[.context/MAP.md](.context/MAP.md)** - AI discoverability map
- **[.context/RULES.md](.context/RULES.md)** - Development rules and conventions
- **[llms.txt](llms.txt)** - AI documentation index

### External Resources

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[React Documentation](https://react.dev)**
- **[pnpm Documentation](https://pnpm.io)**
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)**

## Getting Involved

### Ways to Contribute

1. **Report Issues:** Help us improve by reporting bugs
2. **Submit Pull Requests:** Fix bugs or add features
3. **Improve Documentation:** Help make documentation better
4. **Answer Questions:** Help others in Discussions
5. **Share Your Work:** Show what you've built

### Maintainer Responsibilities

- **Issue Triage:** Review and prioritize issues
- **Code Review:** Review pull requests for quality
- **Community Support:** Help users in Discussions
- **Documentation:** Keep documentation up to date
- **Release Management:** Manage releases and changelogs

### Becoming a Maintainer

Active contributors who consistently demonstrate:

- Technical expertise
- Helpful community engagement
- Reliable code reviews
- Documentation improvements

may be invited to become maintainers.

## Contact Information

### Project Repository

- **GitHub:** https://github.com/your-org/marketing-websites
- **Issues:** https://github.com/your-org/marketing-websites/issues
- **Discussions:** https://github.com/your-org/marketing-websites/discussions

### Security Issues

For security vulnerabilities, please follow our [Security Policy](SECURITY.md) and report issues privately.

### License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

_Thank you for using the marketing-websites platform! We're here to help you succeed._
