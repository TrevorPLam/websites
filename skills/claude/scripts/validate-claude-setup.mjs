#!/usr/bin/env node

/**
 * @fileoverview Validate Claude agent setup and configuration
 * @author cascade-ai
 * @created 2026-02-26
 * @package claude-scripts
 * @pattern validation-script
 * @see skills/claude/references/claude-agent-patterns.md
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/**
 * Claude Setup Validation Script
 * 
 * This script validates that the Claude agent environment is properly
 * configured according to 2026 agentic coding standards.
 */
class ClaudeSetupValidator {
  constructor() {
    this.repoRoot = process.cwd();
    this.errors = [];
    this.warnings = [];
    this.successCount = 0;
  }

  /**
   * Run complete validation suite
   */
  async validate() {
    console.log('🔍 Validating Claude Agent Setup...\n');

    this.validateClaudeConfig();
    this.validateMCPConfiguration();
    this.validateMemorySystem();
    this.validateOptimizationSettings();
    this.validateRepositoryStructure();
    this.validateCodeQuality();

    this.printResults();
    
    if (this.errors.length > 0) {
      process.exit(1);
    }
  }

  /**
   * Validate Claude configuration files
   */
  validateClaudeConfig() {
    console.log('📁 Claude Configuration:');

    const configDir = join(this.repoRoot, '.claude');
    const settingsPath = join(configDir, 'settings.json');
    const memoryPath = join(configDir, 'memory.json');
    const optimizationPath = join(configDir, 'optimization.json');

    if (!existsSync(configDir)) {
      this.errors.push('Missing .claude configuration directory');
      return;
    }

    if (existsSync(settingsPath)) {
      try {
        const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
        this.validateSettingsStructure(settings);
        console.log('  ✅ Settings configuration valid');
        this.successCount++;
      } catch (error) {
        this.errors.push(`Invalid settings.json: ${error.message}`);
      }
    } else {
      this.warnings.push('settings.json not found');
    }

    if (existsSync(memoryPath)) {
      try {
        const memory = JSON.parse(readFileSync(memoryPath, 'utf8'));
        this.validateMemoryStructure(memory);
        console.log('  ✅ Memory configuration valid');
        this.successCount++;
      } catch (error) {
        this.errors.push(`Invalid memory.json: ${error.message}`);
      }
    } else {
      this.warnings.push('memory.json not found');
    }

    if (existsSync(optimizationPath)) {
      try {
        const optimization = JSON.parse(readFileSync(optimizationPath, 'utf8'));
        this.validateOptimizationStructure(optimization);
        console.log('  ✅ Optimization configuration valid');
        this.successCount++;
      } catch (error) {
        this.errors.push(`Invalid optimization.json: ${error.message}`);
      }
    } else {
      this.warnings.push('optimization.json not found');
    }
  }

  /**
   * Validate settings structure
   */
  validateSettingsStructure(settings) {
    const required = ['agent', 'preferences', 'mcp', 'memory', 'optimization'];
    const missing = required.filter(key => !settings[key]);
    
    if (missing.length > 0) {
      this.errors.push(`Missing settings sections: ${missing.join(', ')}`);
    }

    if (settings.agent && !settings.agent.role) {
      this.errors.push('Agent role not specified in settings');
    }

    if (settings.mcp && !Array.isArray(settings.mcp.preferred_servers)) {
      this.errors.push('MCP preferred_servers must be an array');
    }
  }

  /**
   * Validate memory structure
   */
  validateMemoryStructure(memory) {
    const required = ['working_memory', 'conversation_memory', 'task_memory', 'long_term_memory'];
    const missing = required.filter(key => !memory[key]);
    
    if (missing.length > 0) {
      this.errors.push(`Missing memory sections: ${missing.join(', ')}`);
    }

    if (!memory.consent || typeof memory.consent.data_collection !== 'boolean') {
      this.warnings.push('Memory consent settings incomplete');
    }
  }

  /**
   * Validate optimization structure
   */
  validateOptimizationStructure(optimization) {
    const required = ['parallel_execution', 'memory_management', 'context_optimization', 'error_handling'];
    const missing = required.filter(key => !optimization[key]);
    
    if (missing.length > 0) {
      this.errors.push(`Missing optimization sections: ${missing.join(', ')}`);
    }
  }

