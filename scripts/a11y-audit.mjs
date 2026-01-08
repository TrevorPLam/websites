import { chromium } from '@playwright/test'
import axe from 'axe-core'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = process.env.A11Y_BASE_URL || 'http://localhost:3000'
const routes = ['/', '/services', '/pricing', '/contact']
const outputDir = path.resolve('reports', 'a11y')

const slugifyRoute = (route) => (route === '/' ? 'home' : route.replaceAll('/', '-').slice(1))

const timestamp = new Date().toISOString()
const browser = await chromium.launch()
let hasErrors = false
let hasViolations = false

await mkdir(outputDir, { recursive: true })

for (const route of routes) {
  const url = new URL(route, baseUrl).toString()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    await page.goto(url, { waitUntil: 'networkidle' })

    await page.addScriptTag({ content: axe.source })
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
  } catch (error) {
    hasErrors = true
    console.error(`A11y audit failed for ${url}`)
    console.error(error)
  } finally {
    await context.close()
  }
}

await browser.close()

if (hasViolations || hasErrors) {
  process.exitCode = 1
}
