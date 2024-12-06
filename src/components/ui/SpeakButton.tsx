import React, { useState, useEffect } from 'react';
import { Volume2, Settings2, Square } from 'lucide-react';
import { VoiceSelector } from '@/components/ui/VoiceSelector';
import { Button } from '@/components/ui/button';
import { loadVoices, speakText, stopSpeaking, CustomVoice } from '@/utils/voiceService';

interface SpeakButtonProps {
  text: string;
  className?: string;
}

export function SpeakButton({ text, className = '' }: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [voices, setVoices] = useState<CustomVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<CustomVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    const initVoices = async () => {
      try {
        const availableVoices = await loadVoices();
        setVoices(availableVoices);
        
        // Select the first voice by default
        if (availableVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(availableVoices[0]);
        }
      } catch (error) {
        console.error('Failed to load voices:', error);
      }
    };

    initVoices();
  }, [selectedVoice]);

  const handleSpeak = async () => {
    if (!selectedVoice || !text) return;

    setIsSpeaking(true);
    try {
      await speakText(text, selectedVoice, rate, pitch);
    } catch (error) {
      console.error('Speech failed:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={isSpeaking ? handleStop : handleSpeak}
          disabled={!selectedVoice}
          className={className}
          title={isSpeaking ? "Stop speaking" : "Start speaking"}
        >
          {isSpeaking ? (
            <Square className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowVoiceSelector(true)}
          className={className}
          title="Voice settings"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      {showVoiceSelector && (
        <VoiceSelector
          voices={voices}
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          rate={rate}
          onRateChange={setRate}
          pitch={pitch}
          onPitchChange={setPitch}
          onClose={() => setShowVoiceSelector(false)}
        />
      )}
    </>
  );
}
