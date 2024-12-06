'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

export type AIModel = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'default-ai';

export interface Settings {
  apiKeys: {
    anthropic?: string;
    openai?: string;
    gemini?: string;
    groq?: string;
  };
  aiModel: AIModel;
  theme: 'light' | 'dark';
  fontSize: number;
  temperature?: number;
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  activeProvider: AIModel;
}

const defaultSettings: Settings = {
  apiKeys: {},
  aiModel: 'openai',
  theme: 'dark',
  fontSize: 16,
  temperature: 0.7
};

const validateApiKeys = (apiKeys: Record<string, string | undefined>) => {
  return Object.fromEntries(
    Object.entries(apiKeys)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _, value]) => value && typeof value === 'string' && value.trim() !== '')
      .map(([provider, value]) => [provider, value!.trim()])
  );
};

const determineAIModel = (validApiKeys: Record<string, string>, currentModel: AIModel): AIModel => {
  if (validApiKeys[currentModel]) return currentModel;
  const firstAvailableProvider = Object.keys(validApiKeys)[0] as AIModel;
  return firstAvailableProvider || 'openai';
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
      const savedSettings = localStorage.getItem('settings');
      if (!savedSettings) return defaultSettings;

      const parsed = JSON.parse(savedSettings) as Partial<Settings>;
      const validApiKeys = validateApiKeys(parsed.apiKeys || {});
      const aiModel = determineAIModel(validApiKeys, parsed.aiModel as AIModel);

      return {
        ...defaultSettings,
        ...parsed,
        apiKeys: validApiKeys,
        aiModel,
        theme: parsed.theme || defaultSettings.theme,
        fontSize: typeof parsed.fontSize === 'number' ? parsed.fontSize : defaultSettings.fontSize
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const validApiKeys = validateApiKeys(settings.apiKeys);
      const aiModel = determineAIModel(validApiKeys, settings.aiModel);

      const validSettings: Settings = {
        ...settings,
        apiKeys: validApiKeys,
        aiModel
      };

      localStorage.setItem('settings', JSON.stringify(validSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    try {
      setSettings(current => {
        let updatedSettings = { ...current, ...newSettings };
        
        if (newSettings.apiKeys) {
          const validApiKeys = validateApiKeys(newSettings.apiKeys);
          const aiModel = determineAIModel(validApiKeys, updatedSettings.aiModel);
          
          updatedSettings = {
            ...updatedSettings,
            apiKeys: validApiKeys,
            aiModel
          };
        }

        return updatedSettings;
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const activeProvider = useMemo(() => {
    const validApiKeys = validateApiKeys(settings.apiKeys);
    return determineAIModel(validApiKeys, settings.aiModel);
  }, [settings.apiKeys, settings.aiModel]);

  const contextValue = useMemo(() => ({
    settings,
    updateSettings,
    activeProvider
  }), [settings, activeProvider]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
