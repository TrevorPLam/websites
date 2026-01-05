import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'
import BlogPage from '@/app/blog/page'
import ContactPage from '@/app/contact/page'
import PricingPage from '@/app/pricing/page'
import ServicesPage from '@/app/services/page'
import SearchRoute from '@/app/search/page'

describe('page components', () => {
  it('renders the about page hero content', () => {
    render(<AboutPage />)

    expect(
      screen.getByRole('heading', { name: /your partner in digital marketing success/i })
    ).toBeInTheDocument()
  })

  it('renders the services page hero CTA', () => {
    render(<ServicesPage />)

    expect(
      screen.getByRole('heading', { name: /marketing services that drive growth/i })
    ).toBeInTheDocument()
  })

  it('renders the pricing page tier overview', () => {
    render(<PricingPage />)

    expect(screen.getByRole('heading', { name: /marketing plans built for growth/i })).toBeInTheDocument()
  })

  it('renders the blog page listing', () => {
    render(<BlogPage />)

    expect(
      screen.getByRole('heading', { name: /marketing insights & strategies/i })
    ).toBeInTheDocument()
  })

  it('renders the contact page form section', () => {
    render(<ContactPage />)

    expect(screen.getByRole('heading', { name: /send us a message/i })).toBeInTheDocument()
  })

  it('renders the search page with input', () => {
    render(<SearchRoute searchParams={{ q: 'seo' }} />)

    expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument()
  })
})
