#!/usr/bin/env node

/**
 * @file scripts/setup-mcp-development.js
 * @summary Sets up MCP configuration for development workflow.
 * @description Configures MCP servers for development with relaxed security and enhanced debugging.
 * @security Development configuration with relaxed restrictions for local development.
 * @adr none
 * @requirements MCP-004, DEVELOPMENT-SETUP
 */

/**
 * MCP Development Setup Script
 * Configures MCP servers for development workflow
 */

const fs = require('fs');
const path = require('path');

class MCPDevelopmentSetup {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.mcpDir = path.join(this.rootDir, '.mcp');
    this.configPath = path.join(this.mcpDir, 'config.json');
    this.devConfigPath = path.join(this.mcpDir, 'config.development.json');
    this.envPath = path.join(this.mcpDir, '.env.development');
  }

  async setupDevelopment() {
    console.log('🔧 Setting up MCP for Development Workflow\n');

    try {
      await this.backupCurrentConfig();
      await this.switchToDevelopmentConfig();
      await this.setupDevelopmentEnvironment();
      await this.validateDevelopmentSetup();
      
      console.log('\n✅ MCP Development Setup Complete!');
      console.log('\n📋 Development Features Enabled:');
      console.log('• Read-write file access');
      console.log('• Git push enabled');
      console.log('• Debug logging');
      console.log('• Volatile memory (1-hour retention)');
      console.log('• Development tools enabled');
      
      console.log('\n🚀 Quick Start:');
      console.log('1. Restart your AI assistant (Cursor/Windsurf/Claude)');
      console.log('2. Test with: node scripts/test-mcp-integration.js');
      console.log('3. Test AI integration: node scripts/test-mcp-ai-integration.js');
      
    } catch (error) {
      console.error('❌ Development setup failed:', error);
      process.exit(1);
    }
  }

  async backupCurrentConfig() {
    console.log('📦 Backing up current configuration...');
    
    if (fs.existsSync(this.configPath)) {
      const backupPath = path.join(this.mcpDir, 'config.production.backup.json');
      fs.copyFileSync(this.configPath, backupPath);
      console.log('  ✅ Production configuration backed up');
    }
  }

  async switchToDevelopmentConfig() {
    console.log('🔄 Switching to development configuration...');
    
    if (!fs.existsSync(this.devConfigPath)) {
      throw new Error('Development configuration file not found');
    }
    
    // Copy development config to main config
    fs.copyFileSync(this.devConfigPath, this.configPath);
    console.log('  ✅ Development configuration activated');
  }

  async setupDevelopmentEnvironment() {
    console.log('🌍 Setting up development environment...');
    
    // Create development memory file
    const memoryPath = path.join(this.mcpDir, 'memory-dev.json');
    if (!fs.existsSync(memoryPath)) {
      fs.writeFileSync(memoryPath, JSON.stringify({
        version: "1.0.0",
        created: new Date().toISOString(),
        mode: "development",
        retention: "1h"
      }, null, 2));
      console.log('  ✅ Development memory file created');
    }
    
    // Set up development log directory
    const logDir = path.join(this.mcpDir, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
      console.log('  ✅ Development log directory created');
    }
  }

  async validateDevelopmentSetup() {
    console.log('✅ Validating development setup...');
    
    // Check configuration exists and is valid
    if (!fs.existsSync(this.configPath)) {
      throw new Error('Configuration file not found');
    }
    
    const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    
    // Validate development-specific settings
    const filesystemConfig = config.servers.filesystem;
    if (filesystemConfig.env.READ_ONLY_BY_DEFAULT !== 'false') {
      throw new Error('Development config not properly activated');
    }
    
    const gitConfig = config.servers.git;
    if (gitConfig.env.ALLOW_PUSH !== 'true') {
      throw new Error('Git push not enabled for development');
    }
    
    console.log('  ✅ Development configuration validated');
  }

  async resetToProduction() {
    console.log('🔄 Resetting to production configuration...');
    
    const backupPath = path.join(this.mcpDir, 'config.production.backup.json');
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, this.configPath);
      console.log('  ✅ Production configuration restored');
    } else {
      console.log('  ⚠️  No production backup found, keeping current config');
    }
  }
}

// Command line interface
if (require.main === module) {
  const setup = new MCPDevelopmentSetup();
  const command = process.argv[2];
  
  switch (command) {
    case 'dev':
    case 'development':
      setup.setupDevelopment().catch(console.error);
      break;
      
    case 'prod':
    case 'production':
      setup.resetToProduction().catch(console.error);
      break;
      
    default:
      console.log('Usage:');
      console.log('  node scripts/setup-mcp-development.js dev     # Setup for development');
      console.log('  node scripts/setup-mcp-development.js prod    # Reset to production');
      process.exit(1);
  }
}

module.exports = MCPDevelopmentSetup;
