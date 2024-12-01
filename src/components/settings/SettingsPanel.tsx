import { useState } from 'react';
import { Settings, X, AlertCircle } from 'lucide-react';
import { useSettings, AIModel } from '@/contexts/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);

  if (!isOpen) return null;

  const aiModels: { value: AIModel; label: string; description: string }[] = [
    {
      value: 'openai',
      label: 'OpenAI',
      description: 'Use OpenAI GPT models (requires API key)',
    },
    {
      value: 'gemini',
      label: 'Google Gemini',
      description: 'Use Google Gemini models (requires API key)',
    },
    {
      value: 'local',
      label: 'Local Models',
      description: 'Use locally hosted models (requires setup)',
    },
    {
      value: 'custom',
      label: 'Custom Endpoint',
      description: 'Use your own AI model endpoint',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1B1E] rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Model Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400">AI Model</h3>
            <div className="grid grid-cols-2 gap-4">
              {aiModels.map((model) => (
                <button
                  key={model.value}
                  onClick={() => updateSettings({ aiModel: model.value })}
                  className={`p-4 rounded-lg border ${
                    settings.aiModel === model.value
                      ? 'border-blue-600 bg-blue-600/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium mb-1">{model.label}</div>
                    <div className="text-sm text-gray-400">{model.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          {settings.aiModel !== 'local' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-400">
                {settings.aiModel === 'openai'
                  ? 'OpenAI API Key'
                  : settings.aiModel === 'gemini'
                  ? 'Google API Key'
                  : 'API Key'}
              </h3>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  className="w-full p-2 bg-[#141517] border border-gray-800 rounded-lg"
                  placeholder="Enter your API key"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-300"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <AlertCircle size={14} />
                Your API key is stored locally and never sent to our servers
              </p>
            </div>
          )}

          {/* Custom Endpoint */}
          {settings.aiModel === 'custom' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-400">
                Custom Endpoint URL
              </h3>
              <input
                type="url"
                value={settings.customEndpoint || ''}
                onChange={(e) =>
                  updateSettings({ customEndpoint: e.target.value })
                }
                className="w-full p-2 bg-[#141517] border border-gray-800 rounded-lg"
                placeholder="https://your-api-endpoint.com"
              />
            </div>
          )}

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400">Temperature</h3>
              <span className="text-sm text-gray-400">
                {settings.temperature.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                updateSettings({ temperature: parseFloat(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>More Focused</span>
              <span>More Creative</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm hover:bg-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-sm hover:bg-blue-700 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
