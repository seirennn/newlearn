'use client';

import { useState, useEffect, useRef } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useTools } from '@/contexts/ToolsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { makeAIRequest } from '@/utils/api';
import { Loader2, Send } from 'lucide-react';
import { CopyButton } from '@/components/ui/CopyButton';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatTool() {
  const { content, contentType, isTranscriptLoading } = useContent();
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

  useEffect(() => {
    clearToolState('chat');
    setMessages([]);
  }, [contentType, clearToolState]);

  useEffect(() => {
    if (messages.length > 0) {
      updateToolState('chat', messages);
    }
  }, [messages, updateToolState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !content) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await makeAIRequest('chat', {
        prompt: input.trim(),
        context: content,
        history: messages,
        format: 'text'
      }, settings);

      const assistantMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-col h-full" ref={chatContainerRef}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-neutral-800 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.role === 'assistant' && (
                <div className="mt-2 flex justify-end">
                  <CopyButton text={message.content} />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-neutral-800 text-white">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-neutral-800">
        {isTranscriptLoading ? (
          <div className="flex items-center justify-center p-2 text-neutral-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading transcript...</span>
          </div>
        ) : !content ? (
          <div className="flex items-center justify-center p-2 text-neutral-400">
            <span>Load content to start chatting</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the content..."
              disabled={isLoading || !content}
              className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-neutral-700 
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !content || isTranscriptLoading}
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg 
                disabled:opacity-50 disabled:cursor-not-allowed 
                hover:bg-neutral-700 transition-colors
                flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
