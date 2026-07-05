import React from 'react';

export default function CrisisAlert({ data }) {
  return (
    <div className="flex justify-start w-full">
      <div className="w-full max-w-[95%] shadow-md rounded-[24px] p-[1px] bg-gradient-to-r from-error to-error-container">
        <div className="bg-white/95 backdrop-blur-[16px] rounded-[23px] p-6 md:p-8 flex flex-col gap-6">
          
          <div className="flex items-center gap-3 text-error border-b border-error/20 pb-4">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
            <span className="font-headline-md text-[24px] tracking-tight text-error">
              Professional Support Available
            </span>
          </div>

          <div className="bg-error-container/20 rounded-lg p-6 border border-error/20">
            <p className="font-body-lg text-[18px] text-on-surface-variant text-center leading-relaxed">
              {data.message || "You have mentioned something that indicates you might be in crisis. While philosophical guidance can offer perspective, it cannot replace professional help."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-headline-md text-[20px] font-medium text-error flex items-center gap-2">
              <span className="material-symbols-outlined">call</span>
              Immediate Resources
            </h3>
            <ul className="font-body-md text-[16px] text-on-surface/90 leading-relaxed list-disc list-inside space-y-2 pl-2">
              <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
              <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              <li><strong>International Resources:</strong> <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="text-secondary underline hover:text-secondary-container">findahelpline.com</a></li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}
