// Cleanup and organize domain files
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', '..', 'docs', 'plan');

console.log('Cleaning up domain files...');

// Get all domain directories
const domainDirs = fs
  .readdirSync(BASE_DIR)
  .filter((dir) => dir.startsWith('domain-') && fs.statSync(path.join(BASE_DIR, dir)).isDirectory())
  .sort();

let totalCleaned = 0;

domainDirs.forEach((domainDir) => {
  const domainPath = path.join(BASE_DIR, domainDir);
  const files = fs.readdirSync(domainPath).filter((file) => file.endsWith('.md'));

  // Separate README files from section files
  const readmeFiles = files.filter((file) => file.toLowerCase() === 'readme.md');
  const sectionFiles = files.filter((file) => file.toLowerCase() !== 'readme.md');

  // Find the preferred format (X.Y-title.md vs X.Y-title.md duplicates)
  const preferredFiles = [];
  const duplicateFiles = [];

  sectionFiles.forEach((file) => {
    // Check if this is the preferred format (starts with number.number)
    if (/^\d+\.\d+-/.test(file)) {
      preferredFiles.push(file);
    } else {
      duplicateFiles.push(file);
    }
  });

  // Remove duplicate files
  duplicateFiles.forEach((file) => {
    const filePath = path.join(domainPath, file);
    fs.unlinkSync(filePath);
    console.log(`  Removed duplicate: ${file}`);
  });

  // Count remaining files
  const remainingFiles = fs.readdirSync(domainPath).filter((file) => file.endsWith('.md'));
  totalCleaned += remainingFiles.length;

  console.log(
    `${domainDir}: ${remainingFiles.length} files (${duplicateFiles.length} duplicates removed)`
  );
});

console.log(`\nCleanup complete! Total files: ${totalCleaned}`);
