# Threat Modeling Methodology

This repository uses a lightweight STRIDE-based threat modeling approach for high-risk features.

## Scope

Threat models are required for:

- Authentication and authorization paths.
- Tenant-isolated data access and write APIs.
- Secret storage, key rotation, and webhook integrations.
- Public ingress points (forms, webhooks, admin APIs).

## Process

1. **Define feature boundary**: identify trust boundaries, data stores, and external systems.
2. **Enumerate assets**: tenant data, secrets, session data, and audit trails.
3. **Run STRIDE**: evaluate spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege.
4. **Score risk**: use a simple impact × likelihood matrix (Low, Medium, High).
5. **Map mitigations**: tie each threat to code-level controls, workflow checks, and owners.
6. **Track follow-ups**: convert missing mitigations into backlog tasks.

## Required sections for each model

- Feature overview and trust boundaries
- Data flow summary
- Threat register with STRIDE category
- Existing mitigations in repository
- Remaining risks and remediation owner
- Last reviewed date and next annual review window

## Storage location

Store threat models in `docs/security/threat-models/`.
