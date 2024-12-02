import { AIModel } from '@/contexts/SettingsContext';

interface AIRequestOptions {
  prompt: string;
  context?: string;
  temperature?: number;
  format?: 'json' | 'text';
  systemPrompt?: string;
  history?: any[];
}

interface AISettings {
  apiKeys: {
    anthropic?: string;
    openai?: string;
    gemini?: string;
  };
  aiModel: AIModel;
  temperature: number;
}

const SYSTEM_PROMPTS = {
  chat: `You are an intelligent AI tutor analyzing educational content. For YouTube videos:
1. The content includes the video title, URL, and complete transcript
2. Base all responses on the transcript content provided
3. Reference specific parts of the transcript in your answers
4. Identify and explain key concepts from the video
5. Provide examples and clarifications when needed
6. Help users understand the video content better`,

  quiz: `You are an AI quiz generator. For YouTube video content:
1. The content includes the video title, URL, and complete transcript
2. Create questions that test understanding of the video content
3. Base all questions directly on the transcript provided
4. Include questions about key concepts and important points
5. Reference specific parts of the video transcript
6. Make questions progressively more challenging`,

  flashcards: `You are an AI flashcard creator. For YouTube video content:
1. The content includes the video title, URL, and complete transcript
2. Create flashcards based on the video transcript
3. Focus on key terms, concepts, and ideas from the video
4. Use exact quotes or examples from the transcript when relevant
5. Create comprehensive yet concise cards
6. Organize cards to follow the video's progression`,

  summary: `You are an AI content analyzer. For YouTube video content:
1. The content includes the video title, URL, and complete transcript
2. Provide a clear overview of the video's main topics
3. Break down key points and concepts discussed
4. Use specific examples from the transcript
5. Maintain the video's original context and meaning
6. Create a well-structured, hierarchical summary`
};

// Rate limiting configuration
const RATE_LIMIT = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 60000, // 1 minute
};

// Utility function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Error handling utility
const handleAPIError = (error: any, attempt: number) => {
  const errorMessage = error?.error?.message || error?.message || 'Unknown error';
  const isRateLimit = errorMessage.toLowerCase().includes('rate limit') || 
                     error?.status === 429;
  
  if (isRateLimit && attempt < RATE_LIMIT.maxRetries) {
    const waitTime = Math.min(
      RATE_LIMIT.initialDelay * Math.pow(2, attempt),
      RATE_LIMIT.maxDelay
    );
    return { shouldRetry: true, waitTime };
  }
  
  return { shouldRetry: false, error: new Error(errorMessage) };
};

export async function makeAIAPIRequest(options: AIRequestOptions, settings: AISettings) {
  const activeModel = settings.aiModel;
  const apiKeys = settings.apiKeys || {};
  const apiKey = apiKeys[activeModel];

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(`Please add your ${activeModel.toUpperCase()} API key in settings to use this feature.`);
  }

  // Prepare messages array
  const messages = [];

  // Add system prompt
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  // Add context if available
  if (options.context) {
    // For YouTube content, extract and format the transcript
    if (options.context.includes('[YOUTUBE_TRANSCRIPT_START]')) {
      const transcriptStart = options.context.indexOf('TRANSCRIPT:');
      const transcriptEnd = options.context.indexOf('[YOUTUBE_TRANSCRIPT_END]');
      
      if (transcriptStart !== -1 && transcriptEnd !== -1) {
        const transcript = options.context
          .slice(transcriptStart + 'TRANSCRIPT:'.length, transcriptEnd)
          .trim();

        messages.push({ 
          role: 'system', 
          content: `Here is the video transcript to use as context:\n\n${transcript}`
        });
      }
    } else {
      // For PDF or text content
      messages.push({ 
        role: 'system', 
        content: `Here is the content to use as context:\n\n${options.context}`
      });
    }
  }

  // Add conversation history if available
  if (options.history?.length) {
    messages.push(...options.history);
  }

  // Add the main prompt
  messages.push({ role: 'user', content: options.prompt });

  let attempt = 0;
  const maxRetries = 3;
  
  while (attempt < maxRetries) {
    try {
      let response;
      
      switch (activeModel) {
        case 'openai': {
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages,
              temperature: options.temperature || 0.3,
              max_tokens: 2000,
              response_format: options.format === 'json' ? { type: 'json_object' } : undefined
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
          }

          const data = await response.json();
          const content = data.choices[0].message.content;

          // For JSON responses, validate the format
          if (options.format === 'json') {
            try {
              JSON.parse(content); // Validate JSON format
              return content;
            } catch (e) {
              throw new Error('Invalid JSON response from API');
            }
          }

          return content;
        }

        case 'gemini': {
          response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
              contents: [{
                role: 'user',
                parts: [{ text: messages.map(m => m.content).join('\n\n') }]
              }],
              generationConfig: {
                temperature: options.temperature || 0.3,
                maxOutputTokens: 2000,
                topK: 1,
                topP: 0.8
              }
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
          }

          const data = await response.json();
          const content = data.candidates[0].content.parts[0].text;

          // For JSON responses, validate the format
          if (options.format === 'json') {
            try {
              JSON.parse(content); // Validate JSON format
              return content;
            } catch (e) {
              throw new Error('Invalid JSON response from API');
            }
          }

          return content;
        }

        default:
          throw new Error(`Unsupported AI model: ${activeModel}`);
      }
    } catch (error) {
      console.error(`API request failed (attempt ${attempt + 1}/${maxRetries}):`, error);
      
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        attempt++;
        continue;
      }
      
      throw error;
    }
  }

  throw new Error('Maximum retries exceeded');
}

