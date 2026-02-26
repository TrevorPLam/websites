---
name: skill-discovery-automation
description: |
  **SCRIPTING SKILL** - Automated skill discovery scripts for Codex agents.
  USE FOR: Skill scanning, pattern recognition, capability mapping, and optimization.
  DO NOT USE FOR: Manual discovery processes - use automation patterns.
  INVOKES: filesystem, git, azure-mcp, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
---

# Skill Discovery Automation Scripts

## Overview
This skill provides Codex-optimized automation scripts for comprehensive skill discovery processes in the marketing websites monorepo.

## Available Scripts

### 1. Skill Discovery Scanner

#### Basic Usage
```bash
# Scan all skill directories
pnpm run discover:scan --paths=skills/

# Scan specific directories
pnpm run discover:scan --paths=skills/codex/,skills/claude/

# Scan with specific file types
pnpm run discover:scan --paths=skills/ --types=md,json,yml

# Generate detailed report
pnpm run discover:scan --paths=skills/ --report-format=html --output=discovery-report.html
```

#### Script Implementation
```typescript
#!/usr/bin/env tsx
/**
 * Skill Discovery Scanner
 * 
 * Scans skill directories, analyzes patterns, and generates comprehensive discovery reports.
 * Supports multiple file types, pattern recognition, and capability mapping.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { writeFileSync } from 'fs';

interface ScanConfig {
  paths: string[];
  types: string[];
  output: string;
  reportFormat: 'json' | 'html' | 'text';
  verbose: boolean;
  includeHidden: boolean;
  maxDepth: number;
}

interface DiscoveredSkill {
  name: string;
  filePath: string;
  fileType: string;
  size: number;
  lastModified: Date;
  metadata: SkillMetadata;
  content: string;
  patterns: SkillPattern[];
  capabilities: string[];
  confidence: number;
  quality: QualityMetrics;
}

interface SkillMetadata {
  name?: string;
  description?: string;
  category?: string;
  expertise?: string;
  version?: string;
  author?: string;
  invokes?: string[];
  meta?: Record<string, any>;
}

interface SkillPattern {
  type: 'workflow' | 'reference' | 'scripting' | 'agent';
  confidence: number;
  evidence: string[];
  indicators: string[];
}

interface QualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  discoverability: number;
  overall: number;
}

class SkillDiscoveryScanner {
  private config: ScanConfig;
  private discoveredSkills: DiscoveredSkill[] = [];
  private startTime: Date;
  
  constructor(config: ScanConfig) {
    this.config = config;
    this.startTime = new Date();
  }
  
  async scan(): Promise<DiscoveryReport> {
    console.log('🔍 Starting skill discovery scan...');
    
    try {
      // Scan all specified paths
      for (const scanPath of this.config.paths) {
        await this.scanDirectory(scanPath, 0);
      }
      
      // Analyze discovered skills
      await this.analyzeSkills();
      
      // Generate report
      const report = await this.generateReport();
      
      // Save report
      await this.saveReport(report);
      
      console.log(`✅ Discovery completed. Found ${this.discoveredSkills.length} skills.`);
      
      return report;
    } catch (error) {
      console.error('❌ Discovery scan failed:', error);
      throw error;
    }
  }
  
  private async scanDirectory(directory: string, depth: number): Promise<void> {
    if (depth > this.config.maxDepth) {
      return;
    }
    
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.scanDirectory(fullPath, depth + 1);
        } else if (entry.isFile()) {
          // Process skill files
          await this.processFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${directory}:`, error);
    }
  }
  
  private async processFile(filePath: string): Promise<void> {
    try {
      // Check file type
      const ext = extname(filePath).toLowerCase();
      
      if (!this.config.types.includes(ext)) {
        return;
      }
      
      // Check if hidden file
      const fileName = basename(filePath);
      if (!this.config.includeHidden && fileName.startsWith('.')) {
        return;
      }
      
      // Read file content
      const content = await readFile(filePath, 'utf-8');
      const stats = await stat(filePath);
      
      // Extract metadata
      const metadata = this.extractMetadata(content);
      
      // Create discovered skill
      const skill: DiscoveredSkill = {
        name: metadata.name || this.generateSkillName(filePath),
        filePath,
        fileType: ext,
        size: stats.size,
        lastModified: stats.mtime,
        metadata,
        content,
        patterns: [],
        capabilities: [],
        confidence: 0,
        quality: this.calculateQuality(content, metadata)
      };
      
      this.discoveredSkills.push(skill);
      
      if (this.config.verbose) {
        console.log(`📄 Discovered skill: ${skill.name}`);
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }
  
  private extractMetadata(content: string): SkillMetadata {
    const metadata: SkillMetadata = {};
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (frontmatterMatch) {
      try {
        const frontmatter = this.parseYaml(frontmatterMatch[1]);
        Object.assign(metadata, frontmatter);
      } catch (error) {
        console.warn('Failed to parse frontmatter:', error);
      }
    }
    
    return metadata;
  }
  
  private parseYaml(yaml: string): any {
    // Simple YAML parser for frontmatter
    const lines = yaml.split('\n');
    const result: any = {};
    
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        
        // Handle different value types
        if (value.startsWith('"') && value.endsWith('"')) {
          result[key] = value.slice(1, -1);
        } else if (value === 'true' || value === 'false') {
          result[key] = value === 'true';
        } else if (!isNaN(Number(value))) {
          result[key] = Number(value);
        } else if (value.startsWith('[') && value.endsWith(']')) {
          result[key] = value.slice(1, -1).split(',').map(v => v.trim());
        } else {
          result[key] = value;
        }
      }
    }
    
    return result;
  }
  
  private generateSkillName(filePath: string): string {
    const fileName = basename(filePath);
    const nameWithoutExt = fileName.replace(/\.[^.]+$/, '');
    return nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  private calculateQuality(content: string, metadata: SkillMetadata): QualityMetrics {
    const quality: QualityMetrics = {
      completeness: 0,
      accuracy: 0,
      consistency: 0,
      discoverability: 0,
      overall: 0
    };
    
    // Completeness: Check required fields
    const requiredFields = ['name', 'description', 'category'];
    const presentFields = requiredFields.filter(field => metadata[field as keyof SkillMetadata]);
    quality.completeness = presentFields.length / requiredFields.length;
    
    // Accuracy: Check content structure and validity
    const hasStructure = content.includes('##') || content.includes('###');
    const hasExamples = content.includes('```') || content.includes('Example');
    quality.accuracy = hasStructure ? 0.8 : 0.4;
    if (hasExamples) quality.accuracy += 0.2;
    
    // Consistency: Check naming conventions and format
    const hasConsistentNaming = metadata.name && metadata.name.length > 0;
    const hasProperFormatting = content.includes('---') && content.includes('---');
    quality.consistency = hasConsistentNaming ? 0.5 : 0;
    if (hasProperFormatting) quality.consistency += 0.5;
    
    // Discoverability: Check for search-friendly elements
    const hasKeywords = metadata.description && metadata.description.length > 50;
    const hasTags = metadata.meta && Object.keys(metadata.meta).length > 0;
    quality.discoverability = hasKeywords ? 0.5 : 0;
    if (hasTags) quality.discoverability += 0.5;
    
    // Overall quality
    quality.overall = (
      quality.completeness + 
      quality.accuracy + 
      quality.consistency + 
      quality.discoverability
    ) / 4;
    
    return quality;
  }
  
  private async analyzeSkills(): Promise<void> {
    console.log('🧠 Analyzing discovered skills...');
    
    for (const skill of this.discoveredSkills) {
      // Recognize patterns
      skill.patterns = this.recognizePatterns(skill);
      
      // Map capabilities
      skill.capabilities = this.mapCapabilities(skill);
      
      // Calculate confidence
      skill.confidence = this.calculateConfidence(skill);
    }
  }
  
  private recognizePatterns(skill: DiscoveredSkill): SkillPattern[] {
    const patterns: SkillPattern[] = [];
    const content = skill.content.toLowerCase();
    const metadata = skill.metadata;
    
    // Workflow pattern
    const workflowIndicators = [
      'workflow steps', 'prerequisites', 'error handling', 'success criteria',
      'step 1', 'step 2', 'step 3', 'execution', 'process'
    ];
    
    const workflowMatches = workflowIndicators.filter(indicator => 
      content.includes(indicator)
    );
    
    if (workflowMatches.length >= 3) {
      patterns.push({
        type: 'workflow',
        confidence: workflowMatches.length / workflowIndicators.length,
        evidence: workflowMatches,
        indicators: ['step-by-step', 'process-automation', 'error-handling']
      });
    }
    
    // Reference pattern
    const referenceIndicators = [
      'overview', 'usage guidelines', 'best practices', 'examples',
      'references', 'documentation', 'guide', 'tutorial'
    ];
    
    const referenceMatches = referenceIndicators.filter(indicator => 
      content.includes(indicator)
    );
    
    if (referenceMatches.length >= 3) {
      patterns.push({
        type: 'reference',
        confidence: referenceMatches.length / referenceIndicators.length,
        evidence: referenceMatches,
        indicators: ['documentation', 'guidance', 'reference-material']
      });
    }
    
    // Scripting pattern
    const scriptingIndicators = [
      'usage', 'script arguments', 'implementation', 'examples',
      'troubleshooting', 'automation', 'cli', 'command'
    ];
    
    const scriptingMatches = scriptingIndicators.filter(indicator => 
      content.includes(indicator)
    );
    
    if (scriptingMatches.length >= 3) {
      patterns.push({
        type: 'scripting',
        confidence: scriptingMatches.length / scriptingIndicators.length,
        evidence: scriptingMatches,
        indicators: ['automation', 'executable-code', 'cli-tools']
      });
    }
    
    // Agent pattern
    const agentIndicators = [
      'agent configuration', 'behavior patterns', 'optimization',
      'integration', 'coordination', 'specialization'
    ];
    
    const agentMatches = agentIndicators.filter(indicator => 
      content.includes(indicator)
    );
    
    if (agentMatches.length >= 2) {
      patterns.push({
        type: 'agent',
        confidence: agentMatches.length / agentIndicators.length,
        evidence: agentMatches,
        indicators: ['agent-behavior', 'coordination', 'specialization']
      });
    }
    
    return patterns;
  }
  
  private mapCapabilities(skill: DiscoveredSkill): string[] {
    const capabilities: string[] = [];
    const content = skill.content.toLowerCase();
    const metadata = skill.metadata;
    
    // Direct keyword mapping
    const capabilityKeywords = new Map([
      ['infrastructure', ['terraform', 'azure', 'docker', 'kubernetes']],
      ['development', ['git', 'github', 'vscode', 'eslint', 'testing']],
      ['deployment', ['ci-cd', 'azure-pipelines', 'github-actions', 'vercel']],
      ['monitoring', ['prometheus', 'grafana', 'sentry', 'datadog']],
      ['security', ['oauth-2.1', 'rbac', 'encryption', 'ssl']],
      ['database', ['postgresql', 'mysql', 'mongodb', 'redis']],
      ['api', ['rest', 'graphql', 'webhook', 'api-gateway']],
      ['testing', ['unit', 'integration', 'e2e', 'performance']],
      ['content', ['cms', 'headless', 'static-site', 'markdown']],
      ['marketing', ['seo', 'analytics', 'email-marketing', 'campaign']],
      ['integration', ['mcp', 'webhook', 'api-integration', 'data-sync']]
    ]);
    
    for (const [capability, keywords] of capabilityKeywords) {
      const matches = keywords.filter(keyword => content.includes(keyword));
      if (matches.length > 0) {
        capabilities.push(capability);
      }
    }
    
    // Category-based mapping
    if (metadata.category) {
      const categoryCapabilities = this.getCategoryCapabilities(metadata.category);
      capabilities.push(...categoryCapabilities);
    }
    
    // Tool-based mapping
    if (metadata.invokes) {
      const toolCapabilities = this.getToolCapabilities(metadata.invokes);
      capabilities.push(...toolCapabilities);
    }
    
    return [...new Set(capabilities)]; // Remove duplicates
  }
  
  private getCategoryCapabilities(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      'workflow': ['automation', 'process-automation', 'workflow-orchestration'],
      'reference': ['documentation', 'guides', 'templates', 'best-practices'],
      'scripting': ['automation', 'cli-tools', 'executable-code'],
      'technical': ['infrastructure', 'development', 'deployment', 'monitoring'],
      'business': ['marketing', 'sales', 'analytics', 'content'],
      'integration': ['api', 'webhook', 'data-sync', 'third-party'],
      'security': ['authentication', 'authorization', 'encryption', 'audit'],
      'agent-config': ['agent-behavior', 'coordination', 'specialization']
    };
    
    return categoryMap[category] || [];
  }
  
  private getToolCapabilities(tools: string[]): string[] {
    const toolCapabilities: Record<string, string[]> = {
      'azure-mcp': ['azure-cli', 'azure-powershell', 'resource-management'],
      'github': ['git', 'repository-management', 'issue-tracking', 'code-review'],
      'filesystem': ['file-operations', 'directory-scanning', 'file-analysis'],
      'observability': ['monitoring', 'logging', 'alerting', 'metrics'],
      'sequential-thinking': ['reasoning', 'analysis', 'decision-support'],
      'knowledge-graph': ['memory', 'learning', 'knowledge-management']
    };
    
    const capabilities: string[] = [];
    
    for (const tool of tools) {
      const toolCaps = toolCapabilities[tool] || [];
      capabilities.push(...toolCaps);
    }
    
    return capabilities;
  }
  
  private calculateConfidence(skill: DiscoveredSkill): number {
    let confidence = 0;
    
    // Pattern confidence
    if (skill.patterns.length > 0) {
      const avgPatternConfidence = skill.patterns.reduce((sum, pattern) => 
        sum + pattern.confidence, 0
      ) / skill.patterns.length;
      confidence += avgPatternConfidence * 0.4;
    }
    
    // Capability confidence
    if (skill.capabilities.length > 0) {
      confidence += 0.3;
    }
    
    // Quality confidence
    confidence += skill.quality.overall * 0.3;
    
    return Math.min(confidence, 1.0);
  }
  
  private async generateReport(): Promise<DiscoveryReport> {
    const duration = Date.now() - this.startTime.getTime();
    
    const report: DiscoveryReport = {
      summary: {
        totalSkills: this.discoveredSkills.length,
        scanDuration: duration,
        scanPaths: this.config.paths,
        timestamp: new Date(),
        averageQuality: this.calculateAverageQuality(),
        averageConfidence: this.calculateAverageConfidence()
      },
      skills: this.discoveredSkills,
      statistics: this.calculateStatistics(),
      recommendations: this.generateRecommendations(),
      metadata: {
        scannerVersion: '1.0.0',
        config: this.config
      }
    };
    
    return report;
  }
  
  private calculateAverageQuality(): number {
    if (this.discoveredSkills.length === 0) return 0;
    
    const totalQuality = this.discoveredSkills.reduce((sum, skill) => 
      sum + skill.quality.overall, 0
    );
    
    return totalQuality / this.discoveredSkills.length;
  }
  
  private calculateAverageConfidence(): number {
    if (this.discoveredSkills.length === 0) return 0;
    
    const totalConfidence = this.discoveredSkills.reduce((sum, skill) => 
      sum + skill.confidence, 0
    );
    
    return totalConfidence / this.discoveredSkills.length;
  }
  
  private calculateStatistics(): DiscoveryStatistics {
    const stats: DiscoveryStatistics = {
      fileTypes: {},
      categories: {},
      patterns: {},
      capabilities: {},
      qualityDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
      confidenceDistribution: { high: 0, medium: 0, low: 0 }
    };
    
    for (const skill of this.discoveredSkills) {
      // File types
      stats.fileTypes[skill.fileType] = (stats.fileTypes[skill.fileType] || 0) + 1;
      
      // Categories
      if (skill.metadata.category) {
        stats.categories[skill.metadata.category] = (stats.categories[skill.metadata.category] || 0) + 1;
      }
      
      // Patterns
      for (const pattern of skill.patterns) {
        stats.patterns[pattern.type] = (stats.patterns[pattern.type] || 0) + 1;
      }
      
      // Capabilities
      for (const capability of skill.capabilities) {
        stats.capabilities[capability] = (stats.capabilities[capability] || 0) + 1;
      }
      
      // Quality distribution
      const quality = skill.quality.overall;
      if (quality >= 0.8) stats.qualityDistribution.excellent++;
      else if (quality >= 0.6) stats.qualityDistribution.good++;
      else if (quality >= 0.4) stats.qualityDistribution.fair++;
      else stats.qualityDistribution.poor++;
      
      // Confidence distribution
      const confidence = skill.confidence;
      if (confidence >= 0.8) stats.confidenceDistribution.high++;
      else if (confidence >= 0.5) stats.confidenceDistribution.medium++;
      else stats.confidenceDistribution.low++;
    }
    
    return stats;
  }
  
  private generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Quality recommendations
    const lowQualitySkills = this.discoveredSkills.filter(skill => 
      skill.quality.overall < 0.5
    );
    
    if (lowQualitySkills.length > 0) {
      recommendations.push({
        type: 'quality-improvement',
        priority: 'high',
        description: `${lowQualitySkills.length} skills need quality improvement`,
        affectedSkills: lowQualitySkills.map(s => s.name),
        suggestions: [
          'Add missing metadata fields',
          'Improve content structure',
          'Add examples and use cases',
          'Enhance descriptions'
        ]
      });
    }
    
    // Capability gaps
    const allCapabilities = this.getAllPossibleCapabilities();
    const mappedCapabilities = new Set(
      this.discoveredSkills.flatMap(skill => skill.capabilities)
    );
    const missingCapabilities = allCapabilities.filter(cap => !mappedCapabilities.has(cap));
    
    if (missingCapabilities.length > 0) {
      recommendations.push({
        type: 'capability-gaps',
        priority: 'medium',
        description: `${missingCapabilities.length} capabilities not covered`,
        affectedCapabilities: missingCapabilities,
        suggestions: [
          'Create skills for missing capabilities',
          'Enhance existing skills to cover gaps',
          'Consider capability consolidation'
        ]
      });
    }
    
    // Pattern optimization
    const noPatternSkills = this.discoveredSkills.filter(skill => 
      skill.patterns.length === 0
    );
    
    if (noPatternSkills.length > 0) {
      recommendations.push({
        type: 'pattern-optimization',
        priority: 'medium',
        description: `${noPatternSkills.length} skills lack clear patterns`,
        affectedSkills: noPatternSkills.map(s => s.name),
        suggestions: [
          'Add clear skill structure',
          'Include workflow steps or examples',
          'Enhance metadata for better recognition'
        ]
      });
    }
    
    return recommendations;
  }
  
  private getAllPossibleCapabilities(): string[] {
    return [
      'infrastructure', 'development', 'deployment', 'monitoring', 'testing', 'security',
      'database', 'api', 'content', 'marketing', 'integration', 'automation',
      'documentation', 'guides', 'cli-tools', 'agent-behavior', 'coordination'
    ];
  }
  
  private async saveReport(report: DiscoveryReport): Promise<void> {
    let content: string;
    
    switch (this.config.reportFormat) {
      case 'json':
        content = JSON.stringify(report, null, 2);
        break;
      case 'html':
        content = this.generateHTMLReport(report);
        break;
      case 'text':
        content = this.generateTextReport(report);
        break;
      default:
        content = JSON.stringify(report, null, 2);
    }
    
    writeFileSync(this.config.output, content, 'utf-8');
    console.log(`📄 Report saved to: ${this.config.output}`);
  }
  
  private generateHTMLReport(report: DiscoveryReport): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Skill Discovery Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric { background: #e9ecef; padding: 15px; border-radius: 5px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #495057; }
        .metric .value { font-size: 2em; font-weight: bold; color: #007bff; }
        .skills-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .skills-table th, .skills-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .skills-table th { background-color: #f2f2f2; }
        .quality-excellent { color: #28a745; }
        .quality-good { color: #17a2b8; }
        .quality-fair { color: #ffc107; }
        .quality-poor { color: #dc3545; }
        .recommendations { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Skill Discovery Report</h1>
        <p>Generated: ${report.summary.timestamp.toISOString()}</p>
        <p>Scan Duration: ${report.summary.scanDuration}ms</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Total Skills</h3>
            <div class="value">${report.summary.totalSkills}</div>
        </div>
        <div class="metric">
            <h3>Average Quality</h3>
            <div class="value">${(report.summary.averageQuality * 100).toFixed(1)}%</div>
        </div>
        <div class="metric">
            <h3>Average Confidence</h3>
            <div class="value">${(report.summary.averageConfidence * 100).toFixed(1)}%</div>
        </div>
        <div class="metric">
            <h3>Categories</h3>
            <div class="value">${Object.keys(report.statistics.categories).length}</div>
        </div>
    </div>
    
    <h2>Discovered Skills</h2>
    <table class="skills-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Pattern</th>
                <th>Capabilities</th>
                <th>Quality</th>
                <th>Confidence</th>
            </tr>
        </thead>
        <tbody>
            ${report.skills.map(skill => `
                <tr>
                    <td>${skill.name}</td>
                    <td>${skill.metadata.category || 'N/A'}</td>
                    <td>${skill.patterns.map(p => p.type).join(', ') || 'N/A'}</td>
                    <td>${skill.capabilities.slice(0, 3).join(', ')}${skill.capabilities.length > 3 ? '...' : ''}</td>
                    <td class="quality-${this.getQualityClass(skill.quality.overall)}">${(skill.quality.overall * 100).toFixed(1)}%</td>
                    <td>${(skill.confidence * 100).toFixed(1)}%</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <h2>Recommendations</h2>
    <div class="recommendations">
        ${report.recommendations.map(rec => `
            <div style="margin-bottom: 15px;">
                <h4>${rec.description}</h4>
                <p><strong>Priority:</strong> ${rec.priority}</p>
                <ul>
                    ${rec.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }
  
  private generateTextReport(report: DiscoveryReport): string {
    return `
Skill Discovery Report
=====================

Summary:
--------
Total Skills: ${report.summary.totalSkills}
Scan Duration: ${report.summary.scanDuration}ms
Average Quality: ${(report.summary.averageQuality * 100).toFixed(1)}%
Average Confidence: ${(report.summary.averageConfidence * 100).toFixed(1)}%

Skills:
-------
${report.skills.map(skill => `
${skill.name}
- Category: ${skill.metadata.category || 'N/A'}
- Pattern: ${skill.patterns.map(p => p.type).join(', ') || 'N/A'}
- Capabilities: ${skill.capabilities.join(', ')}
- Quality: ${(skill.quality.overall * 100).toFixed(1)}%
- Confidence: ${(skill.confidence * 100).toFixed(1)}%
`).join('\n')}

Recommendations:
---------------
${report.recommendations.map(rec => `
${rec.description}
Priority: ${rec.priority}
Suggestions:
${rec.suggestions.map(s => `- ${s}`).join('\n')}
`).join('\n')}
`;
  }
  
  private getQualityClass(quality: number): string {
    if (quality >= 0.8) return 'excellent';
    if (quality >= 0.6) return 'good';
    if (quality >= 0.4) return 'fair';
    return 'poor';
  }
}

interface DiscoveryReport {
  summary: {
    totalSkills: number;
    scanDuration: number;
    scanPaths: string[];
    timestamp: Date;
    averageQuality: number;
    averageConfidence: number;
  };
  skills: DiscoveredSkill[];
  statistics: DiscoveryStatistics;
  recommendations: Recommendation[];
  metadata: {
    scannerVersion: string;
    config: ScanConfig;
  };
}

interface DiscoveryStatistics {
  fileTypes: Record<string, number>;
  categories: Record<string, number>;
  patterns: Record<string, number>;
  capabilities: Record<string, number>;
  qualityDistribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

interface Recommendation {
  type: string;
  priority: string;
  description: string;
  affectedSkills?: string[];
  affectedCapabilities?: string[];
  suggestions: string[];
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);
  
  const scanner = new SkillDiscoveryScanner(config);
  await scanner.scan();
}

function parseArgs(args: string[]): ScanConfig {
  const config: ScanConfig = {
    paths: ['skills/'],
    types: ['.md', '.json', '.yml'],
    output: 'discovery-report.json',
    reportFormat: 'json',
    verbose: false,
    includeHidden: false,
    maxDepth: 10
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--paths':
        config.paths = args[++i]?.split(',') || [];
        break;
      case '--types':
        config.types = args[++i]?.split(',') || [];
        break;
      case '--output':
        config.output = args[++i] || 'discovery-report.json';
        break;
      case '--report-format':
        config.reportFormat = args[++i] as any || 'json';
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--include-hidden':
        config.includeHidden = true;
        break;
      case '--max-depth':
        config.maxDepth = parseInt(args[++i]) || 10;
        break;
    }
  }
  
  return config;
}

if (require.main === module) {
  main().catch(console.error);
}
```

### 2. Pattern Recognition Engine

#### Basic Usage
```bash
# Run pattern recognition on discovered skills
pnpm run discover:patterns --input=discovery-report.json --output=patterns-report.json

# Analyze specific patterns
pnpm run discover:patterns --patterns=workflow,reference --confidence-threshold=0.7

# Generate pattern analysis report
pnpm run discover:patterns --report-format=html --output=patterns-analysis.html
```

#### Script Implementation
```typescript
#!/usr/bin/env tsx
/**
 * Pattern Recognition Engine
 * 
 * Analyzes discovered skills to identify patterns, calculate confidence scores,
 * and generate pattern-based recommendations.
 */

import { readFile, writeFileSync } from 'fs';
import { join } from 'path';

interface PatternConfig {
  input: string;
  output: string;
  patterns: string[];
  confidenceThreshold: number;
  reportFormat: 'json' | 'html' | 'text';
  verbose: boolean;
}

interface PatternAnalysis {
  patterns: PatternResult[];
  statistics: PatternStatistics;
  recommendations: PatternRecommendation[];
  metadata: {
    analyzerVersion: string;
    config: PatternConfig;
    timestamp: Date;
  };
}

interface PatternResult {
  skill: string;
  patterns: RecognizedPattern[];
  confidence: number;
  evidence: string[];
  gaps: string[];
  suggestions: string[];
}

interface RecognizedPattern {
  type: string;
  confidence: number;
  evidence: string[];
  indicators: string[];
  metadata: Record<string, any>;
}

interface PatternStatistics {
  totalSkills: number;
  patternDistribution: Record<string, number>;
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  averageConfidence: number;
  mostCommonPattern: string;
  leastCommonPattern: string;
}

interface PatternRecommendation {
  type: string;
  priority: string;
  description: string;
  affectedSkills: string[];
  suggestions: string[];
  impact: string;
}

class PatternRecognitionEngine {
  private config: PatternConfig;
  private skills: DiscoveredSkill[] = [];
  private patternDefinitions: Map<string, PatternDefinition> = new Map();
  
  constructor(config: PatternConfig) {
    this.config = config;
    this.initializePatternDefinitions();
  }
  
  async analyze(): Promise<PatternAnalysis> {
    console.log('🧠 Starting pattern recognition analysis...');
    
    try {
      // Load discovered skills
      await this.loadSkills();
      
      // Analyze patterns
      const results = await this.analyzePatterns();
      
      // Generate statistics
      const statistics = this.generateStatistics(results);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(results);
      
      // Create analysis report
      const analysis: PatternAnalysis = {
        patterns: results,
        statistics,
        recommendations,
        metadata: {
          analyzerVersion: '1.0.0',
          config: this.config,
          timestamp: new Date()
        }
      };
      
      // Save analysis
      await this.saveAnalysis(analysis);
      
      console.log(`✅ Pattern analysis completed for ${this.skills.length} skills.`);
      
      return analysis;
    } catch (error) {
      console.error('❌ Pattern analysis failed:', error);
      throw error;
    }
  }
  
  private async loadSkills(): Promise<void> {
    try {
      const data = await readFile(this.config.input, 'utf-8');
      const report = JSON.parse(data);
      
      this.skills = report.skills || [];
      
      if (this.config.verbose) {
        console.log(`📄 Loaded ${this.skills.length} skills from ${this.config.input}`);
      }
    } catch (error) {
      throw new Error(`Failed to load skills from ${this.config.input}: ${error.message}`);
    }
  }
  
  private initializePatternDefinitions(): void {
    // Workflow pattern
    this.patternDefinitions.set('workflow', {
      name: 'workflow',
      description: 'Multi-step process automation',
      indicators: [
        { type: 'content', pattern: /workflow steps|prerequisites|error handling|success criteria/i, weight: 0.3 },
        { type: 'content', pattern: /step \d+|execution|process/i, weight: 0.2 },
        { type: 'content', pattern: /validation|rollback|recovery/i, weight: 0.2 },
        { type: 'metadata', pattern: /workflow|automation|process/i, weight: 0.3 }
      ],
      requiredIndicators: 2,
      minConfidence: 0.6
    });
    
    // Reference pattern
    this.patternDefinitions.set('reference', {
      name: 'reference',
      description: 'Documentation and reference material',
      indicators: [
        { type: 'content', pattern: /overview|usage guidelines|best practices|examples/i, weight: 0.3 },
        { type: 'content', pattern: /documentation|guide|tutorial|reference/i, weight: 0.2 },
        { type: 'content', pattern: /see also|related|further reading/i, weight: 0.2 },
        { type: 'metadata', pattern: /reference|docs|documentation/i, weight: 0.3 }
      ],
      requiredIndicators: 2,
      minConfidence: 0.6
    });
    
    // Scripting pattern
    this.patternDefinitions.set('scripting', {
      name: 'scripting',
      description: 'Automation scripts and executable code',
      indicators: [
        { type: 'content', pattern: /usage|script arguments|implementation|examples/i, weight: 0.3 },
        { type: 'content', pattern: /troubleshooting|automation|cli|command/i, weight: 0.2 },
        { type: 'content', pattern: /```typescript|```javascript|```bash|```python/i, weight: 0.3 },
        { type: 'metadata', pattern: /scripting|automation|cli/i, weight: 0.2 }
      ],
      requiredIndicators: 2,
      minConfidence: 0.6
    });
    
    // Agent pattern
    this.patternDefinitions.set('agent', {
      name: 'agent',
      description: 'Agent configuration and behavior',
      indicators: [
        { type: 'content', pattern: /agent configuration|behavior patterns|optimization/i, weight: 0.3 },
        { type: 'content', pattern: /integration|coordination|specialization/i, weight: 0.2 },
        { type: 'content', pattern: /interface|implementation|configuration/i, weight: 0.2 },
        { type: 'metadata', pattern: /agent|behavior|coordination/i, weight: 0.3 }
      ],
      requiredIndicators: 2,
      minConfidence: 0.6
    });
  }
  
  private async analyzePatterns(): Promise<PatternResult[]> {
    const results: PatternResult[] = [];
    
    for (const skill of this.skills) {
      const result = await this.analyzeSkillPatterns(skill);
      results.push(result);
      
      if (this.config.verbose) {
        console.log(`🔍 Analyzed patterns for: ${skill.name}`);
      }
    }
    
    return results;
  }
  
  private async analyzeSkillPatterns(skill: DiscoveredSkill): Promise<PatternResult> {
    const patterns: RecognizedPattern[] = [];
    const evidence: string[] = [];
    const gaps: string[] = [];
    const suggestions: string[] = [];
    
    // Analyze each pattern type
    for (const [patternType, definition] of this.patternDefinitions) {
      if (this.config.patterns.length > 0 && !this.config.patterns.includes(patternType)) {
        continue;
      }
      
      const pattern = this.recognizePattern(skill, definition);
      
      if (pattern.confidence >= this.config.confidenceThreshold) {
        patterns.push(pattern);
        evidence.push(...pattern.evidence);
      } else if (pattern.confidence >= definition.minConfidence) {
        gaps.push(`Weak ${patternType} pattern (confidence: ${(pattern.confidence * 100).toFixed(1)}%)`);
        suggestions.push(this.generatePatternSuggestion(patternType, pattern));
      }
    }
    
    // Calculate overall confidence
    const overallConfidence = patterns.length > 0 
      ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
      : 0;
    
    return {
      skill: skill.name,
      patterns,
      confidence: overallConfidence,
      evidence: [...new Set(evidence)], // Remove duplicates
      gaps,
      suggestions
    };
  }
  
  private recognizePattern(skill: DiscoveredSkill, definition: PatternDefinition): RecognizedPattern {
    const evidence: string[] = [];
    const indicators: string[] = [];
    let totalWeight = 0;
    let matchedWeight = 0;
    
    // Check each indicator
    for (const indicator of definition.indicators) {
      totalWeight += indicator.weight;
      
      const matches = this.checkIndicator(skill, indicator);
      
      if (matches.length > 0) {
        matchedWeight += indicator.weight;
        evidence.push(...matches);
        indicators.push(indicator.type);
      }
    }
    
    // Calculate confidence
    const confidence = totalWeight > 0 ? matchedWeight / totalWeight : 0;
    
    return {
      type: definition.name,
      confidence,
      evidence,
      indicators,
      metadata: {
        matchedIndicators: indicators.length,
        totalIndicators: definition.indicators.length,
        requiredIndicators: definition.requiredIndicators
      }
    };
  }
  
  private checkIndicator(skill: DiscoveredSkill, indicator: PatternIndicator): string[] {
    const matches: string[] = [];
    
    switch (indicator.type) {
      case 'content':
        const contentMatches = skill.content.match(indicator.pattern);
        if (contentMatches) {
          matches.push(...contentMatches.slice(0, 3)); // Limit to first 3 matches
        }
        break;
        
      case 'metadata':
        const metadataString = JSON.stringify(skill.metadata).toLowerCase();
        if (indicator.pattern.test(metadataString)) {
          matches.push('Metadata match: ' + indicator.pattern.toString());
        }
        break;
        
      case 'structure':
        // Check for structural patterns
        if (this.checkStructuralPattern(skill, indicator.pattern)) {
          matches.push('Structural pattern detected');
        }
        break;
    }
    
    return matches;
  }
  
  private checkStructuralPattern(skill: DiscoveredSkill, pattern: RegExp): boolean {
    // Check for structural patterns in the content
    const lines = skill.content.split('\n');
    
    for (const line of lines) {
      if (pattern.test(line)) {
        return true;
      }
    }
    
    return false;
  }
  
  private generatePatternSuggestion(patternType: string, pattern: RecognizedPattern): string {
    const suggestions: Record<string, string> = {
      'workflow': 'Add clear workflow steps, prerequisites, and error handling',
      'reference': 'Enhance documentation with examples and best practices',
      'scripting': 'Include usage examples and implementation details',
      'agent': 'Add agent configuration and behavior patterns'
    };
    
    return suggestions[patternType] || 'Improve pattern recognition indicators';
  }
  
  private generateStatistics(results: PatternResult[]): PatternStatistics {
    const stats: PatternStatistics = {
      totalSkills: results.length,
      patternDistribution: {},
      confidenceDistribution: { high: 0, medium: 0, low: 0 },
      averageConfidence: 0,
      mostCommonPattern: '',
      leastCommonPattern: ''
    };
    
    // Calculate pattern distribution
    for (const result of results) {
      for (const pattern of result.patterns) {
        stats.patternDistribution[pattern.type] = (stats.patternDistribution[pattern.type] || 0) + 1;
      }
      
      // Calculate confidence distribution
      if (result.confidence >= 0.8) stats.confidenceDistribution.high++;
      else if (result.confidence >= 0.5) stats.confidenceDistribution.medium++;
      else stats.confidenceDistribution.low++;
      
      // Calculate average confidence
      stats.averageConfidence += result.confidence;
    }
    
    stats.averageConfidence /= results.length;
    
    // Find most and least common patterns
    const patternEntries = Object.entries(stats.patternDistribution);
    if (patternEntries.length > 0) {
      patternEntries.sort((a, b) => b[1] - a[1]);
      stats.mostCommonPattern = patternEntries[0][0];
      stats.leastCommonPattern = patternEntries[patternEntries.length - 1][0];
    }
    
    return stats;
  }
  
  private generateRecommendations(results: PatternResult[]): PatternRecommendation[] {
    const recommendations: PatternRecommendation[] = [];
    
    // Low confidence skills
    const lowConfidenceSkills = results.filter(r => r.confidence < 0.5);
    
    if (lowConfidenceSkills.length > 0) {
      recommendations.push({
        type: 'confidence-improvement',
        priority: 'high',
        description: `${lowConfidenceSkills.length} skills have low pattern confidence`,
        affectedSkills: lowConfidenceSkills.map(r => r.skill),
        suggestions: [
          'Enhance skill structure and content',
          'Add missing pattern indicators',
          'Improve metadata completeness',
          'Include more examples and use cases'
        ],
        impact: 'Improves skill discoverability and classification accuracy'
      });
    }
    
    // Pattern gaps
    const skillsWithGaps = results.filter(r => r.gaps.length > 0);
    
    if (skillsWithGaps.length > 0) {
      recommendations.push({
        type: 'pattern-gaps',
        priority: 'medium',
        description: `${skillsWithGaps.length} skills have pattern gaps`,
        affectedSkills: skillsWithGaps.map(r => r.skill),
        suggestions: [
          'Address identified pattern gaps',
          'Strengthen weak pattern indicators',
          'Consider skill reclassification',
          'Add missing structural elements'
        ],
        impact: 'Improves pattern recognition and skill categorization'
      });
    }
    
    // No pattern skills
    const noPatternSkills = results.filter(r => r.patterns.length === 0);
    
    if (noPatternSkills.length > 0) {
      recommendations.push({
        type: 'pattern-absence',
        priority: 'high',
        description: `${noPatternSkills.length} skills lack recognizable patterns`,
        affectedSkills: noPatternSkills.map(r => r.skill),
        suggestions: [
          'Add clear skill structure',
          'Include workflow steps or examples',
          'Enhance metadata for better recognition',
          'Consider skill type reclassification'
        ],
        impact: 'Critical for skill discoverability and proper categorization'
      });
    }
    
    return recommendations;
  }
  
  private async saveAnalysis(analysis: PatternAnalysis): Promise<void> {
    let content: string;
    
    switch (this.config.reportFormat) {
      case 'json':
        content = JSON.stringify(analysis, null, 2);
        break;
      case 'html':
        content = this.generateHTMLReport(analysis);
        break;
      case 'text':
        content = this.generateTextReport(analysis);
        break;
      default:
        content = JSON.stringify(analysis, null, 2);
    }
    
    writeFileSync(this.config.output, content, 'utf-8');
    console.log(`📄 Pattern analysis saved to: ${this.config.output}`);
  }
  
  private generateHTMLReport(analysis: PatternAnalysis): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Pattern Recognition Analysis</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric { background: #e9ecef; padding: 15px; border-radius: 5px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #495057; }
        .metric .value { font-size: 2em; font-weight: bold; color: #007bff; }
        .patterns-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .patterns-table th, .patterns-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .patterns-table th { background-color: #f2f2f2; }
        .confidence-high { color: #28a745; }
        .confidence-medium { color: #ffc107; }
        .confidence-low { color: #dc3545; }
        .recommendations { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Pattern Recognition Analysis</h1>
        <p>Generated: ${analysis.metadata.timestamp.toISOString()}</p>
        <p>Total Skills: ${analysis.statistics.totalSkills}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Average Confidence</h3>
            <div class="value">${(analysis.statistics.averageConfidence * 100).toFixed(1)}%</div>
        </div>
        <div class="metric">
            <h3>High Confidence</h3>
            <div class="value">${analysis.statistics.confidenceDistribution.high}</div>
        </div>
        <div class="metric">
            <h3>Medium Confidence</h3>
            <div class="value">${analysis.statistics.confidenceDistribution.medium}</div>
        </div>
        <div class="metric">
            <h3>Low Confidence</h3>
            <div class="value">${analysis.statistics.confidenceDistribution.low}</div>
        </div>
    </div>
    
    <h2>Pattern Distribution</h2>
    <table class="patterns-table">
        <thead>
            <tr>
                <th>Pattern</th>
                <th>Count</th>
                <th>Percentage</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(analysis.statistics.patternDistribution).map(([pattern, count]) => `
                <tr>
                    <td>${pattern}</td>
                    <td>${count}</td>
                    <td>${((count / analysis.statistics.totalSkills) * 100).toFixed(1)}%</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <h2>Skills Analysis</h2>
    <table class="patterns-table">
        <thead>
            <tr>
                <th>Skill</th>
                <th>Patterns</th>
                <th>Confidence</th>
                <th>Gaps</th>
                <th>Suggestions</th>
            </tr>
        </thead>
        <tbody>
            ${analysis.patterns.map(result => `
                <tr>
                    <td>${result.skill}</td>
                    <td>${result.patterns.map(p => p.type).join(', ') || 'None'}</td>
                    <td class="confidence-${this.getConfidenceClass(result.confidence)}">${(result.confidence * 100).toFixed(1)}%</td>
                    <td>${result.gaps.length}</td>
                    <td>${result.suggestions.length}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <h2>Recommendations</h2>
    <div class="recommendations">
        ${analysis.recommendations.map(rec => `
            <div style="margin-bottom: 15px;">
                <h4>${rec.description}</h4>
                <p><strong>Priority:</strong> ${rec.priority}</p>
                <p><strong>Impact:</strong> ${rec.impact}</p>
                <ul>
                    ${rec.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }
  
  private generateTextReport(analysis: PatternAnalysis): string {
    return `
Pattern Recognition Analysis
=============================

Summary:
--------
Total Skills: ${analysis.statistics.totalSkills}
Average Confidence: ${(analysis.statistics.averageConfidence * 100).toFixed(1)}%
High Confidence: ${analysis.statistics.confidenceDistribution.high}
Medium Confidence: ${analysis.statistics.confidenceDistribution.medium}
Low Confidence: ${analysis.statistics.confidenceDistribution.low}

Pattern Distribution:
--------------------
${Object.entries(analysis.statistics.patternDistribution).map(([pattern, count]) => 
  `${pattern}: ${count} (${((count / analysis.statistics.totalSkills) * 100).toFixed(1)}%)`
).join('\n')}

Skills Analysis:
----------------
${analysis.patterns.map(result => `
${result.skill}
- Patterns: ${result.patterns.map(p => p.type).join(', ') || 'None'}
- Confidence: ${(result.confidence * 100).toFixed(1)}%
- Gaps: ${result.gaps.length}
- Suggestions: ${result.suggestions.length}
`).join('\n')}

Recommendations:
---------------
${analysis.recommendations.map(rec => `
${rec.description}
Priority: ${rec.priority}
Impact: ${rec.impact}
Suggestions:
${rec.suggestions.map(s => `- ${s}`).join('\n')}
`).join('\n')}
`;
  }
  
  private getConfidenceClass(confidence: number): string {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  }
}

interface PatternDefinition {
  name: string;
  description: string;
  indicators: PatternIndicator[];
  requiredIndicators: number;
  minConfidence: number;
}

interface PatternIndicator {
  type: 'content' | 'metadata' | 'structure';
  pattern: RegExp;
  weight: number;
}

interface DiscoveredSkill {
  name: string;
  filePath: string;
  fileType: string;
  size: number;
  lastModified: Date;
  metadata: any;
  content: string;
  patterns: any[];
  capabilities: string[];
  confidence: number;
  quality: any;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);
  
  const engine = new PatternRecognitionEngine(config);
  await engine.analyze();
}

function parseArgs(args: string[]): PatternConfig {
  const config: PatternConfig = {
    input: 'discovery-report.json',
    output: 'patterns-report.json',
    patterns: [],
    confidenceThreshold: 0.6,
    reportFormat: 'json',
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
        config.input = args[++i] || 'discovery-report.json';
        break;
      case '--output':
        config.output = args[++i] || 'patterns-report.json';
        break;
      case '--patterns':
        config.patterns = args[++i]?.split(',') || [];
        break;
      case '--confidence-threshold':
        config.confidenceThreshold = parseFloat(args[++i]) || 0.6;
        break;
      case '--report-format':
        config.reportFormat = args[++i] as any || 'json';
        break;
      case '--verbose':
        config.verbose = true;
        break;
    }
  }
  
  return config;
}

if (require.main === module) {
  main().catch(console.error);
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
