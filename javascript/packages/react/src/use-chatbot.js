import { useState, useCallback, useRef, useEffect } from 'react';

export function useChatbot({ publishId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [chatbot, setChatbot] = useState(null);
  const [error, setError] = useState(null);
  const responseBuffer = useRef('');
  const updateTimer = useRef(null);
  const lastUpdateTime = useRef(0);
  const BATCH_INTERVAL = 16; // Roughly one frame (60fps)

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const response = await fetch(`https://adrenal.ai/api/chatbot/${publishId}/live`);
        if (!response.ok) {
          throw new Error('Failed to load chatbot');
        }
        const data = await response.json();
        setChatbot(data);
        
        // Set initial message if available
        if (data.messages_initial) {
          setMessages([{
            role: 'assistant',
            content: data.messages_initial,
            id: 'initial-message'
          }]);
        }
      } catch (err) {
        setError(err);
      }
    }
    
    fetchChatbot();
  }, [publishId]);

  const batchedUpdate = useCallback(content => {
    const now = Date.now();
    if (now - lastUpdateTime.current >= BATCH_INTERVAL) {
      // Enough time has passed, update immediately
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage?.role === 'assistant') {
          lastMessage.content = content;
        }
        return newMessages;
      });
      lastUpdateTime.current = now;
    } else {
      // Schedule update for next frame
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }
      updateTimer.current = setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = content;
          }
          return newMessages;
        });
        lastUpdateTime.current = Date.now();
      }, BATCH_INTERVAL);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(e => {
    setInput(e.target.value);
  }, []);

  const stop = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
    }
  }, [abortController]);

  const handleSubmit = useCallback(
    async e => {
      e?.preventDefault();
      if (!input.trim() || isLoading || !chatbot?.live) return;

      const content = input.trim();
      setInput('');
      setIsLoading(true);

      setMessages(prev => [...prev, { role: 'user', content }]);

      try {
        let currentChatId = chatId;

        if (!currentChatId) {
          const createUrl = new URL(`https://adrenal.ai/api/chatbot/${publishId}/live`);
          const createResponse = await fetch(createUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: content }),
          });

          if (!createResponse.ok) {
            throw new Error('Failed to create chat');
          }

          const { chat_id } = await createResponse.json();
          currentChatId = chat_id;
          setChatId(chat_id);
        }

        const url = new URL(
          `https://adrenal.ai/api/chatbot/${publishId}/live/${currentChatId}`
        );
        const controller = new AbortController();
        setAbortController(controller);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            messages: [...messages, { role: 'user', content }],
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.code === 'model_not_available') {
            throw new Error(
              `This chatbot is using features not available in your current plan. Please upgrade to access ${errorData.subscription_tier === 'free' ? 'premium' : 'higher tier'} models.`
            );
          }
          throw new Error('Failed to send message');
        }

        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
        responseBuffer.current = '';
        lastUpdateTime.current = Date.now();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line) continue;

            if (line.startsWith('f:')) {
              continue;
            }

            if (line.startsWith('0:')) {
              const content = line
                .slice(2)
                .replace(/^"|"$/g, '')
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"');
              responseBuffer.current += content;
              batchedUpdate(responseBuffer.current);
              continue;
            }

            if (line.startsWith('e:') || line.startsWith('d:')) {
              batchedUpdate(responseBuffer.current);
              break;
            }
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        setMessages(prev => [...prev, { role: 'error', content: error.message }]);
      } finally {
        setIsLoading(false);
        setAbortController(null);
        if (updateTimer.current) {
          clearTimeout(updateTimer.current);
        }
      }
    },
    [input, isLoading, messages, chatId, publishId, batchedUpdate, chatbot?.live]
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    chatbot,
    error,
  };
} 