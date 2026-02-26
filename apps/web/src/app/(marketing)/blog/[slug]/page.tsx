/**
 * @file apps/web/src/app/(marketing)/blog/[slug]/page.tsx
 * @summary Dynamic blog post page.
 */

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post</h1>
        <p className="text-xl text-gray-600 mb-4">
          Viewing post: {params.slug}
        </p>
        <div className="prose max-w-none">
          <p>Blog post content will go here...</p>
        </div>
      </div>
    </div>
  )
}
