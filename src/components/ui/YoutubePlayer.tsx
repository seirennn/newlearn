import React from 'react';
import { getYoutubeEmbedUrl } from '@/utils/youtubeUtils';

interface YoutubePlayerProps {
  url: string;
  className?: string;
}

export function YoutubePlayer({ url, className = '' }: YoutubePlayerProps) {
  const embedUrl = getYoutubeEmbedUrl(url);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className={`relative w-full pt-[56.25%] ${className}`}>
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full rounded-lg"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
