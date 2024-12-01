'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChatTool } from '../tools/ChatTool';
import { FlashcardsTool } from '../tools/FlashcardsTool';
import { QuizTool } from '../tools/QuizTool';
import { SummaryTool } from '../tools/SummaryTool';
import { TextEditor } from '../content/TextEditor';
import { PDFViewer } from '../content/PDFViewer';
import { Brain, MessageSquare, BookOpen, ListChecks, FileText } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

type Tool = 'chat' | 'flashcards' | 'quiz' | 'summary';

interface ToolConfig {
  id: Tool;
  label: string;
  Icon: React.ElementType;
  component: React.ComponentType;
}

const tools: ToolConfig[] = [
  { id: 'chat', label: 'Chat', Icon: MessageSquare, component: ChatTool },
  { id: 'flashcards', label: 'Flashcards', Icon: BookOpen, component: FlashcardsTool },
  { id: 'quiz', label: 'Quiz', Icon: ListChecks, component: QuizTool },
  { id: 'summary', label: 'Summary', Icon: FileText, component: SummaryTool }
];

export function DashboardContent() {
  const { content, setContent, contentType, setContentType } = useContent();
  const [activeTool, setActiveTool] = useState<Tool>('chat');
  const [activeTab, setActiveTab] = useState<'pdf' | 'text'>('text');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update content type when tab changes
  useEffect(() => {
    setContentType(activeTab);
  }, [activeTab, setContentType]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setActiveTab('pdf');
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handlePDFImport = () => {
    fileInputRef.current?.click();
  };

  const handleNewText = () => {
    setActiveTab('text');
    setContent('');
  };

  const handleContentChange = (newContent: string) => {
    console.log('Content changed:', newContent.substring(0, 100));
    setContent(newContent);
  };

  const renderTool = () => {
    const activeToolConfig = tools.find(t => t.id === activeTool);
    if (!activeToolConfig) return null;

    if (!content?.trim()) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-[#080808] rounded-lg border border-neutral-800">
          <div className="w-12 h-12 mb-4 text-neutral-400">
            <activeToolConfig.Icon size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">
            No Content Available
          </h2>
          <p className="text-neutral-400 mb-8 text-center max-w-md">
            {activeTab === 'pdf' 
              ? 'Import a PDF to start using AI tools'
              : 'Add some text in the editor to start using AI tools'}
          </p>
        </div>
      );
    }

    const ToolComponent = activeToolConfig.component;
    return <ToolComponent />;
  };

  const renderContent = () => {
    if (activeTab === 'pdf') {
      if (pdfFile) {
        return <PDFViewer file={pdfFile} onTextExtracted={handleContentChange} />;
      }
      return (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-700 flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No PDF Selected</h3>
          <p className="text-neutral-400 max-w-sm">
            Import a PDF to get started with AI-powered learning tools
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handlePDFImport}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-all"
            >
              Import PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      );
    } else {
      return (
        <TextEditor
          content={content}
          onChange={handleContentChange}
        />
      );
    }
  };

  return (
    <div className="flex-1 flex">
      {/* Middle Panel - Content Viewer */}
      <div className="flex-1 border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pdf')}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                activeTab === 'pdf'
                  ? "bg-white text-black"
                  : "bg-neutral-800/50 hover:bg-neutral-800 text-white"
              )}
            >
              PDF
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                activeTab === 'text'
                  ? "bg-white text-black"
                  : "bg-neutral-800/50 hover:bg-neutral-800 text-white"
              )}
            >
              Text
            </button>
            {activeTab === 'text' && (
              <button
                onClick={handleNewText}
                className="ml-auto px-4 py-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
              >
                New Text
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="h-full rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Right Panel - Tools */}
      <div className="w-[450px] flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center">
            {tools.map((tool) => {
              const Icon = tool.Icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    "relative flex-1 flex flex-col items-center gap-2 py-3 transition-all duration-200",
                    activeTool === tool.id
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center transition-all duration-200",
                    activeTool === tool.id 
                      ? "opacity-100 scale-100" 
                      : "opacity-40 scale-90 hover:opacity-60 hover:scale-95"
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{tool.label}</span>
                  {activeTool === tool.id && (
                    <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {renderTool()}
        </div>
      </div>
    </div>
  );
}
