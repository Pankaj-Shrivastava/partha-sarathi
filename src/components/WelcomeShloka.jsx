import React from 'react';

export default function WelcomeShloka({ data, onStart, language = 'en' }) {
  const displayText = language === 'en'
    ? (data?.roman || data?.devanagari || 'karmany-evadhikaras te ma phalesu kadacana')
    : (data?.devanagari || data?.roman || 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन');
  if (!data) return null; // Wait until data loads

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto h-full px-6 md:px-8">
      <div className="w-full bg-surface-container-lowest/70 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-8 shadow-[0_0_20px_rgba(0,106,106,0.1)] hover:shadow-[0_0_50px_rgba(0,106,106,0.3)] transition-shadow duration-1000 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
        
        {/* Subtle gradient border effect via pseudo-element */}
        <div className="absolute inset-0 rounded-xl border border-transparent [background:linear-gradient(45deg,rgba(0,106,106,0.2),rgba(98,146,253,0.2))_border-box] [-webkit-mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="space-y-3 z-10">
          {/* Dynamic Welcome Shloka */}
          <p className={`${language === 'hi' ? 'font-sanskrit' : 'font-body-lg italic'} text-[22px] md:text-[28px] text-primary/90 drop-shadow-[0_0_15px_rgba(116,86,0,0.3)] leading-relaxed tracking-wide whitespace-pre-line`} lang={language === 'hi' ? 'sa' : 'en'}>
            {displayText}
          </p>
          
          <div className="h-px w-24 bg-primary/30 mx-auto my-4"></div>
          
          <p className="font-body-lg text-[16px] text-on-surface-variant max-w-lg mx-auto italic">
            "{language === 'hi' && data.translation_hi ? data.translation_hi : data.translation}"
          </p>
          
          <p className="font-label-sm text-[11px] text-on-surface-variant/70 mt-2 tracking-widest uppercase">
            — {language === 'hi' && data.shloka.citation_hi ? `भगवद्गीता, ${data.shloka.citation_hi}` : `Bhagavad Gita, ${data.shloka.citation}`}
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onStart}
          className="mt-8 px-8 py-3 bg-primary text-on-primary font-label-sm text-[12px] uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(0,106,106,0.4)] transition-all duration-300 flex items-center gap-2 z-10 relative overflow-hidden group/btn"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
          <span>{language === 'hi' ? 'मार्गदर्शन लें' : 'Seek Guidance'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
