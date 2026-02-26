#!/usr/bin/env node

/**
 * @file scripts/security-audit.js
 * @summary Security audit script for Skills and MCP infrastructure.
 * @description Implements supply chain safety and validation checks for Skills and MCP servers.
 * @security Validates skill structure, MCP server configurations, and detects security issues.
 * @requirements Master Guide compliance, supply chain safety
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SKILLS_DIR = '.claude/skills';
const MCP_CONFIG = '.mcp/config.json';
const SECURITY_REPORT = '.mcp/security-audit.json';

function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

function validateSkillStructure(skillPath) {
  const requiredFiles = ['SKILL.md'];
  const optionalFiles = ['agents/openai.yaml', 'agents/cursor.mdc'];
  const issues = [];

  // Check required files
  requiredFiles.forEach((file) => {
    const filePath = path.join(skillPath, file);
    if (!fs.existsSync(filePath)) {
      issues.push(`Missing required file: ${file}`);
    }
  });

  // Validate SKILL.md structure
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf8');

    // Check for YAML frontmatter
    if (!content.startsWith('---')) {
      issues.push('SKILL.md missing YAML frontmatter');
    }

    // Check for required fields
    const requiredFields = ['name:', 'description:'];
    requiredFields.forEach((field) => {
      if (!content.includes(field)) {
        issues.push(`SKILL.md missing required field: ${field}`);
      }
    });

    // Check for security considerations
    if (
      !content.toLowerCase().includes('security') &&
      !content.toLowerCase().includes('permissions')
    ) {
      issues.push('SKILL.md should include security considerations');
    }
  }

  // Validate agents directory
  const agentsDir = path.join(skillPath, 'agents');
  if (fs.existsSync(agentsDir)) {
    const agentFiles = fs.readdirSync(agentsDir);
    agentFiles.forEach((file) => {
      if (!file.endsWith('.yaml') && !file.endsWith('.mdc')) {
        issues.push(`Invalid agent file format: ${file}`);
      }
    });
  }

  return issues;
}

function validateMcpServer(serverConfig, serverName) {
  const issues = [];

  // Check for required fields
  if (!serverConfig.command) {
    issues.push('Missing command field');
  }

  if (!serverConfig.args || !Array.isArray(serverConfig.args)) {
    issues.push('Missing or invalid args field');
  }

  // Security checks
  if (serverConfig.args && serverConfig.args.includes('--insecure')) {
    issues.push('Server uses insecure flag');
  }

  if (serverConfig.env) {
    Object.keys(serverConfig.env).forEach((key) => {
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
        issues.push(`Environment variable contains sensitive term: ${key}`);
      }
    });
  }

  // Check for proper tool restrictions
  if (serverName.includes('enterprise') && !serverConfig.env?.LOG_LEVEL) {
    issues.push('Enterprise server should have LOG_LEVEL configured');
  }

  return issues;
}

function performSecurityAudit() {
  console.log('🔒 Performing security audit...');

  const audit = {
    timestamp: new Date().toISOString(),
    skills: {},
    mcpServers: {},
    summary: {
      totalSkills: 0,
      totalMcpServers: 0,
      issuesFound: 0,
      criticalIssues: 0,
    },
  };

  // Audit Skills
  if (fs.existsSync(SKILLS_DIR)) {
    const skills = fs
      .readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    audit.summary.totalSkills = skills.length;

    skills.forEach((skill) => {
      const skillPath = path.join(SKILLS_DIR, skill);
      const skillHash = calculateFileHash(path.join(skillPath, 'SKILL.md'));
      const issues = validateSkillStructure(skillPath);

      audit.skills[skill] = {
        hash: skillHash,
        issues: issues,
        status:
          issues.length === 0
            ? 'secure'
            : issues.some((i) => i.includes('security'))
              ? 'warning'
              : 'info',
      };

      if (issues.length > 0) {
        audit.summary.issuesFound += issues.length;
        if (issues.some((i) => i.includes('security') || i.includes('critical'))) {
          audit.summary.criticalIssues++;
        }
      }
    });
  }

  // Audit MCP Servers
  if (fs.existsSync(MCP_CONFIG)) {
    try {
      const mcpConfig = JSON.parse(fs.readFileSync(MCP_CONFIG, 'utf8'));
      const servers = mcpConfig.servers || {};

      audit.summary.totalMcpServers = Object.keys(servers).length;

      Object.entries(servers).forEach(([name, config]) => {
        const issues = validateMcpServer(config, name);

        audit.mcpServers[name] = {
          issues: issues,
          status:
            issues.length === 0
              ? 'secure'
              : issues.some((i) => i.includes('security'))
                ? 'warning'
                : 'info',
        };

        if (issues.length > 0) {
          audit.summary.issuesFound += issues.length;
          if (issues.some((i) => i.includes('security') || i.includes('critical'))) {
            audit.summary.criticalIssues++;
          }
        }
      });
    } catch (error) {
      audit.mcpServers.error = `Failed to parse MCP config: ${error.message}`;
      audit.summary.issuesFound++;
    }
  }

  // Write audit report
  fs.writeFileSync(SECURITY_REPORT, JSON.stringify(audit, null, 2));

  // Display results
  console.log('\n📋 Security Audit Results:');
  console.log(`Total Skills: ${audit.summary.totalSkills}`);
  console.log(`Total MCP Servers: ${audit.summary.totalMcpServers}`);
  console.log(`Issues Found: ${audit.summary.issuesFound}`);
  console.log(`Critical Issues: ${audit.summary.criticalIssues}`);

  if (audit.summary.criticalIssues > 0) {
    console.log('\n🚨 CRITICAL SECURITY ISSUES FOUND:');
    Object.entries(audit.skills).forEach(([skill, data]) => {
      const critical = data.issues.filter((i) => i.includes('security') || i.includes('critical'));
      if (critical.length > 0) {
        console.log(`  ⚠️  ${skill}: ${critical.join(', ')}`);
      }
    });

    Object.entries(audit.mcpServers).forEach(([server, data]) => {
      const critical = data.issues.filter((i) => i.includes('security') || i.includes('critical'));
      if (critical.length > 0) {
        console.log(`  ⚠️  ${server}: ${critical.join(', ')}`);
      }
    });
  }

  console.log(`\n📄 Full report written to: ${SECURITY_REPORT}`);

  return audit.summary.criticalIssues === 0;
}

if (require.main === module) {
  const isSecure = performSecurityAudit();
  process.exit(isSecure ? 0 : 1);
}

module.exports = { performSecurityAudit };
