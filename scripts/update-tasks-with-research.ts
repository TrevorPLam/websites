#!/usr/bin/env tsx
/**
 * @file scripts/update-tasks-with-research.ts
 * Purpose: Automate updating task files with research findings and code snippets from RESEARCH-INVENTORY.md
 * 
 * Usage:
 *   pnpm tsx scripts/update-tasks-with-research.ts [task-id]
 *   pnpm tsx scripts/update-tasks-with-research.ts --all
 *   pnpm tsx scripts/update-tasks-with-research.ts --category 1.xx
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const TASKS_DIR = join(ROOT_DIR, 'tasks');
const RESEARCH_INVENTORY = join(TASKS_DIR, 'RESEARCH-INVENTORY.md');

interface ResearchTopic {
  id: string;
  name: string;
  description: string;
  taskIds: string[];
  fundamentals: string[];
  bestPractices: string[];
  highestStandards: string[];
  novelTechniques: string[];
  repoSpecificContext: string;
  codeSnippets: CodeSnippet[];
}

interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description?: string;
}

interface TaskMapping {
  taskId: string;
  topics: string[];
}

/**
 * Parse RESEARCH-INVENTORY.md to extract research topics and their content
 */
function parseResearchInventory(): Map<string, ResearchTopic> {
  const content = readFileSync(RESEARCH_INVENTORY, 'utf-8');
  const topics = new Map<string, ResearchTopic>();

  // Extract task-to-topic mappings from "Task IDs by Topic" section
  const taskMappingSection = content.match(/## Task IDs by Topic([\s\S]*?)---/)?.[1];
  if (!taskMappingSection) {
    throw new Error('Could not find "Task IDs by Topic" section');
  }

  // Parse each topic section
  const topicSections = content.split(/^### (R-[A-Z0-9-]+)/m).slice(1);

  for (let i = 0; i < topicSections.length; i += 2) {
    const topicId = topicSections[i]?.trim();
    if (!topicId) continue;

    const topicContent = topicSections[i + 1] || '';
    const nextTopicMatch = topicContent.match(/^### (R-[A-Z0-9-]+)/m);
    const currentTopicContent = nextTopicMatch
      ? topicContent.substring(0, nextTopicMatch.index)
      : topicContent;

    // Extract topic name and description from header
    const headerMatch = currentTopicContent.match(/^\(([^)]+)\)/);
    const topicName = headerMatch?.[1] || topicId;

    // Extract task IDs from mapping section
    const taskMappingMatch = taskMappingSection.match(
      new RegExp(`### ${topicId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n###|$)`, 'i')
    );
    const taskIdsText = taskMappingMatch?.[1] || '';
    const taskIds = extractTaskIds(taskIdsText);

    // Extract sections
    const fundamentals = extractSection(currentTopicContent, '#### Fundamentals');
    const bestPractices = extractSection(currentTopicContent, '#### Best Practices');
    const highestStandards = extractSection(currentTopicContent, '#### Highest Standards');
    const novelTechniques = extractSection(currentTopicContent, '#### Novel Techniques');
    const repoSpecificContext = extractSection(currentTopicContent, '#### Repo-Specific Context')[0] || '';

    // Extract code snippets from Repo-Specific Context
    const codeSnippets = extractCodeSnippets(repoSpecificContext);

    topics.set(topicId, {
      id: topicId,
      name: topicName,
      description: topicName,
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
 * Extract task IDs from text (handles ranges like "2.1–2.62", "1.xx", etc.)
 */
function extractTaskIds(text: string): string[] {
  const taskIds: string[] = [];
  const lines = text.split('\n').filter((line) => line.trim());

  for (const line of lines) {
    // Handle "All 1.xx: 1-12, 1-13, ..."
    if (line.includes('All') && line.includes(':')) {
      const afterColon = line.split(':')[1];
      const matches = afterColon.matchAll(/(\d+)-(\d+)/g);
      for (const match of matches) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        for (let i = start; i <= end; i++) {
          taskIds.push(`${match[1]}-${i}`);
        }
      }
    }
    // Handle ranges like "2.1–2.62"
    const rangeMatch = line.match(/(\d+)\.(\d+)[–-](\d+)\.(\d+)/);
    if (rangeMatch) {
      const [, major1, minor1, major2, minor2] = rangeMatch;
      if (major1 === major2) {
        for (let minor = parseInt(minor1); minor <= parseInt(minor2); minor++) {
          taskIds.push(`${major1}-${minor}`);
        }
      }
    }
    // Handle individual task IDs like "2.10, 2.31"
    const individualMatches = line.matchAll(/(\d+)-(\d+)/g);
    for (const match of individualMatches) {
      taskIds.push(`${match[1]}-${match[2]}`);
    }
    // Handle f-xx tasks
    const fMatches = line.matchAll(/f-(\d+)/g);
    for (const match of fMatches) {
      taskIds.push(`f-${match[1]}`);
    }
    // Handle numbered tasks like "6.1, 6.2"
    const numberedMatches = line.matchAll(/(\d+)\.(\d+)/g);
    for (const match of numberedMatches) {
      taskIds.push(`${match[1]}-${match[2]}`);
    }
  }

  return [...new Set(taskIds)];
}

/**
 * Extract content from a specific section
 */
function extractSection(content: string, sectionHeader: string): string[] {
  const regex = new RegExp(`${sectionHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=\\n####|$)`, 'i');
  const match = content.match(regex);
  if (!match) return [];

  const sectionContent = match[1];
  // Extract bullet points (lines starting with -)
  const bullets = sectionContent
    .split('\n')
    .filter((line) => line.trim().startsWith('-'))
    .map((line) => line.trim());

  return bullets;
}

/**
 * Extract code snippets from text
 */
function extractCodeSnippets(text: string): CodeSnippet[] {
  const snippets: CodeSnippet[] = [];
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
 * Get research topics for a specific task ID
 */
function getTopicsForTask(taskId: string, topics: Map<string, ResearchTopic>): ResearchTopic[] {
  const relevantTopics: ResearchTopic[] = [];

  for (const [topicId, topic] of topics.entries()) {
    // Check if task ID matches any pattern in taskIds
    const normalizedTaskId = taskId.replace(/\./g, '-');
    if (
      topic.taskIds.includes(normalizedTaskId) ||
      topic.taskIds.includes(taskId) ||
      topic.taskIds.some((id) => {
        // Handle patterns like "1.xx" matching "1-12", "1-13", etc.
        if (id.includes('xx')) {
          const prefix = id.split('xx')[0];
          return normalizedTaskId.startsWith(prefix);
        }
        return false;
      })
    ) {
      relevantTopics.push(topic);
    }
  }

  return relevantTopics;
}

/**
 * Generate Research & Evidence section content
 */
function generateResearchSection(topics: ResearchTopic[]): string {
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
  for (const topic of topics) {
    if (topic.fundamentals.length > 0) {
      content += `#### ${topic.id} Fundamentals\n`;
      for (const finding of topic.fundamentals.slice(0, 3)) {
        // Take first 3 fundamentals
        content += `${finding}\n`;
      }
      content += '\n';
    }

    if (topic.bestPractices.length > 0) {
      content += `#### ${topic.id} Best Practices\n`;
      for (const practice of topic.bestPractices.slice(0, 2)) {
        // Take first 2 best practices
        content += `${practice}\n`;
      }
      content += '\n';
    }

    if (topic.highestStandards.length > 0) {
      content += `#### ${topic.id} Highest Standards\n`;
      for (const standard of topic.highestStandards.slice(0, 2)) {
        // Take first 2 highest standards
        content += `${standard}\n`;
      }
      content += '\n';
    }
  }

  content += `### References\n`;
  for (const topic of topics) {
    content += `- [RESEARCH-INVENTORY.md - ${topic.id}](RESEARCH-INVENTORY.md#${topic.id.toLowerCase()}) — Full research findings\n`;
  }
  content += `- [RESEARCH.md](RESEARCH.md) — Additional context\n`;

  return content;
}

/**
 * Generate Code Snippets section content
 */
function generateCodeSnippetsSection(topics: ResearchTopic[]): string {
  if (topics.length === 0) {
    return `## Code Snippets / Examples

\`\`\`typescript
// Add code snippets and usage examples
\`\`\`
`;
  }

  let content = `## Code Snippets / Examples

`;

  // Collect all code snippets from all topics
  const allSnippets: Array<{ topic: ResearchTopic; snippet: CodeSnippet }> = [];
  for (const topic of topics) {
    for (const snippet of topic.codeSnippets) {
      allSnippets.push({ topic, snippet });
    }
  }

  // Group by topic and add snippets
  for (const topic of topics) {
    if (topic.codeSnippets.length > 0) {
      content += `### ${topic.id} Implementation Patterns\n\n`;
      for (const snippet of topic.codeSnippets.slice(0, 3)) {
        // Limit to 3 snippets per topic
        content += `#### ${snippet.title}\n`;
        if (snippet.description) {
          content += `${snippet.description}\n\n`;
        }
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
 * Update a task file with research content
 */
function updateTaskFile(taskFilePath: string, topics: Map<string, ResearchTopic>): boolean {
  if (!existsSync(taskFilePath)) {
    console.warn(`Task file not found: ${taskFilePath}`);
    return false;
  }

  const taskId = basename(taskFilePath, '.md');
  const relevantTopics = getTopicsForTask(taskId, topics);

  if (relevantTopics.length === 0) {
    console.log(`No research topics found for task: ${taskId}`);
    return false;
  }

  const content = readFileSync(taskFilePath, 'utf-8');

  // Generate new sections
  const researchSection = generateResearchSection(relevantTopics);
  const codeSnippetsSection = generateCodeSnippetsSection(relevantTopics);

  // Replace Research & Evidence section
  const researchSectionRegex = /## Research & Evidence \(Date-Stamped\)[\s\S]*?(?=\n## |$)/;
  let updatedContent = content.replace(researchSectionRegex, researchSection);

  // Replace Code Snippets section
  const codeSnippetsRegex = /## Code Snippets \/ Examples[\s\S]*?(?=\n## |$)/;
  updatedContent = updatedContent.replace(codeSnippetsRegex, codeSnippetsSection);

  // Write updated content
  writeFileSync(taskFilePath, updatedContent, 'utf-8');
  console.log(`✓ Updated ${taskId} with ${relevantTopics.length} research topics`);

  return true;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  console.log('Parsing RESEARCH-INVENTORY.md...');
  const topics = parseResearchInventory();
  console.log(`Found ${topics.size} research topics`);

  if (args.includes('--all')) {
    // Update all task files
    console.log('Updating all task files...');
    const taskFiles = readdirSync(TASKS_DIR)
      .filter((file) => file.endsWith('.md') && file !== 'RESEARCH-INVENTORY.md')
      .map((file) => join(TASKS_DIR, file));

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
    console.log(`Updating tasks in category: ${category}`);
    const taskFiles = readdirSync(TASKS_DIR)
      .filter((file) => file.startsWith(category.replace('.', '-')) && file.endsWith('.md'))
      .map((file) => join(TASKS_DIR, file));

    let updated = 0;
    for (const taskFile of taskFiles) {
      if (updateTaskFile(taskFile, topics)) {
        updated++;
      }
    }
    console.log(`\n✓ Updated ${updated} task files in category ${category}`);
  } else if (args[0]) {
    // Update specific task
    const taskId = args[0].replace(/\./g, '-');
    const taskFile = join(TASKS_DIR, `${taskId}.md`);
    updateTaskFile(taskFile, topics);
  } else {
    console.log(`
Usage:
  pnpm tsx scripts/update-tasks-with-research.ts [task-id]
  pnpm tsx scripts/update-tasks-with-research.ts --all
  pnpm tsx scripts/update-tasks-with-research.ts --category 1.xx

Examples:
  pnpm tsx scripts/update-tasks-with-research.ts 1-12
  pnpm tsx scripts/update-tasks-with-research.ts --category 2.xx
  pnpm tsx scripts/update-tasks-with-research.ts --all
`);
  }
}

main();
