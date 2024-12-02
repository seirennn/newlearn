'use client';

import { useState } from 'react';
import { Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { PDFViewer } from '@/components/content/PDFViewer';
import { extractTextFromPDF } from '@/utils/pdf';
import { ChatTool } from '@/components/tools/ChatTool';
import { FlashcardsTool } from '@/components/tools/FlashcardsTool';
import { SummaryTool } from '@/components/tools/SummaryTool';
import { cn } from '@/lib/utils';
import { useContent } from '@/contexts/ContentContext';

export function DashboardPage() {
  const { setContent: setContextContent } = useContent();
  const [contentType, setContentType] = useState<'pdf' | 'text'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setSelectedFile(file);
    setContentType('pdf');

    try {
      const extractedText = await extractTextFromPDF(file);
      setContextContent(extractedText);
    } catch (err) {
      console.error('PDF processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContextContent(e.target.value);
  };

  return (
    <div className="flex flex-1 min-h-0">
      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-neutral-800">
        {/* Top Controls */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setContentType('pdf')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                contentType === 'pdf' ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              PDF
            </button>
            <button 
              onClick={() => setContentType('text')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                contentType === 'text' ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              Text
            </button>
          </div>
        </div>

        {/* PDF Controls */}
        {contentType === 'pdf' && (
          <div className="flex items-center gap-2 px-4 h-12 border-b border-neutral-800">
            <div className="flex items-center">
              <input
                type="text"
                value="3"
                className="w-8 bg-transparent text-center text-sm"
                readOnly
              />
              <span className="text-sm text-neutral-400">/</span>
              <input
                type="text"
                value="49"
                className="w-8 bg-transparent text-center text-sm text-neutral-400"
                readOnly
              />
            </div>

            <div className="flex items-center gap-1 ml-4">
              <button 
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
              <button 
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <div className="ml-auto">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-neutral-800/50 rounded-md cursor-pointer transition-colors",
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800"
                )}
              >
                <Upload className="h-4 w-4" />
                {isLoading ? 'Processing...' : 'Upload PDF'}
              </label>
            </div>
          </div>
        )}

        {/* Content Display */}
        <div className="flex-1 min-h-0 overflow-auto">
          {contentType === 'pdf' && selectedFile ? (
            <PDFViewer file={selectedFile} zoom={zoom} />
          ) : (
            <div className="h-full p-4">
              <textarea
                className="w-full h-full p-4 bg-neutral-900 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="Enter or paste your text here..."
                onChange={handleTextChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Tools Panel */}
      <div className="w-[400px] flex flex-col min-h-0">
        {/* Tools Navigation */}
        <div className="flex items-center gap-1 px-2 h-14 border-b border-neutral-800">
          {[
            { id: 'chat', label: 'Chat' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'summary', label: 'Summary' },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeTab === tool.id
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              )}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Active Tool */}
        <div className="flex-1 min-h-0 overflow-auto">
          {activeTab === 'chat' && <ChatTool />}
          {activeTab === 'flashcards' && <FlashcardsTool />}
          {activeTab === 'summary' && <SummaryTool />}
        </div>
      </div>
      <div className="w-[72px] h-full bg-[#080808] border-r border-neutral-800 flex flex-col items-center">
        <div className="h-[72px] w-full flex items-center justify-center border-b border-neutral-800">
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-xl hover:bg-neutral-800/50 transition-colors"
          >
            <Settings className="h-6 w-6 text-neutral-400" />
          </button>
        </div>
        <div className="flex-1" />
        <div className="pb-4 pt-4">
          <button className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-700 flex items-center justify-center">
            <User2 className="h-6 w-6 text-neutral-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
