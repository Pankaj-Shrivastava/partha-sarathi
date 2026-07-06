import React from 'react';

export default function CrisisAlert({ data }) {
  return (
    <div className="flex justify-start w-full">
      <div className="w-full max-w-[95%] shadow-md rounded-[24px] p-[1px] bg-gradient-to-r from-primary to-secondary">
        <div className="bg-white/95 backdrop-blur-[16px] rounded-[23px] p-6 md:p-8 flex flex-col gap-6">
          
          <div className="flex items-center gap-3 text-primary border-b border-primary/20 pb-4">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <span className="font-headline-md text-[24px] tracking-tight text-primary">
              A moment of stillness and care.
            </span>
          </div>

          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10 flex flex-col gap-4">
            <p className="font-body-lg text-[18px] text-on-surface-variant text-center leading-relaxed">
              It's okay to feel overwhelmed. You've been carrying a lot, and your well-being matters deeply. When you're ready, reaching out to a professional or a trusted friend can be a gentle step toward finding the peace and support you deserve.
            </p>
          </div>

          <div className="px-2 pt-2 text-center">
            <p className="font-body-md text-[16px] text-on-surface-variant/80 italic">
              Take all the time you need. We are here when you are ready to return to guidance.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
