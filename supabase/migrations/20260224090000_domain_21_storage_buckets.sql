-- Domain 21.2: Supabase Storage configuration for tenant assets/documents

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenant-assets',
  'tenant-assets',
  TRUE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/x-icon']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'tenant-documents',
  'tenant-documents',
  FALSE,
  20971520
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit;

DROP POLICY IF EXISTS "Tenant asset upload" ON storage.objects;
CREATE POLICY "Tenant asset upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tenant-assets'
  AND (storage.foldername(name))[1] = ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::text)
);

DROP POLICY IF EXISTS "Tenant asset delete" ON storage.objects;
CREATE POLICY "Tenant asset delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tenant-assets'
  AND (storage.foldername(name))[1] = ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::text)
);
