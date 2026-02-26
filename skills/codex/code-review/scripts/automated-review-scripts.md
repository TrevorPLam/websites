---
name: automated-review-scripts
description: |
  **SCRIPTING SKILL** - Automated code review scripts for Codex agents.
  USE FOR: Security scanning, performance analysis, architecture validation, and quality checks.
  DO NOT USE FOR: Manual review processes - use automation patterns.
  INVOKES: filesystem, git, sequential-thinking, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
---

# Automated Code Review Scripts

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

### 2. Performance Review Scripts

#### Bundle Size Analyzer
```bash
# Analyze bundle size impact
pnpm run review:bundle --analyze --threshold=250000

# Compare with baseline
pnpm run review:bundle --compare=main --report=bundle-diff.json

# Generate optimization suggestions
pnpm run review:bundle --optimize --suggestions
```

**Script Implementation:**
```typescript
#!/usr/bin/env tsx
/**
 * Bundle Size Analysis Script
 * 
 * Analyzes bundle sizes, identifies optimization opportunities,
 * and generates performance reports.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  recommendations: string[];
}

interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: ModuleInfo[];
}

interface ModuleInfo {
  name: string;
  size: number;
  path: string;
}

class BundleAnalyzer {
  private threshold: number = 250000; // 250KB
  
  async analyze(options: BundleOptions): Promise<BundleAnalysis> {
    const buildStats = await this.getBuildStats();
    const analysis = this.processBuildStats(buildStats);
    
    if (options.compare) {
      const baseline = await this.getBaselineStats(options.compare);
      analysis.comparison = this.compareWithBaseline(analysis, baseline);
    }
    
    if (options.optimize) {
      analysis.recommendations = this.generateOptimizationRecommendations(analysis);
    }
    
    await this.generateReport(analysis, options.output);
    return analysis;
  }
  
  private async getBuildStats(): Promise<any> {
    try {
      // Run build with stats
      execSync('pnpm build', { stdio: 'inherit' });
      
      // Read webpack stats
      const statsPath = join(process.cwd(), '.next', 'build-stats.json');
      if (existsSync(statsPath)) {
        return JSON.parse(readFileSync(statsPath, 'utf8'));
      }
      
      // Fallback to manual analysis
      return this.analyzeNextBuild();
    } catch (error) {
      console.error('Build failed:', error);
      throw error;
    }
  }
  
  private processBuildStats(stats: any): BundleAnalysis {
    const chunks: ChunkInfo[] = [];
    let totalSize = 0;
    let totalGzippedSize = 0;
    
    if (stats.chunks) {
      stats.chunks.forEach((chunk: any) => {
        const chunkInfo: ChunkInfo = {
          name: chunk.names?.[0] || chunk.id,
          size: chunk.size || 0,
          gzippedSize: this.estimateGzipSize(chunk.size || 0),
          modules: []
        };
        
        if (chunk.modules) {
          Object.entries(chunk.modules).forEach(([name, module]: [string, any]) => {
            chunkInfo.modules.push({
              name,
              size: module.size || 0,
              path: module.name || name
            });
          });
        }
        
        chunks.push(chunkInfo);
        totalSize += chunkInfo.size;
        totalGzippedSize += chunkInfo.gzippedSize;
      });
    }
    
    return {
      totalSize,
      gzippedSize: totalGzippedSize,
      chunks,
      recommendations: []
    };
  }
  
  private estimateGzipSize(originalSize: number): number {
    // Rough estimation: gzip typically reduces to 30-40% of original
    return Math.round(originalSize * 0.35);
  }
  
  private generateOptimizationRecommendations(analysis: BundleAnalysis): string[] {
    const recommendations: string[] = [];
    
    // Check total bundle size
    if (analysis.gzippedSize > this.threshold) {
      recommendations.push(`Bundle size (${analysis.gzippedSize} bytes) exceeds threshold (${this.threshold} bytes)`);
    }
    
    // Check for large chunks
    analysis.chunks.forEach(chunk => {
      if (chunk.gzippedSize > 100000) { // 100KB
        recommendations.push(`Large chunk detected: ${chunk.name} (${chunk.gzippedSize} bytes)`);
      }
    });
    
    // Check for duplicate modules
    const moduleCounts = new Map<string, number>();
    analysis.chunks.forEach(chunk => {
      chunk.modules.forEach(module => {
        const count = moduleCounts.get(module.name) || 0;
        moduleCounts.set(module.name, count + 1);
      });
    });
    
    moduleCounts.forEach((count, name) => {
      if (count > 1) {
        recommendations.push(`Duplicate module found: ${name} (appears ${count} times)`);
      }
    });
    
    // Check for heavy dependencies
    const heavyModules = analysis.chunks.flatMap(chunk => chunk.modules)
      .filter(module => module.size > 50000)
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);
    
    heavyModules.forEach(module => {
      recommendations.push(`Heavy dependency: ${module.name} (${module.size} bytes)`);
    });
    
    return recommendations;
  }
  
  private async generateReport(analysis: BundleAnalysis, outputPath?: string): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      bundleSize: {
        total: analysis.totalSize,
        gzipped: analysis.gzippedSize,
        threshold: this.threshold,
        exceedsThreshold: analysis.gzippedSize > this.threshold
      },
      chunks: analysis.chunks,
      recommendations: analysis.recommendations,
      score: this.calculatePerformanceScore(analysis)
    };
    
    if (outputPath) {
      require('fs').writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`Bundle analysis report saved to ${outputPath}`);
    } else {
      console.log('\n📦 Bundle Analysis Report');
      console.log(`Total Size: ${analysis.totalSize} bytes`);
      console.log(`Gzipped: ${analysis.gzippedSize} bytes`);
      console.log(`Performance Score: ${report.score}/10`);
      
      if (analysis.recommendations.length > 0) {
        console.log('\n🔧 Optimization Recommendations:');
        analysis.recommendations.forEach(rec => console.log(`  • ${rec}`));
      }
    }
  }
  
  private calculatePerformanceScore(analysis: BundleAnalysis): number {
    let score = 10;
    
    // Deduct points for size issues
    if (analysis.gzippedSize > this.threshold) {
      score -= Math.min(5, Math.floor((analysis.gzippedSize - this.threshold) / 50000));
    }
    
    // Deduct points for large chunks
    const largeChunks = analysis.chunks.filter(c => c.gzippedSize > 100000);
    score -= largeChunks.length * 2;
    
    // Deduct points for duplicate modules
    const moduleSet = new Set();
    let duplicateCount = 0;
    analysis.chunks.forEach(chunk => {
      chunk.modules.forEach(module => {
        if (moduleSet.has(module.name)) {
          duplicateCount++;
        } else {
          moduleSet.add(module.name);
        }
      });
    });
    score -= Math.min(3, duplicateCount);
    
    return Math.max(0, score);
  }
}

interface BundleOptions {
  compare?: string;
  optimize?: boolean;
  output?: string;
  threshold?: number;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  const analyzer = new BundleAnalyzer();
  if (options.threshold) {
    analyzer.threshold = options.threshold;
  }
  
  await analyzer.analyze(options);
}

function parseArgs(args: string[]): BundleOptions {
  const options: BundleOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--compare':
        options.compare = args[++i];
        break;
      case '--optimize':
        options.optimize = true;
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--threshold':
        options.threshold = parseInt(args[++i]);
        break;
    }
  }
  
  return options;
}

if (require.main === module) {
  main().catch(console.error);
}
```

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