  /**
   * Validate MCP configuration
   */
  validateMCPConfiguration() {
    console.log('\n🔗 MCP Configuration:');

    const mcpConfigPath = join(this.repoRoot, 'mcp', 'config', 'config.json');
    
    if (!existsSync(mcpConfigPath)) {
      this.errors.push('MCP configuration not found');
      return;
    }

    try {
      const mcpConfig = JSON.parse(readFileSync(mcpConfigPath, 'utf8'));
      
      if (!mcpConfig.servers) {
        this.errors.push('MCP servers section missing');
        return;
      }

      const criticalServers = [
        'sequential-thinking',
        'knowledge-graph',
        'github',
        'documentation',
        'filesystem'
      ];

      const availableServers = Object.keys(mcpConfig.servers);
      const missingCritical = criticalServers.filter(server => !availableServers.includes(server));

      if (missingCritical.length > 0) {
        this.warnings.push(`Missing critical MCP servers: ${missingCritical.join(', ')}`);
      }

      console.log(`  ✅ ${availableServers.length} MCP servers configured`);
      this.successCount++;

      // Validate server configurations
      Object.entries(mcpConfig.servers).forEach(([name, config]) => {
        if (!config.command) {
          this.warnings.push(`MCP server ${name} missing command`);
        }
      });

    } catch (error) {
      this.errors.push(`Invalid MCP configuration: ${error.message}`);
    }
  }

  /**
   * Validate memory system setup
   */
  validateMemorySystem() {
    console.log('\n🧠 Memory System:');

    const memoryIndicators = [
      'skills/claude/references/claude-agent-patterns.md',
      'skills/claude/references/mcp-integration-guide.md'
    ];

    memoryIndicators.forEach(file => {
      const filePath = join(this.repoRoot, file);
      if (existsSync(filePath)) {
        console.log(`  ✅ Memory reference: ${file}`);
        this.successCount++;
      } else {
        this.warnings.push(`Memory reference missing: ${file}`);
      }
    });
  }

  /**
   * Validate optimization settings
   */
  validateOptimizationSettings() {
    console.log('\n⚡ Optimization Settings:');

    const optimizationIndicators = [
      'parallel_tool_calls: true',
      'context_caching: true',
      'batch_operations: true'
    ];

    const settingsPath = join(this.repoRoot, '.claude', 'settings.json');
    if (existsSync(settingsPath)) {
      try {
        const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
        
        if (settings.optimization?.parallel_tool_calls) {
          console.log('  ✅ Parallel tool calls enabled');
          this.successCount++;
        } else {
          this.warnings.push('Parallel tool calls not enabled');
        }

        if (settings.mcp?.parallel_execution) {
          console.log('  ✅ MCP parallel execution enabled');
          this.successCount++;
        } else {
          this.warnings.push('MCP parallel execution not enabled');
        }

      } catch (error) {
        this.warnings.push('Could not validate optimization settings');
      }
    } else {
      this.warnings.push('Settings file not found for optimization validation');
    }
  }

  /**
   * Validate repository structure
   */
  validateRepositoryStructure() {
    console.log('\n📂 Repository Structure:');

    const requiredDirs = [
      'skills/claude',
      'skills/claude/references',
      'skills/claude/scripts',
      'mcp/config',
      'docs/guides'
    ];

    requiredDirs.forEach(dir => {
      const dirPath = join(this.repoRoot, dir);
      if (existsSync(dirPath)) {
        console.log(`  ✅ Directory exists: ${dir}`);
        this.successCount++;
      } else {
        this.errors.push(`Required directory missing: ${dir}`);
      }
    });
  }

  /**
   * Validate code quality setup
   */
  validateCodeQuality() {
    console.log('\n🔍 Code Quality:');

    const qualityFiles = [
      'package.json',
      'tsconfig.json',
      '.eslintrc.json',
      '.prettierrc'
    ];

    qualityFiles.forEach(file => {
      const filePath = join(this.repoRoot, file);
      if (existsSync(filePath)) {
        console.log(`  ✅ Quality config: ${file}`);
        this.successCount++;
      } else {
        this.warnings.push(`Quality config missing: ${file}`);
      }
    });
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(50));

    console.log(`✅ Successful checks: ${this.successCount}`);
    console.log(`⚠️ Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);

    if (this.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => console.log(`  - ${error}`));
      console.log('\n💡 Fix errors before proceeding with Claude agent tasks.');
    } else {
      console.log('\n🎉 Claude agent setup is properly configured!');
      console.log('🚀 Ready for agentic coding tasks.');
    }
  }
}

/**
 * Execute validation if run directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ClaudeSetupValidator();
  validator.validate().catch(console.error);
}

export default ClaudeSetupValidator;
