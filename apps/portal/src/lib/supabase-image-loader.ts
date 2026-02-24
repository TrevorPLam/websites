interface SupabaseLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

const DEFAULT_QUALITY = 80;

function getSupabaseProjectId(): string {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;

  if (!projectId) {
    throw new Error('NEXT_PUBLIC_SUPABASE_PROJECT_ID is required for Supabase image loader');
  }

  return projectId;
}

export default function supabaseImageLoader({
  src,
  width,
  quality = DEFAULT_QUALITY,
}: SupabaseLoaderParams): string {
  const projectId = getSupabaseProjectId();

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return `https://${projectId}.supabase.co/storage/v1/render/image/public/${src}?width=${width}&quality=${quality}&format=origin`;
  }

  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;

  return [
    `https://${projectId}.supabase.co`,
    `/storage/v1/render/image/public/${normalizedSrc}`,
    `?width=${width}`,
    `&quality=${quality}`,
    '&format=webp',
    '&resize=contain',
  ].join('');
}
