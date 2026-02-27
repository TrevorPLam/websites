THE MASTER ROADMAP: Infinity Marketing Engine
> Current Status: Wave 0 Complete | Next Milestone: Wave 1 (JSON UI Engine)
> Architecture: FSD v2.1 + Hexagonal Ports/Adapters
> Execution Mode: 100% Agentic / MCP-Enabled
> 
🌊 WAVE 0: Foundation & MCP (COMPLETED)
These tasks established the environment and the AI's "memory."
 * [x] TASK-001: Initialize FSD v2.1 Directory Structure.
 * [x] TASK-002: Configure Supabase with Tenant-Level RLS.
 * [x] TASK-003: Setup MCP (Model Context Protocol) for Agent Memory.
 * [x] TASK-004: Implementation of @repo/shared and @repo/config.
🌊 WAVE 1: The "Infinite" UI Engine (High Priority)
Goal: Move from hard-coded React pages to a JSON-driven layout system that allows AI to "generate" websites by updating a database.
[ ] TASK-010: Standardize the Core UI Schema
 * Description: Define the TypeScript interface for a "Page Blueprint" (JSON).
 * Agent Context: Work in packages/core-engine. Use Zod for schema validation.
 * Constraints:
   * Schema must support sections[], each with componentId, props, and styles.
   * Components must map to the packages/ui-library.
 * Validation: Pass a JSON object to a helper and ensure it returns a valid, type-safe Page object.
[ ] TASK-011: Integrate Visual Editor (Puck/Craft.js)
 * Description: Install and configure a visual canvas for tenant admins to modify their JSON layouts.
 * Agent Context: Integrate Puck into apps/web/src/widgets/editor.
 * Constraints:
   * The editor must save the resulting JSON to the site_layouts table in Supabase.
   * Must be restricted to role: 'admin'.
 * Validation: Launch /admin/editor, drag a component, save, and refresh to see it persist.
[ ] TASK-012: The Dynamic Page Renderer
 * Description: Create a Next.js dynamic route /[site-slug]/[...path] that reads the JSON from the DB and renders the UI library components.
 * Agent Context: Use Next.js Server Components. Implement "Component Hydration."
 * Validation: Change a color in the DB JSON; the live site must update immediately.
🌊 WAVE 2: Hexagonal Services (Native vs. External)
Goal: Implement the "Duality" layer where you can swap between built-in tools and external integrations (HubSpot, Mailchimp).
[ ] TASK-020: The Service Port Layer
 * Description: Create the abstract interfaces for Email, CRM, and Analytics.
 * Agent Context: Create packages/services. Define IEmailService, ICRMService.
 * Constraints: No implementation logic here—only TypeScript Interfaces.
 * Validation: Build must fail if an adapter doesn't match the interface.
[ ] TASK-021: Email Adapter Duality (Native vs. Resend)
 * Description: Implement two adapters for the Email Port.
 * Agent Context:
   * ResendAdapter: Connects to Resend API.
   * NativeAdapter: Writes to internal_email_logs in Supabase.
 * Validation: Toggle an env variable EMAIL_PROVIDER and confirm emails switch paths.
[ ] TASK-022: CRM Adapter Duality (Native vs. HubSpot)
 * Description: Create the bridge to sync lead data to HubSpot or keep it in your local DB.
 * Agent Context: Ensure packages/services/crm handles data mapping for both.
🌊 WAVE 3: SaaS Monetization & Metering
Goal: Build the infrastructure to charge clients based on their usage (SaaS mode).
[ ] TASK-030: The Metering Buffer
 * Description: Create a high-performance system to track events (e.g., "Lead Captured").
 * Agent Context: Create packages/metering.
 * Constraints: Use Supabase Edge Functions or a Redis buffer to prevent hitting the DB on every page view.
 * Validation: Trigger 100 leads and verify the tenant_usage table reflects 100.
[ ] TASK-031: Stripe Usage-Based Sync
 * Description: Sync the packages/metering data with Stripe Billing.
 * Agent Context: Use Stripe Webhooks. If a user hits their lead limit, the UI should show an "Upgrade" banner.
 * Validation: Mock a usage limit breach and verify the UI restricts further lead capture.
🌊 WAVE 4: AI-Native Marketing Features
Goal: Make the repo "Top-Tier" by building features that use AI to help the client grow.
[ ] TASK-040: The AI-Bridge Implementation
 * Description: Connect the monorepo to LLM providers for on-the-fly content generation.
 * Agent Context: Work in packages/ai-bridge. Implement generateCopy() using Anthropic/OpenAI.
 * Validation: A button in the Editor that "Refines Headline" using AI.
[ ] TASK-041: Autonomous A/B Testing
 * Description: Create a system that shows two different JSON layouts to users and tracks which one converts better.
 * Agent Context: Use the packages/metering and packages/core-engine together.
 * Validation: Dashboard shows "Headline A: 5% conversion, Headline B: 8% conversion."
🌊 WAVE 5: Production Hardening & Global Scale
Goal: Security, speed, and reliability.
[ ] TASK-050: Global Edge Middleware
 * Description: Implement tenant-aware routing at the Vercel Edge.
 * Agent Context: Rewrite apps/web/middleware.ts to handle custom domains (e.g., client-site.com -> tenant_id_123).
 * Validation: Point a test domain to the app and ensure it loads the correct tenant data.
[ ] TASK-051: Security Audit & CVE Scanning
 * Description: Set up automated tools to ensure the repo is "Sophisticated" and safe.
 * Agent Context: Integrate Snyk or GitHub Advanced Security into the CI/CD pipeline.
⚡ Agentic Execution Protocol
How to use this list with your AI Agent:
When you want to start a task (e.g., TASK-010), use this prompt format:
> *"I am ready to begin TASK-010: Standardize the Core UI Schema.
>  * Refer to GOAL.md for the 'Infinite UI Engine' vision.
>  * Refer to INDEX.md for naming conventions.
>  * Implement the Zod schema in packages/core-engine.
>  * Ensure no circular dependencies are created.
>  * When finished, update the status in TODO.md to [x]."*
> 
Last Refined: February 2026
Focus: Transition from Static Repository to SaaS-Ready Platform
