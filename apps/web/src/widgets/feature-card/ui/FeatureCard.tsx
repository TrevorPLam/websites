import React from 'react'

/**
 * @file apps/web/src/widgets/feature-card/ui/FeatureCard.tsx
 * @summary Feature card component.
 * @description Individual feature showcase card.
 */

export interface FeatureCardProps {
  icon: string
  title: string
  description: string
  link?: {
    text: string
    href: string
  }
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed mb-4">
        {description}
      </p>
      {link && (
        <a
          href={link.href}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          {link.text}
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      )}
    </div>
  )
}
