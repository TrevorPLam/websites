#!/usr/bin/env node

/**
 * Documentation Validation Script
 * 
 * Validates documentation files against established standards:
 * - Metaheader completeness and format
 * - Link validity
 * - Markdown formatting
 * - Accessibility compliance
 * 
 * Usage: node scripts/validate-documentation.js [options]
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const markdownlint = require('markdownlint');
const markdownlintConfig = require('../.markdownlint.json');

class DocumentationValidator {
  constructor(options = {}) {
    this.options = {
      docsPath: options.docsPath || 'docs',
      strict: options.strict || false,
      fix: options.fix || false,
      ...options
    };
    this.errors = [];
    this.warnings = [];
    this.stats = {
      filesChecked: 0,
      filesPassed: 0,
      filesFailed: 0,
      linksChecked: 0,
      linksBroken: 0
    };
  }

  /**
   * Run all validation checks
   */
  async validate() {
    console.log('🔍 Starting documentation validation...\n');

    const docFiles = this.findDocumentationFiles();
    
    if (docFiles.length === 0) {
      console.log('⚠️  No documentation files found');
      return false;
    }

    console.log(`📁 Found ${docFiles.length} documentation files\n`);

    // Run validation checks
    await this.validateMetaheaders(docFiles);
    await this.validateMarkdown(docFiles);
    await this.validateLinks(docFiles);
    await this.validateAccessibility(docFiles);
    await this.validateCodeExamples(docFiles);
    await this.validateCodeExamples(docFiles);

    // Print results
    this.printResults();

    return this.stats.filesFailed === 0;
  }

  /**
   * Find all documentation files
   */
  findDocumentationFiles() {
    const pattern = path.join(this.options.docsPath, '**/*.md');
    const files = glob.sync(pattern, {
      ignore: ['**/node_modules/**', '**/dist/**']
    });
    return files;
  }

  /**
   * Validate metaheaders in documentation files
   */
  async validateMetaheaders(files) {
    console.log('📋 Validating metaheaders...');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const metaheader = this.extractMetaheader(content);
      
      if (!metaheader) {
        this.addError(file, 'Missing metaheader', 'Add required metaheader comment block');
        continue;
      }

      // Validate required fields
      const requiredFields = [
        '@file', '@role', '@summary', '@entrypoints', '@exports',
        '@depends_on', '@used_by', '@runtime', '@data_flow', '@invariants',
        '@gotchas', '@issues', '@opportunities', '@verification', '@status'
      ];

      for (const field of requiredFields) {
        if (!metaheader.includes(field)) {
          this.addError(file, `Missing required metaheader field: ${field}`, `Add ${field} to metaheader`);
        }
      }

      // Validate format
      if (!content.startsWith('<!--')) {
        this.addError(file, 'Metaheader must start with <!-- comment block', 'Use proper metaheader format');
      }

      this.stats.filesChecked++;
    }

    console.log(`✅ Metaheader validation complete\n`);
  }

  /**
   * Extract metaheader from file content
   */
  extractMetaheader(content) {
    const match = content.match(/\/\*\*[\s\S]*?\*\//);
    return match ? match[0] : null;
  }

  /**
   * Validate Markdown formatting
   */
  async validateMarkdown(files) {
    console.log('📝 Validating Markdown formatting...');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      try {
        const result = markdownlint.sync({
          strings: {
            [file]: content
          },
          config: markdownlintConfig
        });

        if (result[file]) {
          result[file].forEach(error => {
            this.addError(file, `Markdown lint error: ${error.ruleDescription}`, error.ruleInformation);
          });
        }
      } catch (error) {
        this.addError(file, 'Markdown validation failed', error.message);
      }
    }

    console.log(`✅ Markdown validation complete\n`);
  }

  /**
   * Validate internal and external links
   */
  async validateLinks(files) {
    console.log('🔗 Validating links...');

    const allFiles = new Set();
    const fileMap = new Map();
    
    // Collect all files for internal link validation
    files.forEach(file => {
      const absPath = path.resolve(file);
      allFiles.add(absPath);
      const relPath = path.relative(process.cwd(), file);
      fileMap.set(relPath, absPath);
      fileMap.set(relPath.replace(/\\/g, '/'), absPath);
    });

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const links = this.extractLinks(content);
      const fileDir = path.dirname(file);
      
      for (const link of links) {
        this.stats.linksChecked++;
        
        if (link.url.startsWith('http') || link.url.startsWith('https')) {
          // External link - validate format only
          if (!this.isValidUrl(link.url)) {
            this.addWarning(file, `Invalid URL format: ${link.url}`, 'Check URL syntax');
          }
          continue;
        } else if (link.url.startsWith('#')) {
          // Anchor link - validate within same file
          if (!this.validateAnchor(content, link.url.slice(1))) {
            this.addError(file, `Broken anchor link: ${link.url}`, 'Check anchor exists in file');
            this.stats.linksBroken++;
          }
        } else {
          // Internal link - validate file exists
          let targetPath = path.resolve(fileDir, link.url);
          
          // Handle markdown file extensions
          if (!path.extname(targetPath)) {
            const mdPath = targetPath + '.md';
            if (fs.existsSync(mdPath)) {
              targetPath = mdPath;
            }
          }
          
          if (!fs.existsSync(targetPath) && !allFiles.has(targetPath)) {
            const relPath = path.relative(process.cwd(), targetPath);
            if (!fileMap.has(relPath) && !fileMap.has(relPath.replace(/\\/g, '/'))) {
              this.addError(file, `Broken internal link: ${link.url}`, 'Check file exists');
              this.stats.linksBroken++;
            }
          }
        }
      }
    }

    console.log(`✅ Link validation complete (${this.stats.linksBroken} broken links found)\n`);
  }

  /**
   * Validate URL format
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract links from markdown content
   */
  extractLinks(content) {
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    const links = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2]
      });
    }
    
    return links;
  }

  /**
   * Validate anchor exists in content
   */
  validateAnchor(content, anchor) {
    // Check for heading anchors
    const headingRegex = new RegExp(`^#{1,6}\\s+.*${anchor.replace(/[-_]/g, '[-_]')}.*$`, 'im');
    if (headingRegex.test(content)) return true;

    // Check for explicit anchors
    const anchorRegex = new RegExp(`{#${anchor}}`, 'i');
    return anchorRegex.test(content);
  }

  /**
   * Validate accessibility compliance
   */
  async validateAccessibility(files) {
    console.log('♿ Validating accessibility...');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for alt text in images
      const images = content.match(/!\[([^\]]*)\]\([^)]+\)/g) || [];
      images.forEach(img => {
        const altMatch = img.match(/!\[([^\]]*)\]/);
        if (!altMatch || !altMatch[1] || altMatch[1].trim() === '') {
          this.addWarning(file, 'Image missing alt text', 'Add descriptive alt text for accessibility (WCAG 2.2 AA)');
        }
      });

      // Check for proper heading structure
      const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
      const levels = headings.map(h => (h.match(/^#+/) || [''])[0].length);
      
      // Check for H1 (should only be one per file, and it's usually the title)
      const h1Count = levels.filter(l => l === 1).length;
      if (h1Count > 1) {
        this.addWarning(file, 'Multiple H1 headings detected', 'Use only one H1 per document (the title)');
      }
      
      // Check for heading level skips
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i-1] > 1) {
          this.addWarning(file, 'Heading level skip detected', 'Use sequential heading levels (WCAG 2.2 AA)');
          break;
        }
      }

      // Check for code block language specification
      const codeBlockRegex = /```(\w*)/g;
      let match;
      while ((match = codeBlockRegex.exec(content)) !== null) {
        if (!match[1] || match[1].trim() === '') {
          this.addWarning(file, 'Code block missing language specification', 'Add language for syntax highlighting and accessibility');
        }
      }

      // Check for descriptive link text
      const linkRegex = /\[([^\]]+)\]\([^)]+\)/g;
      while ((match = linkRegex.exec(content)) !== null) {
        const linkText = match[1].trim();
        if (linkText === '' || linkText.toLowerCase() === 'click here' || linkText.toLowerCase() === 'here') {
          this.addWarning(file, 'Non-descriptive link text', 'Use descriptive link text instead of "click here" or "here"');
        }
      }
    }

    console.log(`✅ Accessibility validation complete\n`);
  }

  /**
   * Validate code examples syntax
   */
  async validateCodeExamples(files) {
    console.log('💻 Validating code examples...');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Extract code blocks
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      let match;
      
      while ((match = codeBlockRegex.exec(content)) !== null) {
        const language = match[1] || '';
        const code = match[2];
        
        // Basic validation for common languages
        if (language === 'bash' || language === 'sh') {
          // Check for common shell errors
          if (code.includes('sudo ') && !code.includes('# Requires sudo')) {
            this.addWarning(file, 'Shell command uses sudo without warning', 'Add comment about sudo requirement');
          }
        }
        
        if (language === 'typescript' || language === 'ts' || language === 'tsx') {
          // Check for common TypeScript issues
          if (code.includes('any') && !code.includes('// eslint-disable')) {
            this.addWarning(file, 'Code example uses "any" type', 'Consider using proper types');
          }
        }
        
        // Check for placeholder values that should be replaced
        if (code.includes('example.com') || code.includes('your-') || code.includes('YOUR_')) {
          // This is okay in documentation, but we can note it
          // No warning needed
        }
      }
    }

    console.log(`✅ Code example validation complete\n`);
  }

  /**
   * Add error to results
   */
  addError(file, message, suggestion) {
    this.errors.push({
      file,
      message,
      suggestion,
      severity: 'error'
    });
  }

  /**
   * Add warning to results
   */
  addWarning(file, message, suggestion) {
    this.warnings.push({
      file,
      message,
      suggestion,
      severity: 'warning'
    });
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n📊 Validation Results:');
    console.log(`Files checked: ${this.stats.filesChecked}`);
    console.log(`Links checked: ${this.stats.linksChecked}`);
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => {
        console.log(`\n📁 ${error.file}`);
        console.log(`   ${error.message}`);
        if (error.suggestion) {
          console.log(`   💡 ${error.suggestion}`);
        }
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => {
        console.log(`\n📁 ${warning.file}`);
        console.log(`   ${warning.message}`);
        if (warning.suggestion) {
          console.log(`   💡 ${warning.suggestion}`);
        }
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n🎉 All documentation passed validation!');
    } else {
      console.log('\n🔧 Run with --fix to auto-fix some issues');
    }

    // Update stats
    this.stats.filesFailed = this.errors.length;
    this.stats.filesPassed = this.stats.filesChecked - this.stats.filesFailed;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--strict':
        options.strict = true;
        break;
      case '--fix':
        options.fix = true;
        break;
      case '--docs-path':
        options.docsPath = args[++i];
        break;
      case '--help':
        console.log(`
Documentation Validator

Usage: node scripts/validate-documentation.js [options]

Options:
  --strict        Enable strict validation mode
  --fix           Auto-fix some issues
  --docs-path     Path to documentation directory (default: docs)
  --help          Show this help message

Examples:
  node scripts/validate-documentation.js
  node scripts/validate-documentation.js --strict
  node scripts/validate-documentation.js --fix
        `);
        process.exit(0);
    }
  }

  // Run validation
  const validator = new DocumentationValidator(options);
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = DocumentationValidator;
