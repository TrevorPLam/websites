import { getAllPosts } from '@/lib/blog'
import { validatedEnv } from '@/lib/env'

const escapeXml = (value: string | null | undefined) =>
  (value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const toRssDate = (value: string) => new Date(value).toUTCString()

export async function GET() {
  const posts = getAllPosts()
  const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const siteName = validatedEnv.NEXT_PUBLIC_SITE_NAME
  const feedUrl = `${siteUrl}/feed.xml`

  const items = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
            <link>${escapeXml(postUrl)}</link>
            <guid>${escapeXml(postUrl)}</guid>
          <pubDate>${toRssDate(post.date)}</pubDate>
          <description>${escapeXml(post.description)}</description>
        </item>
      `.trim()
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml('Insights, guides, and updates from Your Dedicated Marketer.')}</description>
    <language>en-us</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
