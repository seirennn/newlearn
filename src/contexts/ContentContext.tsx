import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ContentContextType {
  content: string;
  contentType: 'pdf' | 'text' | 'youtube';
  pdfUrl: string | null;
  youtubeUrl: string | null;
  isTranscriptLoading: boolean;
  setContent: (content: string) => void;
  setContentType: (type: 'pdf' | 'text' | 'youtube') => void;
  setPdfUrl: (url: string | null) => void;
  setYoutubeUrl: (url: string | null) => void;
  setIsTranscriptLoading: (loading: boolean) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentContextType>({
    content: '',
    contentType: 'text',
    pdfUrl: null,
    youtubeUrl: null,
    isTranscriptLoading: false,
    setContent: () => {},
    setContentType: () => {},
    setPdfUrl: () => {},
    setYoutubeUrl: () => {},
    setIsTranscriptLoading: () => {},
    resetContent: () => {}
  });

  const handleSetContent = useCallback((newContent: string) => {
    setState(prev => ({
      ...prev,
      content: newContent || ''
    }));
  }, []);

  const handleSetContentType = useCallback((type: 'pdf' | 'text' | 'youtube') => {
    setState(prev => ({
      ...prev,
      contentType: type
    }));
  }, []);

  const handleSetPdfUrl = useCallback((url: string | null) => {
    setState(prev => ({
      ...prev,
      pdfUrl: url
    }));
  }, []);

  const handleSetYoutubeUrl = useCallback((url: string | null) => {
    setState(prev => ({
      ...prev,
      youtubeUrl: url,
      contentType: url ? 'youtube' : prev.contentType,
      content: url ? prev.content : ''
    }));
  }, []);

  const handleSetIsTranscriptLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isTranscriptLoading: loading
    }));
  }, []);

  const handleResetContent = useCallback(() => {
    setState({
      content: '',
      contentType: 'text',
      pdfUrl: null,
      youtubeUrl: null,
      isTranscriptLoading: false,
      setContent: () => {},
      setContentType: () => {},
      setPdfUrl: () => {},
      setYoutubeUrl: () => {},
      setIsTranscriptLoading: () => {},
      resetContent: () => {}
    });
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content: state.content,
        contentType: state.contentType,
        pdfUrl: state.pdfUrl,
        youtubeUrl: state.youtubeUrl,
        isTranscriptLoading: state.isTranscriptLoading,
        setContent: handleSetContent,
        setContentType: handleSetContentType,
        setPdfUrl: handleSetPdfUrl,
        setYoutubeUrl: handleSetYoutubeUrl,
        setIsTranscriptLoading: handleSetIsTranscriptLoading,
        resetContent: handleResetContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
