#!/usr/bin/env node
/**
 * @file scripts/validate-skills.ts
 * @summary Validates skill structure and cross-references against MCP server config.
 * @description Ensures all skills follow the three-tier progressive-disclosure format,
 *   have valid YAML frontmatter, and reference only registered MCP servers.
 *   Generates a packaging manifest (skills-manifest.json) suitable for distribution.
 * @security Reads only local files; no network calls.
 * @requirements TODO.md 5-C, MCP-standards
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_PATH = path.join(REPO_ROOT, 'skills');
const MCP_CONFIG_PATH = path.join(REPO_ROOT, 'mcp', 'config', 'config.json');
const MANIFEST_OUTPUT = path.join(REPO_ROOT, 'skills', 'skills-manifest.json');

interface SkillManifest {
  name: string;
  version: string;
  category: string;
  platform: string;
  description: string;
  invokes: string[];
  hasTier2: boolean;
  hasTier3: boolean;
  skillDirPath: string;
  issues: string[];
}

interface ValidationResult {
  passed: number;
  failed: number;
  warnings: number;
  skills: SkillManifest[];
  errors: string[];
}

/**
 * Extract YAML frontmatter from a SKILL.md file.
 * Returns a key/value record; values are raw strings (not deeply parsed).
 *
 * NOTE: This is a lightweight line-by-line parser suitable for the flat
 * SKILL.md frontmatter schema. It does not support deeply-nested YAML objects
 * or arrays. Use a full YAML parser (e.g. js-yaml) if nested structures are needed.
 */
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const result: Record<string, string> = {};
  const lines = match[1].split('\n');

  let currentKey = '';
  let multilineValue = '';
  let inMultiline = false;

  for (const line of lines) {
    if (inMultiline) {
      if (line.startsWith('  ') || line === '') {
        multilineValue += (multilineValue ? '\n' : '') + line.trim();
        continue;
      }
      result[currentKey] = multilineValue.trim();
      inMultiline = false;
      multilineValue = '';
    }

    const kv = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (kv) {
      currentKey = kv[1];
      if (kv[2] === '|') {
        inMultiline = true;
        multilineValue = '';
      } else {
        result[currentKey] = kv[2].replace(/^['"]|['"]$/g, '');
      }
    }
  }

  if (inMultiline) result[currentKey] = multilineValue.trim();

  return result;
}

/** Extract INVOKES server names from frontmatter description field. */
function extractInvokes(description: string): string[] {
  const match = description.match(/INVOKES:\s*([^\n.]+)/i);
  if (!match) return [];
  return match[1]
    .replace(/\[|\]/g, '')
    .split(/[,\s]+/)
    .map((s) => s.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

/** Load registered MCP server names from config.json. */
function loadRegisteredServers(): Set<string> {
  try {
    const raw = fs.readFileSync(MCP_CONFIG_PATH, 'utf-8');
    const config = JSON.parse(raw) as Record<string, unknown>;
    const servers = (config['mcpServers'] ?? config['servers'] ?? {}) as Record<string, unknown>;
    return new Set(Object.keys(servers));
  } catch {
    console.warn(`⚠ Could not read MCP config at ${MCP_CONFIG_PATH}`);
    return new Set();
  }
}

/** Validate a single skill directory (must contain SKILL.md). */
function validateSkillDir(
  skillDirPath: string,
  category: string,
  platform: string,
  registeredServers: Set<string>
): SkillManifest {
  const skillMdPath = path.join(skillDirPath, 'SKILL.md');
  const issues: string[] = [];

  if (!fs.existsSync(skillMdPath)) {
    return {
      name: path.basename(skillDirPath),
      version: 'unknown',
      category,
      platform,
      description: '',
      invokes: [],
      hasTier2: false,
      hasTier3: false,
      skillDirPath,
      issues: ['Missing SKILL.md'],
    };
  }

  const content = fs.readFileSync(skillMdPath, 'utf-8');

  // Validate YAML frontmatter starts with ---
  if (!content.trimStart().startsWith('---')) {
    issues.push('SKILL.md is missing YAML frontmatter block (must start with ---)');
  }

  const fm = parseFrontmatter(content);

  if (!fm['name']) issues.push('Missing required frontmatter field: name');
  if (!fm['description']) issues.push('Missing required frontmatter field: description');

  // Check SKILL.md has NO prose body (tier-1 = frontmatter only).
  // Allow up to 10 chars of trailing whitespace/newlines but flag any real prose content.
  const bodyAfterFrontmatter = content.replace(/^---[\s\S]*?---\s*/, '').trim();
  if (bodyAfterFrontmatter.length > 10) {
    issues.push(
      `SKILL.md contains ${bodyAfterFrontmatter.length} chars of body prose (tier-1 should be frontmatter only; move body to instructions/full.md)`
    );
  }

  // Tier 2 check
  const tier2Ref = fm['tier2'];
  const tier2Path = tier2Ref ? path.join(skillDirPath, tier2Ref) : null;
  const hasTier2 = tier2Path ? fs.existsSync(tier2Path) : false;

  if (fm['description']?.includes('USE FOR') && !tier2Ref) {
    issues.push('Missing tier2 reference in frontmatter (add `tier2: instructions/full.md`)');
  }
  if (tier2Ref && !hasTier2) {
    issues.push(`tier2 file '${tier2Ref}' referenced in frontmatter but does not exist`);
  }

  // Tier 3 check
  const hasTier3 =
    fs.existsSync(path.join(skillDirPath, 'scripts')) ||
    fs.existsSync(path.join(skillDirPath, 'references'));

  // Cross-reference INVOKES with config.json
  const invokes = extractInvokes(fm['description'] ?? '');
  for (const server of invokes) {
    if (registeredServers.size > 0 && !registeredServers.has(server)) {
      issues.push(`INVOKES '${server}' but it is NOT registered in mcp/config/config.json`);
    }
  }

  return {
    name: fm['name'] ?? path.basename(skillDirPath),
    version: fm['version']?.replace(/'/g, '') ?? '1.0.0',
    category,
    platform,
    description: fm['description'] ?? '',
    invokes,
    hasTier2,
    hasTier3,
    skillDirPath: path.relative(REPO_ROOT, skillDirPath),
    issues,
  };
}

/** Walk skills/ directory and validate all skills. */
function validateAll(): ValidationResult {
  const registeredServers = loadRegisteredServers();
  const result: ValidationResult = { passed: 0, failed: 0, warnings: 0, skills: [], errors: [] };

  // Directories that are support/auxiliary, not skills (at any depth)
  const SUPPORT_DIRS = new Set(['agents', 'assets', 'references', 'scripts', 'templates']);

  if (!fs.existsSync(SKILLS_PATH)) {
    result.errors.push(`Skills directory not found: ${SKILLS_PATH}`);
    return result;
  }

  const categories = fs.readdirSync(SKILLS_PATH, { withFileTypes: true });

  for (const catEntry of categories) {
    if (!catEntry.isDirectory()) continue;
    const category = catEntry.name;
    const categoryPath = path.join(SKILLS_PATH, category);
    const platform = category;

    const items = fs.readdirSync(categoryPath, { withFileTypes: true });
    for (const item of items) {
      if (!item.isDirectory()) continue;
      // Skip support directories (they are auxiliary content, not skills)
      if (SUPPORT_DIRS.has(item.name)) continue;

      const skillDirPath = path.join(categoryPath, item.name);

      // If there is no SKILL.md, check if there are any flat .md skill files inside
      const skillMdPath = path.join(skillDirPath, 'SKILL.md');
      if (!fs.existsSync(skillMdPath)) {
        // Check for flat .md files that should be converted
        const subFiles = fs.readdirSync(skillDirPath, { withFileTypes: true }).filter(
          (f) => f.isFile() && f.name.endsWith('.md') && f.name !== 'README.md'
        );
        if (subFiles.length > 0) {
          result.warnings++;
          result.skills.push({
            name: item.name,
            version: 'unknown',
            category,
            platform,
            description: '',
            invokes: [],
            hasTier2: false,
            hasTier3: false,
            skillDirPath: path.relative(REPO_ROOT, skillDirPath),
            issues: [
              `Directory contains flat .md files (${subFiles.map((f) => f.name).join(', ')}) that should be converted to SKILL.md + instructions/full.md`,
            ],
          });
        }
        // No SKILL.md and no flat files → skip silently (it's a container directory)
        continue;
      }

      const manifest = validateSkillDir(skillDirPath, category, platform, registeredServers);
      result.skills.push(manifest);

      if (manifest.issues.length === 0) {
        result.passed++;
      } else {
        const hasErrors = manifest.issues.some(
          (i) => !i.startsWith('Missing tier2') && !i.includes('tier-1 should')
        );
        if (hasErrors) {
          result.failed++;
        } else {
          result.warnings++;
        }
      }
    }
  }

  return result;
}

/** Print validation report and write manifest JSON. */
function main(): void {
  console.log('🔍 Validating skills...\n');

  const result = validateAll();

  for (const skill of result.skills) {
    if (skill.issues.length === 0) {
      console.log(`  ✅ ${skill.platform}/${skill.name}`);
    } else {
      const hasErrors = skill.issues.some(
        (i) =>
          !i.startsWith('Missing tier2') &&
          !i.includes('tier-1 should') &&
          !i.startsWith('Directory contains flat')
      );
      const icon = hasErrors ? '❌' : '⚠';
      console.log(`  ${icon} ${skill.platform}/${skill.name}`);
      for (const issue of skill.issues) {
        console.log(`       → ${issue}`);
      }
    }
  }

  console.log(`
─────────────────────────────────────────────────────────────
  Skills validated: ${result.skills.length}
  ✅ Passed:   ${result.passed}
  ⚠  Warnings: ${result.warnings}
  ❌ Failed:   ${result.failed}
─────────────────────────────────────────────────────────────`);

  // Write manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalSkills: result.skills.length,
    passed: result.passed,
    warnings: result.warnings,
    failed: result.failed,
    skills: result.skills,
  };

  fs.writeFileSync(MANIFEST_OUTPUT, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\n📦 Manifest written to: ${path.relative(process.cwd(), MANIFEST_OUTPUT)}\n`);

  if (result.failed > 0) {
    process.exit(1);
  }
}

main();
