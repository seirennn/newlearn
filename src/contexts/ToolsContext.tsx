'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ToolState {
  chat: Message[];
  flashcards: any[];
  quiz: any[];
  summary: string;
}

interface ToolsContextType {
  activeTool: 'chat' | 'flashcards' | 'quiz' | 'summary';
  setActiveTool: (tool: 'chat' | 'flashcards' | 'quiz' | 'summary') => void;
  toolStates: ToolState;
  updateToolState: (toolId: keyof ToolState, state: any) => void;
  clearToolState: (toolId: keyof ToolState) => void;
  resetAllTools: () => void;
}

const defaultToolState: ToolState = {
  chat: [],
  flashcards: [],
  quiz: [],
  summary: ''
};

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const [activeTool, setActiveTool] = useState<'chat' | 'flashcards' | 'quiz' | 'summary'>('chat');
  const [toolStates, setToolStates] = useState<ToolState>(defaultToolState);

  const updateToolState = useCallback((toolId: keyof ToolState, state: any) => {
    setToolStates(prev => {
      if (JSON.stringify(prev[toolId]) === JSON.stringify(state)) {
        return prev;
      }
      return {
        ...prev,
        [toolId]: state
      };
    });
  }, []);

  const clearToolState = useCallback((toolId: keyof ToolState) => {
    setToolStates(prev => ({
      ...prev,
      [toolId]: defaultToolState[toolId]
    }));
  }, []);

  const resetAllTools = useCallback(() => {
    setToolStates(defaultToolState);
    setActiveTool('chat');
  }, []);

  return (
    <ToolsContext.Provider
      value={{
        activeTool,
        setActiveTool,
        toolStates,
        updateToolState,
        clearToolState,
        resetAllTools
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
}
