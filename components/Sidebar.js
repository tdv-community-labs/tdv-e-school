// TDV Community Labs - E-School Mobil Yan Menyu (Drawer)

import React from 'react';

export const Sidebar = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  userStats,
  userSession,
  onLogout,
  onOpenTools,
  onOpenProfile
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Ana Səhifə', icon: 'fa-house', desc: 'Fənlər və son xülasələr' },
    { id: 'lessons', label: 'Dərslər və Nəzəriyyə', icon: 'fa-book-open-reader', desc: 'KaTeX & PhET interaktiv dərsləri' },
    { id: 'tools', label: 'Alətlər & Laboratoriya', icon: 'fa-toolbox', desc: 'Calculus, Törəmə və PhET simulyatorları', badge: 'Sağ Panel' },
    { id: 'exams', label: 'BSQ / KSQ Arxiv', icon: 'fa-file-lines', desc: 'İnteraktiv test və çap vərəqi' },
    { id: 'pvp', label: '1v1 Viktorina Arenası', icon: 'fa-gamepad', desc: 'Dostla oyna & sürətli matç', badge: 'Canlı' },
    { id: 'admin', label: 'İdarəetmə & Skan Paneli', icon: 'fa-database', desc: 'Yeni sual və JSON idarəetməsi' }
  ];

  const handleItemClick = (id) => {
    if (id === 'tools') {
      onClose();
      if (onOpenTools) onOpenTools();
    } else {
      setActiveTab(id);
      onClose();
    }
  };

  return React.createElement(
    'div',
    { className: 'fixed inset-0 z-50 lg:hidden no-print' },
    // Overlay backdrop
    React.createElement('div', {
      className: 'fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity',
      onClick: onClose
    }),
    // Drawer panel
    React.createElement(
      'div',
      {
        className: 'fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-zinc-900 shadow-2xl p-6 flex flex-col justify-between z-10 transition-transform'
      },
      React.createElement(
        'div',
        null,
        // Header
        React.createElement(
          'div',
          { className: 'flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-3' },
            React.createElement(
              'div',
              { className: 'w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md shadow-purple-500/20' },
              React.createElement('i', { className: 'fas fa-graduation-cap' })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100' }, 'TDV E-School'),
              React.createElement('p', { className: 'text-[10px] text-zinc-400 font-medium' }, 'Bakı Türk Liseyi • Təhsil Portalı')
            )
          ),
          React.createElement(
            'button',
            {
              onClick: onClose,
              className: 'p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            },
            React.createElement('i', { className: 'fas fa-times text-lg' })
          )
        ),
        // Menu list
        React.createElement(
          'nav',
          { className: 'mt-6 space-y-1.5' },
          menuItems.map(item => {
            const isActive = activeTab === item.id;
            return React.createElement(
              'button',
              {
                key: item.id,
                onClick: () => handleItemClick(item.id),
                className: `w-full px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                  isActive
                    ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`
              },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-3' },
                React.createElement('i', { className: `fas ${item.icon} text-base ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400'}` }),
                React.createElement(
                  'div',
                  null,
                  React.createElement('div', { className: 'text-xs font-bold' }, item.label),
                  React.createElement('div', { className: 'text-[10px] text-zinc-400' }, item.desc)
                )
              ),
              item.badge && React.createElement(
                'span',
                { className: 'text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white' },
                item.badge
              )
            );
          })
        ),

        // Ekosistem Portallar (Mobil Keid)
        React.createElement(
          'div',
          { className: 'mt-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800' },
          React.createElement(
            'div',
            { className: 'text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5 px-1' },
            'TDV Ekosistem Portallar'
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-2' },
            React.createElement(
              'a',
              {
                href: 'https://tdv-community-labs.github.io/tdv-hub/',
                className: 'p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-200 hover:text-blue-500 flex items-center space-x-2 text-xs font-semibold'
              },
              React.createElement('i', { className: 'fas fa-house text-blue-500 text-xs' }),
              React.createElement('span', null, 'M?rk?z')
            ),
            React.createElement(
              'a',
              {
                href: 'https://school-minifootball-tournament.vercel.app/',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-200 hover:text-blue-500 flex items-center space-x-2 text-xs font-semibold'
              },
              React.createElement('i', { className: 'fas fa-trophy text-blue-500 text-xs' }),
              React.createElement('span', null, 'Sports')
            ),
            React.createElement(
              'a',
              {
                href: 'https://tdv-community-hubs.vercel.app/games',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'col-span-2 p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/20 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 flex items-center justify-between text-xs font-semibold'
              },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-2' },
                React.createElement('i', { className: 'fas fa-gamepad text-purple-500 text-xs' }),
                React.createElement('span', null, 'Games')
              ),
              React.createElement('span', { className: 'text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30' }, 'Mafia')
            )
          )
        )
      ),

      // Footer User stats (Profilə keçid & Çıxış)
      React.createElement(
        'div',
        { className: 'pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2' },
        React.createElement(
          'div',
          {
            onClick: () => {
              onClose();
              if (onOpenProfile) onOpenProfile();
            },
            className: 'p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center space-x-3 cursor-pointer hover:bg-purple-50 dark:hover:bg-zinc-700/80 transition group'
          },
          React.createElement('div', { className: 'w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-xl shadow-inner' }, (userSession && userSession.avatar) || (userStats && userStats.avatar) || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80 mr-1.5 align-middle"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80 mr-1.5 align-middle"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'),
          React.createElement(
            'div',
            { className: 'flex-1 min-w-0' },
            React.createElement('p', { className: 'text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition' }, (userSession && (userSession.fullName || userSession.username)) || (userStats && userStats.name) || 'Məktəbli'),
            React.createElement('p', { className: 'text-[10px] text-amber-600 dark:text-amber-400 font-semibold' }, `${userStats?.pvpScore || 1420} XP • ${(userSession && userSession.grade) || userStats?.grade || 10}-cu sinif`)
          ),
          React.createElement('i', { className: 'fas fa-chevron-right text-xs text-zinc-400 group-hover:text-purple-500 transition' })
        ),
        onLogout && React.createElement(
          'button',
          {
            onClick: () => {
              onClose();
              onLogout();
            },
            className: 'w-full p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer'
          },
          React.createElement('i', { className: 'fas fa-arrow-right-from-bracket text-xs' }),
          React.createElement('span', null, 'Çıxış et')
        )
      )
    )
  );
};