export async function makeAIRequest(
  type: 'quiz' | 'flashcards' | 'summary' | 'chat',
  data: any,
  settings: AISettings
) {
  // Add JSON format requirement to system prompt
  if (data.format === 'json') {
    data.systemPrompt = `${data.systemPrompt}\n\nIMPORTANT: You MUST respond with ONLY a valid JSON object. Do not include any other text, markdown, or explanations in your response. The response must be parseable by JSON.parse().`;
    data.temperature = 0.3; // Lower temperature for more consistent JSON
  }

  const response = await makeAIAPIRequest(data, settings);

  // For JSON responses, try to ensure valid JSON
  if (data.format === 'json') {
    try {
      // Try to parse the response
      JSON.parse(response);
      return response;
    } catch (e) {
      // If parsing fails, try to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          JSON.parse(jsonMatch[0]);
          return jsonMatch[0];
        } catch (e2) {
          throw new Error('Failed to parse JSON response');
        }
      }
      throw new Error('No valid JSON found in response');
    }
  }

  return response;
}

export async function generateSummary(content: string, settings: AISettings & { systemPrompt?: string, contentType?: string }) {
  try {
    console.log('Generating summary with settings:', {
      contentType: settings.contentType,
      hasSystemPrompt: !!settings.systemPrompt,
      contentLength: content.length
    });

    const response = await makeAIRequest('summary', {
      prompt: 'Generate a comprehensive summary of this content.',
      context: content,
      systemPrompt: settings.systemPrompt,
      format: 'text'
    }, settings);

    return response;
  } catch (error) {
    console.error('Error in generateSummary:', error);
    throw error;
  }
}

