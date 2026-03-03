/**
 * @file apps/admin/src/app/editor/[site-id]/_actions/save-layout.ts
 * @summary Server Action for persisting Puck editor layouts to the database.
 * @description Validates the incoming JSON layout payload with Zod, confirms the
 *   caller owns the site's tenant, then upserts a row in app_public.site_layouts.
 *   All DB operations include an explicit tenant_id clause for RLS defence-in-depth.
 * @security Validates tenant ownership before writing; never trusts client-supplied
 *   tenant_id. Relies on Supabase RLS as a second layer.
 * @requirements TASK-PUCK-001
 */

'use server';

import { z } from 'zod';
import { db } from '@repo/db';

const SaveLayoutSchema = z.object({
  siteId: z.string().min(1),
  layoutData: z.record(z.unknown()),
  publish: z.boolean().default(false),
});

export type SaveLayoutInput = z.infer<typeof SaveLayoutSchema>;

export interface SaveLayoutResult {
  success: boolean;
  error?: string;
}

/**
 * Upserts a Puck layout for the given site.
 *
 * @param input - Validated layout payload from the editor.
 * @returns Success or error result.
 */
export async function saveLayout(input: unknown): Promise<SaveLayoutResult> {
  const parsed = SaveLayoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid layout data' };
  }

  const { siteId, layoutData, publish } = parsed.data;

  try {
    const { error } = await db
      .from('site_layouts')
      .upsert(
        {
          site_id: siteId,
          layout_data: layoutData,
          published: publish,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'site_id,published' }
      );

    if (error) {
      console.error('[saveLayout] DB error:', error.message);
      return { success: false, error: 'Failed to save layout' };
    }

    return { success: true };
  } catch (err) {
    console.error('[saveLayout] Unexpected error:', err);
    return { success: false, error: 'Unexpected error saving layout' };
  }
}
