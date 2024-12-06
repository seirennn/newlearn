'use client';

import 'regenerator-runtime/runtime';
import { useState, useRef, useEffect } from 'react';
import { Brain, FileText, MessageSquare, Upload} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContent } from '@/contexts/ContentContext';
import { useTools } from '@/contexts/ToolsContext';
import { PDFViewer } from '../content/PDFViewer';
import TextEditor from '@/components/content/TextEditor';
import { YouTubeViewer } from '@/components/content/YouTubeViewer';
import { ResizeHandle } from '@/components/dashboard/ResizeHandle';
import { ChatTool } from '@/components/tools/ChatTool';
import { FlashcardsTool } from '@/components/tools/FlashcardsTool';
import { QuizTool } from '@/components/tools/QuizTool';
import { SummaryTool } from '@/components/tools/SummaryTool';
import { pdfjs } from 'react-pdf';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

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
const DEFAULT_PANEL_WIDTH = 585;

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

  // Initialize panel width on mount
  useEffect(() => {
    const maxWidth = Math.min(window.innerWidth * 0.8, 1200);
    const initialWidth = Math.min(Math.max(window.innerWidth * 0.35, MIN_PANEL_WIDTH), maxWidth);
    setPanelWidth(initialWidth);
  }, []);

  // Reset all content and tools only on page load/refresh
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.performance.navigation.type) {
      resetContent();
      resetAllTools();
      setTabContent({
        text: '',
        pdf: '',
        youtube: ''
      });
      setPdfFile(null);
    }
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
      // For YouTube, only set content type without resetting content
      setContentType(activeTab);
    } else if (['text', 'pdf'].includes(activeTab)) {
      // For other tabs, preserve YouTube URL while changing content
      setContextContent(tabContent[activeTab]);
      setContentType(activeTab);
    }
  }, [activeTab, tabContent, setContextContent, setContentType, contextContent]);

  // Update panel width on window resize
  useEffect(() => {
    const handleResize = () => {
      const maxWidth = Math.min(window.innerWidth * 0.8, 1200);
      setPanelWidth(prev => Math.min(prev, maxWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContentChange = (newContent: string, type: TabType = activeTab) => {
    setTabContent(prev => ({
      ...prev,
      [type]: newContent
    }));
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setContentType(tab);
    if (tab !== 'youtube') {
      setContextContent(tabContent[tab]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit
    
    if (!file) return;
    
    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Please select a valid PDF file');
      }
      
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('PDF file is too large (max 100MB)');
      }
      
      if (file.size === 0) {
        throw new Error('PDF file is empty');
      }

      setPdfFile(file);
      setActiveTab('pdf');
      setContentType('pdf');
      
      // Clear the file input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error: unknown) {
      console.error('Error handling PDF file:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(errorMessage);
      
      // Reset state on error
      setPdfFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResize = (delta: number) => {
    setPanelWidth(prev => {
      const maxWidth = Math.min(window.innerWidth * 0.8, 1200);
      const newWidth = prev + delta;
      return Math.min(Math.max(newWidth, MIN_PANEL_WIDTH), maxWidth);
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
        className="h-full bg-[#010101] flex flex-col overflow-hidden"
      >
        <div className="relative px-6 py-5 border-b border-white/[0.02]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#000000] opacity-40" 
            style={{
              background: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.02), transparent 70%)'
            }}
          />
          
          <div 
            className="relative flex gap-0.5 p-0.5 rounded-xl bg-[#070707]/80 backdrop-blur-2xl"
            style={{
              boxShadow: `
                0 4px 24px rgba(0,0,0,0.4),
                inset 0 1px 1px rgba(255,255,255,0.03),
                inset 0 -1px 1px rgba(0,0,0,0.3)
              `
            }}
          >
            <div className="absolute inset-0 rounded-xl opacity-40"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03), transparent 60%)'
              }}
            />
            
            {tools.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                className={cn(
                  "group relative flex items-center gap-3 px-5 py-3 rounded-[10px] transition-all duration-300",
                  "text-[13px] tracking-wide font-medium flex-1 z-10",
                  "hover:bg-white/[0.02]",
                  "focus:outline-none focus:bg-white/[0.03]",
                  activeTool === id
                    ? "bg-gradient-to-b from-white/[0.06] to-white/[0.02] text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                )}
                style={{
                  textShadow: activeTool === id ? '0 2px 10px rgba(255,255,255,0.2)' : 'none'
                }}
              >
                <div 
                  className={cn(
                    "absolute inset-0 rounded-[10px] opacity-0 transition-all duration-500",
                    activeTool === id && "opacity-100"
                  )}
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.005) 100%)',
                    boxShadow: `
                      inset 0 1px 1px rgba(255,255,255,0.04),
                      inset 0 -1px 1px rgba(0,0,0,0.1)
                    `
                  }}
                />
                
                <div className="relative">
                  <Icon className={cn(
                    "h-[16px] w-[16px] transition-all duration-500",
                    activeTool === id 
                      ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                      : "text-neutral-500 group-hover:text-neutral-400",
                    "transform-gpu",
                    activeTool === id ? "scale-110" : "group-hover:scale-105"
                  )} />
                  
                  {activeTool === id && (
                    <div className="absolute -inset-2 animate-pulse rounded-full bg-white/5" />
                  )}
                </div>

                <span className="relative">
                  {label}
                  {activeTool === id && (
                    <>
                      <div className="absolute -left-1 -right-1 h-[1px] -bottom-1.5 opacity-20"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)'
                        }}
                      />
                      <div className="absolute -left-0.5 top-1/2 w-[1px] h-2 -translate-y-1/2 -translate-x-2 opacity-20"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.7), transparent)'
                        }}
                      />
                      <div className="absolute -top-4 left-1/2 w-8 h-[1px] -translate-x-1/2 opacity-10"
                        style={{
                          background: 'linear-gradient(90deg, transparent, white, transparent)'
                        }}
                      />
                    </>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto bg-gradient-to-b from-[#010101] to-black">
          <div 
            className="h-full rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(20,20,20,0.4) 0%, rgba(10,10,10,0.4) 100%)',
              boxShadow: `
                0 4px 24px rgba(0,0,0,0.4),
                inset 0 1px 1px rgba(255,255,255,0.02),
                inset 0 -1px 1px rgba(0,0,0,0.2)
              `,
              border: '1px solid rgba(255,255,255,0.02)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            {renderTool()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
