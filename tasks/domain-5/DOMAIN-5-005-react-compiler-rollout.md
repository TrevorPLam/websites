---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-005
title: 'React Compiler rollout strategy with safe migration'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-005-react-compiler-rollout
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-005 · React Compiler rollout strategy with safe migration

## Objective

Implement React Compiler rollout strategy following section 5.5 specification with three-phase migration (annotation mode → lint audit → global enable) for safe optimization without breaking existing components.

---

## Context

**Codebase area:** Component optimization — React Compiler implementation

**Related files:** Next.js configuration, component files, build system

**Dependencies:** Next.js 16, React 19, React Compiler, existing component base

**Prior work:** Basic React setup exists but lacks React Compiler optimization

**Constraints:** Must follow section 5.5 specification with safe phased rollout

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Compiler | React Compiler with annotation mode |
| Build    | Next.js 16 build system             |
| Testing  | Component optimization validation   |
| Analysis | Performance impact measurement      |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement React Compiler rollout strategy following section 5.5 specification
- [ ] **[Agent]** Configure annotation mode for Phase 1 (opt-in per component)
- [ ] **[Agent]** Add lint audit tools for Phase 2 (identify optimization candidates)
- [ ] **[Agent]** Create global enable strategy for Phase 3 (after fixing issues)
- [ ] **[Agent]** Add health check tools for React Compiler compatibility
- [ ] **[Agent]** Implement performance monitoring for optimization impact
- [ ] **[Agent]** Test with various component patterns and edge cases
- [ ] **[Human]** Verify rollout strategy follows section 5.5 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.5 specification** — Extract rollout strategy requirements
- [ ] **[Agent]** **Configure annotation mode** — Set up Phase 1 opt-in system
- [ ] **[Agent]** **Add health check tools** — Implement React Compiler health check
- [ ] **[Agent]** **Create lint audit** — Add tools to identify optimization candidates
- [ ] **[Agent]** **Implement global enable** — Prepare Phase 3 global configuration
- [ ] **[Agent]** **Add performance monitoring** — Track optimization impact
- [ ] **[Agent]** **Test with sample components** — Validate optimization patterns
- [ ] **[Agent]** **Create migration guide** — Document rollout process

> ⚠️ **Agent Question**: Ask human before proceeding if any existing components might break with React Compiler.

---

## Commands

```bash
# Test React Compiler health check
npx react-compiler-healthcheck --stats

# Test annotation mode
pnpm build --trace

# Test global enable (Phase 3)
pnpm build --trace --profile

# Monitor performance impact
pnpm build --analyze
```

---

## Code Style

