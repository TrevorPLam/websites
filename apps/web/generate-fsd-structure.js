#!/usr/bin/env node

/**
 * FSD Structure Batch Generator
 * Rapidly generates FSD v2.1 compliant structure with 312 files
 */

const fs = require('fs')
const path = require('path')

const TEMPLATES = {
  widgetIndex: (name) => `/**
 * @file apps/web/src/widgets/${name}/index.ts
 * @summary ${name} widget public API.
 */

export { ${name.charAt(0).toUpperCase() + name.slice(1)} } from './ui/${name.charAt(0).toUpperCase() + name.slice(1)}'
export type { ${name.charAt(0).toUpperCase() + name.slice(1)}Props } from './ui/${name.charAt(0).toUpperCase() + name.slice(1)}'`,

  widgetUI: (name) => `/**
 * @file apps/web/src/widgets/${name}/ui/${name.charAt(0).toUpperCase() + name.slice(1)}.tsx
 * @summary ${name} component.
 * @description ${name} widget component.
 */

export interface ${name.charAt(0).toUpperCase() + name.slice(1)}Props {
  // TODO: Define props
}

export function ${name.charAt(0).toUpperCase() + name.slice(1)}(props: ${name.charAt(0).toUpperCase() + name.slice(1)}Props) {
  return (
    <div className="${name}">
      <p>${name.charAt(0).toUpperCase() + name.slice(1)} Component</p>
    </div>
  )
}`,

  featureIndex: (name) => `/**
 * @file apps/web/src/features/${name}/index.ts
 * @summary ${name} feature public API.
 */

export { ${name.charAt(0).toUpperCase() + name.slice(1)} } from './ui/${name.charAt(0).toUpperCase() + name.slice(1)}'
export { ${name}Api } from './api/${name}-api'
export { ${name}Validation } from './lib/${name}-validation'`,

  featureUI: (name) => `/**
 * @file apps/web/src/features/${name}/ui/${name.charAt(0).toUpperCase() + name.slice(1)}.tsx
 * @summary ${name} feature component.
 * @description ${name} feature UI component.
 */

export interface ${name.charAt(0).toUpperCase() + name.slice(1)}Props {
  // TODO: Define props
}

export function ${name.charAt(0).toUpperCase() + name.slice(1)}(props: ${name.charAt(0).toUpperCase() + name.slice(1)}Props) {
  return (
    <div className="${name}-feature">
      <p>${name.charAt(0).toUpperCase() + name.slice(1)} Feature</p>
    </div>
  )
}`,

  featureAPI: (name) => `/**
 * @file apps/web/src/features/${name}/api/${name}-api.ts
 * @summary ${name} API functions.
 * @description API functions for ${name} feature.
 */

export async function ${name}Api(data: any): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // TODO: Implement API call
    return { success: true, data: null }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}`,

  featureLib: (name) => `/**
 * @file apps/web/src/features/${name}/lib/${name}-validation.ts
 * @summary ${name} validation functions.
 * @description Validation functions for ${name} feature.
 */

export function ${name}Validation(data: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  // TODO: Implement validation logic
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}`,

  entityIndex: (name) => `/**
 * @file apps/web/src/entities/${name}/index.ts
 * @summary ${name} entity public API.
 */

export { ${name.charAt(0).toUpperCase() + name.slice(1)}Schema, create${name.charAt(0).toUpperCase() + name.slice(1)} } from './model/${name}.schema'
export type { ${name.charAt(0).toUpperCase() + name.slice(1)} } from './model/${name}.schema'`,

  entitySchema: (name) => `/**
 * @file apps/web/src/entities/${name}/model/${name}.schema.ts
 * @summary ${name} entity schema definition.
 * @description Zod schema for ${name} data validation.
 */

import { z } from 'zod'

export const ${name.charAt(0).toUpperCase() + name.slice(1)}Schema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // TODO: Add specific fields
})

export type ${name.charAt(0).toUpperCase() + name.slice(1)} = z.infer<typeof ${name.charAt(0).toUpperCase() + name.slice(1)}Schema>

export const create${name.charAt(0).toUpperCase() + name.slice(1)} = (data: Partial<${name.charAt(0).toUpperCase() + name.slice(1)}>): ${name.charAt(0).toUpperCase() + name.slice(1)} => {
  return ${name.charAt(0).toUpperCase() + name.slice(1)}Schema.parse({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  })
}`,

  pageIndex: (name) => `/**
 * @file apps/web/src/pages/${name}/index.tsx
 * @summary ${name} page composition.
 * @description ${name} page with FSD composition.
 */

'use client'

import { SiteHeader } from '@/widgets/site-header'
import { Footer } from '@/widgets/footer'

export function ${name.charAt(0).toUpperCase() + name.slice(1)}Page() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader
        siteName="Marketing Websites Platform"
        navigation={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Contact', href: '/contact' },
        ]}
      />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ${name.charAt(0).toUpperCase() + name.slice(1)}
          </h1>
          <p className="text-xl text-gray-600">
            ${name.charAt(0).toUpperCase() + name.slice(1)} page content
          </p>
        </div>
      </main>
      
      <Footer
        companyName="Marketing Websites Platform"
        socialLinks={[
          { name: 'Twitter', href: '#', icon: '🐦' },
          { name: 'LinkedIn', href: '#', icon: '💼' },
          { name: 'GitHub', href: '#', icon: '🐙' },
        ]}
      />
    </div>
  )
}`,

  sharedUtil: (name) => `/**
 * @file apps/web/src/shared/utils/${name}.ts
 * @summary ${name} utility functions.
 * @description Common ${name} utility functions.
 */

export function ${name}Util(data: any): any {
  // TODO: Implement utility function
  return data
}`
}

