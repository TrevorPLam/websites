# Task Update Automation

Automated script to update task files with research findings and code snippets from RESEARCH-INVENTORY.md.

## Usage

### Update a single task

```bash
pnpm update-tasks-research 1-12
```

### Update all tasks in a category

```bash
pnpm update-tasks-research --category 1-xx
pnpm update-tasks-research --category 2-xx
pnpm update-tasks-research --category f-xx
```

### Update all tasks

```bash
pnpm update-tasks-research:all
```

## What It Does

1. **Parses RESEARCH-INVENTORY.md** to extract:
   - Research topics (R-UI, R-A11Y, etc.)
   - Task-to-topic mappings
   - Research findings (Fundamentals, Best Practices, Highest Standards, Novel Techniques)
   - Code snippets from Repo-Specific Context sections

2. **Maps tasks to topics** based on:
   - Task ID patterns (e.g., "1-12" matches "1.xx" patterns)
   - Explicit task ID lists in RESEARCH-INVENTORY.md
   - Category patterns (e.g., "all 1.xx")

3. **Updates task files** by:
   - Replacing "Research & Evidence" section with structured findings
   - Replacing "Code Snippets / Examples" section with relevant code
   - Adding cross-references to RESEARCH-INVENTORY.md

## Output

The script will:

- Show progress for each task updated
- List which research topics were applied
- Skip tasks with no matching research topics
- Preserve all other sections of task files

## Examples

```bash
# Update single task
pnpm update-tasks-research 1-12

# Update all 1.xx UI component tasks
pnpm update-tasks-research --category 1-xx

# Update all 2.xx marketing component tasks
pnpm update-tasks-research --category 2-xx

# Update all infrastructure tasks
pnpm update-tasks-research --category f-xx

# Update everything
pnpm update-tasks-research:all
```

## Notes

- The script preserves existing file structure
- Only updates "Research & Evidence" and "Code Snippets / Examples" sections
- Other sections remain unchanged
- Run `pnpm format` after updates to ensure consistent formatting
