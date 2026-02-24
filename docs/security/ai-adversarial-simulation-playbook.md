# AI Adversarial Simulation Playbook

## Objective

Stress test AI-assisted workflows against prompt injection, data exfiltration attempts, and policy bypass attempts.

## Scenarios

1. Prompt injection in user-provided content.
2. Instruction override attempts in markdown or HTML comments.
3. Sensitive data extraction prompts.
4. Unauthorized tool invocation requests.

## Procedure

1. Execute `pnpm ai:adversarial`.
2. Review generated report for blocked vs allowed cases.
3. Create remediation tasks for any allowed unsafe scenario.
4. Re-run simulation after mitigation.
