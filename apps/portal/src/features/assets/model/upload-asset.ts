'use server';

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { createServerAction } from '@repo/auth/server-action-wrapper';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_URL_EXPIRES_SECONDS = 60;

const UploadAssetSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/x-icon',
  ]),
  fileSize: z.number().positive().max(MAX_IMAGE_SIZE_BYTES),
  assetType: z.enum(['logo', 'favicon', 'service-image', 'hero-image', 'gallery']),
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
);

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getAssetPath(tenantId: string, assetType: string, fileName: string): string {
  const timestamp = Date.now();
  return `${tenantId}/${assetType}/${timestamp}-${sanitizeFileName(fileName)}`;
}

export const getUploadUrl = createServerAction(UploadAssetSchema, async (input, ctx) => {
  const path = getAssetPath(ctx.tenantId, input.assetType, input.fileName);

  const { data, error } = await supabaseAdmin.storage
    .from('tenant-assets')
    .createSignedUploadUrl(path, {
      upsert: false,
    });

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'Failed to create signed upload URL');
  }

  return {
    path,
    token: data.token,
    signedUrl: data.signedUrl,
    expiresIn: UPLOAD_URL_EXPIRES_SECONDS,
    publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tenant-assets/${path}`,
  };
});
