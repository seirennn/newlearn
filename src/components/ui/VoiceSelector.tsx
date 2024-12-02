import React from 'react';
import { CustomVoice } from '@/utils/voiceService';
import { X } from 'lucide-react';

interface VoiceSelectorProps {
  voices: CustomVoice[];
  selectedVoice: CustomVoice | null;
  onVoiceChange: (voice: CustomVoice) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  onClose: () => void;
}

export function VoiceSelector({
  voices,
  selectedVoice,
  onVoiceChange,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  onClose
}: VoiceSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 bg-neutral-900 rounded-xl shadow-xl border border-neutral-800 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-200">Voice Settings</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-300">
                Voice
              </label>
              <select
                value={selectedVoice?.id || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.id === e.target.value);
                  if (voice) onVoiceChange(voice);
                }}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 focus:border-blue-500 focus:outline-none"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-300">
                Speed
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => onRateChange(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-neutral-400">
                <span>0.5x</span>
                <span>{rate}x</span>
                <span>2x</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-300">
                Pitch
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-neutral-400">
                <span>0.5x</span>
                <span>{pitch}x</span>
                <span>2x</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-800/50 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
