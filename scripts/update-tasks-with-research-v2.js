#!/usr/bin/env node
/**
 * @file scripts/update-tasks-with-research-v2.js
 * Purpose: Automate updating task files with research findings from RESEARCH-INVENTORY.md
 * 
 * Standardized format:
 * - Task IDs by Topic: ### R-XXX (Description)
 * - Research Findings: ### R-XXX (Description) or ### R-XXX
 * 
 * Usage:
 *   node scripts/update-tasks-with-research-v2.js [task-id]
 *   node scripts/update-tasks-with-research-v2.js --all
 *   node scripts/update-tasks-with-research-v2.js --category 1-xx
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const TASKS_DIR = path.join(ROOT_DIR, 'tasks');
const RESEARCH_INVENTORY = path.join(TASKS_DIR, 'RESEARCH-INVENTORY.md');

/**
 * Parse RESEARCH-INVENTORY.md to extract research topics
 */
function parseResearchInventory() {
  const content = fs.readFileSync(RESEARCH_INVENTORY, 'utf-8');
  const topics = new Map();

  // Extract task-to-topic mappings from "Task IDs by Topic" section
  const taskMappingMatch = content.match(/## Task IDs by Topic([\s\S]*?)---/);
  if (!taskMappingMatch) {
    throw new Error('Could not find "Task IDs by Topic" section');
  }
  const taskMappingSection = taskMappingMatch[1];

  // Extract Research Findings section
  const researchFindingsMatch = content.match(/## Research Findings[^\n]*\n([\s\S]*?)(?=\n---|\n## |$)/);
  if (!researchFindingsMatch) {
    throw new Error('Could not find "Research Findings" section');
  }
  const researchFindingsSection = researchFindingsMatch[1];

  // Parse each topic from Task IDs by Topic section
  const topicHeaders = taskMappingSection.matchAll(/^### (R-[A-Z0-9-]+) \(([^)]+)\)/gm);
  
  for (const headerMatch of topicHeaders) {
    const topicId = headerMatch[1];
    const topicDescription = headerMatch[2];
    
    // Extract task IDs for this topic
    const topicStart = headerMatch.index + headerMatch[0].length;
    const nextTopicMatch = taskMappingSection.substring(topicStart).match(/^### (R-[A-Z0-9-]+)/m);
    const topicEnd = nextTopicMatch 
      ? topicStart + nextTopicMatch.index 
      : taskMappingSection.length;
    const taskIdsText = taskMappingSection.substring(topicStart, topicEnd).trim();
    
    const taskIds = extractTaskIds(taskIdsText);

    // Extract research findings for this topic
    const findingsHeaderRegex = new RegExp(`^### ${topicId}(?:\s+\\([^)]+\\))?$`, 'm');
    const findingsMatch = researchFindingsSection.match(findingsHeaderRegex);
    
    let findingsContent = '';
    if (findingsMatch) {
      const findingsStart = findingsMatch.index + findingsMatch[0].length;
      const nextFindingsMatch = researchFindingsSection.substring(findingsStart).match(/^### (R-[A-Z0-9-]+)/m);
      const findingsEnd = nextFindingsMatch
        ? findingsStart + nextFindingsMatch.index
        : researchFindingsSection.length;
      findingsContent = researchFindingsSection.substring(findingsStart, findingsEnd).trim();
    }

    // Extract bullet points from findings
    const findings = extractBulletPoints(findingsContent);
    
    // Extract code snippets (code blocks)
    const codeSnippets = extractCodeSnippets(findingsContent);

    topics.set(topicId, {
      id: topicId,
      name: topicDescription,
      taskIds,
      findings,
      codeSnippets,
    });
  }

  return topics;
}

/**
 * Extract task IDs from text
 */
function extractTaskIds(text) {
  const taskIds = new Set();
  const lines = text.split('\n').filter(line => line.trim());

  for (const line of lines) {
    // Handle "All 1.xx: 1-12, 1-13, ..."
    if (line.includes('All') && line.includes(':')) {
      const afterColon = line.split(':')[1];
      const matches = afterColon.matchAll(/(\d+)-(\d+)/g);
      for (const match of matches) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        for (let i = start; i <= end; i++) {
          taskIds.add(`${match[1]}-${i}`);
        }
      }
    }
    
    // Handle ranges like "2.1–2.62" or "2.1-2.62"
    const rangeMatch = line.match(/(\d+)\.(\d+)[–-](\d+)\.(\d+)/);
    if (rangeMatch) {
      const [, major1, minor1, major2, minor2] = rangeMatch;
      if (major1 === major2) {
        for (let minor = parseInt(minor1); minor <= parseInt(minor2); minor++) {
          taskIds.add(`${major1}-${minor}`);
        }
      }
    }
    
    // Handle "1.xx (all)" pattern
    const allPatternMatch = line.match(/(\d+)[\.-]xx\s*\(all\)/i);
    if (allPatternMatch) {
      const categoryNum = allPatternMatch[1];
      taskIds.add(`${categoryNum}-xx (all)`);
    }
    
    // Handle "Same as R-XXX" - will be resolved later
    if (line.includes('Same as')) {
      const sameAsMatch = line.match(/Same as (R-[A-Z0-9-]+)/i);
      if (sameAsMatch) {
        taskIds.add(`same-as-${sameAsMatch[1]}`);
      }
    }
    
    // Handle individual task IDs
    const individualMatches = line.matchAll(/(\d+)[.-](\d+)/g);
    for (const match of individualMatches) {
      taskIds.add(`${match[1]}-${match[2]}`);
    }
    
    // Handle f-xx tasks
    const fMatches = line.matchAll(/f-(\d+)/g);
    for (const match of fMatches) {
      taskIds.add(`f-${match[1]}`);
    }
    
    // Handle "All open tasks"
    if (line.toLowerCase().includes('all open tasks')) {
      taskIds.add('all-open-tasks');
    }
    
    // Handle "f-1 through f-40"
    const throughMatch = line.match(/f-(\d+)\s+through\s+f-(\d+)/i);
    if (throughMatch) {
      const start = parseInt(throughMatch[1]);
      const end = parseInt(throughMatch[2]);
      for (let i = start; i <= end; i++) {
        taskIds.add(`f-${i}`);
      }
    }
  }

  return Array.from(taskIds);
}

/**
 * Extract bullet points from findings content
 */
function extractBulletPoints(content) {
  if (!content) return [];
  
  return content
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim())
    .slice(0, 10); // Limit to 10 items
}

/**
 * Extract code snippets from findings content
 */
function extractCodeSnippets(content) {
  if (!content) return [];
  // Normalize line endings so regex works on both \n and \r\n
  const normalized = content.replace(/\r\n/g, '\n');
  const snippets = [];
  const codeBlockRegex = /```(\w+)?\r?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(normalized)) !== null) {
    const language = match[1] || 'typescript';
    const code = match[2].trim();

    // Try to extract title from preceding text
    const beforeMatch = content.substring(0, match.index);
    const titleMatch = beforeMatch.match(/- \*\*([^*]+)\*\*/);
    const title = titleMatch?.[1] || 'Code Example';

    snippets.push({
      title,
      language,
      code,
    });
  }

  return snippets;
}

/**
 * Extract base task ID from filename
 */
function extractBaseTaskId(taskId) {
  const withoutExt = taskId.replace(/\.md$/, '');
  const match = withoutExt.match(/^(\d+-\d+)|^(f-\d+)|^(\d+-\d+)/);
  if (match) {
    return match[1] || match[2] || match[3];
  }
  return withoutExt;
}

/**
 * Get research topics for a specific task ID
 */
function getTopicsForTask(taskId, topics) {
  const relevantTopics = [];
  const baseTaskId = extractBaseTaskId(taskId);
  const normalizedTaskId = baseTaskId.replace(/\./g, '-');

  for (const [topicId, topic] of topics.entries()) {
    let matches = false;

    // Handle "same-as-R-XXX" references
    const sameAsMatch = topic.taskIds.find(id => id.startsWith('same-as-'));
    if (sameAsMatch) {
      const refTopicId = sameAsMatch.replace('same-as-', '');
      const refTopic = topics.get(refTopicId);
      if (refTopic) {
        // Check if referenced topic matches this task
        matches = getTopicsForTask(taskId, new Map([[refTopicId, refTopic]])).length > 0;
      }
    }

    // Direct match
    if (!matches && (topic.taskIds.includes(normalizedTaskId) || topic.taskIds.includes(baseTaskId))) {
      matches = true;
    }

    // Pattern matching
    if (!matches) {
      matches = topic.taskIds.some(id => {
        // Handle "1-xx (all)" pattern
        if (id.includes('xx') && id.includes('(all)')) {
          const xxMatch = id.match(/(\d+)[\.-]xx/i);
          if (xxMatch) {
            const categoryPrefix = xxMatch[1];
            return normalizedTaskId.startsWith(`${categoryPrefix}-`);
          }
        }
        
        // Handle patterns like "1-xx" or "1.xx"
        if (id.includes('xx')) {
          const xxMatch = id.match(/(\d+)[\.-]?xx/i);
          if (xxMatch) {
            const categoryPrefix = xxMatch[1];
            return normalizedTaskId.startsWith(`${categoryPrefix}-`);
          }
        }
        
        // Handle "all-open-tasks" - skip for now (too broad)
        if (id === 'all-open-tasks') {
          return false; // Don't match all tasks automatically
        }
        
        return false;
      });
    }

    if (matches) {
      relevantTopics.push(topic);
    }
  }

  return relevantTopics;
}

/**
 * Generate Research & Evidence section
 */
function generateResearchSection(topics) {
  if (topics.length === 0) {
    return `## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research directs implementation; see inventory for this task's topics.`;
  }

  let content = `## Research & Evidence (Date-Stamped)

### Primary Research Topics
`;

  // List primary topics
  for (const topic of topics) {
    content += `- **[2026-02-18] ${topic.id}**: ${topic.name} — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#${topic.id.toLowerCase()}) for full research findings.\n`;
  }

  content += `\n### Key Findings\n\n`;

  // Add key findings from each topic
  let hasFindings = false;
  for (const topic of topics) {
    if (topic.findings.length > 0) {
      hasFindings = true;
      content += `#### ${topic.id}\n`;
      for (const finding of topic.findings.slice(0, 3)) {
        content += `${finding}\n`;
      }
      content += '\n';
    }
  }

  if (!hasFindings) {
    content += 'Research findings are available in the referenced RESEARCH-INVENTORY.md sections.\n\n';
  }

  content += `### References\n`;
  for (const topic of topics) {
    content += `- [RESEARCH-INVENTORY.md - ${topic.id}](RESEARCH-INVENTORY.md#${topic.id.toLowerCase()}) — Full research findings\n`;
  }
  content += `- [RESEARCH.md](RESEARCH.md) — Additional context\n`;

  return content;
}

/**
 * Generate Code Snippets section
 */
function generateCodeSnippetsSection(topics) {
  if (topics.length === 0) {
    return `## Code Snippets / Examples

\`\`\`typescript
// Add code snippets and usage examples
\`\`\`
`;
  }

  let content = `## Code Snippets / Examples

`;

  // Add code snippets from topics
  let hasSnippets = false;
  for (const topic of topics) {
    if (topic.codeSnippets.length > 0) {
      hasSnippets = true;
      content += `### ${topic.id} Implementation Patterns\n\n`;
      for (const snippet of topic.codeSnippets.slice(0, 3)) {
        content += `#### ${snippet.title}\n`;
        content += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
      }
    }
  }

  if (!hasSnippets) {
    content += `### Related Patterns\n`;
  } else {
    content += `### Related Patterns\n`;
  }
  
  for (const topic of topics) {
    content += `- See [${topic.id} - Research Findings](RESEARCH-INVENTORY.md#${topic.id.toLowerCase()}) for additional examples\n`;
  }

  return content;
}

/**
 * Returns true if the snippet section only contains placeholder text (e.g. "// API surface", "// Add usage examples").
 * Such tasks should receive injected snippets from RESEARCH-INVENTORY.
 */
function isPlaceholderSnippetsOnly(sectionContent) {
  const codeBlocks = sectionContent.match(/```[\s\S]*?```/g);
  if (!codeBlocks || codeBlocks.length === 0) return false;
  const placeholderPatterns = [
    /^[\s\S]*\/\/\s*API surface[\s\S]*$/,
    /^[\s\S]*\/\/\s*Add usage examples[\s\S]*$/,
    /^[\s\S]*\/\/\s*Discriminated unions[\s\S]*$/,
    /^[\s\S]*\/\/\s*Expected API[\s\S]*$/,
  ];
  const allPlaceholder = codeBlocks.every(block => {
    const inner = block.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
    return placeholderPatterns.some(p => p.test(inner)) || inner.length < 120;
  });
  return allPlaceholder;
}

/**
 * Update a task file
 */
function updateTaskFile(taskFilePath, topics) {
  if (!fs.existsSync(taskFilePath)) {
    console.warn(`Task file not found: ${taskFilePath}`);
    return false;
  }

  const taskFileName = path.basename(taskFilePath, '.md');
  const relevantTopics = getTopicsForTask(taskFileName, topics);

  if (relevantTopics.length === 0) {
    console.log(`No research topics found for task: ${taskFileName}`);
    return false;
  }

  const content = fs.readFileSync(taskFilePath, 'utf-8');

  // Generate new sections
  const researchSection = generateResearchSection(relevantTopics);
  const codeSnippetsSection = generateCodeSnippetsSection(relevantTopics);

  // Replace Research & Evidence section
  const researchSectionRegex = /## Research & Evidence \(Date-Stamped\)[\s\S]*?(?=\n## |$)/;
  let updatedContent = content.replace(researchSectionRegex, researchSection);

  // Extract existing code snippets before replacing
  const codeSnippetsMatch = content.match(/## Code Snippets \/ Examples([\s\S]*?)(?=\n## |$)/);
  const existingCodeSnippets = codeSnippetsMatch ? codeSnippetsMatch[1].trim() : '';
  
  // Check if existing section has actual code blocks (not just placeholders)
  const hasCodeBlocks = existingCodeSnippets && existingCodeSnippets.match(/```[\s\S]*?```/);
  const isPlaceholderOnly = hasCodeBlocks && isPlaceholderSnippetsOnly(existingCodeSnippets);
  const hasExistingCode = hasCodeBlocks && !isPlaceholderOnly;
  
  // Replace Code Snippets section - preserve existing code if present and substantive
  const codeSnippetsRegex = /## Code Snippets \/ Examples[\s\S]*?(?=\n## |$)/;
  if (hasExistingCode) {
    // Preserve existing code snippets - only add Related Patterns if missing
    const newPatternsSection = codeSnippetsSection.match(/### Related Patterns[\s\S]*/);
    if (newPatternsSection && !existingCodeSnippets.includes('### Related Patterns')) {
      updatedContent = updatedContent.replace(codeSnippetsRegex, `## Code Snippets / Examples\n\n${existingCodeSnippets}\n\n${newPatternsSection[0]}`);
      console.log(`  ⚠ Preserved existing code snippets and added Related Patterns in ${taskFileName}`);
    } else {
      console.log(`  ⚠ Preserving existing code snippets in ${taskFileName} (skipping update)`);
    }
  } else {
    // No existing code, use generated section
    updatedContent = updatedContent.replace(codeSnippetsRegex, codeSnippetsSection);
  }

  // Write updated content
  fs.writeFileSync(taskFilePath, updatedContent, 'utf-8');
  console.log(`✓ Updated ${taskFileName} with ${relevantTopics.length} research topics: ${relevantTopics.map(t => t.id).join(', ')}`);

  return true;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  console.log('Parsing RESEARCH-INVENTORY.md...');
  const topics = parseResearchInventory();
  console.log(`Found ${topics.size} research topics\n`);

  if (args.includes('--all')) {
    console.log('Updating all task files...\n');
    const taskFiles = fs.readdirSync(TASKS_DIR)
      .filter(file => file.endsWith('.md') && file !== 'RESEARCH-INVENTORY.md' && file !== 'TASK-UPDATE-GAMEPLAN.md' && file !== 'TASK-UPDATE-PROGRESS.md')
      .map(file => path.join(TASKS_DIR, file));

    let updated = 0;
    for (const taskFile of taskFiles) {
      if (updateTaskFile(taskFile, topics)) {
        updated++;
      }
    }
    console.log(`\n✓ Updated ${updated} task files`);
  } else if (args[0] === '--category') {
    const category = args[1];
    console.log(`Updating tasks in category: ${category}\n`);
    
    let prefix = category.replace(/\./g, '-');
    if (!prefix.includes('-')) {
      prefix = prefix.replace(/(\d+)(xx)/, '$1-');
    }
    
    const taskFiles = fs.readdirSync(TASKS_DIR)
      .filter(file => {
        if (!file.endsWith('.md')) return false;
        if (file === 'RESEARCH-INVENTORY.md' || file === 'TASK-UPDATE-GAMEPLAN.md' || file === 'TASK-UPDATE-PROGRESS.md') return false;
        
        const baseId = extractBaseTaskId(file);
        if (!baseId) return false;
        
        if (category.includes('xx')) {
          const categoryPrefix = prefix.split('-')[0] || prefix.split('.')[0];
          return baseId.startsWith(`${categoryPrefix}-`);
        }
        
        return baseId.startsWith(prefix);
      })
      .map(file => path.join(TASKS_DIR, file));

    let updated = 0;
    for (const taskFile of taskFiles) {
      if (updateTaskFile(taskFile, topics)) {
        updated++;
      }
    }
    console.log(`\n✓ Updated ${updated} task files in category ${category}`);
  } else if (args[0]) {
    const taskId = args[0].replace(/\./g, '-');
    let taskFile = path.join(TASKS_DIR, `${taskId}.md`);
    
    if (!fs.existsSync(taskFile)) {
      const files = fs.readdirSync(TASKS_DIR)
        .filter(file => file.endsWith('.md') && file.startsWith(taskId.split('-')[0]));
      if (files.length > 0) {
        const exactMatch = files.find(f => f.startsWith(taskId));
        if (exactMatch) {
          taskFile = path.join(TASKS_DIR, exactMatch);
        } else {
          taskFile = path.join(TASKS_DIR, files[0]);
        }
      }
    }
    
    updateTaskFile(taskFile, topics);
  } else {
    console.log(`
Usage:
  node scripts/update-tasks-with-research-v2.js [task-id]
  node scripts/update-tasks-with-research-v2.js --all
  node scripts/update-tasks-with-research-v2.js --category 1-xx

Examples:
  node scripts/update-tasks-with-research-v2.js 1-12
  node scripts/update-tasks-with-research-v2.js --category 2-xx
  node scripts/update-tasks-with-research-v2.js --all
`);
  }
}

main();
