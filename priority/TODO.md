# TODO - Governance Framework Implementation

This document contains tasks derived from the 9 phase documents that describe the Textbook Codebase Standard v2.2 governance framework.

## Phase 1: Master Handoff Skeleton + Locked Decisions

- [ ] Create `/.repo` directory structure
- [ ] Implement authority chain: Manifest > Agents > Standards > Product
- [ ] Apply all 25 selected principles (P3-P25)
- [ ] Configure quality gates with soft block + auto-generated waivers
- [ ] Set up waiver lifecycle with full history tracking at `/waivers/historical/`
- [ ] Configure security baseline with dependency vulnerability checks
- [ ] Implement hybrid domain-feature-layer boundary model
- [ ] Add location anchors (file headers, filepaths in PRs/tasks/ADRs)
- [ ] Add code anchors (region comments, critical excerpts, named functions)
- [ ] Set up navigation aids (domain/feature indexes, directory READMEs)
- [ ] Implement safety heuristics (impact summary, explicit unknowns, rollback plans)
- [ ] Create HITL storage structure with split model (index + items)
- [ ] Apply governance contract with concise legal-style tone

## Phase 2: Policy Corpus (Authoritative Rules)

- [ ] Create `/.repo/policy/CONSTITUTION.md` with 8 articles
- [ ] Create `/.repo/policy/PRINCIPLES.md` with all 25 principles (P3-P25)
- [ ] Create `/.repo/policy/QUALITY_GATES.md` with merge rules
- [ ] Create `/.repo/policy/SECURITY_BASELINE.md` with absolute prohibitions
- [ ] Create `/.repo/policy/BOUNDARIES.md` with hybrid domain-feature-layer model
- [ ] Create `/.repo/policy/HITL.md` with HITL workflow and item format
- [ ] Ensure all policy files use plain English (no-coder friendly)
- [ ] Document verifiable-over-persuasive principle
- [ ] Document no-guessing rule with UNKNOWN handling
- [ ] Define security review triggers (IDs: 1,2,4,5,6,8,9,10)
- [ ] Define mandatory HITL actions (IDs: 1-8)

## Phase 3: Manifest + Command Resolution Standard

- [ ] Create `/.repo/repo.manifest.yaml` template
- [ ] Fill `commands.install` with actual command from repo
- [ ] Fill `commands.check:quick` with fast build command
- [ ] Fill `commands.check:ci` with full CI command
- [ ] Fill `commands.check:release` with release verification command
- [ ] Fill `commands.check:governance` with governance-verify command
- [ ] Fill `commands.check:boundaries` with boundary checker command
- [ ] Fill `commands.check:security` with security scan command
- [ ] Create `/.repo/docs/standards/manifest.md` with command resolution process
- [ ] Define verify_profiles (quick, ci, release, governance)
- [ ] Configure test requirements (unit+integration)
- [ ] Configure budget enforcement (hard_fail_with_waiver)
- [ ] Configure security settings (every_pr: true, secrets prohibition)
- [ ] Set up boundaries edges model (layered_allow_list)

## Phase 4: Agents Framework + Folder-Level Guides

- [ ] Create `/.repo/agents/AGENTS.md` with core agent rules
- [ ] Create `/.repo/agents/capabilities.md` listing all agent capabilities
- [ ] Create `/.repo/agents/roles/primary.md` for primary agent role
- [ ] Create `/.repo/agents/roles/secondary.md` for secondary agent role
- [ ] Create `/.repo/agents/roles/reviewer.md` for reviewer role
- [ ] Create `/.repo/agents/roles/release.md` for release role
- [ ] Create `/.repo/AGENT.md` as folder-level guide template
- [ ] Create `/src/AGENT.md` with source-specific rules
- [ ] Create `/src/platform/AGENT.md` for platform layer
- [ ] Create `/tests/AGENT.md` for test directory
- [ ] Create `/docs/AGENT.md` for documentation directory
- [ ] Create `/scripts/AGENT.md` for scripts directory
- [ ] Document three-pass code generation requirement (Plan → Change → Verify)
- [ ] Document filepaths-required-everywhere rule

## Phase 5: PR Operating System

