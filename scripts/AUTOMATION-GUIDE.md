# Task Update Automation Guide

**Created:** 2026-02-18  
**Purpose:** Guide for using the automated task update script

---

## Overview

The `update-tasks-with-research.js` script automates updating task files with research findings and code snippets from `RESEARCH-INVENTORY.md`. It:

1. Parses `RESEARCH-INVENTORY.md` to extract research topics and their content
2. Maps tasks to relevant research topics based on task IDs
3. Generates updated "Research & Evidence" and "Code Snippets / Examples" sections
4. Updates task files while preserving all other content

---

## Quick Start

### Update a single task
```bash
pnpm update-tasks-research 1-12-create-slider-component
# or
pnpm update-tasks-research 1-12
```

### Update all tasks in a category
```bash
# Update all 1.xx UI component tasks
pnpm update-tasks-research --category 1-xx

# Update all 2.xx marketing component tasks
pnpm update-tasks-research --category 2-xx

# Update all f-xx infrastructure tasks
pnpm update-tasks-research --category f-xx
```

### Update all tasks
```bash
pnpm update-tasks-research:all
```

---

## How It Works

### 1. Parsing RESEARCH-INVENTORY.md

The script extracts:
- **Research Topics** (R-UI, R-A11Y, R-MARKETING, etc.)
- **Task Mappings** from "Task IDs by Topic" section
- **Research Findings** (Fundamentals, Best Practices, Highest Standards, Novel Techniques)
- **Code Snippets** from "Repo-Specific Context" sections

### 2. Task-to-Topic Mapping

Tasks are matched to topics using:
- **Explicit task IDs** (e.g., "2.10" → R-FORM)
- **Category patterns** (e.g., "1.xx" → matches all 1-12, 1-13, etc.)
- **Range patterns** (e.g., "2.1–2.62" → matches 2-1 through 2-62)
- **Special patterns** (e.g., "Same as R-UI" → inherits R-UI's mappings)

### 3. Section Generation

#### Research & Evidence Section
- Lists all relevant research topics with links
- Includes key findings (prioritizes Highest Standards and Best Practices)
- Adds cross-references to RESEARCH-INVENTORY.md

#### Code Snippets Section
- Extracts code snippets from Repo-Specific Context
- Groups by research topic
- Includes usage examples and related patterns

### 4. File Updates

- Replaces existing "Research & Evidence" section
- Replaces existing "Code Snippets / Examples" section
- Preserves all other sections unchanged

---

## Examples

### Example 1: Update Single Task
```bash
$ pnpm update-tasks-research 1-12-create-slider-component

Parsing RESEARCH-INVENTORY.md...
Found 46 research topics

✓ Updated 1-12-create-slider-component with 3 research topics: R-UI, R-A11Y, R-RADIX
```

### Example 2: Update Category
```bash
$ pnpm update-tasks-research --category 1-xx

Parsing RESEARCH-INVENTORY.md...
Found 46 research topics

Updating tasks in category: 1-xx

✓ Updated 1-12-create-slider-component with 3 research topics: R-UI, R-A11Y, R-RADIX
✓ Updated 1-13-create-progress-component with 3 research topics: R-UI, R-A11Y, R-RADIX
...
✓ Updated 39 task files in category 1-xx
```

### Example 3: Update All Tasks
```bash
$ pnpm update-tasks-research:all

Parsing RESEARCH-INVENTORY.md...
Found 46 research topics

Updating all task files...

✓ Updated 1-12-create-slider-component with 3 research topics: R-UI, R-A11Y, R-RADIX
✓ Updated 1-13-create-progress-component with 3 research topics: R-UI, R-A11Y, R-RADIX
...
✓ Updated 185 task files
```

---

## Task ID Formats Supported

The script handles various task ID formats:

- **Full filename**: `1-12-create-slider-component`
- **Base ID**: `1-12`
- **Dotted format**: `1.12` (converted to `1-12`)
- **Category patterns**: `1-xx`, `2-xx`, `f-xx`

---

## Research Topic Matching

### Pattern Matching Rules

1. **Exact Match**: Task ID exactly matches a listed task ID
2. **Category Match**: Task ID starts with category prefix (e.g., `1-12` matches `1-xx`)
3. **Range Match**: Task ID falls within a range (e.g., `2-15` matches `2.1–2.62`)
4. **Inheritance**: Topics that say "Same as R-UI" inherit R-UI's mappings
5. **All Pattern**: Topics with "(all)" match all tasks in that category

### Examples

- `1-12` matches:
  - R-UI (via "All 1.xx: 1-12, 1-13...")
  - R-A11Y (via "1.xx (all)")
  - R-RADIX (via "Same as R-UI")

- `2-10` matches:
  - R-MARKETING (via "2.1–2.62")
  - R-A11Y (via "2.1–2.62 (all marketing/UI)")
  - R-FORM (via explicit "2.10")

---

## Output Format

### Research & Evidence Section

```markdown
## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-UI**: Radix UI primitives, React 19, ComponentRef — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-ui) for full research findings.
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.

### Key Findings

#### R-UI Highest Standards
- **[2026-02-18] Server Component Safety**: All UI components...
- **[2026-02-18] Component Architecture**: All 1.xx components...

#### R-A11Y Best Practices
- **[2026-02-18] Focus Management**: Success Criterion 2.4.11...
- **[2026-02-18] ARIA Patterns**: Use ARIA live regions...

### References
- [RESEARCH-INVENTORY.md - R-UI](RESEARCH-INVENTORY.md#r-ui) — Full research findings
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context
```

### Code Snippets Section

```markdown
## Code Snippets / Examples

### R-UI Implementation Patterns

#### Current Implementation
```typescript
// packages/ui/src/components/Button.tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('...', variantStyles[variant], className)}
        {...props}
      />
    );
  }
);
```

### Related Patterns
- See [R-UI - Repo-Specific Context](RESEARCH-INVENTORY.md#r-ui) for additional examples
- See [R-A11Y - Repo-Specific Context](RESEARCH-INVENTORY.md#r-a11y) for accessibility patterns
```

