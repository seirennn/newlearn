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
    // Prevent reloading the same video
    if (videoId === lastLoadedVideoId && !error) {
      return;
    }

    setIsLoading(true);
    setIsLoadingTranscript(true);
    setIsLoadingTitle(true);
    setIsTranscriptLoading(true);
    setError(null);
    setRetryCount(0);
    
    try {
      // Reset content first to ensure clean state
      setContent('');
      setContentType('youtube');
      
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
            setIsLoadingTitle(false);
            return data;
          } catch (error) {
            setIsLoadingTitle(false);
            console.warn('Error fetching title:', error);
            return { title: 'YouTube Video' }; // Fallback title
          }
        })(),
        (async () => {
          try {
            const transcriptText = await fetchTranscript(videoId);
            setIsLoadingTranscript(false);
            return transcriptText;
          } catch (error) {
            setIsLoadingTranscript(false);
            throw error; // Re-throw transcript errors as they are critical
          }
        })()
      ]).finally(() => {
        clearTimeout(timeoutId);
        controller.abort(); // Cleanup any pending requests
      });

      const title = titleResponse.title || 'YouTube Video';
      
      // Format content for AI analysis
      const formattedContent = `[YOUTUBE_TRANSCRIPT_START]
Title: ${title}
URL: https://www.youtube.com/watch?v=${videoId}
TRANSCRIPT:

${transcript.trim()}
[YOUTUBE_TRANSCRIPT_END]`;

      // Update state
      setContent(formattedContent);
      setYoutubeUrl(url);
      setLastLoadedVideoId(videoId);

      // Verify content was set
      if (!formattedContent) {
        throw new Error('Failed to format content');
      }

    } catch (error: any) {
      console.error('Error loading video:', error);
      const errorMessage = error.message || 'Failed to load video';
      setError(
        errorMessage.includes('transcript') 
          ? `${errorMessage}. Please check if the video has captions available.`
          : `${errorMessage}. Please check if the video exists and try again.`
      );
      setContent('');
      setLastLoadedVideoId(null);
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
    <div className={`flex flex-col h-full ${className}`}>
      <form onSubmit={handleSubmit} className="p-4 border-b border-neutral-800">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter YouTube URL or video ID"
              className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-700"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors min-w-[80px] flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Load'
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          {(isLoadingTranscript || isLoadingTitle) && (
            <div className="text-neutral-400 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isLoadingTranscript && <span>Loading transcript...</span>}
              {isLoadingTitle && <span>Loading video info...</span>}
            </div>
          )}
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
