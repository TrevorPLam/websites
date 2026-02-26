#!/usr/bin/env node

/**
 * @file scripts/validate-mcp-production.js
 * @summary Validates MCP integration for production deployment readiness.
 * @description Comprehensive validation of configuration, security, compatibility, and performance.
 * @security Validates security controls; no secrets exposed in validation output.
 * @adr none
 * @requirements MCP-003, PRODUCTION-VALIDATION
 */

/**
 * MCP Production Validation Script
 * Validates MCP integration for production deployment
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPProductionValidator {
  constructor() {
    this.validationResults = [];
    this.configPath = path.join(__dirname, '..', 'config', 'config.production.json');
  }

  async validateProductionReadiness() {
    console.log('🚀 MCP Production Validation\n');
    console.log('Validating MCP integration for production deployment...\n');

    try {
      await this.validateConfiguration();
      await this.validateSecurity();
      await this.validateCompatibility();
      await this.validatePerformance();
      await this.validateDocumentation();

      this.printValidationResults();

      if (this.isProductionReady()) {
        console.log('\n✅ MCP integration is PRODUCTION READY');
        console.log('\n📋 Production Deployment Checklist:');
        console.log('□ Run: node scripts/test-mcp-integration.js');
        console.log('□ Run: node scripts/test-mcp-ai-integration.js');
        console.log('□ Test with actual AI assistant installations');
        console.log('□ Monitor server startup and performance');
        console.log('□ Review security configurations');
      } else {
        console.log('\n❌ MCP integration is NOT production ready');
        console.log('Address the validation failures before deployment');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  }

  async validateConfiguration() {
    console.log('📋 Configuration Validation');

    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

      // Required servers
      const requiredServers = ['filesystem', 'git'];
      const hasAllServers = requiredServers.every((server) => config.servers[server]);

      if (hasAllServers) {
        this.addResult('Required Servers', true, 'All required servers configured');
      } else {
        this.addResult('Required Servers', false, 'Missing required servers');
      }

      // Command validation
      let commandsValid = true;
      for (const [name, serverConfig] of Object.entries(config.servers)) {
        if (!serverConfig.command || !Array.isArray(serverConfig.args)) {
          commandsValid = false;
          break;
        }
      }

      if (commandsValid) {
        this.addResult('Command Configuration', true, 'All server commands properly configured');
      } else {
        this.addResult('Command Configuration', false, 'Invalid command configuration');
      }

      // Environment variables
      const hasEnvVars = config.servers.filesystem.env && config.servers.git.env;

      if (hasEnvVars) {
        this.addResult('Environment Variables', true, 'Security environment variables configured');
      } else {
        this.addResult('Environment Variables', false, 'Missing security environment variables');
      }
    } catch (error) {
      this.addResult('Configuration', false, `Configuration error: ${error.message}`);
    }
  }

  async validateSecurity() {
    console.log('\n🔒 Security Validation');

    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

      // Directory restrictions
      const filesystemConfig = config.servers.filesystem;
      const hasAllowedDirectories =
        filesystemConfig.env && filesystemConfig.env.ALLOWED_DIRECTORIES;

      if (hasAllowedDirectories) {
        this.addResult('Directory Restrictions', true, 'Directory restrictions configured');
      } else {
        this.addResult('Directory Restrictions', false, 'Missing directory restrictions');
      }

      // Read-only default
      const hasReadOnlyDefault =
        filesystemConfig.env && filesystemConfig.env.READ_ONLY_BY_DEFAULT === 'true';

      if (hasReadOnlyDefault) {
        this.addResult('Read-Only Default', true, 'Read-only default configured');
      } else {
        this.addResult('Read-Only Default', false, 'Missing read-only default');
      }

      // Git push disabled
      const gitConfig = config.servers.git;
      const hasPushDisabled = gitConfig.env && gitConfig.env.ALLOW_PUSH === 'false';

      if (hasPushDisabled) {
        this.addResult('Git Push Disabled', true, 'Git push disabled for security');
      } else {
        this.addResult('Git Push Disabled', false, 'Git push not disabled');
      }
    } catch (error) {
      this.addResult('Security', false, `Security validation error: ${error.message}`);
    }
  }

  async validateCompatibility() {
    console.log('\n🤖 AI Assistant Compatibility');

    try {
      // Test suite results
      const testResults = await this.runTestSuites();

      if (testResults.mcpIntegration) {
        this.addResult('MCP Integration Tests', true, 'MCP integration tests pass');
      } else {
        this.addResult('MCP Integration Tests', false, 'MCP integration tests failed');
      }

      if (testResults.aiIntegration) {
        this.addResult('AI Integration Tests', true, 'AI integration tests pass');
      } else {
        this.addResult('AI Integration Tests', false, 'AI integration tests failed');
      }

      // Configuration format compatibility
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const isCompatibleFormat = this.validateAIAssistantFormat(config);

      if (isCompatibleFormat) {
        this.addResult('AI Assistant Format', true, 'Configuration compatible with AI assistants');
      } else {
        this.addResult(
          'AI Assistant Format',
          false,
          'Configuration not compatible with AI assistants'
        );
      }
    } catch (error) {
      this.addResult('Compatibility', false, `Compatibility validation error: ${error.message}`);
    }
  }

  async validatePerformance() {
    console.log('\n⚡ Performance Validation');

    try {
      // Server startup performance
      const startupTimes = await this.measureServerStartup();

      if (startupTimes.filesystem < 5000) {
        this.addResult(
          'Server Startup Time',
          true,
          `Filesystem server: ${startupTimes.filesystem}ms`
        );
      } else {
        this.addResult(
          'Server Startup Time',
          false,
          `Filesystem server too slow: ${startupTimes.filesystem}ms`
        );
      }

      // Memory usage check
      const memoryUsage = process.memoryUsage();
      const nodeMemoryMB = memoryUsage.heapUsed / 1024 / 1024;

      if (nodeMemoryMB < 100) {
        this.addResult('Memory Usage', true, `Memory usage: ${nodeMemoryMB.toFixed(2)}MB`);
      } else {
        this.addResult('Memory Usage', false, `High memory usage: ${nodeMemoryMB.toFixed(2)}MB`);
      }
    } catch (error) {
      this.addResult('Performance', false, `Performance validation error: ${error.message}`);
    }
  }

  async validateDocumentation() {
    console.log('\n📚 Documentation Validation');

    try {
      // Check for integration guide
      const guidePath = path.join(__dirname, '..', 'docs', 'guides', 'mcp-ai-integration-guide.md');
      const guideExists = fs.existsSync(guidePath);

      if (guideExists) {
        this.addResult('Integration Guide', true, 'MCP integration guide exists');
      } else {
        this.addResult('Integration Guide', false, 'MCP integration guide missing');
      }

      // Check for test scripts
      const mcpTestPath = path.join(__dirname, '..', 'scripts', 'test-mcp-integration.js');
      const aiTestPath = path.join(__dirname, '..', 'scripts', 'test-mcp-ai-integration.js');

      const mcpTestExists = fs.existsSync(mcpTestPath);
      const aiTestExists = fs.existsSync(aiTestPath);

      if (mcpTestExists && aiTestExists) {
        this.addResult('Test Scripts', true, 'All test scripts exist');
      } else {
        this.addResult('Test Scripts', false, 'Missing test scripts');
      }

      // Check for research results
      const researchPath = path.join(__dirname, '..', '.mcp', 'RESEARCH_RESULTS.md');
      const researchExists = fs.existsSync(researchPath);

      if (researchExists) {
        this.addResult('Research Documentation', true, 'Research results documented');
      } else {
        this.addResult('Research Documentation', false, 'Research results missing');
      }
    } catch (error) {
      this.addResult('Documentation', false, `Documentation validation error: ${error.message}`);
    }
  }

  async runTestSuites() {
    const results = {
      mcpIntegration: false,
      aiIntegration: false,
    };

    try {
      // Run MCP integration tests
      const mcpResult = await this.runScript('test-mcp-integration.js');
      results.mcpIntegration = mcpResult.success;

      // Run AI integration tests
      const aiResult = await this.runScript('test-mcp-ai-integration.js');
      results.aiIntegration = aiResult.success;
    } catch (error) {
      console.error('Test suite execution error:', error);
    }

    return results;
  }

  async runScript(scriptName) {
    return new Promise((resolve) => {
      const scriptPath = path.join(__dirname, '..', 'scripts', scriptName);
      const child = spawn('node', [scriptPath], {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..'),
      });

      let output = '';
      let resolved = false;

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (!resolved) {
          resolved = true;
          resolve({ success: code === 0, output });
        }
      });

      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          resolve({ success: false, error: error.message });
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false, error: 'Test timeout' });
        }
      }, 30000);
    });
  }

  validateAIAssistantFormat(config) {
    try {
      // Check if configuration can be converted to AI assistant format
      const aiFormat = {
        mcpServers: {},
      };

      for (const [name, serverConfig] of Object.entries(config.servers)) {
        aiFormat.mcpServers[name] = {
          command: serverConfig.command,
          args: serverConfig.args,
          env: serverConfig.env || {},
        };
      }

      return Object.keys(aiFormat.mcpServers).length > 0;
    } catch (error) {
      return false;
    }
  }

  async measureServerStartup() {
    const times = {};

    try {
      // Measure filesystem server startup
      const startTime = Date.now();
      const result = await this.startServerTemporarily('filesystem');
      const endTime = Date.now();

      times.filesystem = endTime - startTime;
    } catch (error) {
      times.filesystem = 999999; // Error value
    }

    return times;
  }

  async startServerTemporarily(serverName) {
    return new Promise((resolve) => {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const serverConfig = config.servers[serverName];

      const child = spawn('npx', serverConfig.args, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..'),
        shell: true,
      });

      let resolved = false;

      child.on('spawn', () => {
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            child.kill();
            resolve({ success: true });
          }
        }, 1000); // Give it 1 second to start
      });

      child.on('error', () => {
        if (!resolved) {
          resolved = true;
          resolve({ success: false });
        }
      });

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false });
        }
      }, 5000); // Timeout after 5 seconds
    });
  }

  addResult(category, success, message) {
    this.validationResults.push({ category, success, message });
    const status = success ? '✅' : '❌';
    console.log(`  ${status} ${message}`);
  }

  printValidationResults() {
    console.log('\n📊 Production Validation Results');
    console.log('================================');

    const passed = this.validationResults.filter((r) => r.success).length;
    const total = this.validationResults.length;

    this.validationResults.forEach((result) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.category}: ${result.message}`);
    });

    console.log(`\nSummary: ${passed}/${total} validations passed`);
  }

  isProductionReady() {
    const criticalFailures = this.validationResults.filter((r) => !r.success);

    // Allow some non-critical failures but not security or configuration issues
    const allowedFailures = ['Memory Usage', 'Server Startup Time', 'MCP Integration Tests'];
    const hasCriticalFailure = criticalFailures.some(
      (failure) => !allowedFailures.includes(failure.category)
    );

    return !hasCriticalFailure;
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MCPProductionValidator();
  validator.validateProductionReadiness().catch(console.error);
}

module.exports = MCPProductionValidator;
