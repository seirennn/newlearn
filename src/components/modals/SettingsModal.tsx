'use client';

import { useState, useCallback } from 'react';
import { X, Check, Brain, Key, Settings as SettingsIcon, ChevronRight, Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModel, ModelType } from '@/contexts/ModelContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'general' | 'models' | 'api-keys';
type Theme = 'light' | 'dark' | 'system';

interface ModelConfig {
  id: ModelType;
  name: string;
  provider: string;
  description: string;
  requiresKey: boolean;
  color: string;
}

const TABS = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'models', label: 'AI Models', icon: Brain },
  { id: 'api-keys', label: 'API Keys', icon: Key },
] as const;

const THEMES: { id: Theme; label: string; icon: any }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Laptop },
];

const models: ModelConfig[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable model, best for complex tasks',
    requiresKey: true,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient, good balance',
    requiresKey: true,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: "Advanced AI model with superior performance",
    requiresKey: true,
    color: 'bg-gradient-to-br from-indigo-500 to-purple-500'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    description: "Free version with great capabilities",
    requiresKey: false,
    color: 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    provider: 'Anthropic',
    description: 'Excellent at analysis and coding',
    requiresKey: true,
    color: 'bg-gradient-to-br from-orange-500 to-pink-500'
  }
];

const API_PROVIDERS = [
  { 
    id: 'openai',
    label: 'OpenAI API Key',
    placeholder: 'sk-...',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    description: 'Required for GPT-4 and GPT-3.5 Turbo'
  },
  { 
    id: 'google',
    label: 'Google API Key (Optional)',
    placeholder: 'Enter your Google API key for Gemini Pro',
    icon: 'https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg',
    description: 'Optional: Only needed for Gemini Pro. Regular Gemini is free!'
  },
  { 
    id: 'anthropic',
    label: 'Anthropic API Key',
    placeholder: 'Enter your Anthropic API key',
    icon: 'https://www.anthropic.com/favicon.ico',
    description: 'Required for Claude 2'
  }
] as const;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const { selectedModel, setSelectedModel } = useModel();
  const [theme, setTheme] = useState<Theme>('system');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openai: '',
    google: '',
    anthropic: ''
  });

  const handleApiKeyChange = useCallback((provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider.toLowerCase()]: value
    }));
  }, []);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-medium mb-4">Appearance</h4>
              <div className="grid grid-cols-3 gap-4">
                {THEMES.map((themeOption) => {
                  const Icon = themeOption.icon;
                  return (
                    <button
                      key={themeOption.id}
                      onClick={() => setTheme(themeOption.id)}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                        theme === themeOption.id
                          ? "border-neutral-500 bg-neutral-800/50 shadow-lg"
                          : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        theme === themeOption.id ? "bg-white text-black" : "bg-neutral-800"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{themeOption.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div>
                    <h5 className="font-medium mb-1">Auto-save</h5>
                    <p className="text-sm text-neutral-400">Automatically save your work</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-neutral-700 relative cursor-pointer transition-colors duration-200">
                    <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 transform translate-x-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'models':
        return (
          <div className="space-y-6">
            <p className="text-neutral-400">
              Select your preferred AI model for generating content. Different models have different capabilities and pricing.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    "group relative w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
                    selectedModel === model.id
                      ? "border-neutral-500 bg-neutral-800/50 shadow-lg"
                      : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    model.color,
                    selectedModel === model.id ? "shadow-lg" : ""
                  )}>
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium">{model.name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-neutral-800 rounded-full">
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400">{model.description}</p>
                  </div>
                  <div className={cn(
                    "absolute right-4 top-4 w-5 h-5 rounded-full border-2 transition-colors duration-200",
                    selectedModel === model.id
                      ? "bg-green-500 border-green-500"
                      : "border-neutral-600 group-hover:border-neutral-500"
                  )}>
                    {selectedModel === model.id && (
                      <Check className="h-4 w-4 text-white absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'api-keys':
        return (
          <div className="space-y-8">
            <p className="text-neutral-400">
              Enter your API keys to use different AI models. Your keys are stored locally and never sent to our servers.
            </p>
            <div className="space-y-6">
              {API_PROVIDERS.map((provider) => (
                <div key={provider.id} className="space-y-2">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={provider.icon}
                      alt={provider.label}
                      className="w-6 h-6 rounded-md"
                    />
                    <label className="block font-medium">{provider.label}</label>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">{provider.description}</p>
                  <div className="relative">
                    <input
                      type="password"
                      value={apiKeys[provider.id]}
                      onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                      placeholder={provider.placeholder}
                      className="w-full pl-4 pr-12 py-3 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all duration-200"
                    />
                    {apiKeys[provider.id] && (
                      <button
                        onClick={() => handleApiKeyChange(provider.id, '')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <X className="h-4 w-4 text-neutral-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-neutral-800">
              <button className="w-full px-4 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-all duration-200 shadow-lg shadow-white/10">
                Save API Keys
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0C0C0C] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex overflow-hidden border border-neutral-800/50">
        {/* Sidebar */}
        <div className="w-72 border-r border-neutral-800">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <div className="p-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
                <ChevronRight className={cn(
                  "h-4 w-4 ml-auto transition-transform duration-200",
                  activeTab === tab.id && "rotate-90"
                )} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h3 className="text-xl font-semibold">
              {TABS.find(tab => tab.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
