import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders hero and CTA content', async () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: /your dedicated marketer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /book a free strategy call/i })).toBeInTheDocument()
    expect(screen.getByText(/clear strategy, honest execution/i)).toBeInTheDocument()
  })
})
