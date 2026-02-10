
import React, { useState } from 'react';
import { CorporateProfile, CorporateRiskReport, Language } from '../types';
import { calculateCorporateRisk } from '../geminiService';

const RiskCenter: React.FC<{ language: Language }> = ({ language }) => {
  const [profile, setProfile] = useState<CorporateProfile>({
    companyName: '',
    sector: 'Logistics',
    keyLocations: [],
    supplyChainFocus: ''
  });
  
  const [report, setReport] = useState<CorporateRiskReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  const handleRunRisk = async () => {
    if (!profile.companyName || profile.keyLocations.length === 0) return;
    setLoading(true);
    const data = await calculateCorporateRisk(profile, language);
    setReport(data);
    setLoading(false);
  };

  const addLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if(locationInput) {
        setProfile({...profile, keyLocations: [...profile.keyLocations, locationInput]});
        setLocationInput('');
    }
  };

  // Safe access to alerts
  const alerts = report?.activeAlerts || [];

  return (
    <div className="max-w-7xl mx-auto py-8 animate-fade-in pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white font-display">Risk Center</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time threat matrix & opportunity scanning.</p>
        </div>
        <div className="flex items-center space-x-2 bg-rose-900/20 border border-rose-500/30 px-4 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Live Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Profile Configuration */}
        <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-lg">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    Corporate Profile
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Company Name</label>
                        <input 
                           className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-brand-500/50 outline-none"
                           value={profile.companyName}
                           onChange={e => setProfile({...profile, companyName: e.target.value})}
                           placeholder="Ex: Maersk, Shell, Tesla..."
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Sector</label>
                        <select 
                           className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-brand-500/50 outline-none appearance-none"
                           value={profile.sector}
                           onChange={e => setProfile({...profile, sector: e.target.value})}
                        >
                            <option>Logistics & Shipping</option>
                            <option>Finance & Banking</option>
                            <option>Energy (Oil & Gas)</option>
                            <option>Technology</option>
                            <option>Agriculture</option>
                            <option>Manufacturing</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Key Operations (Cities/Regions)</label>
                        <form onSubmit={addLocation} className="flex gap-2 mb-2">
                            <input 
                                className="flex-grow bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-brand-500/50 outline-none"
                                value={locationInput}
                                onChange={e => setLocationInput(e.target.value)}
                                placeholder="Add location..."
                            />
                            <button type="submit" className="bg-white/10 hover:bg-white/20 px-3 rounded-xl text-white">+</button>
                        </form>
                        <div className="flex flex-wrap gap-2">
                            {profile.keyLocations.map((loc, i) => (
                                <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-white/5 flex items-center">
                                    {loc}
                                    <button onClick={() => setProfile({...profile, keyLocations: profile.keyLocations.filter(l => l !== loc)})} className="ml-2 text-slate-500 hover:text-white">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Critical Supply Chain Dependencies</label>
                        <textarea 
                           className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-brand-500/50 outline-none h-20 resize-none"
                           value={profile.supplyChainFocus}
                           onChange={e => setProfile({...profile, supplyChainFocus: e.target.value})}
                           placeholder="Ex: Semiconductor chips from Taiwan, Wheat from Ukraine..."
                        />
                    </div>

                    <button 
                        onClick={handleRunRisk}
                        disabled={loading || !profile.companyName}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-xs mt-4"
                    >
                        {loading ? 'Analyzing Global Feed...' : 'Calculate Risk Exposure'}
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT: Dashboard Display */}
        <div className="lg:col-span-8">
            {report ? (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-rose-500 relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-10"><svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                            <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Operational Risk Score</h3>
                            <div className="flex items-end mt-2">
                                <span className={`text-5xl font-bold font-mono ${report.overallRiskScore > 70 ? 'text-rose-500' : report.overallRiskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {report.overallRiskScore}
                                </span>
                                <span className="text-sm text-slate-500 mb-2 ml-1">/100</span>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-brand-500">
                             <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sector Trend</h3>
                             <div className="text-2xl font-bold text-white mt-3 font-display">{report.sectorTrend}</div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-purple-500">
                             <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Alerts</h3>
                             <div className="text-2xl font-bold text-white mt-3 font-mono">{alerts.length}</div>
                        </div>
                    </div>

                    {/* Executive Brief */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/10">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Executive Briefing</h3>
                        <p className="text-lg text-slate-300 font-light leading-relaxed">
                            {report.executiveBrief}
                        </p>
                    </div>

                    {/* Alert Matrix */}
                    <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Critical Threat Matrix</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {alerts.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No active threats detected in your operational zones.</div>
                            ) : (
                                alerts.map((alert, i) => (
                                    <div key={i} className="p-6 hover:bg-white/5 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-white font-bold text-lg group-hover:text-brand-400 transition-colors">{alert.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                alert.severity === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' : 
                                                alert.severity === 'HIGH' ? 'bg-orange-500 text-white' : 
                                                'bg-yellow-500 text-black'
                                            }`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Impact Analysis</span>
                                                <p className="text-sm text-slate-300">{alert.impactAnalysis}</p>
                                            </div>
                                            <div className="bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/20">
                                                <span className="text-[10px] text-emerald-500 uppercase font-bold block mb-1">Mitigation Strategy</span>
                                                <p className="text-sm text-emerald-100">{alert.mitigationSuggestion}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="h-full glass-panel rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center opacity-60">
                    <svg className="w-20 h-20 text-slate-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h3 className="text-xl font-bold text-white mb-2">Awaiting Profile Configuration</h3>
                    <p className="text-slate-400 max-w-md">Configure your corporate profile on the left to activate the 10-Agent Swarm for a personalized risk assessment.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default RiskCenter;
