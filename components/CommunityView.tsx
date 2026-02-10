
import React, { useState, useEffect, useRef } from 'react';
import { Language, SocialUser, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';

interface CommunityViewProps {
  language: Language;
}

const CommunityView: React.FC<CommunityViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [users, setUsers] = useState<SocialUser[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mocks
    const mockUsers: SocialUser[] = [
      { id: '1', name: 'Marco Silva', avatar: 'https://i.pravatar.cc/150?u=marco', status: 'online', isFriend: false },
      { id: '2', name: 'Elena R.', avatar: 'https://i.pravatar.cc/150?u=elena', status: 'online', isFriend: true },
      { id: '3', name: 'John Inv.', avatar: 'https://i.pravatar.cc/150?u=john', status: 'offline', isFriend: false },
    ];
    setUsers(mockUsers);
    setMessages([
      { id: 'm1', senderId: '2', senderName: 'Elena R.', text: 'Market sentiment in Asia is bullish today.', timestamp: Date.now() - 100000 },
    ]);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), senderId: 'me', senderName: 'You', text: inputText, timestamp: Date.now() }]);
    setInputText('');
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex h-[70vh] animate-fade-in">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 bg-black/20 flex flex-col hidden md:flex">
        <div className="p-5 border-b border-white/10 font-bold text-white text-xs uppercase tracking-widest font-display bg-white/5">Encrypted Net</div>
        <div className="flex-grow overflow-y-auto p-3 space-y-2">
           {users.map(u => (
             <div key={u.id} className="flex items-center p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group">
               <div className="relative mr-4">
                 <img src={u.avatar} className="w-10 h-10 rounded-full border border-white/10" />
                 {u.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_#10b981]"></div>}
               </div>
               <div>
                 <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{u.name}</span>
                 <p className="text-[10px] text-slate-500 uppercase">{u.status}</p>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col bg-[#0b1120]/50 relative">
         <div className="p-5 border-b border-white/10 font-bold text-white text-sm bg-white/5 backdrop-blur flex justify-between items-center">
            <span className="font-display tracking-wide">Global Strategy Room</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
         </div>
         
         <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {messages.map(msg => (
               <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-6 py-4 rounded-2xl text-sm border backdrop-blur-md ${msg.senderId === 'me' ? 'bg-brand-600/20 border-brand-500/30 text-white rounded-br-none' : 'bg-slate-800/40 border-white/10 text-slate-200 rounded-bl-none'}`}>
                     <p className="font-bold text-[10px] mb-2 opacity-50 uppercase tracking-wider">{msg.senderName}</p>
                     <p className="leading-relaxed">{msg.text}</p>
                  </div>
               </div>
            ))}
         </div>

         <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
            <div className="relative">
                <input 
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-black/60 text-white placeholder-slate-600 transition-all"
                placeholder="Transmit encrypted message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default CommunityView;