### 4. Quality Review Scripts

#### Test Coverage Analyzer
```bash
# Analyze test coverage
pnpm run review:coverage --threshold=80 --report=coverage.json

# Find untested files
pnpm run review:coverage --untested --exclude=node_modules

# Generate coverage trends
pnpm run review:coverage --trend --days=30
```

**Script Implementation:**
```typescript
#!/usr/bin/env tsx
/**
 * Test Coverage Analysis Script
 * 
 * Analyzes test coverage, identifies gaps, and generates
 * comprehensive coverage reports.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface CoverageReport {
  total: CoverageMetrics;
  byFile: FileCoverage[];
  uncoveredFiles: string[];
  recommendations: string[];
}

interface CoverageMetrics {
  lines: {
    total: number;
    covered: number;
    percentage: number;
  };
  functions: {
    total: number;
    covered: number;
    percentage: number;
  };
  branches: {
    total: number;
    covered: number;
    percentage: number;
  };
  statements: {
    total: number;
    covered: number;
    percentage: number;
  };
}

interface FileCoverage {
  file: string;
  metrics: CoverageMetrics;
  complexity: number;
}

class CoverageAnalyzer {
  private threshold: number = 80;
  
  async analyze(options: CoverageOptions): Promise<CoverageReport> {
    // Run tests with coverage
    await this.runCoverageTests();
    
    // Load coverage data
    const coverageData = await this.loadCoverageData();
    
    // Process coverage data
    const report = this.processCoverageData(coverageData);
    
    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);
    
    // Save report
    await this.generateReport(report, options.output);
    
    return report;
  }
  
  private async runCoverageTests(): Promise<void> {
    try {
      console.log('Running tests with coverage...');
      execSync('pnpm test --coverage', { stdio: 'inherit' });
    } catch (error) {
      console.error('Test execution failed:', error);
      throw error;
    }
  }
  
  private async loadCoverageData(): Promise<any> {
    const coveragePath = join(process.cwd(), 'coverage', 'coverage-summary.json');
    
    if (!existsSync(coveragePath)) {
      throw new Error('Coverage data not found. Run tests with coverage first.');
    }
    
    return JSON.parse(readFileSync(coveragePath, 'utf8'));
  }
  
  private processCoverageData(data: any): CoverageReport {
    const report: CoverageReport = {
      total: this.processTotalCoverage(data),
      byFile: this.processFileCoverage(data),
      uncoveredFiles: [],
      recommendations: []
    };
    
    // Find uncovered files
    report.uncoveredFiles = this.findUncoveredFiles(report.byFile);
    
    return report;
  }
  
  private processTotalCoverage(data: any): CoverageMetrics {
    const total = data.total;
    
    return {
      lines: {
        total: total.lines.total,
        covered: total.lines.covered,
        percentage: total.lines.pct
      },
      functions: {
        total: total.functions.total,
        covered: total.functions.covered,
        percentage: total.functions.pct
      },
      branches: {
        total: total.branches.total,
        covered: total.branches.covered,
        percentage: total.branches.pct
      },
      statements: {
        total: total.statements.total,
        covered: total.statements.covered,
        percentage: total.statements.pct
      }
    };
  }
  
  private processFileCoverage(data: any): FileCoverage[] {
    const files: FileCoverage[] = [];
    
    Object.entries(data).forEach(([filePath, fileData]: [string, any]) => {
      if (filePath === 'total') return;
      
      const fileCoverage: FileCoverage = {
        file: filePath,
        metrics: {
          lines: {
            total: fileData.lines.total,
            covered: fileData.lines.covered,
            percentage: fileData.lines.pct
          },
          functions: {
            total: fileData.functions.total,
            covered: fileData.functions.covered,
            percentage: fileData.functions.pct
          },
          branches: {
            total: fileData.branches.total,
            covered: fileData.branches.covered,
            percentage: fileData.branches.pct
          },
          statements: {
            total: fileData.statements.total,
            covered: fileData.statements.covered,
            percentage: fileData.statements.pct
          }
        },
        complexity: this.calculateComplexity(filePath)
      };
      
      files.push(fileCoverage);
    });
    
    return files.sort((a, b) => b.metrics.lines.percentage - a.metrics.lines.percentage);
  }
  
  private findUncoveredFiles(coveredFiles: FileCoverage[]): string[] {
    // This is a simplified implementation
    // In practice, you'd scan the source directory and compare with covered files
    return [];
  }
  
  private calculateComplexity(filePath: string): number {
    try {
      const content = readFileSync(filePath, 'utf8');
      
      // Simple complexity calculation based on cyclomatic complexity
      let complexity = 1; // Base complexity
      
      // Add complexity for control structures
      const patterns = [
        /if\s*\(/g,
        /else\s*if/g,
        /for\s*\(/g,
        /while\s*\(/g,
        /case\s+/g,
        /catch\s*\(/g,
        /&&/g,
        /\|\|/g
      ];
      
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          complexity += matches.length;
        }
      });
      
      return complexity;
    } catch (error) {
      return 1; // Default complexity
    }
  }
  
  private generateRecommendations(report: CoverageReport): string[] {
    const recommendations: string[] = [];
    
    // Check overall coverage
    if (report.total.lines.percentage < this.threshold) {
      recommendations.push(`Overall line coverage (${report.total.lines.percentage}%) is below threshold (${this.threshold}%)`);
    }
    
    // Check low coverage files
    const lowCoverageFiles = report.byFile.filter(f => f.metrics.lines.percentage < 50);
    if (lowCoverageFiles.length > 0) {
      recommendations.push(`${lowCoverageFiles.length} files have less than 50% coverage`);
    }
    
    // Check complex files with low coverage
    const complexLowCoverage = report.byFile.filter(f => 
      f.complexity > 10 && f.metrics.lines.percentage < 80
    );
    if (complexLowCoverage.length > 0) {
      recommendations.push(`${complexLowCoverage.length} complex files have insufficient coverage`);
    }
    
    // Check function coverage
    if (report.total.functions.percentage < this.threshold) {
      recommendations.push(`Function coverage (${report.total.functions.percentage}%) needs improvement`);
    }
    
    // Check branch coverage
    if (report.total.branches.percentage < this.threshold) {
      recommendations.push(`Branch coverage (${report.total.branches.percentage}%) needs improvement`);
    }
    
    return recommendations;
  }
  
  private async generateReport(report: CoverageReport, outputPath?: string): Promise<void> {
    const enhancedReport = {
      timestamp: new Date().toISOString(),
      summary: {
        overallCoverage: report.total.lines.percentage,
        meetsThreshold: report.total.lines.percentage >= this.threshold,
        totalFiles: report.byFile.length,
        uncoveredFiles: report.uncoveredFiles.length
      },
      metrics: report.total,
      files: report.byFile,
      uncoveredFiles: report.uncoveredFiles,
      recommendations: report.recommendations,
      qualityScore: this.calculateQualityScore(report)
    };
    
    if (outputPath) {
      require('fs').writeFileSync(outputPath, JSON.stringify(enhancedReport, null, 2));
      console.log(`Coverage report saved to ${outputPath}`);
    } else {
      console.log('\n🧪 Test Coverage Report');
      console.log(`Overall Coverage: ${report.total.lines.percentage}%`);
      console.log(`Quality Score: ${enhancedReport.qualityScore}/10`);
      
      if (report.recommendations.length > 0) {
        console.log('\n🔧 Recommendations:');
        report.recommendations.forEach(rec => console.log(`  • ${rec}`));
      }
      
      // Show lowest coverage files
      const worstFiles = report.byFile.slice(-5);
      if (worstFiles.length > 0) {
        console.log('\n📉 Lowest Coverage Files:');
        worstFiles.forEach(file => {
          console.log(`  ${file.file}: ${file.metrics.lines.percentage}%`);
        });
      }
    }
  }
  
  private calculateQualityScore(report: CoverageReport): number {
    let score = 0;
    
    // Coverage score (70% weight)
    const coverageScore = report.total.lines.percentage / 10;
    score += coverageScore * 0.7;
    
    // Function coverage (15% weight)
    const functionScore = report.total.functions.percentage / 10;
    score += functionScore * 0.15;
    
    // Branch coverage (15% weight)
    const branchScore = report.total.branches.percentage / 10;
    score += branchScore * 0.15;
    
    return Math.round(Math.min(10, score));
  }
}

interface CoverageOptions {
  output?: string;
  threshold?: number;
  untested?: boolean;
  trend?: boolean;
  days?: number;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  const analyzer = new CoverageAnalyzer();
  if (options.threshold) {
    analyzer.threshold = options.threshold;
  }
  
  await analyzer.analyze(options);
}

function parseArgs(args: string[]): CoverageOptions {
  const options: CoverageOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--output':
        options.output = args[++i];
        break;
      case '--threshold':
        options.threshold = parseInt(args[++i]);
        break;
      case '--untested':
        options.untested = true;
        break;
      case '--trend':
        options.trend = true;
        break;
      case '--days':
        options.days = parseInt(args[++i]);
        break;
    }
  }
  
  return options;
}

if (require.main === module) {
  main().catch(console.error);
}
```