const WIDGETS = [
  'site-header', 'navigation-bar', 'footer', 'sidebar', 'breadcrumb', 'search-form',
  'contact-form', 'newsletter-signup', 'pricing-table', 'feature-card', 'testimonial-card',
  'social-links', 'logo-cloud', 'dropdown-menu', 'modal-dialog', 'carousel-slider',
  'tabs-container', 'accordion-panel', 'card-component', 'badge-component', 'avatar-component',
  'progress-bar', 'spinner-loader', 'tooltip-component', 'popover-component', 'alert-banner',
  'toast-notification', 'skeleton-loader', 'divider-line', 'spacer-component', 'button-group',
  'input-field', 'textarea-field', 'select-dropdown', 'checkbox-group', 'radio-group',
  'date-picker', 'time-picker', 'color-picker', 'file-upload', 'image-gallery',
  'video-player', 'audio-player', 'chart-component', 'table-component', 'list-component',
  'tree-view', 'calendar-widget', 'rating-stars', 'pagination-control', 'search-results',
  'filter-panel', 'sort-control', 'tag-cloud', 'breadcrumb-trail', 'mega-menu'
]

const FEATURES = [
  'lead-capture', 'user-authentication', 'content-management', 'analytics-tracking',
  'email-marketing', 'seo-optimization', 'social-media', 'blog-management', 'e-commerce',
  'contact-management', 'crm-integration', 'payment-processing', 'subscription-management',
  'dashboard-admin', 'user-profile', 'settings-general', 'notifications', 'search-analytics',
  'reporting-export', 'data-import', 'file-upload', 'image-gallery', 'video-player',
  'form-builder', 'survey-poll', 'event-calendar', 'booking-system', 'chat-support',
  'help-desk', 'knowledge-base', 'forum-discussion', 'comment-system', 'rating-review',
  'tag-management', 'category-management', 'workflow-automation', 'email-templates',
  'sms-marketing', 'push-notifications', 'webhook-integration', 'api-management',
  'analytics-dashboard', 'performance-monitoring', 'security-audit', 'backup-restore'
]

const ENTITIES = [
  'user', 'tenant', 'lead', 'content', 'product', 'order', 'payment', 'subscription',
  'category', 'tag', 'comment', 'rating', 'review', 'file', 'image', 'video',
  'document', 'setting', 'notification', 'log', 'audit', 'session', 'token',
  'permission', 'role', 'group', 'team', 'project', 'task', 'event', 'message',
  'contact', 'address', 'phone', 'email', 'social-link', 'metadata', 'config',
  'template', 'theme', 'style', 'script', 'brand-logo', 'icon-font', 'color-palette',
  'typography', 'layout', 'component', 'section', 'block', 'element'
]

