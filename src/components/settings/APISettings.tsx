'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSettings } from '@/contexts/SettingsContext';
import { Check, Copy, Eye, EyeOff, Info, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface APIProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  placeholder: string;
  docLink: string;
}

const API_PROVIDERS: APIProvider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '/images/anthropic.svg',
    description: 'Anthropic\'s Claude is a powerful AI model that excels at analysis and writing.',
    placeholder: 'sk-ant-...',
    docLink: 'https://console.anthropic.com/account/keys'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '/images/openai.svg',
    description: 'OpenAI\'s GPT models are versatile and can handle a wide range of tasks.',
    placeholder: 'sk-...',
    docLink: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '/images/gemini.svg',
    description: 'Google\'s Gemini is a state-of-the-art AI model with strong reasoning capabilities.',
    placeholder: 'AI...',
    docLink: 'https://makersuite.google.com/app/apikey'
  }
];

export function APISettings() {
  const { settings, updateSettings } = useSettings();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [localKeys, setLocalKeys] = useState<Record<string, string>>(settings.apiKeys || {});
  const [selectedModel, setSelectedModel] = useState<string>(settings.aiModel || 'openai');

  const handleUpdateKey = (provider: string, value: string) => {
    const newKeys = {
      ...localKeys,
      [provider]: value.trim()
    };
    setLocalKeys(newKeys);
    setIsDirty(true);

    // If this is the first key being added, select this provider
    if (value.trim() && !Object.values(localKeys).some(k => k && k.trim())) {
      setSelectedModel(provider);
    }
  };

  const handleSave = () => {
    // Filter out empty keys and trim values
    const validKeys = Object.fromEntries(
      Object.entries(localKeys)
        .filter(([_, value]) => value && value.trim() !== '')
        .map(([key, value]) => [key, value.trim()])
    );

    // Determine which model to use
    let activeModel = selectedModel;
    if (!validKeys[selectedModel]) {
      // If selected model doesn't have a valid key, use the first available one
      activeModel = Object.keys(validKeys)[0] || 'openai';
      setSelectedModel(activeModel);
    }

    const newSettings = {
      ...settings,
      apiKeys: validKeys,
      aiModel: activeModel
    };

    console.log('Saving settings:', {
      apiKeys: Object.keys(validKeys),
      aiModel: activeModel
    });

    updateSettings(newSettings);
    setIsDirty(false);
    
    if (Object.keys(validKeys).length > 0) {
      toast.success(`Settings saved! Using ${API_PROVIDERS.find(p => p.id === activeModel)?.name || activeModel}`, {
        duration: 4000,
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
    } else {
      toast.error('Please add at least one API key to use the AI features', {
        duration: 4000,
        style: {
          background: '#1b1b1b',
          color: '#fff',
          border: '1px solid #333'
        }
      });
    }
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const copyKey = async (provider: string) => {
    const key = localKeys[provider];
    if (key) {
      await navigator.clipboard.writeText(key);
      setCopied(prev => ({ ...prev, [provider]: true }));
      toast.success('API key copied to clipboard!', {
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
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [provider]: false }));
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">API Settings</h2>
        <p className="text-neutral-400">
          Configure your API keys for different AI providers. Your keys are stored locally and never sent to our servers.
        </p>
      </div>

      <div className="space-y-4">
        {API_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className={`bg-[#151515] rounded-lg p-4 space-y-4 ${
              selectedModel === provider.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              if (localKeys[provider.id]?.trim()) {
                setSelectedModel(provider.id);
                setIsDirty(true);
              }
            }}
            style={{ cursor: localKeys[provider.id]?.trim() ? 'pointer' : 'default' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Image
                    src={provider.icon}
                    alt={provider.name}
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{provider.name}</h3>
                    {selectedModel === provider.id && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400">{provider.description}</p>
                </div>
              </div>
              <a
                href={provider.docLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Info size={16} />
              </a>
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <input
                type={showKeys[provider.id] ? 'text' : 'password'}
                value={localKeys[provider.id] || ''}
                onChange={(e) => handleUpdateKey(provider.id, e.target.value)}
                placeholder={provider.placeholder}
                className="w-full bg-neutral-900 rounded-lg px-4 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700 placeholder-neutral-600"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {localKeys[provider.id] && (
                  <button
                    onClick={() => copyKey(provider.id)}
                    className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
                    title="Copy API key"
                  >
                    {copied[provider.id] ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
                <button
                  onClick={() => toggleShowKey(provider.id)}
                  className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
                  title={showKeys[provider.id] ? 'Hide API key' : 'Show API key'}
                >
                  {showKeys[provider.id] ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isDirty && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
