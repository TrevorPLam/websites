# CNAPP Integration for Security Findings

This document defines how repository-native security signals are exported into a CNAPP platform for centralized cloud + application posture analytics.

## Workflow

- Workflow file: `.github/workflows/security-cnapp-export.yml`
- Trigger: `workflow_run` for Security SAST, Security Container and IaC Scan, and Dependency Integrity.
- Manual trigger: `workflow_dispatch` for validation runs.

## Required secrets

- `CNAPP_INGEST_URL`: HTTPS endpoint for CNAPP ingestion API.
- `CNAPP_API_TOKEN`: Bearer token for ingestion authorization.

If secrets are not configured, workflow execution is non-blocking and exits successfully after logging the skipped export.

## Payload model

The workflow uploads a compressed package that includes:

- Security artifacts downloaded from the upstream workflow run (`cnapp-artifacts/`).
- Metadata envelope (`cnapp-payload/metadata.json`) with repository, workflow, and run URL context.

## Operational checks

- Confirm CNAPP ingestion response code is 2xx.
- Validate ingestion pipeline indexes run metadata and finding source tool.
- Ensure failed exports create alerts in security operations.
