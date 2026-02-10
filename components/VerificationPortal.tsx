
import React, { useState } from 'react';
import { Language } from '../types';

const VerificationPortal: React.FC<{ language: Language }> = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Journalist');
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    // Mock processing time
    setTimeout(() => {
        setStep(3);
        setIsVerified(true);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white font-display mb-4">Professional Verification</h1>
            <p className="text-slate-400">Join the elite network of verified analysts and journalists. Monetize your intel.</p>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 relative">
            {/* Steps Progress */}
            <div className="flex border-b border-white/10">
                <div className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-widest ${step >= 1 ? 'bg-brand-500/20 text-brand-400' : 'text-slate-600'}`}>1. Credentials</div>
                <div className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-widest ${step >= 2 ? 'bg-brand-500/20 text-brand-400' : 'text-slate-600'}`}>2. Ethics Quiz</div>
                <div className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-widest ${step >= 3 ? 'bg-brand-500/20 text-brand-400' : 'text-slate-600'}`}>3. Status</div>
            </div>

            <div className="p-12 min-h-[400px] flex flex-col items-center justify-center">
                {step === 1 && (
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Role Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Journalist', 'Analyst', 'Executive', 'Academic'].map(r => (
                                    <button 
                                        type="button"
                                        key={r}
                                        onClick={() => setRole(r)}
                                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${role === r ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-white/5'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">LinkedIn / Portfolio URL</label>
                            <input required type="url" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Work Email</label>
                            <input required type="email" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500" placeholder="name@organization.com" />
                        </div>
                        <button type="submit" className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-brand-500/20 transition-all">
                            Start Verification
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <div className="text-center w-full max-w-md">
                        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                        <h3 className="text-xl font-bold text-white mb-2">Analyzing Digital Footprint...</h3>
                        <p className="text-slate-400 text-sm">Our AI is cross-referencing your portfolio with global databases.</p>
                    </div>
                )}

                {step === 3 && isVerified && (
                    <div className="text-center w-full max-w-md animate-fade-in">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Verification Complete</h3>
                        <p className="text-slate-300 mb-8">You are now a Verified {role} on EPM Global. You can now access the Corporate Risk API and publish premium insights.</p>
                        <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl uppercase tracking-widest text-xs border border-white/10">
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default VerificationPortal;
