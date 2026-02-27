#!/usr/bin/env node

/**
 * Semantic Chunking Script for 2026 Bimodal Documentation Standards
 * 
 * Splits large markdown files into 800-1200 token chunks while maintaining
 * semantic coherence and context for AI retrieval optimization.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';

function countTokens(text) {
  // Simple token approximation (roughly 4 characters per token)
  return Math.ceil(text.length / 4);
}

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    return {
      frontmatter: match[0],
      content: content.substring(match[0].length)
    };
  }
  
  return {
    frontmatter: '',
    content: content
  };
}

function findLogicalBreaks(content) {
  const breaks = [];
  
  // Find major section breaks (## headers)
  const sectionRegex = /^##\s+(.+)$/gm;
  let match;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    breaks.push({
      index: match.index,
      title: match[1],
      level: 2
    });
  }
  
  // If no ## headers, try ### headers
  if (breaks.length === 0) {
    const subsectionRegex = /^###\s+(.+)$/gm;
    while ((match = subsectionRegex.exec(content)) !== null) {
      breaks.push({
        index: match.index,
        title: match[1],
        level: 3
      });
    }
  }
  
  return breaks;
}

function createSemanticChunks(content, targetTokens = 1000) {
  const chunks = [];
  const breaks = findLogicalBreaks(content);
  
  if (breaks.length === 0) {
    // No logical breaks found, split by token count
    return splitByTokens(content, targetTokens);
  }
  
  let currentChunk = '';
  let currentTokens = 0;
  
  for (let i = 0; i <= breaks.length; i++) {
    const startIndex = i === 0 ? 0 : breaks[i - 1].index;
    const endIndex = i === breaks.length ? content.length : breaks[i].index;
    const section = content.substring(startIndex, endIndex);
    const sectionTokens = countTokens(section);
    
    // If adding this section would exceed target tokens
    if (currentTokens + sectionTokens > targetTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = section;
      currentTokens = sectionTokens;
    } else {
      currentChunk += section;
      currentTokens += sectionTokens;
    }
  }
  
  // Add the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

function splitByTokens(content, targetTokens) {
  const chunks = [];
  const words = content.split(/\s+/);
  let currentChunk = '';
  let currentTokens = 0;
  
  for (const word of words) {
    const wordTokens = countTokens(word);
    
    if (currentTokens + wordTokens > targetTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
      currentTokens = wordTokens;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word;
      currentTokens += wordTokens;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

function createChunkedFiles(filePath, chunks, frontmatter) {
  const dir = dirname(filePath);
  const baseName = basename(filePath, '.md');
  
  return chunks.map((chunk, index) => {
    const chunkNumber = index + 1;
    const chunkFileName = `${baseName}-chunk-${chunkNumber}.md`;
    const chunkFilePath = join(dir, chunkFileName);
    
    // Create chunk-specific frontmatter
    const chunkFrontmatter = createChunkFrontmatter(frontmatter, chunkNumber, chunks.length, chunk);
    
    const chunkContent = chunkFrontmatter + chunk;
    
    return {
      path: chunkFilePath,
      content: chunkContent,
      tokens: countTokens(chunk)
    };
  });
}

function createChunkFrontmatter(originalFrontmatter, chunkNumber, totalChunks, chunkContent) {
  // Parse original frontmatter
  const frontmatterLines = originalFrontmatter.split('\n').filter(line => line.trim());
  
  // Add chunking metadata
  const chunkingMetadata = [
    'chunking:',
    '  total_chunks: ' + totalChunks,
    '  chunk_number: ' + chunkNumber,
    '  tokens: ' + countTokens(chunkContent),
    '  created_at: "' + new Date().toISOString() + '"',
    '  ai_optimized: true'
  ];
  
  // Combine frontmatter
  const newFrontmatterLines = [
    ...frontmatterLines.slice(0, -1), // All except closing ---
    ...chunkingMetadata,
    '---'
  ];
  
  return newFrontmatterLines.join('\n') + '\n\n';
}

function processFile(filePath, targetTokens = 1000) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const tokens = countTokens(content);
    
    console.log(`\n📄 Processing: ${filePath}`);
    console.log(`   Tokens: ${tokens.toLocaleString()}`);
    
    if (tokens <= 1200) {
      console.log(`   ✅ Already within target range (800-1200 tokens)`);
      return [];
    }
    
    const { frontmatter, content: bodyContent } = extractFrontmatter(content);
    const chunks = createSemanticChunks(bodyContent, targetTokens);
    const chunkedFiles = createChunkedFiles(filePath, chunks, frontmatter);
    
    console.log(`   🔄 Splitting into ${chunks.length} chunks:`);
    
    chunkedFiles.forEach((chunk, index) => {
      writeFileSync(chunk.path, chunk.content, 'utf8');
      console.log(`     Chunk ${index + 1}: ${chunk.path} (${chunk.tokens.toLocaleString()} tokens)`);
    });
    
    // Create index file for navigation
    createIndexFile(filePath, chunkedFiles);
    
    return chunkedFiles;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return [];
  }
}

function createIndexFile(originalFilePath, chunkedFiles) {
  const dir = dirname(originalFilePath);
  const baseName = basename(originalFilePath, '.md');
  const indexFilePath = join(dir, `${baseName}-index.md`);
  
  const indexContent = `---
name: ${baseName}-index
description: |
  Index file for semantic chunks of ${baseName}.md
  USE FOR: Navigation and context for AI retrieval
  AI_OPTIMIZED: true
chunking:
  type: "index"
  total_chunks: ${chunkedFiles.length}
  created_at: "${new Date().toISOString()}"
---

# ${baseName} - Semantic Chunk Index

## Overview
This document has been semantically chunked for optimal AI retrieval. The original file exceeded 1200 tokens and has been split into ${chunkedFiles.length} logical chunks.

## Chunks

${chunkedFiles.map((chunk, index) => {
  const chunkFileName = basename(chunk.path);
  return `### Chunk ${index + 1}: ${chunkFileName}

- **Tokens**: ${chunk.tokens.toLocaleString()}
- **File**: [${chunkFileName}](${chunkFileName})
- **Focus**: ${extractChunkFocus(chunk.content)}
`;
}).join('\n')}

## Navigation
- Start with [Chunk 1](${basename(chunkedFiles[0].path)}) for the introduction
- Each chunk is designed to be semantically complete
- Use this index to navigate to specific sections

## AI Retrieval Tips
- Each chunk is optimized for 800-1200 token context windows
- Chunks maintain semantic coherence and context
- Use specific chunk files for targeted information retrieval
`;
  
  writeFileSync(indexFilePath, indexContent, 'utf8');
  console.log(`   📋 Created index: ${indexFilePath}`);
}

function extractChunkFocus(content) {
  // Extract first heading or first paragraph as focus
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1];
  }
  
  const paragraphMatch = content.match(/^(.+)$/m);
  if (paragraphMatch) {
    return paragraphMatch[1].substring(0, 100) + '...';
  }
  
  return 'General content';
}

function main() {
  const args = process.argv.slice(2);
  
  console.log('Arguments received:', args);
  
  if (args.length === 0) {
    console.log('Usage: node semantic-chunker.mjs <file-path> [target-tokens]');
    console.log('Example: node semantic-chunker.mjs docs/guide.md 1000');
    process.exit(1);
  }
  
  const filePath = args[0];
  const targetTokens = parseInt(args[1]) || 1000;
  
  console.log('File path:', filePath);
  console.log('Target tokens:', targetTokens);
  
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  
  console.log('🚀 Semantic Chunking for 2026 Bimodal Documentation Standards');
  console.log('==========================================================');
  
  const chunkedFiles = processFile(filePath, targetTokens);
  
  console.log(`\n✅ Processing complete!`);
  console.log(`   Files created: ${chunkedFiles.length + 1} (chunks + index)`);
  console.log(`   Target token range: 800-1200 tokens per chunk`);
  console.log(`   AI optimization: Enabled`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
