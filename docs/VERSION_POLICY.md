/**
 * @file docs/VERSION_POLICY.md
 * @role docs
 * @summary Evergreen version policy and upgrade guidelines.
 *
 * @entrypoints
 * - Version management and upgrade planning
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - Internal: package.json engines
 * - Internal: renovate.json
 *
 * @used_by
 * - Maintainers and development team
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: version requirements and best practices
 * - outputs: upgrade guidelines and schedules
 *
 * @invariants
 * - Node.js 24+ required for development
 * - Automated updates for patch/minor versions
 * - Manual review for major versions
 *
 * @gotchas
 * - Major upgrades require testing and migration
 * - Some dependencies may lag behind Node.js releases
 *
 * @verification
 * - Renovate creates PRs following policy
 * - CI fails on version requirement violations
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-10
 */

# Version Policy & Evergreen Maintenance

**Last Updated:** 2026-02-10  
**Policy Version:** 1.0

## Overview

This document defines the evergreen maintenance policy for the Hair Salon Template, ensuring consistent updates, security patches, and compatibility across the ecosystem.

## Node.js Version Policy

### Current Requirements
- **Development:** Node.js `>=24.0.0` (Active LTS)
- **Production:** Node.js `>=24.0.0` (Active LTS)
- **CI/CD:** Node.js `24.x` (fixed version for consistency)

### Upgrade Schedule
- **Patch Updates:** Automated via Renovate
- **Minor Updates:** Automated via Renovate with 3-day stability period
- **Major Updates:** Manual review with 7-day stability period

### Version Support Matrix
| Node.js Version | Status | EOL Date | Support Level |
|----------------|---------|------------|---------------|
| 24.x | Active LTS | 2028-04-30 | ✅ Primary |
| 22.x | Maintenance LTS | 2027-04-30 | ⚠️ Deprecated |
| 20.x | Maintenance | 2026-04-30 | ❌ EOL Soon |

## Framework Version Policy

### Next.js
- **Current Range:** `^15.0.0`
- **Upgrade Strategy:** Minor updates automated, major updates manual
- **Compatibility:** Requires React 19+

### React
- **Current Range:** `^19.0.0`
- **Upgrade Strategy:** Patch updates automated, minor/major manual
- **Note:** React 19 required for Next.js 15

### TypeScript
- **Current Range:** `^5.7.0`
- **Upgrade Strategy:** Minor updates automated, major updates manual

## Dependency Management

### Automated Updates (Renovate)
- **Patch Updates:** Auto-merge if CI passes
- **Minor Updates:** Require approval after 3-day stability
- **Major Updates:** Manual review with 7-day testing period

### Update Schedule
- **Frequency:** Weekly (Mondays 6:00 UTC)
- **Batching:** Grouped by ecosystem (React, Next.js, TypeScript)
- **Limits:** Max 3 concurrent PRs, 2 per hour

### Security Updates
- **Critical:** Immediate creation and notification
- **High:** Within 24 hours
- **Medium:** Within 72 hours
- **Low:** Next scheduled update

## Quality Gates

### CI Requirements
- **Node Version:** Must meet minimum requirements
- **Build Status:** All builds must pass
- **Test Coverage:** Minimum 80% for new code
- **Security Scan:** No high/critical vulnerabilities

### Rollback Policy
- **Automated:** Auto-merged updates can be reverted via CI failure
- **Manual:** Major version upgrades require manual rollback plan
- **Monitoring:** 7-day monitoring period after major upgrades

## Upgrade Path Guidelines

### Planning Phase
1. **Compatibility Check:** Verify ecosystem compatibility
2. **Test Plan:** Create comprehensive test strategy
3. **Migration Guide:** Document breaking changes
4. **Rollback Plan:** Prepare emergency rollback

### Execution Phase
1. **Feature Branch:** Isolate upgrade work
2. **Incremental Testing:** Test individual components
3. **Integration Testing:** Full system validation
4. **Performance Testing:** Benchmark against baseline

### Post-Upgrade
1. **Monitoring:** 7-day enhanced monitoring
2. **Documentation:** Update all relevant docs
3. **Team Training:** Communicate changes to team
4. **Cleanup:** Remove deprecated code/patterns

## Compliance & Security

### SBOM Generation
- **Frequency:** Every push to main branch
- **Formats:** SPDX JSON + CycloneDX JSON
- **Retention:** 90 days (extendable for compliance)
- **Access:** Security team and compliance auditors

### Vulnerability Management
- **Scanning:** Automated on every PR
- **Thresholds:** Fail on high/critical vulnerabilities
- **Remediation:** Based on CVSS score and exploitability
- **Reporting:** Monthly security summary

## Tools & Automation

### Renovate Configuration
- **File:** `renovate.json`
- **Scope:** All workspace packages
- **Schedule:** Weekly automated updates
- **Rules:** Ecosystem-specific grouping and policies

### CI/CD Integration
- **SBOM:** Generated via `anchore/sbom-action`
- **Security:** `pnpm audit` integration
- **Quality Gates:** Multi-stage validation
- **Artifacts:** 90-day retention with compliance access

## Monitoring & Alerting

### Metrics
- **Update Success Rate:** Target >95%
- **CI Failure Rate:** Target <5%
- **Security Response Time:** Target <24h for critical
- **Performance Regression:** Target <5% degradation

### Alerts
- **Failed Updates:** Immediate notification
- **Security Issues:** Critical alert within 1 hour
- **Performance Regression:** Warning within 4 hours
- **Compliance Violations:** Daily summary

## References

- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [Next.js Compatibility](https://nextjs.org/docs/upgrading)
- [React Version Policy](https://react.dev/learn/version-policy)
- [Renovate Documentation](https://docs.renovatebot.com/)
- [SBOM Standards](https://cyclonedx.org/capability-overview/)

---

**Policy Review:** Quarterly or as needed  
**Owner:** Development Team  
**Approval:** Required for major policy changes
