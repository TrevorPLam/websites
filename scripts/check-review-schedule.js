#!/usr/bin/env node

/**
 * Script to check documentation review schedule compliance
 * Validates that all documents have up-to-date review dates
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {};
  }

  const frontmatterText = match[1];
  const frontmatter = {};

  frontmatterText.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  });

  return frontmatter;
}

/**
 * Find all markdown files in the repository
 */
function findMarkdownFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and other common exclusions
        if (!['node_modules', '.git', '.next', 'dist', 'coverage'].includes(item)) {
          traverse(fullPath);
        }
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Check if a review is overdue
 */
function isReviewOverdue(lastReviewed, intervalDays) {
  const today = new Date();
  const lastReviewDate = new Date(lastReviewed);
  const nextReviewDate = new Date(lastReviewDate);
  nextReviewDate.setDate(nextReviewDate.getDate() + parseInt(intervalDays));

  return nextReviewDate < today;
}

/**
 * Get days until review is due
 */
function getDaysUntilDue(lastReviewed, intervalDays) {
  const today = new Date();
  const lastReviewDate = new Date(lastReviewed);
  const nextReviewDate = new Date(lastReviewDate);
  nextReviewDate.setDate(nextReviewDate.getDate() + parseInt(intervalDays));

  const msUntilDue = nextReviewDate - today;
  return Math.ceil(msUntilDue / (1000 * 60 * 60 * 24));
}

/**
 * Main function to check review schedule
 */
function checkReviewSchedule() {
  const repoRoot = path.join(__dirname, '..');
  const markdownFiles = findMarkdownFiles(repoRoot);

  const overdue = [];
  const dueSoon = [];
  const missingFrontmatter = [];
  const valid = [];

  console.log('🔍 Checking documentation review schedule...\n');

  markdownFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const frontmatter = extractFrontmatter(content);

      // Skip files that don't need review tracking
      if (file.includes('node_modules') || file.includes('.git')) {
        return;
      }

      if (!frontmatter.last_reviewed || !frontmatter.review_interval_days) {
        missingFrontmatter.push({
          file: path.relative(repoRoot, file),
          hasLastReviewed: !!frontmatter.last_reviewed,
          hasInterval: !!frontmatter.review_interval_days,
        });
      } else {
        const daysUntilDue = getDaysUntilDue(
          frontmatter.last_reviewed,
          frontmatter.review_interval_days
        );

        if (daysUntilDue < 0) {
          overdue.push({
            file: path.relative(repoRoot, file),
            lastReviewed: frontmatter.last_reviewed,
            intervalDays: frontmatter.review_interval_days,
            daysOverdue: Math.abs(daysUntilDue),
          });
        } else if (daysUntilDue <= 7) {
          dueSoon.push({
            file: path.relative(repoRoot, file),
            lastReviewed: frontmatter.last_reviewed,
            intervalDays: frontmatter.review_interval_days,
            daysUntilDue,
          });
        } else {
          valid.push({
            file: path.relative(repoRoot, file),
            lastReviewed: frontmatter.last_reviewed,
            intervalDays: frontmatter.review_interval_days,
            daysUntilDue,
          });
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });

  // Report results
  console.log(`📊 Review Schedule Summary:`);
  console.log(`   ✅ Valid reviews: ${valid.length}`);
  console.log(`   ⚠️  Due soon (≤7 days): ${dueSoon.length}`);
  console.log(`   ❌ Overdue: ${overdue.length}`);
  console.log(`   ⚙️  Missing frontmatter: ${missingFrontmatter.length}`);
  console.log(`   📄 Total files checked: ${markdownFiles.length}\n`);

  // Show details for problematic files
  if (overdue.length > 0) {
    console.log('❌ OVERDUE REVIEWS:');
    overdue.forEach(({ file, lastReviewed, intervalDays, daysOverdue }) => {
      console.log(`   ${file}`);
      console.log(`     Last reviewed: ${lastReviewed}`);
      console.log(`     Interval: ${intervalDays} days`);
      console.log(`     Overdue by: ${daysOverdue} days\n`);
    });
  }

  if (dueSoon.length > 0) {
    console.log('⚠️  REVIEWS DUE SOON:');
    dueSoon.forEach(({ file, lastReviewed, intervalDays, daysUntilDue }) => {
      console.log(`   ${file} (due in ${daysUntilDue} days)`);
    });
    console.log('');
  }

  if (missingFrontmatter.length > 0) {
    console.log('⚙️  MISSING FRONTMATTER:');
    missingFrontmatter.forEach(({ file, hasLastReviewed, hasInterval }) => {
      const missing = [];
      if (!hasLastReviewed) missing.push('last_reviewed');
      if (!hasInterval) missing.push('review_interval_days');
      console.log(`   ${file} (missing: ${missing.join(', ')})`);
    });
    console.log('');
  }

  // Exit with error code if there are overdue reviews
  if (overdue.length > 0) {
    console.error(`❌ Found ${overdue.length} overdue reviews. Please update documentation.`);
    process.exit(1);
  }

  if (missingFrontmatter.length > 0) {
    console.error(`⚙️  Found ${missingFrontmatter.length} files missing review frontmatter.`);
    console.error('   Add last_reviewed and review_interval_days to these files.');
    process.exit(1);
  }

  console.log('✅ All documentation reviews are up to date!');
}

// Run the check
if (require.main === module) {
  checkReviewSchedule();
}

module.exports = { checkReviewSchedule };
