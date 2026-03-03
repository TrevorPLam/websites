/**
 * @file apps/admin/src/app/editor/[site-id]/_components/PuckEditorClient.tsx
 * @summary Client wrapper for the Puck drag-and-drop editor.
 * @description Renders the @measured/puck <Puck> component with the shared
 *   design-token config and handles the onPublish callback via a Server Action.
 *   Must be a Client Component because Puck requires browser APIs.
 * @security Tenant isolation is enforced server-side before this component renders.
 *   The component itself does not perform auth; it only calls the saveLayout action.
 * @requirements TASK-PUCK-001
 */

'use client';

import { useCallback, useState } from 'react';
import { Puck } from '@measured/puck';
import type { Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig, getPuckEditorStyles } from '@repo/core-engine';
import type { SaveLayoutResult } from '../_actions/save-layout';

interface PuckEditorClientProps {
  siteId: string;
  initialData: Partial<Data>;
  onSave: (input: {
    siteId: string;
    layoutData: Record<string, unknown>;
    publish: boolean;
  }) => Promise<SaveLayoutResult>;
}

/**
 * Client component that renders the Puck visual editor.
 *
 * @param props.siteId      - Site identifier used when persisting layout data.
 * @param props.initialData - Current layout JSON fetched server-side.
 * @param props.onSave      - Server Action bound to the parent page.
 */
export function PuckEditorClient({ siteId, initialData, onSave }: PuckEditorClientProps): JSX.Element {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handlePublish = useCallback(
    async (data: Data) => {
      setIsSaving(true);
      setSaveError(null);
      const result = await onSave({
        siteId,
        layoutData: data as unknown as Record<string, unknown>,
        publish: true,
      });
      if (!result.success) {
        setSaveError(result.error ?? 'Failed to save layout');
      }
      setIsSaving(false);
    },
    [siteId, onSave]
  );

  return (
    <div style={getPuckEditorStyles()} className="h-full w-full">
      {saveError && (
        <div
          role="alert"
          className="fixed top-4 right-4 z-50 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 shadow"
        >
          {saveError}
        </div>
      )}
      {isSaving && (
        <div
          aria-live="polite"
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-blue-50 px-4 py-2 text-sm text-blue-700 shadow"
        >
          Saving…
        </div>
      )}
      <Puck
        config={puckConfig}
        data={initialData}
        onPublish={handlePublish}
      />
    </div>
  );
}
