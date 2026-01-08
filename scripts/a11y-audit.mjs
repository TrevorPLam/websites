import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = process.env.A11Y_BASE_URL || 'http://localhost:3000'
const axeSourceUrl = process.env.AXE_CORE_URL || 'https://unpkg.com/axe-core@4.10.2/axe.min.js'
const routes = ['/', '/services', '/pricing', '/contact']
const outputDir = path.resolve('reports', 'a11y')

const slugifyRoute = (route) => (route === '/' ? 'home' : route.replaceAll('/', '-').slice(1))

const timestamp = new Date().toISOString()
const browser = await chromium.launch()
const page = await browser.newPage()
let hasViolations = false

await mkdir(outputDir, { recursive: true })

for (const route of routes) {
  const url = new URL(route, baseUrl).toString()
  await page.goto(url, { waitUntil: 'networkidle' })

  await page.addScriptTag({ url: axeSourceUrl })
  const analysis = await page.evaluate(async () => {
    // @ts-expect-error -- axe is injected at runtime
    return window.axe.run()
  })
  const report = {
    url,
    timestamp,
    ...analysis,
  }

  const reportPath = path.join(outputDir, `${slugifyRoute(route)}.json`)
  await writeFile(reportPath, JSON.stringify(report, null, 2))

  if (analysis.violations.length > 0) {
    hasViolations = true
    console.warn(`A11y violations found for ${url}`)
    for (const violation of analysis.violations) {
      console.warn(`- ${violation.id}: ${violation.help}`)
    }
  } else {
    console.info(`No axe violations for ${url}`)
  }
}

await browser.close()

if (hasViolations) {
  process.exitCode = 1
}
