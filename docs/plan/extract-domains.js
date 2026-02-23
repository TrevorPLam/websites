#!/usr/bin/env node

// Domain Content Extraction Script
//
// This script extracts content from docs/PLAN.md and organizes it into
// domain-specific folders in docs/plan/domain-*

const fs = require('fs');
const path = require('path');

const PLAN_FILE = path.join(__dirname, '..', '..', 'docs', 'PLAN.md');
const BASE_DIR = path.join(__dirname, '..', '..', 'docs', 'plan');

// Read the entire PLAN.md file
console.log('Reading PLAN.md...');
const content = fs.readFileSync(PLAN_FILE, 'utf8');

// Split by domain headers using regex
const domainSections = content.split(/(?=\n## DOMAIN \d+: .+)/);

console.log(`Found ${domainSections.length - 1} domains to process`);

// Process each domain section
domainSections.forEach((section, index) => {
  if (index === 0) return; // Skip the first empty section

  // Extract domain number and title
  const domainMatch = section.match(/## DOMAIN (\d+): (.+)/);
  if (!domainMatch) {
    console.warn(`Could not parse domain section ${index}`);
    return;
  }

  const domainNum = domainMatch[1];
  const domainTitle = domainMatch[2];

  console.log(`Processing Domain ${domainNum}: ${domainTitle}`);

  // Create domain directory if it doesn't exist
  const domainDir = path.join(BASE_DIR, `domain-${domainNum}`);
  if (!fs.existsSync(domainDir)) {
    fs.mkdirSync(domainDir, { recursive: true });
  }

  // Extract sections within this domain
  const sectionMatches = section.split(/(?=\n### \d+\.\d+)/);

  const sectionFiles = [];
  const readmeLinks = [];

  sectionMatches.forEach((sectionContent, sectionIndex) => {
    if (sectionIndex === 0) return; // Skip the domain header

    // Extract section number, title, and content
    const sectionMatch = sectionContent.match(/### (\d+)\.(\d+) (.+)/);
    if (!sectionMatch) return;

    const mainNum = sectionMatch[1];
    const subNum = sectionMatch[2];
    const sectionTitle = sectionMatch[3];

    // Clean section title for filename
    const cleanTitle = sectionTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const filename = `${mainNum}.${subNum}-${cleanTitle}.md`;
    const filepath = path.join(domainDir, filename);

    // Extract the full section content (until next ### or ##)
    const sectionStart = sectionContent.indexOf(`### ${mainNum}.${subNum} ${sectionTitle}`);
    let sectionEnd = sectionContent.indexOf('\n### ', sectionStart + 1);
    if (sectionEnd === -1) {
      sectionEnd = sectionContent.indexOf('\n## DOMAIN ', sectionStart + 1);
    }
    if (sectionEnd === -1) {
      sectionEnd = sectionContent.length;
    }

    const fullSectionContent = sectionContent.substring(sectionStart, sectionEnd).trim();

    // Write section content to file
    fs.writeFileSync(filepath, fullSectionContent, 'utf8');

    sectionFiles.push(filename);
    readmeLinks.push(`- [${mainNum}.${subNum} ${sectionTitle}](${filename})`);

    console.log(`  Created: ${filename}`);
  });

  // Create or update README.md for this domain
  const readmeContent = `# Domain ${domainNum}: ${domainTitle}

## Overview

This domain covers ${domainTitle.toLowerCase()} aspects of the marketing-first multi-client multi-site monorepo.

## Sections

${readmeLinks.join('\n')}

## Priority

**P0 (Week 1)** — Foundation for entire platform.

## Dependencies

None - this is the foundational domain that all other domains depend on.
`;

  fs.writeFileSync(path.join(domainDir, 'README.md'), readmeContent, 'utf8');
  console.log(`  Created README.md for Domain ${domainNum}`);
});

console.log('\nDomain extraction complete!');
console.log('\nNext steps:');
console.log('1. Review the extracted content in each domain folder');
console.log('2. Update the main README.md with proper links');
console.log('3. Add any missing sections or fix formatting issues');
