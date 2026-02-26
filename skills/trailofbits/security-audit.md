---
name: security-audit
description: |
  **SECURITY AUDIT WORKFLOW** - Comprehensive security analysis and vulnerability detection.
  USE FOR: Security assessments, vulnerability scanning, code security analysis.
  DO NOT USE FOR: Basic linting, simple code review.
  INVOKES: [filesystem, fetch].
meta:
  version: '1.0.0'
  author: 'trailofbits-ecosystem'
  category: 'security'
---

# Security Audit Workflow

## Overview

This Skill orchestrates comprehensive security audits including vulnerability scanning, code analysis, and security assessment using Trail of Bits security tools and methodologies.

## Prerequisites

- Security scanning tools installed
- Access to vulnerability databases
- Code repository access
- Security policies and standards defined
- Reporting infrastructure configured

## Workflow Steps

### 1. Initialize Security Assessment

**Action:** Set up security assessment environment and configuration

**Validation:**
- Security tools properly configured
- Vulnerability databases updated
- Assessment scope defined
- Security policies loaded

**MCP Server:** filesystem (for config files)

**Expected Output:** Configured security assessment environment

### 2. Scan for Known Vulnerabilities

**Action:** Scan codebase and dependencies for known vulnerabilities

**Validation:**
- Dependency scanning completed
- CVE database checked
- Vulnerability severity assessed
- False positives filtered

**MCP Server:** fetch (for vulnerability databases) or filesystem (for local scans)

**Expected Output:** Vulnerability scan report with severity classification

### 3. Perform Code Security Analysis

**Action:** Analyze source code for security issues and anti-patterns

**Validation:**
- Static analysis completed
- Security anti-patterns identified
- Code quality issues flagged
- Best practices violations documented

**MCP Server:** filesystem (for code analysis)

**Expected Output:** Code security analysis report with recommendations

### 4. Test Infrastructure Security

**Action:** Assess infrastructure and deployment security

**Validation:**
- Network security tested
- Configuration security verified
- Access controls validated
- Encryption standards checked

**MCP Server:** fetch (for infrastructure APIs) or filesystem (for config analysis)

**Expected Output:** Infrastructure security assessment report

### 5. Generate Security Report

**Action:** Compile comprehensive security audit report

**Validation:**
- All findings consolidated
- Risk assessment completed
- Remediation priorities set
- Executive summary prepared

**MCP Server:** filesystem (for report generation)

**Expected Output:** Complete security audit report with action items

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Assessment Setup | Tools missing | Install missing tools | No |
| Vulnerability Scan | Database unavailable | Use cached data | Partial |
| Code Analysis | Analysis timeout | Increase timeout or skip | Partial |
| Infrastructure Test | Access denied | Use alternative methods | Partial |
| Report Generation | Template errors | Use fallback template | No |

## Success Criteria

- Security assessment environment properly configured
- Vulnerability scan completed with severity classification
- Code security analysis completed with recommendations
- Infrastructure security assessed and documented
- Comprehensive security report generated
- Action items prioritized and actionable

## Environment Variables

```bash
# Required
SECURITY_TOOLS_PATH=/tools/security
VULNERABILITY_DB_URL=https://cve.mitre.org
REPORT_OUTPUT_PATH=/reports/security
ASSESSMENT_SCOPE=full

# Optional
SECURITY_POLICY_PATH=/policies/security
INFRASTRUCTURE_API_URL=https://api.infra.example.com
NOTIFICATION_WEBHOOK=https://hooks.example.com/security
MAX_SCAN_TIME=3600
```

## Usage Examples

### Agent Invocation Patterns

**For Claude/Windsurf:**

```text
claude, execute the security-audit workflow with the following parameters:
- scope: "full-application"
- severity-threshold: "medium"
- include-infrastructure: true
- generate-report: true
```

**For Cursor/Claude Code:**

```text
Execute skill security-audit with:
--scope=full-application
--severity-threshold=medium
--include-infrastructure=true
--generate-report=true
```

**Direct MCP Tool Usage:**

```text
Use the filesystem MCP server to access security tools and the fetch server for vulnerability databases.
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tools missing | Install required security scanning tools |
| Database unavailable | Use cached vulnerability data |
| Analysis timeout | Increase timeout or reduce scope |
| Access denied | Verify permissions and authentication |
| Report errors | Use fallback report template |

## Related Skills

- [vulnerability-scan](vulnerability-scan.md) - For focused vulnerability scanning
- [penetration-test](penetration-test.md) - For active security testing
- [crypto-audit](crypto-audit.md) - For cryptographic security analysis

## References

- Trail of Bits security methodologies
- CVE database documentation
- OWASP security standards
- Security assessment best practices
