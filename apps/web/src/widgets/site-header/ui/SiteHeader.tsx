import React from 'react'

/**
 * @file apps/web/src/widgets/site-header/ui/SiteHeader.tsx
 * @summary Site header component.
 * @description Main site header with navigation and branding.
 */

import Link from 'next/link'

export interface SiteHeaderProps {
  siteName: string
  navigation?: {
    label: string
    href: string
  }[]
}

export function SiteHeader({ siteName, navigation = [] }: SiteHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {siteName}
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
