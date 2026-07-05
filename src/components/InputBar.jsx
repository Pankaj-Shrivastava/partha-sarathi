import React, { useState, useRef, useEffect } from 'react';

export default function InputBar({ onSend, disabled, isLoading }) {
  const [text, setText] = useState('');
  const maxLength = 2000;
  
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white/70 backdrop-blur-[24px] border-t border-outline-variant pt-4 pb-8 px-4 md:px-0">
      <div className="max-w-4xl mx-auto relative">
        <form 
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-[24px] border border-outline-variant rounded-full p-2 pr-4 flex items-center gap-3 transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(0,101,101,0.1)] group"
        >
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent border-none text-on-surface font-body-lg text-[16px] placeholder:text-on-surface-variant/70 focus:ring-0 px-4 py-2 outline-none disabled:opacity-50"
            placeholder={isLoading ? "Seeking guidance..." : "Speak your mind, seeker..."}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxLength))}
            disabled={disabled || isLoading}
          />
          
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-[10px] text-outline">
              {text.length}/{maxLength}
            </span>
            
            <button 
              type="submit"
              disabled={!text.trim() || disabled || isLoading}
              aria-label="Send message" 
              className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:shadow-[0_0_15px_rgba(0,101,101,0.3)] transition-shadow duration-200 disabled:opacity-50 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin" style={{fontVariationSettings: "'FILL' 1"}}>autorenew</span>
              ) : (
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
