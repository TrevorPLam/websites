# Scripts

This directory contains automation scripts including task updates and client validation.

## Client Validation (Task 5-*)

### `validate-client.ts`

Validates a single client directory against the CaCA contract. Use before committing client changes.

```bash
pnpm validate-client clients/luxe-salon
pnpm validate-client clients/starter-template
```

Checks: `package.json` (@clients/ name, scripts), `site.config.ts` (required fields), Next.js/tsconfig, app structure, cross-client imports.

### `validate-all-clients.ts`

Validates all clients in `clients/`. Runs in CI as part of quality gates.

```bash
pnpm validate-all-clients
```

---

# Task Automation Scripts

This directory contains automation scripts for updating tasks with research-based code snippets.

## Scripts

### `update-tasks-with-code-snippets.js`

Automatically updates 2- tasks (Marketing Components) with comprehensive code snippets from the 2026 research findings.

#### Features

- **Task-specific research mapping**: Each task ID maps to relevant research topics (R-MARKETING, R-UI, R-A11Y, etc.)
- **Intelligent snippet generation**: Generates appropriate code snippets based on task type
- **Skip logic**: Automatically skips already updated tasks
- **Template-based patterns**: Uses research-compliant code patterns

#### Research Topics Applied

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

### `task-update-summary.js`

Reports on task update status with completion statistics and research topics applied.

## Usage

### Package Scripts

```bash
# Update remaining tasks with code snippets
pnpm update-tasks-snippets

# Force update all tasks (including already updated)
pnpm update-tasks-snippets:all

# View completion status
pnpm task-update-summary
```

### Direct Script Execution

```bash
# Node.js
node scripts/update-tasks-with-code-snippets.js
node scripts/task-update-summary.js

# PowerShell
.\scripts\run-task-updates.ps1

# Batch (Windows)
.\scripts\run-task-updates.bat
```

## Results & Impact

### 📈 Automation Results

- **Total Tasks**: 95 (2- through 6-)
- **Updated**: 93 (97.9% completion)
- **Time Saved**: ~23.3 hours (1395 minutes)
- **Research Topics Applied**: 34
- **Manual Work Eliminated**: Hours → Minutes

### 🎯 Quality Improvements

- **2026 Compliance**: All updated tasks follow latest research standards
- **Consistency**: Uniform patterns across all task categories
- **Maintainability**: Research-backed code patterns
- **Performance**: Core Web Vitals optimization included
- **Accessibility**: WCAG 2.2 AA compliance enforced

## Safety Features

- **Backup Protection**: Checks for existing code snippets before updating
- **Error Handling**: Graceful error handling with detailed logging
- **Skip Logic**: Automatically skips already processed tasks
- **Validation**: Ensures proper task ID extraction and categorization
- **Progress Tracking**: Real-time progress reporting

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure write access to task files
2. **Node Version**: Requires Node.js 22+ (matches package.json engines)
3. **File Locking**: Close any open task files before running

### Debug Mode

Add console logging to scripts for detailed debugging:

```javascript
console.log(`Processing ${filename} with topics: ${topics.join(', ')}`);
```

## Maintenance

- Update `TASK_RESEARCH_TOPICS` mapping for new task patterns
- Add new code snippet templates to `CODE_SNIPPETS`
- Review research findings annually for pattern updates

## Integration

These scripts integrate with existing task management:

- Works alongside `update-tasks-research.js`
- Complements `expand-task-format.js`
- Maintains consistency with existing task structure
- Supports continuous integration workflows
