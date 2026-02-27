#!/usr/bin/env node

/**
 * Identify files exceeding 1200 tokens for semantic chunking
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function countTokens(text) {
  // Simple token approximation (roughly 4 characters per token)
  return Math.ceil(text.length / 4);
}

function findMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (extname(item) === '.md') {
        try {
          const content = readFileSync(fullPath, 'utf8');
          const tokens = countTokens(content);
          files.push({
            path: fullPath,
            tokens: tokens,
            size: content.length
          });
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  const rootDir = process.cwd();
  const allFiles = findMarkdownFiles(rootDir);
  
  // Filter files exceeding 1200 tokens
  const largeFiles = allFiles.filter(file => file.tokens > 1200);
  
  // Sort by token count (highest first)
  largeFiles.sort((a, b) => b.tokens - a.tokens);
  
  console.log(`\n📊 SEMANTIC CHUNKING ANALYSIS`);
  console.log(`================================`);
  console.log(`Total markdown files: ${allFiles.length}`);
  console.log(`Files exceeding 1200 tokens: ${largeFiles.length}`);
  console.log(`Percentage needing chunking: ${((largeFiles.length / allFiles.length) * 100).toFixed(1)}%\n`);
  
  console.log(`🔥 HIGH PRIORITY FILES (>5000 tokens):`);
  const criticalFiles = largeFiles.filter(file => file.tokens > 5000);
  criticalFiles.forEach(file => {
    console.log(`  ${file.tokens.toLocaleString()} tokens: ${file.path}`);
  });
  
  console.log(`\n⚠️  MEDIUM PRIORITY FILES (2000-5000 tokens):`);
  const mediumFiles = largeFiles.filter(file => file.tokens >= 2000 && file.tokens <= 5000);
  mediumFiles.slice(0, 10).forEach(file => {
    console.log(`  ${file.tokens.toLocaleString()} tokens: ${file.path}`);
  });
  if (mediumFiles.length > 10) {
    console.log(`  ... and ${mediumFiles.length - 10} more files`);
  }
  
  console.log(`\n📝 LOW PRIORITY FILES (1200-2000 tokens):`);
  const lowFiles = largeFiles.filter(file => file.tokens >= 1200 && file.tokens < 2000);
  lowFiles.slice(0, 10).forEach(file => {
    console.log(`  ${file.tokens.toLocaleString()} tokens: ${file.path}`);
  });
  if (lowFiles.length > 10) {
    console.log(`  ... and ${lowFiles.length - 10} more files`);
  }
  
  // Generate processing list
  console.log(`\n🎯 PROCESSING PLAN:`);
  console.log(`Phase 1: ${criticalFiles.length} critical files (>5000 tokens)`);
  console.log(`Phase 2: ${mediumFiles.length} medium files (2000-5000 tokens)`);
  console.log(`Phase 3: ${lowFiles.length} low files (1200-2000 tokens)`);
  console.log(`Total: ${largeFiles.length} files need semantic chunking\n`);
  
  // Export list for processing
  const processingList = largeFiles.map(file => ({
    path: file.path.replace(rootDir + '\\', ''),
    tokens: file.tokens,
    priority: file.tokens > 5000 ? 'critical' : file.tokens >= 2000 ? 'medium' : 'low',
    estimatedChunks: Math.ceil(file.tokens / 1000)
  }));
  
  console.log(`📋 PROCESSING LIST (JSON format):`);
  console.log(JSON.stringify(processingList, null, 2));
}

main();
