// File: packages/features/src/blog/components/BlogPostContent.tsx  [TRACE:FILE=packages.features.blog.components.BlogPostContent]
// Purpose: Blog post content renderer providing MDX compilation with syntax highlighting,
//          GitHub-flavored markdown, and automatic slug generation. Handles blog content
//          rendering with proper typography and code styling.
//
// Exports / Entry: BlogPostContent component (default export)
// Used by: Blog post pages for content rendering
//
// Invariants:
// - Must support GitHub-flavored markdown for consistent formatting
// - Code blocks must be syntax highlighted with GitHub dark theme
// - Headings must automatically generate slugs for anchor links
// - Content must be properly styled with prose classes
// - Component must handle both MDX and markdown content safely
//
// SECURITY NOTE:
//   MDX via next-mdx-remote is safe when content comes from static files (our case).
//   If the content source ever becomes user-editable (CMS, admin panel), this pipeline
//   MUST add `rehype-sanitize` to the rehype plugin chain to prevent stored XSS.
//   See: https://github.com/rehypejs/rehype-sanitize
//
// Status: @public
// Features:
// - [FEAT:BLOG] MDX content rendering and compilation
// - [FEAT:MARKDOWN] GitHub-flavored markdown support
// - [FEAT:SYNTAX_HIGHLIGHTING] Code block styling with themes
// - [FEAT:TYPOGRAPHY] Prose styling for readable content
// - [FEAT:ACCESSIBILITY] Automatic heading slug generation

import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';

/**
 * Blog post content props
 */
// [TRACE:INTERFACE=packages.features.blog.BlogPostContentProps]
// [FEAT:BLOG] [FEAT:MARKDOWN]
// NOTE: Content props interface - defines MDX content input for blog post rendering.
export interface BlogPostContentProps {
  /** Raw MDX/markdown content */
  content: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Blog post content renderer
 * Compiles MDX with plugins for markdown, syntax highlighting, and slug generation
 */
// [TRACE:FUNC=packages.features.blog.BlogPostContent]
// [FEAT:BLOG] [FEAT:MARKDOWN] [FEAT:SYNTAX_HIGHLIGHTING] [FEAT:TYPOGRAPHY]
// NOTE: Content renderer - compiles MDX with plugins for markdown, syntax highlighting, and slug generation.
export default function BlogPostContent({ content, className }: BlogPostContentProps) {
  return (
    <div className={`prose prose-lg max-w-none mt-12 ${className || ''}`}>
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
  );
}
