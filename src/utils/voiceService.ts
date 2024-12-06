export interface CustomVoice {
  id: string;
  name: string;
  lang: string;
  type: 'system';
}

let speechSynthesis: SpeechSynthesis;
let voices: SpeechSynthesisVoice[] = [];

// List of allowed voices in preferred order
const ALLOWED_VOICES = ['Samantha', 'Daniel', 'Kyoko', 'Karen'];

if (typeof window !== 'undefined') {
  speechSynthesis = window.speechSynthesis;
}

export const loadVoices = async (): Promise<CustomVoice[]> => {
  if (typeof window === 'undefined') return [];

  // Wait for voices to be loaded
  if (speechSynthesis.getVoices().length === 0) {
    await new Promise<void>((resolve) => {
      speechSynthesis.addEventListener('voiceschanged', () => resolve(), { once: true });
    });
  }

  voices = speechSynthesis.getVoices();
  
  // Filter for allowed voices and map to our format
  const filteredVoices = voices
    .filter(voice => ALLOWED_VOICES.some(allowed => 
      voice.name.includes(allowed) || voice.voiceURI.includes(allowed)
    ))
    .map(voice => ({
      id: voice.voiceURI,
      name: voice.name,
      lang: voice.lang,
      type: 'system' as const
    }));

  // Sort voices to match ALLOWED_VOICES order
  return filteredVoices.sort((a, b) => {
    const aIndex = ALLOWED_VOICES.findIndex(name => a.name.includes(name));
    const bIndex = ALLOWED_VOICES.findIndex(name => b.name.includes(name));
    return aIndex - bIndex;
  });
};

export const speakText = async (
  text: string,
  voice: CustomVoice,
  rate: number = 1,
  pitch: number = 1
): Promise<void> => {
  if (!text || typeof window === 'undefined') return;

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Find the matching system voice
  const systemVoice = voices.find(v => v.voiceURI === voice.id);
  if (!systemVoice) {
    throw new Error('Selected voice not found');
  }

  utterance.voice = systemVoice;
  utterance.rate = rate;
  utterance.pitch = pitch;

  return new Promise((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error('Speech synthesis failed'));
    speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined') {
    speechSynthesis.cancel();
  }
};

// Initialize voices when the module loads
if (typeof window !== 'undefined') {
  loadVoices().catch(console.error);
}
