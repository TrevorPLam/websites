# DOMAIN-37-4-1: Select SAST Tool

## Status

Completed - 2026-02-24

## Summary

Selected a dual-engine SAST baseline: CodeQL + Semgrep.

## Changes

- Updated `.github/workflows/security-sast.yml` to run both tools.

## QA

- `pnpm validate-docs`
