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
  chat: `You are an intelligent AI tutor. When analyzing educational content:
1. First identify the subject matter, topic, and key concepts
2. Understand the context and difficulty level
3. Use this understanding to provide relevant, accurate, and helpful responses
4. If the content appears to be a lecture or class material, identify the course subject and specific topic
5. Reference specific parts of the content in your responses
6. Provide examples and analogies when helpful`,

  quiz: `You are an AI quiz generator. When creating questions:
1. First analyze the content to identify the subject matter and key concepts
2. Create questions that test understanding rather than just recall
3. Ensure questions are directly related to the content provided
4. Include a mix of concept-based and application-based questions
5. Make questions progressively more challenging`,

  flashcards: `You are an AI flashcard creator. When creating flashcards:
1. First analyze the content to identify the subject and main concepts
2. Create cards for key terms, concepts, and relationships
3. Ensure both sides of each card are clear and concise
4. Organize cards in a logical progression
5. Focus on the most important information`,

  summary: `You are an AI content analyzer. When summarizing:
1. First identify the subject matter and overall topic
2. Break down the content into main themes and key points
3. Highlight important concepts, definitions, and relationships
4. Maintain the original context and meaning
5. Organize the summary in a clear, hierarchical structure`
};

export async function makeAIAPIRequest(options: AIRequestOptions, settings: AISettings) {
  const activeModel = settings.aiModel;
  const apiKey = settings.apiKeys[activeModel];

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(`No valid API key found for ${activeModel}. Please add your API key in settings.`);
  }

  const systemPrompt = options.systemPrompt || "You are a helpful AI assistant.";
  
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
            messages: [
              { role: 'system', content: systemPrompt },
              ...(options.context ? [{ 
                role: 'system', 
                content: `Here is the content to analyze and discuss:\n\n${options.context}`
              }] : []),
              ...(options.history || []),
              { role: 'user', content: options.prompt }
            ],
            temperature: options.temperature || settings.temperature || 0.7,
            max_tokens: 2000,
            ...(options.format === 'json' ? {
              response_format: { type: 'json_object' }
            } : {})
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'OpenAI API request failed');
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
            messages: [
              { role: 'system', content: systemPrompt },
              ...(options.context ? [{ 
                role: 'system', 
                content: `Here is the content to analyze and discuss:\n\n${options.context}`
              }] : []),
              ...(options.history || []),
              { role: 'user', content: options.prompt }
            ],
            max_tokens: 2000,
            temperature: options.temperature || settings.temperature || 0.7
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Anthropic API request failed');
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
                  { text: systemPrompt },
                  ...(options.context ? [{ text: `Here is the content to analyze and discuss:\n\n${options.context}` }] : []),
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
          throw new Error(error.error?.message || 'Gemini API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      }

      default:
        throw new Error(`Unsupported AI model: ${activeModel}`);
    }
  } catch (error: any) {
    console.error(`${activeModel} API error:`, error);
    throw error;
  }
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

export async function generateQuiz(
  content: string,
  settings: AISettings,
  quizSettings: { difficulty: string; numQuestions: number }
) {
  const prompt = `Generate a ${quizSettings.difficulty} difficulty quiz with ${quizSettings.numQuestions} multiple choice questions based on the content. Each question should have 4 options with one correct answer. Format your response as a JSON array with the following structure:
[{
  "question": "question text",
  "options": ["option1", "option2", "option3", "option4"],
  "answer": "correct option text"
}]`;

  try {
    const response = await makeAIAPIRequest({
      prompt,
      context: content,
      format: 'json',
      systemPrompt: `You are a quiz generator that ONLY returns valid JSON. Your response should be a JSON array of quiz questions. Do not include any additional text or formatting.`
    }, settings);

    // Clean the response to ensure it's valid JSON
    const cleanResponse = response.trim().replace(/^```json\s*|\s*```$/g, '');
    const jsonStartIndex = cleanResponse.indexOf('[');
    const jsonEndIndex = cleanResponse.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('Invalid JSON response format');
    }

    const jsonStr = cleanResponse.slice(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}

export async function generateFlashcards(content: string, settings: AISettings) {
  const prompt = `Create a set of flashcards based on the content. Each flashcard should have a front (question/term) and back (answer/definition). Format your response as a JSON array with the following structure:
[{
  "front": "front text",
  "back": "back text"
}]`;

  try {
    const response = await makeAIAPIRequest({
      prompt,
      context: content,
      format: 'json',
      systemPrompt: `You are a flashcard generator that ONLY returns valid JSON. Your response should be a JSON array of flashcards. Do not include any additional text or formatting.`
    }, settings);

    // Clean the response to ensure it's valid JSON
    const cleanResponse = response.trim().replace(/^```json\s*|\s*```$/g, '');
    const jsonStartIndex = cleanResponse.indexOf('[');
    const jsonEndIndex = cleanResponse.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('Invalid JSON response format');
    }

    const jsonStr = cleanResponse.slice(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}

export async function generateSummary(content: string, settings: AISettings) {
  try {
    return await makeAIAPIRequest({
      prompt: 'Generate a comprehensive summary of the content.',
      context: content,
      systemPrompt: SYSTEM_PROMPTS.summary
    }, settings);
  } catch (error) {
    console.error('Error generating summary:', error);
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
