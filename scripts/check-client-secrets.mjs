import fs from 'fs'
import path from 'path'

const clientBundleDir = path.join(process.cwd(), '.next', 'static', 'chunks')
const forbiddenTokens = [
  'RESEND_API_KEY',
  'CONTACT_EMAIL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'HUBSPOT_PRIVATE_APP_TOKEN',
]

const walkFiles = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return []
  }

  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      return walkFiles(entryPath)
    }
    return [entryPath]
  })
}

const clientFiles = walkFiles(clientBundleDir)

if (clientFiles.length === 0) {
  console.warn('⚠️ No client bundle files found. Run `npm run build` before this check.')
  process.exit(1)
}

const findings = []

for (const filePath of clientFiles) {
  const contents = fs.readFileSync(filePath, 'utf8')
  for (const token of forbiddenTokens) {
    if (contents.includes(token)) {
      findings.push({ filePath, token })
    }
  }
}

if (findings.length > 0) {
  console.error('❌ Client bundle contains forbidden server-only env references:')
  for (const finding of findings) {
    console.error(`- ${finding.token} found in ${finding.filePath}`)
  }
  process.exit(1)
}

console.log('✅ Client bundle check passed: no server-only env tokens detected.')
