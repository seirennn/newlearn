import { Voice, VoiceSettings } from 'elevenlabs-node';

export interface CustomVoice {
  id: string;
  name: string;
  type: 'system' | 'elevenlabs';
  voice: SpeechSynthesisVoice | Voice;
  gender?: 'male' | 'female';
}

// Your ElevenLabs API key - store this in an environment variable
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

// Initialize ElevenLabs client
let elevenLabsVoices: Record<string, Voice | null> = {};

// ElevenLabs voice IDs
const ELEVEN_VOICES = {
  adam: {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam (Natural)',
    gender: 'male'
  },
  rachel: {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel (Natural)',
    gender: 'female'
  }
};

// Clean text by removing markdown symbols and normalizing whitespace
function cleanText(text: string): string {
  return text
    .replace(/[#*`]/g, '') // Remove markdown symbols
    .replace(/\n\n+/g, '\n') // Replace multiple newlines with single
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export async function getAvailableVoices(): Promise<CustomVoice[]> {
  // Get system voices
  let systemVoices = window.speechSynthesis.getVoices();
  
  // If voices are not loaded yet, wait for them
  if (systemVoices.length === 0) {
    systemVoices = await new Promise((resolve) => {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    });
  }
  
  // Filter only the specified system voices
  const allowedVoiceNames = ['Daniel', 'Karen', 'Kyoko'];
  const filteredSystemVoices = systemVoices
    .filter(voice => allowedVoiceNames.some(name => 
      voice.name.toLowerCase().includes(name.toLowerCase())
    ))
    .map(voice => ({
      id: voice.name,
      name: voice.name,
      type: 'system' as const,
      voice: voice
    }));

  // Add ElevenLabs voices
  const customVoices: CustomVoice[] = [
    ...Object.entries(ELEVEN_VOICES).map(([key, config]) => ({
      id: key,
      name: config.name,
      type: 'elevenlabs' as const,
      voice: null,
      gender: config.gender
    })),
    ...filteredSystemVoices
  ];

  // Sort voices: natural male voices first, then natural female voices, then system voices
  return customVoices.sort((a, b) => {
    if (a.type === 'elevenlabs' && b.type === 'elevenlabs') {
      if (a.gender === 'male' && b.gender !== 'male') return -1;
      if (a.gender !== 'male' && b.gender === 'male') return 1;
    }
    if (a.type === 'elevenlabs' && b.type !== 'elevenlabs') return -1;
    if (a.type !== 'elevenlabs' && b.type === 'elevenlabs') return 1;
    return 0;
  });
}

export async function speak(text: string, voice: CustomVoice, rate: number = 1, pitch: number = 1) {
  if (!text) {
    console.warn('No text provided for speech');
    return;
  }

  // Clean the text before speaking
  const cleanedText = cleanText(text);
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (voice.type === 'system') {
    return new Promise<void>((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.voice = voice.voice as SpeechSynthesisVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error('Speech synthesis failed'));
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  } else if (voice.type === 'elevenlabs') {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const voiceId = ELEVEN_VOICES[voice.id as keyof typeof ELEVEN_VOICES]?.id;
    if (!voiceId) {
      throw new Error('Invalid ElevenLabs voice selected');
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: cleanedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
            speaking_rate: rate
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.detail || 
          `Failed to generate speech (${response.status})`
        );
      }

      const audioBlob = await response.blob();
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty audio response');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Failed to play audio'));
        };
        
        // Start playing
        audio.play().catch(error => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error with ElevenLabs TTS:', message);
      throw new Error(`Speech generation failed: ${message}`);
    }
  }
}
