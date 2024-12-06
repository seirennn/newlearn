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
    contentType, 
    youtubeUrl, 
    setYoutubeUrl,
    setIsTranscriptLoading 
  } = useContent();
  
  const [url, setUrl] = useState(youtubeUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedVideoId, setLastLoadedVideoId] = useState<string | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const validateAndExtractVideoId = useCallback((input: string): string | null => {
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
  }, []);

  const handleLoadVideo = useCallback(async (videoId: string) => {
    // Allow reloading when switching back to YouTube tab
    if (videoId === lastLoadedVideoId && !error && contentType === 'youtube') {
      return;
    }

    setIsLoading(true);
    setIsLoadingTranscript(true);
    setIsTranscriptLoading(true);
    setError(null);
    
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
            const data = await response.json() as { title: string };
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
      setError(null);  // Clear any previous errors
    } catch (error) {
      console.error('Error loading video:', error);
      setError(error instanceof Error ? error.message : 'Failed to load video');
      // Don't clear content or URL on error to preserve state
    } finally {
      setIsLoading(false);
      setIsLoadingTranscript(false);
      setIsTranscriptLoading(false);
    }
  }, [contentType, error, lastLoadedVideoId, setContent, setIsTranscriptLoading, setYoutubeUrl]);

  // Add an input state for YouTube URL
  const [youtubeInput, setYoutubeInput] = useState(url);

  // Debounced URL validation
  const validateAndLoad = useCallback((input: string) => {
    const videoId = validateAndExtractVideoId(input);
    if (videoId) {
      void handleLoadVideo(videoId);
    }
  }, [handleLoadVideo, validateAndExtractVideoId]);

  const debouncedValidation = debounce(validateAndLoad, 500);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedValidation.cancel();
    };
  }, [debouncedValidation]);

  // Handler for YouTube URL input
  const handleYoutubeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setYoutubeInput(input);
    setUrl(input);
    debouncedValidation(input);
  };

  // Handle paste event to load video immediately
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const input = e.clipboardData.getData('text');
    setYoutubeInput(input);
    setUrl(input);
    const videoId = validateAndExtractVideoId(input);
    if (videoId) {
      void handleLoadVideo(videoId);
    }
  };

  // Refetch when switching back to YouTube tab
  useEffect(() => {
    if (contentType === 'youtube' && youtubeUrl) {
      setYoutubeInput(youtubeUrl);
      const videoId = validateAndExtractVideoId(youtubeUrl);
      if (videoId) {
        void handleLoadVideo(videoId);
      }
    }
  }, [contentType, youtubeUrl, handleLoadVideo, validateAndExtractVideoId]);

  useEffect(() => {
    if (youtubeUrl && youtubeUrl !== url) {
      setUrl(youtubeUrl);
      setYoutubeInput(youtubeUrl);
      const videoId = validateAndExtractVideoId(youtubeUrl);
      if (videoId) {
        void handleLoadVideo(videoId);
      }
    }
  }, [youtubeUrl, url, handleLoadVideo, validateAndExtractVideoId]);

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
          const data = await response.json() as { error: string };
          throw new Error(data.error || 'Failed to fetch transcript');
        }

        const data = await response.json() as { transcript: string };
        if (!data.transcript) {
          throw new Error('No transcript available for this video');
        }

        // Cache the successful result
        transcriptCache.set(videoId, {
          transcript: data.transcript,
          timestamp: Date.now(),
        });

        return data.transcript;
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchWithRetry(attempt + 1);
        }
        throw error instanceof Error ? error : new Error('Unknown error occurred');
      }
    };

    return fetchWithRetry(1);
  };

  const videoId = validateAndExtractVideoId(url);

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${className}`}>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={youtubeInput}
            onChange={handleYoutubeInputChange}
            onPaste={handlePaste}
            placeholder="Enter YouTube URL or Video ID"
            className="flex-grow p-2 rounded bg-neutral-800 border-neutral-700 border text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

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
