
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  onHomeClick: () => void;
  onSearch: (query: string) => void;
  currentUser?: UserProfile | null;
  onAuthClick: () => void;
}

export default function Header({ onMenuClick, onHomeClick, onSearch, currentUser, onAuthClick }: HeaderProps) {
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl bg-slate-900/95 shadow-lg">
      <div className="max-w-7xl mx-auto h-14 md:h-16 flex flex-col md:flex-row items-center justify-between px-3 md:px-8 gap-2 py-1 md:py-0">
        
        {/* Left: Menu & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <button 
                onClick={onMenuClick}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            <div 
                onClick={onHomeClick}
                className="flex items-center space-x-2 cursor-pointer group"
            >
                <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-500 rounded-lg rotate-3 group-hover:rotate-12 transition-transform opacity-80 blur-[2px]"></div>
                <div className="absolute inset-0 bg-brand-600 rounded-lg group-hover:rotate-6 transition-transform"></div>
                <span className="relative z-10 text-white font-bold text-base font-display">E</span>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-white font-display hidden sm:block">
                EPM<span className="text-brand-400 font-light">GLOBAL</span>
                </h1>
            </div>
          </div>
          
          {/* Mobile Clock */}
          <div className="md:hidden flex flex-col items-end text-[10px] text-slate-400 font-mono leading-tight">
             <span className="text-white font-bold">{formatTime(currentTime)}</span>
             <span className="text-[9px]">{formatDate(currentTime)}</span>
          </div>
        </div>

        {/* Center: Search */}
        <form onSubmit={handleSubmit} className="flex-grow w-full md:max-w-xl mx-auto px-1">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search intelligence..."
              className="w-full bg-slate-950/50 border border-white/10 focus:border-brand-500/50 rounded-lg py-1.5 pl-9 pr-4 text-xs md:text-sm text-slate-200 placeholder-slate-500 transition-all outline-none focus:ring-1 focus:ring-brand-500/30"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        {/* Right: User & Auth - THE REQUESTED ICON */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
           {/* Time Display */}
           <div className="flex flex-col items-end border-r border-white/10 pr-6">
             <span className="text-lg font-bold text-white font-display leading-none tracking-tight">
               {formatTime(currentTime)}
             </span>
             <span className="text-[9px] uppercase font-bold text-brand-400 tracking-widest">
               {formatDate(currentTime)}
             </span>
           </div>

           {/* LOGIN / SIGN UP BUTTON */}
           <button 
             onClick={onAuthClick}
             className="relative group focus:outline-none"
             aria-label={currentUser ? "User Profile" : "Login or Sign Up"}
           >
              {currentUser ? (
                 <div className="flex items-center gap-3 p-1 pr-4 rounded-full bg-slate-800/50 border border-white/10 hover:border-brand-500/50 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                        <div className="text-xs font-bold text-white leading-none">{currentUser.name}</div>
                        <div className="text-[9px] text-brand-400 uppercase font-bold">{currentUser.role === 'admin' ? 'Administrator' : currentUser.role}</div>
                    </div>
                 </div>
              ) : (
                 <div className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group-hover:border-brand-500/30 relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-brand-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex flex-col items-end z-10">
                        <span className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors">Sign In</span>
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest">Join Now</span>
                    </div>
                    
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white shadow-inner border border-white/5 group-hover:from-brand-600 group-hover:to-brand-700 transition-all z-10">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>

                    {/* Notification Dot */}
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                    </span>
                 </div>
              )}
           </button>
        </div>
      </div>
    </header>
  );
}
