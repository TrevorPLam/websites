---
name: automated-review-scripts-chunk-4
description: |
  **SCRIPTING SKILL** - Automated code review scripts for Codex agents (Chunk 4/4).
  USE FOR: Test coverage analysis, quality metrics, and comprehensive reporting.
  DO NOT USE FOR: Manual review processes - use automation patterns.
  INVOKES: filesystem, git, sequential-thinking, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
chunking:
  total_chunks: 4
  chunk_number: 4
  tokens: 920
  created_at: "2026-02-27T13:28:00.000Z"
  ai_optimized: true
---

# Automated Code Review Scripts - Chunk 4: Quality Review Scripts

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
      if (filePath !== 'total') {
        files.push({
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
          complexity: this.calculateComplexity(fileData)
        });
      }
    });
    
    return files;
  }
  
  private calculateComplexity(fileData: any): number {
    // Simple complexity calculation based on coverage metrics
    const lineComplexity = fileData.lines.total / 10;
    const branchComplexity = fileData.branches.total * 2;
    const functionComplexity = fileData.functions.total * 3;
    
    return Math.round(lineComplexity + branchComplexity + functionComplexity);
  }
  
  private findUncoveredFiles(fileCoverage: FileCoverage[]): string[] {
    return fileCoverage
      .filter(file => file.metrics.lines.percentage === 0)
      .map(file => file.file);
  }
  
  private generateRecommendations(report: CoverageReport): string[] {
    const recommendations: string[] = [];
    
    // Check overall coverage
    if (report.total.lines.percentage < this.threshold) {
      recommendations.push(`Overall line coverage (${report.total.lines.percentage}%) is below threshold (${this.threshold}%)`);
    }
    
    if (report.total.functions.percentage < this.threshold) {
      recommendations.push(`Function coverage (${report.total.functions.percentage}%) is below threshold (${this.threshold}%)`);
    }
    
    if (report.total.branches.percentage < this.threshold) {
      recommendations.push(`Branch coverage (${report.total.branches.percentage}%) is below threshold (${this.threshold}%)`);
    }
    
    // Check for uncovered files
    if (report.uncoveredFiles.length > 0) {
      recommendations.push(`${report.uncoveredFiles.length} files have zero test coverage`);
    }
    
    // Check for low coverage files
    const lowCoverageFiles = report.byFile.filter(file => 
      file.metrics.lines.percentage < 50 && file.metrics.lines.total > 10
    );
    
    if (lowCoverageFiles.length > 0) {
      recommendations.push(`${lowCoverageFiles.length} files have less than 50% line coverage`);
    }
    
    return recommendations;
  }
  
  private async generateReport(report: CoverageReport, outputPath?: string): Promise<void> {
    const reportData = {
      timestamp: new Date().toISOString(),
      threshold: this.threshold,
      meetsThreshold: report.total.lines.percentage >= this.threshold,
      summary: {
        total: report.total,
        files: {
          total: report.byFile.length,
          uncovered: report.uncoveredFiles.length,
          lowCoverage: report.byFile.filter(f => f.metrics.lines.percentage < 50).length
        }
      },
      recommendations: report.recommendations,
      qualityScore: this.calculateQualityScore(report)
    };
    
    if (outputPath) {
      require('fs').writeFileSync(outputPath, JSON.stringify(reportData, null, 2));
      console.log(`Coverage report saved to ${outputPath}`);
    } else {
      console.log('\n🧪 Test Coverage Report');
      console.log(`Line Coverage: ${report.total.lines.percentage}%`);
      console.log(`Function Coverage: ${report.total.functions.percentage}%`);
      console.log(`Branch Coverage: ${report.total.branches.percentage}%`);
      console.log(`Statement Coverage: ${report.total.statements.percentage}%`);
      console.log(`Quality Score: ${reportData.qualityScore}/10`);
      
      if (report.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        report.recommendations.forEach(rec => console.log(`  • ${rec}`));
      }
    }
  }
  
  private calculateQualityScore(report: CoverageReport): number {
    let score = 10;
    
    // Deduct points for coverage below threshold
    const coveragePenalty = Math.max(0, (this.threshold - report.total.lines.percentage) / 10);
    score -= Math.min(5, coveragePenalty);
    
    // Deduct points for uncovered files
    score -= Math.min(3, report.uncoveredFiles.length * 0.5);
    
    // Deduct points for low coverage files
    const lowCoverageFiles = report.byFile.filter(f => f.metrics.lines.percentage < 50);
    score -= Math.min(2, lowCoverageFiles.length * 0.2);
    
    return Math.max(0, Math.round(score));
  }
}

interface CoverageOptions {
  threshold?: number;
  output?: string;
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
      case '--threshold':
        options.threshold = parseInt(args[++i]);
        break;
      case '--output':
        options.output = args[++i];
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

## Integration and Usage

### Complete Workflow Integration
```bash
# Run complete review suite
pnpm run review:full --report=full-review.json

# Run specific review types
pnpm run review:security && pnpm run review:architecture && pnpm run review:coverage

# Generate executive summary
pnpm run review:summary --format=markdown --output=review-summary.md
```

### CI/CD Integration
```yaml
# .github/workflows/code-review.yml
name: Automated Code Review
on: [push, pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run security review
        run: pnpm run review:security --output=security-report.json
      
      - name: Run architecture review
        run: pnpm run review:architecture --output=architecture-report.json
      
      - name: Run coverage analysis
        run: pnpm run review:coverage --output=coverage-report.json
      
      - name: Generate summary
        run: pnpm run review:summary --output=review-summary.md
      
      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: review-reports
          path: |
            security-report.json
            architecture-report.json
            coverage-report.json
            review-summary.md
```

## Navigation
- Previous: [Chunk 3](automated-review-scripts-chunk-3.md) - Architecture Review Scripts
- Index: [automated-review-scripts-index.md](automated-review-scripts-index.md)
