#!/usr/bin/env node

/**
 * @file scripts/sync-skills.ts
 * @summary Automated skill synchronization across AI development environments.
 * @description Reads .skillshare/config.json and syncs skills from source to Windsurf, Cursor, and Codex targets.
 * @security No secrets handled; respects file system permissions and exclusion patterns.
 * @adr none
 * @requirements MCP-001, SKILL-SYNC-001
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import { dirname, join } from 'path';

interface SkillConfig {
  version: string;
  project: string;
  source: string;
  targets: Array<{
    name: string;
    path: string;
    enabled: boolean;
    convertToCursor?: boolean;
  }>;
  syncMode: string;
  excludePatterns: string[];
}

function loadConfig(): SkillConfig {
  const configPath = join(process.cwd(), '.skillshare/config.json');

  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  return config;
}

function findSkillFiles(sourceDir: string): string[] {
  const files: string[] = [];

  function scan(currentDir: string) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item === 'SKILL.md') {
        files.push(fullPath);
      }
    }
  }

  scan(sourceDir);
  return files;
}

function shouldExclude(filePath: string, excludePatterns: string[]): boolean {
  return excludePatterns.some((pattern) => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

function copySkillToTarget(
  sourcePath: string,
  targetPath: string,
  convertToCursor: boolean = false
) {
  try {
    // Ensure target directory exists
    const targetDir = dirname(targetPath);
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    if (convertToCursor) {
      // Convert SKILL.md to Cursor format
      const content = readFileSync(sourcePath, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const description = content.replace(/^---\n[\s\S]*?\n---/, '').trim();

        const nameMatch = frontmatter.match(/name:\s*(.+)/);
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown Skill';

        const cursorRule = `# ${name}

## Description
${description}

## Generated from SKILL.md
Source: ${sourcePath}
Generated: ${new Date().toISOString()}

---
`;

        writeFileSync(targetPath, cursorRule, 'utf8');
        console.log(`✅ Converted: ${sourcePath} → ${targetPath}`);
      } else {
        console.log(`⚠️  No frontmatter found in ${sourcePath}, copying as-is`);
        copyFileSync(sourcePath, targetPath);
      }
    } else {
      // Direct copy for Windsurf/Codex
      copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied: ${sourcePath} → ${targetPath}`);
    }
  } catch (error) {
    console.error(
      `❌ Error copying ${sourcePath} to ${targetPath}:`,
      error instanceof Error ? error.message : String(error)
    );
  }
}

function syncSkills() {
  console.log('🔄 Starting skill synchronization...\n');

  try {
    const config = loadConfig();
    console.log(`📋 Config loaded: ${config.project} v${config.version}`);
    console.log(`📂 Source: ${config.source}`);
    console.log(`🎯 Targets: ${config.targets.length} configured\n`);

    const sourceDir = join(process.cwd(), config.source);

    if (!existsSync(sourceDir)) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }

    const skillFiles = findSkillFiles(sourceDir);
    console.log(`📄 Found ${skillFiles.length} skill files\n`);

    // Filter out excluded files
    const filteredFiles = skillFiles.filter(
      (file) => !shouldExclude(file.replace(sourceDir, ''), config.excludePatterns)
    );

    console.log(`📄 ${filteredFiles.length} files after exclusion filters\n`);

    let totalCopied = 0;

    // Sync to each enabled target
    for (const target of config.targets) {
      if (!target.enabled) {
        console.log(`⏭️  Skipping disabled target: ${target.name}`);
        continue;
      }

      console.log(`🎯 Syncing to target: ${target.name} (${target.path})`);

      const targetBaseDir = join(process.cwd(), target.path);

      for (const skillFile of filteredFiles) {
        const relativePath = skillFile.replace(sourceDir, '');
        const targetFileName = relativePath.replace(/[\/\\]/g, '_');
        const targetPath = join(targetBaseDir, targetFileName);

        copySkillToTarget(skillFile, targetPath, target.convertToCursor);
        totalCopied++;
      }

      console.log(`✅ Target ${target.name} complete\n`);
    }

    console.log(`🎉 Skill synchronization complete!`);
    console.log(
      `📊 Summary: ${totalCopied} files copied to ${config.targets.filter((t) => t.enabled).length} targets`
    );
  } catch (error) {
    console.error(
      '❌ Skill synchronization failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('sync-skills.ts')) {
  const command = process.argv[2];

  switch (command) {
    case 'sync':
    case undefined:
      syncSkills();
      break;

    case 'help':
    case '--help':
    case '-h':
      console.log(`
Skill Synchronization Tool

Usage:
  node scripts/sync-skills.js [command]

Commands:
  sync (default)  Synchronize skills from source to all targets
  help           Show this help message

Examples:
  node scripts/sync-skills.js
  node scripts/sync-skills.js sync
  node scripts/sync-skills.js help
      `);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.log('Use "help" to see available commands');
      process.exit(1);
  }
}

export { syncSkills };
