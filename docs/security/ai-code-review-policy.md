# AI-Assisted Code Review Policy (Security)

This policy governs AI usage during code review for security-sensitive changes.

## Policy statements

1. AI feedback is advisory; reviewers retain final accountability.
2. Security-critical diffs must have at least one human reviewer.
3. AI-generated remediation requires explicit mention in PR description.
4. High/Critical findings cannot be waived solely on AI rationale.

## Applies to

- Authentication and authorization logic.
- Tenant routing and data access.
- Secrets handling and webhook verification.
- Dependency upgrades for vulnerability remediation.

## Required review steps

1. Confirm finding and severity from CI artifacts.
2. Validate AI recommendation against repository standards.
3. Verify tests cover exploit path and regression path.
4. Confirm no policy regressions in `docs/security/security-requirements.md`.
5. Record decision in PR using Conventional Comments style.

## Prohibited patterns

- Blind acceptance of AI code suggestions.
- Security approvals without rerunning automated gates.
- Prompting AI with secrets, credentials, or private incident data.

## Enforcement hooks

- Blocking workflows: `.github/workflows/security-sast.yml`, `.github/workflows/dependency-integrity.yml`.
- Triage process: `docs/security/security-findings-lifecycle.md`.
- Contribution standards: `CONTRIBUTING.md`.
