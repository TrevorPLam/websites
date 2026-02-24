# AI Code Security Assistants

This guide defines how AI assistants are used for security remediation in this repository.

## Approved assistant scope

AI assistants may be used to:

- Explain SAST/SCA findings in plain language.
- Propose minimal remediation patches.
- Generate secure coding alternatives with trade-offs.
- Draft regression test cases for security fixes.

AI assistants may **not**:

- Auto-merge security fixes without human review.
- Change authentication, authorization, or tenant boundaries without explicit reviewer approval.
- Exfiltrate secrets, tokens, or production data into prompts.

## Required workflow

1. Trigger a finding from CI (`security-sast.yml` or `dependency-integrity.yml`).
2. Use AI assistant to draft a fix in a feature branch.
3. Add evidence comments referencing the finding ID/CWE.
4. Request human security review before merge.
5. Re-run blocking security workflows.

## Prompt guardrails

Always include these constraints in AI-assisted security prompts:

- Preserve tenant isolation and role checks.
- Keep validation at all trust boundaries.
- Avoid introducing new dependencies unless justified.
- Produce smallest safe patch and test updates.

## Evidence checklist for PRs

- Finding identifier and source workflow run URL.
- Before/after security behavior summary.
- Tests or checks proving remediation.
- Reviewer sign-off from code owner or security champion.

## Related references

- `docs/security/secure-coding-guidelines.md`
- `docs/security/ai-code-review-policy.md`
- `SECURITY.md`
