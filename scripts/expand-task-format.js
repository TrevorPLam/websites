#!/usr/bin/env node
/**
 * Expands compressed task format to full prompt.md template structure.
 * Parses Status/Batch/Effort/Deps, Objective, Files, API, Checklist, Done, Anti
 * and outputs full Metadata, Context, Dependencies, Related Files, etc.
 *
 * Usage:
 *   node scripts/expand-task-format.js [--dry-run] [path/to/tasks]
 *   pnpm run expand-tasks
 *
 * Skips: prompt.md, files with ## Metadata (already full format), meta files (c-1-c-18, 6-10b, 6-10c).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TASKS_DIR = path.join(ROOT, 'tasks');

const SKIP_FILES = new Set([
  'prompt.md',
  'c-1-c-18-d-1-d-8.md',
  '6-10b-health-check.md',
  '6-10c-program-wave.md',
]);

function isAlreadyFullFormat(content) {
  return content.includes('## Metadata');
}

function isMetaOrReferenceFile(filename) {
  return SKIP_FILES.has(filename) || filename.includes('program-wave');
}

function parseCompressed(content) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const result = {
    title: null,
    status: null,
    batch: null,
    effort: null,
    deps: null,
    relatedResearch: null,
    objective: null,
    enhancedRequirements: [],
    implementationPatterns: null,
    files: null,
    api: null,
    checklist: null,
    done: null,
    anti: null,
    extraContent: [],
  };

  let i = 0;

  // Title from first # line
  while (i < lines.length && !lines[i].startsWith('# ')) {
    i++;
  }
  if (i < lines.length) {
    result.title = lines[i].replace(/^#\s+/, '').trim();
    i++;
  }

  // Parse key-value and block content
  let currentBlock = null;
  let blockLines = [];

  while (i < lines.length) {
    const line = lines[i];
    const nextLine = lines[i + 1] ?? '';

    // Match **Key:** value (and extract multi-KV from Status line)
    const kvMatch = line.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
    if (kvMatch) {
      if (blockLines.length > 0) {
        if (currentBlock === 'enhanced') {
          result.enhancedRequirements = blockLines;
        } else if (currentBlock === 'checklist') {
          result.checklist = blockLines.join('\n').trim();
        }
        blockLines = [];
        currentBlock = null;
      }

      const [, key, value] = kvMatch;
      const k = key.trim().toLowerCase();
      let v = value.trim();

      if (k.includes('status')) {
        result.status = v;
        // Parse inline Batch, Effort, Deps from " | **Batch:** E | **Effort:** 20h | **Deps:** 2.11"
        const batchM = v.match(/\*\*Batch:\*\*\s*([^|]+)/);
        if (batchM) result.batch = batchM[1].trim();
        const effortM = v.match(/\*\*Effort:\*\*\s*([^|]+)/);
        if (effortM) result.effort = effortM[1].trim();
        const depsM = v.match(/\*\*Deps:\*\*\s*([^|]*?)(?:\s*$|\s*\|)/);
        if (depsM) result.deps = depsM[1].trim();
      } else if (k.includes('batch')) result.batch = v;
      else if (k.includes('effort')) result.effort = v;
      else if (k.includes('deps')) result.deps = v;
      else if (k.includes('related research')) result.relatedResearch = v;
      else if (k.includes('objective')) result.objective = v;
      else if (k.includes('implementation patterns')) result.implementationPatterns = v;
      else if (k.includes('files')) result.files = v;
      else if (k.includes('api')) result.api = v;
      else if (k.includes('cli')) result.api = result.api || v;
      else if (k.includes('checklist')) {
        if (v) {
          result.checklist = v;
        } else {
          currentBlock = 'checklist';
        }
      } else if (k.includes('done')) result.done = v;
      else if (k.includes('anti')) result.anti = v;
      else if (k.includes('summary')) result.objective = result.objective || v;

      i++;
      continue;
    }

    // Enhanced Requirements block (bullets under **Enhanced Requirements:**)
    if (currentBlock === 'enhanced' || (line.match(/^-\s+\*\*/) && blockLines.length === 0 && result.enhancedRequirements.length === 0)) {
      if (line.match(/^-\s+\*\*/) || (currentBlock === 'enhanced' && (line.startsWith('- ') || line.startsWith('  ')))) {
        if (!currentBlock) currentBlock = 'enhanced';
        blockLines.push(line);
        i++;
        continue;
      }
    }

    // Checklist block (indented or bullet lines after Checklist:)
    if (currentBlock === 'checklist' && (line.startsWith('- ') || line.startsWith('  ') || line.match(/^\d+\./))) {
      blockLines.push(line);
      i++;
      continue;
    }

    currentBlock = null;
    if (blockLines.length > 0 && currentBlock !== 'checklist') {
      if (result.enhancedRequirements.length === 0 && blockLines.some((l) => l.match(/^-\s+\*\*/))) {
        result.enhancedRequirements = blockLines;
      }
      blockLines = [];
    }

    // Stop at --- or end
    if (line.trim() === '---') {
      if (blockLines.length > 0 && currentBlock === 'checklist') {
        result.checklist = blockLines.join('\n').trim();
      }
      i++;
      break;
    }

    i++;
  }

  if (blockLines.length > 0 && currentBlock === 'checklist') {
    result.checklist = result.checklist ? result.checklist + '\n' + blockLines.join('\n') : blockLines.join('\n').trim();
  }
  if (blockLines.length > 0 && result.enhancedRequirements.length === 0 && blockLines.some((l) => l.match(/^-\s+\*\*/))) {
    result.enhancedRequirements = blockLines;
  }

  return result;
}

