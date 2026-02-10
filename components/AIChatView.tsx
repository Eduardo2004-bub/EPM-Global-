
import React, { useState, useRef, useEffect } from 'react';
import { Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { askAiStream } from '../geminiService';

interface AIChatViewProps {
  language: Language;
}

const AIChatView: React.FC<AIChatViewProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), senderId: 'me', senderName: 'User', text: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, senderId: 'ai', senderName: 'System', text: '', timestamp: Date.now(), isAi: true }]);

    try {
      let fullText = '';
      for await (const chunk of askAiStream(inputText, language)) {
        fullText += chunk;
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[75vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 font-mono animate-fade-in relative">
       {/* Decorative Grid Background inside Terminal */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

       <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md relative z-10">
          <div className="flex items-center space-x-3">
             <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 relative"></div>
             </div>
             <span className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] font-display text-shadow">AI Analyst Core</span>
          </div>
          <span className="text-slate-500 text-[10px] border border-white/10 px-2 py-0.5 rounded">v4.0.2 // STABLE</span>
       </div>
       
       <div className="flex-grow overflow-y-auto p-6 space-y-8 relative z-10 custom-scroll">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <p className="tracking-widest text-xs uppercase">System Initialized</p>
                <p className="tracking-widest text-xs uppercase mt-1">Ready for Query</p>
             </div>
          )}
          {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl p-5 rounded-xl border relative overflow-hidden ${
                    msg.senderId === 'me' 
                    ? 'bg-slate-800/80 border-slate-600 text-slate-100' 
                    : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                }`}>
                   <p className={`text-[10px] uppercase font-bold mb-3 opacity-60 tracking-wider ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                       {msg.senderName}
                   </p>
                   <p className="whitespace-pre-wrap leading-loose text-sm">{msg.text}</p>
                   {msg.isAi && <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>}
                </div>
             </div>
          ))}
          <div ref={chatEndRef} />
       </div>

       <form onSubmit={handleSend} className="p-4 bg-black/40 border-t border-white/10 relative z-10">
          <div className="flex items-center space-x-3 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
             <span className="text-emerald-500 font-bold animate-pulse">{'>'}</span>
             <input 
               autoFocus
               value={inputText}
               onChange={e => setInputText(e.target.value)}
               className="flex-grow bg-transparent border-none outline-none text-slate-200 placeholder-slate-600 font-mono text-sm"
               placeholder="Enter command parameters..."
             />
             <button type="submit" className="text-emerald-500 hover:text-emerald-400 disabled:opacity-50">
                <span className="text-xs font-bold uppercase tracking-wider">[EXEC]</span>
             </button>
          </div>
       </form>
    </div>
  );
};

export default AIChatView;
