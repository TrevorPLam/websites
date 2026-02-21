// Blog components - placeholder implementations
import React from 'react';
import { cn } from '@repo/utils';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  category?: string;
}

interface BlogGridProps {
  posts: BlogPost[];
  columns?: 2 | 3 | 4;
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts, columns = 3 }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        columns === 2 && 'md:grid-cols-2',
        columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'md:grid-cols-2 lg:grid-cols-4',
        'gap-6'
      )}
    >
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
          )}
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">{post.date}</div>
            <h3 className="font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <a href={`/blog/${post.id}`} className="text-blue-600 hover:underline">
              Read more
            </a>
          </div>
        </article>
      ))}
    </div>
  );
};

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'px-4 py-2 rounded',
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          )}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

interface RelatedPostsProps {
  posts: BlogPost[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-6">Related Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center space-x-4">
            {post.image && (
              <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded" />
            )}
            <div>
              <h4 className="font-semibold">{post.title}</h4>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
