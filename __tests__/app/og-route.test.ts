import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'

import { GET } from '@/app/api/og/route'

describe('/api/og', () => {
  it('returns 400 when title exceeds max length', async () => {
    const longTitle = 'a'.repeat(201)
    const request = new NextRequest(`http://localhost/api/og?title=${longTitle}`)

    const response = await GET(request)

    expect(response.status).toBe(400)
  })
})
