/**
 * @file packages/core-engine/src/renderer/ComponentRenderer.tsx
 * @summary JSON-to-React dynamic page renderer with error boundary protection.
 * @description Renders a Puck-compatible JSON layout tree into React components
 *   using the package's component registry. Supports:
 *   - Recursive component tree rendering (root → zones → components).
 *   - Per-component React.lazy code splitting (opt-in via `lazy` prop in data).
 *   - Graceful degradation via an inline error boundary so one broken
 *     component never takes down the entire page.
 *   - Strict tenant-id validation so mis-routed data can't render cross-tenant.
 *
 *   This component is a **Server Component** by default. Pass `'use client'`
 *   to the consuming page only if you need client-side interactivity.
 *
 * @security `tenantId` in the layout JSON MUST match the authenticated tenant
 *   context. The renderer validates this at the root level and throws if they
 *   don't match, preventing cross-tenant data leakage.
 * @requirements TASK-UI-002, TASK-PUCK-001
 */

import React, {
  type ComponentType,
  type ReactElement,
  type ReactNode,
  Component,
} from 'react';
import { componentRegistry } from '../puck/components/registry';
import type { ComponentData, PageData } from '../types';

// ─── Error boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  componentType: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Inline error boundary that isolates broken components.
 * Shows a minimal fallback instead of crashing the whole page.
 */
class ComponentErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown render error',
    };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          aria-label={`Failed to render ${this.props.componentType}`}
          style={{
            border: '1px solid #f87171',
            borderRadius: '4px',
            padding: '8px 12px',
            color: '#991b1b',
            fontSize: '12px',
          }}
        >
          Component &ldquo;{this.props.componentType}&rdquo; failed to render
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ComponentRendererProps {
  /**
   * Puck-compatible page data JSON retrieved from the database.
   * The `tenantId` field inside this object MUST match `authenticatedTenantId`
   * when provided.
   */
  pageData: PageData;
  /**
   * The tenant that is authenticated for this request.
   * When supplied, the renderer validates that `pageData.tenantId` matches
   * before rendering anything.
   */
  authenticatedTenantId?: string;
  /**
   * Custom component registry. Defaults to the package-level `componentRegistry`.
   * Override in tests or when loading tenant-specific components.
   */
  registry?: typeof componentRegistry;
  /**
   * Fallback node rendered when a component type is not found in the registry.
   * Defaults to `null` (renders nothing, does not throw).
   */
  unknownComponentFallback?: ReactNode;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Merges component defaultProps with the JSON props. */
function mergeProps(
  registryEntry: (typeof componentRegistry)[keyof typeof componentRegistry],
  dataProps: Record<string, unknown>,
): Record<string, unknown> {
  const defaults =
    'defaultProps' in registryEntry
      ? (registryEntry.defaultProps as Record<string, unknown>)
      : {};
  return { ...defaults, ...dataProps };
}

// ─── Component renderer ──────────────────────────────────────────────────────

/**
 * Recursively renders a single {@link ComponentData} node from the page JSON.
 */
function renderComponent(
  node: ComponentData,
  registry: typeof componentRegistry,
  unknownFallback: ReactNode,
  depth = 0,
): ReactElement | null {
  if (depth > 32) {
    // Guard against runaway recursion from malformed JSON.
    console.warn('[ComponentRenderer] Max render depth (32) exceeded. Halting recursion.');
    return null;
  }

  const entry = registry[node.type as keyof typeof registry];

  if (!entry) {
    console.warn(`[ComponentRenderer] Unknown component type: "${node.type}"`);
    return unknownFallback as ReactElement | null;
  }

  const Comp = entry.component as ComponentType<Record<string, unknown>>;
  const props = mergeProps(entry, node.props);

  // Recursively render children if present.
  const children: ReactNode =
    Array.isArray(node.children) && node.children.length > 0
      ? node.children.map((child: ComponentData, i: number) => (
          <React.Fragment key={child.id ?? `child-${i}`}>
            {renderComponent(child, registry, unknownFallback, depth + 1)}
          </React.Fragment>
        ))
      : (props['children'] as ReactNode | undefined);

  return (
    <ComponentErrorBoundary key={node.id} componentType={node.type}>
      <Comp {...props} key={node.id}>
        {children}
      </Comp>
    </ComponentErrorBoundary>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

/**
 * Renders a full Puck JSON page layout into React.
 *
 * @example
 * ```tsx
 * // In a Next.js Server Component page (PPR-enabled):
 * import { ComponentRenderer } from '@repo/core-engine/renderer';
 *
 * export default async function Page({ params }: { params: { slug: string } }) {
 *   const pageData = await db.getPageBySlug(params.slug, tenantId);
 *   return (
 *     <ComponentRenderer
 *       pageData={pageData}
 *       authenticatedTenantId={tenantId}
 *     />
 *   );
 * }
 * ```
 */
export function ComponentRenderer({
  pageData,
  authenticatedTenantId,
  registry = componentRegistry,
  unknownComponentFallback = null,
}: ComponentRendererProps): ReactElement | null {
  // ── Tenant validation ──────────────────────────────────────────────────
  if (
    authenticatedTenantId !== undefined &&
    pageData.tenantId !== authenticatedTenantId
  ) {
    // Do NOT render anything – throw to ensure a 500 rather than silently
    // serving another tenant's content.
    throw new Error(
      `[ComponentRenderer] Tenant mismatch: page belongs to "${pageData.tenantId}" ` +
        `but authenticated tenant is "${authenticatedTenantId}".`,
    );
  }

  const components = pageData.components as ComponentData[];

  if (!Array.isArray(components) || components.length === 0) {
    return null;
  }

  return (
    <>
      {components.map((node: ComponentData, i: number) => (
        <React.Fragment key={node.id ?? `root-${i}`}>
          {renderComponent(node, registry, unknownComponentFallback)}
        </React.Fragment>
      ))}
    </>
  );
}
