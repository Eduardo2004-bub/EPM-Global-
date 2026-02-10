
import React, { useState, useMemo } from 'react';
import { NewsArticle, Language } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  language: Language;
  onReadMore: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = React.memo(({ article, language, onReadMore }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Robust Date Handling to prevent "Invalid Date" crashes
  const dateDisplay = useMemo(() => {
    try {
      const date = new Date(article.timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) {
          return "Recently";
      }

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return "Just Now";
      if (diffHours < 24 && now.getDate() === date.getDate()) return `Today, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      if (diffDays === 1 || (diffDays === 0 && now.getDate() !== date.getDate())) return "Yesterday";
      
      return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return "System Date";
    }
  }, [article.timestamp]);

  // Sentiment Logic
  const sentimentConfig = useMemo(() => {
    switch (article.sentiment) {
      case 'positive':
        return {
          color: 'text-emerald-300',
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-400/30',
          icon: (
            <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )
        };
      case 'negative':
        return {
          color: 'text-rose-300',
          bg: 'bg-rose-500/20',
          border: 'border-rose-400/30',
          icon: (
            <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )
        };
      default: // neutral
        return {
          color: 'text-brand-200',
          bg: 'bg-brand-500/20',
          border: 'border-brand-400/30',
          icon: (
            <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
            </svg>
          )
        };
    }
  }, [article.sentiment]);

  return (
    <div 
      onClick={() => onReadMore(article)}
      className="group glass-panel rounded-3xl overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 cursor-pointer flex flex-col h-full border-t border-white/10"
    >
      {/* Optimized Image Loader */}
      <div className={`relative aspect-[16/9] overflow-hidden ${imageError ? 'bg-slate-800' : 'bg-slate-900'}`}>
        
        {/* Skeleton Pulse (Visible while loading) */}
        {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse z-0"></div>
        )}
        
        {/* Fallback if image fails */}
        {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <svg className="w-12 h-12 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">{article.category} Report</span>
            </div>
        ) : (
            <img 
            src={article.imageUrl} 
            alt={article.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`relative z-10 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 ${imageLoaded ? 'opacity-100 grayscale-0' : 'opacity-0 grayscale'}`}
            />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 z-20"></div>
        
        <div className="absolute top-4 left-4 z-30">
          <span className={`px-3 py-1 backdrop-blur-md border text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center ${sentimentConfig.bg} ${sentimentConfig.border} ${sentimentConfig.color}`}>
            {article.category}
            {sentimentConfig.icon}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative z-30 -mt-8">
        <div className="flex items-center justify-between mb-3 opacity-80">
           <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest font-display truncate max-w-[50%]">{article.author}</span>
           <span className="text-[10px] text-slate-400 font-mono flex items-center">
             <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-2"></span>
             {dateDisplay}
           </span>
        </div>
        
        <h3 className="text-lg font-bold text-white leading-tight mb-3 group-hover:text-brand-300 transition-colors line-clamp-2 font-display">
          {article.title}
        </h3>
        
        <p className="text-sm text-slate-400 font-light leading-relaxed line-clamp-3 mb-6 flex-grow">
          {article.summary}
        </p>
        
        <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-end">
           <span className="text-xs font-bold text-white group-hover:text-brand-400 flex items-center transition-colors uppercase tracking-wider">
             Analyze Data
             <svg className="w-3 h-3 ml-2 group-hover:translate-x-2 transition-transform text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
           </span>
        </div>
      </div>
    </div>
  );
});

export default NewsCard;
