'use client';

import { useState, useEffect } from 'react';
import { Loader2, ScrollText } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useTools } from '@/contexts/ToolsContext';
import { generateSummary } from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import { CopyButton } from '@/components/ui/CopyButton';
import { SpeakButton } from '@/components/ui/SpeakButton';

export function SummaryTool() {
  const { content, contentType, isTranscriptLoading } = useContent();
  const { toolStates, updateToolState } = useTools();
  const { settings } = useSettings();
  const [summary, setSummary] = useState(toolStates.summary || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug log when content changes
  useEffect(() => {
    console.log('SummaryTool - Content updated:', {
      contentLength: content?.length,
      contentType,
      contentPreview: content?.substring(0, 100)
    });
  }, [content, contentType]);

  const handleGenerateSummary = async () => {
    if (!content || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateSummary(content, {
        ...settings,
        systemPrompt: contentType === 'youtube' 
          ? `You are analyzing a YouTube video transcript. Create a comprehensive summary that:
1. Captures the main topics and key points
2. Follows the video's progression
3. Highlights important concepts and examples
4. Uses clear section headings
5. Includes relevant quotes or timestamps when appropriate`
          : undefined
      });

      setSummary(result);
      updateToolState('summary', result);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        {isTranscriptLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading transcript...</span>
          </div>
        ) : !content ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-2">
            <ScrollText className="w-6 h-6" />
            <span>No content available</span>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <ReactMarkdown
              className="prose prose-invert max-w-none text-neutral-200 
                [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 
                [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 
                [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 
                [&>p]:mb-4 [&>p]:leading-relaxed
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2"
            >
              {summary}
            </ReactMarkdown>
            <div className="flex justify-end gap-2">
              <CopyButton text={summary} />
              <SpeakButton text={summary} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-2">
            <ScrollText className="w-6 h-6" />
            <span>Click generate to create a summary</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading || !content || isTranscriptLoading}
          className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg 
            disabled:opacity-50 disabled:cursor-not-allowed 
            hover:bg-neutral-700 transition-colors
            flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <ScrollText className="w-5 h-5" />
              <span>{summary ? 'Generate New Summary' : 'Generate Summary'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
