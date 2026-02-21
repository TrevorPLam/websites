/**
 * @file packages/marketing-components/src/audio/AudioPlayer.tsx
 * @role component
 * @summary Simple audio player
 */

import { cn } from '@repo/utils';

export interface AudioPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

export function AudioPlayer({ src, title, className }: AudioPlayerProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-muted/30 p-4', className)}>
      <audio src={src} controls preload="metadata" title={title} className="h-10 w-full">
        Your browser does not support the audio element.
      </audio>
      {title && <p className="mt-2 text-sm font-medium">{title}</p>}
    </div>
  );
}
