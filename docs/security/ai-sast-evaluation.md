# AI-Augmented SAST Tool Evaluation

This document records the repository evaluation of AI-assisted SAST capabilities for Domain 37 Part 4.

## Goal

Identify AI-augmented SAST tooling that improves finding prioritization, fix quality, and developer adoption without weakening existing blocking gates.

## Evaluation criteria

| Criterion                              | Why it matters                                | Weight |
| -------------------------------------- | --------------------------------------------- | ------ |
| Rule quality + false-positive handling | Keeps noise low and trust high                | 30%    |
| AI remediation quality                 | Improves fix velocity and correctness         | 20%    |
| Monorepo + TypeScript support          | Must work with pnpm workspace + Next.js stack | 20%    |
| CI and SARIF interoperability          | Must integrate with GitHub code scanning      | 15%    |
| Cost and governance controls           | Required for sustainable enterprise rollout   | 15%    |

## Candidate comparison

| Tooling option                                      | AI capabilities reviewed                        | Fit summary                                         |
| --------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| Semgrep AppSec Platform + Assistant                 | AI triage and fix suggestions with policy packs | Best fit for existing Semgrep workflow              |
| GitHub Advanced Security (CodeQL + Autofix/Copilot) | Variant analysis and AI-assisted remediation    | Strong fit because CodeQL already enabled           |
| Snyk Code / DeepCode AI                             | AI issue explainability and fix guidance        | Good secondary option for dependency-heavy services |

## Decision

Adopt a **dual-engine baseline** with Semgrep + CodeQL and enable AI assistance in a governed manner:

1. Keep merge-blocking gates deterministic (rules + severity thresholds).
2. Use AI outputs for triage and patch drafting only.
3. Require human approval for remediation commits.

## Rollout phases

1. **Phase 1 (current)**: documentation and policy baseline.
2. **Phase 2**: enable AI suggestion workflow in PRs for security findings.
3. **Phase 3**: track MTTR and false-positive rate deltas for 60 days.

## Success metrics

- 20% reduction in mean time-to-remediate high findings.
- 15% reduction in reopened security issues.
- No increase in escaped critical vulnerabilities.

## Related artifacts

- `.github/workflows/security-sast.yml`
- `docs/security/ai-code-security-assistants.md`
- `docs/security/ai-code-review-policy.md`
- `docs/security/security-findings-lifecycle.md`
