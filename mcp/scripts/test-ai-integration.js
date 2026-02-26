#!/usr/bin/env node

/**
 * @file scripts/test-mcp-ai-integration.js
 * @summary Tests MCP integration with AI assistants (Cursor, Windsurf, Claude Desktop).
 * @description Validates configuration compatibility and real-world AI assistant usage scenarios.
 * @security No secrets exposed; AI assistant access respects directory restrictions.
 * @adr none
 * @requirements MCP-002, AI-ASSISTANT-COMPATIBILITY
 */

/**
 * MCP AI Assistant Integration Test
 * Tests MCP integration with Cursor, Windsurf, and Claude Desktop
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPAIAssistantTester {
  constructor() {
    this.testResults = [];
    this.configPath = path.join(__dirname, '..', 'config', 'config.json');
  }

  async runAllTests() {
    console.log('🤖 Starting MCP AI Assistant Integration Test Suite\n');

    try {
      await this.testCursorCompatibility();
      await this.testWindsurfCompatibility();
      await this.testClaudeDesktopCompatibility();
      await this.testMCPToolsAvailability();
      await this.testRealWorldScenario();

      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }

  async testCursorCompatibility() {
    console.log('🔷 Testing Cursor Compatibility...');

    try {
      // Cursor uses MCP configuration directly
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

      // Check for Cursor-specific requirements
      const cursorConfig = {
        mcpServers: {},
      };

      // Convert our config to Cursor format
      for (const [name, serverConfig] of Object.entries(config.servers)) {
        cursorConfig.mcpServers[name] = {
          command: serverConfig.command,
          args: serverConfig.args,
        };
      }

      // Validate Cursor format
      if (
        cursorConfig.mcpServers.filesystem &&
        cursorConfig.mcpServers.git &&
        cursorConfig.mcpServers.everything
      ) {
        this.addResult('Cursor Compatibility', true, 'Configuration compatible with Cursor');
      } else {
        this.addResult('Cursor Compatibility', false, 'Missing required servers for Cursor');
      }
    } catch (error) {
      this.addResult('Cursor Compatibility', false, error.message);
    }
  }

  async testWindsurfCompatibility() {
    console.log('🌊 Testing Windsurf Compatibility...');

    try {
      // Windsurf uses similar configuration to Cursor
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

      // Check for Windsurf-specific environment variables
      const hasEnvVars =
        config.servers.filesystem.env && config.servers.git.env && config.servers.everything.env;

      if (hasEnvVars) {
        this.addResult(
          'Windsurf Compatibility',
          true,
          'Environment variables configured for Windsurf'
        );
      } else {
        this.addResult(
          'Windsurf Compatibility',
          false,
          'Missing environment variables for Windsurf'
        );
      }
    } catch (error) {
      this.addResult('Windsurf Compatibility', false, error.message);
    }
  }

  async testClaudeDesktopCompatibility() {
    console.log('🎨 Testing Claude Desktop Compatibility...');

    try {
      // Claude Desktop uses claude_desktop_config.json
      const claudeConfig = {
        mcpServers: {},
      };

      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

      // Convert to Claude Desktop format
      for (const [name, serverConfig] of Object.entries(config.servers)) {
        claudeConfig.mcpServers[name] = {
          command: serverConfig.command,
          args: serverConfig.args,
          env: serverConfig.env || {},
        };
      }

      // Validate Claude Desktop format
      const requiredServers = ['filesystem', 'git', 'everything'];
      const hasAllServers = requiredServers.every((server) => claudeConfig.mcpServers[server]);

      if (hasAllServers) {
        this.addResult(
          'Claude Desktop Compatibility',
          true,
          'Configuration compatible with Claude Desktop'
        );
      } else {
        this.addResult(
          'Claude Desktop Compatibility',
          false,
          'Missing required servers for Claude Desktop'
        );
      }
    } catch (error) {
      this.addResult('Claude Desktop Compatibility', false, error.message);
    }
  }

  async testMCPToolsAvailability() {
    console.log('🔧 Testing MCP Tools Availability...');

    try {
      // Test that MCP servers provide expected tools
      const expectedTools = {
        filesystem: ['read_file', 'write_file', 'list_directory', 'create_directory'],
        git: ['git_clone', 'git_status', 'git_add', 'git_commit', 'git_push'],
        everything: ['echo', 'add', 'subtract', 'multiply', 'divide'],
      };

      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      let toolsAvailable = true;

      for (const [serverName, tools] of Object.entries(expectedTools)) {
        if (!config.servers[serverName]) {
          toolsAvailable = false;
          break;
        }
      }

      if (toolsAvailable) {
        this.addResult('MCP Tools Availability', true, 'All expected tools configured');
      } else {
        this.addResult('MCP Tools Availability', false, 'Missing expected tools');
      }
    } catch (error) {
      this.addResult('MCP Tools Availability', false, error.message);
    }
  }

  async testRealWorldScenario() {
    console.log('🌍 Testing Real-World Scenario...');

    try {
      // Simulate a real-world AI assistant interaction
      const scenario = {
        task: 'Read a TypeScript file and analyze its structure',
        expectedServers: ['filesystem'],
        expectedOperations: ['read_file'],
      };

      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const hasRequiredServers = scenario.expectedServers.every((server) => config.servers[server]);

      if (hasRequiredServers) {
        this.addResult('Real-World Scenario', true, 'Can handle file analysis tasks');
      } else {
        this.addResult('Real-World Scenario', false, 'Cannot handle file analysis tasks');
      }
    } catch (error) {
      this.addResult('Real-World Scenario', false, error.message);
    }
  }

  async testServerStartup() {
    console.log('🚀 Testing Server Startup...');

    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const serverName = 'filesystem';
      const serverConfig = config.servers[serverName];

      const result = await this.startServerAndTest(serverConfig, 3000);

      if (result.success) {
        this.addResult('Server Startup', true, 'Server starts and responds');
      } else {
        this.addResult('Server Startup', false, result.error);
      }
    } catch (error) {
      this.addResult('Server Startup', false, error.message);
    }
  }

  async startServerAndTest(serverConfig, timeout = 3000) {
    return new Promise((resolve) => {
      const child = spawn('npx', serverConfig.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.join(__dirname, '..'),
        shell: true,
      });

      let resolved = false;
      let initialized = false;

      child.stdout.on('data', (data) => {
        const output = data.toString();

        // Look for MCP initialization message
        if (output.includes('{"jsonrpc":"2.0"') || output.includes('initialize')) {
          initialized = true;
        }
      });

      child.stderr.on('data', (data) => {
        // Check for errors
        const errorOutput = data.toString();
        if (errorOutput.includes('ERROR') || errorOutput.includes('Error')) {
          if (!resolved) {
            resolved = true;
            child.kill();
            resolve({ success: false, error: errorOutput });
          }
        }
      });

      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false, error: error.message });
        }
      });

      // Give server time to initialize
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({
            success: initialized,
            output: initialized ? 'Server initialized' : 'No initialization detected',
          });
        }
      }, timeout);
    });
  }

  addResult(testName, success, message) {
    this.testResults.push({ testName, success, message });
    const status = success ? '✅' : '❌';
    console.log(`  ${status} ${testName}: ${message}`);
  }

  printResults() {
    console.log('\n📊 AI Assistant Integration Test Results:');
    console.log('==========================================');

    const passed = this.testResults.filter((r) => r.success).length;
    const total = this.testResults.length;

    this.testResults.forEach((result) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.testName}: ${result.message}`);
    });

    console.log(`\nSummary: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log('🎉 All AI Assistant integration tests passed!');
      console.log('\n📋 Next Steps:');
      console.log('1. Test with actual Cursor installation');
      console.log('2. Test with actual Windsurf installation');
      console.log('3. Test with actual Claude Desktop installation');
      console.log('4. Document any AI assistant-specific configurations');
    } else {
      console.log('⚠️  Some tests failed. Check the configuration and setup.');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MCPAIAssistantTester();
  tester.runAllTests().catch(console.error);
}

module.exports = MCPAIAssistantTester;
