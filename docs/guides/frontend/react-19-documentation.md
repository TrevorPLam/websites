<!--
/**
 * @file react-19-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for react 19 documentation.
 * @entrypoints docs/guides/react-19-documentation.md
 * @exports react 19 documentation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

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

---

## Security Considerations

### 1. Server Actions Security

#### Input Validation and Sanitization

```typescript
// Secure Server Action with comprehensive validation
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CreateLeadSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/)
    .optional(),
  message: z.string().min(10).max(1000).trim(),
  tenantId: z.string().uuid(),
  source: z.enum(['contact', 'booking', 'inquiry']).default('contact'),
});

type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

export async function createLeadAction(formData: FormData) {
  'use server';

  // Validate and sanitize input
  const rawInput = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
    tenantId: formData.get('tenantId'),
    source: formData.get('source'),
  };

  const validatedInput = CreateLeadSchema.parse(rawInput);

  // Additional security: Rate limiting per tenant
  await checkRateLimit(validatedInput.tenantId, 'create-lead');

  // Sanitize HTML content to prevent XSS
  const sanitizedMessage = sanitizeHtml(validatedInput.message, {
    allowedTags: ['b', 'i', 'em', 'strong'],
    allowedAttributes: {},
  });

  try {
    // Create lead with validated and sanitized data
    const lead = await db.createLead({
      ...validatedInput,
      message: sanitizedMessage,
      ip: headers().get('x-forwarded-for') || 'unknown',
      userAgent: headers().get('user-agent') || 'unknown',
    });

    // Revalidate relevant cache
    revalidatePath(`/dashboard/leads`);
    revalidateTag(`tenant:${validatedInput.tenantId}:leads`);

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('Failed to create lead:', error);
    throw new Error('Unable to create lead. Please try again.');
  }
}

async function checkRateLimit(tenantId: string, action: string): Promise<void> {
  const key = `ratelimit:${tenantId}:${action}`;
  const limit = await redis.incr(key);

  if (limit === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }

  if (limit > 50) {
    // 50 leads per hour per tenant
    throw new Error('Rate limit exceeded. Please try again later.');
  }
}
```

#### CSRF Protection for Server Actions

```typescript
// lib/server-action-security.ts
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export class ServerActionSecurity {
  private static readonly CSRF_COOKIE_NAME = 'sa-csrf-token';
  private static readonly TOKEN_LENGTH = 32;

  // Generate CSRF token for Server Actions
  static generateCSRFToken(): string {
    return randomBytes(this.TOKEN_LENGTH).toString('base64');
  }

  // Set CSRF token in HTTP-only cookie
  static setCSRFToken(token: string): void {
    cookies().set(this.CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
  }

  // Validate CSRF token for Server Actions
  static validateCSRFToken(providedToken: string): boolean {
    const cookieToken = cookies().get(this.CSRF_COOKIE_NAME)?.value;

    if (!cookieToken || !providedToken) {
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken, 'base64'),
      Buffer.from(providedToken, 'base64')
    );
  }

  // Wrapper function for secure Server Actions
  static secureAction<T extends any[], R>(action: (...args: T) => Promise<R>) {
    return async (...args: T): Promise<R> => {
      const formData = args[0] as FormData;
      const csrfToken = formData.get('csrfToken') as string;

      if (!this.validateCSRFToken(csrfToken)) {
        throw new Error('Invalid CSRF token');
      }

      return await action(...args);
    };
  }
}

// Usage
export const secureCreateLead = ServerActionSecurity.secureAction(createLeadAction);
```

### 2. Client-Side Security

#### Secure Component Patterns

```typescript
// Secure data handling in client components
'use client';

import { use } from 'react';
import { z } from 'zod';

const LeadSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted']),
  createdAt: z.string().datetime(),
});

type Lead = z.infer<typeof LeadSchema>;

export function LeadCard({ leadPromise }: { leadPromise: Promise<Lead> }) {
  const lead = use(leadPromise);

  // Validate data on client side for additional security
  const validatedLead = LeadSchema.parse(lead);

  return (
    <div className="lead-card">
      <h3>{validatedLead.name}</h3>
      <p>{validatedLead.email}</p>
      <span className={`status status-${validatedLead.status}`}>
        {validatedLead.status}
      </span>
    </div>
  );
}
```

#### Secure State Management

```typescript
// Secure state patterns with Zod validation
import { createStore } from 'zustand';
import { z } from 'zod';

const LeadStateSchema = z.object({
  leads: z.array(LeadSchema),
  loading: z.boolean(),
  error: z.string().optional(),
  filters: z.object({
    status: z.enum(['all', 'new', 'contacted', 'qualified', 'converted']),
    dateRange: z.object({
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    }),
  }),
});

type LeadState = z.infer<typeof LeadStateSchema>;

export const useLeadStore = createStore<LeadState>((set, get) => ({
  leads: [],
  loading: false,
  error: undefined,
  filters: {
    status: 'all',
    dateRange: {},
  },

  setLeads: (leads) => {
    // Validate leads before setting state
    const validatedLeads = z.array(LeadSchema).parse(leads);
    set({ leads: validatedLeads, loading: false, error: undefined });
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  setFilters: (filters) => {
    const validatedFilters = LeadStateSchema.shape.filters.parse(filters);
    set({ filters: validatedFilters });
  },

  // Secure update method with validation
  updateLead: (id, updates) => {
    const { leads } = get();
    const leadIndex = leads.findIndex((lead) => lead.id === id);

    if (leadIndex === -1) return;

    const updatedLead = LeadSchema.partial().parse({ ...leads[leadIndex], ...updates });
    const newLeads = [...leads];
    newLeads[leadIndex] = updatedLead;

    set({ leads: newLeads });
  },
}));
```

---

## Advanced Implementation Patterns

### 1. Concurrent Rendering Patterns

#### Advanced Suspense Boundaries

```typescript
// Advanced Suspense boundary with error boundaries and loading states
'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface AdvancedSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  loadingComponent?: React.ComponentType<{ delay: number }>;
  maxLoadingTime?: number;
}

export function AdvancedSuspense({
  children,
  fallback = <div>Loading...</div>,
  errorFallback: ErrorFallback,
  loadingComponent: LoadingComponent,
  maxLoadingTime = 5000,
}: AdvancedSuspenseProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback || DefaultErrorFallback}>
      <Suspense
        fallback={
          loadingComponent ? (
            <LoadingComponentWithTimeout
              Component={loadingComponent}
              maxTime={maxLoadingTime}
              defaultFallback={fallback}
            />
          ) : (
            fallback
          )
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function LoadingComponentWithTimeout({
  Component,
  maxTime,
  defaultFallback,
}: {
  Component: React.ComponentType<{ delay: number }>;
  maxTime: number;
  defaultFallback: React.ReactNode;
}) {
  const [showDefault, setShowDefault] = useState(false);
  const [delay] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowDefault(true), maxTime);
    return () => clearTimeout(timer);
  }, [maxTime]);

  if (showDefault) return defaultFallback;
  return <Component delay={delay} />;
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

#### Concurrent Data Fetching with use()

```typescript
// Advanced data fetching pattern with concurrent requests
import { use } from 'react';

interface DashboardData {
  leads: Lead[];
  analytics: Analytics;
  notifications: Notification[];
  userSettings: UserSettings;
}

async function fetchDashboardData(tenantId: string): Promise<DashboardData> {
  // Fetch all data concurrently
  const [leads, analytics, notifications, userSettings] = await Promise.all([
    fetchLeads(tenantId),
    fetchAnalytics(tenantId),
    fetchNotifications(tenantId),
    fetchUserSettings(tenantId),
  ]);

  return {
    leads,
    analytics,
    notifications,
    userSettings,
  };
}

export function Dashboard({ tenantId }: { tenantId: string }) {
  const dataPromise = fetchDashboardData(tenantId);

  return (
    <div className="dashboard">
      <Suspense fallback={<LeadsSkeleton />}>
        <LeadsSection leadsPromise={dataPromise.then(d => d.leads)} />
      </Suspense>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsSection analyticsPromise={dataPromise.then(d => d.analytics)} />
      </Suspense>

      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsSection notificationsPromise={dataPromise.then(d => d.notifications)} />
      </Suspense>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsSection settingsPromise={dataPromise.then(d => d.userSettings)} />
      </Suspense>
    </div>
  );
}

function LeadsSection({ leadsPromise }: { leadsPromise: Promise<Lead[]> }) {
  const leads = use(leadsPromise);
  return <LeadsGrid leads={leads} />;
}
```

### 2. Advanced Server Component Patterns

#### Streaming Server Components

```typescript
// Streaming large datasets with progressive loading
import { unstable_cache } from 'next/cache';

const getLargeDataset = unstable_cache(
  async (tenantId: string, offset: number = 0, limit: number = 100) => {
    // Simulate large dataset fetch
    const data = await fetchLargeDatasetFromDB(tenantId, offset, limit);
    return data;
  },
  ['large-dataset'],
  {
    revalidate: 3600, // 1 hour
    tags: ['dataset']
  }
);

export async function StreamingDataTable({ tenantId }: { tenantId: string }) {
  const initialData = await getLargeDataset(tenantId, 0, 50);

  return (
    <div className="data-table">
      <TableHeader />

      {/* Render initial data immediately */}
      <TableRows data={initialData} />

      {/* Stream additional data */}
      <Suspense fallback={<TableRowsSkeleton count={50} />}>
        <MoreDataStreamer tenantId={tenantId} offset={50} />
      </Suspense>
    </div>
  );
}

