
import React, { useState, useEffect } from 'react';
import { AuthService } from '../authService';
import { UserProfile } from '../types';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);

  // 1. HARD-CODED LOGIN SCREEN
  if (!isAuthenticated) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (AuthService.verifyAdmin(email, password)) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setError('ACCESS DENIED: Invalid Administrative Credentials');
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
           <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/50">
                 <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
           </div>
           <h1 className="text-2xl font-bold text-white text-center mb-2 font-display">System Root</h1>
           <p className="text-slate-500 text-center text-xs uppercase tracking-widest mb-8">Restricted Access // Level 5</p>

           {error && (
             <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-xs font-bold text-center animate-pulse">
               {error}
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-5">
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Admin Identity</label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 text-white focus:border-red-500 outline-none font-mono text-sm"
                   placeholder="root@system"
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Secure Key</label>
                 <input 
                   type="password" 
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 text-white focus:border-red-500 outline-none font-mono text-sm"
                   placeholder="••••••••••••"
                 />
              </div>
              <button className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded uppercase tracking-widest text-xs transition-colors shadow-lg">
                Authenticate
              </button>
           </form>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD LOGIC
  const loadData = async () => {
    const u = await AuthService.getAllUsers();
    setUsers(u);
  };

  const handleApproveJournalist = async (id: string) => {
    await AuthService.updateUserRole(id, 'journalist_approved');
    loadData(); // Refresh
  };

  const handleRejectJournalist = async (id: string) => {
    await AuthService.updateUserRole(id, 'reader');
    loadData();
  };

  // 3. MAIN DASHBOARD UI
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
       {/* Sidebar */}
       <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800">
             <h2 className="text-lg font-bold text-white font-display tracking-tight">EPM<span className="text-red-500">ADMIN</span></h2>
             <div className="flex items-center mt-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
               <span className="text-xs text-slate-400 uppercase">System Online</span>
             </div>
          </div>
          <nav className="flex-grow p-4 space-y-2">
             <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>
                Dashboard Overview
             </button>
             <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>
                User Management
             </button>
             <button onClick={() => setActiveTab('content')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'content' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}>
                Content Moderation
             </button>
          </nav>
          <div className="p-4 border-t border-slate-800">
             <button onClick={() => setIsAuthenticated(false)} className="w-full px-4 py-2 border border-slate-700 rounded text-xs uppercase font-bold hover:bg-slate-800 transition-colors">
                Terminate Session
             </button>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-grow p-8 overflow-y-auto">
          {activeTab === 'overview' && (
             <div className="space-y-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-white mb-6">System Overview</h1>
                
                {/* Stats Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-xs uppercase font-bold mb-2">Total Users</div>
                      <div className="text-3xl font-bold text-white">{users.length}</div>
                   </div>
                   <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-xs uppercase font-bold mb-2">Pending Journalists</div>
                      <div className="text-3xl font-bold text-amber-500">{users.filter(u => u.role === 'journalist_pending').length}</div>
                   </div>
                   <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-xs uppercase font-bold mb-2">Approved Journalists</div>
                      <div className="text-3xl font-bold text-emerald-500">{users.filter(u => u.role === 'journalist_approved').length}</div>
                   </div>
                   <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-xs uppercase font-bold mb-2">Content Queue</div>
                      <div className="text-3xl font-bold text-blue-500">12</div>
                   </div>
                </div>

                {/* Activity Chart Placeholder */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-64 flex items-center justify-center">
                    <p className="text-slate-600 font-mono text-sm">Traffic Analysis Chart Loaded via API...</p>
                </div>
             </div>
          )}

          {activeTab === 'users' && (
             <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white mb-6">User Database</h1>
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-500 text-[10px] uppercase font-bold">
                         <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                         {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                               <td className="px-6 py-4">
                                  <div className="font-bold text-white">{user.name}</div>
                                  <div className="text-xs text-slate-500">{user.email}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                     user.role === 'journalist_approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                     user.role === 'journalist_pending' ? 'bg-amber-500/10 text-amber-400' :
                                     user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                                     'bg-slate-700 text-slate-300'
                                  }`}>
                                     {user.role}
                                  </span>
                               </td>
                               <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                                  {new Date(user.joinedAt).toLocaleDateString()}
                               </td>
                               <td className="px-6 py-4 text-right">
                                  {user.role === 'journalist_pending' && (
                                     <div className="flex justify-end gap-2">
                                        <button onClick={() => handleApproveJournalist(user.id)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded">Approve</button>
                                        <button onClick={() => handleRejectJournalist(user.id)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded">Reject</button>
                                     </div>
                                  )}
                                  {user.role === 'reader' && (
                                     <button className="text-slate-500 hover:text-white text-xs font-bold">Details</button>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === 'content' && (
              <div className="animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Moderation Queue Empty</h2>
                  <p className="text-slate-500 max-w-sm">All pending articles have been processed by the automated fact-checking layer.</p>
              </div>
          )}
       </div>
    </div>
  );
};

export default AdminPanel;
