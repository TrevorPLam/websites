# React 19 — Official Documentation Reference

> **Version Reference:** React 19.0 (December 2024) → React 19.2 (October 1, 2025) | Last Updated: 2026-02-23
> **Purpose:** AI agent reference for React 19 features, Actions, new hooks, Server Components,
> compiler integration, and the full upgrade from React 18.

---

## Table of Contents

1. [React 19 Overview](#react-19-overview)
2. [Actions](#actions)
3. [New Hooks](#new-hooks)
4. [Server Components](#server-components)
5. [use() API](#use-api)
6. [Ref as Prop](#ref-as-prop)
7. [Document Metadata](#document-metadata)
8. [Asset Loading](#asset-loading)
9. [React 19.1 (June 2025)](#react-191-june-2025)
10. [React 19.2 (October 2025)](#react-192-october-2025)
11. [Activity Component](#activity-component)
12. [useEffectEvent](#useeffectevent)
13. [View Transitions](#view-transitions)
14. [Performance Tracks](#performance-tracks)
15. [Partial Pre-rendering APIs](#partial-pre-rendering-apis)
16. [ESLint Plugin Changes](#eslint-plugin-changes)
17. [Upgrading from React 18](#upgrading-from-react-18)
18. [Best Practices](#best-practices)

---

## React 19 Overview

React 19 (released December 5, 2024) is the biggest React release since React 18, completing
the shift toward server-first, concurrent rendering with automatic optimization. The three pillars:

1. **Actions** — async mutations with automatic pending state, error handling, and optimistic updates
2. **React Compiler** — build-time automatic memoization (stable in v1.0, October 2025)
3. **Server Components** — stable, production-ready rendering on the server with full React support

React 19.2 (October 1, 2025) added `<Activity>`, `useEffectEvent`, View Transitions, Partial
Pre-rendering APIs, and updated the ESLint plugin to include compiler-powered rules.

---

## Actions

Actions are async functions passed to transitions that handle mutations, async requests, and state
updates. They replace the need for manual `isPending`, `isError`, `isSuccess` state management.

### What Makes a Function an "Action"

Any function passed to `startTransition` is an Action. Actions:

- Run in a transition (non-blocking)
- Automatically manage pending state
- Support async operations including `fetch()`
- Integrate with form elements natively

### startTransition with Async Actions

```typescript
import { startTransition, useState } from 'react';

function ProfileForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    startTransition(async () => {
      const error = await updateProfile({ name });
      if (error) {
        setError(error.message);
      }
    });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Save</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Form Actions

Forms can use async functions directly as the `action` prop:

```typescript
async function createPost(formData: FormData) {
  'use server';  // Server Action
  const title = formData.get('title') as string;
  await db.posts.create({ title });
  revalidatePath('/posts');
}

export function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

---

## New Hooks

### useActionState

Manages state for Actions — handles pending state, error state, and return values automatically:

```typescript
import { useActionState } from 'react';

async function updateName(previousState: string | null, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return 'Name is required';
  await db.users.updateName(name);
  return null;  // No error
}

export function NameForm() {
  const [error, submitAction, isPending] = useActionState(updateName, null);

  return (
    <form action={submitAction}>
      <input name="name" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### useFormStatus

Reads the status of the **parent** `<form>` element. Useful for building reusable submit buttons
that are aware of form state without prop drilling:

```typescript
import { useFormStatus } from 'react-dom';

function SubmitButton({ label = 'Submit' }: { label?: string }) {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? 'Submitting...' : label}
    </button>
  );
}

// Usage — SubmitButton automatically detects parent form state
export function ContactForm() {
  return (
    <form action={submitContact}>
      <input name="email" type="email" />
      <SubmitButton label="Send Message" />
    </form>
  );
}
```

> **Rule:** `useFormStatus` must be called in a component that is a **child** of the `<form>`,
> not in the same component as the form.

### useOptimistic

Applies optimistic UI updates immediately while an async action completes in the background:

```typescript
import { useOptimistic, useActionState } from 'react';

type Message = { id: string; text: string; sending?: boolean };

export function MessageThread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: Message[], newMessage: Message) => [...state, newMessage]
  );

  async function send(formData: FormData) {
    const text = formData.get('text') as string;
    const tempId = crypto.randomUUID();

    // Immediately show the message as "sending"
    addOptimisticMessage({ id: tempId, text, sending: true });

    // Send to server (real ID will be different)
    await sendMessage(text);
  }

  return (
    <>
      {optimisticMessages.map((msg) => (
        <div key={msg.id} style={{ opacity: msg.sending ? 0.5 : 1 }}>
          {msg.text}
          {msg.sending && ' (Sending...)'}
        </div>
      ))}
      <form action={send}>
        <input name="text" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

### useTransition

Enhanced in React 19 to support async functions directly:

```typescript
import { useTransition } from 'react';

export function SearchBar() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);

  function search(query: string) {
    startTransition(async () => {
      // Async operations inside transitions are now supported
      const data = await fetchSearchResults(query);
      setResults(data);
    });
  }

  return (
    <div>
      <input onChange={(e) => search(e.target.value)} placeholder="Search..." />
      {isPending && <Spinner />}
      <SearchResults results={results} />
    </div>
  );
}
```

---

## Server Components

React Server Components (RSC) are stable in React 19. They render **on the server only** and have
zero impact on client bundle size.

```typescript
// ServerComponent.tsx — runs only on server, no "use client" directive
import { db } from '@/lib/db';

export async function UserDashboard({ userId }: { userId: string }) {
  // Direct database access — no API layer needed
  const user = await db.users.find(userId);
  const posts = await db.posts.findByUser(userId);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <PostList posts={posts} />
    </div>
  );
}
```

### Server Actions

```typescript
// actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Validate
  if (!title || !content) throw new Error('Title and content required');

  // Mutate
  const post = await db.posts.create({ title, content });

  // Revalidate & redirect
  revalidatePath('/posts');
  redirect(`/posts/${post.id}`);
}
```

### Directives

| Directive       | File/Function           | Meaning                                    |
| --------------- | ----------------------- | ------------------------------------------ |
| `'use client'`  | Top of file             | Everything below runs on client            |
| `'use server'`  | Top of file or function | Server Action — callable from client       |
| `'use cache'`   | Top of file or function | Cache this component/function (Next.js 16) |
| `'use memo'`    | Top of function         | Opt into React Compiler (annotation mode)  |
| `'use no memo'` | Top of function         | Opt out of React Compiler                  |

---

## use() API

`use()` is a new React API that reads a resource (Promise or Context) during render, triggering
Suspense when the value isn't ready:

```typescript
import { use, Suspense } from 'react';

// Consuming a Promise
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);  // Suspends until resolved
  return <div>{user.name}</div>;
}

export function ProfilePage({ userId }: { userId: string }) {
  const userPromise = fetchUser(userId);  // Start fetch in parent (no await)

  return (
    <Suspense fallback={<Skeleton />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

```typescript
// Consuming Context conditionally (not possible with useContext)
import { use } from 'react';
import { ThemeContext } from './theme';

function ConditionalTheme({ showTheme }: { showTheme: boolean }) {
  if (!showTheme) return null;

  // use() can be called after conditionals — useContext cannot
  const theme = use(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

---

## Ref as Prop

`ref` can now be passed as a regular prop to function components — `forwardRef` is no longer
needed:

```typescript
// ✅ React 19 — ref is just a prop
function Input({ ref, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
}) {
  return <input ref={ref} {...props} />;
}

// Usage
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} placeholder="Type here" />;

// ✅ No forwardRef needed
```

> `forwardRef` still works but is now redundant for function components. The `forwardRef` wrapper
> will be deprecated in a future React version.

---

## Document Metadata

React 19 natively hoists `<title>`, `<meta>`, and `<link>` tags from any component to `<head>`:

```typescript
// Works in Server Components, Client Components, and nested components
export function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      {/* These are automatically hoisted to <head> */}
      <title>{post.title} | My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.coverImage} />
      <link rel="canonical" href={`https://myblog.com/posts/${post.slug}`} />

      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

---

## Asset Loading

React 19 preloads assets eagerly and in parallel to improve page load performance:

```typescript
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom';

function App() {
  // DNS prefetch
  prefetchDNS('https://cdn.example.com');

  // Pre-establish connection
  preconnect('https://fonts.gstatic.com');

  // Preload a resource (font, image, script)
  preload('https://fonts.gstatic.com/s/inter/v13/Inter.woff2', {
    as: 'font',
    crossOrigin: 'anonymous',
  });

  // Preinit a stylesheet or script (load + execute)
  preinit('https://cdn.example.com/styles.css', { as: 'style' });

  return <main>...</main>;
}
```

---

## React 19.1 (June 2025)

Key additions in React 19.1:

- **Owner Stacks** — Improved error reporting with component owner information in stack traces
- Improved hot reload stability
- Performance improvements for concurrent features

---

## React 19.2 (October 2025)

### Summary of New Features

| Feature                       | Category | Description                                          |
| ----------------------------- | -------- | ---------------------------------------------------- |
| `<Activity>`                  | Core     | Control visibility and priority of UI subtrees       |
| `useEffectEvent`              | Core     | Extract non-reactive logic from Effects              |
| `cacheSignal`                 | RSC      | Abort signals for `cache()` function cleanup         |
| View Transitions              | DOM      | Animate route/state transitions declaratively        |
| Performance Tracks            | DevTools | Chrome DevTools React scheduler + component tracks   |
| Partial Pre-rendering         | DOM      | `prerender`/`resume`/`resumeAndPrerender` APIs       |
| Web Streams for Node          | DOM      | `renderToReadableStream` available on Node.js        |
| `eslint-plugin-react-hooks@6` | Tooling  | Flat config default; compiler rules in `recommended` |
| `useId` prefix change         | Core     | Updated to `_r_` for View Transition compatibility   |

---

## Activity Component

`<Activity>` lets you control the visibility and rendering priority of UI subtrees:

```typescript
import { Activity } from 'react';

// Modes: 'visible' | 'hidden'
function TabLayout({ activeTab }: { activeTab: 'feed' | 'profile' | 'notifications' }) {
  return (
    <>
      <Activity mode={activeTab === 'feed' ? 'visible' : 'hidden'}>
        <FeedTab />        {/* Hidden: effects unmounted, updates deferred */}
      </Activity>

      <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>
        <ProfileTab />     {/* Visible: normal rendering */}
      </Activity>

      <Activity mode={activeTab === 'notifications' ? 'visible' : 'hidden'}>
        <NotificationsTab />
      </Activity>
    </>
  );
}
```

**`hidden` mode behavior:**

- Hides children (`display: none`)
- Unmounts effects
- Defers all updates until React is idle
- Background data loading continues (CSS, images, data)
- **State is preserved** — navigating back restores previous state

**`visible` mode behavior:**

- Shows children normally
- Mounts effects
- Processes updates with normal priority

---

## useEffectEvent

Separates "event" logic from Effect synchronization logic, eliminating lint suppression hacks:

```typescript
import { useEffect, useEffectEvent } from 'react';

function AnalyticsTracker({ page, userId }: { page: string; userId: string }) {
  // Effect Event: always reads latest userId, but never re-triggers the Effect
  const onPageView = useEffectEvent(() => {
    analytics.track('page_view', { page, userId }); // Latest userId always
  });

  useEffect(() => {
    // Only runs when 'page' changes — not when 'userId' changes
    onPageView();
  }, [page]); // ✅ No need to include userId as dependency
}
```

**Rules for useEffectEvent:**

- Cannot be passed to other components or hooks
- Can only be called from within an Effect
- Must not appear in the dependency array
- `eslint-plugin-react-hooks@latest` enforces these rules

---

## View Transitions

Declarative animation of UI changes using the browser's View Transition API:

```typescript
import { ViewTransition, startTransition, addTransitionType } from 'react';
import { useRouter } from 'next/navigation';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        startTransition(() => {
          addTransitionType('nav-forward');  // Distinguishes forward vs back navigation
          router.push(href);
        });
      }}
    >
      <ViewTransition name={href}>
        {children}
      </ViewTransition>
    </a>
  );
}
```

```css
/* CSS: customize the animation based on transition type */
::view-transition-old(.nav-forward) {
  animation: slide-out-left 300ms ease;
}
::view-transition-new(.nav-forward) {
  animation: slide-in-right 300ms ease;
}
```

---

## Performance Tracks

React 19.2 adds custom tracks to **Chrome DevTools Performance** panel:

### Scheduler Track (⚛)

Shows:

- Work by priority: `blocking` (user interactions), `transition` (startTransition), `idle`
- Event that scheduled an update
- When render happened
- When an update was blocked waiting for a different priority
- React waiting for paint before continuing

### Components Track (⚛)

Shows:

- Component tree being rendered
- `Mount` labels when children mount or effects fire
- `Blocked` labels when rendering yields to other work
- Time taken per component to identify bottlenecks

### Usage

1. Open Chrome DevTools → Performance panel
2. Click **Record**
3. Interact with your React app
4. Click **Stop**
5. Look for the **⚛ Scheduler** and **⚛ Components** custom tracks

---

## Partial Pre-rendering APIs

React 19.2 exposes low-level `prerender`/`resume` APIs for fine-grained PPR control:

```typescript
import { prerender } from 'react-dom/static';
import { resume } from 'react-dom/server';

// Phase 1: Pre-render static shell (CDN-cacheable)
const controller = new AbortController();
const { prelude, postponed } = await prerender(<App />, {
  signal: controller.signal,
});

// Save postponed state for later
await savePostponedState(postponed);
// Send prelude to CDN / cache

// Phase 2: Resume with dynamic content at request time
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);
// Stream to client
```

```typescript
// For SSG: resumeAndPrerender gives complete static HTML
import { resumeAndPrerender } from 'react-dom/static';

const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);
// Save complete HTML to CDN
```

### Node.js Web Streams Support (New in 19.2)

```typescript
// renderToReadableStream now available for Node.js
import { renderToReadableStream } from 'react-dom/server';

const stream = await renderToReadableStream(<App />);
// Use with Node.js HTTP response
res.setHeader('Content-Type', 'text/html');
stream.pipe(res);
```

> Still prefer `renderToPipeableStream` for Node.js — it's faster and supports compression by default.

---

## ESLint Plugin Changes

### eslint-plugin-react-hooks v6 (Shipped with React 19.2)

```bash
npm install --save-dev eslint-plugin-react-hooks@latest
```

```javascript
// eslint.config.js — Flat Config (new default in v6)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,
  // Includes compiler-powered rules automatically
]);
```

```json
// .eslintrc.json — Legacy Config (still supported)
{
  "extends": ["plugin:react-hooks/recommended"]
}
```

```json
// .eslintrc.json — Legacy Config (explicit)
{
  "extends": ["plugin:react-hooks/recommended-legacy"]
}
```

### New Compiler-Powered Lint Rules (in `recommended`)

| Rule                                             | What it catches                                |
| ------------------------------------------------ | ---------------------------------------------- |
| `react-hooks/react-compiler/set-state-in-render` | `setState` called during render (causes loops) |
| `react-hooks/react-compiler/set-state-in-effect` | Expensive synchronous work inside effects      |
| `react-hooks/react-compiler/refs`                | Unsafe ref access during render                |
| `react-hooks/exhaustive-deps`                    | Missing or extra Effect dependencies           |

### Removing eslint-plugin-react-compiler

If you previously installed the standalone `eslint-plugin-react-compiler`, remove it — the rules
are now included in `eslint-plugin-react-hooks@latest`:

```bash
npm uninstall eslint-plugin-react-compiler
npm install --save-dev eslint-plugin-react-hooks@latest
```

---

## Upgrading from React 18

```bash
# Upgrade React
npm install react@latest react-dom@latest

# Upgrade types
npm install --save-dev @types/react@latest @types/react-dom@latest
```

### Breaking Changes from React 18 → 19

| Change                                                 | Migration                                          |
| ------------------------------------------------------ | -------------------------------------------------- |
| `ReactDOM.render()` removed                            | Use `ReactDOM.createRoot()`                        |
| `ReactDOM.hydrate()` removed                           | Use `ReactDOM.hydrateRoot()`                       |
| Legacy Context API removed                             | Use `React.createContext()`                        |
| `act()` no longer exported from `react-dom/test-utils` | Import from `react` directly                       |
| `ref` as a prop (forwardRef)                           | Still works; forwardRef deprecated but not removed |
| `useDeferredValue` initial value                       | Now required as second parameter                   |
| Strict Mode double-invoking                            | Now also double-invokes ref callbacks              |

---

## Best Practices

### Actions & Mutations

1. **Use `useActionState` for all form mutations** — automatic pending/error state management
2. **Use `useOptimistic` for immediate feedback** — show changes before server confirms
3. **Use `useFormStatus` for reusable buttons** — decouples submit UI from form logic
4. **Always handle errors in Server Actions** — return error values or throw to Error Boundary

### Components

5. **Prefer Server Components by default** — add `'use client'` only when interactivity is needed
6. **Use `<Activity>` for tab/panel patterns** — preserves state without remounting
7. **Use `use()` over `useEffect` + `useState`** — simpler data fetching with Suspense
8. **Native `ref` prop over `forwardRef`** — `forwardRef` is now legacy
9. **Native `<title>`/`<meta>` over `next/head`** — React 19 hoists automatically

### Effects

10. **Use `useEffectEvent` to silence lint warnings correctly** — never suppress `exhaustive-deps`
11. **Never suppress `exhaustive-deps` manually** — it indicates a missing `useEffectEvent`
12. **View Transitions for navigation** — use `addTransitionType` for directional animations

### Performance

13. **Install React Compiler** — `babel-plugin-react-compiler@latest` for auto-memoization
14. **Remove manual `useMemo`/`useCallback` after enabling compiler** — test first, remove gradually
15. **Use Performance Tracks in Chrome** — Profile Scheduler + Components tracks to identify bottlenecks
