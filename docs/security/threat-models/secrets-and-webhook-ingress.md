# Threat Model — Secrets and Webhook Ingress

- **Last reviewed:** 2026-02-24
- **Review cadence:** Annual
- **Owner:** Security Champions

## Boundary

Tenant secret management, webhook receivers, and third-party API credentials.

## Key threats

| STRIDE          | Threat                                    | Risk   | Mitigations                                        |
| --------------- | ----------------------------------------- | ------ | -------------------------------------------------- |
| Spoofing        | Forged webhook sender                     | High   | Signature verification and timestamp checks        |
| Tampering       | Payload mutation in transit               | Medium | HTTPS enforcement and signature mismatch rejection |
| Repudiation     | Undocumented webhook retries/actions      | Medium | Correlated structured logs and request IDs         |
| Info Disclosure | Secret leakage in repository or logs      | High   | Secret scanning in CI + pre-commit guards          |
| DoS             | Webhook replay/flood                      | Medium | Idempotency keys and rate limiting                 |
| EoP             | Secret overexposure to unauthorized roles | High   | Scoped secret access wrappers and least privilege  |

## Residual risks

- Add replay detection dashboards for repeated signature failures.