function taskIdFromFilename(filename) {
  return path.basename(filename, '.md');
}

function formatRelatedFiles(filesStr) {
  if (!filesStr) return '- (Add file paths)';

  const entries = [];
  const hasCreate = filesStr.toLowerCase().includes('create');

  // Pattern: "basePath/ (item1, item2, item3)" or "`basePath/` (item1, item2)"
  const dirListMatch = filesStr.match(/([^(]+)\s*\(([^)]+)\)/);
  if (dirListMatch) {
    const base = dirListMatch[1].trim().replace(/`/g, '').replace(/\/$/, '');
    const items = dirListMatch[2].split(/,\s*/).map((s) => s.trim()).filter(Boolean);
    for (const item of items) {
      const full = item.includes('/') ? `${base}/${item}` : `${base}/${item}`;
      entries.push(`- \`${full}\` – create – (see task objective)`);
    }
  } else {
    // Comma-separated or backtick-separated paths
    const parts = filesStr.split(/[;,]/).map((s) => s.trim());
    const paths = [];
    for (const p of parts) {
      const backtickMatch = p.match(/`([^`]+)`/);
      const path = backtickMatch ? backtickMatch[1] : p;
      if (path && (path.includes('/') || path.includes('.ts') || path.includes('.tsx') || path.includes('.js'))) {
        paths.push(path);
      }
    }
    for (const pathItem of paths) {
      const action = hasCreate ? 'create' : 'modify';
      entries.push(`- \`${pathItem}\` – ${action} – (see task objective)`);
    }
  }

  return entries.length > 0 ? entries.join('\n') : `- (Original) ${filesStr}`;
}

function buildDependencies(deps, filesStr) {
  const items = [];
  if (deps && deps !== 'None') {
    const depTasks = deps.split(/[,;]\s*/).map((d) => d.trim()).filter(Boolean);
    for (const d of depTasks) {
      items.push(`- **Upstream Task**: ${d} – required – prerequisite`);
    }
  }
  if (filesStr) {
    const pkgMatch = filesStr.match(/packages\/([^/]+)/);
    if (pkgMatch) {
      items.push(`- **Package**: @repo/${pkgMatch[1]} – modify – target package`);
    }
  }
  if (items.length === 0) {
    items.push('- (Add dependencies based on task scope)');
  }
  return items.join('\n');
}

