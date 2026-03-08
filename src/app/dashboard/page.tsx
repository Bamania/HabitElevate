'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Paperclip } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useChat, ToolEvent } from '../../lib/customHooks/useChat';
import GenUiElements from '../../components/GenuiElements';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
  uiType?: string;
  uiData?: any;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { sendMessage, isLoading, error } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = user?.id || 'default_user';
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User';

  const userInitials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: text,
      type: 'user',
      timestamp: new Date(),
    };

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = {
      id: aiMsgId,
      content: '',
      type: 'ai',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setPrompt('');

    try {
      let accumulated = '';
      await sendMessage(
        text,
        userId,
        (chunk: string) => {
          accumulated += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: accumulated, isStreaming: true } : m
            )
          );
        },
        (event: ToolEvent) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, uiType: event.type, uiData: event.data } : m
            )
          );
        }
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: 'Sorry, I encountered an error. Please try again.', isStreaming: false }
            : m
        )
      );
    }
  };

 
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="mb-1 text-xl font-semibold text-gray-900">
              Hey {displayName}! Ready to crush it today?
            </h2>
            <p className="max-w-md text-sm text-gray-500">
              Ask me anything about your habits, create todos, get coaching tips, or
              just chat about building better routines.
            </p>

            {/* Quick prompts */}
            <div className="mt-8 grid max-w-lg grid-cols-2 gap-2">
              {[
                'Show me my todos',
                'Help me build a morning routine',
                'Give me a motivation boost',
                'Create a workout plan',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setPrompt(q)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        <div className="mx-auto max-w-3xl space-y-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[75%] items-end gap-2.5 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                {message.type === 'ai' ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
                    {userInitials}
                  </div>
                )}

                {/* Bubble OR GenUI widget */}
                <div className="flex flex-col gap-2">
                  {message.uiType && message.uiData && !message.isStreaming ? (
                    <GenUiElements type={message.uiType} data={message.uiData} />
                  ) : (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.type === 'user'
                          ? 'rounded-br-md bg-blue-600 text-white'
                          : 'rounded-bl-md border border-gray-100 bg-white text-gray-800 shadow-sm'
                      }`}
                    >
                      {message.isStreaming && !message.content ? (
                        <div className="flex items-center gap-1.5 py-1 px-1">
                          <span className="h-2 w-2 rounded-full bg-gray-400 animate-dot-bounce-1" />
                          <span className="h-2 w-2 rounded-full bg-gray-400 animate-dot-bounce-2" />
                          <span className="h-2 w-2 rounded-full bg-gray-400 animate-dot-bounce-3" />
                        </div>
                      ) : (
                        <span className="whitespace-pre-wrap">{message.content}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-100 bg-white px-6 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-2 transition-colors focus-within:border-blue-300 focus-within:bg-white"
        >
          <button type="button" className="shrink-0 text-gray-400 hover:text-gray-600" disabled>
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Message your coach..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-gray-800 placeholder-gray-400 outline-none"
            disabled={isLoading}
          />

          <button type="button" className="shrink-0 text-gray-400 hover:text-gray-600" disabled>
            <Mic className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <p className="mt-2 text-center text-[11px] tracking-wide text-gray-300">
          POWERED BY HABITELEVATE AI INTELLIGENCE
        </p>
      </div>
    </div>
  );
}
