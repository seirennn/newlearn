import { NextRequest, NextResponse } from 'next/server';
import { makeAIAPIRequest } from '@/utils/api';

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, systemPrompt, history, ...settings } = await req.json();

    // Format messages for the AI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: prompt }
    ];

    // Add context to the prompt
    const fullPrompt = `Context:\n${context}\n\nUser Question: ${prompt}`;
    messages[messages.length - 1].content = fullPrompt;

    // Use the same AI processing as other tools
    const response = await makeAIAPIRequest({
      prompt: fullPrompt,
      context,
      systemPrompt,
      history: messages.slice(0, -1)
    }, settings);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