```typescript
// ✅ Correct — React Compiler rollout strategy following section 5.5
// ============================================================================
// PHASE 1: ANNOTATION MODE (Opt-in per component)
// ============================================================================

// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: {
    compilationMode: 'annotation', // Only compile components marked with 'use memo'
  },
};

// Component opt-in example
'use memo'; // Add this directive to component file

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  // React Compiler will automatically optimize this component
  // No manual useMemo/useCallback needed
  return (
    <div className="p-6 rounded-lg border">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// ============================================================================
// PHASE 2: LINT AUDIT (Identify optimization candidates)
// ============================================================================

// scripts/react-compiler-audit.ts
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface CompilerIssue {
  filePath: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

async function runCompilerHealthCheck(): Promise<{
  compiled: number;
  total: number;
  issues: CompilerIssue[];
}> {
  try {
    const output = execSync('npx react-compiler-healthcheck --stats', {
      encoding: 'utf8',
    });

    // Parse output for statistics
    const lines = output.split('\n');
    const statsLine = lines.find(line => line.includes('Successfully compiled'));

    if (statsLine) {
      const match = statsLine.match(/(\d+) out of (\d+) components/);
      if (match) {
        const compiled = parseInt(match[1]);
        const total = parseInt(match[2]);

        return {
          compiled,
          total,
          issues: [], // Parse issues from output
        };
      }
    }

    throw new Error('Could not parse compiler health check output');
  } catch (error) {
    console.error('Compiler health check failed:', error);
    return { compiled: 0, total: 0, issues: [] };
  }
}

async function identifyOptimizationCandidates(): Promise<string[]> {
  const componentFiles = await glob('**/*.{tsx,ts}', {
    ignore: ['node_modules/**', '.next/**', 'out/**'],
  });

  const candidates: string[] = [];

  for (const file of componentFiles) {
    const content = readFileSync(file, 'utf8');

    // Look for patterns that would benefit from React Compiler
    const hasUseMemo = content.includes('useMemo');
    const hasUseCallback = content.includes('useCallback');
    const hasComplexLogic = content.includes('useState') && content.includes('useEffect');

    if (hasComplexLogic && !hasUseMemo && !hasUseCallback) {
      candidates.push(file);
    }
  }

  return candidates;
}

// ============================================================================
// PHASE 3: GLOBAL ENABLE (After fixing all issues)
// ============================================================================

// next.config.ts (after fixing all issues)
const nextConfigPhase3: NextConfig = {
  reactCompiler: true, // Global enable
};

// ============================================================================
// COMMON ISSUES AND FIXES
// ============================================================================

// Issue 1: Mutating props directly
// Before (❌):
function BadComponent({ items }: { items: string[] }) {
  items.push('new item'); // Mutating props
  return <div>{items.length}</div>;
}

// After (✅):
function GoodComponent({ items }: { items: string[] }) {
  const [localItems, setLocalItems] = useState(items);

  const addItem = useCallback(() => {
    setLocalItems(prev => [...prev, 'new item']);
  }, []);

  return (
    <div>
      {localItems.length}
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}

// Issue 2: Non-pure render functions
// Before (❌):
function BadComponent() {
  const date = new Date(); // Non-pure - different value each render
  return <div>{date.toISOString()}</div>;
}

// After (✅):
function GoodComponent() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{date.toISOString()}</div>;
}

// Issue 3: Accessing window at render time
// Before (❌):
function BadComponent() {
  const isMobile = window.innerWidth < 768; // Server-side rendering issue
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}

// After (✅):
function GoodComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

**React Compiler rollout principles:**

- **Phase 1 (Annotation mode)**: Safe opt-in for specific components
- **Phase 2 (Lint audit)**: Identify components that would benefit from optimization
- **Phase 3 (Global enable)**: Enable globally after fixing all blocking issues
- **Common fixes**: Handle prop mutations, pure render functions, window access
- **Performance monitoring**: Track optimization impact on bundle size and runtime performance
- **Safe migration**: Gradual rollout to avoid breaking changes

---

## Boundaries

| Tier             | Scope                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Follow section 5.5 specification; implement three-phase rollout; fix common issues; monitor performance impact; maintain component functionality |
| ⚠️ **Ask first** | Changing existing component behavior; modifying build configuration; updating component patterns                                                 |
| 🚫 **Never**     | Enable React Compiler globally without fixing issues; skip health check; ignore performance monitoring; break existing component functionality   |

---

## Success Verification

- [ ] **[Agent]** Test annotation mode — Opt-in components compile successfully
- [ ] **[Agent]** Verify health check — React Compiler health check passes
- [ ] **[Agent]** Test lint audit — Optimization candidates identified correctly
- [ ] **[Agent]** Verify common issue fixes — All blocking issues resolved
- [ ] **[Agent]** Test global enable — React Compiler works globally (Phase 3)
- [ ] **[Agent]** Monitor performance impact — Bundle size and runtime performance optimized
- [ ] **[Human]** Test with real components — Component behavior unchanged
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Component mutations**: Ensure props are not mutated directly
- **Side effects**: Move side effects to useEffect hooks
- **Window access**: Handle client-side only code properly
- **Performance impact**: Monitor bundle size changes with global enable
- **Third-party components**: Ensure compatibility with external component libraries
- **Build time**: Monitor build time impact with React Compiler enabled

---

## Out of Scope

- PPR optimization (handled in separate tasks)
- Image optimization (handled in separate task)
- Bundle size optimization (handled in separate task)
- Core Web Vitals monitoring (handled in separate task)

---

## References

- [Section 5.5 React Compiler Rollout Strategy](docs/plan/domain-5/5.5-react-compiler-rollout-strategy.md)
- [Section 5.1 Complete next.config.ts](docs/plan/domain-5/5.1-complete-nextconfigts.md)
- [React Compiler Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
- [React 19 Documentation](https://react.dev/)
- [React Compiler Health Check](https://github.com/facebook/react/tree/main/packages/react-compiler)
