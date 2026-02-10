
import React, { useState } from 'react';
import { AuthService } from '../authService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await AuthService.login(email, password);
        onLoginSuccess(user);
        onClose();
      } else {
        // Register returns a pending user
        await AuthService.register(name, email, password);
        setStep('verification'); // Move to verify step
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const user = await AuthService.verifyEmail(email, verificationCode);
        onLoginSuccess(user);
        onClose();
    } catch (err: any) {
        setError(err.message || 'Verification failed.');
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
        const user = await AuthService.loginWithGoogle();
        onLoginSuccess(user);
        onClose();
    } catch (err) {
        setError('Google Authentication failed.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Decorative Header */}
        <div className="h-32 bg-gradient-to-r from-brand-600 to-accent-600 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <h2 className="text-3xl font-bold text-white font-display relative z-10 text-shadow">
                {step === 'verification' ? 'Secure Verify' : (isLogin ? 'Welcome Back' : 'Join EPM Global')}
            </h2>
        </div>

        <div className="p-8">
            {error && (
                <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-bold text-center animate-pulse">
                    {error}
                </div>
            )}

            {step === 'credentials' ? (
                <>
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl flex items-center justify-center shadow-lg transition-all mb-6"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0f172a] px-2 text-slate-500 font-bold">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none transition-colors"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                            <input 
                                required 
                                type="email" 
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none transition-colors"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                            <input 
                                required 
                                type="password" 
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none transition-colors"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                isLogin ? 'Access Account' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            {isLogin ? "Don't have an account?" : "Already verified?"}{' '}
                            <button 
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="text-brand-400 hover:text-brand-300 font-bold underline decoration-brand-400/30 underline-offset-4"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </>
            ) : (
                <form onSubmit={handleVerify} className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <div className="inline-block p-3 rounded-full bg-brand-500/10 mb-4 border border-brand-500/30">
                            <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <p className="text-sm text-slate-300">
                            We sent a secure verification code to <br/><b className="text-white text-lg">{email}</b>. 
                            <br/>
                            <span className="text-[10px] text-brand-400 block mt-3 font-bold uppercase tracking-widest">(Use 123456 for Demo)</span>
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <input 
                            required 
                            type="text" 
                            className="w-full max-w-[200px] bg-slate-900 border border-white/20 rounded-xl px-2 py-4 text-center text-3xl tracking-[0.3em] text-white focus:border-brand-500 outline-none font-mono shadow-inner"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            placeholder="000000"
                            maxLength={6}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-brand-500/20 transition-all"
                    >
                         {loading ? 'Verifying...' : 'Validate & Enter'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setStep('credentials')}
                        className="w-full py-2 text-slate-500 hover:text-white text-xs font-bold"
                    >
                        Back to Login
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
