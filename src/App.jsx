import React from 'react';
import DisclaimerBanner from './components/DisclaimerBanner';
import WelcomeShloka from './components/WelcomeShloka';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import OfflineBanner from './components/OfflineBanner';
import { useChat } from './hooks/useChat';
import { useSession } from './hooks/useSession';

function App() {
  const sessionId = useSession();
  const { messages, isLoading, sendMessage } = useChat();

  const handleStart = () => {
    sendMessage("I am seeking guidance.");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Cosmic Background Shaders/Glows */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" 
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(118, 214, 213, 0.2) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(251, 188, 0, 0.1) 0%, transparent 50%)'
        }}
      />

      <OfflineBanner />
      <DisclaimerBanner />

      {/* Top AppBar */}
      <header className="w-full z-40 flex justify-between items-center px-4 md:px-6 py-2 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 relative">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-2xl cursor-pointer hover:text-primary-container transition-colors">menu</span>
          <div className="flex flex-col">
            <span className="font-headline-md text-[24px] text-primary">Partha-Sarathi</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button className="font-label-sm text-[12px] text-primary border-b-2 border-primary pb-1 uppercase tracking-widest">Dialogue</button>
          <button className="font-label-sm text-[12px] text-on-surface-variant hover:text-primary transition-colors pb-1 uppercase tracking-widest">Wisdom</button>
          <button className="font-label-sm text-[12px] text-on-surface-variant hover:text-primary transition-colors pb-1 uppercase tracking-widest">Path</button>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant text-2xl cursor-pointer hover:text-primary transition-colors">account_circle</span>
          <span className="material-symbols-outlined text-on-surface-variant text-2xl cursor-pointer hover:text-primary transition-colors">settings</span>
        </div>
      </header>

      {/* Main Content Area */}
      {messages.length === 0 ? (
        <WelcomeShloka onStart={handleStart} />
      ) : (
        <ChatWindow messages={messages} />
      )}

      {/* Input Bar */}
      <InputBar onSend={sendMessage} disabled={false} isLoading={isLoading} />
      
    </div>
  );
}

export default App;
