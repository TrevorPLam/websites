#!/usr/bin/env node

/**
 * Doctest Runner for Documentation Code Examples
 * 
 * This script extracts and executes code examples from documentation
 * to ensure they remain functional and up-to-date.
 * 
 * Part of 2026 Documentation Standards - Phase 2 Automation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

interface CodeExample {
  id: string;
  language: string;
  code: string;
  file: string;
  line: number;
  context: string;
  expectedOutput?: string;
  shouldFail?: boolean;
}

interface DoctestResult {
  file: string;
  examples: CodeExample[];
  passed: number;
  failed: number;
  errors: Array<{
    example: CodeExample;
    error: string;
  }>;
}

class DoctestRunner {
  private docsDir: string;
  private tempDir: string;
  private results: DoctestResult[] = [];

  constructor(docsDir: string = 'docs') {
    this.docsDir = docsDir;
    this.tempDir = join(process.cwd(), '.doctest-temp');
    this.ensureTempDir();
  }

  private ensureTempDir(): void {
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Extract code examples from markdown files
   */
  private async extractCodeExamples(filePath: string): Promise<CodeExample[]> {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const examples: CodeExample[] = [];
    let currentExample: Partial<CodeExample> | null = null;
    let exampleId = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect fenced code blocks
      if (line.startsWith('```')) {
        const language = line.slice(3).trim();
        
        if (currentExample) {
          // Closing code block
          currentExample.code = currentExample.code?.trim() || '';
          currentExample.id = `example-${exampleId++}`;
          currentExample.file = filePath;
          currentExample.line = currentExample.line || i;
          currentExample.context = this.getContext(lines, i);
          
          // Extract metadata from comments
          this.extractMetadata(currentExample);
          
          examples.push(currentExample as CodeExample);
          currentExample = null;
        } else {
          // Starting code block
          currentExample = {
            language,
            code: '',
            line: i + 1
          };
        }
      } else if (currentExample) {
        // Inside code block
        currentExample.code += line + '\n';
      }
    }

    return examples;
  }

  /**
   * Extract context around code example
   */
  private getContext(lines: string[], lineIndex: number): string {
    const start = Math.max(0, lineIndex - 3);
    const end = Math.min(lines.length, lineIndex + 4);
    return lines.slice(start, end).join('\n');
  }

  /**
   * Extract metadata from code comments
   */
  private extractMetadata(example: Partial<CodeExample>): void {
    const code = example.code || '';
    const lines = code.split('\n');

    for (const line of lines) {
      if (line.includes('// expected:')) {
        example.expectedOutput = line.split('// expected:')[1].trim();
      } else if (line.includes('// should-fail')) {
        example.shouldFail = true;
      } else if (line.includes('# expected:')) {
        example.expectedOutput = line.split('# expected:')[1].trim();
      } else if (line.includes('# should-fail')) {
        example.shouldFail = true;
      }
    }
  }

  /**
   * Execute JavaScript/TypeScript code examples
   */
  private async executeJSExample(example: CodeExample): Promise<string> {
    const tempFile = join(this.tempDir, `example-${example.id}.mjs`);
    const isTypeScript = example.language === 'typescript' || example.language === 'ts';

    // Prepare code for execution
    let executableCode = example.code;

    // Wrap in async function if needed
    if (executableCode.includes('await') && !executableCode.includes('async')) {
      executableCode = `async function run() {\n${executableCode}\n}\nrun();`;
    }

    // Add console.log capture
    if (isTypeScript) {
      // For TypeScript, we'd need ts-node, but for now just strip types
      executableCode = executableCode.replace(/: [a-zA-Z<>|&]+/g, '');
    }

    writeFileSync(tempFile, executableCode);

    try {
      const output = execSync(`node ${tempFile}`, {
        cwd: process.cwd(),
        timeout: 5000,
        encoding: 'utf-8'
      });
      return output.trim();
    } catch (error: any) {
      if (example.shouldFail) {
        return error.message;
      }
      throw error;
    }
  }

  /**
   * Execute shell/bash code examples
   */
  private async executeShellExample(example: CodeExample): Promise<string> {
    const tempFile = join(this.tempDir, `example-${example.id}.sh`);
    writeFileSync(tempFile, example.code);

    try {
      const output = execSync(`bash ${tempFile}`, {
        cwd: process.cwd(),
        timeout: 10000,
        encoding: 'utf-8'
      });
      return output.trim();
    } catch (error: any) {
      if (example.shouldFail) {
        return error.message;
      }
      throw error;
    }
  }

  /**
   * Execute SQL code examples (mock)
   */
  private async executeSQLExample(example: CodeExample): Promise<string> {
    // For SQL examples, we just validate syntax
    const sql = example.code.trim();
    
    // Basic SQL syntax validation
    if (!sql.toLowerCase().match(/^(select|insert|update|delete|create|drop|alter)/)) {
      throw new Error('Invalid SQL syntax');
    }

    return `SQL syntax validated for: ${sql.split('\n')[0].substring(0, 50)}...`;
  }

  /**
   * Execute a single code example
   */
  private async executeExample(example: CodeExample): Promise<void> {
    let output: string;

    try {
      switch (example.language.toLowerCase()) {
        case 'javascript':
        case 'js':
        case 'typescript':
        case 'ts':
          output = await this.executeJSExample(example);
          break;
        case 'bash':
        case 'shell':
        case 'sh':
          output = await this.executeShellExample(example);
          break;
        case 'sql':
          output = await this.executeSQLExample(example);
          break;
        case 'json':
        case 'yaml':
        case 'toml':
          // Validate JSON/YAML syntax
          JSON.parse(example.code);
          output = 'Valid syntax';
          break;
        default:
          output = `Skipped: ${example.language} not supported for execution`;
      }

      // Check expected output if specified
      if (example.expectedOutput && !output.includes(example.expectedOutput)) {
        throw new Error(`Expected output "${example.expectedOutput}" but got "${output}"`);
      }

      console.log(`✅ ${example.id} (${example.language})`);
    } catch (error: any) {
      console.log(`❌ ${example.id} (${example.language}): ${error.message}`);
      throw error;
    }
  }

  /**
   * Run doctests for all documentation files
   */
  async run(): Promise<void> {
    console.log('🧪 Running doctests for documentation...\n');

    // Find all markdown files
    const files = await glob(`${this.docsDir}/**/*.md`, {
      ignore: ['**/node_modules/**', '**/.git/**']
    });

    console.log(`Found ${files.length} documentation files\n`);

    for (const file of files) {
      await this.runFileTests(file);
    }

    this.printSummary();
  }

  /**
   * Run tests for a single file
   */
  private async runFileTests(filePath: string): Promise<void> {
    console.log(`\n📄 Testing ${filePath}`);

    const examples = await this.extractCodeExamples(filePath);
    const result: DoctestResult = {
      file: filePath,
      examples,
      passed: 0,
      failed: 0,
      errors: []
    };

    for (const example of examples) {
      try {
        await this.executeExample(example);
        result.passed++;
      } catch (error: any) {
        result.failed++;
        result.errors.push({
          example,
          error: error.message
        });
      }
    }

    this.results.push(result);

    if (result.failed === 0) {
      console.log(`✅ All ${result.passed} examples passed`);
    } else {
      console.log(`❌ ${result.passed} passed, ${result.failed} failed`);
    }
  }

  /**
   * Print summary of all test results
   */
  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DOCTEST SUMMARY');
    console.log('='.repeat(60));

    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failed, 0);
    const totalExamples = totalPassed + totalFailed;

    console.log(`Total examples: ${totalExamples}`);
    console.log(`Passed: ${totalPassed} ✅`);
    console.log(`Failed: ${totalFailed} ❌`);
    console.log(`Success rate: ${((totalPassed / totalExamples) * 100).toFixed(1)}%`);

    if (totalFailed > 0) {
      console.log('\n❌ Failed Examples:');
      for (const result of this.results) {
        if (result.errors.length > 0) {
          console.log(`\n📄 ${result.file}:`);
          for (const error of result.errors) {
            console.log(`  ❌ ${error.example.id} (line ${error.example.line}): ${error.error}`);
          }
        }
      }
    }

    // Exit with error code if any tests failed
    if (totalFailed > 0) {
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const docsDir = args[0] || 'docs';

  const runner = new DoctestRunner(docsDir);
  await runner.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { DoctestRunner, CodeExample, DoctestResult };
