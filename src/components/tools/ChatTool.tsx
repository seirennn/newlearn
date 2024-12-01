import { useState, useRef, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useSettings } from '@/contexts/SettingsContext';
import { chatWithAI } from '@/utils/api';
import { Loader2, Send, MessageSquare } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatTool() {
  const { content } = useContent();
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await chatWithAI([
        ...messages,
        newMessage
      ], settings, content);

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (messages.length === 0) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <MessageSquare className="w-12 h-12 mb-4 text-neutral-400" />
          <h2 className="text-2xl font-bold mb-2 text-white">
            Chat About Your Content
          </h2>
          <p className="text-neutral-400 mb-8 text-center max-w-md">
            Ask questions about your content and get detailed explanations.
          </p>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <div className="relative">
            <textarea
              className="w-full px-4 py-3 bg-neutral-900 rounded-lg text-white border border-neutral-800 hover:border-neutral-700 transition-colors focus:outline-none focus:border-neutral-600 resize-none"
              placeholder="Ask a question..."
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="absolute right-2 bottom-2 p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all focus:outline-none focus:ring-1 focus:ring-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900/50">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-[#080808] rounded-lg border border-neutral-800">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'assistant'
                ? 'pl-4'
                : 'pl-4'
            }`}
          >
            <div
              className={`p-4 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-neutral-900 border border-neutral-800'
                  : 'bg-neutral-800'
              }`}
            >
              <p className="text-white whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="pl-4">
            <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
              <Loader2 className="animate-spin text-neutral-400" size={20} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-neutral-800">
        <div className="relative">
          <textarea
            className="w-full px-4 py-3 bg-neutral-900 rounded-lg text-white border border-neutral-800 hover:border-neutral-700 transition-colors focus:outline-none focus:border-neutral-600 resize-none"
            placeholder="Type your message..."
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-2 bottom-2 p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all focus:outline-none focus:ring-1 focus:ring-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900/50">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
