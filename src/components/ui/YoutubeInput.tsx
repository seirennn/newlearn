import React, { useState } from 'react';
import { isValidYoutubeUrl } from '@/utils/youtubeUtils';
import { YoutubePlayer } from './YoutubePlayer';

interface YoutubeInputProps {
  className?: string;
}

export function YoutubeInput({ className = '' }: YoutubeInputProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValid(isValidYoutubeUrl(newUrl));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Paste YouTube URL here"
          className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {url && !isValid && (
          <div className="absolute -bottom-6 left-0 text-sm text-red-500">
            Please enter a valid YouTube URL
          </div>
        )}
      </div>

      {isValid && (
        <div className="rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
          <YoutubePlayer url={url} />
        </div>
      )}
    </div>
  );
}
