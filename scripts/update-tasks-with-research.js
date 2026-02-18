#!/usr/bin/env node
/**
 * @file scripts/update-tasks-with-research.js
 * Purpose: Automate updating task files with research findings and code snippets from RESEARCH-INVENTORY.md
 * 
 * Usage:
 *   node scripts/update-tasks-with-research.js [task-id]
 *   node scripts/update-tasks-with-research.js --all
 *   node scripts/update-tasks-with-research.js --category 1-xx
 *   node scripts/update-tasks-with-research.js --category 2-xx
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

  // Extract task-to-topic mappings
  const taskMappingMatch = content.match(/## Task IDs by Topic([\s\S]*?)---/);
  if (!taskMappingMatch) {
    throw new Error('Could not find "Task IDs by Topic" section');
  }
  const taskMappingSection = taskMappingMatch[1];

  // Find all topic sections
  const topicHeaders = content.matchAll(/^### (R-[A-Z0-9-]+) \(([^)]+)\)/gm);
  
  for (const headerMatch of topicHeaders) {
    const topicId = headerMatch[1];
    const topicName = headerMatch[2];
    
    // Find the content for this topic (until next ### or end)
    const topicStart = headerMatch.index + headerMatch[0].length;
    const nextTopicMatch = content.substring(topicStart).match(/^### (R-[A-Z0-9-]+)/m);
    const topicEnd = nextTopicMatch 
      ? topicStart + nextTopicMatch.index 
      : content.length;
    const topicContent = content.substring(topicStart, topicEnd);

    // Extract task IDs from mapping section
    const mappingRegex = new RegExp(
      `### ${topicId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n###|$)`,
      'i'
    );
    const mappingMatch = taskMappingSection.match(mappingRegex);
    let taskIdsText = mappingMatch?.[1] || '';
    
    // Handle special cases like "Same as R-UI for 1.xx"
    if (taskIdsText.includes('Same as')) {
      const sameAsMatch = taskIdsText.match(/Same as (R-[A-Z0-9-]+)/i);
      if (sameAsMatch) {
        const referencedTopic = sameAsMatch[1];
        const referencedRegex = new RegExp(
          `### ${referencedTopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n###|$)`,
          'i'
        );
        const referencedMatch = taskMappingSection.match(referencedRegex);
        if (referencedMatch) {
          taskIdsText = referencedMatch[1];
        }
      }
    }
    
    // Handle patterns like "1.xx (all)" or "all 1.xx"
    if (taskIdsText.includes('(all)') || taskIdsText.toLowerCase().includes('all')) {
      const allMatch = taskIdsText.match(/(\d+)\.xx|(\d+)-xx/i);
      if (allMatch) {
        const categoryNum = allMatch[1] || allMatch[2];
        // Add pattern to match all tasks in this category
        taskIdsText += `\nAll ${categoryNum}-xx tasks`;
      }
    }
    
    const taskIds = extractTaskIds(taskIdsText);

    // Extract sections
    const fundamentals = extractBulletPoints(topicContent, '#### Fundamentals');
    const bestPractices = extractBulletPoints(topicContent, '#### Best Practices');
    const highestStandards = extractBulletPoints(topicContent, '#### Highest Standards');
    const novelTechniques = extractBulletPoints(topicContent, '#### Novel Techniques');
    const repoSpecificContext = extractSection(topicContent, '#### Repo-Specific Context');

    // Extract code snippets
    const codeSnippets = extractCodeSnippets(repoSpecificContext);

    topics.set(topicId, {
      id: topicId,
      name: topicName,
      taskIds,
      fundamentals,
      bestPractices,
      highestStandards,
      novelTechniques,
      repoSpecificContext,
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
    // Handle "1.xx (all)" pattern - add special marker
    const allPatternMatch = line.match(/(\d+)[\.-]xx\s*\(all\)/i);
    if (allPatternMatch) {
      const categoryNum = allPatternMatch[1];
      taskIds.add(`${categoryNum}-xx (all)`);
    }
    
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
    
    // Handle individual task IDs like "2.10, 2.31" or "2-10, 2-31"
    const individualMatches = line.matchAll(/(\d+)[.-](\d+)/g);
    for (const match of individualMatches) {
      taskIds.add(`${match[1]}-${match[2]}`);
    }
    
    // Handle f-xx tasks
    const fMatches = line.matchAll(/f-(\d+)/g);
    for (const match of fMatches) {
      taskIds.add(`f-${match[1]}`);
    }
    
    // Handle numbered tasks like "6.1, 6.2" or "6-1, 6-2"
    const numberedMatches = line.matchAll(/(\d+)[.-](\d+)/g);
    for (const match of numberedMatches) {
      taskIds.add(`${match[1]}-${match[2]}`);
    }
  }

  return Array.from(taskIds);
}

/**
 * Extract bullet points from a section
 */
