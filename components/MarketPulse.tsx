
import React, { useEffect, useState } from 'react';
import { Continent, Category, Language, MarketPulseReport } from '../types';
import { fetchMarketPulse } from '../geminiService';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CONTINENTS, CATEGORIES, SUB_CATEGORIES } from '../constants';

interface MarketPulseProps {
  continent: Continent;
  category: Category;
  language: Language;
}

const COLORS = ['#06b6d4', '#10b981', '#f43f5e', '#a78bfa', '#f59e0b'];

const MarketPulse: React.FC<MarketPulseProps> = ({ continent: initialContinent, category: initialCategory, language }) => {
  const [report, setReport] = useState<MarketPulseReport | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Local state for deeper filtering within the dashboard
  const [activeContinent, setActiveContinent] = useState<Continent>(initialContinent);
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');

  useEffect(() => {
    // Sync with props if they change
    setActiveContinent(initialContinent);
    setActiveCategory(initialCategory);
    setActiveSubCategory(''); // Reset sub on main cat change
  }, [initialContinent, initialCategory]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchMarketPulse(activeContinent, activeCategory, language, activeSubCategory);
      setReport(data);
      setLoading(false);
    };
    load();
  }, [activeContinent, activeCategory, activeSubCategory, language]);

  // Available Sub-categories for current category
  const availableSubs = SUB_CATEGORIES[activeCategory] || [];

  // === EXPORT HANDLERS ===
  const downloadJSON = () => {
      if (!report) return;
      const dataStr = JSON.stringify(report, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `market_pulse_${activeCategory}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
      if (!report) return;
      const headers = "Metric,Value,Trend\n";
      const rows = report.specificMetrics.map(m => `${m.label},"${m.value}",${m.trend}`).join("\n");
      const compHeaders = "\n\nCompetitor,Movement,Market Share,Activity\n";
      const compRows = report.competitors.map(c => `"${c.name}",${c.movement},${c.marketShare}%,"${c.recentActivity}"`).join("\n");
      
      const csvContent = `Report,${report.sector} - ${report.region}\nSentiment,${report.sentimentScore}\n\n` + headers + rows + compHeaders + compRows;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `market_stats_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const printPDF = () => {
      window.print();
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-12 mb-8 animate-pulse flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-brand-400 font-bold uppercase tracking-widest text-sm">Aggregating Market Signals...</div>
        <div className="text-slate-500 text-xs mt-2 font-mono">Running Real-time Calculations</div>
      </div>
    );
  }

  if (!report) return null;

  const shareOfVoice = report.shareOfVoice || [];
  const competitors = report.competitors || [];
  const metrics = report.specificMetrics || [];

  return (
    <div className="space-y-6 animate-fade-in mb-12 print:text-black">
      {/* Internal Filter Bar for Market Pulse */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-white/10 print:hidden">
         <div className="flex items-center gap-3 w-full lg:w-auto">
             <div className="bg-brand-500/10 p-2 rounded-lg text-brand-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Market Pulse</h2>
                <p className="text-[10px] text-slate-400">Deep Sector Analytics & Calculations</p>
             </div>
         </div>
         
         <div className="flex flex-wrap gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar justify-center lg:justify-end items-center">
            {/* Filters */}
            <select 
               value={activeContinent}
               onChange={(e) => setActiveContinent(e.target.value as Continent)}
               className="bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-brand-500"
            >
                {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
               value={activeCategory}
               onChange={(e) => setActiveCategory(e.target.value as Category)}
               className="bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-brand-500"
            >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {availableSubs.length > 0 && (
                <select 
                   value={activeSubCategory}
                   onChange={(e) => setActiveSubCategory(e.target.value)}
                   className="bg-slate-900 border border-brand-500/30 rounded-lg px-3 py-2 text-xs text-brand-300 font-bold outline-none focus:border-brand-500 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                >
                    <option value="">All Topics</option>
                    {availableSubs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
            )}

            {/* Export Actions */}
            <div className="flex items-center gap-1 pl-4 border-l border-white/10 ml-2">
                <button onClick={downloadCSV} title="Download CSV" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </button>
                <button onClick={downloadJSON} title="Download JSON" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </button>
                <button onClick={printPDF} title="Print / Save PDF" className="p-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-white transition-colors shadow-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </button>
            </div>
         </div>
      </div>

      {/* KPI Cards / Calculations */}
      <div id="report-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-2xl border-t border-white/10 hover:bg-white/5 transition-colors print:border print:border-black print:text-black">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">{metric.label}</span>
                    <div className="flex items-end justify-between">
                        <span className="text-xl md:text-2xl font-bold text-white font-mono print:text-black">{metric.value}</span>
                        {metric.trend === 'up' && <span className="text-emerald-400 text-xs font-bold mb-1">▲</span>}
                        {metric.trend === 'down' && <span className="text-rose-400 text-xs font-bold mb-1">▼</span>}
                        {metric.trend === 'neutral' && <span className="text-slate-400 text-xs font-bold mb-1">●</span>}
                    </div>
                </div>
            ))}
            {/* Fillers if not enough metrics returned */}
            {metrics.length < 4 && (
                <div className="glass-panel p-4 rounded-2xl border-t border-white/10 print:border print:border-black">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Sentiment</span>
                    <div className="flex items-end justify-between">
                        <span className="text-xl md:text-2xl font-bold text-white font-mono print:text-black">{report.sentimentScore}%</span>
                        <span className="text-emerald-400 text-xs font-bold mb-1">Pos</span>
                    </div>
                </div>
            )}
        </div>

        {/* Main Stats Block */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-brand-500 col-span-1 md:col-span-2 print:border">
            <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sector Volatility Analysis</h3>
            <div className="flex items-end mb-2">
                <span className="text-4xl font-bold text-white font-mono print:text-black">{report.volatilityIndex || 0}</span>
                <span className="text-sm text-slate-500 mb-1 ml-1">VIX</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-2 print:bg-gray-300">
                <div className={`h-full ${report.volatilityIndex > 50 ? 'bg-rose-500' : 'bg-brand-500'} print:bg-black`} style={{ width: `${report.volatilityIndex || 0}%` }}></div>
            </div>
            <p className="text-xs text-slate-400">
                {report.volatilityIndex > 60 ? 'High fluctuation expected. Hedge accordingly.' : 'Market is currently stable for new entry.'}
            </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-l-4 border-emerald-500 col-span-1 md:col-span-2 relative overflow-hidden print:border">
            <div className="absolute right-0 top-0 p-6 opacity-10">
                <svg className="w-24 h-24 text-white print:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Strategic AI Recommendation</h3>
            <div className="text-3xl font-bold text-emerald-400 font-display uppercase tracking-tight print:text-black">{report.strategicAction || "HOLD"}</div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2 max-w-[90%] print:text-gray-600">{report.emergingTrend || "Analyzing market data..."}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Share of Voice */}
            <div className="glass-panel rounded-3xl p-6 lg:col-span-1 print:break-inside-avoid print:border">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center print:text-black">
                <span className="w-2 h-2 bg-brand-500 rounded-full mr-2"></span> Market Share Distribution
            </h3>
            <div className="h-[200px] w-full relative print:hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={shareOfVoice}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {shareOfVoice.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-white">{shareOfVoice.length}</span>
                        <span className="text-[10px] text-slate-500 uppercase">Top Players</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {shareOfVoice.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center print:text-black">
                        <span className="w-2 h-2 rounded-full mr-2 print:border print:border-black" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        {item.name}
                    </span>
                    <span className="font-mono text-slate-500 print:text-black">{item.value}%</span>
                    </div>
                ))}
            </div>
            </div>

            {/* Competitor Analysis - Top Companies */}
            <div className="glass-panel rounded-3xl p-6 lg:col-span-2 print:break-inside-avoid print:border">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center print:text-black">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span> 
                    Top Companies in {activeContinent}
                </h3>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase font-bold print:border print:bg-white print:text-black">{activeCategory}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 print:border-black">
                    <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">Entity</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">HQ</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">Momentum</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">Share</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">Key Activity</th>
                    </tr>
                </thead>
                <tbody>
                    {competitors.map((comp, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors print:border-gray-300">
                        <td className="py-4 px-2 font-bold text-white font-display print:text-black">{comp.name}</td>
                        <td className="py-4 px-2 text-xs text-slate-400 print:text-gray-600">{comp.headquarters || "Global"}</td>
                        <td className="py-4 px-2">
                            {comp.movement === 'up' && <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded print:text-black print:bg-transparent">▲ Rising</span>}
                            {comp.movement === 'down' && <span className="text-rose-400 text-xs font-bold bg-rose-500/10 px-2 py-1 rounded print:text-black print:bg-transparent">▼ Falling</span>}
                            {comp.movement === 'stable' && <span className="text-slate-400 text-xs font-bold bg-slate-500/10 px-2 py-1 rounded print:text-black print:bg-transparent">● Stable</span>}
                        </td>
                        <td className="py-4 px-2 font-mono text-slate-300 print:text-black">{comp.marketShare}%</td>
                        <td className="py-4 px-2 text-xs text-slate-400 max-w-[150px] truncate print:text-gray-600">{comp.recentActivity}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            
            <div className="mt-6 p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-start space-x-3 print:border print:border-black print:bg-white">
                <svg className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0 print:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                    <h4 className="text-xs font-bold text-brand-400 uppercase mb-1 print:text-black">Analyst Note</h4>
                    <p className="text-xs text-slate-300 leading-relaxed print:text-gray-800">{report.emergingTrend}</p>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
