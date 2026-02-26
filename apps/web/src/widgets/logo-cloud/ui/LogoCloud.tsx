import React from 'react'

/**
 * @file apps/web/src/widgets/logo-cloud/ui/LogoCloud.tsx
 * @summary Logo cloud component.
 * @description Grid of partner/customer logos.
 */

export interface LogoCloudProps {
  logos: {
    name: string
    src: string
    alt: string
  }[]
  title?: string
}

export function LogoCloud({ logos, title = "Trusted by leading companies" }: LogoCloudProps) {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
