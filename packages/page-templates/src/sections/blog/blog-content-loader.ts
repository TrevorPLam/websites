/**
 * Blog content loader for reading markdown files
 */
// import fs from 'fs';
// import path from 'path';
// import matter from 'gray-matter';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  category?: string;
  tags?: string[];
  slug: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // In a real implementation, this would read from the client's content directory
    // For now, we'll return the sample posts but with proper structure

    const posts: BlogPost[] = [
      {
        id: 'getting-started',
        title: 'Getting Started with Our Platform',
        excerpt: 'Learn the basics and get up and running quickly with our comprehensive guide.',
        content:
          '# Getting Started with Our Platform\n\nWelcome to our comprehensive getting started guide!',
        date: '2024-01-15',
        author: 'Expert Team',
        image: '/api/placeholder/400/300',
        category: 'Tutorial',
        tags: ['beginner', 'tutorial', 'getting-started'],
        slug: 'getting-started',
      },
      {
        id: 'advanced-tips',
        title: 'Advanced Tips and Tricks',
        excerpt: 'Discover advanced techniques to maximize your productivity and results.',
        content: '# Advanced Tips and Tricks\n\nReady to take your skills to the next level?',
        date: '2024-01-10',
        author: 'Expert Team',
        image: '/api/placeholder/400/300',
        category: 'Advanced',
        tags: ['advanced', 'tips', 'productivity'],
        slug: 'advanced-tips',
      },
      {
        id: 'best-practices',
        title: 'Best Practices Guide',
        excerpt: 'Follow industry best practices to achieve optimal outcomes.',
        content: '# Best Practices Guide\n\nFollow these best practices for optimal results.',
        date: '2024-01-05',
        author: 'Professional',
        image: '/api/placeholder/400/300',
        category: 'Guide',
        tags: ['best-practices', 'guide'],
        slug: 'best-practices',
      },
    ];

    // Sort posts by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts();
    return posts.find((post) => post.slug === slug) || null;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}
