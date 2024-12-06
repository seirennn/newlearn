'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Check, Brain, Key, Settings as SettingsIcon, ChevronRight, Sun, Moon, Laptop } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'general' | 'models' | 'api-keys';
type Theme = 'light' | 'dark' | 'system';
type AIModel = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'default-ai';

interface ModelConfig {
  id: string;
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

const THEMES: { id: Theme; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Laptop },
];

const models: ModelConfig[] = [
  {
    id: 'default-ai',
    name: 'Default AI',
    provider: 'default-ai',
    description: 'Powerful default model powered by Llama 3',
    requiresKey: false,
    color: 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
  },
  {
    id: 'groq-llama',
    name: 'Groq (Llama 3)',
    provider: 'groq',
    description: 'High-performance model with fast inference',
    requiresKey: true,
    color: 'bg-gradient-to-br from-rose-500 to-red-500'
  },
  {
    id: 'openai-gpt4',
    name: 'GPT-4',
    provider: 'openai',
    description: 'Most capable model, best for complex tasks',
    requiresKey: true,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500'
  },
  {
    id: 'openai-gpt3',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and efficient, good balance',
    requiresKey: true,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'gemini',
    description: "Advanced AI model with superior performance",
    requiresKey: true,
    color: 'bg-gradient-to-br from-indigo-500 to-purple-500'
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    provider: 'anthropic',
    description: 'Excellent at analysis and coding',
    requiresKey: true,
    color: 'bg-gradient-to-br from-orange-500 to-pink-500'
  }
];

const API_PROVIDERS = [
  {
    id: 'default-ai',
    label: 'Default AI',
    placeholder: 'No API key required',
    icon: '/images/groq.svg',
    description: 'Pre-configured AI model ready to use'
  },
  {
    id: 'groq',
    label: 'Groq API Key',
    placeholder: 'Enter your Groq API key',
    icon: '/images/groq.svg',
    description: 'Required for using Groq models'
  },
  { 
    id: 'openai',
    label: 'OpenAI API Key',
    placeholder: 'sk-...',
    icon: '/images/openai.svg',
    description: 'Required for GPT-4 and GPT-3.5 Turbo'
  },
  { 
    id: 'gemini',
    label: 'Google Gemini API Key',
    placeholder: 'Enter your Gemini API key',
    icon: '/images/gemini.svg',
    description: 'Required for Gemini Pro'
  },
  { 
    id: 'anthropic',
    label: 'Anthropic API Key',
    placeholder: 'Enter your Anthropic API key',
    icon: '/images/anthropic.svg',
    description: 'Required for Claude 2'
  }
] as const;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const { settings, updateSettings } = useSettings();
  const [theme, setTheme] = useState<Theme>(settings.theme || 'dark');
  const [localApiKeys, setLocalApiKeys] = useState<Record<string, string>>(settings.apiKeys || {});
  const [selectedModelId, setSelectedModelId] = useState<string>(settings.aiModel || 'openai-gpt4');

  // Initialize local state from settings
  useEffect(() => {
    setTheme(settings.theme || 'dark');
    setLocalApiKeys(settings.apiKeys || {});
    setSelectedModelId(settings.aiModel || 'openai-gpt4');
  }, [settings]);

  const handleApiKeyChange = useCallback((provider: string, value: string) => {
    setLocalApiKeys(prev => ({
      ...prev,
      [provider]: value.trim()
    }));
  }, []);

  const handleSaveSettings = useCallback(() => {
    // Filter out empty API keys
    const validApiKeys = Object.fromEntries(
      Object.entries(localApiKeys).filter(([, value]) => value && value.trim() !== '')
    );

    // Get the selected model's provider
    const selectedModel = models.find(m => m.id === selectedModelId);
    if (!selectedModel) {
      toast.error('Invalid model selected');
      return;
    }

    // Check if we have a valid API key for the selected model
    if (!validApiKeys[selectedModel.provider] && selectedModel.requiresKey) {
      toast.error(`Please add an API key for ${selectedModel.name}`);
      return;
    }

    // Map model ID to provider for the settings
    const aiModel: AIModel = ['openai', 'anthropic', 'gemini', 'groq'].includes(selectedModel.provider) 
      ? (selectedModel.provider as AIModel) 
      : 'default-ai';

    // Update settings
    updateSettings({
      ...settings,
      theme: theme as 'dark' | 'light',
      apiKeys: validApiKeys,
      aiModel
    });

    toast.success(`Settings saved! Using ${selectedModel.name}`, {
      style: {
        background: '#1b1b1b',
        color: '#fff',
        border: '1px solid #333'
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#1b1b1b'
      }
    });

    // Close the modal
    onClose();
  }, [settings, theme, localApiKeys, selectedModelId, updateSettings, onClose]);

  const getProviderStatus = useCallback((provider: string) => {
    return localApiKeys[provider] ? 'active' : 'missing';
  }, [localApiKeys]);

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
                  onClick={() => setSelectedModelId(model.id)}
                  className={cn(
                    "group relative w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
                    selectedModelId === model.id
                      ? "border-neutral-500 bg-neutral-800/50 shadow-lg"
                      : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    model.color,
                    selectedModelId === model.id ? "shadow-lg" : ""
                  )}>
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium">{model.name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-neutral-800 rounded-full">
                        {model.provider}
                      </span>
                      {model.requiresKey && !localApiKeys[model.provider] && (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                          Requires API Key
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400">{model.description}</p>
                  </div>
                  <div className={cn(
                    "absolute right-4 top-4 w-5 h-5 rounded-full border-2 transition-colors duration-200",
                    selectedModelId === model.id
                      ? "bg-green-500 border-green-500"
                      : "border-neutral-600 group-hover:border-neutral-500"
                  )}>
                    {selectedModelId === model.id && (
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
                    <Image
                      src={provider.icon}
                      alt={provider.label}
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                    <label className="block font-medium">{provider.label}</label>
                    <span className={`ml-auto text-xs font-semibold ${
                      getProviderStatus(provider.id) === 'active' 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {getProviderStatus(provider.id) === 'active' ? 'Active' : 'Missing Key'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">{provider.description}</p>
                  <div className="relative">
                    <input
                      type="password"
                      value={localApiKeys[provider.id] || ''}
                      onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                      placeholder={provider.placeholder}
                      className="w-full pl-4 pr-12 py-3 bg-neutral-900 rounded-lg border border-neutral-800 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all duration-200"
                    />
                    {localApiKeys[provider.id] && (
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
              <button 
                onClick={handleSaveSettings}
                className="w-full px-4 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-all duration-200 shadow-lg shadow-white/10"
              >
                Save Settings
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
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
