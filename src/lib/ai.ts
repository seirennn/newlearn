import OpenAI from 'openai';

export interface AISettings {
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | 'gemini-pro';
  temperature: number;
  maxTokens: number;
}

export const defaultSettings: AISettings = {
  model: 'gemini-pro',
  temperature: 0.7,
  maxTokens: 2000,
};

export function getSettings(): AISettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  const savedSettings = localStorage.getItem('ai_settings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

export function createOpenAIClient() {
  const apiKey = localStorage.getItem('OPENAI_API_KEY') || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) throw new Error('Please configure your OpenAI API key in settings');
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

async function generateWithGemini(prompt: string) {
  const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Please configure your Gemini API key in settings');

  const settings = getSettings();
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: settings.maxTokens,
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate content with Gemini');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function generateWithOpenAI(messages: { role: string; content: string }[]) {
  const openai = createOpenAIClient();
  const settings = getSettings();
  
  const response = await openai.chat.completions.create({
    model: settings.model,
    temperature: settings.temperature,
    max_tokens: settings.maxTokens,
    messages,
  });

  return response.choices[0]?.message?.content;
}

export async function generateFlashcards(text: string): Promise<any[]> {
  const settings = getSettings();
  const prompt = `Extract key concepts from this text and create at least 20 flashcards. For each concept, create a clear and concise question-answer pair. Return the result as a JSON array of objects with 'question' and 'answer' properties. Make sure the language is clear, professional, and easy to understand. Format example:
  [
    {
      "question": "What is photosynthesis?",
      "answer": "The process by which plants convert sunlight into energy, producing oxygen as a byproduct"
    },
    ...
  ]
  Generate at least 20 high-quality flashcards that cover the main concepts comprehensively.`;

  try {
    let content;
    if (settings.model === 'gemini-pro') {
      content = await generateWithGemini(prompt + '\n\nText to process:\n' + text);
    } else {
      content = await generateWithOpenAI([
        { role: 'system', content: 'You are an expert educator creating comprehensive flashcards for studying. Always create at least 20 cards covering key concepts thoroughly.' },
        { role: 'user', content: prompt + '\n\nText to process:\n' + text }
      ]);
    }

    if (!content) throw new Error('No content generated');
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    const cards = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(cards) || cards.length < 20) {
      throw new Error('Not enough flashcards generated. Please try again.');
    }
    return cards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}

export interface QuizOptions {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
}

export async function generateQuizQuestions({ topic, difficulty, numQuestions }: QuizOptions): Promise<any[]> {
  const settings = getSettings();
  const prompt = `Generate ${numQuestions} multiple choice questions about ${topic} at ${difficulty} difficulty level. Format the response as a JSON array of objects with this structure:
  {
    "question": "the question text",
    "options": ["option 1", "option 2", "option 3", "option 4"],
    "correctAnswer": index of correct option (0-3),
    "explanation": "brief explanation of the correct answer"
  }

  Difficulty levels:
  - Easy: Basic concepts and straightforward questions
  - Medium: More complex concepts and some application questions
  - Hard: Advanced concepts, analysis, and challenging application questions

  Make questions challenging but fair for the selected difficulty level. Ensure all options are plausible.`;

  try {
    let content;
    if (settings.model === 'gemini-pro') {
      content = await generateWithGemini(prompt);
    } else {
      content = await generateWithOpenAI([
        { role: 'system', content: `You are an expert educator creating ${difficulty} level quiz questions.` },
        { role: 'user', content: prompt }
      ]);
    }

    if (!content) throw new Error('No content generated');
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    const questions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(questions) || questions.length < numQuestions) {
      throw new Error('Not enough questions generated. Please try again.');
    }
    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
}

export async function generateSummary(text: string): Promise<string> {
  const settings = getSettings();
  const prompt = `Provide a concise summary of the following text, highlighting the main points and key takeaways:\n\n${text}`;

  try {
    if (settings.model === 'gemini-pro') {
      return await generateWithGemini(prompt);
    } else {
      const content = await generateWithOpenAI([
        { role: 'system', content: 'You are an expert at summarizing complex information clearly and concisely.' },
        { role: 'user', content: prompt }
      ]);
      return content || '';
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

export async function generateChatResponse(messages: { role: string; content: string }[]): Promise<string> {
  const settings = getSettings();

  try {
    if (settings.model === 'gemini-pro') {
      // For Gemini, we'll use the last message as the prompt
      const lastMessage = messages[messages.length - 1].content;
      return await generateWithGemini(lastMessage);
    } else {
      const content = await generateWithOpenAI(messages);
      return content || '';
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}