async function MoreDataStreamer({ tenantId, offset }: { tenantId: string; offset: number }) {
  const moreData = await getLargeDataset(tenantId, offset, 100);

  return (
    <>
      <TableRows data={moreData} />
      {moreData.length === 100 && (
        <Suspense fallback={<TableRowsSkeleton count={100} />}>
          <MoreDataStreamer tenantId={tenantId} offset={offset + 100} />
        </Suspense>
      )}
    </>
  );
}
```

#### Dynamic Server Components with Caching

```typescript
// Dynamic Server Components with intelligent caching
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

async function getCachedComponentData(tenantId: string, componentType: string) {
  'use cache';

  cacheTag(`tenant:${tenantId}`);
  cacheTag(`component:${componentType}`);
  cacheLife('5m');

  return fetchComponentData(tenantId, componentType);
}

export async function DynamicComponent({
  tenantId,
  componentType
}: {
  tenantId: string;
  componentType: string;
}) {
  const data = await getCachedComponentData(tenantId, componentType);

  switch (componentType) {
    case 'lead-form':
      return <LeadFormComponent data={data} />;
    case 'analytics':
      return <AnalyticsComponent data={data} />;
    case 'notifications':
      return <NotificationsComponent data={data} />;
    default:
      return <div>Unknown component type</div>;
  }
}
```

### 3. Performance Optimization Patterns

#### Advanced React Compiler Integration

```typescript
// Advanced React Compiler configuration with custom optimizations
// next.config.ts
const nextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'full',
      options: {
        // Custom compiler options for optimal performance
        optimize: true,
        sourceMap: process.env.NODE_ENV === 'development',

        // Custom optimization rules
        rules: {
          // Optimize frequently re-rendering components
          'react-compiler/optimize-frequent-renders': 'error',

          // Warn about potential optimization opportunities
          'react-compiler/suggest-optimization': 'warn',
        },

        // Plugin configuration
        plugins: [
          // Custom optimization plugins
          {
            name: 'optimize-large-objects',
            options: {
              threshold: 1024, // 1KB
            },
          },
        ],
      },
    },
  },
};

