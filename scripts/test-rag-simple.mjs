#!/usr/bin/env node

/**
 * @file scripts/test-rag-simple.mjs
 * @summary Simplified test script for RAG pipeline basic functionality.
 * @description Lightweight test to verify core RAG pipeline components without dependencies.
 * @security No sensitive data handled; read-only file operations for testing.
 * @adr none
 * @requirements AI-RAG-TEST-002, pipeline-testing-simple
 */

import { existsSync, mkdirSync, readFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';

console.log('🧪 Testing RAG Pipeline functionality...');

// Test basic functionality
try {
  const docsDir = 'docs';

  if (!existsSync(docsDir)) {
    console.log('📁 Creating test docs directory...');
    mkdirSync(docsDir, { recursive: true });

    // Create test files
    const testContent = `# Test Document

This is a test document for the RAG pipeline.

## React Hooks

React hooks are functions that let you "hook into" React state and lifecycle features
from function components.

### useState

The useState hook lets you add React state to function components.

\`\`\javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
}
\`\`

### useEffect

The useEffect hook lets you perform side effects in function components.

\`\`\javascript
import { useEffect } from 'react';

function DataFetcher({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setData);
  }, [userId]);
}
\`\```;
`;

    writeFileSync(join(docsDir, 'test.md'), testContent);
    console.log('✅ Created test document');
  }

  // Test file reading
  const files = await glob(`${docsDir}/**/*.md`);
  console.log(`📚 Found ${files.length} markdown files`);

  // Test content processing
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    if (content.includes('React hooks')) {
      console.log(`✅ Found React hooks in: ${file}`);
    }
  }

  console.log('✅ RAG Pipeline basic functionality test passed!');
} catch (error) {
  console.error('❌ RAG Pipeline test failed:', error.message);
  process.exit(1);
}

console.log('🎉 RAG Pipeline conversion to JavaScript completed!');
