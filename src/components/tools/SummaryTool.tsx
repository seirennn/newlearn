import { useState, useEffect } from 'react';
import { ScrollText } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { generateSummary } from '@/utils/api';

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
        <p className="text-sm text-gray-400 mb-4">
          Get a concise summary of your content
        </p>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
        </div>
      </div>

      <button
        onClick={handleGenerateSummary}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate New Summary'}
      </button>
    </div>
  );
}
