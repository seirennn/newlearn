import { useState, useEffect } from 'react';
import { VolumeIcon, CogIcon } from 'lucide-react';
import { CustomVoice, getAvailableVoices, speak } from '@/utils/voiceService';
import { VoiceSelector } from './VoiceSelector';

interface SpeakButtonProps {
  text: string;
}

export function SpeakButton({ text }: SpeakButtonProps) {
  const [voices, setVoices] = useState<CustomVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<CustomVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVoices() {
      try {
        const availableVoices = await getAvailableVoices();
        if (availableVoices.length === 0) {
          throw new Error('No voices available');
        }
        setVoices(availableVoices);
        // Set default voice to first male natural voice, or first available voice
        const defaultVoice = availableVoices.find(v => v.type === 'elevenlabs' && v.gender === 'male') || availableVoices[0];
        setSelectedVoice(defaultVoice);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load voices';
        console.error('Failed to load voices:', message);
        setError('Failed to load voices. Please refresh the page.');
      }
    }
    loadVoices();
  }, []);

  const handleSpeak = async () => {
    if (!selectedVoice || isPlaying) return;
    
    setIsPlaying(true);
    setError(null);
    
    try {
      if (!text.trim()) {
        throw new Error('No text to speak');
      }
      await speak(text, selectedVoice, rate, pitch);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate speech';
      setError(message);
      console.error('Error speaking:', message);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <button
          onClick={handleSpeak}
          disabled={!selectedVoice || isPlaying}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
            ${error ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
              isPlaying ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' :
              'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
          title={error || undefined}
        >
          {isPlaying ? (
            <>
              <VolumeIcon className="w-4 h-4 animate-pulse" />
              Speaking...
            </>
          ) : (
            <>
              <VolumeIcon className="w-4 h-4" />
              {error ? 'Retry' : 'Speak'}
            </>
          )}
        </button>

        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800"
        >
          <CogIcon className="w-4 h-4" />
        </button>
      </div>

      {showSettings && (
        <VoiceSelector
          voices={voices}
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          rate={rate}
          onRateChange={setRate}
          pitch={pitch}
          onPitchChange={setPitch}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
