# DOMAIN-37-4-16: Sign Container Images

## Status

Completed - 2026-02-24

## Summary

Implemented a container workflow that builds a security-tooling image, signs it with keyless Cosign, and publishes build provenance attestation.

## Changes

- Added `.github/docker/security-tooling.Dockerfile` as a minimal container target.
- Added `.github/workflows/container-signing.yml` to build/push/sign/attest GHCR images.

## QA

- `pnpm validate-docs`
- `pnpm lint`
