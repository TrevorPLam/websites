<!--
/**
 * @file docs/features/team.md
 * @role docs
 * @summary Developer guide for the team feature: components, props, site.config integration.
 *
 * @invariants
 * - Team components are display-only; they accept TeamMember[] as props.
 * - features.team in site.config.ts controls which variant renders.
 * - `social` field is deprecated; use `socialLinks` instead.
 *
 * @verification
 * - Verified props against packages/marketing-components/src/team/types.ts
 * - Components confirmed: TeamGrid, TeamCarousel, TeamDetailed
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Team Feature

**Package:** `@repo/marketing-components/team`
**Config key:** `features.team`
**Last Updated:** 2026-02-19

---

## Overview

The team feature renders staff/practitioner profiles. Components are display-only and accept member data as props. All three variants (`grid`, `carousel`, `detailed`) use the same `TeamMember` type, making it easy to switch layouts without changing your data structure.

---

## Enabling Team

In `site.config.ts`:

```typescript
features: {
  team: 'grid' | 'carousel' | 'detailed' | null,
}
```

Set to `null` to hide the team section entirely.

---

## `TeamMember` Type

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar?: string; // URL to avatar image
  photo?: {
    src: string;
    alt: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
}
```

> **Note:** The `social` field is deprecated. Use `socialLinks` for new code.

---

## Components

### `TeamGrid`

Standard card-based grid. Best for 3–12 members.

```typescript
import { TeamGrid } from '@repo/marketing-components';

<TeamGrid
  title="Our Team"
  members={teamMembers}
  columns={3}   // 2 | 3 | 4
/>
```

### `TeamCarousel`

Horizontally scrollable carousel. Best for 5+ members or narrow layouts.

```typescript
import { TeamCarousel } from '@repo/marketing-components';

<TeamCarousel
  title="Meet the Team"
  members={teamMembers}
/>
```

### `TeamDetailed`

Full-page listing with extended bio and social links. Best for law firms and medical practices where credentials and background matter most.

```typescript
import { TeamDetailed } from '@repo/marketing-components';

<TeamDetailed
  title="Our Attorneys"
  members={teamMembers}
/>
```

---

## Usage Example

```typescript
// lib/team-data.ts
import type { TeamMember } from '@repo/marketing-components';

export const teamMembers: TeamMember[] = [
  {
    id: 'jane-doe',
    name: 'Jane Doe',
    role: 'Senior Stylist',
    bio: 'Jane has 10 years of experience in color and cutting techniques.',
    photo: { src: '/images/team/jane.jpg', alt: 'Jane Doe' },
    socialLinks: { instagram: 'https://instagram.com/janedoe' },
  },
  {
    id: 'john-smith',
    name: 'John Smith',
    role: 'Color Specialist',
    photo: { src: '/images/team/john.jpg', alt: 'John Smith' },
  },
];
```

```typescript
// app/about/page.tsx
import { TeamGrid } from '@repo/marketing-components';
import { teamMembers } from '@/lib/team-data';

export default function AboutPage() {
  return (
    <main>
      <TeamGrid title="Our Team" members={teamMembers} columns={3} />
    </main>
  );
}
```

---

## Filtering by Department

For businesses with multiple departments, filter the members array before passing to the component:

```typescript
const stylists = teamMembers.filter((m) => m.department === 'styling');
<TeamGrid title="Stylists" members={stylists} />
```

---

## Industry Recommendations

| Industry   | Recommended Variant                |
| ---------- | ---------------------------------- |
| Salon      | `grid`                             |
| Restaurant | `grid` or `carousel`               |
| Law firm   | `detailed` (shows credentials/bio) |
| Dental     | `detailed`                         |
| Medical    | `detailed`                         |
| Fitness    | `carousel`                         |

---

## See Also

- [`packages/marketing-components/src/team/`](../../packages/marketing-components/src/team/) — Source code and types
- [`docs/configuration/site-config-reference.md`](../configuration/site-config-reference.md) — Feature flags reference
