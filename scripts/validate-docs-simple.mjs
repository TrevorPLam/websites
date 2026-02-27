#!/usr/bin/env node

/**
 * Simple Documentation Validation Script
 * 
 * Validates 2026 bimodal documentation standards compliance
 * without external dependencies
 */

import fs from 'fs';
import path from 'path';

const REQUIRED_FRONTMATTER_FIELDS = [
  'doc_id',
  'doc_version', 
  'last_updated',
  'next_review',
  'document_owner',
  'ai_readiness_score',
  'human_ttv_seconds',
  'bimodal_grade',
  'type',
  'language',
  'framework',
  'runtime',
  'complexity',
  'compliance_frameworks',
  'risk_classification',
  'data_governance',
  'rag_optimization',
  'executable_status',
  'ci_validation',
  'last_executed',
  'maintenance_mode',
  'stale_threshold_days',
  'audit_trail'
];

class SimpleDocumentationValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      total_files: 0,
      validated_files: 0,
      failed_files: 0,
      a_grade_files: 0,
      b_grade_files: 0,
      c_grade_files: 0,
      d_grade_files: 0
    };
  }

  validateFile(filePath) {
    this.stats.total_files++;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Check for YAML frontmatter
      if (!lines[0].startsWith('---')) {
        this.addError(filePath, 'Missing YAML frontmatter');
        return false;
      }

      const frontmatterEnd = lines.findIndex(line => line.trim() === '---');
      if (frontmatterEnd === -1) {
        this.addError(filePath, 'Unclosed YAML frontmatter');
        return false;
      }

      const frontmatterContent = lines.slice(1, frontmatterEnd).join('\n');
      
      // Parse YAML manually (simple key-value extraction)
      const frontmatter = this.parseSimpleYAML(frontmatterContent);
      
      // Validate required fields
      const missingFields = REQUIRED_FRONTMATTER_FIELDS.filter(field => !frontmatter[field]);
      if (missingFields.length > 0) {
        this.addError(filePath, `Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate bimodal thresholds
      this.validateBimodalMetrics(filePath, frontmatter);
      
      // Check semantic chunking (800-1200 tokens)
      const contentAfterFrontmatter = lines.slice(frontmatterEnd + 1).join('\n');
      const tokenCount = this.estimateTokenCount(contentAfterFrontmatter);
      
      if (tokenCount < 800 || tokenCount > 1200) {
        this.addWarning(filePath, `Content length ${tokenCount} tokens (target: 800-1200)`);
      }

      // Calculate bimodal grade
      const grade = this.calculateBimodalGrade(frontmatter);
      this.stats[`${grade.toLowerCase()}_grade_files`]++;
      
      if (grade === 'A') {
        console.log(`✅ ${filePath} - Grade: ${grade}`);
      } else if (grade === 'B') {
        console.log(`⚠️  ${filePath} - Grade: ${grade}`);
      } else {
        console.log(`❌ ${filePath} - Grade: ${grade}`);
      }

      this.stats.validated_files++;
      return true;

    } catch (error) {
      this.addError(filePath, `Validation error: ${error.message}`);
      this.stats.failed_files++;
      return false;
    }
  }

  parseSimpleYAML(content) {
    const data = {};
    const lines = content.split('\n');
    let currentKey = null;
    let inArray = false;
    let inObject = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      if (trimmed.startsWith('  ') && currentKey) {
        // Array or object value
        if (trimmed.startsWith('  - ')) {
          inArray = true;
          if (!data[currentKey]) data[currentKey] = [];
          data[currentKey].push(trimmed.substring(4).trim());
        } else if (trimmed.includes(':')) {
          inObject = true;
          if (!data[currentKey]) data[currentKey] = {};
          const [key, value] = trimmed.split(':').map(s => s.trim());
          data[currentKey][key] = value.replace(/['"]/g, '');
        }
      } else if (trimmed.includes(':')) {
        currentKey = trimmed.split(':')[0].trim();
        const value = trimmed.split(':')[1]?.trim();
        if (value && !value.startsWith('[') && !value.startsWith('{')) {
          data[currentKey] = value.replace(/['"]/g, '');
        }
      }
    }
    
    return data;
  }

  validateBimodalMetrics(filePath, frontmatter) {
    const { ai_readiness_score, human_ttv_seconds, bimodal_grade } = frontmatter;
    
    if (ai_readiness_score < 0.8) {
      this.addError(filePath, `AI readiness score ${ai_readiness_score} below threshold 0.8`);
    }
    
    if (human_ttv_seconds > 30) {
      this.addError(filePath, `Human TTV ${human_ttv_seconds}s exceeds threshold 30`);
    }
    
    if (!['A', 'B', 'C', 'D'].includes(bimodal_grade)) {
      this.addError(filePath, `Bimodal grade ${bimodal_grade} not acceptable`);
    }
  }

  calculateBimodalGrade(frontmatter) {
    const { ai_readiness_score, human_ttv_seconds, bimodal_grade } = frontmatter;
    
    let grade = 'D';
    
    if (ai_readiness_score >= 0.9 && human_ttv_seconds <= 25 && bimodal_grade === 'A') {
      grade = 'A';
    } else if (ai_readiness_score >= 0.8 && human_ttv_seconds <= 30 && bimodal_grade === 'B') {
      grade = 'B';
    } else if (ai_readiness_score >= 0.7 && human_ttv_seconds <= 45 && bimodal_grade === 'C') {
      grade = 'C';
    }
    
    return grade;
  }

  estimateTokenCount(text) {
    return Math.ceil(text.length / 4);
  }

  addError(filePath, message) {
    this.errors.push({ file: filePath, message, type: 'error' });
  }

  addWarning(filePath, message) {
    this.warnings.push({ file: filePath, message, type: 'warning' });
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_files: this.stats.total_files,
        validated_files: this.stats.validated_files,
        failed_files: this.stats.failed_files,
        a_grade_files: this.stats.a_grade_files,
        b_grade_files: this.stats.b_grade_files,
        c_grade_files: this.stats.c_grade_files,
        d_grade_files: this.stats.d_grade_files
      },
      errors: this.errors,
      warnings: this.warnings,
      compliance: {
        a_grade_percentage: this.stats.total_files > 0 ? 
          Math.round((this.stats.a_grade_files / this.stats.total_files) * 100) : 0,
        compliance_rate: this.stats.total_files > 0 ? 
          Math.round((this.stats.validated_files / this.stats.total_files) * 100) : 0
      }
    };

    return report;
  }

  validateDirectory(directory) {
    const files = this.findMarkdownFiles(directory);
    
    console.log(`🔍 Validating ${files.length} documentation files in ${directory}`);
    
    for (const file of files) {
      this.validateFile(file);
    }

    return this.generateReport();
  }

  findMarkdownFiles(directory) {
    const files = [];
    
    function scanDir(dir) {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          
          try {
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              // Skip node_modules and other common directories
              if (!['node_modules', '.git', '.next', 'dist', 'build', 'coverage'].includes(item)) {
                scanDir(fullPath);
              }
            } else if (item.endsWith('.md')) {
              files.push(fullPath);
            }
          } catch (error) {
            // Skip files that can't be accessed
            console.warn(`Warning: Cannot access ${fullPath}: ${error.message}`);
          }
        }
      } catch (error) {
        console.warn(`Warning: Cannot read directory ${dir}: ${error.message}`);
      }
    }
    
    // Start scanning
    scanDir(directory);
    
    // Debug: Log what we found
    console.log(`Found ${files.length} markdown files:`);
    files.forEach(file => console.log(`  - ${file}`));
    
    return files;
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('validate-docs-simple.mjs')) {
  const args = process.argv.slice(2);
  const directory = args[0] || process.cwd();
  
  const validator = new SimpleDocumentationValidator();
  const report = validator.validateDirectory(directory);
  
  console.log('\n📊 Documentation Validation Report');
  console.log('=====================================');
  console.log(`📁 Total Files: ${report.summary.total_files}`);
  console.log(`✅ Validated: ${report.summary.validated_files}`);
  console.log(`❌ Failed: ${report.summary.failed_files}`);
  console.log(`🎯 A-Grade: ${report.summary.a_grade_files} files (${report.summary.a_grade_percentage}%)`);
  console.log(`📋 Compliance Rate: ${report.summary.compliance_rate}%`);
  
  if (report.errors.length > 0) {
    console.log('\n❌ Errors:');
    report.errors.forEach(error => {
      console.log(`  ${error.file}: ${error.message}`);
    });
  }
  
  if (report.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    report.warnings.forEach(warning => {
      console.log(`  ${warning.file}: ${warning.message}`);
    });
  }
  
  const exitCode = report.errors.length > 0 ? 1 : 
    (report.warnings.length > 10 ? 1 : 0);
  process.exit(exitCode);
}
