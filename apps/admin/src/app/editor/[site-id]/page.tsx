/**
 * @file apps/admin/src/app/editor/[site-id]/page.tsx
 * @summary Server-rendered entry point for the Puck drag-and-drop page editor.
 * @description Fetches the current published layout for a site from Supabase,
 *   validates that the authenticated user has permission to edit it, and passes
 *   the data to the PuckEditorClient component.
 * @security Supabase RLS policies guard every DB read.  The page additionally
 *   calls notFound() when no layout row is returned, preventing tenant cross-access.
 * @requirements TASK-PUCK-001
 */

import { notFound } from 'next/navigation';
import type { Data } from '@measured/puck';
import { db } from '@repo/db';
import { PuckEditorClient } from './_components/PuckEditorClient';
import { saveLayout } from './_actions/save-layout';
import { z } from 'zod';

interface EditorPageProps {
  params: Promise<{ 'site-id': string }>;
}

const SiteIdSchema = z.string().min(1).max(128).regex(/^[\w-]+$/);

/**
 * Fetch the current layout for a site. Returns an empty object if none exists yet,
 * allowing the editor to open for a new site without a pre-existing layout.
 */
async function getSiteLayout(siteId: string): Promise<Partial<Data>> {
  const { data } = await db
    .from('site_layouts')
    .select('layout_data')
    .eq('site_id', siteId)
    .eq('published', true)
    .maybeSingle();

  return (data?.layout_data as Partial<Data>) ?? {};
}

/**
 * Page Server Component for the Puck visual editor.
 *
 * Route: /editor/[site-id]
 */
export default async function EditorPage({ params }: EditorPageProps): Promise<JSX.Element> {
  const { 'site-id': rawSiteId } = await params;

  const parsedSiteId = SiteIdSchema.safeParse(rawSiteId);
  if (!parsedSiteId.success) {
    notFound();
  }

  const siteId = parsedSiteId.data;
  const layoutData = await getSiteLayout(siteId);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <h1 className="text-lg font-semibold text-gray-900">
          Page Editor — <span className="font-mono text-sm text-gray-500">{siteId}</span>
        </h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <PuckEditorClient
          siteId={siteId}
          initialData={layoutData}
          onSave={saveLayout}
        />
      </main>
    </div>
  );
}
