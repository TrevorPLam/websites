# C.13 Security (SAST, Regression Tests)

## Metadata

- **Task ID**: c-13-security-sast-regression
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.13]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Security posture

## Context

Ensure security-sast.yml and secret-scan.yml are effective. Add infra/__tests__/security-regression/ for SSRF/XSS/injection scenarios. THEGOAL [C.13].

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Related Files

- `.github/workflows/security-sast.yml` – verify
- `.github/workflows/secret-scan.yml` – verify
- `packages/infra/__tests__/security-regression/` – create – SSRF, XSS, injection tests
- `docs/security/continuous-security-program.md` – reference

## Acceptance Criteria

- [ ] security-sast.yml runs and reports findings
- [ ] secret-scan.yml runs and reports findings
- [ ] security-regression tests cover: SSRF, XSS, injection
- [ ] Document security program

## Implementation Plan

- [ ] Verify workflows run in CI
- [ ] Add security regression test suite
- [ ] Document
- [ ] Address any critical findings

## Definition of Done

- [ ] Code reviewed and approved
- [ ] SAST and secret scan wired
- [ ] Regression tests added
- [ ] Build passes
