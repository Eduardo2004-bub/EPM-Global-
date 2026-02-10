
import React from 'react';
import { AppView, Language } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onNavigate, language, onLanguageChange }) => {
  const t = TRANSLATIONS[language];

  // Grouped Menu Logic
  const generalItems = [
    { id: AppView.FEED, label: t.latestNews || 'Intelligence Feed', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { id: AppView.TV, label: 'Live TV Intel', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: AppView.COMMUNITY, label: t.communityTitle || 'Global Network', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  const businessItems = [
    { id: AppView.RISK_CENTER, label: 'Risk Center (B2B)', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: AppView.MARKET_PULSE, label: 'Market Pulse', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: AppView.INNOVATION, label: 'Innovation Lab', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: AppView.ENTERPRISE, label: 'Enterprise API', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: AppView.VERIFICATION, label: 'Get Verified', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const aiItems = [
    { id: AppView.AI_CHAT, label: t.aiChatTitle || 'AI Analyst Core', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#0f172a] border-r border-white/10 z-[70] transform transition-transform duration-300 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-display">System Menu</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-6 px-4 space-y-6 custom-scroll">
          
          {/* General Section */}
          <div>
            <div className="px-4 mb-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest">{t.sectionGeneral || 'Global Intelligence'}</div>
            <div className="space-y-1">
                {generalItems.map((item) => (
                    <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all border ${
                        currentView === item.id 
                        ? 'bg-brand-500/10 border-brand-500/50 text-white shadow-lg' 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                    <svg className={`w-5 h-5 mr-4 ${currentView === item.id ? 'text-brand-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                    </button>
                ))}
            </div>
          </div>

          {/* Business Area Section */}
          <div>
            <div className="px-4 mb-3 text-[10px] uppercase font-bold text-brand-400 tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                {t.sectionBusiness || 'Business Area'}
            </div>
            <div className="space-y-1">
                {businessItems.map((item) => (
                    <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all border ${
                        currentView === item.id 
                        ? 'bg-emerald-900/20 border-emerald-500/50 text-white shadow-lg' 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                    <svg className={`w-5 h-5 mr-4 ${currentView === item.id ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                    </button>
                ))}
            </div>
          </div>

           {/* AI Section */}
           <div>
            <div className="px-4 mb-3 text-[10px] uppercase font-bold text-purple-400 tracking-widest">{t.sectionAI || 'AI Core'}</div>
            <div className="space-y-1">
                {aiItems.map((item) => (
                    <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all border ${
                        currentView === item.id 
                        ? 'bg-purple-900/20 border-purple-500/50 text-white shadow-lg' 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                    <svg className={`w-5 h-5 mr-4 ${currentView === item.id ? 'text-purple-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                    </button>
                ))}
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-3 tracking-widest">Interface Language</p>
          <LanguageSwitcher current={language} onSelect={(l) => { onLanguageChange(l); }} />
          <div className="mt-6 text-center text-[10px] text-slate-600 font-mono">
             EPM GLOBAL v2.5.1 <br/> BUSINESS EDITION
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
