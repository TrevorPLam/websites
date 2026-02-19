<!--
/**
 * @file docs/accessibility/release-a11y-gate.md
 * @role docs
 * @summary Accessibility release gate criteria and CI integration.
 *
 * @entrypoints
 * - Release process documentation for accessibility checks
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - tasks/d-6-a11y-release-gate.md
 * - jest-axe, axe-core
 *
 * @used_by
 * - CI/CD pipeline
 * - Release process
 * - Developers writing component tests
 *
 * @runtime
 * - environment: CI, local development
 * - side_effects: Blocks release on violations
 *
 * @data_flow
 * - inputs: Component test files
 * - outputs: Accessibility violation reports
 *
 * @invariants
 * - All component tests must use jest-axe
 * - Violations block CI merge
 * - WCAG 2.2 AA compliance required
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Accessibility Release Gate

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [Task d-6](../../../tasks/d-6-a11y-release-gate.md), [Component A11y Rubric](./component-a11y-rubric.md)

---

## Overview

The accessibility release gate ensures WCAG 2.2 AA compliance by running automated accessibility tests before code merges and releases. All component tests must pass accessibility checks using `jest-axe`.

## Gate Criteria

### Automated Checks

1. **Component Tests** - All components with accessibility tests must pass `jest-axe` checks
2. **Zero Violations** - No accessibility violations allowed (WCAG 2.2 AA)
3. **CI Integration** - Gate runs automatically in CI workflow

### Tools

- **jest-axe** - Component-level accessibility testing (axe-core wrapper)
- **Lighthouse CI** - Page-level accessibility audits (see [Performance Audit](../../../.github/workflows/performance-audit.yml))

## Implementation

### Component Test Pattern

All component tests should include accessibility checks:

```typescript
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

### Running Locally

```bash
# Run all accessibility tests
pnpm test:a11y

# Run specific component tests
pnpm jest packages/ui/src/components/__tests__/Button.test.tsx
```

### CI Integration

The accessibility gate runs automatically in CI:

```yaml
# .github/workflows/ci.yml
- name: Accessibility (a11y)
  run: pnpm test:a11y
```

**Status:** Blocking - CI fails if accessibility violations are found.

## Thresholds

- **Violations:** Zero tolerance (any violation blocks merge)
- **Coverage:** All components with user interactions must have a11y tests
- **WCAG Level:** 2.2 AA compliance required

## Common Violations

### Missing ARIA Labels

```typescript
// ❌ Bad
<button onClick={handleClick}>Click</button>

// ✅ Good
<button onClick={handleClick} aria-label="Close dialog">Click</button>
```

### Missing Form Labels

```typescript
// ❌ Bad
<input type="text" />

// ✅ Good
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Keyboard Navigation

```typescript
// ❌ Bad - No keyboard support
<div onClick={handleClick}>Click me</div>

// ✅ Good - Use semantic button
<button onClick={handleClick}>Click me</button>
```

### Color Contrast

```typescript
// ❌ Bad - Low contrast
<div className="text-gray-400">Text</div>

// ✅ Good - WCAG AA contrast (4.5:1)
<div className="text-gray-700">Text</div>
```

## Fixing Violations

1. **Read the violation report** - jest-axe provides detailed violation information
2. **Check the rubric** - See [Component A11y Rubric](./component-a11y-rubric.md) for guidance
3. **Fix the issue** - Apply WCAG 2.2 AA compliant solution
4. **Re-run tests** - Verify fix with `pnpm test:a11y`

## Exceptions

Accessibility violations **cannot** be waived. If a component cannot be made accessible:

1. Document the limitation in component docs
2. Provide alternative accessible solution
3. Escalate to accessibility team for review

## Related Documentation

- [Component A11y Rubric](./component-a11y-rubric.md) - Detailed WCAG 2.2 AA criteria
- [Accessibility Audit](./accessibility-audit.md) - Manual audit procedures
- [Task d-6](../../../tasks/d-6-a11y-release-gate.md) - Implementation task

## Verification

To verify the gate is working:

```bash
# Run accessibility tests
pnpm test:a11y

# Should pass with no violations
# If violations exist, CI will block merge
```
