#!/usr/bin/env node

/**
 * @file skills/claude/scripts/setup-claude-environment.mjs
 * @summary Initialize Claude agent environment with optimal configuration files and MCP integration patterns.
 * @description Creates .claude configuration directory with settings, memory, and optimization files.
 * @security No secrets stored; environment variables only; validates MCP server configurations.
 * @adr none
 * @requirements TASKS3-S-06, 2026-agentic-coding-standards
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Claude Environment Setup Script
 *
 * This script configures the optimal environment for Claude agents
 * following 2026 agentic coding standards and MCP integration patterns.
 */
class ClaudeEnvironmentSetup {
  constructor() {
    this.repoRoot = process.cwd();
    this.configPath = join(this.repoRoot, '.claude');
    this.settingsPath = join(this.configPath, 'settings.json');
    this.memoryPath = join(this.configPath, 'memory.json');
  }

  /**
   * Initialize Claude environment configuration
   */
  async initialize() {
    console.log('🤖 Initializing Claude Agent Environment...');

    try {
      this.ensureConfigDirectory();
      this.setupSettings();
      this.setupMemory();
      this.validateMCPConfiguration();
      this.setupOptimizationPatterns();

      console.log('✅ Claude environment setup complete!');
      console.log('📁 Configuration files created in:', this.configPath);
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Ensure .claude configuration directory exists
   */
  ensureConfigDirectory() {
    if (!existsSync(this.configPath)) {
      mkdirSync(this.configPath, { recursive: true });
      console.log('📁 Created .claude configuration directory');
    }
  }

  /**
   * Setup Claude settings with optimal configuration
   */
  setupSettings() {
    const settings = {
      version: '1.0.0',
      agent: {
        name: 'claude-senior-typescript-engineer',
        role: 'senior-typescript-engineer',
        stack: 'Next.js 16/React 19/FSD v2.1',
        standards: '2026-agentic-coding',
        focus: 'multi-tenant-saas-architecture',
      },
      preferences: {
        communication_style: 'terse_direct',
        code_style: 'feature-sliced-design',
        security_first: true,
        performance_optimized: true,
      },
      mcp: {
        preferred_servers: [
          'sequential-thinking',
          'knowledge-graph',
          'github',
          'documentation',
          'filesystem',
        ],
        parallel_execution: true,
        error_handling: 'graceful-failure',
      },
      memory: {
        working_memory_size: 'medium',
        conversation_memory_depth: 10,
        task_memory_retention: 'session',
        long_term_consent: true,
      },
      optimization: {
        parallel_tool_calls: true,
        context_caching: true,
        batch_operations: true,
        memory_consolidation: true,
      },
    };

    writeFileSync(this.settingsPath, JSON.stringify(settings, null, 2));
    console.log('⚙️ Claude settings configured');
  }

  /**
   * Setup memory system configuration
   */
  setupMemory() {
    const memory = {
      version: '1.0.0',
      working_memory: {
        current_task: null,
        constraints: [],
        context_boundaries: [],
      },
      conversation_memory: {
        recent_turns: [],
        rolling_summary: '',
        context_injections: [],
      },
      task_memory: {
        artifacts: [],
        decisions: [],
        command_history: [],
      },
      long_term_memory: {
        user_preferences: {},
        learned_patterns: {},
        project_context: {},
      },
      consent: {
        data_collection: true,
        pattern_learning: true,
        cross_session_memory: true,
      },
    };

    writeFileSync(this.memoryPath, JSON.stringify(memory, null, 2));
    console.log('🧠 Memory system configured');
  }

  /**
   * Validate MCP server configuration
   */
  validateMCPConfiguration() {
    const mcpConfigPath = join(this.repoRoot, 'mcp', 'config', 'config.json');

    if (!existsSync(mcpConfigPath)) {
      throw new Error('MCP configuration not found. Expected:', mcpConfigPath);
    }

    const mcpConfig = JSON.parse(readFileSync(mcpConfigPath, 'utf8'));
    const requiredServers = [
      'sequential-thinking',
      'knowledge-graph',
      'github',
      'documentation',
      'filesystem',
    ];

    const missingServers = requiredServers.filter((server) => !mcpConfig.servers[server]);

    if (missingServers.length > 0) {
      console.warn('⚠️ Missing recommended MCP servers:', missingServers.join(', '));
    } else {
      console.log('✅ MCP configuration validated');
    }
  }

  /**
   * Setup optimization patterns for Claude
   */
  setupOptimizationPatterns() {
    const optimizationConfig = {
      parallel_execution: {
        enabled: true,
        max_concurrent_tools: 5,
        batch_threshold: 3,
      },
      memory_management: {
        working_memory_limit: '50KB',
        conversation_depth: 10,
        consolidation_interval: 5,
      },
      context_optimization: {
        file_header_patterns: true,
        citation_formatting: true,
        structured_progress_updates: true,
      },
      error_handling: {
        retry_strategy: 'exponential_backoff',
        fallback_enabled: true,
        graceful_degradation: true,
      },
    };

    const optimizationPath = join(this.configPath, 'optimization.json');
    writeFileSync(optimizationPath, JSON.stringify(optimizationConfig, null, 2));
    console.log('⚡ Optimization patterns configured');
  }
}

/**
 * Execute setup if run directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new ClaudeEnvironmentSetup();
  setup.initialize().catch(console.error);
}

export default ClaudeEnvironmentSetup;
