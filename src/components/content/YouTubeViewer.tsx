'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';

interface YouTubeViewerProps {
  className?: string;
}

// Cache for storing transcripts
const transcriptCache = new Map<string, { transcript: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function YouTubeViewer({ className }: YouTubeViewerProps) {
  const { 
    setContent, 
    setContentType,
    contentType, 
    youtubeUrl, 
    setYoutubeUrl,
    setIsTranscriptLoading 
  } = useContent();
  
  const [url, setUrl] = useState(youtubeUrl || '');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedVideoId, setLastLoadedVideoId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Refetch when switching back to YouTube tab
  useEffect(() => {
    if (contentType === 'youtube' && youtubeUrl) {
      const videoId = validateAndExtractVideoId(youtubeUrl);
      if (videoId) {
        handleLoadVideo(videoId);
      }
    }
  }, [contentType]);

  useEffect(() => {
    if (youtubeUrl && youtubeUrl !== url) {
      setUrl(youtubeUrl);
      const videoId = validateAndExtractVideoId(youtubeUrl);
      if (videoId) {
        setIsValid(true);
        handleLoadVideo(videoId);
      }
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

  // Debounced URL validation
  const debouncedValidation = useCallback(
    debounce((input: string) => {
      const videoId = validateAndExtractVideoId(input);
      setIsValid(!!videoId);
      if (videoId) {
        handleLoadVideo(videoId);
      }
    }, 500),
    []
  );

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError(null);
    debouncedValidation(newUrl);
  };

  const fetchTranscript = async (videoId: string): Promise<string> => {
    // Check cache first
    const cached = transcriptCache.get(videoId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.transcript;
    }

    const fetchWithRetry = async (attempt: number): Promise<string> => {
      try {
        const response = await fetch('/api/youtube/transcript', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch transcript');
        }

        const data = await response.json();
        if (!data.transcript) {
          throw new Error('No transcript available for this video');
        }

        // Cache the successful result
        transcriptCache.set(videoId, {
          transcript: data.transcript,
          timestamp: Date.now(),
        });

        return data.transcript;
      } catch (error: any) {
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchWithRetry(attempt + 1);
        }
        throw error;
      }
    };

    return fetchWithRetry(1);
  };

  const handleLoadVideo = async (videoId: string) => {
    // Allow reloading when switching back to YouTube tab
    if (videoId === lastLoadedVideoId && !error && contentType === 'youtube') {
      return;
    }

    setIsLoading(true);
    setIsLoadingTranscript(true);
    setIsLoadingTitle(true);
    setIsTranscriptLoading(true);
    setError(null);
    setRetryCount(0);
    
    try {
      // Set YouTube URL first to preserve it
      const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
      setYoutubeUrl(fullUrl);
      
      // Create AbortController for the requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Fetch title and transcript in parallel with better error handling
      const [titleResponse, transcript] = await Promise.all([
        (async () => {
          try {
            const response = await fetch(
              `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
              { signal: controller.signal }
            );
            if (!response.ok) throw new Error('Failed to fetch video title');
            const data = await response.json();
            return data;
          } catch (error) {
            console.warn('Error fetching title:', error);
            return { title: 'YouTube Video' }; // Fallback title
          }
        })(),
        fetchTranscript(videoId),
      ]);

      // Clear the timeout since requests completed
      clearTimeout(timeoutId);

      const title = titleResponse.title || 'YouTube Video';
      
      // Format content for AI analysis
      const formattedContent = `Title: ${title}
URL: https://www.youtube.com/watch?v=${videoId}

TRANSCRIPT:
${transcript.trim()}`;

      setLastLoadedVideoId(videoId);
      setContent(formattedContent);
      setIsValid(true);
      setError(null);  // Clear any previous errors
    } catch (err: any) {
      console.error('Error loading video:', err);
      setError(err.message || 'Failed to load video');
      setIsValid(false);
      // Don't clear content or URL on error to preserve state
    } finally {
      setIsLoading(false);
      setIsLoadingTranscript(false);
      setIsLoadingTitle(false);
      setIsTranscriptLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = validateAndExtractVideoId(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL or video ID');
      return;
    }
    await handleLoadVideo(videoId);
  };

  const videoId = validateAndExtractVideoId(url);

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${className}`}>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex-none">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter YouTube URL"
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-neutral-700
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>

        {videoId && (
          <div className="flex-1 min-h-[60vh]">
            <div className="relative w-full h-full">
              <iframe
                ref={playerRef}
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute inset-0 w-full h-full rounded-lg border border-neutral-800"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {(isLoading || isLoadingTranscript) && (
          <div className="flex-none flex items-center justify-center gap-2 text-sm text-neutral-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              {isLoadingTranscript ? 'Loading transcript...' : 'Loading video...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
