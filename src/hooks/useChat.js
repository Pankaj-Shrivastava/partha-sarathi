import { useState, useRef } from 'react';
import { sendChatMessage } from '../utils/api';

export function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track if the current interaction is a follow-up
  const isFollowUpRef = useRef(false);

  const sendMessage = async (text, language = 'en') => {
    if (!text.trim() || !sessionId) return;

    // 1. Add user message to UI
    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // 2. Call actual backend API
      const responseData = await sendChatMessage(text, sessionId, isFollowUpRef.current, language);
      
      // 3. Process backend response
      const botMsg = { ...responseData, id: (Date.now() + 1).toString(), role: 'assistant' };
      setMessages(prev => [...prev, botMsg]);

      // 4. Determine follow up state for the NEXT message
      if (responseData.type === 'shloka_response' && responseData.reflection) {
        // If they got a reflection, the next message might be answering it
        isFollowUpRef.current = true;
      } else if (responseData.type === 'follow_up_prompt') {
        // They said 'yes' to diving deeper, next message is their detailed query
        isFollowUpRef.current = true;
      } else {
        // For everything else (crisis, decline, follow_up_close), reset the state
        isFollowUpRef.current = false;
      }
      
    } catch (err) {
      console.error("Chat Error:", err);
      setError(err.message || 'Unable to connect to the divine realm. Please try again.');
      
      // Remove the user message if the request failed completely so they can try again?
      // Or just let them see the error toast. We'll rely on the error toast.
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const clearMessages = () => {
    setMessages([]);
    isFollowUpRef.current = false;
    setError(null);
  };

  return { messages, isLoading, error, sendMessage, clearError, clearMessages };
}
