'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AIModel = 'openai' | 'anthropic' | 'gemini';

interface Settings {
  apiKeys: {
    anthropic?: string;
    openai?: string;
    gemini?: string;
  };
  aiModel: AIModel;
  theme: 'light' | 'dark';
  fontSize: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  activeProvider: AIModel;
}

const defaultSettings: Settings = {
  apiKeys: {},
  aiModel: 'openai',
  theme: 'dark',
  fontSize: 16
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Try to load settings from localStorage on initial render
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          
          // Validate the parsed settings
          const validApiKeys = Object.fromEntries(
            Object.entries(parsed.apiKeys || {})
              .filter(([_, value]) => value && typeof value === 'string' && value.trim() !== '')
              .map(([key, value]) => [key, (value as string).trim()])
          );

          // Ensure we have a valid AI model selected
          const aiModel = validApiKeys[parsed.aiModel] 
            ? parsed.aiModel 
            : Object.keys(validApiKeys)[0] || 'openai';

          const validSettings = {
            ...defaultSettings,
            ...parsed,
            apiKeys: validApiKeys,
            aiModel
          };

          console.log('Loaded settings:', {
            apiKeys: Object.keys(validApiKeys),
            aiModel: validSettings.aiModel
          });

          return validSettings;
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Validate settings before saving
        const validApiKeys = Object.fromEntries(
          Object.entries(settings.apiKeys)
            .filter(([_, value]) => value && value.trim() !== '')
            .map(([key, value]) => [key, value.trim()])
        );

        const validSettings = {
          ...settings,
          apiKeys: validApiKeys,
          aiModel: validApiKeys[settings.aiModel] ? settings.aiModel : Object.keys(validApiKeys)[0] || 'openai'
        };

        console.log('Saving settings to localStorage:', {
          apiKeys: Object.keys(validSettings.apiKeys),
          aiModel: validSettings.aiModel
        });

        localStorage.setItem('settings', JSON.stringify(validSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  }, [settings]);

  const updateSettings = (newSettings: Settings) => {
    try {
      // Validate API keys
      const validApiKeys = Object.fromEntries(
        Object.entries(newSettings.apiKeys)
          .filter(([_, value]) => value && value.trim() !== '')
          .map(([key, value]) => [key, value.trim()])
      );

      // Ensure we have a valid AI model selected
      const aiModel = validApiKeys[newSettings.aiModel]
        ? newSettings.aiModel
        : Object.keys(validApiKeys)[0] || 'openai';

      const validSettings = {
        ...newSettings,
        apiKeys: validApiKeys,
        aiModel
      };

      console.log('Updating settings:', {
        apiKeys: Object.keys(validApiKeys),
        aiModel: validSettings.aiModel
      });

      setSettings(validSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Get the active provider based on available API keys
  const activeProvider = settings.apiKeys[settings.aiModel]
    ? settings.aiModel
    : Object.keys(settings.apiKeys)[0] || 'openai';

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, activeProvider }}>
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
