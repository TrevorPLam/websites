const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, '..', 'docs', 'guides');

function getMetaheaderTemplate(filename) {
  const title = filename.replace('.md', '').replace(/-/g, ' ');
  return `<!--
/**
 * @file ${filename}
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for ${title}.
 * @entrypoints docs/guides/${filename}
 * @exports ${title}
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

`;
}

function fixFile(filePath) {
  const filename = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add Metaheader if missing
  if (!content.includes('@file')) {
    content = getMetaheaderTemplate(filename) + content;
    changed = true;
  }

  // 2. TOC and Header Synchronization
  const hasTOC = /#+\s+Table of Contents/i.test(content) || /#+\s+TOC/i.test(content);
  if (!hasTOC) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      const h1End = h1Match.index + h1Match[0].length;
      content =
        content.slice(0, h1End) +
        '\n\n## Table of Contents\n\n- [Overview](#overview)\n- [Implementation](#implementation)\n- [Best Practices](#best-practices)\n- [Testing](#testing)\n- [References](#references)\n' +
        content.slice(h1End);
      changed = true;
    }
  }

  // Extract anchors from TOC and ensure they exist
  const tocMatch = content.match(/#+\s+Table of Contents(.*?)(?=\n#|$)/is);
  if (tocMatch) {
    const tocInner = tocMatch[1];
    const tocLinks = tocInner.match(/\[(.*?)\]\(#(.*?)\)/g) || [];
    tocLinks.forEach((linkStr) => {
      const parts = linkStr.match(/\[(.*?)\]\(#(.*?)\)/);
      if (parts) {
        const title = parts[1];
        // Robust check for header existence
        const cleanTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const headerExists = new RegExp(`^#+\\s+.*?${cleanTitle}`, 'im').test(content);
        if (!headerExists) {
          content += `\n\n## ${title}\n\n[Add content here]\n`;
          changed = true;
        }
      }
    });
  }

  // Force References header if missing (for the link fix below)
  if (!new RegExp('^#+\\s+References', 'im').test(content)) {
    content += `\n\n## References\n\n[Add content here]\n`;
    changed = true;
  }

  // 3. Fix Reference relative path
  if (content.includes('](../../../tasks/RESEARCH-INVENTORY.md)')) {
    content = content.replace(
      /\]\(\.\.\/\.\.\/\.\.\/tasks\/RESEARCH-INVENTORY\.md\)/g,
      '](../../tasks/RESEARCH-INVENTORY.md)'
    );
    changed = true;
  } else if (content.includes('](../tasks/RESEARCH-INVENTORY.md)')) {
    content = content.replace(
      /\]\(\.\.\/tasks\/RESEARCH-INVENTORY\.md\)/g,
      '](../../tasks/RESEARCH-INVENTORY.md)'
    );
    changed = true;
  } else if (!content.includes('RESEARCH-INVENTORY.md')) {
    const refIndex = content.indexOf('## References');
    if (refIndex !== -1) {
      const refEnd = refIndex + '## References'.length;
      content =
        content.slice(0, refEnd) +
        '\n\n- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns' +
        content.slice(refEnd);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function main() {
  console.log('👷 Starting batch sync for documentation guides...');
  const pattern = `${DOCS_DIR}/**/*.md`.replace(/\\/g, '/');
  const files = glob.sync(pattern);

  let fixedCount = 0;
  files.forEach((file) => {
    if (fixFile(file)) {
      console.log(`✅ Synced: ${path.basename(file)}`);
      fixedCount++;
    }
  });

  console.log(`\n🎉 Batch sync complete! Updated ${fixedCount} files.`);
}

main();
