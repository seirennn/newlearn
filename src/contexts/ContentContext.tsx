import { createContext, useContext, useState, ReactNode } from 'react';

interface ContentContextType {
  content: string;
  setContent: (content: string) => void;
  contentType: 'pdf' | 'text';
  setContentType: (type: 'pdf' | 'text') => void;
  pdfUrl: string | null;
  setPdfUrl: (url: string | null) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'pdf' | 'text'>('text');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleSetContent = (newContent: string) => {
    console.log('Setting content:', { newContent, length: newContent.length });
    setContent(newContent);
  };

  const handleSetContentType = (type: 'pdf' | 'text') => {
    console.log('Setting content type:', type);
    setContentType(type);
  };

  return (
    <ContentContext.Provider 
      value={{ 
        content, 
        setContent: handleSetContent, 
        contentType, 
        setContentType: handleSetContentType,
        pdfUrl,
        setPdfUrl
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
