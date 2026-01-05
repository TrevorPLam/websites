'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import SearchDialog from '@/components/SearchDialog'
import type { SearchItem } from '@/lib/search'

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/blog', label: 'Blog' },
  { href: '/feed.xml', label: 'RSS' },
  { href: '/about', label: 'About' },
]

interface NavigationProps {
  searchItems: SearchItem[]
}

export default function Navigation({ searchItems }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <nav className="bg-charcoal shadow-sm sticky top-0 z-50" role="navigation" aria-label="Primary">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
            YD Marketer
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-white font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {link.label}
              </Link>
            ))}
            <SearchDialog items={searchItems} />
            <Link href="/contact">
              <Button variant="primary" size="small">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <SearchDialog items={searchItems} variant="mobile" />
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-charcoal border-t border-white/10"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="px-6 py-4 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white hover:text-white font-semibold py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => setIsMobileMenuOpen(false)}
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="medium" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
