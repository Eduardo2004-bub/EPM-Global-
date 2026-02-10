
import React, { useState } from 'react';
import { Continent, Category, Language, UserLocation, TimeRange } from '../types';
import { CONTINENTS, CATEGORIES, TRANSLATIONS, TIME_RANGES, SUB_CATEGORIES, COUNTRIES_BY_CONTINENT } from '../constants';

interface FilterBarProps {
  language: Language;
  selectedContinent: Continent;
  selectedCountry: string | undefined;
  selectedCategory: Category;
  selectedSubCategory: string | undefined;
  selectedTimeRange: TimeRange;
  userLocation: UserLocation;
  onContinentChange: (c: Continent) => void;
  onCountryChange: (country: string | undefined) => void;
  onCategoryChange: (cat: Category) => void;
  onSubCategoryChange: (sub: string | undefined) => void;
  onTimeRangeChange: (tr: TimeRange) => void;
  onLocationSearch: (loc: string) => void;
  onDetectLocation: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  language, selectedContinent, selectedCountry, selectedCategory, selectedSubCategory, selectedTimeRange, userLocation,
  onContinentChange, onCountryChange, onCategoryChange, onSubCategoryChange, onTimeRangeChange
}) => {
  const t = TRANSLATIONS[language];
  const subs = SUB_CATEGORIES[selectedCategory] || [];
  const countries = COUNTRIES_BY_CONTINENT[selectedContinent] || [];

  return (
    /* COMPACT MARGINS AND SPACING */
    <div className="mb-2 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Top Controls: Region, Country & Time */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-grow overflow-x-auto no-scrollbar">
             {/* Continent Pills (Compact) */}
             <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 mask-linear">
                {CONTINENTS.map((c) => (
                    <button
                    key={c}
                    onClick={() => onContinentChange(c)}
                    className={`whitespace-nowrap px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all border ${
                        selectedContinent === c 
                        ? 'bg-brand-500 text-white border-brand-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                    >
                    {c}
                    </button>
                ))}
             </div>

             {/* Country Selector (Compact) */}
             {countries.length > 0 && (
               <div className="relative group">
                 <select
                   value={selectedCountry || ''}
                   onChange={(e) => onCountryChange(e.target.value || undefined)}
                   className="appearance-none bg-slate-900/80 border border-brand-500/30 text-white text-[10px] font-bold uppercase tracking-wide rounded-lg py-1.5 pl-3 pr-8 hover:bg-slate-800 focus:ring-2 focus:ring-brand-500/50 outline-none transition-all cursor-pointer shadow-lg"
                 >
                   <option value="">{t.allCountries}</option>
                   {countries.map(c => (
                     <option key={c} value={c}>{c}</option>
                   ))}
                 </select>
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-brand-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
               </div>
             )}
           </div>

           <div className="flex items-center p-0.5 bg-slate-900/80 rounded-lg border border-white/5 flex-shrink-0">
              {TIME_RANGES.map((tr) => (
                <button
                  key={tr.value}
                  onClick={() => onTimeRangeChange(tr.value)}
                  className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${
                    selectedTimeRange === tr.value 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {(t as any)[tr.labelKey]}
                </button>
              ))}
           </div>
        </div>

        {/* Categories (Compact) */}
        <div className="glass-panel p-0.5 rounded-xl flex overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
            <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold transition-all rounded-lg ${
                selectedCategory === cat 
                    ? 'bg-white text-slate-900 shadow-md scale-100' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
                {cat}
            </button>
            ))}
        </div>

        {/* Sub-categories (Compact) */}
        {subs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center py-1 animate-fade-in">
            {subs.map((sub) => (
                <button
                key={sub}
                onClick={() => onSubCategoryChange(sub)}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border rounded-full transition-all ${
                    selectedSubCategory === sub 
                    ? 'bg-accent-500/20 border-accent-500 text-accent-300' 
                    : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30'
                }`}
                >
                {sub}
                </button>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
