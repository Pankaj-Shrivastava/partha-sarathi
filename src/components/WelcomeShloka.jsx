import React from 'react';

export default function WelcomeShloka({ onStart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto h-full px-6 md:px-8">
      <div className="w-full bg-surface-container-lowest/70 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-8 shadow-[0_0_20px_rgba(0,106,106,0.1)] hover:shadow-[0_0_50px_rgba(0,106,106,0.3)] transition-shadow duration-1000 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
        
        {/* Subtle gradient border effect via pseudo-element */}
        <div className="absolute inset-0 rounded-xl border border-transparent [background:linear-gradient(45deg,rgba(0,106,106,0.2),rgba(98,146,253,0.2))_border-box] [-webkit-mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="space-y-3 z-10">
          <p className="font-sanskrit-text text-[18px] text-primary drop-shadow-[0_0_15px_rgba(118,214,213,0.4)] leading-relaxed">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br/>
            मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
          </p>
          
          <div className="h-px w-24 bg-primary/30 mx-auto my-4"></div>
          
          <p className="font-body-lg text-[16px] text-on-surface-variant max-w-lg mx-auto">
            You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.
          </p>
          
          <p className="font-label-sm text-[11px] text-on-surface-variant/70 mt-2 tracking-widest uppercase">
            — Bhagavad Gita, Chapter 2, Verse 47
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onStart}
          className="mt-8 px-8 py-3 bg-primary text-on-primary font-label-sm text-[12px] uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(0,106,106,0.4)] transition-all duration-300 flex items-center gap-2 z-10 relative overflow-hidden group/btn"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
          <span>Seek Guidance</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
