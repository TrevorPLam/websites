# Context Engineering Configuration

## Context Budget Model

Treat context window as finite, precious budget — allocate deliberately

### Context Allocation Strategy

| Context Slot | What Belongs Here | What Doesn't | Token Limit |
|--------------|-------------------|--------------|------------|
| System/rules | Architecture rules, role, coding standards | Full style guides, README content | ~2K tokens |
| Retrieved docs | Current, query-relevant snippets only | Entire documentation files | ~5K tokens |
| Conversation history | Last 3–5 relevant turns | Completed, resolved tasks | ~8K tokens |
| Code context | Files directly involved in current task | Entire repo dumps | ~10K tokens |

**Total Budget: ~25K tokens** (prevents "lost in the middle" degradation)

### Selective Context Injection

#### Role-based Filtering
Multi-agent systems give each specialized agent only context relevant to its role:
- **Test agent**: Testing frameworks, test patterns, coverage requirements
- **Deploy agent**: CI/CD configs, environment variables, deployment scripts  
- **UI agent**: Component libraries, design tokens, styling patterns
- **DB agent**: Schema files, migration patterns, repository interfaces

#### Predictive Prefetching
Advanced setups analyze conversation flow and preload likely-needed context:
- Agent mentions "deployment" → preload Vercel config and env vars
- Agent asks about "tests" → preload test files and coverage config
- Agent references "FSD" → preload architecture docs and examples

#### Dynamic Allocation
Adjust context budget per query type:
- **Factual queries**: More to retrieved docs (10K tokens)
- **Architectural queries**: More to conversation history (12K tokens)  
- **Implementation queries**: More to code context (15K tokens)

#### Graceful Degradation
Never let context overflow crash session:
- Intelligent truncation preserves most important information
- Automatic summarization for long conversation history
- Fallback to essential rules only when budget exceeded

## Anti-Pollution Rules

### Session Management
- **Start new session for every new task** — no exceptions
- **Never carry completed task's thread into next task**
- **Close agent sessions when switching between unrelated features**
- **Use git worktrees for parallel workstreams**

### Context Validation
Before injecting any context, validate:
- **Current**: Is this information up-to-date?
- **Accurate**: Does this reflect the actual codebase state?
- **Relevant**: Is this directly needed for current task?
- **Complete**: Is this sufficient or just fragments?

### Lean Context Principles
- **Keep AGENTS.md under 500 words** — lean context outperforms stuffed context
- **Reference canonical files** rather than duplicating content
- **Use links and pointers** instead of inline documentation
- **Prefer patterns over examples** for reusable knowledge

### Context Pollution Prevention

#### Stale Context Detection
- Check file modification timestamps before including
- Verify git status for uncommitted changes
- Validate package versions against current lockfile
- Cross-reference with recent commits for accuracy

#### Contradiction Resolution
- When multiple sources conflict, prioritize:
  1. Current codebase (files on disk)
  2. Recent commits (last 7 days)
  3. Documentation (marked with date)
  4. Agent memories (flagged as potentially stale)

#### Context Freshness Indicators
Tag all context with freshness metadata:
```markdown
<!-- context:file src/components/Button.tsx modified:2026-02-24 -->
<!-- context:doc docs/api/stripe.md verified:2026-02-20 -->
<!-- context:memory tenant-patterns last-updated:2026-02-15 -->
```

## Implementation Patterns

### Context Engineering Workflow

1. **Pre-Session Setup**
   - Clear previous session context
   - Load fresh AGENTS.md and rules files
   - Verify current branch and working state

2. **Context Collection**
   - Identify task type and required context
   - Allocate budget according to query type
   - Gather relevant files and documentation

3. **Context Validation**
   - Check freshness and accuracy
   - Remove stale or contradictory information
   - Optimize for token efficiency

4. **Context Injection**
   - Load system rules and role definition
   - Add relevant code files and documentation
   - Include minimal conversation history

5. **Monitoring**
   - Track token usage during session
   - Watch for context overflow warnings
   - Adjust allocation dynamically

### Multi-Agent Context Coordination

#### Agent Communication Protocol
Agents communicate via artifacts, not shared context:
- **Plans**: Stored in `.cursor/plans/` or `.taskmaster/`
- **Results**: Committed to git with descriptive messages
- **Issues**: Tracked in GitHub with proper tagging
- **Decisions**: Documented in ADRs (Architecture Decision Records)

#### Context Handoff Patterns
When transferring between agents:
1. **Commit current work** with descriptive message
2. **Create handoff document** with current state
3. **Switch to fresh agent session**
4. **Load handoff context** only (no previous history)

### Quality Assurance

#### Context Health Metrics
- **Freshness score**: % of context < 7 days old
- **Accuracy score**: % of context matching actual codebase
- **Relevance score**: % of context directly used in task
- **Efficiency score**: tokens used vs. tokens needed

#### Automated Context Validation
```bash
# Validate context freshness
pnpm context:validate --max-age 7d

# Check for contradictions
pnpm context:check-consistency

# Optimize token usage
pnpm context:optimize --target 20k
```

## Best Practices Summary

### Do
- Start fresh sessions for each task
- Validate context freshness before use
- Use role-based context filtering
- Monitor token usage actively
- Reference canonical files over duplication

### Don't
- Carry over completed task context
- Include entire documentation files
- Allow stale context to accumulate
- Exceed 25K token budget regularly
- Mix unrelated task contexts

### Success Indicators
- Agent responses remain accurate across sessions
- No context-related hallucinations
- Efficient token usage (<20K average)
- Consistent output quality
- Fast response times

This context engineering system ensures AI agents maintain high-quality interactions while avoiding the common pitfalls of context pollution and information overload.
