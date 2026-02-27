---
name: automated-review-scripts-chunk-3
description: |
  **SCRIPTING SKILL** - Automated code review scripts for Codex agents (Chunk 3/4).
  USE FOR: Architecture validation, FSD compliance, import rules, and pattern checking.
  DO NOT USE FOR: Manual review processes - use automation patterns.
  INVOKES: filesystem, git, sequential-thinking, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
chunking:
  total_chunks: 4
  chunk_number: 3
  tokens: 990
  created_at: "2026-02-27T13:28:00.000Z"
  ai_optimized: true
---

# Automated Code Review Scripts - Chunk 3: Architecture Review Scripts

### 3. Architecture Review Scripts

#### FSD Compliance Checker
```bash
# Check FSD compliance
pnpm run review:architecture --fsd-compliance --strict

# Validate import directions
pnpm run review:architecture --import-rules --report=imports.json

# Check circular dependencies
pnpm run review:architecture --circular-deps --exclude=node_modules
```

**Script Implementation:**
```typescript
#!/usr/bin/env tsx
/**
 * Architecture Review Script
 * 
 * Validates Feature-Sliced Design compliance, import rules,
 * and architectural patterns.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, dirname, relative } from 'path';

interface ArchitectureIssue {
  type: 'fsd-violation' | 'import-rule' | 'circular-dependency' | 'pattern-violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  description: string;
  recommendation: string;
}

interface ImportRule {
  from: string;
  to: string;
  allowed: boolean;
  reason?: string;
}

class ArchitectureValidator {
  private issues: ArchitectureIssue[] = [];
  private fsdLayers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
  private importRules: ImportRule[] = [
    { from: 'app', to: 'pages', allowed: true },
    { from: 'app', to: 'widgets', allowed: true },
    { from: 'app', to: 'features', allowed: true },
    { from: 'app', to: 'entities', allowed: true },
    { from: 'app', to: 'shared', allowed: true },
    { from: 'pages', to: 'widgets', allowed: true },
    { from: 'pages', to: 'features', allowed: true },
    { from: 'pages', to: 'entities', allowed: true },
    { from: 'pages', to: 'shared', allowed: true },
    { from: 'widgets', to: 'features', allowed: true },
    { from: 'widgets', to: 'entities', allowed: true },
    { from: 'widgets', to: 'shared', allowed: true },
    { from: 'features', to: 'entities', allowed: true },
    { from: 'features', to: 'shared', allowed: true },
    { from: 'entities', to: 'shared', allowed: true },
    // Disallowed imports (higher layers importing from lower)
    { from: 'shared', to: 'entities', allowed: false, reason: 'Shared layer cannot import from entities' },
    { from: 'shared', to: 'features', allowed: false, reason: 'Shared layer cannot import from features' },
    { from: 'shared', to: 'widgets', allowed: false, reason: 'Shared layer cannot import from widgets' },
    { from: 'shared', to: 'pages', allowed: false, reason: 'Shared layer cannot import from pages' },
    { from: 'shared', to: 'app', allowed: false, reason: 'Shared layer cannot import from app' }
  ];
  
  async validate(options: ArchitectureOptions): Promise<void> {
    const files = this.getFiles(process.cwd(), options.exclude);
    
    for (const file of files) {
      await this.validateFile(file);
    }
    
    if (options.circularDeps) {
      await this.checkCircularDependencies(files);
    }
    
    await this.generateReport(options.output);
  }
  
  private async validateFile(filePath: string): Promise<void> {
    try {
      const content = readFileSync(filePath, 'utf8');
      
      // Check FSD layer compliance
      this.checkFSDCompliance(filePath, content);
      
      // Check import rules
      this.checkImportRules(filePath, content);
      
      // Check architectural patterns
      this.checkArchitecturalPatterns(filePath, content);
      
    } catch (error) {
      console.error(`Error validating file ${filePath}:`, error);
    }
  }
  
  private checkFSDCompliance(filePath: string, content: string): void {
    const relativePath = relative(process.cwd(), filePath);
    const pathParts = relativePath.split('/');
    
    // Check if file is in FSD structure
    const fsdLayer = pathParts.find(part => this.fsdLayers.includes(part));
    
    if (!fsdLayer) {
      return; // Not in FSD structure
    }
    
    // Check for business logic in app layer
    if (fsdLayer === 'app') {
      if (this.containsBusinessLogic(content)) {
        this.issues.push({
          type: 'fsd-violation',
          severity: 'high',
          file: filePath,
          description: 'Business logic detected in app layer',
          recommendation: 'Move business logic to features layer'
        });
      }
    }
    
    // Check for UI components in entities layer
    if (fsdLayer === 'entities') {
      if (this.containsUIComponents(content)) {
        this.issues.push({
          type: 'fsd-violation',
          severity: 'high',
          file: filePath,
          description: 'UI components detected in entities layer',
          recommendation: 'Move UI components to widgets or features layer'
        });
      }
    }
    
    // Check for API routes in wrong layers
    if (fsdLayer !== 'app' && fsdLayer !== 'pages') {
      if (this.containsApiRoutes(content)) {
        this.issues.push({
          type: 'fsd-violation',
          severity: 'medium',
          file: filePath,
          description: 'API routes outside app/pages layer',
          recommendation: 'Move API routes to app layer'
        });
      }
    }
  }
  
  private checkImportRules(filePath: string, content: string): void {
    const imports = this.extractImports(content);
    
    imports.forEach(importStatement => {
      const fromLayer = this.getLayerFromPath(filePath);
      const toLayer = this.getLayerFromImport(importStatement);
      
      if (fromLayer && toLayer) {
        const rule = this.importRules.find(r => r.from === fromLayer && r.to === toLayer);
        
        if (rule && !rule.allowed) {
          this.issues.push({
            type: 'import-rule',
            severity: 'high',
            file: filePath,
            description: `Invalid import: ${fromLayer} importing from ${toLayer}`,
            recommendation: rule.reason || 'Follow FSD import direction rules'
          });
        }
      }
    });
  }
  
  private checkArchitecturalPatterns(filePath: string, content: string): void {
    // Check for direct database access outside entities/features
    if (this.containsDirectDatabaseAccess(content)) {
      const layer = this.getLayerFromPath(filePath);
      if (layer && !['entities', 'features'].includes(layer)) {
        this.issues.push({
          type: 'pattern-violation',
          severity: 'medium',
          file: filePath,
          description: 'Direct database access outside entities/features layer',
          recommendation: 'Use repository pattern and move to appropriate layer'
        });
      }
    }
    
    // Check for hardcoded configuration
    if (this.containsHardcodedConfig(content)) {
      this.issues.push({
        type: 'pattern-violation',
        severity: 'medium',
        file: filePath,
        description: 'Hardcoded configuration detected',
        recommendation: 'Move to environment variables or configuration files'
      });
    }
  }
  
  private async checkCircularDependencies(files: string[]): Promise<void> {
    const dependencyGraph = new Map<string, Set<string>>();
    
    // Build dependency graph
    files.forEach(file => {
      const content = readFileSync(file, 'utf8');
      const imports = this.extractImports(content);
      const dependencies = new Set<string>();
      
      imports.forEach(importPath => {
        const resolvedFile = this.resolveImportPath(file, importPath);
        if (resolvedFile && files.includes(resolvedFile)) {
          dependencies.add(resolvedFile);
        }
      });
      
      dependencyGraph.set(file, dependencies);
    });
    
    // Detect circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    for (const file of files) {
      if (this.hasCircularDependency(file, dependencyGraph, visited, recursionStack)) {
        this.issues.push({
          type: 'circular-dependency',
          severity: 'high',
          file,
          description: 'Circular dependency detected',
          recommendation: 'Refactor to eliminate circular dependency'
        });
      }
    }
  }
  
  private hasCircularDependency(
    file: string,
    graph: Map<string, Set<string>>,
    visited: Set<string>,
    recursionStack: Set<string>
  ): boolean {
    if (recursionStack.has(file)) {
      return true; // Circular dependency found
    }
    
    if (visited.has(file)) {
      return false; // Already processed
    }
    
    visited.add(file);
    recursionStack.add(file);
    
    const dependencies = graph.get(file) || new Set();
    for (const dependency of dependencies) {
      if (this.hasCircularDependency(dependency, graph, visited, recursionStack)) {
        return true;
      }
    }
    
    recursionStack.delete(file);
    return false;
  }
  
  // Helper methods
  private containsBusinessLogic(content: string): boolean {
    const patterns = [
      /class.*Service/,
      /function.*create.*|update.*|delete.*|get.*\(/,
      /const.*=.*async.*=>/,
      /await.*db\.|await.*query/
    ];
    return patterns.some(pattern => pattern.test(content));
  }
  
  private containsUIComponents(content: string): boolean {
    const patterns = [
      /React\.(FC|Component)/,
      /export.*function.*Component/,
      /<.*>.*<\/.*>/,
      /styled\./,
      /className=/
    ];
    return patterns.some(pattern => pattern.test(content));
  }
  
  private containsApiRoutes(content: string): boolean {
    return /app\.(get|post|put|delete|patch)\(/.test(content);
  }
  
  private containsDirectDatabaseAccess(content: string): boolean {
    return /db\.(query|execute|raw)/.test(content);
  }
  
  private containsHardcodedConfig(content: string): boolean {
    return /(localhost|127\.0\.0\.1|http:\/\/|https:\/\/[^/])/.test(content);
  }
  
  private extractImports(content: string): string[] {
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }
  
  private getLayerFromPath(filePath: string): string | null {
    const relativePath = relative(process.cwd(), filePath);
    const pathParts = relativePath.split('/');
    return pathParts.find(part => this.fsdLayers.includes(part)) || null;
  }
  
  private getLayerFromImport(importPath: string): string | null {
    if (importPath.startsWith('@x/')) {
      // Cross-slice import, extract layer
      const pathParts = importPath.substring(3).split('/');
      return pathParts.find(part => this.fsdLayers.includes(part)) || null;
    }
    
    // Relative import
    const pathParts = importPath.split('/');
    return pathParts.find(part => this.fsdLayers.includes(part)) || null;
  }
  
  private resolveImportPath(fromFile: string, importPath: string): string | null {
    // Simplified path resolution
    if (importPath.startsWith('.')) {
      const fromDir = dirname(fromFile);
      const resolved = join(fromDir, importPath);
      return this.findFile(resolved);
    }
    return null;
  }
  
  private findFile(path: string): string | null {
    // Try different extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    for (const ext of extensions) {
      const fullPath = path + ext;
      if (existsSync(fullPath)) {
        return fullPath;
      }
    }
    return null;
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
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
  }
  
  private async generateReport(outputPath?: string): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
      highIssues: this.issues.filter(i => i.severity === 'high').length,
      mediumIssues: this.issues.filter(i => i.severity === 'medium').length,
      lowIssues: this.issues.filter(i => i.severity === 'low').length,
      issues: this.issues,
      complianceScore: this.calculateComplianceScore()
    };
    
    if (outputPath) {
      require('fs').writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`Architecture report saved to ${outputPath}`);
    } else {
      console.log('\n🏗️ Architecture Review Report');
      console.log(`Total Issues: ${report.totalIssues}`);
      console.log(`Compliance Score: ${report.complianceScore}/10`);
      
      if (this.issues.length > 0) {
        console.log('\n🔍 Issues Found:');
        this.issues.forEach(issue => {
          console.log(`  ${issue.severity.toUpperCase()}: ${issue.description}`);
          console.log(`    File: ${issue.file}`);
          console.log(`    Recommendation: ${issue.recommendation}`);
        });
      }
    }
  }
  
  private calculateComplianceScore(): number {
    let score = 10;
    
    // Deduct points for issues
    score -= this.issues.filter(i => i.severity === 'critical').length * 3;
    score -= this.issues.filter(i => i.severity === 'high').length * 2;
    score -= this.issues.filter(i => i.severity === 'medium').length * 1;
    score -= this.issues.filter(i => i.severity === 'low').length * 0.5;
    
    return Math.max(0, Math.round(score));
  }
}

interface ArchitectureOptions {
  exclude?: string[];
  output?: string;
  fsdCompliance?: boolean;
  importRules?: boolean;
  circularDeps?: boolean;
  strict?: boolean;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  const validator = new ArchitectureValidator();
  await validator.validate(options);
}

function parseArgs(args: string[]): ArchitectureOptions {
  const options: ArchitectureOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--exclude':
        options.exclude = args[++i]?.split(',') || [];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--fsd-compliance':
        options.fsdCompliance = true;
        break;
      case '--import-rules':
        options.importRules = true;
        break;
      case '--circular-deps':
        options.circularDeps = true;
        break;
      case '--strict':
        options.strict = true;
        break;
    }
  }
  
  return options;
}

if (require.main === module) {
  main().catch(console.error);
}
```

## Navigation
- Previous: [Chunk 2](automated-review-scripts-chunk-2.md) - Performance Review Scripts
- Next: [Chunk 4](automated-review-scripts-chunk-4.md) - Quality Review Scripts
