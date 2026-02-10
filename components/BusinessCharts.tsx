
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { MarketTrend, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface BusinessChartsProps {
  data: MarketTrend[];
  language: Language;
}

const BusinessCharts: React.FC<BusinessChartsProps> = ({ data, language }) => {
  const t = TRANSLATIONS[language];

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-8 mb-12 animate-fade-in border-l-4 border-l-brand-500">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center font-display">
          <svg className="w-5 h-5 mr-3 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          {t.trends}
        </h2>
        <div className="flex space-x-4 text-xs font-bold uppercase tracking-widest text-slate-400">
           <span className="flex items-center"><span className="w-2 h-2 bg-brand-500 rounded-full mr-2 shadow-[0_0_10px_#06b6d4]"></span> {t.priceIndex}</span>
           <span className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span> {t.growth}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="region" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Bar dataKey="priceIndex" radius={[4, 4, 0, 0]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="region" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Line type="monotone" dataKey="avgPriceChange" stroke="#f43f5e" strokeWidth={3} dot={false} activeDot={{r: 6, fill: '#fff'}} />
                <Line type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{r: 6, fill: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BusinessCharts;
