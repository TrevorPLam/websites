#!/usr/bin/env node

/**
 * Import/Export Validation Script
 * 
 * This script validates import/export patterns across the monorepo
 * to ensure consistency with 2026 standards and best practices.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

interface ValidationResult {
  file: string;
  issues: ValidationIssue[];
  passed: boolean;
}

interface ValidationIssue {
  type: 'import-order' | 'relative-import' | 'circular-dependency' | 'unused-export';
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
}

class ImportExportValidator {
  private readonly rootDir: string;
  private readonly patterns = {
    typescript: '**/*.{ts,tsx}',
    packages: 'packages/*/src/**/*.{ts,tsx}',
    clients: 'clients/*/src/**/*.{ts,tsx}'
  };

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
  }

  async validateAll(): Promise<ValidationResult[]> {
    console.log('🔍 Starting import/export validation...');
    
    const results: ValidationResult[] = [];
    
    // Validate TypeScript files
    const tsFiles = await glob(this.patterns.typescript, { cwd: this.rootDir });
    
    for (const file of tsFiles) {
      const result = await this.validateFile(join(this.rootDir, file));
      results.push(result);
    }
    
    // Run dependency-cruiser for circular dependencies
    await this.checkCircularDependencies(results);
    
    // Run attw for package type validation
    await this.validatePackageTypes(results);
    
    this.generateReport(results);
    
    return results;
  }

  private async validateFile(filePath: string): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      // Check import order
      this.checkImportOrder(lines, issues);
      
      // Check for relative imports in packages
      this.checkRelativeImports(filePath, lines, issues);
      
      // Check for unused exports (basic check)
      this.checkUnusedExports(content, issues);
      
    } catch (error) {
      issues.push({
        type: 'import-order',
        severity: 'error',
        message: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
    
    return {
      file: filePath,
      issues,
      passed: issues.filter(i => i.severity === 'error').length === 0
    };
  }

  private checkImportOrder(lines: string[], issues: ValidationIssue[]): void {
    const importGroups = {
      nodejs: [] as number[],
      external: [] as number[],
      internal: [] as number[],
      relative: [] as number[],
      type: [] as number[]
    };
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('import type')) {
        importGroups.type.push(index);
      } else if (trimmed.startsWith('import')) {
        if (trimmed.includes('from "fs"') || trimmed.includes('from "path"')) {
          importGroups.nodejs.push(index);
        } else if (trimmed.startsWith('import {') && trimmed.includes('@repo/')) {
          importGroups.internal.push(index);
        } else if (trimmed.includes('from "../') || trimmed.includes('from "./')) {
          importGroups.relative.push(index);
        } else {
          importGroups.external.push(index);
        }
      }
    });
    
    // Check if imports are in the correct order
    const allImports = [
      ...importGroups.nodejs,
      ...importGroups.external,
      ...importGroups.internal,
      ...importGroups.relative,
      ...importGroups.type
    ];
    
    const sortedImports = [...allImports].sort((a, b) => a - b);
    
    if (JSON.stringify(allImports) !== JSON.stringify(sortedImports)) {
      issues.push({
        type: 'import-order',
        severity: 'warning',
        message: 'Imports are not in the recommended order: Node.js -> External -> Internal (@repo/*) -> Relative -> Type imports',
        line: allImports[0] + 1
      });
    }
  }

  private checkRelativeImports(filePath: string, lines: string[], issues: ValidationIssue[]): void {
    if (filePath.includes('/packages/')) {
      lines.forEach((line, index) => {
        if (line.includes('from "../') && !line.includes('.test.') && !line.includes('.spec.')) {
          issues.push({
            type: 'relative-import',
            severity: 'warning',
            message: 'Prefer absolute @repo/* imports over relative imports in packages',
            line: index + 1
          });
        }
      });
    }
  }

  private checkUnusedExports(content: string, issues: ValidationIssue[]): void {
    // Basic check for potential unused exports
    const exportMatches = content.match(/export\s+(const|function|class|interface|type)\s+(\w+)/g);
    
    if (exportMatches && exportMatches.length > 10) {
      // If there are many exports, suggest checking for unused ones
      issues.push({
        type: 'unused-export',
        severity: 'info',
        message: 'Consider running knip to detect unused exports'
      });
    }
  }

  private async checkCircularDependencies(results: ValidationResult[]): Promise<void> {
    try {
      console.log('🔄 Checking circular dependencies...');
      
      const output = execSync('npx dependency-cruiser packages --config .dependency-cruiser.js --output json', {
        cwd: this.rootDir,
        encoding: 'utf-8'
      });
      
      const report = JSON.parse(output);
      
      if (report.summary.violations > 0) {
        report.violations.forEach((violation: any) => {
          results.push({
            file: violation.from,
            issues: [{
              type: 'circular-dependency',
              severity: 'error',
              message: `Circular dependency detected: ${violation.rule.name}`,
              line: 1
            }],
            passed: false
          });
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Could not run dependency-cruiser:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async validatePackageTypes(results: ValidationResult[]): Promise<void> {
    try {
      console.log('📦 Validating package types...');
      
      const packageDirs = await glob('packages/*/package.json', { cwd: this.rootDir });
      
      for (const packageDir of packageDirs) {
        try {
          const output = execSync(`npx attw ${packageDir}`, {
            cwd: this.rootDir,
            encoding: 'utf-8'
          });
          
          // If attw outputs anything, it might be a warning
          if (output.trim()) {
            results.push({
              file: packageDir,
            issues: [{
              type: 'unused-export',
              severity: 'warning',
              message: `Package type issues: ${output.trim()}`,
              line: 1
            }],
            passed: true
            });
          }
          
        } catch (error) {
          // attw exits with error code for issues
          const message = error instanceof Error ? error.message : 'Unknown error';
          results.push({
            file: packageDir,
            issues: [{
              type: 'unused-export',
              severity: 'error',
              message: `Package type validation failed: ${message}`,
              line: 1
            }],
            passed: false
          });
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Could not run attw:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private generateReport(results: ValidationResult[]): void {
    const totalFiles = results.length;
    const passedFiles = results.filter(r => r.passed).length;
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const errorIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'error').length, 0);
    const warningIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length, 0);
    
    console.log('\n📊 Import/Export Validation Report');
    console.log('=====================================');
    console.log(`Files scanned: ${totalFiles}`);
    console.log(`Files passed: ${passedFiles}`);
    console.log(`Files failed: ${totalFiles - passedFiles}`);
    console.log(`Total issues: ${totalIssues}`);
    console.log(`Errors: ${errorIssues}`);
    console.log(`Warnings: ${warningIssues}`);
    
    if (errorIssues > 0) {
      console.log('\n❌ Validation failed with errors:');
      results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`\n📁 ${r.file}`);
          r.issues
            .filter(i => i.severity === 'error')
            .forEach(i => {
              console.log(`   ❌ ${i.message}${i.line ? ` (line ${i.line})` : ''}`);
            });
        });
    }
    
    if (warningIssues > 0) {
      console.log('\n⚠️ Warnings found:');
      results
        .filter(r => r.issues.some(i => i.severity === 'warning'))
        .forEach(r => {
          const warnings = r.issues.filter(i => i.severity === 'warning');
          if (warnings.length > 0) {
            console.log(`\n📁 ${r.file}`);
            warnings.forEach(i => {
              console.log(`   ⚠️ ${i.message}${i.line ? ` (line ${i.line})` : ''}`);
            });
          }
        });
    }
    
    if (errorIssues === 0 && warningIssues === 0) {
      console.log('\n✅ All checks passed! Import/export patterns are compliant.');
    }
    
    // Exit with error code if there are error issues
    if (errorIssues > 0) {
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const validator = new ImportExportValidator();
  
  switch (command) {
    case 'all':
      await validator.validateAll();
      break;
    case 'help':
      console.log(`
Import/Export Validator

Usage:
  node scripts/validate-imports.js <command>

Commands:
  all     - Validate all TypeScript files in the monorepo
  help    - Show this help message

Examples:
  pnpm validate:imports
  node scripts/validate-imports.js all
      `);
      break;
    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

export { ImportExportValidator };
