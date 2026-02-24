# AI-Native & Autonomous Practices Standard

This standard defines implementation requirements for Domain 37 Part 5 tasks 1–10.

## Task mapping

1. **DOMAIN-37-5-1**: non-human identity governance is defined in `docs/security/non-human-identity-governance.md`.
2. **DOMAIN-37-5-2**: prompts-as-code conventions are defined in `prompts/README.md`.
3. **DOMAIN-37-5-3**: composite identity action logging is specified in `docs/security/composite-identity-audit-logging.md`.
4. **DOMAIN-37-5-4**: policy-as-code baseline is stored in `policy/ai-agent-policy.yaml`.
5. **DOMAIN-37-5-5**: adversarial simulation process is defined in `docs/security/ai-adversarial-simulation-playbook.md`.
6. **DOMAIN-37-5-6**: requirements synthesis workflow is defined in `docs/standards/requirements-synthesis.md`.
7. **DOMAIN-37-5-7**: requirement conflict detection is automated by `scripts/ai/flag-requirement-conflicts.mjs`.
8. **DOMAIN-37-5-8**: architecture pattern proposals are guided by `prompts/architecture-patterns.prompt.md`.
9. **DOMAIN-37-5-9**: self-healing test strategy is documented in `docs/testing/self-healing-tests.md`.
10. **DOMAIN-37-5-10**: AI fuzzing workflow is documented in `docs/testing/ai-fuzzing.md`.
11. **DOMAIN-37-5-11**: intelligent rollback decisions are automated by `scripts/ai/deploy-intelligent-rollback.mjs` and documented in `docs/ai/intelligent-rollback-agents.md`.
12. **DOMAIN-37-5-12**: predictive maintenance alerts are automated by `scripts/ai/enable-predictive-maintenance.mjs` and documented in `docs/ai/predictive-maintenance.md`.
13. **DOMAIN-37-5-13**: technical debt backlog generation is automated by `scripts/ai/automate-technical-debt-reduction.mjs` and documented in `docs/ai/technical-debt-automation.md`.

## Operating expectations

- Run AI governance checks in CI for changed policy and prompt files.
- Keep prompts versioned and reviewed like source code.
- Require human approval for high-impact autonomous actions.
- Persist all AI-assisted decision traces in auditable logs.
