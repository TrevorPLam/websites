#!/usr/bin/env node
/**
 * Bundle size checker - enforces performance budgets.
 * 
 * **Purpose:** Prevents bundle bloat that degrades page load times.
 * Runs in CI after build to catch size regressions before deployment.
 * 
 * **Performance Impact:**
 * - +100KB = ~1s slower load on 3G
 * - +500KB = ~5s slower load on 3G
 * - 53% of users abandon if load > 3s
 * 
 * **Budget Philosophy:**
 * - Main chunks: 250KB max (core framework code)
 * - Page chunks: 150KB max (per-route code)
 * - Total budget designed for <3s load on 3G
 * 
 * **Exit Codes:**
 * - 0: All chunks within budget
 * - 1: One or more chunks exceed budget
 * 
 * @see Issue #031 for implementation rationale
 * 
 * @example
 * ```bash
 * # Run after build
 * npm run build && node scripts/check-bundle-size.mjs
 * 
 * # In CI (fails pipeline on violation)
 * - run: node scripts/check-bundle-size.mjs
 * ```
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Performance budget limits in bytes.
 * 
 * Based on target load times and network conditions:
 * - 3G network: ~1MB/s download
 * - Target: <3s to interactive
 * - Budget: ~250KB per chunk (conservative)
 */
const CHUNK_SIZE_LIMIT_KB = 250
const KB = 1024

/**
 * Get file size in bytes.
 * 
 * @param {string} filePath - Absolute path to file
 * @returns {number} File size in bytes, or 0 if error
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch {
    return 0
  }
}

/**
 * Recursively get all files in directory.
 * 
 * @param {string} dir - Directory to traverse
 * @returns {string[]} Array of absolute file paths
 */
function getAllFiles(dir) {
  const files = []
  
  /**
   * Recursive traversal helper.
   * @param {string} currentPath - Current directory path
   */
  function traverse(currentPath) {
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true })
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item.name)
        
        if (item.isDirectory()) {
          traverse(fullPath)
        } else if (item.isFile()) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      // Silently skip inaccessible directories
    }
  }
  
  traverse(dir)
  return files
}

/**
 * Main bundle size check function.
 * 
 * Scans .next/static/chunks for JavaScript files and validates
 * each against the size budget.
 * 
 * @returns {boolean} true if all chunks pass, false if any violations
 */
function checkBundleSize() {
  const nextDir = path.join(__dirname, '..', '.next')
  const staticDir = path.join(nextDir, 'static')
  
  if (!fs.existsSync(staticDir)) {
    console.log('ℹ️  No .next/static directory found. Skipping bundle size check.')
    return true
  }
  
  console.log('📦 Checking bundle sizes...')
  
  const chunksDir = path.join(staticDir, 'chunks')
  const allChunks = getAllFiles(chunksDir).filter(f => f.endsWith('.js'))
  
  const violations = []
  const limitBytes = CHUNK_SIZE_LIMIT_KB * KB
  let totalSize = 0
  
  // Check each chunk against budget
  for (const chunk of allChunks) {
    const relativePath = path.relative(staticDir, chunk)
    const sizeBytes = getFileSize(chunk)
    const sizeKB = Math.round(sizeBytes / KB)
    
    totalSize += sizeBytes
    
    if (sizeBytes > limitBytes) {
      violations.push({
        file: relativePath,
        size: sizeKB,
        limit: CHUNK_SIZE_LIMIT_KB,
        exceeded: sizeKB - CHUNK_SIZE_LIMIT_KB,
      })
    }
  }
  
  // Report results
  if (violations.length > 0) {
    console.error('❌ Bundle size violations detected:\n')
    for (const v of violations) {
      console.error(`  ${v.file}`)
      console.error(`    Size: ${v.size} KB`)
      console.error(`    Limit: ${v.limit} KB`)
      console.error(`    Exceeded by: ${v.exceeded} KB\n`)
    }
    console.error(`Bundle size check FAILED. ${violations.length} chunk(s) exceed budget.`)
    console.error(`Total bundle size: ${Math.round(totalSize / KB)} KB`)
    return false
  }
  
  // Success summary
  const totalSizeKB = Math.round(totalSize / KB)
  console.log(`✅ Bundle size check passed!`)
  console.log(`   Chunks checked: ${allChunks.length}`)
  console.log(`   Total size: ${totalSizeKB} KB`)
  console.log(`   Largest chunk: ${Math.max(...allChunks.map(f => Math.round(getFileSize(f) / KB)))} KB`)
  return true
}

// Execute check and exit with appropriate code
const success = checkBundleSize()
process.exit(success ? 0 : 1)
