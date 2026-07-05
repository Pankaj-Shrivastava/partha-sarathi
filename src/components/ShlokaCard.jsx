import React from 'react';

export default function ShlokaCard({ data }) {
  const { shloka, translation, application, reflection } = data;

  return (
    <div className="flex justify-start w-full">
      <div className="w-full max-w-[95%] shadow-md rounded-[24px] p-[1px] bg-gradient-to-r from-primary to-secondary">
        <div className="bg-white/85 backdrop-blur-[16px] rounded-[23px] p-6 md:p-8 flex flex-col gap-6">
          
          {/* Citation */}
          <div className="flex items-center gap-2 text-tertiary border-b border-outline-variant/50 pb-4">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="font-label-sm text-[12px] tracking-widest text-tertiary uppercase">
              Bhagavad Gita • {shloka?.citation || 'Shloka'}
            </span>
          </div>

          {/* Devanagari Verse */}
          {shloka?.devanagari && (
            <div className="text-center py-4">
              <p className="font-sanskrit text-[20px] text-primary drop-shadow-[0_0_10px_rgba(116,86,0,0.2)] leading-relaxed overflow-wrap break-word" lang="sa">
                {shloka.devanagari}
              </p>
            </div>
          )}

          {/* English Translation */}
          {translation && (
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <p className="font-body-lg text-[18px] text-on-surface-variant italic text-center">
                "{translation}"
              </p>
            </div>
          )}

          <div className="w-full h-px bg-gradient-to-r from-transparent via-tertiary/20 to-transparent my-2"></div>

          {/* The Guidance / Application */}
          {application && (
            <div className="flex flex-col gap-3">
              <h3 className="font-headline-md text-[32px] font-medium text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">explore</span>
                The Guidance
              </h3>
              <p className="font-body-md text-[16px] text-on-surface/90 leading-relaxed">
                {application}
              </p>
            </div>
          )}

          {/* Reflection Box */}
          {reflection && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-5 mt-2 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary mt-1">psychology</span>
                <div>
                  <h4 className="font-label-sm text-[12px] uppercase tracking-widest text-secondary mb-2">Reflection</h4>
                  <p className="font-body-md text-[16px] text-on-surface">{reflection}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
