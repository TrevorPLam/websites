---
name: automated-review-scripts-chunk-2
description: |
  **SCRIPTING SKILL** - Automated code review scripts for Codex agents (Chunk 2/4).
  USE FOR: Performance analysis, bundle size optimization, and performance monitoring.
  DO NOT USE FOR: Manual review processes - use automation patterns.
  INVOKES: filesystem, git, sequential-thinking, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
chunking:
  total_chunks: 4
  chunk_number: 2
  tokens: 980
  created_at: "2026-02-27T13:28:00.000Z"
  ai_optimized: true
---

# Automated Code Review Scripts - Chunk 2: Performance Review Scripts

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

## Navigation
- Previous: [Chunk 1](automated-review-scripts-chunk-1.md) - Security Review Scripts
- Next: [Chunk 3](automated-review-scripts-chunk-3.md) - Architecture Review Scripts
