#!/usr/bin/env node

/**
 * @file mcp/scripts/validate-task-1-1.js
 * @summary Validation script for Task 1.1 - Fix config.production.json server paths
 * @description Validates that all Task 1.1 requirements are met in config.production.json
 * @security Validates configuration paths; no secrets exposed in validation output
 * @requirements TASKS4.md Task 1.1
 */

const fs = require('fs');
const path = require('path');

class Task1_1Validator {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'config.production.json');
    this.validationResults = [];
  }

  validateTask1_1() {
    console.log('🔍 Task 1.1 Validation - Fix config.production.json server paths\n');

    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

      this.validateNoOldPaths(config);
      this.validateNoDevelopmentEnv(config);
      this.validateNoEverythingServer(config);
      this.validateCorrectPaths(config);
      this.validateSkillsPath(config);
      this.validateDocumentationPath(config);

      this.printResults();

      return this.isTask1_1Complete();
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return false;
    }
  }

  validateNoOldPaths(config) {
    const configText = JSON.stringify(config);
    const hasOldPaths = configText.includes('packages/mcp-servers/src/');

    if (!hasOldPaths) {
      this.addResult('✅ Old Package Paths', true, 'No occurrences of "packages/mcp-servers/src/"');
    } else {
      this.addResult(
        '❌ Old Package Paths',
        false,
        'Found occurrences of "packages/mcp-servers/src/"'
      );
    }
  }

  validateNoDevelopmentEnv(config) {
    const configText = JSON.stringify(config);
    const hasDevelopmentEnv = configText.includes('"NODE_ENV": "development"');

    if (!hasDevelopmentEnv) {
      this.addResult('✅ NODE_ENV Production', true, 'No "NODE_ENV": "development" found');
    } else {
      this.addResult('❌ NODE_ENV Production', false, 'Found "NODE_ENV": "development"');
    }
  }

  validateNoEverythingServer(config) {
    const hasEverythingServer = config.servers && config.servers.everything;

    if (!hasEverythingServer) {
      this.addResult('✅ No Everything Server', true, '"everything" server block absent');
    } else {
      this.addResult('❌ No Everything Server', false, '"everything" server block present');
    }
  }

  validateCorrectPaths(config) {
    let correctPaths = 0;
    let totalCustomServers = 0;

    for (const [name, serverConfig] of Object.entries(config.servers)) {
      if (serverConfig.args && Array.isArray(serverConfig.args)) {
        for (const arg of serverConfig.args) {
          if (typeof arg === 'string' && arg.includes('.ts')) {
            totalCustomServers++;
            // Documentation server is allowed to use mcp/scripts/ path
            if (
              arg.startsWith('mcp/servers/src/') ||
              (name === 'documentation' && arg.startsWith('mcp/scripts/'))
            ) {
              correctPaths++;
            }
          }
        }
      }
    }

    if (correctPaths === totalCustomServers && totalCustomServers > 0) {
      this.addResult(
        '✅ Correct Server Paths',
        true,
        `All ${totalCustomServers} custom servers use correct paths`
      );
    } else {
      this.addResult(
        '❌ Correct Server Paths',
        false,
        `${correctPaths}/${totalCustomServers} servers use correct paths`
      );
    }
  }

  validateSkillsPath(config) {
    const skillsetServer = config.servers && config.servers.skillset;
    const hasCorrectSkillsPath =
      skillsetServer && skillsetServer.env && skillsetServer.env.SKILLS_PATH === 'skills';

    if (hasCorrectSkillsPath) {
      this.addResult('✅ SKILLS_PATH Correct', true, 'SKILLS_PATH is set to "skills"');
    } else {
      this.addResult('❌ SKILLS_PATH Correct', false, 'SKILLS_PATH is not set to "skills"');
    }
  }

  validateDocumentationPath(config) {
    const documentationServer = config.servers && config.servers.documentation;
    const hasCorrectDocPath =
      documentationServer &&
      documentationServer.args &&
      documentationServer.args.includes('mcp/scripts/documentation-server.ts');

    if (hasCorrectDocPath) {
      this.addResult(
        '✅ Documentation Path Correct',
        true,
        'documentation-server.ts uses mcp/scripts/ path'
      );
    } else {
      this.addResult(
        '❌ Documentation Path Correct',
        false,
        'documentation-server.ts path incorrect'
      );
    }
  }

  addResult(check, success, message) {
    this.validationResults.push({ check, success, message });
    console.log(`${success ? '✅' : '❌'} ${message}`);
  }

  printResults() {
    console.log('\n📊 Task 1.1 Validation Results');
    console.log('================================');

    const passed = this.validationResults.filter((r) => r.success).length;
    const total = this.validationResults.length;

    console.log(`\nSummary: ${passed}/${total} requirements met`);

    if (passed === total) {
      console.log('\n🎉 Task 1.1 COMPLETE - All requirements satisfied!');
    } else {
      console.log('\n⚠️  Task 1.1 INCOMPLETE - Some requirements not met');
    }
  }

  isTask1_1Complete() {
    return this.validationResults.every((r) => r.success);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new Task1_1Validator();
  const isComplete = validator.validateTask1_1();
  process.exit(isComplete ? 0 : 1);
}

module.exports = Task1_1Validator;
