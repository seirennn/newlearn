import { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { generateSummary } from '@/utils/api';
import { Loader2, Brain, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { SpeakButton } from '@/components/ui/SpeakButton';

export function SummarizeTool() {
  const { content } = useContent();
  const { settings } = useSettings();
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');

  const handleGenerateSummary = async () => {
    if (!content?.trim()) {
      setError('Please provide some content first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const newSummary = await generateSummary(content, { 
        ...settings, 
        systemPrompt: `Generate a ${summaryLength} summary of the content.`,
        temperature: settings.temperature ?? 0.7 // Add a default temperature
      });
      if (typeof newSummary !== 'string' || !newSummary.trim()) {
        throw new Error('Invalid summary response');
      }
      setSummary(newSummary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Summary generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-4 mx-auto" />
            <p className="text-neutral-400">Generating summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleGenerateSummary}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">Generate Summary</h3>
            <p className="text-neutral-400 text-center max-w-sm mb-6">
              Create an AI-powered summary of your content
            </p>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Summary Length</label>
                <div className="flex gap-2 justify-center">
                  {(['short', 'medium', 'long'] as const).map((length) => (
                    <button
                      key={length}
                      onClick={() => setSummaryLength(length)}
                      className={cn(
                        "px-4 py-2 rounded-lg capitalize transition-colors",
                        summaryLength === length
                          ? "bg-neutral-100 text-neutral-900"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      )}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateSummary}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors"
            >
              Generate Summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500 capitalize">
              {summaryLength} summary
            </span>
            <div className="flex items-center gap-2">
              <SpeakButton text={summary} />
              <CopyButton text={summary} />
            </div>
          </div>
          <div className="flex gap-2">
            {(['short', 'medium', 'long'] as const).map((length) => (
              <button
                key={length}
                onClick={() => setSummaryLength(length)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs capitalize transition-colors",
                  summaryLength === length
                    ? "bg-neutral-100 text-neutral-900"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                )}
              >
                {length}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-neutral-200 whitespace-pre-wrap">{summary}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 bg-[#080808]">
          <button
            onClick={handleGenerateSummary}
            className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Summary
          </button>
        </div>
      </div>
    </div>
  );
}
