'use client';

import imageCompression, { type Options } from 'browser-image-compression';

const MAX_UPLOAD_SIZE_MB = 5;

const defaultCompressionOptions: Options = {
  maxSizeMB: 0.8,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.8,
  alwaysKeepResolution: false,
};

export async function compressImageForUpload(
  file: File,
  options?: Partial<Options>
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are supported');
  }

  if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024 * 4) {
    throw new Error('File is too large to process safely in the browser');
  }

  const compressed = await imageCompression(file, {
    ...defaultCompressionOptions,
    ...options,
  });

  return new File([compressed], file.name, {
    type: compressed.type,
    lastModified: Date.now(),
  });
}
