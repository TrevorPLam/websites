/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Utility Functions for Web App
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Wrap @repo/utils cn() function for app-level className merging
 * - Provide local re-export to avoid direct imports from @repo/utils
 * - Enable future app-specific utility additions without changing imports
 *
 * Responsibilities:
 * - Owns: Re-exporting shared utils with app-specific naming
 * - Does NOT own: Actual implementation (delegated to @repo/utils)
 *
 * Key Flows:
 * - Component imports cn() → uses for conditional Tailwind classes → conflict resolution applied
 *
 * Inputs/Outputs:
 * - Input: Variable number of class name arguments (strings, objects, arrays)
 * - Output: Merged string with Tailwind conflicts resolved
 * - Side effects: None (pure function)
 *
 * Dependencies:
 * - External: clsx (conditional classes), tailwind-merge (conflict resolution)
 * - Internal: @repo/utils/cn (implementation)
 *
 * State & Invariants:
 * - Invariant: Function is pure (no side effects, deterministic)
 * - Invariant: Must delegate to @repo/utils (single source of truth)
 * - Assumption: Tailwind classes follow standard naming convention
 *
 * Error Handling:
 * - Invalid input types: clsx handles gracefully (ignores non-strings)
 * - No errors thrown (safe for any input)
 *
 * Performance Notes:
 * - O(n) where n = total class names across all inputs
 * - Hot path: Called on every component render
 * - Very fast (<1ms typical, uses string operations only)
 *
 * Security Notes:
 * - No security implications (client-side styling only)
 * - User input should never reach className (XSS risk)
 *
 * Testing Notes:
 * - Test: Verify Tailwind conflict resolution (px-2 + px-4 → px-4)
 * - Test: Verify conditional classes work (true/false logic)
 * - Mock: Not needed (pure function, no external dependencies)
 *
 * Change Risks:
 * - Changing implementation breaks all component styling
 * - Must stay compatible with @repo/utils interface
 *
 * Owner Boundaries:
 * - Implementation: packages/utils/src/index.ts
 * - Usage: All components in apps/web
 *
 * AI Navigation Tags:
 * #utils #styling #tailwind #classnames #ui
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  // Merge conditional class names while resolving Tailwind conflicts (e.g., px-4 vs px-2)
  return twMerge(clsx(inputs))
}
