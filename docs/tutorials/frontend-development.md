---
title: Frontend Development Tutorial
description: Learn modern frontend development with React 19 and Next.js 16
last_updated: 2026-02-26
tags: [#tutorial #frontend #react #nextjs #development]
estimated_read_time: 45 minutes
difficulty: intermediate
---

# Frontend Development Tutorial

## Overview

Master modern frontend development using React 19 Server Components, Next.js 16 App Router, and the Feature-Sliced Design methodology. This tutorial covers everything from basic components to advanced patterns.

## Prerequisites

- [Development Setup](../getting-started/development-setup.md) completed
- Understanding of JavaScript and basic React
- TypeScript fundamentals

## Module 1: React 19 Fundamentals

### Server Components vs Client Components

**Server Components** (Default):
```typescript
// app/page.tsx - Server Component
export default function HomePage() {
  // Runs on server, can access database directly
  const posts = await getPosts()
  
  return (
    <main>
      <h1>Latest Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  )
}
```

**Client Components** (Interactive):
```typescript
// components/PostCard.tsx - Client Component
'use client'

import { useState } from 'react'

export function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes)
  
  return (
    <article>
      <h3>{post.title}</h3>
      <button onClick={() => setLikes(prev => prev + 1)}>
        ❤️ {likes}
      </button>
    </article>
  )
}
```

### React 19 New Features

**Activity Component**:
```typescript
import { Activity } from 'react'

function LoadingSpinner() {
  return (
    <Activity fallback={<Spinner />}>
      <ExpensiveComponent />
    </Activity>
  )
}
```

**useEffectEvent Hook**:
```typescript
'use client'

import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId }) {
  const onMessage = useEffectEvent((message) => {
    console.log(`Room ${roomId}: ${message}`)
  })
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost/chat/${roomId}`)
    ws.onmessage = (event) => onMessage(event.data)
    return () => ws.close()
  }, [roomId])
}
```

## Module 2: Next.js 16 App Router

### Route Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Homepage
├── about/
│   ├── layout.tsx     # About section layout
│   └── page.tsx       # About page
├── blog/
│   ├── layout.tsx
│   ├── page.tsx       # Blog listing
│   └── [slug]/
│       └── page.tsx   # Individual post
└── api/
    └── posts/
        └── route.ts    # API endpoint
```

### Layouts and Pages

**Root Layout**:
```typescript
// app/layout.tsx
export const metadata = {
  title: 'Marketing Websites',
  description: 'Professional marketing websites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

**Dynamic Routes**:
```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

### API Routes

```typescript
// app/api/posts/route.ts
export async function GET() {
  const posts = await getPosts()
  return Response.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const post = await createPost(body)
  return Response.json(post, { status: 201 })
}
```

## Module 3: Feature-Sliced Design (FSD)

### Layer Structure

```
src/
├── app/           # Pages and layouts
├── pages/         # Route pages
├── widgets/       # Composite UI components
├── features/      # Business logic
├── entities/      # Business entities
└── shared/        # Shared utilities
```

### Creating a Feature

**Entity**:
```typescript
// src/shared/entities/post/model.ts
export interface Post {
  id: string
  title: string
  content: string
  publishedAt: Date
}
```

**Feature**:
```typescript
// src/features/post/api.ts
export async function getPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts')
  return response.json()
}

// src/features/post/ui/PostCard.tsx
export function PostCard({ post }: { post: Post }) {
  return (
    <article>
      <h3>{post.title}</h3>
      <time>{post.publishedAt.toLocaleDateString()}</time>
    </article>
  )
}
```

**Widget**:
```typescript
// src/widgets/PostList/PostList.tsx
import { getPosts } from '@/features/post/api'
import { PostCard } from '@/features/post/ui/PostCard'

export async function PostList() {
  const posts = await getPosts()
  
  return (
    <section>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  )
}
```

## Module 4: Styling with Tailwind CSS v4

### CSS-First Configuration

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #1e40af;
  --font-family-sans: "Inter", system-ui;
}

body {
  font-family: theme("fontFamily.sans");
}
```

### Component Styling

```typescript
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  const baseClasses = "font-medium rounded-lg transition-colors"
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  }
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  return (
    <button className={clsx(baseClasses, variantClasses[variant], sizeClasses[size])}>
      {children}
    </button>
  )
}
```

## Module 5: State Management

### Server State with React Query

```typescript
// lib/query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

// hooks/usePosts.ts
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    staleTime: 60 * 1000, // 1 minute
  })
}
```

### Client State with Zustand

```typescript
// store/uiStore.ts
import { create } from 'zustand'

interface UIStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))
```

## Module 6: Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false // Client-side only
})
```

### Image Optimization

```typescript
import Image from 'next/image'

export function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority // Above-the-fold images
      placeholder="blur"
    />
  )
}
```

## Practice Project

Build a complete blog application with:

1. **Homepage** - List of latest posts
2. **Post Detail** - Individual blog post with comments
3. **Category Filter** - Filter posts by category
4. **Search** - Search functionality
5. **Dark Mode** - Theme switching

## Next Steps

- [Advanced Patterns](../guides-new/development/advanced-patterns.md)
- [Testing Tutorial](../tutorials/testing.md)
- [Deployment Guide](../how-to/common-tasks/deployment.md)

## Troubleshooting

**Hydration errors**: Ensure server and client render identical markup
**Performance issues**: Use React DevTools Profiler to identify bottlenecks
**Build errors**: Check TypeScript configuration and imports
