#!/usr/bin/env node

/**
 * @file scripts/supply-chain-safety.js
 * @summary Supply chain safety validation for Skills and MCP infrastructure.
 * @description Implements Master Guide supply chain safety requirements with fingerprinting.
 * @security Validates skill integrity, MCP server configurations, and detects tampering.
 * @requirements Master Guide compliance, supply chain safety, integrity validation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SKILLS_DIR = '.claude/skills';
const TRUSTED_MANIFEST = '.mcp/trusted-manifest.json';
const SAFETY_REPORT = '.mcp/supply-chain-safety.json';

function loadTrustedManifest() {
  if (fs.existsSync(TRUSTED_MANIFEST)) {
    try {
      return JSON.parse(fs.readFileSync(TRUSTED_MANIFEST, 'utf8'));
    } catch (error) {
      console.warn(`Warning: Could not load trusted manifest: ${error.message}`);
    }
  }

  // Return default trusted manifest
  return {
    version: '1.0.0',
    trustedSkills: {},
    trustedMcpServers: {},
    lastUpdated: new Date().toISOString(),
  };
}

function calculateSkillFingerprint(skillPath) {
  const fingerprint = {
    files: {},
    hash: null,
  };

  function scanDirectory(dirPath, relativePath = '') {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    items.forEach((item) => {
      const itemPath = path.join(dirPath, item.name);
      const itemRelativePath = path.join(relativePath, item.name);

      if (item.isDirectory()) {
        scanDirectory(itemPath, itemRelativePath);
      } else {
        const content = fs.readFileSync(itemPath, 'utf8');
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        fingerprint.files[itemRelativePath] = {
          hash: hash,
          size: content.length,
          modified: fs.statSync(itemPath).mtime.toISOString(),
        };
      }
    });
  }

  scanDirectory(skillPath);

  // Calculate overall hash
  const allHashes = Object.values(fingerprint.files)
    .map((f) => f.hash)
    .sort()
    .join('|');
  fingerprint.hash = crypto.createHash('sha256').update(allHashes).digest('hex');

  return fingerprint;
}

function validateSkillIntegrity(skillName, trustedManifest) {
  const skillPath = path.join(SKILLS_DIR, skillName);

  if (!fs.existsSync(skillPath)) {
    return { status: 'missing', issues: ['Skill directory not found'] };
  }

  const fingerprint = calculateSkillFingerprint(skillPath);
  const trusted = trustedManifest.trustedSkills[skillName];

  const issues = [];
  let status = 'trusted';

  if (!trusted) {
    status = 'untrusted';
    issues.push('Skill not in trusted manifest');
  } else {
    if (trusted.hash !== fingerprint.hash) {
      status = 'modified';
      issues.push('Skill fingerprint mismatch - possible tampering');
    }

    // Check version
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      const content = fs.readFileSync(skillMdPath, 'utf8');
      const versionMatch = content.match(/version:\s*['"]([^'"]+)['"]/);
      const currentVersion = versionMatch ? versionMatch[1] : 'unknown';

      if (trusted.version !== currentVersion) {
        status = 'version-mismatch';
        issues.push(`Version mismatch: trusted=${trusted.version}, current=${currentVersion}`);
      }
    }
  }

  // Security checks
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf8').toLowerCase();

    // Check for suspicious patterns
    const suspiciousPatterns = ['eval(', 'function(', 'script>', 'javascript:', 'data:text/html'];

    suspiciousPatterns.forEach((pattern) => {
      if (content.includes(pattern)) {
        status = 'suspicious';
        issues.push(`Suspicious pattern detected: ${pattern}`);
      }
    });

    // Check for external network calls
    if (content.includes('fetch(') || content.includes('http')) {
      if (!content.includes('mcp-')) {
        issues.push('Direct network calls detected - should use MCP servers');
      }
    }
  }

  return {
    status: status,
    fingerprint: fingerprint,
    issues: issues,
    trusted: trusted,
  };
}

function validateMcpServerIntegrity(serverName, serverConfig, trustedManifest) {
  const issues = [];
  let status = 'trusted';

  const trusted = trustedManifest.trustedMcpServers[serverName];

  if (!trusted) {
    status = 'untrusted';
    issues.push('MCP server not in trusted manifest');
  } else {
    // Validate server configuration
    const configHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(serverConfig))
      .digest('hex');

    if (trusted.configHash !== configHash) {
      status = 'modified';
      issues.push('MCP server configuration modified');
    }
  }

  // Security checks
  if (serverConfig.args) {
    serverConfig.args.forEach((arg) => {
      if (arg.includes('--insecure') || arg.includes('--disable-ssl')) {
        status = 'insecure';
        issues.push(`Insecure argument detected: ${arg}`);
      }
    });
  }

  return {
    status: status,
    issues: issues,
    trusted: trusted,
  };
}

function performSupplyChainSafetyCheck() {
  console.log('🛡️  Performing supply chain safety check...');

  const trustedManifest = loadTrustedManifest();
  const safetyReport = {
    timestamp: new Date().toISOString(),
    manifest: trustedManifest,
    skills: {},
    mcpServers: {},
    summary: {
      totalSkills: 0,
      totalMcpServers: 0,
      trusted: 0,
      untrusted: 0,
      modified: 0,
      suspicious: 0,
      insecure: 0,
    },
  };

  // Validate Skills
  if (fs.existsSync(SKILLS_DIR)) {
    const skills = fs
      .readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    safetyReport.summary.totalSkills = skills.length;

    skills.forEach((skill) => {
      const validation = validateSkillIntegrity(skill, trustedManifest);
      safetyReport.skills[skill] = validation;

      safetyReport.summary[validation.status] = (safetyReport.summary[validation.status] || 0) + 1;
    });
  }

  // Validate MCP Servers
  const mcpConfigPath = '.mcp/config.json';
  if (fs.existsSync(mcpConfigPath)) {
    try {
      const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      const servers = mcpConfig.servers || {};

      safetyReport.summary.totalMcpServers = Object.keys(servers).length;

      Object.entries(servers).forEach(([name, config]) => {
        const validation = validateMcpServerIntegrity(name, config, trustedManifest);
        safetyReport.mcpServers[name] = validation;

        safetyReport.summary[validation.status] =
          (safetyReport.summary[validation.status] || 0) + 1;
      });
    } catch (error) {
      console.error(`Error reading MCP config: ${error.message}`);
    }
  }

  // Write safety report
  fs.writeFileSync(SAFETY_REPORT, JSON.stringify(safetyReport, null, 2));

  // Display results
  console.log('\n📋 Supply Chain Safety Results:');
  console.log(`Total Skills: ${safetyReport.summary.totalSkills}`);
  console.log(`Total MCP Servers: ${safetyReport.summary.totalMcpServers}`);
  console.log(`Trusted: ${safetyReport.summary.trusted}`);
  console.log(`Untrusted: ${safetyReport.summary.untrusted}`);
  console.log(`Modified: ${safetyReport.summary.modified}`);
  console.log(`Suspicious: ${safetyReport.summary.suspicious}`);
  console.log(`Insecure: ${safetyReport.summary.insecure}`);

  // Alert on issues
  if (
    safetyReport.summary.untrusted > 0 ||
    safetyReport.summary.suspicious > 0 ||
    safetyReport.summary.insecure > 0
  ) {
    console.log('\n🚨 SAFETY ISSUES DETECTED:');

    Object.entries(safetyReport.skills).forEach(([skill, data]) => {
      if (data.status !== 'trusted') {
        console.log(`  ⚠️  ${skill}: ${data.status} - ${data.issues.join(', ')}`);
      }
    });

    Object.entries(safetyReport.mcpServers).forEach(([server, data]) => {
      if (data.status !== 'trusted') {
        console.log(`  ⚠️  ${server}: ${data.status} - ${data.issues.join(', ')}`);
      }
    });
  }

  console.log(`\n📄 Full report written to: ${SAFETY_REPORT}`);

  return (
    safetyReport.summary.untrusted === 0 &&
    safetyReport.summary.suspicious === 0 &&
    safetyReport.summary.insecure === 0
  );
}

function updateTrustedManifest() {
  console.log('📝 Updating trusted manifest...');

  const manifest = {
    version: '1.0.0',
    trustedSkills: {},
    trustedMcpServers: {},
    lastUpdated: new Date().toISOString(),
  };

  // Add Skills to manifest
  if (fs.existsSync(SKILLS_DIR)) {
    const skills = fs
      .readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    skills.forEach((skill) => {
      const skillPath = path.join(SKILLS_DIR, skill);
      const fingerprint = calculateSkillFingerprint(skillPath);

      // Extract version from SKILL.md
      let version = '1.0.0';
      const skillMdPath = path.join(skillPath, 'SKILL.md');
      if (fs.existsSync(skillMdPath)) {
        const content = fs.readFileSync(skillMdPath, 'utf8');
        const versionMatch = content.match(/version:\s*['"]([^'"]+)['"]/);
        version = versionMatch ? versionMatch[1] : '1.0.0';
      }

      manifest.trustedSkills[skill] = {
        hash: fingerprint.hash,
        version: version,
        files: fingerprint.files,
        addedAt: new Date().toISOString(),
      };
    });
  }

  // Add MCP Servers to manifest
  const mcpConfigPath = '.mcp/config.json';
  if (fs.existsSync(mcpConfigPath)) {
    try {
      const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      const servers = mcpConfig.servers || {};

      Object.entries(servers).forEach(([name, config]) => {
        const configHash = crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex');

        manifest.trustedMcpServers[name] = {
          configHash: configHash,
          command: config.command,
          addedAt: new Date().toISOString(),
        };
      });
    } catch (error) {
      console.error(`Error reading MCP config: ${error.message}`);
    }
  }

  // Write manifest
  fs.writeFileSync(TRUSTED_MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`✅ Trusted manifest updated: ${TRUSTED_MANIFEST}`);
}

if (require.main === module) {
  const command = process.argv[2];

  if (command === 'update') {
    updateTrustedManifest();
  } else {
    const isSafe = performSupplyChainSafetyCheck();
    process.exit(isSafe ? 0 : 1);
  }
}

module.exports = {
  performSupplyChainSafetyCheck,
  updateTrustedManifest,
};
