import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import ShlokaCard from './ShlokaCard';
import CrisisAlert from './CrisisAlert';

export default function ChatWindow({ messages }) {
  const endOfMessagesRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (force = false) => {
    if (!containerRef.current) return;
    
    // Only auto-scroll if we're already near the bottom (within 150px) or forced
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    
    if (isNearBottom || force) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [messages]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShowScrollButton(!isNearBottom);
  };

  return (
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth w-full"
      ref={containerRef}
      onScroll={handleScroll}
    >
      <main className="w-full max-w-4xl mx-auto px-6 md:px-8 pt-10 pb-[120px] flex flex-col gap-8 relative z-10">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return <MessageBubble key={msg.id} message={msg} />;
          }
          if (msg.role === 'assistant') {
            if (msg.type === 'crisis') {
              return <CrisisAlert key={msg.id} data={msg} />;
            } else if (msg.type === 'shloka_response') {
              return <ShlokaCard key={msg.id} data={msg} />;
            } else {
              // Fallback for simple decline/text responses from the API
              return (
                <div key={msg.id} className="flex justify-start w-full">
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl rounded-tl-sm px-6 py-4 max-w-[85%] border border-outline-variant shadow-sm">
                    <p className="font-body-lg text-[18px] text-on-surface whitespace-pre-wrap">{msg.message || msg.content}</p>
                  </div>
                </div>
              );
            }
          }
          return null;
        })}
        <div ref={endOfMessagesRef} />
      </main>

      {/* Floating Scroll to Bottom Button */}
      {showScrollButton && (
        <button 
          onClick={() => scrollToBottom(true)}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          <span className="font-label-sm text-[12px] tracking-widest uppercase">New message</span>
          <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
        </button>
      )}
    </div>
  );
}