// Component with compiler hints
export function OptimizedLeadCard({ lead }: { lead: Lead }) {
  // React Compiler will automatically optimize this component
  // based on usage patterns and dependency analysis

  return (
    <div className="lead-card">
      <h3>{lead.name}</h3>
      <p>{lead.email}</p>
      <span className={`status-${lead.status}`}>
        {lead.status}
      </span>
    </div>
  );
}
```

#### Memory Management and Cleanup

```typescript
// Advanced memory management patterns
'use client';

import { useEffect, useRef, useCallback } from 'react';

export function MemoryEfficientComponent({ data }: { data: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const visibleItemsRef = useRef(new Set<number>());

  // Cleanup function for memory management
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = undefined;
    }
    visibleItemsRef.current.clear();
  }, []);

  useEffect(() => {
    // Set up intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');

          if (entry.isIntersecting) {
            visibleItemsRef.current.add(index);
          } else {
            visibleItemsRef.current.delete(index);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // Observe all items
    const items = containerRef.current?.querySelectorAll('[data-index]');
    items?.forEach((item) => observerRef.current?.observe(item));

    // Cleanup on unmount
    return cleanup;
  }, [cleanup]);

  // Render only visible items for memory efficiency
  return (
    <div ref={containerRef} className="memory-efficient-list">
      {data.map((item, index) => (
        <div
          key={item.id}
          data-index={index}
          className={`list-item ${
            visibleItemsRef.current.has(index) ? 'visible' : 'hidden'
          }`}
        >
          {visibleItemsRef.current.has(index) ? (
            <ExpensiveListItem data={item} />
          ) : (
            <div className="placeholder" style={{ height: '100px' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function ExpensiveListItem({ data }: { data: any }) {
  // This component is expensive to render
  // Only render when visible
  return (
    <div className="expensive-item">
      {/* Complex rendering logic */}
      <ComplexVisualization data={data} />
    </div>
  );
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official React Documentation

- [React 19 Documentation](https://react.dev/)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [React 19.1 Update](https://react.dev/blog/2025/06/04/react-19.1)
- [React 19.2 Update](https://react.dev/blog/2025/10/01/react-19.2)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)

### Security Resources

- [React Security Best Practices](https://react.dev/learn/security-in-react)
- [Server Actions Security](https://nextjs.org/docs/app/api-reference/server-actions)
- [OWASP React Security Guide](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/)
- [Content Security Policy with React](https://web.dev/csp/)

### Performance Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools Performance Tracks](https://developer.chrome.com/docs/devtools/performance/)
- [Web Performance with React](https://web.dev/performance/)

### Advanced Patterns

- [Concurrent React Patterns](https://react.dev/learn/concurrent-react)
- [Server Components Best Practices](https://react.dev/reference/rsc/server-components)
- [React Suspense Patterns](https://react.dev/reference/react/Suspense)
- [React Compiler Advanced Usage](https://react.dev/learn/react-compiler#advanced-usage)


## Overview

[Add content here]


## Implementation

[Add content here]


## Testing

[Add content here]
