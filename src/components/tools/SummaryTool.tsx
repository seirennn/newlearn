'use client';

import { useState, useEffect } from 'react';
import { ScrollText } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { generateSummary } from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import { CopyButton } from '@/components/ui/CopyButton';
import { SpeakButton } from '@/components/ui/SpeakButton';

export function SummaryTool() {
  const { content, contentType } = useContent();
  const { settings } = useSettings();
  const [summary, setSummary] = useState<string | null>(null);
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
    if (!content?.trim()) {
      setError('Please add some content first!');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Generating summary for content:', {
      length: content.length,
      preview: content.substring(0, 100)
    });

    try {
      const result = await generateSummary(content, settings);
      setSummary(result);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <ScrollText className="mx-auto mb-4 text-red-500" size={24} />
        <h3 className="text-lg font-semibold mb-2 text-red-500">Error</h3>
        <p className="text-sm text-red-400 mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-8">
        <ScrollText className="mx-auto mb-4" size={24} />
        <h3 className="text-lg font-semibold mb-2">Generate Summary</h3>
        <p className="text-sm text-neutral-400 mb-4">
          Get a concise summary of your content
        </p>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="px-4 py-2 bg-neutral-800 rounded-lg text-sm hover:bg-neutral-700 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Summary</h3>
          <div className="flex items-center gap-2">
            <SpeakButton text={summary} />
            <CopyButton text={summary} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                className="text-neutral-200 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2"
              >
                {summary}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 bg-[#080808]">
          <button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ScrollText className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Generate New Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
