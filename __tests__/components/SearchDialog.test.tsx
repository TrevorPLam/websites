import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchDialog from '@/components/SearchDialog'
import type { SearchItem } from '@/lib/search'

const baseItems: SearchItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    description: 'Homepage overview',
    href: '/',
    type: 'Page',
    tags: ['marketing', 'overview'],
  },
]

describe('SearchDialog', () => {
  it('opens and focuses the input on the keyboard shortcut', async () => {
    render(<SearchDialog items={baseItems} />)

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    const input = await screen.findByRole('textbox', { name: /search/i })
    expect(input).toHaveFocus()
  })

  it('handles non-array tag values without crashing', async () => {
    const user = userEvent.setup()
    const itemsWithInvalidTags: SearchItem[] = [
      {
        ...baseItems[0],
        tags: 'seo' as unknown as string[],
      },
    ]

    render(<SearchDialog items={itemsWithInvalidTags} />)

    await user.click(screen.getByRole('button', { name: /open search/i }))

    const input = screen.getByRole('textbox', { name: /search/i })
    await user.type(input, 'home')

    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