---

## Troubleshooting

### "No research topics found for task"

**Cause**: Task ID doesn't match any patterns in RESEARCH-INVENTORY.md

**Solution**: 
- Check if task ID format is correct
- Verify task is listed in RESEARCH-INVENTORY.md "Task IDs by Topic" section
- Try using full filename instead of base ID

### "Task file not found"

**Cause**: Task file doesn't exist or filename doesn't match

**Solution**:
- Use full filename: `1-12-create-slider-component` instead of `1-12`
- Check file exists in `tasks/` directory
- Verify filename matches exactly

### Script runs but doesn't update files

**Cause**: Regex patterns might not match existing section format

**Solution**:
- Check if task file has "Research & Evidence (Date-Stamped)" section
- Verify section headers match expected format
- Manually verify one task file format

---

## Best Practices

1. **Test on Single Task First**: Always test on one task before running on all
   ```bash
   pnpm update-tasks-research 1-12-create-slider-component
   ```

2. **Review Output**: Check updated files to ensure content is correct
   ```bash
   git diff tasks/1-12-create-slider-component.md
   ```

3. **Format After Updates**: Run Prettier to ensure consistent formatting
   ```bash
   pnpm format
   ```

4. **Commit Incrementally**: Commit updates by category for easier review
   ```bash
   pnpm update-tasks-research --category 1-xx
   git add tasks/1-*.md
   git commit -m "Update 1.xx tasks with research findings"
   ```

5. **Verify Links**: Check that RESEARCH-INVENTORY.md links work correctly

---

## Code Snippet Preservation

**Important**: The script preserves existing code snippets in task files. If a task file already has code snippets in the "Code Snippets / Examples" section, they will be preserved and only the "Related Patterns" section will be added (if missing).

### Behavior:
- ✅ **Existing code snippets**: Preserved as-is
- ✅ **Related Patterns**: Added if missing
- ✅ **No existing code**: Full section generated from RESEARCH-INVENTORY.md

## Limitations

1. **Code Snippet Extraction**: Currently extracts up to 3 snippets per topic from RESEARCH-INVENTORY.md
2. **Finding Selection**: Prioritizes Highest Standards and Best Practices (first 2 of each)
3. **Pattern Matching**: May not handle all edge cases in task ID formats
4. **Manual Review**: Still requires manual review to ensure accuracy
5. **Existing Code**: Script preserves existing code snippets but doesn't merge them with new ones

---

## Future Enhancements

- [ ] Interactive mode to select which topics to include
- [ ] Dry-run mode to preview changes
- [ ] Validation mode to check for broken links
- [ ] Batch processing with progress bars
- [ ] Support for custom section templates

---

## Related Files

- `scripts/update-tasks-with-research.js` - Main automation script
- `tasks/RESEARCH-INVENTORY.md` - Source of research findings
- `tasks/TASK-UPDATE-GAMEPLAN.md` - Original game plan
- `tasks/TASK-UPDATE-PROGRESS.md` - Progress tracking

---

**Last Updated:** 2026-02-18
