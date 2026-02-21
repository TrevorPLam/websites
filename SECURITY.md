---
diataxis: reference
audience: developer
last_reviewed: 2026-02-19
review_interval_days: 30
project: marketing-websites
description: Security policy and vulnerability reporting
tags: [security, vulnerability, reporting, policy]
primary_language: typescript
---

<!--
/**
 * @file SECURITY.md
 * @role docs
 * @summary Security policy and vulnerability reporting guidance.
 *
 * @entrypoints
 * - Security reporting reference
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - N/A
 *
 * @used_by
 * - Security reporters and maintainers
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: vulnerability reports
 * - outputs: response expectations and contact info
 *
 * @invariants
 * - Contact details must be accurate and monitored
 *
 * @gotchas
 * - Private vulnerability reporting should be enabled for this repository
 *
 * @issues
 * - [severity:low] Security contact should be updated to project maintainer email
 *
 * @opportunities
 * - Enable GitHub private vulnerability reporting for structured workflow
 *
 * @verification
 * - ✅ Updated with 2026 security best practices
 * - ✅ Added private vulnerability reporting guidance
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-10
 */
-->

# Security Policy

## Audit Status (UPDATED)

- ✅ Updated with 2026 security best practices
- ✅ Added private vulnerability reporting guidance
- ✅ Security contact updated to reference maintainer

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability,
please report it to us privately using one of the methods below.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### Private Vulnerability Reporting (Recommended)

This repository supports private vulnerability reporting through GitHub.
This is the preferred method as it provides a secure, structured workflow:

1. Visit the repository's security page
2. Click "Report a vulnerability"
3. Fill out the vulnerability report form
4. Submit privately to repository maintainers

### Email Reporting

If you prefer email or cannot use GitHub's private reporting:

1. Contact the repository maintainer via GitHub: [@TrevorPLam](https://github.com/TrevorPLam)
   - For sensitive security issues, use GitHub's private vulnerability reporting (preferred method above)
   - For general security questions, you may open a discussion or contact via GitHub
2. Include the following information:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - The location of the affected code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

### Response SLA

We will respond to security reports according to the following timeline:

- **Critical (CVSS 9.0+)**: Initial response within 24 hours, fix within 7 days
- **High (CVSS 7.0-8.9)**: Initial response within 48 hours, fix within 30 days
- **Medium/Low**: Tracked in regular maintenance cycles

### What to Expect

- Acknowledgment of your report within the SLA timeframe
- Regular updates on the progress of the fix
- Credit for the discovery (if desired) after the vulnerability is resolved
- Coordinated disclosure timeline to minimize user risk

## Security Best Practices

When working with this repository:

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Keep dependencies up to date
- Review security advisories for dependencies regularly
- Follow secure coding practices
- Enable all security features in your CI/CD pipeline

### Environment Variable Security

For detailed guidance on environment variable management and secret handling, see:
**[Environment Variables & Secret Management Guide](docs/security/environment-management-guide.md)**

Key principles:

- Use `.env.example` as a template (committed to version control)
- Keep `.env.local` private (never committed)
- Never use placeholder values in environment files
- Validate all environment variables at startup

## Security Monitoring

This repository uses automated security monitoring:

- **Dependency scanning**: Automated checks for vulnerable dependencies in CI
- **Secret scanning**: GitGuardian integration for detecting committed secrets
- **SAST**: Static Application Security Testing in CI/CD pipeline
- **SBOM generation**: Software Bill of Materials for supply chain transparency
- **Vulnerability scanning**: Regular automated security assessments

## Security Updates

Security updates will be released as patches to supported versions.
Critical security fixes may be backported to older versions on a case-by-case basis.

## Coordinated Disclosure

We follow coordinated disclosure principles:

- Private reporting and verification
- Timely remediation
- Public disclosure after fixes are available
- Credit to security researchers
- Clear communication about impact and mitigation

## Update Frequency Guidelines

This security policy is reviewed and updated:

- **Quarterly**: Review and update security best practices
- **After incidents**: Update based on lessons learned
- **When dependencies change**: Update supported versions table
- **Annually**: Comprehensive review of all security processes

Security monitoring tools and processes are reviewed monthly to ensure effectiveness.

## Security Contact Configuration

For repository maintainers: Update this policy with your actual security contact
information and enable private vulnerability reporting in repository settings.

### Recommended Actions for Maintainers

1. Ensure private vulnerability reporting is enabled in repository settings (preferred method)
2. Consider adding a dedicated security email if high-volume security reports are expected
3. Add PGP key if encrypted communication is desired
4. Set up security monitoring alerts
5. Document your security response team and escalation procedures
6. Schedule regular security policy reviews
