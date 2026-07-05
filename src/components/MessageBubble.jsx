import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
  if (!isUser) return null; // Bot messages are handled by ShlokaCard or CrisisAlert

  return (
    <div className="flex justify-end w-full">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl rounded-tr-sm px-6 py-4 max-w-[85%] border border-outline-variant shadow-sm">
        <p className="font-body-lg text-body-lg text-on-surface whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
