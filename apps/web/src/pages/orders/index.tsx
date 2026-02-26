import React from 'react'

/**
 * @file apps/web/src/pages/orders/index.tsx
 * @summary orders page composition.
 * @description orders page with FSD composition.
 */

'use client'

import { SiteHeader } from '@/widgets/site-header'
import { Footer } from '@/widgets/footer'

export function OrdersPage() {
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
            Orders
          </h1>
          <p className="text-xl text-gray-600">
            Orders page content
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