import React from 'react';

export default function ShlokaCard({ data, language = 'en' }) {
  const { shloka, translation, application, reflection } = data;

  const displayText = language === 'en' 
    ? (shloka?.roman || shloka?.devanagari)
    : (shloka?.devanagari || shloka?.roman);

  return (
    <div className="flex justify-start w-full">
      <div className="w-full max-w-[95%] shadow-md rounded-[20px] p-[1px] bg-gradient-to-r from-primary to-secondary">
        <div className="bg-white/85 backdrop-blur-[16px] rounded-[19px] p-5 md:p-6 flex flex-col gap-5">
          
          <div className="flex items-center gap-2 text-tertiary border-b border-outline-variant/50 pb-3">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span className="font-label-sm text-[11px] tracking-widest text-tertiary uppercase">
              Bhagavad Gita • {shloka?.citation || 'Shloka'}
            </span>
          </div>

          {/* Verse Text */}
          {displayText && (
            <div className="text-center py-3">
              <p className={`${language === 'hi' ? 'font-sanskrit' : 'font-body-lg italic'} text-[18px] text-primary drop-shadow-[0_0_10px_rgba(116,86,0,0.2)] leading-relaxed overflow-wrap break-word whitespace-pre-line`} lang={language === 'hi' ? 'sa' : 'en'}>
                {displayText}
              </p>
            </div>
          )}

          {/* English Translation */}
          {translation && (
            <div className="bg-primary/5 rounded-lg p-5 border border-primary/10">
              <p className="font-body-lg text-[16px] text-on-surface-variant italic text-center">
                "{translation}"
              </p>
            </div>
          )}

          <div className="w-full h-px bg-gradient-to-r from-transparent via-tertiary/20 to-transparent my-2"></div>

          {/* The Guidance / Application */}
          {application && (
            <div className="flex flex-col gap-2">
              <h3 className="font-headline-md text-[24px] font-medium text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">explore</span>
                The Guidance
              </h3>
              <p className="font-body-md text-[15px] text-on-surface/90 leading-relaxed">
                {application}
              </p>
            </div>
          )}

          {/* Reflection Box */}
          {reflection && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mt-2 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">psychology</span>
                <div>
                  <h4 className="font-label-sm text-[11px] uppercase tracking-widest text-secondary mb-1">Reflection</h4>
                  <p className="font-body-md text-[15px] text-on-surface">{reflection}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
