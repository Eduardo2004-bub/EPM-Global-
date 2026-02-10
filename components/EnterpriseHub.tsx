
import React from 'react';
import { Language } from '../types';

const EnterpriseHub: React.FC<{ language: Language }> = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-16">
         <div className="inline-block px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-bold uppercase tracking-widest mb-6">
            EPM Global API v2.0
         </div>
         <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-6">
            Power Your Platform with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-500">Corporate Intelligence</span>
         </h1>
         <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Integrate real-time market signals, sentiment analysis, and competitor tracking directly into your CRM, ERP, or Internal Dashboards.
         </p>
         
         <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <button className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/25">
               Get API Key
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
               View Documentation
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
         {/* Startup Plan */}
         <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col">
            <h3 className="text-xl font-bold text-white font-display">Startup</h3>
            <div className="text-4xl font-bold text-white mt-4 font-mono">$99<span className="text-sm text-slate-500 font-sans">/mo</span></div>
            <p className="text-sm text-slate-400 mt-2">For early stage validation.</p>
            
            <ul className="mt-8 space-y-4 flex-grow">
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-emerald-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Market Pulse Dashboard</li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-emerald-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 5 Innovation Runs/mo</li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-emerald-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Basic News Feed</li>
            </ul>
            <button className="w-full mt-8 py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white font-bold transition-all">Start Trial</button>
         </div>

         {/* Corporate Plan */}
         <div className="glass-panel p-8 rounded-3xl border border-brand-500/50 relative flex flex-col shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-gradient-to-b from-brand-900/10 to-transparent">
            <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase">Popular</div>
            <h3 className="text-xl font-bold text-white font-display">Corporate</h3>
            <div className="text-4xl font-bold text-white mt-4 font-mono">$499<span className="text-sm text-slate-500 font-sans">/mo</span></div>
            <p className="text-sm text-slate-400 mt-2">For data-driven teams.</p>
            
            <ul className="mt-8 space-y-4 flex-grow">
               <li className="flex items-center text-sm text-white"><svg className="w-4 h-4 text-brand-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> <b>Everything in Startup</b></li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-brand-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 50 Innovation Runs/mo</li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-brand-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> API Access (10k req)</li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-brand-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Competitor Tracking</li>
            </ul>
            <button className="w-full mt-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-lg">Subscribe</button>
         </div>

         {/* Enterprise Plan */}
         <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col">
            <h3 className="text-xl font-bold text-white font-display">Enterprise</h3>
            <div className="text-4xl font-bold text-white mt-4 font-mono">Custom</div>
            <p className="text-sm text-slate-400 mt-2">Full Microsoft Integration.</p>
            
            <ul className="mt-8 space-y-4 flex-grow">
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-accent-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Unlimited API</li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-accent-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Dedicated Azure Node</li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-accent-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Teams & Dynamics Plugin</li>
               <li className="flex items-center text-sm text-slate-300"><svg className="w-4 h-4 text-accent-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 24/7 Priority Support</li>
            </ul>
            <button className="w-full mt-8 py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white font-bold transition-all">Contact Sales</button>
         </div>
      </div>

      {/* Integration Showcase */}
      <div className="glass-panel rounded-3xl p-12 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/20 to-purple-900/20 z-0"></div>
         <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white font-display mb-8">Seamless Integration Ecosystem</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center space-x-2 text-xl font-bold text-white"><span className="w-8 h-8 bg-blue-500 rounded block"></span> <span>Microsoft Teams</span></div>
               <div className="flex items-center space-x-2 text-xl font-bold text-white"><span className="w-8 h-8 bg-blue-700 rounded block"></span> <span>Dynamics 365</span></div>
               <div className="flex items-center space-x-2 text-xl font-bold text-white"><span className="w-8 h-8 bg-yellow-500 rounded block"></span> <span>Power BI</span></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EnterpriseHub;
