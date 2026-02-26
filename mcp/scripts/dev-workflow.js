#!/usr/bin/env node

/**
 * @file scripts/mcp-dev-workflow.js
 * @summary MCP development workflow automation script.
 * @description Provides common development workflow operations for MCP integration.
 * @security Development automation with proper validation and safety checks.
 * @adr none
 * @requirements MCP-005, DEVELOPMENT-WORKFLOW
 */

/**
 * MCP Development Workflow Script
 * Automates common MCP development tasks
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPDevWorkflow {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.mcpDir = path.join(this.rootDir, 'config');
  }

  async runWorkflow() {
    const command = process.argv[2];

    switch (command) {
      case 'test':
        await this.runTests();
        break;
      case 'validate':
        await this.validateSetup();
        break;
      case 'status':
        await this.showStatus();
        break;
      case 'clean':
        await this.cleanDevelopment();
        break;
      case 'start':
        await this.startDevelopment();
        break;
      default:
        this.showUsage();
    }
  }

  async runTests() {
    console.log('🧪 Running MCP Development Tests\n');

    try {
      // Run MCP integration tests
      console.log('1. Testing MCP server integration...');
      await this.runScript('test-integration.js');

      // Run AI assistant tests
      console.log('\n2. Testing AI assistant integration...');
      await this.runScript('test-ai-integration.js');

      // Run production validation
      console.log('\n3. Validating production readiness...');
      await this.runScript('validate-production.js');

      console.log('\n✅ All tests completed successfully!');
    } catch (error) {
      console.error('\n❌ Test workflow failed:', error.message);
      process.exit(1);
    }
  }

  async validateSetup() {
    console.log('✅ Validating MCP Development Setup\n');

    try {
      // Check configuration
      const configPath = path.join(this.mcpDir, 'config.json');
      if (!fs.existsSync(configPath)) {
        throw new Error('MCP configuration not found');
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('✅ Configuration file exists and is valid');

      // Check required servers
      const requiredServers = ['filesystem', 'git', 'everything'];
      const missingServers = requiredServers.filter((server) => !config.servers[server]);

      if (missingServers.length > 0) {
        throw new Error(`Missing servers: ${missingServers.join(', ')}`);
      }

      console.log('✅ All required servers configured');

      // Check environment files
      const envFiles = ['.env.development', '.env.production'];
      for (const envFile of envFiles) {
        const envPath = path.join(this.mcpDir, envFile);
        if (fs.existsSync(envPath)) {
          console.log(`✅ ${envFile} exists`);
        }
      }

      // Check test scripts
      const testScripts = [
        'test-integration.js',
        'test-ai-integration.js',
        'validate-production.js',
      ];

      for (const script of testScripts) {
        const scriptPath = path.join(this.rootDir, 'scripts', script);
        if (fs.existsSync(scriptPath)) {
          console.log(`✅ ${script} exists`);
        } else {
          throw new Error(`Missing script: ${script}`);
        }
      }

      console.log('\n✅ MCP development setup is valid!');
    } catch (error) {
      console.error('\n❌ Validation failed:', error.message);
      process.exit(1);
    }
  }

  async showStatus() {
    console.log('📊 MCP Development Status\n');

    try {
      // Show current configuration
      const configPath = path.join(this.mcpDir, 'config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        console.log('Current Configuration:');
        Object.keys(config.servers).forEach((serverName) => {
          const server = config.servers[serverName];
          console.log(`  ${serverName}: ${server.command} ${server.args.join(' ')}`);
        });
      }

      // Show environment
      const envPath = path.join(this.mcpDir, '.env.development');
      if (fs.existsSync(envPath)) {
        console.log('\nDevelopment Environment:');
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach((line) => {
          if (line.trim() && !line.startsWith('#')) {
            console.log(`  ${line}`);
          }
        });
      }

      // Show memory status
      const memoryPath = path.join(this.mcpDir, 'memory-dev.json');
      if (fs.existsSync(memoryPath)) {
        const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
        console.log('\nMemory Status:');
        console.log(`  Mode: ${memory.mode}`);
        console.log(`  Retention: ${memory.retention}`);
        console.log(`  Created: ${memory.created}`);
      }
    } catch (error) {
      console.error('❌ Status check failed:', error.message);
    }
  }

  async cleanDevelopment() {
    console.log('🧹 Cleaning MCP Development Environment\n');

    try {
      // Clean development memory
      const memoryPath = path.join(this.mcpDir, 'memory-dev.json');
      if (fs.existsSync(memoryPath)) {
        fs.unlinkSync(memoryPath);
        console.log('✅ Development memory cleared');
      }

      // Clean logs
      const logDir = path.join(this.mcpDir, 'logs');
      if (fs.existsSync(logDir)) {
        const files = fs.readdirSync(logDir);
        files.forEach((file) => {
          const filePath = path.join(logDir, file);
          fs.unlinkSync(filePath);
        });
        console.log('✅ Development logs cleared');
      }

      // Clean temporary files created during MCP operations
      // Rationale: Windows Command Prompt lacks native glob expansion, so we must manually iterate directory contents
      // Follow-up: Remove all .tmp files to prevent disk space accumulation and potential conflicts
      const files = fs.readdirSync(this.mcpDir);
      files.forEach((file) => {
        if (file.endsWith('.tmp')) {
          fs.unlinkSync(path.join(this.mcpDir, file));
          console.log(`✅ Removed temporary file: ${file}`);
        }
      });

      console.log('\n✅ Development environment cleaned!');
    } catch (error) {
      console.error('❌ Clean failed:', error.message);
    }
  }

  async startDevelopment() {
    console.log('🚀 Starting MCP Development Workflow\n');

    try {
      // Setup development environment
      const setupScript = path.join(this.rootDir, 'scripts', 'setup-development.js');
      await this.runCommand('node', [setupScript, 'dev']);

      // Validate setup
      await this.validateSetup();

      // Run tests
      await this.runTests();

      console.log('\n🎉 MCP development workflow started successfully!');
      console.log('\nNext steps:');
      console.log('1. Restart your AI assistant');
      console.log('2. Start development with enhanced MCP capabilities');
      console.log('3. Use "node scripts/mcp-dev-workflow.js status" to check status');
    } catch (error) {
      console.error('\n❌ Development workflow failed:', error.message);
      process.exit(1);
    }
  }

  async runScript(scriptName) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.rootDir, 'scripts', scriptName);
      const child = spawn('node', [scriptPath], {
        stdio: 'inherit',
        cwd: this.rootDir,
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Script ${scriptName} failed with exit code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }

  async runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        cwd: this.rootDir,
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }

  showUsage() {
    console.log('MCP Development Workflow Script');
    console.log('================================');
    console.log('');
    console.log('Usage: node scripts/mcp-dev-workflow.js <command>');
    console.log('');
    console.log('Commands:');
    console.log('  start     Start complete development workflow');
    console.log('  test      Run all MCP tests');
    console.log('  validate  Validate development setup');
    console.log('  status   Show current status');
    console.log('  clean     Clean development environment');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/mcp-dev-workflow.js start');
    console.log('  node scripts/mcp-dev-workflow.js test');
    console.log('  node scripts/mcp-dev-workflow.js status');
  }
}

// Run if called directly
if (require.main === module) {
  const workflow = new MCPDevWorkflow();
  workflow.runWorkflow().catch(console.error);
}

module.exports = MCPDevWorkflow;