## Script Integration Patterns

### 1. Multi-Script Orchestration
```typescript
#!/usr/bin/env tsx
/**
 * Comprehensive Code Review Orchestrator
 * 
 * Runs all review scripts and generates consolidated report.
 */

class ReviewOrchestrator {
  async runFullReview(options: ReviewOptions): Promise<void> {
    console.log('🚀 Starting comprehensive code review...');
    
    const results = await Promise.allSettled([
      this.runSecurityReview(options.security),
      this.runPerformanceReview(options.performance),
      this.runArchitectureReview(options.architecture),
      this.runQualityReview(options.quality)
    ]);
    
    const report = this.consolidateResults(results);
    await this.generateFinalReport(report, options.output);
    
    // Exit with appropriate code
    process.exit(report.criticalIssues > 0 ? 1 : 0);
  }
  
  private async runSecurityReview(options: any): Promise<any> {
    console.log('🔒 Running security review...');
    // Execute security script
  }
  
  private async runPerformanceReview(options: any): Promise<any> {
    console.log('⚡ Running performance review...');
    // Execute performance script
  }
  
  private async runArchitectureReview(options: any): Promise<any> {
    console.log('🏗️ Running architecture review...');
    // Execute architecture script
  }
  
  private async runQualityReview(options: any): Promise<any> {
    console.log('🧪 Running quality review...');
    // Execute quality script
  }
  
  private consolidateResults(results: PromiseSettledResult<any>[]): any {
    // Consolidate all review results
  }
  
  private async generateFinalReport(report: any, outputPath?: string): Promise<void> {
    // Generate comprehensive report
  }
}
```

### 2. CI/CD Integration
```yaml
# .github/workflows/code-review.yml
name: Automated Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  security-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Security Review
        run: pnpm run review:security --output=security-report.json
      - name: Upload Security Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.json
  
  performance-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Performance Review
        run: pnpm run review:performance --output=performance-report.json
      - name: Upload Performance Report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: performance-report.json
  
  architecture-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Architecture Review
        run: pnpm run review:architecture --output=architecture-report.json
      - name: Upload Architecture Report
        uses: actions/upload-artifact@v3
        with:
          name: architecture-report
          path: architecture-report.json
  
  quality-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Quality Review
        run: pnpm run review:coverage --output=coverage-report.json
      - name: Upload Quality Report
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage-report.json
  
  consolidate-reports:
    needs: [security-review, performance-review, architecture-review, quality-review]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download All Reports
        uses: actions/download-artifact@v3
      - name: Consolidate Reports
        run: pnpm run review:consolidate --output=final-report.json
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            // Read final report and comment on PR
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
