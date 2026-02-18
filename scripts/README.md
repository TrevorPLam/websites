# Task Automation Scripts

This directory contains automation scripts for updating tasks with research-based code snippets.

## Scripts

### `update-tasks-with-code-snippets.js`

Automatically updates remaining 2- tasks with comprehensive code snippets from the 2026 research findings.

#### Features

- **Task-specific research mapping**: Each task ID maps to relevant research topics (R-MARKETING, R-UI, R-A11Y, etc.)
- **Intelligent snippet generation**: Generates appropriate code snippets based on task type
- **Skip logic**: Automatically skips already updated tasks (2-1 through 2-13)
- **Template-based patterns**: Uses research-compliant code patterns

#### Research Topics Covered

- **R-MARKETING**: Composition patterns, section components
- **R-UI**: React 19 component patterns with ComponentRef
- **R-A11Y**: WCAG 2.2 AA compliance (24×24px touch targets, reduced motion)
- **R-PERF**: Core Web Vitals optimization (LCP < 2.5s, INP ≤ 200ms, CLS < 0.1)
- **R-RADIX**: Primitive wrapper patterns with forwardRef
- **R-FORM**: Zod validation patterns (form tasks)
- **R-CMS**: Content adapter patterns (content tasks)
- **R-INDUSTRY**: JSON-LD schema integration (industry-specific tasks)
- **R-INTEGRATION**: Third-party service adapters
- **R-SEARCH-AI**: Semantic search integration
- **R-E-COMMERCE**: Product catalog patterns
- **R-WORKFLOW**: Durable workflow integration
- **R-MONITORING**: Performance tracking patterns

#### Task Categories

1. **Component Building (2-1 to 2-15)**: Basic UI components
2. **Feature Creation (2-16 to 2-27)**: Marketing features
3. **Advanced Features (2-28 to 2-47)**: Complex integrations
4. **Industry-Specific (2-48 to 2-62)**: Specialized components

## Usage

### Package Scripts

```bash
# Update remaining tasks with code snippets
pnpm update-tasks-snippets

# Force update all tasks (including already updated)
pnpm update-tasks-snippets:all
```

### Direct Script Execution

```bash
# Node.js
node scripts/update-tasks-with-code-snippets.js

# PowerShell
.\scripts\run-task-updates.ps1

# Batch (Windows)
.\scripts\run-task-updates.bat
```

## Code Snippet Examples

The script generates research-compliant code snippets like:

### React 19 Component Pattern
```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function Component({ ref, className, ...props }: ComponentProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('component', className)}
      {...props}
    />
  );
}
```

### Accessibility Compliance
```css
.component-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Performance Optimization
- Page shell < 250 KB gzipped
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI

## Safety Features

- **Backup protection**: Checks for existing code snippets before updating
- **Error handling**: Graceful error handling with detailed logging
- **Dry run capability**: Can preview changes before applying
- **Selective updates**: Skips already processed tasks

## Output

The script provides detailed console output:
- Files processed
- Files skipped (already updated)
- Files updated with new snippets
- Any errors encountered

## Integration

This script integrates with the existing task management workflow:
- Works alongside `update-tasks-research.js`
- Complements `expand-task-format.js`
- Maintains consistency with existing task structure

## Troubleshooting

### Common Issues

1. **Permission errors**: Ensure write access to task files
2. **Node version**: Requires Node.js 22+ (matches package.json engines)
3. **File locking**: Close any open task files before running

### Debug Mode

Add console logging to the script for detailed debugging:
```javascript
console.log(`Processing ${filename} with topics: ${topics.join(', ')}`);
```

## Maintenance

- Update `TASK_RESEARCH_TOPICS` mapping for new task patterns
- Add new code snippet templates to `CODE_SNIPPETS`
- Review research findings annually for pattern updates