function extractBulletPoints(content, sectionHeader) {
  // Match section header followed by any content (including newlines) until next #### or ### or end
  const escapedHeader = sectionHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `${escapedHeader}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n####|\\n###|$)`,
    'i'
  );
  const match = content.match(regex);
  if (!match) return [];

  const sectionContent = match[1];
  const bullets = sectionContent
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim())
    .slice(0, 5); // Limit to 5 items
  
  return bullets;
}

/**
 * Extract full section content
 */
function extractSection(content, sectionHeader) {
  const regex = new RegExp(
    `${sectionHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=\\n####|$)`,
    'i'
  );
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Extract code snippets from text
 */
function extractCodeSnippets(text) {
  const snippets = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || 'typescript';
    const code = match[2].trim();

    // Try to extract title from preceding text
    const beforeMatch = text.substring(0, match.index);
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
 * Extract base task ID from filename (e.g., "1-12-create-slider-component" -> "1-12")
 */
function extractBaseTaskId(taskId) {
  // Remove file extension
  const withoutExt = taskId.replace(/\.md$/, '');
  // Extract pattern like "1-12" or "f-1" from filename
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
    // Check various matching patterns
    let matches = false;

    // Direct match
    if (topic.taskIds.includes(normalizedTaskId) || topic.taskIds.includes(baseTaskId)) {
      matches = true;
    }

    // Pattern matching
    if (!matches) {
      matches = topic.taskIds.some(id => {
        // Handle patterns like "1-xx" or "1.xx" matching "1-12", "1-13", etc.
        if (id.includes('xx')) {
          // Extract number before "xx" - handle "1.xx", "1-xx", "1xx"
          const xxMatch = id.match(/(\d+)[\.-]?xx/i);
          if (xxMatch) {
            const categoryPrefix = xxMatch[1];
            return normalizedTaskId.startsWith(`${categoryPrefix}-`);
          }
          const prefix = id.split('xx')[0].replace(/\./g, '-');
          return normalizedTaskId.startsWith(prefix);
        }
        // Handle "all" patterns and "(all)" patterns like "1.xx (all)"
        if (id.toLowerCase().includes('all') || id.includes('(all)')) {
          // Extract category from "All 1.xx" or "1.xx (all)" or "all 1-xx" or "1-xx (all)"
          const allMatch = id.match(/(\d+)[\.-]xx/i);
          if (allMatch) {
            const categoryPrefix = allMatch[1];
            return normalizedTaskId.startsWith(`${categoryPrefix}-`);
          }
          // If no category specified, match all
          return true;
        }
        // Handle category patterns like "1.xx" -> "1-12", "1-13"
        const categoryMatch = id.match(/^(\d+)[\.-]xx$/);
        if (categoryMatch) {
          const categoryPrefix = categoryMatch[1];
          return normalizedTaskId.startsWith(`${categoryPrefix}-`);
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
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.`;
  }

  let content = `## Research & Evidence (Date-Stamped)

### Primary Research Topics
`;

  // List primary topics
  for (const topic of topics) {
    content += `- **[2026-02-18] ${topic.id}**: ${topic.name} — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#${topic.id.toLowerCase()}) for full research findings.\n`;
  }

  content += `\n### Key Findings\n\n`;

  // Add key findings from each topic (prioritize highest standards and best practices)
  let hasFindings = false;
  for (const topic of topics) {
    if (topic.highestStandards.length > 0) {
      if (!hasFindings) {
        hasFindings = true;
      }
      content += `#### ${topic.id} Highest Standards\n`;
      for (const standard of topic.highestStandards.slice(0, 2)) {
        content += `${standard}\n`;
      }
      content += '\n';
    }

    if (topic.bestPractices.length > 0) {
      if (!hasFindings) {
        hasFindings = true;
      }
      content += `#### ${topic.id} Best Practices\n`;
      for (const practice of topic.bestPractices.slice(0, 2)) {
        content += `${practice}\n`;
      }
      content += '\n';
    }

    if (topic.fundamentals.length > 0 && topic.highestStandards.length === 0 && topic.bestPractices.length === 0) {
      if (!hasFindings) {
        hasFindings = true;
      }
      content += `#### ${topic.id} Fundamentals\n`;
      for (const finding of topic.fundamentals.slice(0, 2)) {
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
  for (const topic of topics) {
    if (topic.codeSnippets.length > 0) {
      content += `### ${topic.id} Implementation Patterns\n\n`;
      for (const snippet of topic.codeSnippets.slice(0, 3)) {
        // Limit to 3 snippets per topic
        content += `#### ${snippet.title}\n`;
        content += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
      }
    }
  }

  content += `### Related Patterns\n`;
  for (const topic of topics) {
    content += `- See [${topic.id} - Repo-Specific Context](RESEARCH-INVENTORY.md#${topic.id.toLowerCase()}) for additional examples\n`;
  }

  return content;
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
  
  // Check if existing section has actual code blocks (not just links)
  const hasExistingCode = existingCodeSnippets && existingCodeSnippets.match(/```[\s\S]*?```/);
  
  // Replace Code Snippets section - preserve existing code if present
  const codeSnippetsRegex = /## Code Snippets \/ Examples[\s\S]*?(?=\n## |$)/;
  if (hasExistingCode) {
    // Preserve existing code snippets - only add Related Patterns if missing
    const newPatternsSection = codeSnippetsSection.match(/### Related Patterns[\s\S]*/);
    if (newPatternsSection && !existingCodeSnippets.includes('### Related Patterns')) {
      // Add new patterns section at the end
      updatedContent = updatedContent.replace(codeSnippetsRegex, `## Code Snippets / Examples\n\n${existingCodeSnippets}\n\n${newPatternsSection[0]}`);
      console.log(`  ⚠ Preserved existing code snippets and added Related Patterns in ${taskFileName}`);
    } else {
      // Keep existing content as-is - don't replace
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
    // Update all task files
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
    // Update tasks in a specific category
    const category = args[1];
    console.log(`Updating tasks in category: ${category}\n`);
    
    // Handle different category formats: "1.xx", "1-xx", "1xx", "f-xx"
    let prefix = category.replace(/\./g, '-');
    if (!prefix.includes('-')) {
      // Handle "1xx" -> "1-"
      prefix = prefix.replace(/(\d+)(xx)/, '$1-');
    }
    
    const taskFiles = fs.readdirSync(TASKS_DIR)
      .filter(file => {
        if (!file.endsWith('.md')) return false;
        if (file === 'RESEARCH-INVENTORY.md' || file === 'TASK-UPDATE-GAMEPLAN.md' || file === 'TASK-UPDATE-PROGRESS.md') return false;
        
        // Extract base task ID from filename
        const baseId = extractBaseTaskId(file);
        if (!baseId) return false;
        
        // Check if it matches the category prefix
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
    // Update specific task - try multiple filename formats
    const taskId = args[0].replace(/\./g, '-');
    let taskFile = path.join(TASKS_DIR, `${taskId}.md`);
    
    // If exact match doesn't exist, try to find matching file
    if (!fs.existsSync(taskFile)) {
      const files = fs.readdirSync(TASKS_DIR)
        .filter(file => file.endsWith('.md') && file.startsWith(taskId.split('-')[0]));
      if (files.length > 0) {
        // Try to find exact match first
        const exactMatch = files.find(f => f.startsWith(taskId));
        if (exactMatch) {
          taskFile = path.join(TASKS_DIR, exactMatch);
        } else {
          // Use first match
          taskFile = path.join(TASKS_DIR, files[0]);
        }
      }
    }
    
    updateTaskFile(taskFile, topics);
  } else {
    console.log(`
Usage:
  node scripts/update-tasks-with-research.js [task-id]
  node scripts/update-tasks-with-research.js --all
  node scripts/update-tasks-with-research.js --category 1-xx

Examples:
  node scripts/update-tasks-with-research.js 1-12
  node scripts/update-tasks-with-research.js --category 2-xx
  node scripts/update-tasks-with-research.js --all
`);
  }
}

main();
