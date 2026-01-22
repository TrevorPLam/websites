import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'

const buildPostFixture = (frontmatter: string, body = 'Post body') =>
  `---\n${frontmatter}\n---\n${body}`
const buildPost = buildPostFixture

const writeBlogFixture = (files: Record<string, string>) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-test-'))
  const blogDir = path.join(tempDir, 'content', 'blog')

  fs.mkdirSync(blogDir, { recursive: true })

  for (const [fileName, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(blogDir, fileName), contents)
  }

  return tempDir
}

const loadBlog = async (cwd: string) => {
  vi.resetModules()
  vi.spyOn(process, 'cwd').mockReturnValue(cwd)
  return await import('@/lib/blog')
}

let tempDir: string | null = null

describe('blog utilities', () => {
  afterEach(() => {
    vi.restoreAllMocks()

    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true })
      tempDir = null
    }
  })

  it('returns posts with expected shape and sorted order', async () => {
    tempDir = writeBlogFixture({
      'older.mdx': buildPost(
        'title: "Older"\ndescription: "Older desc"\ndate: "2024-01-02"',
        'Older body'
      ),
      'newer.mdx': buildPost(
        'title: "Newer"\ndescription: "Newer desc"\ndate: "2024-03-10"',
        'Newer body'
      ),
    })

    const { getAllPosts } = await loadBlog(tempDir)
    const posts = getAllPosts()

    expect(posts).toHaveLength(2)
    expect(posts[0]).toEqual(
      expect.objectContaining({
        slug: 'newer',
        title: 'Newer',
        description: 'Newer desc',
        date: '2024-03-10',
        readingTime: expect.any(String),
      })
    )
  })

  it('skips posts with missing required frontmatter', async () => {
    tempDir = writeBlogFixture({
      'valid.mdx': buildPost(
        'title: "Valid"\ndescription: "Valid desc"\ndate: "2024-02-14"',
        'Valid body'
      ),
      'invalid.mdx': buildPost('title: "Invalid"\ndescription: "Missing date"'),
    })

    const { getAllPosts, getPostBySlug } = await loadBlog(tempDir)
    const posts = getAllPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0]?.slug).toBe('valid')
    expect(getPostBySlug('invalid')).toBeUndefined()
  })

  it('skips posts with invalid dates', async () => {
    tempDir = writeBlogFixture({
      'valid.mdx': buildPost(
        'title: "Valid"\ndescription: "Valid desc"\ndate: "2024-04-01"',
        'Valid body'
      ),
      'invalid.mdx': buildPost(
        'title: "Invalid"\ndescription: "Invalid date"\ndate: "2024-02-30"',
        'Invalid body'
      ),
    })

    const { getAllPosts } = await loadBlog(tempDir)
    const posts = getAllPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0]?.slug).toBe('valid')
  })

  it('returns sorted categories', async () => {
    tempDir = writeBlogFixture({
      'alpha.mdx': buildPost(
        'title: "Alpha"\ndescription: "Alpha desc"\ndate: "2024-01-01"\ncategory: "Beta"'
      ),
      'beta.mdx': buildPost(
        'title: "Beta"\ndescription: "Beta desc"\ndate: "2024-01-02"\ncategory: "Alpha"'
      ),
    })

    const { getAllCategories } = await loadBlog(tempDir)
    const categories = getAllCategories()

    expect(categories).toEqual(['Alpha', 'Beta'])
  })
})
