import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

try {
  require.resolve('@vitest/coverage-v8')
} catch (error) {
  console.error(
    [
      'Coverage provider missing: install @vitest/coverage-v8 before running coverage.',
      '- Run: npm install -D @vitest/coverage-v8',
      '- If registry access is blocked, see TODO.md (T-031) for next steps.',
    ].join('\n'),
  )
  process.exit(1)
}
