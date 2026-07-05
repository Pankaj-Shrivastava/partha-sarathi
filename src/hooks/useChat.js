import { useState } from 'react';

const MOCK_SHLOKA_RESPONSE = {
  type: "shloka_response",
  shloka: {
    chapter: 2,
    verse: 47,
    citation: "Chapter 2, Verse 47",
    devanagari: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ ४७ ॥",
  },
  translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
  application: "When responsibilities overwhelm you, it is often because the mind is burdened not just by the tasks themselves, but by the anxiety of their outcomes. The cosmic principle here is detachment from the fruit, not the action. Focus your energy entirely on the present execution of your duty. The 'overwhelm' is a heavy cloak worn by the ego anticipating failure or success. Drop the cloak; perform the action.",
  reflection: "Which specific responsibility are you currently tying your self-worth to, rather than viewing it simply as a task to be done?"
};

const MOCK_CRISIS_RESPONSE = {
  type: "crisis",
  message: "I hear that you are in a tremendous amount of pain. Please know that this guidance is philosophical, but your life is precious and there is immediate help available."
};

const MOCK_DECLINE_RESPONSE = {
  type: "decline",
  message: "I can only offer guidance based on the philosophical teachings of the Bhagavad Gita. I cannot fulfill this request."
};

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    // 1. Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Simulate network latency
    setTimeout(() => {
      let botResponse;
      
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('kill') || lowerText.includes('suicide') || lowerText.includes('die')) {
        botResponse = { ...MOCK_CRISIS_RESPONSE, id: (Date.now() + 1).toString(), role: 'assistant' };
      } else if (lowerText.includes('code') || lowerText.includes('joke')) {
        botResponse = { ...MOCK_DECLINE_RESPONSE, id: (Date.now() + 1).toString(), role: 'assistant' };
      } else {
        botResponse = { ...MOCK_SHLOKA_RESPONSE, id: (Date.now() + 1).toString(), role: 'assistant' };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return { messages, isLoading, sendMessage };
}
