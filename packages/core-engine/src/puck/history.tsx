/**
 * @file packages/core-engine/src/puck/history.tsx
 * @summary Puck layout version history panel component.
 * @description Renders a scrollable list of previously published layout
 *   versions for a site. Each row shows the version label, publish date,
 *   and a "Restore" button that triggers a server-side rollback.
 *
 *   Data fetching is intentionally left to the consuming page via props so
 *   that this component stays framework-agnostic (no direct Supabase calls).
 *
 *   The panel is a **Client Component** because it uses `useState` for the
 *   optimistic restore confirmation UX.
 *
 * @security Only renders if `tenantId` is provided; the parent page is
 *   responsible for verifying that the authenticated user belongs to the
 *   tenant before passing `tenantId` down.
 * @requirements TASK-UI-003
 */

'use client';

import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

/** A single layout version entry returned from the database. */
export interface LayoutVersion {
  id: string;
  siteId: string;
  tenantId: string;
  /** Human-readable version label (e.g. "Version 3 – Added hero"). */
  versionLabel: string;
  /** ISO-8601 timestamp of when this version was published. */
  createdAt: string;
  /** Optional display name of the editor who published the version. */
  publishedByName?: string;
}

export interface LayoutHistoryPanelProps {
  /** Ordered list of layout versions (most recent first). */
  versions: LayoutVersion[];
  /** The active tenant. Used to validate restore actions. */
  tenantId: string;
  /**
   * Called when the user confirms a restore. The consumer is responsible for
   * performing the actual database update (Server Action, API route, etc.).
   */
  onRestore: (versionId: string, tenantId: string) => Promise<void>;
  /** Optional class name applied to the panel root element. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Renders the layout version history panel for the Puck editor.
 *
 * @example
 * ```tsx
 * // In the admin editor page:
 * <LayoutHistoryPanel
 *   versions={versions}
 *   tenantId={tenantId}
 *   onRestore={async (versionId, tenantId) => {
 *     await restoreLayoutVersion(versionId, tenantId); // Server Action
 *   }}
 * />
 * ```
 */
export function LayoutHistoryPanel({
  versions,
  tenantId,
  onRestore,
  className = '',
}: LayoutHistoryPanelProps): React.ReactElement {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRestore(versionId: string): Promise<void> {
    if (confirmId !== versionId) {
      // First click: show confirmation prompt.
      setConfirmId(versionId);
      return;
    }

    // Second click (confirmed): perform restore.
    setConfirmId(null);
    setRestoringId(versionId);
    setError(null);

    try {
      await onRestore(versionId, tenantId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Restore failed. Please try again.',
      );
    } finally {
      setRestoringId(null);
    }
  }

  if (versions.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 text-gray-400 text-sm ${className}`}
        aria-label="No version history"
      >
        <p>No published versions yet.</p>
        <p className="mt-1 text-xs">Publish a layout to start building history.</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
      aria-label="Layout version history"
    >
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Version History</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          {versions.length} version{versions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700"
        >
          {error}
        </div>
      )}

      <ul role="list" className="divide-y divide-gray-100 overflow-y-auto">
        {versions.map((version, index) => {
          const isRestoring = restoringId === version.id;
          const isConfirming = confirmId === version.id;
          const isLatest = index === 0;

          return (
            <li
              key={version.id}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {version.versionLabel || `Version ${versions.length - index}`}
                  </span>
                  {isLatest && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {formatDate(version.createdAt)}
                  {version.publishedByName && ` · ${version.publishedByName}`}
                </p>
              </div>

              {!isLatest && (
                <button
                  type="button"
                  disabled={isRestoring || restoringId !== null}
                  onClick={() => void handleRestore(version.id)}
                  className={[
                    'shrink-0 rounded px-3 py-1.5 text-xs font-medium transition-colors',
                    isConfirming
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                    isRestoring || restoringId !== null
                      ? 'cursor-not-allowed opacity-50'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={
                    isConfirming
                      ? `Confirm restore to "${version.versionLabel}"`
                      : `Restore layout to "${version.versionLabel}"`
                  }
                >
                  {isRestoring
                    ? 'Restoring…'
                    : isConfirming
                      ? 'Confirm restore?'
                      : 'Restore'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
