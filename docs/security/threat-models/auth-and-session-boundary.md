# Threat Model — Authentication and Session Boundary

- **Last reviewed:** 2026-02-24
- **Review cadence:** Annual
- **Owner:** Security Champions

## Boundary

Authentication entry points, session handling, and privileged server actions.

## Key threats

| STRIDE          | Threat                                    | Risk   | Mitigations                                                 |
| --------------- | ----------------------------------------- | ------ | ----------------------------------------------------------- |
| Spoofing        | Session token replay                      | High   | Secure cookies, server-side auth checks, short-lived tokens |
| Tampering       | Manipulated role claims                   | High   | Role checks in server actions, tenant-scoped authorization  |
| Repudiation     | Missing admin action traceability         | Medium | Audit logs for privileged actions                           |
| Info Disclosure | Session leakage in logs                   | Medium | Redaction guidance in secure coding guidelines              |
| DoS             | Auth endpoint flooding                    | Medium | Rate limiting middleware                                    |
| EoP             | Privilege escalation via unchecked action | High   | Mandatory wrapper and role guardrails                       |

## Residual risks

- Improve anomaly detection for suspicious sign-in spikes.
