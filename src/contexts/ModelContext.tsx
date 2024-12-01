'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type ModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'gemini-pro' | 'claude-2';

interface ModelContextType {
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<ModelType>('gpt-4');
  const [temperature, setTemperature] = useState(0.7);

  return (
    <ModelContext.Provider 
      value={{ 
        selectedModel, 
        setSelectedModel,
        temperature,
        setTemperature
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
