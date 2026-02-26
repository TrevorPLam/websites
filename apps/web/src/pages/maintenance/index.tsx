/**
 * @file apps/web/src/pages/maintenance/index.tsx
 * @summary maintenance page composition.
 * @description maintenance page with FSD composition.
 */

'use client'

import { SiteHeader } from '@/widgets/site-header'
import { Footer } from '@/widgets/footer'

export function MaintenancePage() {
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
            Maintenance
          </h1>
          <p className="text-xl text-gray-600">
            Maintenance page content
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
}
export default MaintenancePage
