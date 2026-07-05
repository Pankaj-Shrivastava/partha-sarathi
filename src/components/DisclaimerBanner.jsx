import React, { useState, useEffect } from 'react';

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('disclaimerDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-tertiary/10 backdrop-blur-md border-b border-tertiary/20 py-2 px-4 shadow-[0_4px_20px_rgba(116,86,0,0.05)] flex justify-center items-center relative">
      <p className="font-label-sm text-label-sm text-tertiary text-center max-w-[90%]">
        Guidance provided is philosophical and spiritual. For professional or medical help, please seek appropriate resources.
      </p>
      <button 
        onClick={() => {
          sessionStorage.setItem('disclaimerDismissed', 'true');
          setIsVisible(false);
        }}
        className="absolute right-4 text-tertiary hover:text-tertiary-container flex items-center justify-center p-1 rounded-full hover:bg-tertiary/10 transition-colors"
        aria-label="Dismiss disclaimer"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
