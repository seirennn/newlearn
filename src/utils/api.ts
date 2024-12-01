import { AIModel } from '@/contexts/SettingsContext';

interface AIRequestOptions {
  prompt: string;
  context?: string;
  temperature?: number;
  format?: 'json' | 'text';
  systemPrompt?: string;
}

interface AISettings {
  aiModel: AIModel;
  apiKey: string;
  customEndpoint?: string;
  temperature: number;
}

async function makeAIRequest(endpoint: string, options: AIRequestOptions, settings: AISettings) {
  if (!options.context && !options.prompt) {
    throw new Error('No content provided for AI request');
  }

  console.log('Making AI request:', {
    endpoint,
    contentLength: (options.context?.length || 0) + (options.prompt?.length || 0),
    model: settings.aiModel
  });

  let apiUrl: string;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  let body: any;

  const combinedContent = options.context 
    ? `Content for context:\n${options.context}\n\nUser request:\n${options.prompt}`
    : options.prompt;

  const systemPrompt = options.systemPrompt || 'You are a helpful AI tutor. When given content for context, use it to provide relevant and specific answers.';

  switch (settings.aiModel) {
    case 'openai':
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${settings.apiKey}`;
      body = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: combinedContent }
        ],
        temperature: options.temperature || settings.temperature,
      };
      break;

    case 'gemini':
      apiUrl = settings.customEndpoint || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      headers['x-goog-api-key'] = settings.apiKey;
      body = {
        contents: [{
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${combinedContent}` }]
        }],
        generationConfig: {
          temperature: options.temperature || settings.temperature,
        },
      };
      break;

    default:
      throw new Error(`Unsupported AI model: ${settings.aiModel}`);
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI request failed: ${error}`);
    }

    const data = await response.json();
    let result = '';
    
    if (settings.aiModel === 'openai') {
      result = data.choices[0].message.content;
    } else {
      result = data.candidates[0].content.parts[0].text;
    }

    if (options.format === 'json') {
      try {
        // Remove any markdown code block markers if present
        const cleanJson = result.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
        throw new Error('Failed to parse AI response as JSON. Please try again.');
      }
    }

    return result;
  } catch (error) {
    console.error('AI request error:', error);
    throw error;
  }
}

export async function chatWithAI(messages: { role: string; content: string }[], settings: AISettings, contentContext?: string) {
  const lastMessage = messages[messages.length - 1];
  
  return await makeAIRequest('chat', {
    prompt: lastMessage.content,
    context: contentContext,
    temperature: 0.7,
  }, settings);
}

export async function generateQuiz(content: string, settings: AISettings, quizSettings: { difficulty: string; numQuestions: number }) {
  const systemPrompt = 'You are an expert quiz generator. Create clear, engaging multiple-choice questions that test understanding of the provided content.';
  const prompt = `Generate a ${quizSettings.difficulty} difficulty quiz with ${quizSettings.numQuestions} questions based on the following content. For each question:
1. Create a clear, specific question that tests understanding
2. Provide 4 distinct answer options
3. Indicate the correct answer (as index 0-3)
4. Include a brief explanation of why the answer is correct

Format the response as a JSON array with this structure:
[{
  "question": "Question text",
  "options": ["Option 1 text", "Option 2 text", "Option 3 text", "Option 4 text"],
  "correctAnswer": 0,
  "explanation": "Explanation text"
}]

Make sure each question:
- Is directly related to the content
- Has clearly distinct options
- Has only one correct answer (indicated by index 0-3)
- Includes a helpful explanation`;

  const response = await makeAIRequest('quiz', {
    prompt,
    context: content,
    temperature: 0.3,
    format: 'json',
    systemPrompt,
  }, settings);

  // Ensure the response is in the correct format
  if (Array.isArray(response)) {
    return response.map(q => ({
      ...q,
      // Convert options object to array if needed
      options: Array.isArray(q.options) ? q.options : 
        q.options && typeof q.options === 'object' ? 
          Object.values(q.options) : [],
      // Convert letter answer to number if needed
      correctAnswer: typeof q.correctAnswer === 'string' ? 
        q.correctAnswer.charCodeAt(0) - 65 : // Convert 'A' to 0, 'B' to 1, etc.
        q.correctAnswer
    }));
  }

  throw new Error('Invalid quiz response format');
}

export async function generateFlashcards(content: string, settings: AISettings) {
  const systemPrompt = 'You are an expert at creating educational flashcards. Create clear, focused cards that help users learn and remember key concepts.';
  const prompt = `Create a comprehensive set of flashcards based on the following content. For each important concept:
1. Write a clear, specific question or prompt for the front
2. Provide a concise but complete answer for the back

Format the response as a JSON array with this structure:
[{
  "front": "Question or prompt text",
  "back": "Answer or explanation text"
}]

Guidelines:
- Focus on key concepts, definitions, and relationships
- Make each card self-contained and meaningful
- Use clear, precise language
- Cover all important points from the content
- Create at least 5 cards, but no more than 15
- Ensure front and back are properly paired`;

  return await makeAIRequest('flashcards', {
    prompt,
    context: content,
    temperature: 0.3,
    format: 'json',
    systemPrompt,
  }, settings);
}

export async function generateSummary(content: string, settings: AISettings) {
  const systemPrompt = 'You are an expert at summarizing content. Create clear, well-structured summaries that capture the essential points while maintaining readability.';
  const prompt = `Create a comprehensive yet concise summary of the following content. The summary should:

1. Capture all key points and main ideas
2. Maintain a logical flow and structure
3. Be easy to understand
4. Include important details and examples
5. Be well-organized with clear sections

Format the summary with:
- Clear paragraphs
- Bullet points for key items
- Section headings if needed
- Proper transitions between ideas`;

  return await makeAIRequest('summary', {
    prompt,
    context: content,
    temperature: 0.3,
    systemPrompt,
  }, settings);
}
