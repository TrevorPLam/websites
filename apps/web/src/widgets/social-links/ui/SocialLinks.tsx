import React from 'react'

/**
 * @file apps/web/src/widgets/social-links/ui/SocialLinks.tsx
 * @summary Social links component.
 * @description Social media links with icons.
 */

export interface SocialLink {
  name: string
  href: string
  icon: string
}

export interface SocialLinksProps {
  links: SocialLink[]
  variant?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

export function SocialLinks({ links, variant = 'horizontal', size = 'md' }: SocialLinksProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const containerClasses = variant === 'horizontal' 
    ? 'flex space-x-4' 
    : 'flex flex-col space-y-4'

  return (
    <div className={containerClasses}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label={link.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={sizeClasses[size]}>{link.icon}</span>
        </a>
      ))}
    </div>
  )
}
