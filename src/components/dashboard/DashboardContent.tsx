'use client';

import 'regenerator-runtime/runtime';
import { useState, useRef, useEffect } from 'react';
import { Brain, FileText, MessageSquare, Upload, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContent } from '@/contexts/ContentContext';
import { useTools } from '@/contexts/ToolsContext';
import { PDFViewer } from '../content/PDFViewer';
import { TextEditor } from '../content/TextEditor';
import { YouTubeViewer } from '../content/YouTubeViewer';
import { ResizeHandle } from './ResizeHandle';
import { ChatTool } from '../tools/ChatTool';
import { FlashcardsTool } from '../tools/FlashcardsTool';
import { QuizTool } from '../tools/QuizTool';
import { SummaryTool } from '../tools/SummaryTool';

type Tool = 'chat' | 'flashcards' | 'quiz' | 'summary';
type TabType = 'pdf' | 'text' | 'youtube';

interface TabContent {
  text: string;
  pdf: string;
  youtube: string;
}

interface ToolConfig {
  id: Tool;
  label: string;
  Icon: React.ElementType;
  component: React.ComponentType;
}

const tools: ToolConfig[] = [
  { id: 'chat', label: 'Chat', Icon: MessageSquare, component: ChatTool },
  { id: 'flashcards', label: 'Flashcards', Icon: FileText, component: FlashcardsTool },
  { id: 'quiz', label: 'Quiz', Icon: Brain, component: QuizTool },
  { id: 'summary', label: 'Summary', Icon: FileText, component: SummaryTool }
];

const MIN_PANEL_WIDTH = 320;
const MAX_PANEL_WIDTH = window.innerWidth * 0.8;
const DEFAULT_PANEL_WIDTH = 450;

const DashboardContent = () => {
  const { setContent: setContextContent, content: contextContent, contentType: contextType, setContentType, youtubeUrl, resetContent, isTranscriptLoading } = useContent();
  const { activeTool, setActiveTool, resetAllTools } = useTools();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(contextType as TabType);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store content for each tab type separately
  const [tabContent, setTabContent] = useState<TabContent>({
    text: '',
    pdf: '',
    youtube: ''
  });

  // Reset all content and tools on page load
  useEffect(() => {
    resetContent();
    resetAllTools();
    setTabContent({
      text: '',
      pdf: '',
      youtube: ''
    });
    setPdfFile(null);
  }, [resetContent, resetAllTools]);

  // Set chat as default tool if none is selected
  useEffect(() => {
    if (!activeTool) {
      setActiveTool('chat');
    }
  }, [activeTool, setActiveTool]);

  // Update context when active tab changes
  useEffect(() => {
    if (activeTab === 'youtube') {
      // For YouTube, we rely on the YouTubeViewer to manage content
      setContentType(activeTab);
    } else {
      setContextContent(tabContent[activeTab]);
      setContentType(activeTab);
    }
  }, [activeTab, tabContent, setContextContent, setContentType]);

  const handleContentChange = (newContent: string, type: TabType = activeTab) => {
    setTabContent(prev => ({
      ...prev,
      [type]: newContent
    }));
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setContentType(tab);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        if (file.size > 0) {
          setPdfFile(file);
          setActiveTab('pdf');
        } else {
          throw new Error('PDF file is empty');
        }
      } catch (error) {
        console.error('Error reading PDF file:', error);
        alert('Error reading PDF file. Please try another file.');
      }
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleResize = (delta: number) => {
    setPanelWidth(prev => {
      const newWidth = prev + delta;
      return Math.min(Math.max(newWidth, MIN_PANEL_WIDTH), MAX_PANEL_WIDTH);
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pdf':
        return (
          <div className="h-full">
            <PDFViewer 
              file={pdfFile}
              onTextExtracted={text => handleContentChange(text, 'pdf')}
            />
          </div>
        );
      case 'youtube':
        return (
          <div className="h-full">
            <YouTubeViewer />
          </div>
        );
      case 'text':
        return (
          <div className="h-[calc(100vh-220px)]">
            <TextEditor
              content={tabContent.text}
              onChange={text => handleContentChange(text, 'text')}
            />
          </div>
        );
    }
  };

  const renderTool = () => {
    let currentContent = '';
    
    if (activeTab === 'youtube') {
      currentContent = contextContent || '';
    } else {
      currentContent = tabContent[activeTab];
    }
    
    if (activeTab === 'youtube' && youtubeUrl && isTranscriptLoading) {
      return (
        <div className="h-[calc(100vh-180px)] flex flex-col items-center justify-center bg-[#080808] rounded-lg border border-neutral-800">
          <h2 className="text-2xl font-bold mb-2 text-white">Loading Content</h2>
          <p className="text-neutral-400 text-center max-w-md">
            Fetching video transcript...
          </p>
        </div>
      );
    }
    
    if (!currentContent?.trim()) {
      return (
        <div className="h-[calc(100vh-180px)] flex flex-col items-center justify-center bg-[#080808] rounded-lg border border-neutral-800">
          <h2 className="text-2xl font-bold mb-2 text-white">No Content Available</h2>
          <p className="text-neutral-400 text-center max-w-md">
            {activeTab === 'pdf' 
              ? 'Import a PDF to start using AI tools'
              : activeTab === 'youtube'
                ? 'Add a YouTube URL to start using AI tools'
                : 'Add some text in the editor to start using AI tools'}
          </p>
        </div>
      );
    }

    const ToolComponent = tools.find(t => t.id === activeTool)?.component;
    return ToolComponent ? <ToolComponent /> : null;
  };

  return (
    <div ref={containerRef} className="flex-1 flex h-screen overflow-hidden">
      <div className="flex-1 min-w-0 h-full bg-[#080808] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange('pdf')}
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
                onClick={() => handleTabChange('text')}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                  activeTab === 'text'
                    ? "bg-white text-black"
                    : "bg-neutral-800/50 hover:bg-neutral-800 text-white"
                )}
              >
                Text
              </button>
              <button
                onClick={() => handleTabChange('youtube')}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                  activeTab === 'youtube'
                    ? "bg-white text-black"
                    : "bg-neutral-800/50 hover:bg-neutral-800 text-white"
                )}
              >
                YouTube
              </button>
            </div>
            {activeTab === 'pdf' && (
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg transition-colors text-sm font-medium bg-neutral-800/50 hover:bg-neutral-800 text-white flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {pdfFile ? 'Change PDF' : 'Import PDF'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="h-full rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <ResizeHandle onResize={handleResize} />

      <div
        style={{ width: panelWidth }}
        className="h-full bg-[#080808] border-l border-neutral-800 flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-800">
          <div className="flex flex-wrap gap-2">
            {tools.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  activeTool === id
                    ? "bg-white text-black"
                    : "bg-neutral-800/50 hover:bg-neutral-800 text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="h-full rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
            {renderTool()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