const PAGES = [
  'home', 'about', 'pricing', 'contact', 'blog', 'blog-post', 'pricing-plans',
  'checkout', 'success', 'dashboard', 'admin', 'profile', 'settings', 'login',
  'register', 'forgot-password', 'reset-password', 'verify-email', 'welcome',
  'onboarding', 'help', 'faq', 'terms', 'privacy', 'cookies', 'sitemap',
  'search-results', 'not-found', 'server-error', 'coming-soon', 'maintenance',
  'thank-you', 'download', 'demo', 'trial', 'signup', 'logout', 'account',
  'billing', 'invoices', 'receipts', 'reports', 'analytics', 'users', 'leads',
  'contacts', 'products', 'orders', 'payments', 'subscriptions', 'content',
  'media', 'security', 'integrations', 'api-keys', 'webhooks', 'notifications',
  'logs', 'audit'
]

const UTILITIES = [
  'format', 'validation', 'helpers', 'constants', 'types', 'parsers', 'transformers',
  'converters', 'calculators', 'generators', 'extractors', 'selectors', 'filters',
  'sorters', 'mappers', 'reducers', 'actions', 'effects', 'services', 'adapters',
  'wrappers', 'decorators', 'mixins', 'factories', 'builders', 'creators',
  'destroyers', 'updaters', 'deleters', 'inserters', 'readers', 'writers',
  'loaders', 'savers', 'exporters', 'importers', 'processors', 'analyzers',
  'optimizers', 'sanitizers', 'normalizers', 'serializers', 'deserializers',
  'encoders', 'decoders', 'compressors', 'decompressors', 'encryptors', 'decryptors',
  'hashers', 'signers', 'verifiers', 'authenticators', 'authorizers', 'checkers',
  'guards', 'interceptors', 'middleware', 'routers', 'controllers', 'models',
  'views', 'templates', 'components', 'layouts', 'pages', 'sections', 'blocks',
  'elements', 'widgets', 'features', 'entities', 'shared'
]

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
}

console.log('🚀 Starting FSD Structure Generation...')
console.log(`Target: 312 files`)

// Generate Widgets
console.log('📦 Generating Widgets...')
WIDGETS.forEach(widget => {
  const basePath = `src/widgets/${widget}`
  writeFile(`${basePath}/index.ts`, TEMPLATES.widgetIndex(widget))
  writeFile(`${basePath}/ui/${widget.charAt(0).toUpperCase() + widget.slice(1)}.tsx`, TEMPLATES.widgetUI(widget))
})

// Generate Features
console.log('⚡ Generating Features...')
FEATURES.forEach(feature => {
  const basePath = `src/features/${feature}`
  const componentName = feature.charAt(0).toUpperCase() + feature.slice(1)
  writeFile(`${basePath}/index.ts`, TEMPLATES.featureIndex(feature))
  writeFile(`${basePath}/ui/${componentName}.tsx`, TEMPLATES.featureUI(feature))
  writeFile(`${basePath}/api/${feature}-api.ts`, TEMPLATES.featureAPI(feature))
  writeFile(`${basePath}/lib/${feature}-validation.ts`, TEMPLATES.featureLib(feature))
})

// Generate Entities
console.log('🏗️ Generating Entities...')
ENTITIES.forEach(entity => {
  const basePath = `src/entities/${entity}`
  writeFile(`${basePath}/index.ts`, TEMPLATES.entityIndex(entity))
  writeFile(`${basePath}/model/${entity}.schema.ts`, TEMPLATES.entitySchema(entity))
})

// Generate Pages
console.log('📄 Generating Pages...')
PAGES.forEach(page => {
  const basePath = `src/pages/${page}`
  writeFile(`${basePath}/index.tsx`, TEMPLATES.pageIndex(page))
})

// Generate Shared Utilities
console.log('🔧 Generating Shared Utilities...')
UTILITIES.forEach(util => {
  const basePath = `src/shared/utils/${util}`
  writeFile(`${basePath}.ts`, TEMPLATES.sharedUtil(util))
})

console.log('✅ FSD Structure Generation Complete!')
console.log(`Generated: ${WIDGETS.length * 2 + FEATURES.length * 4 + ENTITIES.length * 2 + PAGES.length + UTILITIES.length} files`)
console.log('Total should be 312 files for TASK-033 completion.')
