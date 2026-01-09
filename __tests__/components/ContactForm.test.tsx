import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '@/components/ContactForm'
import { submitContactForm } from '@/lib/actions'

// Mock the submitContactForm action while keeping the real schema
vi.mock('@/lib/actions', async () => {
  const actual = await vi.importActual<typeof import('@/lib/actions')>('@/lib/actions')
  return {
    ...actual,
    submitContactForm: vi.fn(),
  }
})

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<ContactForm />)

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /company/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /phone/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const nameInput = screen.getByRole('textbox', { name: /name/i })
    const submitButton = screen.getByRole('button', { name: /send message/i })

    await user.click(nameInput)
    await user.click(submitButton)

    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab() // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.mocked(submitContactForm)
    mockSubmit.mockResolvedValue({
      success: true,
      message: 'Thank you for contacting us!',
    })

    render(<ContactForm />)

    // Fill in required fields
    await user.type(screen.getByLabelText(/name/i), 'John Smith')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '555-123-4567')
    await user.type(
      screen.getByRole('textbox', { name: /message/i }),
      'I would like to learn more about your services'
    )

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Smith',
          email: 'john@example.com',
          phone: '555-123-4567',
          message: 'I would like to learn more about your services',
        })
      )
    })
  })

  it('displays success message on successful submission', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.mocked(submitContactForm)
    mockSubmit.mockResolvedValue({
      success: true,
      message: 'Thank you for contacting us!',
    })

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/name/i), 'John Smith')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '555-123-4567')
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message with enough characters')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument()
    })
  })

  it('displays error message on failed submission', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.mocked(submitContactForm)
    mockSubmit.mockResolvedValue({
      success: false,
      message: 'Rate limit exceeded',
    })

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/name/i), 'John Smith')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '555-123-4567')
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message with enough characters')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument()
    })
  })

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.mocked(submitContactForm)
    mockSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true, message: 'Success' }), 100))
    )

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/name/i), 'John Smith')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '555-123-4567')
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Test message with enough characters')

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/sending/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.mocked(submitContactForm)
    mockSubmit.mockResolvedValue({
      success: true,
      message: 'Success',
    })

    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /message/i }) as HTMLTextAreaElement

    await user.type(nameInput, 'John Smith')
    await user.type(emailInput, 'john@example.com')
    await user.type(phoneInput, '555-123-4567')
    await user.type(messageInput, 'Test message with enough characters')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(phoneInput.value).toBe('')
      expect(messageInput.value).toBe('')
    })
  })
})
