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
  const apiKey = settings.apiKeys[activeModel];

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(`No valid API key found for ${activeModel}. Please add your API key in settings.`);
  }

  // Debug log incoming request
  console.log('AI Request Debug:', {
    hasContext: !!options.context,
    contextLength: options.context?.length,
    isYouTube: options.context?.includes('[YOUTUBE_TRANSCRIPT_START]')
  });

  // Handle YouTube content
  let finalSystemPrompt = options.systemPrompt || "You are a helpful AI assistant.";
  let finalContext = options.context;

  if (options.context?.includes('[YOUTUBE_TRANSCRIPT_START]')) {
    // Extract transcript content
    const transcriptStart = options.context.indexOf('TRANSCRIPT:');
    const transcriptEnd = options.context.indexOf('[YOUTUBE_TRANSCRIPT_END]');
    
    if (transcriptStart !== -1 && transcriptEnd !== -1) {
      const transcript = options.context
        .slice(transcriptStart + 'TRANSCRIPT:'.length, transcriptEnd)
        .trim();

      // Create focused prompts for YouTube content
      finalSystemPrompt = `You are analyzing a YouTube video transcript. Your responses must be based EXCLUSIVELY on the transcript content provided. Do not add external information.

Instructions:
1. Only use information from the provided transcript
2. Reference specific parts of the transcript in your answers
3. If asked about something not in the transcript, clearly state it's not covered
4. Stay focused on the actual video content`;

      finalContext = `Here is the complete transcript of the video. Base all responses on this content:\n\n${transcript}`;
    }
  }

  // Prepare messages array
  const messages = [
    { role: 'system', content: finalSystemPrompt }
  ];

  if (finalContext) {
    messages.push({ role: 'system', content: finalContext });
  }

  if (options.history?.length) {
    messages.push(...options.history);
  }

  messages.push({ role: 'user', content: options.prompt });

  // Debug log final request
  console.log('Final AI Request:', {
    messageCount: messages.length,
    hasSystemPrompt: !!finalSystemPrompt,
    hasContext: !!finalContext,
    model: activeModel
  });

  let attempt = 0;
  while (attempt < RATE_LIMIT.maxRetries) {
    try {
      switch (activeModel) {
        case 'openai': {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages,
              temperature: options.temperature || settings.temperature || 0.7,
              max_tokens: 2000,
              ...(options.format === 'json' ? {
                response_format: { type: 'json_object' }
              } : {})
            })
          });

          if (!response.ok) {
            const error = await response.json();
            const { shouldRetry, waitTime, error: processedError } = handleAPIError(error, attempt);
            
            if (shouldRetry) {
              console.log(`Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt + 1}/${RATE_LIMIT.maxRetries})`);
              await delay(waitTime);
              attempt++;
              continue;
            }
            
            throw processedError;
          }

          const data = await response.json();
          return data.choices[0].message.content;
        }

        case 'anthropic': {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-2',
              messages,
              max_tokens: 2000,
              temperature: options.temperature || settings.temperature || 0.7
            })
          });

          if (!response.ok) {
            const error = await response.json();
            const { shouldRetry, waitTime, error: processedError } = handleAPIError(error, attempt);
            
            if (shouldRetry) {
              console.log(`Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt + 1}/${RATE_LIMIT.maxRetries})`);
              await delay(waitTime);
              attempt++;
              continue;
            }
            
            throw processedError;
          }

          const data = await response.json();
          return data.content[0].text;
        }

        case 'gemini': {
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: finalSystemPrompt },
                    ...(finalContext ? [{ text: finalContext }] : []),
                    ...(options.history || []).map(msg => ({ text: `${msg.role}: ${msg.content}` })),
                    { text: options.prompt }
                  ]
                }
              ],
              generationConfig: {
                temperature: options.temperature || settings.temperature || 0.7,
                maxOutputTokens: 2000,
                ...(options.format === 'json' ? {
                  candidateCount: 1
                } : {})
              }
            })
          });

          if (!response.ok) {
            const error = await response.json();
            const { shouldRetry, waitTime, error: processedError } = handleAPIError(error, attempt);
            
            if (shouldRetry) {
              console.log(`Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt + 1}/${RATE_LIMIT.maxRetries})`);
              await delay(waitTime);
              attempt++;
              continue;
            }
            
            throw processedError;
          }

          const data = await response.json();
          return data.candidates[0].content.parts[0].text;
        }

        default:
          throw new Error(`Unsupported AI model: ${activeModel}`);
      }
    } catch (error: any) {
      console.error(`${activeModel} API error:`, error);
      const { shouldRetry, waitTime, error: processedError } = handleAPIError(error, attempt);
      
      if (shouldRetry) {
        console.log(`Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt + 1}/${RATE_LIMIT.maxRetries})`);
        await delay(waitTime);
        attempt++;
        continue;
      }
      
      throw processedError;
    }
  }

  throw new Error('Maximum retries exceeded');
}

export async function makeAIRequest(
  type: 'quiz' | 'flashcards' | 'summary' | 'chat',
  data: any,
  settings: AISettings
) {
  try {
    const systemPrompt = data.systemPrompt || SYSTEM_PROMPTS[type];
    const response = await makeAIAPIRequest({
      prompt: data.prompt,
      context: data.context,
      systemPrompt,
      format: data.format,
      temperature: data.temperature,
      history: data.history
    }, settings);

    return response;
  } catch (error) {
    console.error('Error making AI request:', error);
    throw error;
  }
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
  try {
    const systemPrompt = settings.contentType === 'youtube'
      ? `You are creating a quiz based on a YouTube video transcript. Your task is to:
1. Create questions that test understanding of the video content
2. Base all questions EXCLUSIVELY on the transcript provided
3. Include direct references to content from the video
4. Create a mix of question types (multiple choice, true/false, short answer)
5. Focus on key concepts and important details from the video
6. Ensure questions follow the video's progression`
      : SYSTEM_PROMPTS.quiz;

    const response = await makeAIRequest('quiz', {
      prompt: `Generate a ${quizSettings.difficulty} difficulty quiz with ${quizSettings.numQuestions} questions.`,
      context: content,
      systemPrompt,
      format: 'json'
    }, settings);

    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}

export async function generateFlashcards(content: string, settings: AISettings) {
  try {
    const systemPrompt = settings.contentType === 'youtube'
      ? `You are creating flashcards based on a YouTube video transcript. Your task is to:
1. Create flashcards that cover key concepts from the video
2. Use ONLY information present in the transcript
3. Include direct quotes or examples from the video when relevant
4. Follow the video's progression in card ordering
5. Create clear, concise cards that test understanding
6. Focus on the most important points from the video`
      : SYSTEM_PROMPTS.flashcards;

    const response = await makeAIRequest('flashcards', {
      prompt: 'Create a comprehensive set of flashcards for this content.',
      context: content,
      systemPrompt,
      format: 'json'
    }, settings);

    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
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