function expandTask(parsed, taskId) {
  const upstream = parsed.deps && parsed.deps !== 'None'
    ? parsed.deps.split(/[,;]\s*/).map((d) => d.trim()).join(', ')
    : 'None';

  const contextParts = [parsed.objective || '(Add context)'];
  if (parsed.enhancedRequirements.length > 0) {
    contextParts.push('\n\n**Enhanced Requirements:**\n\n' + parsed.enhancedRequirements.join('\n'));
  }
  if (parsed.implementationPatterns) {
    contextParts.push(`\n\n**Implementation Patterns:** ${parsed.implementationPatterns}`);
  }

  const acceptanceCriteria = [];
  if (parsed.checklist) {
    const items = parsed.checklist.split(/\n/).filter(Boolean);
    for (const item of items) {
      const clean = item.replace(/^-\s*/, '').trim();
      if (clean) acceptanceCriteria.push(`- [ ] ${clean}`);
    }
  }
  if (parsed.done) {
    const doneParts = parsed.done.split(/;\s*/).map((s) => s.trim());
    for (const p of doneParts) {
      if (p) acceptanceCriteria.push(`- [ ] ${p}`);
    }
  }
  if (acceptanceCriteria.length === 0) {
    acceptanceCriteria.push('- [ ] (Add specific, testable criteria)');
  }

  const techConstraints = [];
  if (parsed.anti) {
    const antiParts = parsed.anti.split(/;\s*/).map((s) => s.trim());
    for (const p of antiParts) {
      if (p) techConstraints.push(`- ${p}`);
    }
  }
  if (techConstraints.length === 0) {
    techConstraints.push('- (Add technical constraints per task scope)');
  }

  const implPlan = [];
  if (parsed.checklist) {
    const items = parsed.checklist.split(/\n/).filter(Boolean);
    for (const item of items) {
      const clean = item.replace(/^-\s*/, '').trim();
      if (clean && !clean.match(/^(Schema|Done|Anti)/i)) {
        implPlan.push(`- [ ] ${clean}`);
      }
    }
  }
  if (implPlan.length === 0) {
    implPlan.push('- [ ] (Add implementation steps)');
  }

  const relatedFiles = formatRelatedFiles(parsed.files);
  const codeSnippet = parsed.api
    ? `// API surface (from task)\n// ${parsed.api}\n\n// Add usage examples per implementation`
    : '// Add code snippets and usage examples';

  return `# ${parsed.title || taskId}

## Metadata

- **Task ID**: ${taskId}
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: ${upstream}
- **Downstream Tasks**: (Tasks that consume this output)

## Context

${contextParts.join('')}

## Dependencies

${buildDependencies(parsed.deps, parsed.files)}

## Cross-Task Dependencies & Sequencing

- **Upstream**: ${upstream}
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – ${parsed.relatedResearch || '(Expand with dates and sources)'}

## Related Files

${relatedFiles || '- (Add file paths from original task)'}

## Code Snippets / Examples

\`\`\`typescript
${codeSnippet}
\`\`\`

## Acceptance Criteria

${acceptanceCriteria.join('\n')}

## Technical Constraints

${techConstraints.join('\n')}

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

${implPlan.join('\n')}

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run \`pnpm test\`, \`pnpm type-check\`, \`pnpm lint\` to verify

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

`;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targetArgs = args.filter((a) => a !== '--dry-run');

  const tasksPath = targetArgs[0] || path.join(TASKS_DIR, '*.md');
  const globPattern = path.basename(tasksPath);
  const dir = path.dirname(tasksPath);

  let files;
  if (targetArgs.length > 0 && !tasksPath.includes('*')) {
    files = fs.existsSync(tasksPath)
      ? [tasksPath]
      : targetArgs.map((f) => path.resolve(f)).filter((f) => fs.existsSync(f));
  } else {
    const tasksDir = path.resolve(ROOT, 'tasks');
    files = fs
      .readdirSync(tasksDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => path.join(tasksDir, f));
  }

  let converted = 0;
  let skipped = 0;

  for (const filePath of files) {
    const filename = path.basename(filePath);
    if (SKIP_FILES.has(filename) || isMetaOrReferenceFile(filename)) {
      skipped++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    if (isAlreadyFullFormat(content)) {
      skipped++;
      continue;
    }

    // Must look like compressed format (has Status: and Objective: or similar)
    if (!content.match(/\*\*Status:\*\*/) && !content.match(/\*\*Objective:\*\*/) && !content.match(/\*\*Summary:\*\*/)) {
      skipped++;
      continue;
    }

    const parsed = parseCompressed(content);
    const taskId = taskIdFromFilename(filename);
    const expanded = expandTask(parsed, taskId);

    if (dryRun) {
      console.log(`[DRY-RUN] Would convert: ${filename}`);
    } else {
      fs.writeFileSync(filePath, expanded, 'utf8');
      console.log(`Converted: ${filename}`);
    }
    converted++;
  }

  console.log(`\nDone. Converted: ${converted}, Skipped: ${skipped}`);
  if (dryRun && converted > 0) {
    console.log('Run without --dry-run to apply changes.');
  }
}

main();
