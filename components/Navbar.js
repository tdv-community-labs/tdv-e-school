// TDV E-School - Bespoke Product Navigation Bar (Linear / Stripe Grade)

import React from 'react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  userStats,
  userSession,
  onLogout,
  onOpenMobileMenu,
  onOpenTools,
  onOpenProfile
}) => {
  return React.createElement(
    'header',
    {
      className: 'sticky top-[33px] sm:top-[35px] z-40 bg-white/90 dark:bg-[#09090b]/85 backdrop-blur-xl border-b border-zinc-200/80 dark:border-white/[0.08] transition-all duration-200 no-print'
    },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between h-16 gap-3 sm:gap-4' },
        
        // 1. Bespoke Brand Mark: Dedicated Modern EdTech Logo
        React.createElement(
          'div',
          {
            className: 'flex items-center space-x-3 cursor-pointer select-none group shrink-0',
            onClick: () => setActiveTab('dashboard')
          },
          React.createElement(
            'div',
            {
              className: 'relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 border border-white/20 group-hover:scale-105 transition-transform duration-200'
            },
            React.createElement('i', { className: 'fas fa-graduation-cap text-lg' }),
            React.createElement('span', { className: 'absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#09090b] ' })
          ),
          React.createElement(
            'div',
            { className: 'hidden sm:block' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement(
                'span',
                { className: 'font-extrabold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-purple-900 to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent' },
                'TDV E-School'
              ),
              React.createElement(
                'span',
                { className: 'text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 tracking-wider uppercase' },
                'v2.5'
              )
            ),
            React.createElement('p', { className: 'text-[10px] text-zinc-500 dark:text-zinc-400 -mt-0.5 font-medium' }, 'Bakı Türk Liseyi • Təhsil Portalı')
          )
        ),

        // 2. Command Palette Search Bar (Ctrl+K style)
        React.createElement(
          'div',
          { className: 'flex-1 max-w-sm hidden md:block' },
          React.createElement(
            'div',
            {
              className: 'relative flex items-center bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/[0.08] hover:border-purple-500/40 rounded-xl px-3 py-1.5 transition-all focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20'
            },
            React.createElement('i', { className: 'fas fa-search text-zinc-400 text-xs mr-2.5 pointer-events-none' }),
            React.createElement('input', {
              type: 'text',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: 'Mövzu, düstur və ya fənn axtarışı...',
              className: 'w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none'
            }),
            searchQuery ? React.createElement(
              'button',
              {
                onClick: () => setSearchQuery(''),
                className: 'text-zinc-400 hover:text-zinc-600 text-xs ml-1 cursor-pointer'
              },
              React.createElement('i', { className: 'fas fa-times-circle' })
            ) : React.createElement(
              'kbd',
              {
                className: 'hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700/60 shadow-2xs'
              },
              '⌘K'
            )
          )
        ),

        // 3. Floating Nav Tabs (Linear-Grade Integrated Pill Nav)
        React.createElement(
          'nav',
          { className: 'hidden lg:flex items-center space-x-1 bg-zinc-100/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06] p-1 rounded-2xl backdrop-blur-md' },
          [
            { id: 'dashboard', label: 'Ana Səhifə', icon: 'fa-house' },
            { id: 'lessons', label: 'Dərslər', icon: 'fa-book-open-reader' },
            { id: 'exams', label: 'BSQ / KSQ', icon: 'fa-file-lines' },
            { id: 'pvp', label: '1v1 Döyüş', icon: 'fa-gamepad', badge: 'Canlı' },
            { id: 'admin', label: 'İdarəetmə', icon: 'fa-database' }
          ].map(item => {
            const isActive = activeTab === item.id;
            return React.createElement(
              'button',
              {
                key: item.id,
                onClick: () => setActiveTab(item.id),
                className: `px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400  border border-zinc-200/60 dark:border-white/[0.08]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-900/50'
                }`
              },
              React.createElement('i', { className: `fas ${item.icon} text-xs ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400 dark:text-zinc-500'}` }),
              React.createElement('span', null, item.label),
              item.badge && React.createElement(
                'span',
                { className: 'text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse' },
                item.badge
              )
            );
          })
        ),

        // 4. Action Suite (Tools, Theme, XP, Profile)
        React.createElement(
          'div',
          { className: 'flex items-center space-x-1.5 sm:space-x-2 shrink-0' },
          
          // Alətlər Düyməsi
          React.createElement(
            'button',
            {
              onClick: onOpenTools,
              title: 'İnteraktiv Alətlər və Calculus Hesablayıcısı',
              className: 'px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center space-x-1.5 transition  cursor-pointer'
            },
            React.createElement('i', { className: 'fas fa-toolbox text-xs text-purple-500' }),
            React.createElement('span', { className: 'hidden sm:inline' }, 'Alətlər & Lab')
          ),

          // Qaranlıq / İşıqlı Rejim
          React.createElement(
            'button',
            {
              onClick: () => setDarkMode(!darkMode),
              title: darkMode ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç',
              'aria-label': darkMode ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç',
              className: 'p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer'
            },
            React.createElement('i', { className: darkMode ? 'fas fa-sun text-amber-400 text-xs' : 'fas fa-moon text-purple-500 text-xs' })
          ),

          // XP Pill
          React.createElement(
            'div',
            {
              onClick: onOpenProfile || (() => setActiveTab('pvp')),
              title: 'Şəxsi Kabinet və İnkişaf Analitikası',
              className: 'hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 cursor-pointer hover:scale-105 transition transform'
            },
            React.createElement('span', { className: 'text-xs' }, '⚡'),
            React.createElement(
              'div',
              { className: 'text-left' },
              React.createElement('div', { className: 'text-[11px] font-black text-amber-500 leading-none' }, `${userStats?.pvpScore || 1420} XP`),
              React.createElement('div', { className: 'text-[9px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold' }, 'Qızıl Liqa')
            )
          ),

          // Şagird Profil Düyməsi
          React.createElement(
            'button',
            {
              onClick: onOpenProfile,
              title: 'Şəxsi Kabinet',
              className: 'flex items-center space-x-1.5 p-1 pr-2 sm:pr-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 hover:bg-purple-50 dark:hover:bg-zinc-800 transition border border-zinc-200/60 dark:border-white/[0.08] cursor-pointer'
            },
            React.createElement('span', { className: 'text-sm leading-none' }, userSession?.avatar || userStats?.avatar || '🧑‍🎓'),
            React.createElement('span', { className: 'hidden md:inline text-xs font-bold text-zinc-700 dark:text-zinc-200' }, userSession?.fullName || userSession?.username || userStats?.name || 'Məktəbli')
          ),

          // Çıxış Düyməsi (Sessiyanı bağla və girişi kilidlə)
          onLogout && React.createElement(
            'button',
            {
              onClick: onLogout,
              title: 'Çıxış (Girişi kilidlə)',
              className: 'hidden sm:flex p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold transition items-center gap-1.5 cursor-pointer'
            },
            React.createElement('i', { className: 'fas fa-arrow-right-from-bracket text-xs' }),
            React.createElement('span', { className: 'hidden xl:inline' }, 'Çıxış')
          ),

          // Mobil Menyu Düyməsi
          React.createElement(
            'button',
            {
              onClick: onOpenMobileMenu,
              'aria-label': 'Menyunu aç',
              className: 'lg:hidden p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 cursor-pointer'
            },
            React.createElement('i', { className: 'fas fa-bars text-sm' })
          )
        )
      )
    )
  );
};
