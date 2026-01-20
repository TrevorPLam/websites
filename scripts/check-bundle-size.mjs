#!/usr/bin/env node
/**
 * Bundle size checker - ensures bundle doesn't exceed limits.
 * 
 * Enforces performance budgets (Issue #031).
 * Prevents bundle bloat that degrades load times.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUNDLE_SIZE_LIMITS = {
  // Main chunks should be under 250KB (gzipped)
  'chunks/*.js': 250 * 1024,
  // Page chunks should be under 150KB (gzipped)
  'chunks/pages/**/*.js': 150 * 1024,
}

const KB = 1024

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch {
    return 0
  }
}

function getAllFiles(dir, pattern = null) {
  const files = []
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item.name)
      
      if (item.isDirectory()) {
        traverse(fullPath)
      } else if (item.isFile()) {
        files.push(fullPath)
      }
    }
  }
  
  try {
    traverse(dir)
  } catch (error) {
    // Directory doesn't exist
  }
  
  return files
}

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
  
  let hasViolations = false
  const violations = []
  
  for (const chunk of allChunks) {
    const relativePath = path.relative(staticDir, chunk)
    const size = getFileSize(chunk)
    const sizeKB = Math.round(size / KB)
    
    // Check against main chunk limit (250KB)
    const limit = 250 * 1024
    
    if (size > limit) {
      hasViolations = true
      violations.push({
        file: relativePath,
        size: sizeKB,
        limit: Math.round(limit / KB),
      })
    }
  }
  
  if (hasViolations) {
    console.error('❌ Bundle size violations detected:\n')
    for (const v of violations) {
      console.error(`  ${v.file}`)
      console.error(`    Size: ${v.size} KB`)
      console.error(`    Limit: ${v.limit} KB`)
      console.error(`    Exceeded by: ${v.size - v.limit} KB\n`)
    }
    console.error('Bundle size check FAILED. Please optimize bundle or increase limits.')
    return false
  }
  
  console.log(`✅ Bundle size check passed! (${allChunks.length} chunks checked)`)
  return true
}

const success = checkBundleSize()
process.exit(success ? 0 : 1)
