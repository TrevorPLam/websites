# AI Agent Instructions - Your Dedicated Marketer

## Repository Overview
This is a Next.js marketing website built with the App Router. It showcases marketing services and includes blog functionality.

## Architecture
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS (via globals.css)
- **State Management**: React Server Components + Client Components
- **Features**: Blog, Contact forms, Service pages, Search functionality

## Key Conventions
- Use Server Components by default
- Client Components only when needed (interactivity, hooks)
- Features are organized in `features/` directory
- Shared UI components in `components/ui/`
- Server actions in `lib/actions/`

## Common Tasks
- **Adding a page**: Create in `app/[route]/page.tsx`
- **Adding a feature**: Create in `features/[feature-name]/` with index.ts export
- **Adding UI component**: Add to `components/ui/` if reusable, otherwise in feature folder