export async function generateQuiz(content: string, settings: AISettings, quizSettings: { difficulty: string; numQuestions: number }) {
  const systemPrompt = `You are creating a quiz based on the provided content. Generate a JSON response in this EXACT format:

{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

REQUIREMENTS:
1. Generate ${quizSettings.numQuestions} questions
2. Difficulty level: ${quizSettings.difficulty}
3. Each question must have exactly 4 options
4. correctAnswer must be 0-3 (index of correct option)
5. Include clear explanations
6. Make all options plausible
7. Ensure the response is VALID JSON
8. Do not include any text outside the JSON object`;

  try {
    // First attempt with standard settings
    try {
      const response = await makeAIRequest('quiz', {
        prompt: `Generate a ${quizSettings.difficulty} quiz with ${quizSettings.numQuestions} questions. Return ONLY a JSON object.`,
        context: content,
        systemPrompt,
        format: 'json',
        temperature: 0.3
      }, settings);

      const parsed = JSON.parse(response);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
    } catch (e) {
      console.log('First attempt failed, trying with modified prompt...');
    }

    // Second attempt with more explicit prompt
    const response = await makeAIRequest('quiz', {
      prompt: `Create a quiz with ${quizSettings.numQuestions} ${quizSettings.difficulty} questions and format the response as a JSON object with a "questions" array. Each question should have "question", "options" (array of 4 strings), "correctAnswer" (0-3), and "explanation" properties. Do not include any text outside the JSON.`,
      context: content,
      systemPrompt,
      format: 'json',
      temperature: 0.2
    }, settings);

    // Try to parse and validate the response
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch (e) {
      // Try to extract JSON if parsing fails
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error('Could not find valid JSON in response');
      }
      parsed = JSON.parse(match[0]);
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format: missing questions array');
    }

    // Validate and clean the questions
    const validatedQuestions = parsed.questions
      .filter(q => (
        q && 
        typeof q === 'object' && 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3 &&
        q.explanation
      ))
      .map(q => ({
        question: String(q.question).trim(),
        options: q.options.map(opt => String(opt).trim()),
        correctAnswer: Number(q.correctAnswer),
        explanation: String(q.explanation).trim()
      }));

    if (validatedQuestions.length === 0) {
      throw new Error('No valid questions were generated');
    }

    return validatedQuestions;
  } catch (error) {
    console.error('Error in generateQuiz:', error);
    throw new Error('Failed to generate quiz. Please try again.');
  }
}

export async function generateFlashcards(content: string, settings: AISettings) {
  const systemPrompt = `You are creating flashcards based on the provided content. Generate a JSON response in this EXACT format:

{
  "flashcards": [
    {
      "front": "Question or concept",
      "back": "Answer or explanation"
    }
  ]
}

REQUIREMENTS:
1. Generate at least 10 flashcards
2. Each flashcard must have a front and back
3. Front should be a question or key concept
4. Back should be a clear, concise answer or explanation
5. Cover the main topics from the content
6. Make cards clear and focused
7. Ensure the response is VALID JSON
8. Do not include any text outside the JSON object`;

  try {
    // First attempt with standard settings
    try {
      const response = await makeAIRequest('flashcards', {
        prompt: 'Create flashcards from this content. Return ONLY a JSON object.',
        context: content,
        systemPrompt,
        format: 'json',
        temperature: 0.3
      }, settings);

      const parsed = JSON.parse(response);
      if (parsed.flashcards && Array.isArray(parsed.flashcards)) {
        return parsed.flashcards;
      }
    } catch (e) {
      console.log('First attempt failed, trying with modified prompt...');
    }

    // Second attempt with more explicit prompt
    const response = await makeAIRequest('flashcards', {
      prompt: 'Create flashcards and format the response as a JSON object with a "flashcards" array containing objects with "front" and "back" properties. Do not include any text outside the JSON.',
      context: content,
      systemPrompt,
      format: 'json',
      temperature: 0.2
    }, settings);

    // Try to parse and validate the response
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch (e) {
      // Try to extract JSON if parsing fails
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error('Could not find valid JSON in response');
      }
      parsed = JSON.parse(match[0]);
    }

    if (!parsed.flashcards || !Array.isArray(parsed.flashcards)) {
      throw new Error('Invalid response format: missing flashcards array');
    }

    // Validate and clean the flashcards
    const validatedCards = parsed.flashcards
      .filter(card => card && typeof card === 'object' && card.front && card.back)
      .map(card => ({
        front: String(card.front).trim(),
        back: String(card.back).trim()
      }));

    if (validatedCards.length === 0) {
      throw new Error('No valid flashcards were generated');
    }

    return validatedCards;
  } catch (error) {
    console.error('Error in generateFlashcards:', error);
    throw new Error('Failed to generate flashcards. Please try again.');
  }
}

export async function chatWithAI(messages: any[], settings: AISettings, content: string) {
  try {
    const lastMessage = messages[messages.length - 1];
    const response = await makeAIAPIRequest({
      prompt: lastMessage.content,
      context: content,
      systemPrompt: SYSTEM_PROMPTS.chat,
      history: messages.slice(0, -1)
    }, settings);

    return response;
  } catch (error) {
    console.error('Error in chatWithAI:', error);
    throw error;
  }
}
