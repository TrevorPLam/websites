#!/usr/bin/env node

/**
 * @file scripts/sync-skills.js
 * @summary Sync skills documentation from MCP servers to local memory.
 * @description Automated script to retrieve and organize AI agent skills and capabilities.
 * @security No sensitive data handling; documentation only
 * @requirements MCP-integration, skills-sync
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = '.claude/skills';
const TARGETS = [
  { name: 'windsurf', path: '.windsurf/skills' },
  { name: 'codex', path: '.codex/skills' },
  { name: 'cursor', path: '.cursor/rules', convertToCursor: true },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copySkill(skillName, sourceDir, targetDir, convertToCursor = false) {
  const sourcePath = path.join(sourceDir, skillName);
  const targetPath = path.join(targetDir, skillName);

  if (!fs.existsSync(sourcePath)) return;

  ensureDir(targetPath);

  // Copy all files
  const files = fs.readdirSync(sourcePath, { withFileTypes: true });
  files.forEach((file) => {
    const srcFile = path.join(sourcePath, file.name);
    const destFile = path.join(targetPath, file.name);

    if (file.isDirectory()) {
      ensureDir(destFile);
      copySkill(file.name, srcFile, destFile, convertToCursor);
    } else {
      let content = fs.readFileSync(srcFile, 'utf8');

      // Convert to Cursor format if needed
      if (convertToCursor && file.name === 'SKILL.md') {
        content = convertToCursorFormat(content, skillName);
        const cursorFileName = `${skillName}.mdc`;
        fs.writeFileSync(path.join(targetDir, cursorFileName), content);
      } else {
        fs.writeFileSync(destFile, content);
      }
    }
  });
}

function convertToCursorFormat(content, skillName) {
  // Extract YAML frontmatter
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!yamlMatch) return content;

  const yaml = yamlMatch[1];
  const description = yaml.match(/description:\s*\|?\s*([\s\S]*?)\nmeta:/)?.[1] || '';

  return `---
description: "${description.trim()}"
globs: "**/*.{ts,tsx,js,jsx}"
alwaysApply: false
---

${content.replace(/^---\n[\s\S]*?\n---\n/, '')}`;
}

function syncSkills() {
  console.log('🔄 Syncing Agent Skills across platforms...');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`❌ Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const skills = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  console.log(`📦 Found ${skills.length} skills: ${skills.join(', ')}`);

  TARGETS.forEach((target) => {
    console.log(`\n🎯 Syncing to ${target.name}...`);
    ensureDir(target.path);

    skills.forEach((skill) => {
      copySkill(skill, SKILLS_DIR, target.path, target.convertToCursor);
      console.log(`  ✓ ${skill}`);
    });
  });

  console.log('\n✅ Skills synchronization complete!');
  console.log('\n📋 Summary:');
  TARGETS.forEach((target) => {
    const count = fs.readdirSync(target.path).length;
    console.log(`  ${target.name}: ${count} skills`);
  });
}

if (require.main === module) {
  syncSkills();
}

module.exports = { syncSkills };
