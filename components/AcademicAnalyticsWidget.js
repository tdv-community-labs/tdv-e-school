import React, { useState, useEffect } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const AcademicAnalyticsWidget = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const chartData = [
    { label: 'Sentyabr', value: 45, color: '#3b82f6' },
    { label: 'Oktyabr', value: 62, color: '#6366f1' },
    { label: 'Noyabr', value: 58, color: '#8b5cf6' },
    { label: 'Dekabr', value: 85, color: '#a855f7' },
    { label: 'Yanvar', value: 94, color: '#10b981' }
  ];

  const maxValue = 100;

  return html`
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 sm:p-8 mt-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <i className="fa-solid fa-chart-simple"></i>
            </span>
            Təhsil Analitikası və İnkişaf
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Son 5 ayın akademik proqresi və qazanılan nailiyyətlər</p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 px-4 py-2 rounded-2xl">
          <i className="fa-solid fa-trophy text-emerald-500 dark:text-emerald-400"></i>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600/70 dark:text-emerald-500/70">Cari Status</div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Qızıl Səviyyə Şagird</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHART SECTION */}
        <div className="lg:col-span-2">
          <div className="relative h-[200px] flex items-end gap-2 sm:gap-6 pt-10">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800 h-0"></div>
              <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800 h-0"></div>
              <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800 h-0"></div>
              <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800 h-0"></div>
            </div>

            {/* Bars */}
            ${chartData.map((data, index) => {
              const heightPct = (data.value / maxValue) * 100;
              return html`
                <div key=${index} className="relative flex flex-col items-center flex-1 group">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold py-1 px-3 rounded-lg pointer-events-none z-10 whitespace-nowrap shadow-lg">
                    ${data.value}%
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 dark:bg-zinc-100 rotate-45"></div>
                  </div>
                  
                  {/* Bar fill */}
                  <div className="w-full max-w-[48px] rounded-t-xl transition-all duration-1000 ease-out relative overflow-hidden flex items-end"
                       style=${{ height: animated ? `${heightPct}%` : '0%', backgroundColor: data.color, minHeight: '4px' }}>
                    <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Label */}
                  <span className="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-3 uppercase tracking-wider">${data.label}</span>
                </div>
              `;
            })}
          </div>
        </div>

        {/* AI INSIGHTS SECTION */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-5 rounded-2xl relative overflow-hidden">
            <i className="fa-brands fa-google text-indigo-500/10 text-6xl absolute -right-4 -bottom-4"></i>
            <div className="flex items-center gap-2 mb-2">
              <i className="fa-solid fa-sparkles text-indigo-500"></i>
              <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-300 uppercase tracking-widest text-[11px]">AI Analizi</h3>
            </div>
            <p className="text-sm text-indigo-800 dark:text-indigo-200/80 leading-relaxed relative z-10 font-medium">
              Son aylarda riyaziyyat və fizika fənlərində kəskin artım müşahidə olunur. Sınaq imtahanlarındakı (KSQ) sürətiniz 15% yaxşılaşıb. Zəif nöqtəniz Coğrafiyadır, bu fənnə diqqət yetirməyiniz tövsiyə olunur.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div className="text-xl font-black text-zinc-900 dark:text-white">12 Gün</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Aktivlik Seriyası</div>
            </div>
            
            <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                <i className="fa-solid fa-medal"></i>
              </div>
              <div className="text-xl font-black text-zinc-900 dark:text-white">14</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Qazanılan Medal</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
};
