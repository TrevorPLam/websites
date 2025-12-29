import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  title: string
  description: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  variant?: 'default' | 'gradient'
}

/**
 * Reusable CTA Section component
 * Eliminates duplication across multiple pages
 */
export default function CTASection({
  title,
  description,
  primaryCTA = { text: 'Get Started Today', href: '/contact' },
  secondaryCTA,
  variant = 'default',
}: CTASectionProps) {
  const bgClass =
    variant === 'gradient'
      ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white'
      : 'bg-white'

  const textClass = variant === 'gradient' ? 'text-white' : 'text-gray-900'
  const descClass = variant === 'gradient' ? 'text-blue-100' : 'text-gray-600'

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${textClass}`}>{title}</h2>
          <p className={`text-xl mb-8 ${descClass}`}>{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={primaryCTA.href}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {primaryCTA.text}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            {secondaryCTA && (
              <Link
                href={secondaryCTA.href}
                className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-lg border-2 transition-all ${
                  variant === 'gradient'
                    ? 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'
                }`}
              >
                {secondaryCTA.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
