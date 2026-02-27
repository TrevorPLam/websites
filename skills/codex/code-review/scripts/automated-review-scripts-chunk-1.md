---
name: automated-review-scripts-chunk-1
description: |
  **SCRIPTING SKILL** - Automated code review scripts for Codex agents (Chunk 1/4).
  USE FOR: Security scanning, performance analysis, architecture validation, and quality checks.
  DO NOT USE FOR: Manual review processes - use automation patterns.
  INVOKES: filesystem, git, sequential-thinking, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
chunking:
  total_chunks: 4
  chunk_number: 1
  tokens: 950
  created_at: "2026-02-27T13:28:00.000Z"
  ai_optimized: true
---

# Automated Code Review Scripts - Chunk 1: Security Review Scripts

## Overview
This skill provides Codex-optimized automation scripts for comprehensive code review processes in the marketing websites monorepo.

## Available Scripts

### 1. Security Review Scripts

#### Security Vulnerability Scanner
```bash
# Run comprehensive security scan
pnpm run review:security --scope=full --report=security-report.json

# Scan specific directory
pnpm run review:security --path=apps/web/src --severity=high

# Check for hardcoded secrets
pnpm run review:security --check-secrets --exclude=node_modules

# Validate tenant isolation
pnpm run review:security --tenant-isolation --database-check
```

**Script Implementation:**
```typescript
#!/usr/bin/env tsx
/**
 * Security Review Automation Script
 * 
 * Scans codebase for security vulnerabilities, hardcoded secrets,
 * and tenant isolation compliance.
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { z } from 'zod';

// Security patterns to detect
const SECURITY_PATTERNS = {
  hardcodedSecrets: [
    /password\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    /secret\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    /api[_-]?key\s*[:=]\s*['"][^'"]{20,}['"]/gi,
    /token\s*[:=]\s*['"][^'"]{20,}['"]/gi
  ],
  sqlInjection: [
    /execute\s*\(\s*['"`]([^'"`]*\$\{[^}]*\}[^'"`]*)['"`]/gi,
    /query\s*\(\s*['"`]([^'"`]*\+[^'"`]*)['"`]/gi
  ],
  xssVulnerabilities: [
    /innerHTML\s*=\s*['"`]([^'"`]*[^<]*[^>]*[^'"`]*)['"`]/gi,
    /document\.write\s*\([^)]*\)/gi
  ],
  tenantIsolation: [
    /SELECT.*FROM.*WHERE(?!.*tenant_id)/gi,
    /UPDATE.*SET.*WHERE(?!.*tenant_id)/gi,
    /DELETE.*FROM.*WHERE(?!.*tenant_id)/gi
  ]
};

interface SecurityIssue {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line: number;
  column: number;
  description: string;
  recommendation: string;
}

class SecurityScanner {
  private issues: SecurityIssue[] = [];
  
  async scanDirectory(directory: string, options: ScanOptions): Promise<void> {
    const files = this.getFiles(directory, options.exclude);
    
    for (const file of files) {
      await this.scanFile(file);
    }
    
    await this.generateReport(options.output);
  }
  
  private async scanFile(filePath: string): Promise<void> {
    try {
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Check for hardcoded secrets
      this.checkPatterns(content, filePath, SECURITY_PATTERNS.hardcodedSecrets, 'hardcoded-secrets');
      
      // Check for SQL injection
      this.checkPatterns(content, filePath, SECURITY_PATTERNS.sqlInjection, 'sql-injection');
      
      // Check for XSS vulnerabilities
      this.checkPatterns(content, filePath, SECURITY_PATTERNS.xssVulnerabilities, 'xss');
      
      // Check tenant isolation
      this.checkPatterns(content, filePath, SECURITY_PATTERNS.tenantIsolation, 'tenant-isolation');
      
    } catch (error) {
      console.error(`Error scanning file ${filePath}:`, error);
    }
  }
  
  private checkPatterns(content: string, filePath: string, patterns: RegExp[], type: string): void {
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const line = this.getLineNumber(content, match.index);
        const column = match.index - content.lastIndexOf('\n', match.index) - 1;
        
        this.issues.push({
          type,
          severity: this.getSeverity(type),
          file: filePath,
          line,
          column,
          description: this.getDescription(type, match[0]),
          recommendation: this.getRecommendation(type)
        });
      }
    });
  }
  
  private getSeverity(type: string): SecurityIssue['severity'] {
    switch (type) {
      case 'hardcoded-secrets':
      case 'sql-injection':
        return 'critical';
      case 'xss':
        return 'high';
      case 'tenant-isolation':
        return 'high';
      default:
        return 'medium';
    }
  }
  
  private getDescription(type: string, match: string): string {
    switch (type) {
      case 'hardcoded-secrets':
        return `Hardcoded secret detected: ${match.substring(0, 20)}...`;
      case 'sql-injection':
        return 'Potential SQL injection vulnerability';
      case 'xss':
        return 'Potential XSS vulnerability';
      case 'tenant-isolation':
        return 'Missing tenant_id in database query';
      default:
        return 'Security issue detected';
    }
  }
  
  private getRecommendation(type: string): string {
    switch (type) {
      case 'hardcoded-secrets':
        return 'Move to environment variables or secure configuration';
      case 'sql-injection':
        return 'Use parameterized queries or ORM';
      case 'xss':
        return 'Use proper output encoding and sanitization';
      case 'tenant-isolation':
        return 'Add tenant_id filter to all queries';
      default:
        return 'Review and fix security issue';
    }
  }
  
  private getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
  }
  
  private getFiles(directory: string, exclude: string[] = []): string[] {
    const files: string[] = [];
    
    function traverse(dir: string) {
      const items = readdirSync(dir);
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!exclude.includes(item)) {
            traverse(fullPath);
          }
        } else if (this.shouldScanFile(fullPath)) {
          files.push(fullPath);
        }
      }
    }
    
    traverse(directory);
    return files;
  }
  
  private shouldScanFile(filePath: string): boolean {
    const ext = extname(filePath);
    return ['.ts', '.tsx', '.js', '.jsx', '.sql'].includes(ext);
  }
  
  private async generateReport(outputPath?: string): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
      highIssues: this.issues.filter(i => i.severity === 'high').length,
      mediumIssues: this.issues.filter(i => i.severity === 'medium').length,
      lowIssues: this.issues.filter(i => i.severity === 'low').length,
      issues: this.issues
    };
    
    if (outputPath) {
      require('fs').writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`Security report saved to ${outputPath}`);
    } else {
      console.log(JSON.stringify(report, null, 2));
    }
  }
}

interface ScanOptions {
  exclude?: string[];
  output?: string;
  severity?: string;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  const scanner = new SecurityScanner();
  await scanner.scanDirectory(process.cwd(), options);
}

function parseArgs(args: string[]): ScanOptions {
  const options: ScanOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--exclude':
        options.exclude = args[++i]?.split(',') || [];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--severity':
        options.severity = args[++i];
        break;
    }
  }
  
  return options;
}

if (require.main === module) {
  main().catch(console.error);
}
```

## Next Chunk
Continue to [Chunk 2](automated-review-scripts-chunk-2.md) for Performance Review Scripts.
