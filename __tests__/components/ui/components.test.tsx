import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import Input from '@/components/ui/Input'
import Section from '@/components/ui/Section'
import Select from '@/components/ui/Select'
import Skeleton from '@/components/ui/Skeleton'
import Textarea from '@/components/ui/Textarea'

describe('UI components', () => {
  it('renders a button with variants', () => {
    render(<Button variant="secondary">Secondary CTA</Button>)

    expect(screen.getByRole('button', { name: /secondary cta/i })).toBeInTheDocument()
  })

  it('renders input with label and error state', () => {
    render(<Input label="Name" name="name" error="Required" />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })

  it('renders select with options', async () => {
    const user = userEvent.setup()
    render(
      <Select
        label="Plan"
        name="plan"
        options={[
          { value: '', label: 'Select one' },
          { value: 'starter', label: 'Starter' },
        ]}
      />
    )

    const select = screen.getByLabelText(/plan/i)
    await user.selectOptions(select, 'starter')

    expect(screen.getByRole('option', { name: /starter/i })).toBeInTheDocument()
  })

  it('renders textarea with helper text', () => {
    render(<Textarea label="Message" name="message" />)

    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('renders accordion and toggles content', async () => {
    const user = userEvent.setup()
    render(
      <Accordion
        items={[
          { question: 'What is included?', answer: 'Everything you need.' },
        ]}
      />
    )

    const button = screen.getByRole('button', { name: /what is included/i })
    await user.click(button)

    expect(screen.getByText(/everything you need/i)).toBeInTheDocument()
  })

  it('renders card, section, container, and skeleton', () => {
    const { container } = render(
      <Section>
        <Container>
          <Card variant="default">Card content</Card>
          <Skeleton className="h-4" />
        </Container>
      </Section>
    )

    expect(screen.getByText(/card content/i)).toBeInTheDocument()
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
