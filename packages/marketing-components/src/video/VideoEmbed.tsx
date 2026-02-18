/**
 * @file packages/marketing-components/src/video/VideoEmbed.tsx
 * @role component
 * @summary Video embed wrapper (YouTube, Vimeo, native)
 */

import { cn } from '@repo/utils';

export type VideoSource = 'youtube' | 'vimeo' | 'native';

export interface VideoEmbedProps {
  /** Video URL or embed ID */
  src: string;
  /** Source type */
  source?: VideoSource;
  /** 16:9 aspect ratio by default */
  aspectRatio?: '16/9' | '4/3' | '1/1';
  /** Accessible title */
  title?: string;
  /** Poster image for native video */
  poster?: string;
  className?: string;
}

function getEmbedUrl(src: string, source: VideoSource): string {
  if (source === 'youtube') {
    const id = src.includes('v=') ? new URL(src).searchParams.get('v') : src;
    return `https://www.youtube.com/embed/${id}`;
  }
  if (source === 'vimeo') {
    const id = src.split('/').pop();
    return `https://player.vimeo.com/video/${id}`;
  }
  return src;
}

export function VideoEmbed({
  src,
  source = 'youtube',
  aspectRatio = '16/9',
  title = 'Video',
  poster,
  className,
}: VideoEmbedProps) {
  if (source === 'native') {
    return (
      <div className={cn('overflow-hidden rounded-lg', className)}>
        <video
          src={src}
          poster={poster}
          title={title}
          controls
          playsInline
          className="h-full w-full"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(src, source);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg bg-black',
        aspectRatio === '16/9' && 'aspect-video',
        aspectRatio === '4/3' && 'aspect-[4/3]',
        aspectRatio === '1/1' && 'aspect-square',
        className
      )}
    >
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
