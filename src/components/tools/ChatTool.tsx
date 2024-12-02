'use client';

import { useState, useEffect, useRef } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useTools } from '@/contexts/ToolsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { makeAIRequest } from '@/utils/api';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { CopyButton } from '@/components/ui/CopyButton';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatTool() {
  const { content, contentType } = useContent();
  const { toolStates, updateToolState, clearToolState } = useTools();
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>(toolStates.chat || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear chat when switching content type
  useEffect(() => {
    clearToolState('chat');
    setMessages([]);
  }, [contentType, clearToolState]);

  // Update tool state when messages change
  useEffect(() => {
    if (messages.length > 0) {
      updateToolState('chat', messages);
    }
  }, [messages, updateToolState]);

  const getSystemPrompt = () => {
    switch (contentType) {
      case 'pdf':
        return "You are analyzing a PDF document. Help the user understand the content, answer questions, and provide insights about the PDF. Base your responses only on the content provided.";
      case 'youtube':
        return "You are analyzing a YouTube video transcript that has been provided to you. The transcript contains the title, URL, and full text content of the video. Help the user understand the video content, answer questions, and provide insights about the video. Base your responses only on the transcript content that has been provided to you or relevant to the topics of the video.";
      default:
        return "You are analyzing text content. Help the user understand the content, answer questions, and provide insights about the text. Base your responses only on the content provided.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !content) return;

    const newMessages = [
      ...messages,
      { role: 'user' as const, content: input }
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Add initial context message if this is the first message
      const contextualizedMessages = messages.length === 0 ? [
        { role: 'system' as const, content: `Content type: ${contentType}. Here is the content to analyze:\n\n${content}` },
        ...newMessages
      ] : newMessages;

      const response = await makeAIRequest('chat', {
        prompt: input,
        context: content,
        systemPrompt: getSystemPrompt(),
        history: contextualizedMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }, {
        apiKeys: settings.apiKeys,
        aiModel: settings.aiModel,
        temperature: settings.temperature
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I apologize, but I encountered an error while processing your request. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (!content) {
      return "Please load some content first...";
    }
    switch (contentType) {
      case 'pdf':
        return "Ask questions about the PDF...";
      case 'youtube':
        return "Ask questions about the video...";
      default:
        return "Ask questions about the text...";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-neutral-800 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <MessageSquare className="w-5 h-5 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-2">
                  <ReactMarkdown className="prose prose-invert max-w-none">
                    {message.content}
                  </ReactMarkdown>
                </div>
                <CopyButton text={message.content} />
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={isLoading || !content}
            className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !content}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
