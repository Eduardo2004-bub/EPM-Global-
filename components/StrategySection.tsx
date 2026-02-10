
import React, { useState } from 'react';
import { Language, Continent, BusinessValidation } from '../types';
import { validateBusinessIdea } from '../geminiService';

interface StrategySectionProps {
  language: Language;
  continent: Continent;
}

const StrategySection: React.FC<StrategySectionProps> = ({ language, continent }) => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BusinessValidation | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    try {
      const data = await validateBusinessIdea(idea, continent, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const reportText = `
EPM INNOVATION REPORT
---------------------
Hypothesis: ${idea}
Region: ${continent}
Feasibility Score: ${result.score}/100

ANALYSIS
${result.analysis}

TAM ESTIMATE
${result.marketSizeEstimate}

RISKS
${result.risks.map(r => "- " + r).join('\n')}

OPPORTUNITIES
${result.opportunities.map(o => "- " + o).join('\n')}
    `;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `innovation_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in print:text-black">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        {/* Input Panel - Hidden in Print */}
        <div className="lg:col-span-5 flex flex-col gap-6 print:hidden">
           <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

             <div className="flex items-center space-x-4 mb-8 relative z-10">
               <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               </div>
               <div>
                 <h2 className="text-xl font-bold text-white font-display tracking-tight">Innovation Lab</h2>
                 <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">Due Diligence Mode</p>
               </div>
             </div>

             <form onSubmit={handleValidate} className="relative z-10">
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Hypothesis / Venture</label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Enter business hypothesis for validation..."
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:bg-black/60 transition-all resize-none text-sm leading-relaxed mb-6 font-mono"
                />
                <button
                  disabled={loading}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 flex items-center justify-center uppercase tracking-widest text-xs border border-white/10"
                >
                  {loading ? (
                      <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Processing...
                      </span>
                  ) : 'Run Due Diligence'}
                </button>
             </form>
           </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-end gap-2 mb-2 print:hidden">
                  <button onClick={downloadReport} className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-white flex items-center bg-white/5 px-3 py-2 rounded-lg transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download TXT
                  </button>
                  <button onClick={printReport} className="text-xs font-bold uppercase tracking-widest text-white hover:bg-purple-600 flex items-center bg-purple-500 px-3 py-2 rounded-lg transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Print Report
                  </button>
              </div>

              <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden print:border-black print:text-black print:shadow-none">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 print:bg-white print:border-black">
                  <h3 className="font-bold text-white font-display tracking-wide print:text-black">Report: {continent}</h3>
                  <div className="flex items-center bg-black/50 border border-white/10 px-4 py-2 rounded-full print:bg-white print:border-black">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-3 print:text-black">Feasibility</span>
                    <span className={`text-xl font-bold font-mono ${result.score > 70 ? 'text-emerald-400' : result.score > 40 ? 'text-amber-400' : 'text-rose-400'} print:text-black`}>
                      {result.score}/100
                    </span>
                  </div>
                </div>
                
                {/* Executive Summary */}
                <div className="p-8 border-b border-white/5 print:border-black">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 print:text-black">Executive Summary</h4>
                   <p className="text-slate-300 leading-relaxed font-light text-lg print:text-black">{result.analysis}</p>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-2 border-b border-white/5 print:border-black">
                   <div className="p-6 border-r border-white/5 print:border-black">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 print:text-black">TAM Estimate</h4>
                      <p className="text-xl font-bold text-white font-mono print:text-black">{result.marketSizeEstimate || "Calculating..."}</p>
                   </div>
                   <div className="p-6">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 print:text-black">Competition</h4>
                      <p className="text-sm text-slate-300 print:text-black">
                        {(result.competitorLandscape || []).length > 0 ? result.competitorLandscape?.slice(0,3).join(", ") : "Analyzing..."}
                      </p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block">
                 <div className="glass-panel rounded-3xl border border-white/10 p-6 shadow-lg bg-rose-500/5 print:bg-white print:border-black print:mb-4">
                   <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-5 flex items-center print:text-black">
                     <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 shadow-[0_0_10px_#f43f5e] print:hidden"></span>
                     Risk Assessment
                   </h4>
                   <ul className="space-y-4">
                     {(result.risks || []).map((r, i) => (
                       <li key={i} className="text-sm text-slate-300 flex items-start border-l border-rose-500/30 pl-3 print:text-black print:border-black">
                         {r}
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div className="glass-panel rounded-3xl border border-white/10 p-6 shadow-lg bg-emerald-500/5 print:bg-white print:border-black">
                   <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-5 flex items-center print:text-black">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_10px_#34d399] print:hidden"></span>
                     Opportunity Vectors
                   </h4>
                   <ul className="space-y-4">
                     {(result.opportunities || []).map((o, i) => (
                       <li key={i} className="text-sm text-slate-300 flex items-start border-l border-emerald-500/30 pl-3 print:text-black print:border-black">
                         {o}
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center glass-panel rounded-3xl border border-dashed border-white/10 p-12 text-center text-slate-500 print:hidden">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               </div>
               <p className="font-light text-lg font-display tracking-wide">Awaiting hypothesis for B2B validation.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategySection;
