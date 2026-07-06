import React from 'react';
import DisclaimerBanner from './components/DisclaimerBanner';
import WelcomeShloka from './components/WelcomeShloka';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import OfflineBanner from './components/OfflineBanner';
import { useChat } from './hooks/useChat';
import { useSession } from './hooks/useSession';

function App() {
  const { sessionId, welcomeShloka } = useSession();
  const { messages, isLoading, error, sendMessage, clearError } = useChat(sessionId);
  const [language, setLanguage] = React.useState('en'); // 'en' or 'hi'

  const handleStart = () => {
    sendMessage(language === 'hi' ? "मैं मार्गदर्शन चाहता हूँ।" : "I am seeking guidance.", language);
  };

  return (
    <div className="bg-background text-on-surface h-[100dvh] flex flex-col relative overflow-hidden">
      
      {/* Cosmic Background Shaders/Glows */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" 
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(118, 214, 213, 0.2) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(251, 188, 0, 0.1) 0%, transparent 50%)'
        }}
      />

      <OfflineBanner language={language} />
      <DisclaimerBanner language={language} />

      {/* Error Toast */}
      {error && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-error/90 text-on-error backdrop-blur-md px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(186,26,26,0.3)] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-label-sm text-[12px] tracking-widest">{error}</span>
          <button onClick={clearError} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top AppBar */}
      <header className="w-full z-40 flex justify-between items-center px-4 md:px-6 py-2 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 relative">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-headline-md text-[24px] text-primary">
              {language === 'hi' ? 'पार्थ-सारथी' : 'Partha-Sarathi'}
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="font-label-sm text-[12px] text-on-surface-variant/80 uppercase tracking-widest">
            {language === 'hi' ? 'भगवद्गीता यथारूप' : 'Bhagavad Gita As It Is'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 font-label-sm text-[12px] text-primary hover:text-primary-container transition-colors tracking-widest bg-primary/10 px-3 py-1.5 rounded-full"
            aria-label="Toggle Language"
            title="Toggle between English and Hindi"
          >
            <span className="uppercase font-bold">{language === 'en' ? 'EN' : 'HI'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {messages.length === 0 ? (
        <WelcomeShloka data={welcomeShloka} onStart={handleStart} language={language} />
      ) : (
        <ChatWindow messages={messages} language={language} />
      )}

      {/* Input Bar */}
      <InputBar onSend={(text) => sendMessage(text, language)} disabled={false} isLoading={isLoading} language={language} />
      
    </div>
  );
}

export default App;
