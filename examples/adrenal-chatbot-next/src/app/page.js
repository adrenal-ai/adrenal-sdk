'use client';

import { useChatbot } from '@adrenal-ai/sdk/react';
import { ArrowUp, Square, Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageContent({ message }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
          isUser ? 'bg-blue-600 text-white' : isError ? 'bg-red-600 text-white' : 'bg-zinc-800 text-white'
        }`}
      >
        {isError || isUser ? (
          message.content
        ) : (
          <div className="prose prose-sm prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || ''}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function OfflineMessage({ chatbot }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-16 space-y-6">
          <div className="text-center space-y-2.5">
            <div className="space-y-1">
              <h1 className="text-lg font-medium text-zinc-400">
                {chatbot?.title || chatbot?.name || 'Example Chatbot'}
              </h1>
              {chatbot?.description && (
                <p className="text-sm text-zinc-500">{chatbot.description}</p>
              )}
            </div>
            <h2 className="text-md font-medium text-zinc-600">This chatbot is offline</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        <p className="text-zinc-400 text-sm">Loading chatbot...</p>
      </div>
    </div>
  );
}

const PUBLISH_ID = 'c78f5557a53f';

export default function Home() {
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    chatbot,
    error,
  } = useChatbot({
    publishId: PUBLISH_ID,
  });

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim()) return;
      if (isLoading) {
        stop();
        return;
      }
      handleSubmit(e);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  if (!chatbot && !error) {
    return <LoadingMessage />;
  }

  if (error || !chatbot?.live) {
    return <OfflineMessage chatbot={chatbot} />;
  }

  return (
    <main className="flex flex-col h-screen relative bg-black">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-scroll pb-4"
        style={{ maxHeight: 'calc(100vh - 80px)' }}
      >
        <div className="max-w-3xl mx-auto p-6 pt-12 flex flex-col gap-4">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-semibold text-white">{chatbot.title}</h1>
            {chatbot.description && (
              <p className="text-sm text-zinc-400 mt-1">{chatbot.description}</p>
            )}
          </div>
          {messages.map((message, i) => (
            <MessageContent key={i} message={message} />
          ))}
          {isLoading && (!messages.length || messages[messages.length - 1].role === 'user') && (
            <div className="w-full flex justify-start">
              <div className="rounded-lg px-4 py-2 max-w-[80%] bg-zinc-800">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-6 pb-8 sticky bottom-0 w-full shadow-lg bg-black">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            autoFocus
            className="flex-1 h-[38px] rounded-lg bg-transparent text-white px-4 py-2 focus:outline-none ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 text-sm border border-white/20"
          />
          <button
            type="submit"
            onClick={isLoading ? stop : undefined}
            className="h-[38px] w-[38px] flex items-center justify-center rounded-lg bg-white hover:bg-white text-black hover:text-black"
          >
            {isLoading ? (
              <Square className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" strokeWidth={4} />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