- [ ] Create `/.repo/agents/prompts/task_packet.md` template
- [ ] Create `/.repo/agents/prompts/pr_template.md` template
- [ ] Create `/.repo/agents/checklists/change-plan.md` checklist
- [ ] Create `/.repo/agents/checklists/pr-review.md` checklist
- [ ] Create `/.repo/agents/checklists/incident.md` checklist
- [ ] Create `/.repo/templates/PR_TEMPLATE.md` with strict structure
- [ ] Document one-change-type-per-PR rule
- [ ] Document evidence-over-vibes requirement
- [ ] Define task packet fields (goal, non_goals, acceptance_criteria, etc.)
- [ ] Define PR template fields (change_type, summary, evidence, etc.)

## Phase 6: Logging + Trace + Waiver + ADR Templates

- [ ] Create `/.repo/templates/AGENT_LOG_TEMPLATE.md`
- [ ] Create `/.repo/templates/AGENT_TRACE_SCHEMA.json` with JSON schema
- [ ] Create `/.repo/templates/WAIVER_TEMPLATE.md`
- [ ] Create `/.repo/templates/ADR_TEMPLATE.md`
- [ ] Create `/.repo/templates/RUNBOOK_TEMPLATE.md`
- [ ] Create `/.repo/templates/RFC_TEMPLATE.md`
- [ ] Implement trace validation against schema
- [ ] Document no-secrets-in-logs rule
- [ ] Document waiver lifecycle (rare + temporary + expiration)
- [ ] Define ADR structure (context, decision, consequences, boundary impact)

## Phase 7: Automation Stubs

- [ ] Create `/.repo/automation/ci/governance-verify.yml` template
- [ ] Create `/.repo/automation/scripts/governance-verify.js` stub
- [ ] Create `/.repo/automation/scripts/validate-agent-trace.js` stub
- [ ] Wire CI job to call manifest-defined commands
- [ ] Implement governance-verify logic (structure + artifacts + logs + trace)
- [ ] Implement trace validation against AGENT_TRACE_SCHEMA.json
- [ ] Connect automation to quality gates

## Phase 8: Docs Glue (Indexes + Standards + ADR Scaffold)

- [ ] Create `/.repo/docs/DOCS_INDEX.md` as documentation entry point
- [ ] Create `/.repo/docs/standards/documentation.md`
- [ ] Create `/.repo/docs/standards/adr.md` with ADR triggers
- [ ] Create `/.repo/docs/standards/api.md` with API documentation rules
- [ ] Create `/.repo/docs/standards/style.md` with coding style rules
- [ ] Create `/.repo/docs/adr/README.md` for ADR history
- [ ] Create `/.repo/docs/adr/0001-example.md` as example ADR
- [ ] Link DOCS_INDEX to all key policy files
- [ ] Document docs-age-with-code principle
- [ ] Document examples-are-contracts principle

## Phase 9: Root Scaffolds

- [ ] Update `/README.md` to link to `/.repo/DOCS_INDEX.md`
- [ ] Create or update `/SECURITY.md` linking to security baseline
- [ ] Create or update `/CODEOWNERS` file
- [ ] Verify `/LICENSE` file exists
- [ ] Create `/P0TODO.md` for critical priority tasks
- [ ] Create `/P1TODO.md` for high priority tasks
- [ ] Create `/P2TODO.md` for normal priority tasks
- [ ] Create `/COMPLETEDTODO.md` for archived completed tasks
- [ ] Create `/.repo/archive/todo/README.md` for TODO snapshots

## Cross-Phase Integration Tasks

- [ ] Ensure all filepaths are absolute and consistent
- [ ] Verify no-guessing rule is enforced everywhere
- [ ] Verify UNKNOWN handling is documented in all relevant places
- [ ] Ensure HITL workflow integrates with PR process
- [ ] Verify waiver workflow integrates with quality gates
- [ ] Test governance-verify against all quality gates
- [ ] Validate all JSON schemas are syntactically correct
- [ ] Ensure all templates reference correct filepaths
- [ ] Verify boundary enforcement logic matches policy
- [ ] Test end-to-end PR workflow with all phases integrated
- [ ] Document rollback procedures for each phase
- [ ] Create verification commands for each phase

## Acceptance Criteria (Overall)

- [ ] All 9 phases are fully implemented
- [ ] All policy files exist and are complete
- [ ] All templates are created and validated
- [ ] All automation stubs are in place
- [ ] Command resolution is complete (no `<FILL_FROM_REPO>` or `<UNKNOWN>` placeholders)
- [ ] Governance-verify successfully runs
- [ ] All documentation links are valid
- [ ] HITL workflow is functional
- [ ] Waiver workflow is functional
- [ ] Boundary checking is operational
- [ ] Security baseline is enforced
- [ ] All 25 principles are documented and traceable
