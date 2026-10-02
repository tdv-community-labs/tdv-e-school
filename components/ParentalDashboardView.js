import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const ParentalDashboardView = () => {
  return html`
    <div className="flex flex-col gap-8 pb-12 animate-fadeIn max-w-5xl mx-auto w-full">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-zinc-900 to-indigo-950 border border-indigo-500/20 p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-medium text-indigo-300 backdrop-blur-md mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Valideyn Nəzarət Portalı</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Övladınızın Akademik<br/>İnkişaf Mərkəzi</h1>
            <p className="text-indigo-200 mt-2 max-w-lg">Gündəlik dərs saatları, imtahan nəticələri və təlimçi rəylərinə real-vaxt nəzarət.</p>
          </div>
          
          <div className="bg-zinc-950/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg">A</div>
            <div>
              <div className="text-sm font-bold">Ayxan Məmmədov</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">10-cu sinif • Bakı Türk Liseyi</div>
            </div>
            <button className="ml-2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-lg">
              <i className="fa-solid fa-clock"></i>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">+15% Bu Həftə</span>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">14s 30d</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Həftəlik Platforma Aktivliyi</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-lg">
              <i className="fa-solid fa-check-double"></i>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">8/10 İmtahan</span>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">85.4%</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">BSQ/KSQ Orta Nəticə</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center text-lg">
              <i className="fa-solid fa-brain"></i>
            </div>
            <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">Normal</span>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">Fizika</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Ən Çox Təkmilləşdirilən Fənn</div>
        </div>
      </div>

      {/* Screen Time & Lock Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <i className="fa-solid fa-gamepad text-indigo-500"></i> Əyləncə və Oyun (PvP) Nəzarəti
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
            Şagirdlər ancaq sizin təyin etdiyiniz saatlarda "1v1 Bilik Arenası" (PvP) oynaya bilərlər. Bu, onlara dərsdən yayınmadan əylənməyə kömək edir.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <div>
                <div className="font-bold text-sm">PvP Arena İcazəsi</div>
                <div className="text-xs text-zinc-500 mt-1">18:00 - 20:00 arası oynamaya icazə verilir</div>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <div>
                <div className="font-bold text-sm">Gündəlik Limit</div>
                <div className="text-xs text-zinc-500 mt-1">Maksimum 5 duel</div>
              </div>
              <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                Dəyiş
              </button>
            </div>
          </div>
        </div>

        {/* Recent Teacher Reports */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <i className="fa-solid fa-envelope-open-text text-amber-500"></i> Müəllim Rəyləri
            </h3>
            <button className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">Hamısına bax</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 shrink-0">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-sm">Fərid M. (Riyaziyyat)</div>
                  <div className="text-[10px] text-zinc-400">Dünən</div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Ayxan KSQ-2 imtahanında çox gözəl nəticə göstərdi, lakin "Törəmə" bölməsində bir az praktika etməsi lazımdır. Laboratoriyadakı alətləri yoxlasın.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 shrink-0">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-sm">Nərgiz Q. (Tarix)</div>
                  <div className="text-[10px] text-zinc-400">3 gün əvvəl</div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Tarixi xəritələrlə işləməyi zəifdir. E-School portalındakı vizual dərsləri təkrar oxuması məsləhətdir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
