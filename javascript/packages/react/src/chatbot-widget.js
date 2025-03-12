import { useEffect } from 'react';

export function ChatbotWidget({ publishId, options = {} }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://adrenal.ai/chatbot.min.js?c=${publishId}`;
    script.async = true;
    script.defer = true;
    
    document.body.appendChild(script);

    return () => {
      if (window.adrenalChatbot) {
        // Clean up the widget if it exists
        const widget = document.querySelector('.adrenal-chatbot-widget');
        if (widget) {
          document.body.removeChild(widget);
        }
        delete window.adrenalChatbot;
      }
      document.body.removeChild(script);
    };
  }, [publishId, options]);

  return null;
} 