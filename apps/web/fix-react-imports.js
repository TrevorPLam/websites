#!/usr/bin/env node

/**
 * Fix React imports in generated files
 */

const fs = require('fs')
const path = require('path')

function addReactImport(filePath) {
  if (!fs.existsSync(filePath)) return
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Add React import if missing and file contains JSX
  if (content.includes('return (') && !content.includes('import React')) {
    content = `import React from 'react'\n\n${content}`
    fs.writeFileSync(filePath, content, 'utf8')
  }
}

function fixDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return
  
  const files = fs.readdirSync(dirPath, { withFileTypes: true })
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file.name)
    
    if (file.isDirectory()) {
      fixDirectory(fullPath)
    } else if (file.name.endsWith('.tsx')) {
      addReactImport(fullPath)
    }
  })
}

console.log('🔧 Fixing React imports...')
fixDirectory('src')
console.log('✅ React imports fixed!')
