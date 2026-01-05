import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'

interface BlogPostContentProps {
  content: string
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose prose-lg max-w-none mt-12">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: 'github-dark',
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  )
}
