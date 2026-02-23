const fs = require('fs');
const path = require('path');
const glob = require('glob');
const markdownlint = require('markdownlint');

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
    if (!content.includes('<!--') || !content.includes('-->')) {
      this.addError(file, 'Missing metaheader', 'Required for LLM context');
    }
  }

  validateMarkdown(file, content) {
    try {
      const config = {
        default: true,
        'line-length': false,
        'no-duplicate-header': false,
      };

      const lintFn =
        markdownlint.sync ||
        markdownlint.lintSync ||
        (typeof markdownlint === 'function' ? markdownlint : null);

      if (!lintFn) {
        this.addError(file, 'Markdown validation setup failed', 'No usable markdownlint API found');
        return;
      }

      const result =
        lintFn === markdownlint
          ? lintFn({ strings: { [file]: content }, config }) // Call directly if it's the main export
          : lintFn({ strings: { [file]: content }, config }); // call .sync or .lintSync

      if (result && result[file]) {
        result[file].forEach((error) => {
          this.addWarning(file, `Markdown: ${error.ruleDescription}`, error.detail);
        });
      }
    } catch (error) {
      this.addError(file, 'Markdown validation error', error.message);
    }
  }

  validateTOC(file, content) {
    const hasTOC = /#+\s+Table of Contents/i.test(content) || /#+\s+TOC/i.test(content);
    if (!hasTOC) {
      this.addError(file, 'Missing Table of Contents', 'Essential for navigation');
    }
  }

  validateLinks(file, content) {
    // Basic regex for internal links
    const links = content.match(/\[.*?\]\((.*?)\)/g) || [];
    this.results.linksChecked += links.length;

    links.forEach((linkStr) => {
      const match = linkStr.match(/\[.*?\]\((.*?)\)/);
      if (match) {
        const link = match[1];
        if (link.startsWith('#')) {
          const anchor = link.slice(1);
          const anchorMatch = new RegExp(`^#+\\s+.*?${anchor.replace(/-/g, '.*?')}`, 'im');
          if (!anchorMatch.test(content)) {
            this.addError(file, `Broken anchor link: ${link}`, 'Check header capitalization/slug');
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
        this.addWarning(
          file,
          'Placeholder Reference found',
          'Replace example.com with actual source'
        );
      }
    }
  }

  validateAdvancedPatterns(file, content) {
    const patterns = ['Security', 'Performance', 'Multi-agent', 'Next.js 16', 'React 19.2'];
    let score = 0;
    patterns.forEach((p) => {
      if (new RegExp(p, 'i').test(content)) score++;
    });

    if (score < 2) {
      this.addWarning(
        file,
        'Low advanced pattern density',
        'Consider adding 2026-standard patterns'
      );
    }
  }

  validateCodeExamples(file, content) {
    if (!/```[a-z]+/.test(content)) {
      this.addWarning(
        file,
        'No code examples found',
        'Guides should include implementation snippets'
      );
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

    if (thi