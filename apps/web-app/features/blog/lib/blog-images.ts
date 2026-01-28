import fs from 'fs'
import path from 'path'

const BLOG_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg'] as const
const DEFAULT_BLOG_IMAGE = 'og-image.jpg'

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/$/, '')

const hasPublicAsset = (relativePath: string) => {
  const absolutePath = path.join(process.cwd(), 'public', relativePath)
  return fs.existsSync(absolutePath)
}

export const getBlogPostImageUrl = (baseUrl: string, slug: string): string | null => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  // WHY: Prefer per-post assets when available, but fall back to a shared OG image.
  for (const extension of BLOG_IMAGE_EXTENSIONS) {
    const candidate = `blog/${slug}.${extension}`
    if (hasPublicAsset(candidate)) {
      return `${normalizedBaseUrl}/${candidate}`
    }
  }

  if (hasPublicAsset(DEFAULT_BLOG_IMAGE)) {
    return `${normalizedBaseUrl}/${DEFAULT_BLOG_IMAGE}`
  }

  return null
}
