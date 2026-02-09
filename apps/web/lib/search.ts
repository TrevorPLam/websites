/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Search Index for Site Search
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Provide static search index for site-wide search functionality
 * - Enable fast local search without external service dependencies
 * - Centralize searchable content metadata (title, description, URL)
 *
 * Responsibilities:
 * - Owns: Static list of searchable pages and services
 * - Owns: Search item metadata (title, description, URL)
 * - Does NOT own: Search UI logic (handled by features/search/)
 * - Does NOT own: Search implementation (handled by features/search/lib/search.ts)
 *
 * Key Flows:
 * - Search component calls getSearchIndex() → receives array → filters by query
 * - User types query → client filters index → displays matching results
 *
 * Inputs/Outputs:
 * - Input: None (static data)
 * - Output: Array of SearchItem objects
 * - Side effects: None (pure function)
 *
 * Dependencies:
 * - External: None
 * - Internal: Used by features/search/lib/search.ts
 *
 * State & Invariants:
 * - Invariant: URLs must be valid relative paths (start with /)
 * - Invariant: All URLs must exist as actual pages
 * - Assumption: Search index is small enough for in-memory filtering (<100 items)
 *
 * Error Handling:
 * - No errors possible (static data)
 * - Invalid URLs handled by Next.js routing (404 page)
 *
 * Performance Notes:
 * - O(1) to get index, O(n) to filter
 * - Index size: ~8 items currently, very fast
 * - Called on every search keystroke (consider memoization for larger indexes)
 *
 * Security Notes:
 * - No security implications (public pages only)
 * - URLs are internal relative paths (no external sites)
 *
 * Testing Notes:
 * - Test: Verify all URLs exist as actual pages
 * - Test: Verify descriptions are accurate
 * - Mock: Not needed (static data)
 *
 * Change Risks:
 * - Adding page without updating index makes it unsearchable
 * - Wrong URLs send users to 404 pages
 * - Large index (>1000 items) may need different approach (Algolia, etc.)
 *
 * Owner Boundaries:
 * - Search implementation: features/search/lib/search.ts
 * - Search UI: features/search/components/
 * - Actual pages: app/**/page.tsx files
 *
 * AI Navigation Tags:
 * #search #index #navigation #seo #discoverability
 *
 * TODO: Consider auto-generating index from route metadata in future
 * TODO: Add keywords field for better matching (e.g., "cut" matches "haircuts")
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface SearchItem {
  title: string
  description: string
  url: string
}

export function getSearchIndex(): SearchItem[] {
  return [
    {
      title: 'Haircuts & Styling',
      description: 'Precision cuts and styling for women, men, and children',
      url: '/services/haircuts',
    },
    {
      title: 'Coloring Services',
      description: 'Full color, highlights, balayage, and color correction',
      url: '/services/coloring',
    },
    {
      title: 'Hair Treatments',
      description: 'Deep conditioning, keratin, and scalp treatments',
      url: '/services/treatments',
    },
    {
      title: 'Special Occasions',
      description: 'Bridal hair, updos, and styling for special events',
      url: '/services/special-occasions',
    },
    {
      title: 'Pricing',
      description: 'View our service menu and pricing',
      url: '/pricing',
    },
    {
      title: 'Contact Us',
      description: 'Book an appointment or get in touch',
      url: '/contact',
    },
    {
      title: 'About Us',
      description: 'Learn more about our salon and team',
      url: '/about',
    },
    {
      title: 'Blog',
      description: 'Read our latest hair care tips and trends',
      url: '/blog',
    },
  ]
}
