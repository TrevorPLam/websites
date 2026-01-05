import { describe, expect, it } from 'vitest'
import { getAllCategories, getAllPosts, getPostBySlug } from '@/lib/blog'

describe('blog utilities', () => {
  it('returns posts with expected shape', () => {
    const posts = getAllPosts()

    expect(posts.length).toBeGreaterThan(0)
    expect(posts[0]).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        date: expect.any(String),
        readingTime: expect.any(String),
      })
    )
  })

  it('finds a post by slug', () => {
    const posts = getAllPosts()
    const post = getPostBySlug(posts[0].slug)

    expect(post).toBeDefined()
    expect(post?.slug).toBe(posts[0].slug)
  })

  it('returns sorted categories', () => {
    const categories = getAllCategories()

    expect(categories.length).toBeGreaterThan(0)
    expect(categories).toEqual([...categories].sort())
  })
})
