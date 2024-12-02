'use client';

import { useState, useEffect, useRef } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Loader2 } from 'lucide-react';

interface YouTubeViewerProps {
  className?: string;
}

export function YouTubeViewer({ className }: YouTubeViewerProps) {
  const { setContent, youtubeUrl, setYoutubeUrl } = useContent();
  const [url, setUrl] = useState(youtubeUrl || '');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (youtubeUrl && youtubeUrl !== url) {
      setUrl(youtubeUrl);
      setIsValid(!!validateAndExtractVideoId(youtubeUrl));
    }
  }, [youtubeUrl]);

  const validateAndExtractVideoId = (input: string) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
      /^[a-zA-Z0-9_-]{11}$/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValid(!!validateAndExtractVideoId(newUrl));
  };

  const fetchTranscript = async (videoId: string) => {
    try {
      const response = await fetch('/api/youtube/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      const data = await response.json();
      return data.transcript;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      throw error;
    }
  };

  const handleLoadVideo = async (videoId: string) => {
    setIsLoading(true);
    try {
      // Get video title and transcript
      const [titleResponse, transcript] = await Promise.all([
        fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`),
        fetchTranscript(videoId)
      ]);

      if (!titleResponse.ok) {
        throw new Error('Failed to fetch video title');
      }

      const titleData = await titleResponse.json();
      const title = titleData.title || 'YouTube Video';
      
      if (!transcript) {
        throw new Error('Failed to fetch transcript');
      }

      // Format content with title, URL, and transcript
      const content = [
        `# ${title}`,
        `\nVideo URL: https://www.youtube.com/watch?v=${videoId}`,
        `\n\n## Transcript:\n\n${transcript}`
      ].join('');

      // Update both the content and YouTube URL
      setContent(content);
      setYoutubeUrl(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load video information. Please check if the video exists and has captions available.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = validateAndExtractVideoId(url);
    if (!videoId) {
      alert('Please enter a valid YouTube URL or video ID');
      return;
    }
    await handleLoadVideo(videoId);
  };

  const videoId = validateAndExtractVideoId(url);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <form onSubmit={handleSubmit} className="p-4 border-b border-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter YouTube URL or video ID"
            className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-700"
          />
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Load'
            )}
          </button>
        </div>
      </form>

      <div className="flex-1 flex items-center justify-center bg-neutral-900">
        {videoId ? (
          <div className="relative w-full h-full max-w-4xl mx-auto">
            <iframe
              ref={playerRef}
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <div className="text-neutral-400">
            Enter a YouTube URL to get started
          </div>
        )}
      </div>
    </div>
  );
}
