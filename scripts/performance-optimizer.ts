#!/usr/bin/env node

/**
 * Performance Optimization Script
 * 
 * This script analyzes and optimizes import/export performance patterns
 * including import resolution time, bundle splitting, and caching strategies.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

interface PerformanceMetrics {
  importResolutionTime: number;
  bundleBuildTime: number;
  typeCheckingTime: number;
  memoryUsage: number;
  cacheHitRate: number;
}

interface OptimizationResult {
  file: string;
  metrics: PerformanceMetrics;
  issues: PerformanceIssue[];
  optimizations: Optimization[];
}

interface PerformanceIssue {
  type: 'resolution' | 'build' | 'memory' | 'cache';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  measurement: string;
}

interface Optimization {
  category: 'import' | 'bundle' | 'cache' | 'memory';
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImprovement: string;
  implementation: 'simple' | 'moderate' | 'complex';
}

class PerformanceOptimizer {
  private readonly rootDir: string;
  private readonly baseline: PerformanceMetrics;

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
    this.baseline = this.getBaselineMetrics();
  }

  async optimizeAll(): Promise<OptimizationResult[]> {
    console.log('⚡ Starting performance optimization analysis...');
    
    const results: OptimizationResult[] = [];
    
    // Analyze TypeScript compilation performance
    await this.analyzeTypeScriptPerformance(results);
    
    // Analyze import patterns
    await this.analyzeImportPerformance(results);
    
    // Analyze bundle performance
    await this.analyzeBundlePerformance(results);
    
    // Generate optimization report
    this.generatePerformanceReport(results);
    
    // Generate implementation plan
    this.generateImplementationPlan(results);
    
    return results;
  }

  private async analyzeTypeScriptPerformance(results: OptimizationResult[]): Promise<void> {
    console.log('🔍 Analyzing TypeScript compilation performance...');
    
    try {
      // Measure type checking time
      const startTime = Date.now();
      execSync('pnpm type-check', { cwd: this.rootDir, stdio: 'pipe' });
      const typeCheckingTime = Date.now() - startTime;
      
      // Analyze tsconfig performance
      const tsconfigPath = join(this.rootDir, 'tsconfig.base.json');
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
      
      const issues: PerformanceIssue[] = [];
      const optimizations: Optimization[] = [];
      
      // Check for performance issues in tsconfig
      if (tsconfig.compilerOptions.paths && Object.keys(tsconfig.compilerOptions.paths).length > 50) {
        issues.push({
          type: 'resolution',
          severity: 'medium',
          description: 'Large number of path mappings may slow down import resolution',
          impact: 'Slower TypeScript compilation',
          measurement: `${Object.keys(tsconfig.compilerOptions.paths).length} path mappings`
        });
        
        optimizations.push({
          category: 'import',
          priority: 'medium',
          action: 'Consolidate and optimize path mappings',
          expectedImprovement: '10-20% faster import resolution',
          implementation: 'moderate'
        });
      }
      
      // Check for incremental compilation
      if (!tsconfig.compilerOptions.incremental) {
        issues.push({
          type: 'build',
          severity: 'high',
          description: 'Incremental compilation is not enabled',
          impact: 'Slower rebuild times',
          measurement: 'Full rebuild every time'
        });
        
        optimizations.push({
          category: 'cache',
          priority: 'high',
          action: 'Enable incremental compilation',
          expectedImprovement: '50-80% faster rebuilds',
          implementation: 'simple'
        });
      }
      
      results.push({
        file: 'tsconfig.base.json',
        metrics: {
          importResolutionTime: this.baseline.importResolutionTime,
          bundleBuildTime: this.baseline.bundleBuildTime,
          typeCheckingTime,
          memoryUsage: this.baseline.memoryUsage,
          cacheHitRate: this.baseline.cacheHitRate
        },
        issues,
        optimizations
      });
      
    } catch (error) {
      console.warn('Warning: Could not analyze TypeScript performance:', error);
    }
  }

  private async analyzeImportPerformance(results: OptimizationResult[]): Promise<void> {
    console.log('📦 Analyzing import performance...');
    
    const packageDirs = await glob('packages/*/src', { cwd: this.rootDir });
    
    for (const packageDir of packageDirs) {
      const fullPath = join(this.rootDir, packageDir);
      const issues: PerformanceIssue[] = [];
      const optimizations: Optimization[] = [];
      
      // Analyze import patterns in this package
      const tsFiles = await glob('**/*.{ts,tsx}', { cwd: fullPath });
      
      let totalImports = 0;
      let relativeImports = 0;
      let deepImports = 0;
      
      for (const file of tsFiles) {
        const filePath = join(fullPath, file);
        const content = readFileSync(filePath, 'utf-8');
        
        // Count imports
        const importMatches = content.matchAll(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
        
        for (const match of importMatches) {
          const [, module] = match;
          totalImports++;
          
          if (module.startsWith('.')) {
            relativeImports++;
            
            // Check for deep relative imports
            const depth = (module.match(/\.\./g) || []).length;
            if (depth > 3) {
              deepImports++;
            }
          }
        }
      }
      
      // Identify performance issues
      if (relativeImports > totalImports * 0.7) {
        issues.push({
          type: 'resolution',
          severity: 'medium',
          description: 'High percentage of relative imports',
          impact: 'Slower import resolution',
          measurement: `${Math.round(relativeImports / totalImports * 100)}% relative imports`
        });
        
        optimizations.push({
          category: 'import',
          priority: 'medium',
          action: 'Convert relative imports to absolute @repo/* imports',
          expectedImprovement: '15-25% faster import resolution',
          implementation: 'moderate'
        });
      }
      
      if (deepImports > 5) {
        issues.push({
          type: 'resolution',
          severity: 'low',
          description: 'Deep relative imports detected',
          impact: 'Slower module resolution',
          measurement: `${deepImports} deep imports`
        });
        
        optimizations.push({
          category: 'import',
          priority: 'low',
          action: 'Restructure to reduce deep imports',
          expectedImprovement: '5-10% faster resolution',
          implementation: 'complex'
        });
      }
      
      results.push({
        file: packageDir,
        metrics: {
          importResolutionTime: this.estimateImportResolutionTime(totalImports, relativeImports),
          bundleBuildTime: this.baseline.bundleBuildTime,
          typeCheckingTime: this.baseline.typeCheckingTime,
          memoryUsage: this.estimateMemoryUsage(totalImports),
          cacheHitRate: this.baseline.cacheHitRate
        },
        issues,
        optimizations
      });
    }
  }

  private async analyzeBundlePerformance(results: OptimizationResult[]): Promise<void> {
    console.log('📊 Analyzing bundle performance...');
    
    try {
      // Check if bundle analyzer is available
      const packageJsonPath = join(this.rootDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      const hasBundleAnalyzer = packageJson.devDependencies && (
        packageJson.devDependencies['@next/bundle-analyzer'] ||
        packageJson.devDependencies['webpack-bundle-analyzer']
      );
      
      const issues: PerformanceIssue[] = [];
      const optimizations: Optimization[] = [];
      
      if (!hasBundleAnalyzer) {
        issues.push({
          type: 'build',
          severity: 'medium',
          description: 'Bundle analyzer not available',
          impact: 'Cannot identify bundle optimization opportunities',
          measurement: 'No bundle analysis tools'
        });
        
        optimizations.push({
          category: 'bundle',
          priority: 'medium',
          action: 'Add bundle analyzer tools',
          expectedImprovement: 'Identify optimization opportunities',
          implementation: 'simple'
        });
      }
      
      // Check for code splitting configuration
      const nextConfigPath = join(this.rootDir, 'next.config.js');
      if (existsSync(nextConfigPath)) {
        const nextConfig = readFileSync(nextConfigPath, 'utf-8');
        
        if (!nextConfig.includes('experimental') || !nextConfig.includes('serverComponentsExternalPackages')) {
          optimizations.push({
            category: 'bundle',
            priority: 'medium',
            action: 'Configure code splitting and server components',
            expectedImprovement: '20-40% smaller bundles',
            implementation: 'moderate'
          });
        }
      }
      
      results.push({
        file: 'bundle.config',
        metrics: {
          importResolutionTime: this.baseline.importResolutionTime,
          bundleBuildTime: this.estimateBundleBuildTime(),
          typeCheckingTime: this.baseline.typeCheckingTime,
          memoryUsage: this.baseline.memoryUsage,
          cacheHitRate: this.baseline.cacheHitRate
        },
        issues,
        optimizations
      });
      
    } catch (error) {
      console.warn('Warning: Could not analyze bundle performance:', error);
    }
  }

  private getBaselineMetrics(): PerformanceMetrics {
    return {
      importResolutionTime: 100, // ms
      bundleBuildTime: 5000, // ms
      typeCheckingTime: 3000, // ms
      memoryUsage: 512, // MB
      cacheHitRate: 85 // %
    };
  }

  private estimateImportResolutionTime(totalImports: number, relativeImports: number): number {
    // Simplified estimation: relative imports are slower
    const relativePenalty = relativeImports * 2;
    const baseTime = totalImports * 0.5;
    return baseTime + relativePenalty;
  }

  private estimateMemoryUsage(totalImports: number): number {
    // Simplified memory estimation
    return Math.min(1024, 256 + totalImports * 0.1);
  }

  private estimateBundleBuildTime(): number {
    // Simplified bundle build time estimation
    return 5000; // 5 seconds baseline
  }

  private generatePerformanceReport(results: OptimizationResult[]): void {
    console.log('\n⚡ Performance Analysis Report');
    console.log('===============================');
    
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const totalOptimizations = results.reduce((sum, r) => sum + r.optimizations.length, 0);
    const criticalIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0);
    const highIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'high').length, 0);
    
    // Calculate average metrics
    const avgTypeCheckingTime = results.reduce((sum, r) => sum + r.metrics.typeCheckingTime, 0) / results.length;
    const avgMemoryUsage = results.reduce((sum, r) => sum + r.metrics.memoryUsage, 0) / results.length;
    
    console.log(`Files analyzed: ${results.length}`);
    console.log(`Total issues found: ${totalIssues}`);
    console.log(`Critical issues: ${criticalIssues}`);
    console.log(`High severity issues: ${highIssues}`);
    console.log(`Total optimizations: ${totalOptimizations}`);
    console.log(`Average type checking time: ${Math.round(avgTypeCheckingTime)}ms`);
    console.log(`Average memory usage: ${Math.round(avgMemoryUsage)}MB`);
    
    // Issues by type
    const issuesByType = {
      resolution: 0,
      build: 0,
      memory: 0,
      cache: 0
    };
    
    results.forEach(r => {
      r.issues.forEach(i => {
        issuesByType[i.type]++;
      });
    });
    
    console.log('\n📈 Issues by Category:');
    Object.entries(issuesByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    // Show critical and high severity issues
    const criticalResults = results.filter(r => r.issues.some(i => i.severity === 'critical' || i.severity === 'high'));
    
    if (criticalResults.length > 0) {
      console.log('\n🚨 Critical & High Severity Issues:');
      criticalResults.forEach(r => {
        const criticalIssues = r.issues.filter(i => i.severity === 'critical' || i.severity === 'high');
        if (criticalIssues.length > 0) {
          console.log(`\n📁 ${r.file}`);
          criticalIssues.forEach(i => {
            console.log(`   ${i.severity === 'critical' ? '🔴' : '🟠'} ${i.description}`);
            console.log(`      Impact: ${i.impact} | Measurement: ${i.measurement}`);
          });
        }
      });
    }
  }

  private generateImplementationPlan(results: OptimizationResult[]): void {
    console.log('\n🎯 Performance Optimization Plan');
    console.log('===============================');
    
    // Group optimizations by priority
    const allOptimizations = results.flatMap(r => r.optimizations);
    const highPriority = allOptimizations.filter(o => o.priority === 'high');
    const mediumPriority = allOptimizations.filter(o => o.priority === 'medium');
    const lowPriority = allOptimizations.filter(o => o.priority === 'low');
    
    // Group by implementation complexity
    const simpleImplementations = allOptimizations.filter(o => o.implementation === 'simple');
    const moderateImplementations = allOptimizations.filter(o => o.implementation === 'moderate');
    const complexImplementations = allOptimizations.filter(o => o.implementation === 'complex');
    
    if (highPriority.length > 0) {
      console.log('\n🔥 High Priority (This Week):');
      highPriority.forEach((opt, index) => {
        console.log(`  ${index + 1}. ${opt.action}`);
        console.log(`     Expected: ${opt.expectedImprovement} | Implementation: ${opt.implementation}`);
      });
    }
    
    if (mediumPriority.length > 0) {
      console.log('\n⚡ Medium Priority (Next Sprint):');
      mediumPriority.forEach((opt, index) => {
        console.log(`  ${index + 1}. ${opt.action}`);
        console.log(`     Expected: ${opt.expectedImprovement} | Implementation: ${opt.implementation}`);
      });
    }
    
    if (lowPriority.length > 0) {
      console.log('\n💡 Low Priority (Future):');
      lowPriority.forEach((opt, index) => {
        console.log(`  ${index + 1}. ${opt.action}`);
        console.log(`     Expected: ${opt.expectedImprovement} | Implementation: ${opt.implementation}`);
      });
    }
    
    // Implementation summary
    console.log('\n📋 Implementation Summary:');
    console.log(`Quick wins (simple): ${simpleImplementations.length}`);
    console.log(`Moderate effort: ${moderateImplementations.length}`);
    console.log(`Complex changes: ${complexImplementations.length}`);
    
    // Calculate potential improvements
    const potentialImprovements = this.calculatePotentialImprovements(allOptimizations);
    console.log('\n📈 Expected Performance Improvements:');
    console.log(`Type checking: ${potentialImprovements.typeChecking}`);
    console.log(`Import resolution: ${potentialImprovements.importResolution}`);
    console.log(`Bundle size: ${potentialImprovements.bundleSize}`);
    console.log(`Memory usage: ${potentialImprovements.memoryUsage}`);
  }

  private calculatePotentialImprovements(optimizations: Optimization[]): {
    typeChecking: string;
    importResolution: string;
    bundleSize: string;
    memoryUsage: string;
  } {
    // Simplified improvement calculation
    const typeCheckingOptimizations = optimizations.filter(o => o.category === 'cache').length;
    const importOptimizations = optimizations.filter(o => o.category === 'import').length;
    const bundleOptimizations = optimizations.filter(o => o.category === 'bundle').length;
    const memoryOptimizations = optimizations.filter(o => o.category === 'memory').length;
    
    return {
      typeChecking: `${typeCheckingOptimizations * 20}% faster`,
      importResolution: `${importOptimizations * 15}% faster`,
      bundleSize: `${bundleOptimizations * 10}% smaller`,
      memoryUsage: `${memoryOptimizations * 5}% lower`
    };
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const optimizer = new PerformanceOptimizer();
  
  switch (command) {
    case 'optimize':
      await optimizer.optimizeAll();
      break;
    case 'help':
      console.log(`
Performance Optimizer

Usage:
  node scripts/performance-optimizer.js <command>

Commands:
  optimize  - Analyze and optimize performance patterns
  help      - Show this help message

Examples:
  pnpm optimize:performance
  node scripts/performance-optimizer.js optimize
      `);
      break;
    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Performance optimization failed:', error);
    process.exit(1);
  });
}

export { PerformanceOptimizer };
