'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Copy, Check } from 'lucide-react';
import { generateSummary } from '@/lib/ai';

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSummarizing(true);
    setError('');

    try {
      const result = await generateSummary(text);
      setSummary(result || '');
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Smart Summarizer
        </h1>
        <p className="text-gray-400">
          Transform lengthy content into clear, concise summaries using AI. Perfect for quick comprehension and revision.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-[#161616] rounded-lg p-6 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                Enter or paste your text
              </label>
              <textarea
                id="text"
                rows={12}
                className="w-full px-3 py-2 bg-[#0c0c0c] border border-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
              />
            </div>
            <button
              type="submit"
              disabled={!text || isSummarizing}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium ${
                (!text || isSummarizing) && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Summarizing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Generate Summary</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-900 rounded-md text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="bg-[#161616] rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Summary</h2>
            {summary && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {summary ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-400 text-center">
                <div>
                  <p className="mb-2">No summary generated yet.</p>
                  <p className="text-sm">Enter your text on the left to get started!</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
