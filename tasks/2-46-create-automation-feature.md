# 2.46 Create Automation Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), workflow builder, AI automation

**Objective:** Automation feature with 5+ implementation patterns, workflow builder, and AI automation.

**Implementation Patterns:** Config-Based, Workflow-Based, AI-Based, Rule-Based, Hybrid (5+ total)

**Files:** `packages/features/src/automation/` (index, lib/schema, lib/adapters, lib/automation-config.ts, lib/workflow.ts, lib/ai.ts, lib/rules.ts, components/AutomationSection.tsx, components/AutomationConfig.tsx, components/AutomationWorkflow.tsx, components/AutomationAI.tsx, components/AutomationRule.tsx, components/AutomationHybrid.tsx)

**API:** `AutomationSection`, `automationSchema`, `createAutomationConfig`, `createWorkflow`, `runAutomation`, `aiAutomate`, `AutomationConfig`, `AutomationWorkflow`, `AutomationAI`, `AutomationRule`, `AutomationHybrid`

**Checklist:** Schema; adapters; workflow builder; AI automation; rules; implementation patterns; export.
**Done:** Builds; all patterns work; workflow builder functional; AI automation works.
**Anti:** No custom AI models; use existing services.

---
