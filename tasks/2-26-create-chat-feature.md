# 2.26 Create Chat Feature

## Metadata

- **Task ID**: 2-26-create-chat-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Chat feature with 5+ implementation patterns, AI chatbot, and live chat integration.

**Implementation Patterns:** Config-Based, AI-Chatbot-Based, Live-Chat-Based, Widget-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/features/src/chat/index` – create – (see task objective)
- `packages/features/src/chat/lib/schema` – create – (see task objective)
- `packages/features/src/chat/lib/adapters` – create – (see task objective)
- `packages/features/src/chat/lib/chat-config.ts` – create – (see task objective)
- `packages/features/src/chat/lib/ai-chatbot.ts` – create – (see task objective)
- `packages/features/src/chat/lib/live-chat.ts` – create – (see task objective)
- `packages/features/src/chat/components/ChatSection.tsx` – create – (see task objective)
- `packages/features/src/chat/components/ChatConfig.tsx` – create – (see task objective)
- `packages/features/src/chat/components/ChatAI.tsx` – create – (see task objective)
- `packages/features/src/chat/components/ChatLive.tsx` – create – (see task objective)
- `packages/features/src/chat/components/ChatWidget.tsx` – create – (see task objective)
- `packages/features/src/chat/components/ChatHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `ChatSection`, `chatSchema`, `createChatConfig`, `sendMessage`, `aiChat`, `liveChat`, `ChatConfig`, `ChatAI`, `ChatLive`, `ChatWidget`, `ChatHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; AI chatbot; live chat; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] AI chatbot functional
- [ ] live chat works.

## Technical Constraints

- No custom AI models
- use existing services.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

