import { execFile } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const baseUrl = process.env.LIGHTHOUSE_BASE_URL || 'http://localhost:3000'
const lighthouseBin = process.env.LIGHTHOUSE_BIN || 'lighthouse'
const routes = ['/', '/services', '/pricing', '/contact']
const outputDir = path.resolve('reports', 'lighthouse', 'mobile')

const slugifyRoute = (route) => (route === '/' ? 'home' : route.replaceAll('/', '-').slice(1))

const ensureLighthouse = async () => {
  try {
    await execFileAsync(lighthouseBin, ['--version'])
  } catch {
    console.error('Lighthouse CLI not found. Install it with `npm install -g lighthouse` or set LIGHTHOUSE_BIN.')
    process.exit(1)
  }
}

await ensureLighthouse()
await mkdir(outputDir, { recursive: true })

const summaries = []

for (const route of routes) {
  const url = new URL(route, baseUrl).toString()
  const reportPath = path.join(outputDir, `${slugifyRoute(route)}.json`)

  try {
    await execFileAsync(lighthouseBin, [
      url,
      '--quiet',
      '--output',
      'json',
      '--output-path',
      reportPath,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--form-factor=mobile',
      '--config-path',
      path.resolve('.lighthouserc.json'),
    ])

    const report = JSON.parse(await readFile(reportPath, 'utf8'))
    summaries.push({
      url,
      scores: {
        performance: Math.round((report.categories.performance.score ?? 0) * 100),
        accessibility: Math.round((report.categories.accessibility.score ?? 0) * 100),
        bestPractices: Math.round((report.categories['best-practices'].score ?? 0) * 100),
        seo: Math.round((report.categories.seo.score ?? 0) * 100),
      },
      vitals: {
        fcpMs: report.audits['first-contentful-paint'].numericValue,
        lcpMs: report.audits['largest-contentful-paint'].numericValue,
        cls: report.audits['cumulative-layout-shift'].numericValue,
        tbtMs: report.audits['total-blocking-time'].numericValue,
        siMs: report.audits['speed-index'].numericValue,
      },
    })
  } catch (error) {
    console.error(`Lighthouse audit failed for ${url}`)
    console.error(error)
  }
}

const summaryPath = path.resolve('reports', 'lighthouse', 'mobile-summary.json')
await writeFile(summaryPath, JSON.stringify({ generatedAt: new Date().toISOString(), summaries }, null, 2))

console.info(`Saved Lighthouse summaries to ${summaryPath}`)
