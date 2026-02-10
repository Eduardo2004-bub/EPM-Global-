
import React, { useState, useEffect } from 'react';
import { Language, UserLocation, BroadcastProgram, Continent, BroadcastType } from '../types';
import { fetchBroadcastPrograms } from '../geminiService';
import { CONTINENTS } from '../constants';

interface TVSectionProps {
  language: Language;
  userLocation: UserLocation;
}

const TVSection: React.FC<TVSectionProps> = ({ language, userLocation }) => {
  const [selectedProgram, setSelectedProgram] = useState<BroadcastProgram | null>(null);
  const [programs, setPrograms] = useState<BroadcastProgram[]>([]);
  const [filterContinent, setFilterContinent] = useState<Continent>(Continent.GLOBAL);

  useEffect(() => {
    loadPrograms();
  }, [filterContinent]);

  const loadPrograms = async () => {
    try {
      const data = await fetchBroadcastPrograms(filterContinent, language);
      setPrograms(data);
      // Auto-select first channel if none selected
      if (!selectedProgram && data.length > 0) {
          setSelectedProgram(data[0]);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const getEmbedUrl = (originalUrl: string | undefined) => {
      if (!originalUrl) return '';
      // Ensure autoplay is on and controls are visible
      return `${originalUrl}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6 h-[80vh] animate-fade-in">
      {/* Sidebar Channel List (Cleaner Look) */}
      <div className="lg:col-span-1 glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl border-t border-white/10">
         <div className="p-5 border-b border-white/10 bg-white/5">
            <h2 className="text-[10px] font-bold uppercase text-brand-400 tracking-widest mb-3 font-display">Live Channels</h2>
            <div className="relative">
                <select 
                value={filterContinent}
                onChange={(e) => setFilterContinent(e.target.value as Continent)}
                className="w-full bg-slate-900 border border-white/20 rounded-xl p-3 text-sm font-bold text-white focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
                >
                {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
         </div>
         <div className="overflow-y-auto flex-grow p-2 space-y-1">
            {programs.map(prog => (
               <button 
                 key={prog.id}
                 onClick={() => setSelectedProgram(prog)}
                 className={`group w-full text-left flex items-center p-3 rounded-xl transition-all border ${selectedProgram?.id === prog.id ? 'bg-brand-600 text-white border-brand-500 shadow-lg' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
               >
                 <span className={`w-2 h-2 rounded-full mr-3 ${selectedProgram?.id === prog.id ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></span>
                 <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate font-display">{prog.title}</p>
                 </div>
               </button>
            ))}
         </div>
      </div>

      {/* Main Player (Direct, Clean, No Overlays) */}
      <div className="lg:col-span-3 bg-black rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10">
         {selectedProgram && selectedProgram.videoUrl ? (
            <div className="relative flex-grow w-full h-full bg-black">
                <iframe 
                src={getEmbedUrl(selectedProgram.videoUrl)} 
                className="w-full h-full absolute inset-0" 
                frameBorder="0" 
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={selectedProgram.title}
                ></iframe>
            </div>
         ) : (
            <div className="flex-grow flex items-center justify-center bg-black text-slate-500">
                <p className="text-sm font-bold uppercase tracking-widest">Select a channel to watch</p>
            </div>
         )}
         
         {/* Simple Player Footer */}
         {selectedProgram && (
            <div className="p-4 bg-[#0f172a] border-t border-white/10 flex items-center justify-between">
               <div>
                 <h1 className="text-lg font-bold text-white font-display tracking-tight">{selectedProgram.title}</h1>
                 <p className="text-xs text-brand-400 uppercase tracking-widest">{selectedProgram.location}</p>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                 <span className="text-xs font-bold text-white uppercase">Live Broadcast</span>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default TVSection;
