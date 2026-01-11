import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import ValueProps from '@/components/ValueProps'
import ServicesOverview from '@/components/ServicesOverview'
import SocialProof from '@/components/SocialProof'

describe('Marketing sections', () => {
  it('renders hero headline and primary CTAs', () => {
    render(<Hero />)

    expect(
      screen.getByRole('heading', { name: /your dedicated marketer — that means i’m part of your team/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /book a free strategy call/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get a free marketing plan/i })).toBeInTheDocument()
  })

  it('renders the value proposition cards', () => {
    render(<ValueProps />)

    expect(
      screen.getByRole('heading', { level: 3, name: /marketing shouldn’t feel like a guessing game/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /what ‘part of your team’ actually means/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /who this works best for/i })).toBeInTheDocument()
  })

  it('renders the services overview section', () => {
    render(<ServicesOverview />)

    expect(
      screen.getByRole('heading', { name: /marketing leadership i run with your team/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /seo services/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /learn more/i })).toHaveLength(4)
  })

  it('renders testimonials and metrics', () => {
    render(<SocialProof />)

    expect(screen.getByRole('heading', { name: /trusted by founders and teams i work with/i })).toBeInTheDocument()
    expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument()
    expect(screen.getByText(/127%/i)).toBeInTheDocument()
  })
})
