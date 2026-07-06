import React from 'react';

export default function LanguageConfirmModal({ isOpen, onClose, onConfirm, currentLanguage, pendingLanguage }) {
  if (!isOpen) return null;

  const isCurrentHi = currentLanguage === 'hi';
  const title = isCurrentHi ? "भाषा बदलें?" : "Change Language?";
  const message = isCurrentHi 
    ? "भाषा बदलने से वर्तमान वार्तालाप साफ़ हो जाएगा और एक नया वार्तालाप शुरू होगा। क्या आप आगे बढ़ना चाहते हैं?" 
    : "Changing the language will clear the current chat and start a new one. Do you wish to proceed?";
  const confirmText = isCurrentHi ? "पुष्टि करें" : "Confirm";
  const cancelText = isCurrentHi ? "रद्द करें" : "Cancel";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/30 rounded-[24px] shadow-2xl p-6 md:p-8 w-full max-w-sm flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary text-[24px]">translate</span>
          </div>
          <h3 className="font-headline-md text-[20px] text-primary">{title}</h3>
          <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-full border border-outline-variant text-on-surface hover:bg-surface-variant/50 transition-colors font-label-sm text-[12px] uppercase tracking-widest"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-sm text-[12px] uppercase tracking-widest shadow-md"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
