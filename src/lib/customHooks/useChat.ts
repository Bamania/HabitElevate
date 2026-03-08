import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

interface SSEChunk {
  content?: string;
  type: 'content' | 'done' | 'error';
  error?: string;
  message?: string;
}

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlightRef = useRef(false);

  const sendMessage = useCallback(async (
    message: string,
    userId?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> => {
    if (requestInFlightRef.current) {
      return '';
    }

    requestInFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not set');
      }

      // SSE streaming requires fetch — axios doesn't support ReadableStream in browsers
      const response = await fetch(`${backendUrl}/api/v1/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          message,
          user_id: userId || 'default_user'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: SSEChunk = JSON.parse(line.slice(6));

              if (data.type === 'content') {
                accumulatedContent += data.content || '';
                if (onChunk) {
                  onChunk(data.content || '');
                }
              } else if (data.type === 'done') {
                break;
              } else if (data.type === 'error') {
                throw new Error(data.error || data.content || 'Unknown error');
              }
            } catch (parseError) {
              if (parseError instanceof Error && parseError.message !== 'Unknown error') {
                const isJsonError = parseError instanceof SyntaxError;
                if (!isJsonError) throw parseError;
              }
              console.error('Error parsing SSE chunk:', parseError);
            }
          }
        }
      }

      requestInFlightRef.current = false;
      return accumulatedContent;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
      throw err;
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const sendMessageSimple = useCallback(async (
    message: string,
    userId?: string
  ): Promise<string> => {
    if (requestInFlightRef.current) {
      return '';
    }

    requestInFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not set');
      }

      const response = await axios.post(`${backendUrl}/api/v1/chat/`, {
        message,
        user_id: userId || 'default_user'
      });

      requestInFlightRef.current = false;
      return response.data?.response || response.data?.content || 'No response received';

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
      throw err;
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    sendMessageSimple,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
