import React, { useState, useEffect } from 'react';

export default function OfflineBanner({ language = 'en' }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  const offlineText = language === 'hi'
    ? "कनेक्शन टूट गया। आप ऑफ़लाइन हैं।"
    : "Connection Lost. You are offline.";

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[60] bg-error/90 text-on-error backdrop-blur-md px-6 py-2 rounded-full shadow-[0_4px_20px_rgba(186,26,26,0.3)] flex items-center gap-2">
      <span className="material-symbols-outlined text-[16px]">wifi_off</span>
      <span className="font-label-sm text-[12px] tracking-widest uppercase">{offlineText}</span>
    </div>
  );
}
