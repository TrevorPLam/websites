#!/usr/bin/env node

/**
 * @file packages/ai-testing/scripts/generate-tests.mjs
 * @summary AI Test Generation Script
 * @description Command-line script for generating tests using AI framework
 * @security Script for test generation; no production secrets
 * @requirements TASK-004-4.1: Integrate AI test generation tools
 * @version 1.0.0
 */

import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

// Import AI testing framework
import { AITestGenerationFramework } from '../src/index.js';

// Configuration
const CONFIG = {
  // Target directories
  sourceDirs: [
    'packages/ui/src',
    'packages/features/src',
    'packages/infrastructure/src',
    'packages/integrations/src',
    'apps/web/src',
    'apps/admin/src',
    'apps/portal/src',
  ],
  
  // File patterns to include
  includePatterns: [
    '**/*.ts',
    '**/*.tsx',
  ],
  
  // File patterns to exclude
  excludePatterns: [
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
  ],
  
  // AI configuration
  aiConfig: {
    provider: 'openai', // or 'anthropic', 'local'
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 4000,
  },
  
  // Test generation configuration
  testConfig: {
    targetCoverage: 80,
    maxTestsPerFunction: 3,
    includeIntegrationTests: true,
    includeE2ETests: false, // Disabled for CLI usage
    customPatterns: [],
  },
};

/**
 * Main test generation class
 */
class TestGenerator {
  constructor(config) {
    this.config = config;
    this.framework = new AITestGenerationFramework(config.testConfig);
    this.stats = {
      filesProcessed: 0,
      testsGenerated: 0,
      errors: 0,
      startTime: performance.now(),
    };
  }

  /**
   * Generate tests for all files in source directories
   */
  async generateAllTests() {
    console.log('🚀 Starting AI test generation...\n');
    
    const allFiles = await this.collectSourceFiles();
    
    console.log(`📁 Found ${allFiles.length} source files to process\n`);
    
    for (const filePath of allFiles) {
      await this.generateTestsForFile(filePath);
    }
    
    this.printSummary();
  }

  /**
   * Generate tests for a specific file
   */
  async generateTestsForFile(filePath) {
    try {
      console.log(`🔍 Processing: ${filePath}`);
      
      const tests = await this.framework.generateTestsForFile(filePath);
      
      if (tests.length > 0) {
        for (const test of tests) {
          await this.writeTestFile(test);
          this.stats.testsGenerated++;
        }
        
        console.log(`✅ Generated ${tests.length} tests`);
      } else {
        console.log(`ℹ️  No tests generated for ${filePath}`);
      }
      
      this.stats.filesProcessed++;
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      this.stats.errors++;
    }
  }

  /**
   * Write test file to disk
   */
  async writeTestFile(test) {
    const testDir = dirname(test.filePath);
    await this.ensureDirectory(testDir);
    
    await writeFile(test.filePath, test.content, 'utf-8');
    console.log(`📝 Wrote: ${test.filePath}`);
  }

  /**
   * Ensure directory exists
   */
  async ensureDirectory(dirPath) {
    try {
      await stat(dirPath);
    } catch {
      // Directory doesn't exist, create it
      const parentDir = dirname(dirPath);
      await this.ensureDirectory(parentDir);
      
      // Use bash command for cross-platform compatibility
      const { spawn } = await import('child_process');
      await new Promise((resolve, reject) => {
        const process = spawn('mkdir', ['-p', dirPath], { shell: true });
        process.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Failed to create directory: ${dirPath}`));
        });
      });
    }
  }

  /**
   * Collect all source files matching patterns
   */
  async collectSourceFiles() {
    const allFiles = [];
    
    for (const sourceDir of this.config.sourceDirs) {
      const files = await this.collectFilesFromDirectory(sourceDir);
      allFiles.push(...files);
    }
    
    // Remove duplicates and sort
    return [...new Set(allFiles)].sort();
  }

  /**
   * Collect files from a specific directory
   */
  async collectFilesFromDirectory(dirPath) {
    const files = [];
    
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively process subdirectories
          const subFiles = await this.collectFilesFromDirectory(fullPath);
          files.push(...subFiles);
        } else if (this.shouldIncludeFile(fullPath)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dirPath}:`, error.message);
    }
    
    return files;
  }

  /**
   * Check if file should be included
   */
  shouldIncludeFile(filePath) {
    const ext = extname(filePath);
    const relativePath = relative(process.cwd(), filePath);
    
    // Check extension
    if (!['.ts', '.tsx'].includes(ext)) {
      return false;
    }
    
    // Check include patterns
    const included = this.config.includePatterns.some(pattern => 
      this.matchPattern(relativePath, pattern)
    );
    
    // Check exclude patterns
    const excluded = this.config.excludePatterns.some(pattern => 
      this.matchPattern(relativePath, pattern)
    );
    
    return included && !excluded;
  }

  /**
   * Simple pattern matching (glob-like)
   */
  matchPattern(path, pattern) {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\?/g, '.')
      .replace(/\./g, '\\.');
    
    return new RegExp(regexPattern).test(path);
  }

  /**
   * Print generation summary
   */
  printSummary() {
    const duration = performance.now() - this.stats.startTime;
    const durationSeconds = (duration / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Generation Summary');
    console.log('='.repeat(50));
    console.log(`📁 Files processed: ${this.stats.filesProcessed}`);
    console.log(`🧪 Tests generated: ${this.stats.testsGenerated}`);
    console.log(`❌ Errors: ${this.stats.errors}`);
    console.log(`⏱️  Duration: ${durationSeconds}s`);
    console.log('='.repeat(50));
    
    if (this.stats.errors > 0) {
      console.log(`\n⚠️  ${this.stats.errors} errors occurred during generation`);
      console.log('   Check the logs above for details');
    } else {
      console.log('\n✅ Test generation completed successfully!');
    }
  }
}

/**
 * CLI interface
 */
class CLI {
  constructor() {
    this.args = process.argv.slice(2);
  }

  async run() {
    const command = this.args[0];
    
    switch (command) {
      case 'generate':
        await this.generateTests();
        break;
        
      case 'generate-file':
        await this.generateFile();
        break;
        
      case 'help':
        this.showHelp();
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        this.showHelp();
        process.exit(1);
    }
  }

  async generateTests() {
    const generator = new TestGenerator(CONFIG);
    await generator.generateAllTests();
  }

  async generateFile() {
    const filePath = this.args[1];
    
    if (!filePath) {
      console.error('Error: Please provide a file path');
      console.log('Usage: npm run generate-tests generate-file <file-path>');
      process.exit(1);
    }
    
    const generator = new TestGenerator(CONFIG);
    await generator.generateTestsForFile(filePath);
  }

  showHelp() {
    console.log(`
🧪 AI Test Generation CLI

Usage:
  npm run generate-tests <command>

Commands:
  generate          Generate tests for all source files
  generate-file     Generate tests for a specific file
  help              Show this help message

Examples:
  npm run generate-tests generate
  npm run generate-tests generate-file packages/ui/src/components/Button.tsx
  npm run generate-tests generate-file apps/web/src/app/page.tsx

Configuration:
  Edit the CONFIG object in this script to customize:
  - Source directories to scan
  - File patterns to include/exclude
  - AI model settings
  - Test generation options
`);
  }
}

// Main execution
async function main() {
  const cli = new CLI();
  await cli.run();
}

// Run if called directly
if (import.meta.url === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
