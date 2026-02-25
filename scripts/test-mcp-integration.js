#!/usr/bin/env node

/**
 * @file scripts/test-mcp-integration.js
 * @summary Tests Model Context Protocol server functionality and JSON-RPC communication.
 * @description Validates MCP server startup, configuration, and basic communication protocols.
 * @security Directory restrictions enforced; no secrets exposed in test output.
 * @adr none
 * @requirements MCP-001, AI-ASSISTANT-TESTING
 */

/**
 * MCP Integration Test Suite
 * Tests Model Context Protocol server functionality and AI assistant integration
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPTester {
  constructor() {
    this.testResults = [];
    this.configPath = path.join(__dirname, '..', '.mcp', 'config.json');
  }

  async runAllTests() {
    console.log('🧪 Starting MCP Integration Test Suite\n');

    try {
      await this.testConfigFile();
      await this.testFilesystemServer();
      await this.testGitServer();
      await this.testEverythingServer();
      await this.testJSONRPCCommunication();

      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }

  async testConfigFile() {
    console.log('📋 Testing MCP Configuration...');

    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

      // Validate structure
      if (!config.servers) {
        throw new Error('Missing servers configuration');
      }

      const requiredServers = ['filesystem', 'git', 'everything'];
      for (const server of requiredServers) {
        if (!config.servers[server]) {
          throw new Error(`Missing ${server} server configuration`);
        }

        const serverConfig = config.servers[server];
        if (!serverConfig.command || !Array.isArray(serverConfig.args)) {
          throw new Error(`Invalid ${server} server configuration`);
        }
      }

      this.addResult('Config File', true, 'All server configurations valid');
    } catch (error) {
      this.addResult('Config File', false, error.message);
    }
  }

  async testFilesystemServer() {
    console.log('📁 Testing Filesystem Server...');

    try {
      const result = await this.runMCPServer('filesystem', 5000);

      if (result.success) {
        this.addResult('Filesystem Server', true, 'Server starts successfully');
      } else {
        this.addResult('Filesystem Server', false, result.error);
      }
    } catch (error) {
      this.addResult('Filesystem Server', false, error.message);
    }
  }

  async testGitServer() {
    console.log('🔀 Testing Git Server...');

    try {
      const result = await this.runMCPServer('git', 5000);

      if (result.success) {
        this.addResult('Git Server', true, 'Server starts successfully');
      } else {
        this.addResult('Git Server', false, result.error);
      }
    } catch (error) {
      this.addResult('Git Server', false, error.message);
    }
  }

  async testEverythingServer() {
    console.log('🌐 Testing Everything Server...');

    try {
      const result = await this.runMCPServer('everything', 5000);

      if (result.success) {
        this.addResult('Everything Server', true, 'Server starts successfully');
      } else {
        this.addResult('Everything Server', false, result.error);
      }
    } catch (error) {
      this.addResult('Everything Server', false, error.message);
    }
  }

  async testJSONRPCCommunication() {
    console.log('🔌 Testing JSON-RPC Communication...');

    try {
      // Test basic JSON-RPC message format
      const testMessage = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: {
            name: "test-client",
            version: "1.0.0"
          }
        }
      };

      const result = await this.sendJSONRPCMessage('filesystem', testMessage);

      if (result.success) {
        this.addResult('JSON-RPC Communication', true, 'JSON-RPC protocol working');
      } else {
        this.addResult('JSON-RPC Communication', false, result.error);
      }
    } catch (error) {
      this.addResult('JSON-RPC Communication', false, error.message);
    }
  }

  async runMCPServer(serverName, timeout = 5000) {
    return new Promise((resolve) => {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const serverConfig = config.servers[serverName];

      const child = spawn('npx', serverConfig.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.join(__dirname, '..'),
        shell: true
      });

      let output = '';
      let errorOutput = '';
      let resolved = false;

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false, error: error.message });
        }
      });

      child.on('spawn', () => {
        // Server started successfully
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            child.kill();
            resolve({ success: true, output: output });
          }
        }, 1000); // Give it 1 second to initialize
      });

      // Timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false, error: 'Server startup timeout' });
        }
      }, timeout);
    });
  }

  async sendJSONRPCMessage(serverName, message) {
    return new Promise((resolve) => {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const serverConfig = config.servers[serverName];

      const child = spawn('npx', serverConfig.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.join(__dirname, '..'),
        shell: true
      });

      let resolved = false;

      child.stdout.on('data', (data) => {
        const response = data.toString();
        try {
          const parsed = JSON.parse(response);
          if (parsed.jsonrpc === "2.0") {
            if (!resolved) {
              resolved = true;
              child.kill();
              resolve({ success: true, response: parsed });
            }
          }
        } catch (e) {
          // Not JSON yet, keep waiting
        }
      });

      child.stderr.on('data', (data) => {
        // Ignore stderr for now
      });

      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false, error: error.message });
        }
      });

      // Send the message after server starts
      setTimeout(() => {
        if (!resolved && child.stdin) {
          child.stdin.write(JSON.stringify(message) + '\n');
        }
      }, 500);

      // Timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false, error: 'JSON-RPC communication timeout' });
        }
      }, 3000);
    });
  }

  addResult(testName, success, message) {
    this.testResults.push({ testName, success, message });
    const status = success ? '✅' : '❌';
    console.log(`  ${status} ${testName}: ${message}`);
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');

    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;

    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.testName}: ${result.message}`);
    });

    console.log(`\nSummary: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log('🎉 All MCP integration tests passed!');
    } else {
      console.log('⚠️  Some tests failed. Check the configuration and setup.');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MCPTester();
  tester.runAllTests().catch(console.error);
}

module.exports = MCPTester;
