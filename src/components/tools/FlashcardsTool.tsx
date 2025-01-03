import { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings, AIModel } from '@/contexts/SettingsContext';
import { generateFlashcards } from '@/utils/api';
import { Loader2, Brain, ChevronLeft, ChevronRight, Redo } from 'lucide-react';
import { cn } from '@/lib/utils';

type Flashcard = {
  front: string;
  back: string;
};

type AISettings = {
  apiKeys: {
    gemini: string;
  };
  aiModel: AIModel;
  temperature: number;
  maxTokens: number;
};

export function FlashcardsTool() {
  const { content } = useContent();
  const { settings } = useSettings();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCards = async () => {
    if (!content?.trim()) {
      setError('Please provide some content first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      // Convert settings to AISettings
      const aiSettings: AISettings = {
        apiKeys: {
          gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
        },
        aiModel: (settings.aiModel ?? 'gemini') as AIModel,
        temperature: settings.temperature ?? 0.7,
        maxTokens: 2000
      };

      const response = await generateFlashcards(content, aiSettings);
      let newCards;
      
      try {
        // Try to parse the response, handling both string and object responses
        newCards = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (parseError) {
        console.error('Failed to parse flashcards response:', parseError);
        throw new Error('Invalid response format from AI. Please try again.');
      }
      
      // Validate the response format
      if (!Array.isArray(newCards) || newCards.length === 0) {
        throw new Error('No flashcards were generated. Please try again.');
      }

      // Ensure each card has the required properties and sanitize the data
      const validatedCards = newCards.map((card, index) => {
        if (!card || typeof card !== 'object') {
          throw new Error(`Invalid flashcard format at index ${index}`);
        }
        
        const front = card.front?.toString().trim();
        const back = card.back?.toString().trim();
        
        if (!front || !back) {
          throw new Error(`Missing content in flashcard at index ${index}`);
        }
        
        return { front, back };
      });

      setCards(validatedCards);
    } catch (err) {
      console.error('Flashcard generation error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to generate flashcards. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-4 mx-auto" />
            <p className="text-neutral-400">Generating flashcards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleGenerateCards}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">Generate Flashcards</h3>
            <p className="text-neutral-400 text-center max-w-sm mb-6">
              Create AI-powered flashcards to help you study effectively
            </p>
            <button
              onClick={handleGenerateCards}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors"
            >
              Generate Flashcards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "p-2 rounded-lg transition-colors",
              currentIndex === 0
                ? "text-neutral-600 cursor-not-allowed"
                : "text-white hover:bg-neutral-800"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-neutral-400">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className={cn(
              "p-2 rounded-lg transition-colors",
              currentIndex === cards.length - 1
                ? "text-neutral-600 cursor-not-allowed"
                : "text-white hover:bg-neutral-800"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 relative perspective-1000">
          <div
            className={cn(
              "absolute inset-0 cursor-pointer transition-transform duration-500 transform-gpu preserve-3d",
              isFlipped ? "rotate-y-180" : ""
            )}
            onClick={handleFlip}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full bg-neutral-900 rounded-xl p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl text-white text-center">
                    {cards[currentIndex].front}
                  </p>
                </div>
                <div className="text-sm text-neutral-500 text-center">
                  Click to flip
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="h-full bg-neutral-800 rounded-xl p-8 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl text-white text-center">
                    {cards[currentIndex].back}
                  </p>
                </div>
                <div className="text-sm text-neutral-500 text-center">
                  Click to flip back
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleGenerateCards}
          className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-900 transition-colors flex items-center justify-center gap-2"
        >
          <Redo className="w-4 h-4" />
          Generate New Cards
        </button>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
