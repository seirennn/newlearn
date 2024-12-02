import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeakButtonProps {
  text: string;
  className?: string;
}

export function SpeakButton({ text, className }: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.onend = () => setIsSpeaking(false);
    setUtterance(newUtterance);

    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const handleSpeak = () => {
    if (!utterance) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={cn(
        "p-2 rounded-lg transition-colors",
        isSpeaking
          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white",
        className
      )}
      title={isSpeaking ? "Stop Reading" : "Read Aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
}
