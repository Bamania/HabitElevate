import { useState, useCallback, useRef } from 'react';

interface AGUIResponse {
  content: string;
  type: 'content' | 'agui_content' | 'done' | 'error';
}

export function useAGUI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlightRef = useRef(false);

  const sendMessage = useCallback(async (
    message: string, 
    userId?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> => {
    // Prevent duplicate requests
    if (requestInFlightRef.current) {
      console.log('⚠️ Request already in flight, skipping duplicate');
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
      
      // Use streaming with AGUI endpoint
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
              const data: AGUIResponse = JSON.parse(line.slice(6));
              
              if (data.type === 'content' || data.type === 'agui_content') {
                accumulatedContent += data.content;
                // Call the chunk callback for real-time updates
                if (onChunk) {
                  onChunk(data.content);
                }
              } else if (data.type === 'done') {
                console.log('✅ AGUI stream completed');
                break;
              } else if (data.type === 'error') {
                throw new Error(data.content || 'Unknown error');
              }
            } catch (parseError) {
              console.error('Error parsing AGUI response:', parseError);
            }
          }
        }
      }

      return accumulatedContent;
requestInFlightRef.current = false;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AGUI Error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessageSimple = useCallback(async (
    message: string,
    userId?: string
  ): Promise<string> => {
    // Prevent duplicate requests
    if (requestInFlightRef.current) {
      console.log('⚠️ Request already in flight, skipping duplicate');
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
      
      // Try the streaming endpoint first, but collect all content
      let fullResponse = '';
      
      const response = await fetch(`${backendUrl}/api/v1/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_id: userId || 'default_user'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if it's a streaming response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: AGUIResponse = JSON.parse(line.slice(6));
                if (data.type === 'content' || data.type === 'agui_content') {
                  fullResponse += data.content;
                } else if (data.type === 'done') {
                  return fullResponse;
                } else if (data.type === 'error') {
                  throw new Error(data.content || 'Unknown error');
                }
              } catch (parseError) {
                console.error('Error parsing response:', parseError);
              }
            }
          }
        }
        
        return fullResponse;
      } else {
        // Handle regular JSON response
        const data = await response.json();
        return data.response || data.content || 'No response received';
      }
requestInFlightRef.current = false;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AGUI Simple Error:', err);
      throw err;
    } finally {
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
