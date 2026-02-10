
import React, { useState } from 'react';
import { NewsArticle, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ArticleDetailProps {
  article: NewsArticle;
  language: Language;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, language, onBack }) => {
  // If the image is from our stock provider (LoremFlickr), we can request a higher resolution.
  const highResUrl = article.imageUrl.includes('loremflickr') 
    ? article.imageUrl.replace('640/360', '1280/720') 
    : article.imageUrl;
    
  const [currentImageUrl] = useState(highResUrl);

  // FULL CONTENT RENDER (NO LIMITS)
  // We display exactly what the AI generated (10,000+ chars)
  const content = article.content;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-6 pb-20">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-brand-500 group-hover:shadow-[0_0_20px_#06b6d4] transition-all duration-300 border border-white/10">
            <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </div>
        Return to Matrix
      </button>

      <article className="glass-panel rounded-3xl overflow-hidden border-t border-white/20 shadow-2xl relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Hero Image Section */}
        <div className="relative w-full aspect-[21/9] bg-slate-900">
           <img src={currentImageUrl} className="w-full h-full object-cover opacity-90" alt="Hero" loading="eager" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
           
           <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                   {article.category}
                 </span>
                 <span className="px-3 py-1 bg-black/40 backdrop-blur border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full">
                   {article.continent}
                 </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight font-display text-shadow-lg max-w-4xl">
                {article.title}
              </h1>
           </div>
        </div>

        {/* Meta Data & Source Link Bar */}
        <div className="px-8 md:px-12 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 backdrop-blur-md">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-accent-500 rounded-full p-[2px]">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="font-bold text-white text-lg font-display">{article.author.charAt(0)}</span>
                  </div>
               </div>
               <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{article.author}</p>
                  <p className="text-xs text-slate-400 font-mono">ID: {article.id.split('-')[1]} • {new Date(article.timestamp).toLocaleDateString()}</p>
               </div>
            </div>
            
            {article.sourceUrl && (
              <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center px-6 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105">
                Visit Original Source
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            )}
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 max-w-4xl mx-auto relative z-10">
           {/* Executive Summary */}
           <div className="relative mb-12">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-400 to-accent-500 rounded-full"></div>
             <div className="pl-6 py-2">
                <h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">Executive Summary</h3>
                <p className="text-xl md:text-2xl font-light text-white leading-relaxed font-display">{article.summary}</p>
             </div>
           </div>

           {/* Main Text - Long Form (Full Whitepaper Mode) */}
           <div className="prose prose-invert prose-lg max-w-none">
             <div className="whitespace-pre-wrap leading-loose text-slate-300 font-light text-justify text-base md:text-lg">
               {content}
             </div>
           </div>

           {/* Footer Action */}
           <div className="mt-16 pt-10 border-t border-white/10 flex flex-col items-center gap-4">
             <p className="text-xs text-slate-500 uppercase tracking-widest">End of Comprehensive Report</p>
             <button onClick={onBack} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors border border-white/10 uppercase tracking-widest text-sm">
               Return to Feed
             </button>
           </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
