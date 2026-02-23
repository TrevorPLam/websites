const fs = require('fs');
const path = require('path');
const glob = require('glob');

class DocumentationValidator {
  constructor() {
    this.results = {
      filesChecked: 0,
      linksChecked: 0,
      errors: [],
      warnings: [],
    };
  }

  addError(file, message, detail = '') {
    this.results.errors.push({ file, message, detail });
  }

  addWarning(file, message, detail = '') {
    this.results.warnings.push({ file, message, detail });
  }

  validateMetaheader(file, content) {
    if (!content.includes('<!--') || !content.includes('-->') || !content.includes('@file')) {
      this.addError(file, 'Missing or invalid metaheader', 'Required for LLM context and tracking');
    }
  }

  validateMarkdown(file, content) {
    // Regex-based structural linting
    const checks = [
      { id: 'multiple-h1', regex: /^#\s+.*?\n.*?^#\s+/ms, msg: 'Multiple H1 headers detected' },
      { id: 'trailing-spaces', regex: /[ \t]+$/m, msg: 'Trailing spaces detected' },
      {
        id: 'consecutive-blank-lines',
        regex: /\n\n\n/,
        msg: 'Consecutive blank lines (>2) detected',
      },
    ];

    checks.forEach((check) => {
      if (check.regex.test(content)) {
        this.addWarning(file, `Structure: ${check.msg}`);
      }
    });
  }

  validateTOC(file, content) {
    const hasTOC = /#+\s+Table of Contents/i.test(content) || /#+\s+TOC/i.test(content);
    if (!hasTOC) {
      this.addError(file, 'Missing Table of Contents', 'Essential for navigation');
    }
  }

  validateLinks(file, content) {
    const links = content.match(/\[.*?\]\((.*?)\)/g) || [];
    this.results.linksChecked += links.length;

    links.forEach((linkStr) => {
      const match = linkStr.match(/\[.*?\]\((.*?)\)/);
      if (match) {
        const link = match[1];
        if (link.startsWith('#')) {
          const anchor = link.slice(1);
          const cleanAnchor = anchor.replace(/-/g, ' ');
          // Robust regex for anchor matching: handles slugification of special chars like . or /
          const anchorParts = cleanAnchor
            .split(' ')
            .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          const anchorMatch = new RegExp(`^#+\\s+.*?${anchorParts.join('.*?')}`, 'im');
          if (!anchorMatch.test(content)) {
            this.addError(file, `Broken anchor link: ${link}`, 'Check header synchronization');
          }
        } else if (link.startsWith('../') || link.startsWith('./')) {
          const absolutePath = path.resolve(path.dirname(file), link);
          if (!fs.existsSync(absolutePath)) {
            this.addError(file, `Broken internal link: ${link}`, `Target missing: ${absolutePath}`);
          }
        }
      }
    });
  }

  validateReferences(file, content) {
    const hasRefs = /#+\s+References/i.test(content) || /#+\s+Sources/i.test(content);
    if (!hasRefs) {
      this.addError(file, 'Missing References section', 'Documentation must cite sources');
    } else {
      const refPlaceholder = /\[Official Documentation\]\(https:\/\/example\.com\)/.test(content);
      if (refPlaceholder) {
        this.addWarning(file, 'Placeholder Reference found', 'Replace with real link');
      }
    }
  }

  validateAdvancedPatterns(file, content) {
    const patterns = ['Security', 'Performance', 'Multi-agent', 'Next.js 16', 'React 19.2', 'PQC'];
    let score = 0;
    patterns.forEach((p) => {
      if (new RegExp(p, 'i').test(content)) score++;
    });

    if (score < 2) {
      this.addWarning(file, 'Low advanced pattern density', 'Add 2026-standard patterns');
    }
  }

  validateCodeExamples(file, content) {
    if (!/```[a-z]+/.test(content)) {
      this.addWarning(file, 'No code examples found', 'Add implementation snippets');
    }
  }

  run(docsPath) {
    console.log('🚀 Starting documentation validation...');
    const pattern = path.join(docsPath, '**/*.md').replace(/\\/g, '/');
    const files = glob.sync(pattern);
    this.results.filesChecked = files.length;

    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');
      this.validateMetaheader(file, content);
      this.validateMarkdown(file, content);
      this.validateTOC(file, content);
      this.validateLinks(file, content);
      this.validateReferences(file, content);
      this.validateAdvancedPatterns(file, content);
      this.validateCodeExamples(file, content);
    });

    this.printReport();
  }

  printReport() {
    console.log('\n📊 Validation Results:');
    console.log(`Files checked: ${this.results.filesChecked}`);
    console.log(`Links checked: ${this.results.linksChecked}`);
    console.log(`Errors: ${this.results.errors.length}`);
    console.log(`Warnings: ${this.results.warnings.length}\n`);

    if (this.results.errors.length > 0) {
      console.log('❌ Errors:');
      this.results.errors.forEach((e) => {
        console.log(`📄 ${e.file}\n   ⚠️ ${e.message}\n   💡 ${e.detail}\n`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log('⚠️ Warnings:');
      this.results.warnings.forEach((w) => {
        console.log(`📄 ${w.file}\n   💡 ${w.message}\n`);
      });
    }
  }
}

const docsPath = process.argv.includes('--docs-path')
  ? process.argv[process.argv.indexOf('--docs-path') + 1]
  : path.join(__dirname, '..', 'docs', 'guides');

const validator = new DocumentationValidator();
validator.run(docsPath);
