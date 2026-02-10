
import React from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  current: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ current, onSelect }) => {
  return (
    <div className="flex items-center space-x-1 border border-slate-200 rounded p-1">
      {Object.values(Language).map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
            current === lang 
              ? 'bg-slate-800 text-white' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
