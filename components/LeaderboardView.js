import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const LeaderboardView = () => {
  const students = [
    { rank: 1, name: 'Teymur M.', xp: 4520, medals: 14, change: 'up', avatar: '😎', badge: 'Məktəb Birincisi' },
    { rank: 2, name: 'Ayxan M.', xp: 4210, medals: 12, change: 'same', avatar: '👨‍🎓', badge: 'Riyaziyyat Dahisi' },
    { rank: 3, name: 'Nəzrin Q.', xp: 3950, medals: 11, change: 'up', avatar: '👩‍🔬', badge: 'Gənc Laborant' },
    { rank: 4, name: 'Röya Ə.', xp: 3800, medals: 9, change: 'down', avatar: '👩‍🚀', badge: 'Kosmos Maraqlısı' },
    { rank: 5, name: 'Fərid C.', xp: 3500, medals: 7, change: 'up', avatar: '🧑‍💻', badge: 'Kod Ulduzu' },
    { rank: 6, name: 'Səməd V.', xp: 3120, medals: 5, change: 'down', avatar: '🕵️', badge: 'Fizika Tədqiqatçısı' },
  ];

  return html`
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 animate-fadeIn pb-16">
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30 text-white text-3xl mb-4">
          <i className="fa-solid fa-trophy"></i>
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Qlobal Liderlər Lövhəsi</h1>
        <p className="text-zinc-500 mt-2">Məktəb üzrə ən yüksək XP (Təcrübə Xalı) toplayan şagirdlərin reytinqi</p>
      </div>

      <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 mb-12 h-64">
        <div className="w-full sm:w-1/3 flex flex-col items-center">
          <div className="text-4xl mb-2">\${students[1].avatar}</div>
          <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">\${students[1].name}</div>
          <div className="text-[10px] font-black text-indigo-500 mb-2">\${students[1].xp} XP</div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-24 rounded-t-xl border-t-4 border-slate-400 relative flex justify-center">
            <span className="text-4xl font-black text-zinc-300 dark:text-zinc-700 mt-4">2</span>
          </div>
        </div>
        <div className="w-full sm:w-1/3 flex flex-col items-center">
          <div className="text-5xl mb-2 relative">
            \${students[0].avatar}
            <i className="fa-solid fa-crown absolute -top-4 -right-1 text-amber-400 text-xl rotate-12 drop-shadow-md"></i>
          </div>
          <div className="font-black text-base text-zinc-900 dark:text-white">\${students[0].name}</div>
          <div className="text-xs font-black text-amber-500 mb-2">\${students[0].xp} XP</div>
          <div className="w-full bg-gradient-to-t from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 h-32 rounded-t-xl border-t-4 border-amber-400 relative flex justify-center shadow-[0_-5px_15px_rgba(251,191,36,0.2)]">
            <span className="text-5xl font-black text-amber-200 dark:text-amber-700/50 mt-4">1</span>
          </div>
        </div>
        <div className="w-full sm:w-1/3 flex flex-col items-center">
          <div className="text-3xl mb-2">\${students[2].avatar}</div>
          <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">\${students[2].name}</div>
          <div className="text-[10px] font-black text-emerald-500 mb-2">\${students[2].xp} XP</div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-20 rounded-t-xl border-t-4 border-amber-700 relative flex justify-center">
            <span className="text-4xl font-black text-zinc-300 dark:text-zinc-700 mt-4">3</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#080808] dark:backdrop-blur-xl rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Bütün Şagirdlər</div>
          <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">Yenilə</button>
        </div>
        
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          \${students.map((student) => html\`
            <div key=\${student.rank} className="flex items-center justify-between p-4 sm:px-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex flex-col items-center justify-center w-6">
                  <span className=\`text-sm font-black \${student.rank <= 3 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}\`>\${student.rank}</span>
                  \${student.change === 'up' && html\`<i className="fa-solid fa-caret-up text-emerald-500 text-[10px]"></i>\`}
                  \${student.change === 'down' && html\`<i className="fa-solid fa-caret-down text-red-500 text-[10px]"></i>\`}
                  \${student.change === 'same' && html\`<i className="fa-solid fa-minus text-zinc-300 text-[10px]"></i>\`}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                  \${student.avatar}
                </div>
                
                <div>
                  <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">\${student.name}</div>
                  <div className="text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded flex items-center w-max mt-1 gap-1">
                    <i className="fa-solid fa-certificate text-indigo-400"></i> \${student.badge}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-8">
                <div className="hidden sm:flex flex-col items-end">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">\${student.medals}</div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">Medal</div>
                </div>
                <div className="flex flex-col items-end min-w-[60px]">
                  <div className="text-sm font-black text-amber-500">\${student.xp}</div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">XP</div>
                </div>
              </div>
            </div>
          \`)}
        </div>
      </div>
    </div>
  `;
};
