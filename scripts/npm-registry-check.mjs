import { execSync } from 'node:child_process'

const DEFAULT_REGISTRY = 'https://registry.npmjs.org'
const PROXY_ENV_VARS = [
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'NO_PROXY',
  'http_proxy',
  'https_proxy',
  'no_proxy',
  'npm_config_proxy',
  'npm_config_https_proxy',
  'npm_config_http_proxy',
]
const TIMEOUT_MS = 5000

const readRegistry = () => {
  const envRegistry = process.env.npm_config_registry

  try {
    const npmConfigRegistry = execSync('npm config get registry', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()

    if (npmConfigRegistry && npmConfigRegistry !== 'undefined' && npmConfigRegistry !== 'null') {
      return npmConfigRegistry
    }
  } catch {
    // If npm is unavailable, fall back to env/default.
  }

  if (envRegistry && envRegistry !== 'undefined') {
    return envRegistry
  }

  return DEFAULT_REGISTRY
}

const registry = readRegistry().replace(/\/$/, '')

const activeProxies = PROXY_ENV_VARS.map((name) => ({ name, value: process.env[name] })).filter(
  ({ value }) => value && value.length > 0,
)

const withTimeout = (url) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  return {
    controller,
    cleanup: () => clearTimeout(timeoutId),
  }
}

const checkEndpoint = async (path, label) => {
  const url = `${registry}${path}`
  const { controller, cleanup } = withTimeout(url)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'npm-registry-check' },
    })
    cleanup()

    return {
      ok: response.ok,
      status: response.status,
      label,
      url,
    }
  } catch (error) {
    cleanup()
    return {
      ok: false,
      label,
      url,
      error: error.message,
    }
  }
}

const checks = [
  { path: '/-/ping', label: 'Registry ping' },
  { path: '/next', label: 'Package metadata (next)' },
]

const printProxyInfo = () => {
  if (activeProxies.length === 0) {
    console.log('🌐 No proxy environment variables detected.')
    return
  }

  console.warn('⚠️ Proxy environment variables detected:')
  for (const { name, value } of activeProxies) {
    console.warn(`- ${name}=${value}`)
  }
  console.warn('Consider unsetting or updating these if registry access returns 403/blocked responses.')
}

const printFailures = (results) => {
  console.error('\n❌ Registry connectivity check failed.')
  for (const result of results) {
    if (result.error) {
      console.error(`- ${result.label}: ${result.error} (${result.url})`)
      continue
    }

    console.error(`- ${result.label}: HTTP ${result.status} (${result.url})`)
  }

  console.error(
    [
      '\nSuggested steps:',
      '- Clear proxy variables (HTTP_PROXY/HTTPS_PROXY/NO_PROXY) or point them to a working proxy.',
      '- Set registry explicitly: npm config set registry https://registry.npmjs.org/',
      '- Retry in an environment with outbound access (see TODO.md tasks T-030, T-031).',
      '- See docs/workflows/SETUP.md common issues for additional guidance.',
    ].join('\n'),
  )
}

const run = async () => {
  console.log('🔎 npm registry diagnostics')
  console.log(`Registry: ${registry}`)
  printProxyInfo()

  const results = []

  for (const check of checks) {
    const result = await checkEndpoint(check.path, check.label)
    results.push(result)
    const statusLabel = result.ok ? '✅' : '❌'
    const detail = result.error ? result.error : `HTTP ${result.status}`
    console.log(`${statusLabel} ${check.label}: ${detail}`)
  }

  const failures = results.filter((result) => !result.ok)

  if (failures.length > 0) {
    printFailures(failures)
    process.exit(1)
  }

  console.log('\n✅ Registry reachable. npm install and lockfile commands should succeed.')
}

run().catch((error) => {
  console.error('Unexpected error while running registry diagnostics:', error)
  process.exit(1)
})
