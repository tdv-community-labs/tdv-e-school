// MəktəbPlus - Naviqasiya Paneli (Navbar)

import React from 'react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  userStats,
  onOpenMobileMenu,
  onOpenTools,
  onOpenProfile
}) => {
  return React.createElement(
    'header',
    {
      className: 'sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300 no-print'
    },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between h-16 gap-4' },
        
        // Loqo və Brend
        React.createElement(
          'div',
          {
            className: 'flex items-center space-x-3 cursor-pointer select-none',
            onClick: () => setActiveTab('dashboard')
          },
          React.createElement(
            'div',
            { className: 'relative shrink-0' },
            React.createElement('img', {
              src: 'assets/tdv-logo.jpg',
              alt: 'TDV BTL Crest',
              className: 'w-10 h-10 rounded-full object-cover border-2 border-amber-400/80 shadow-md shadow-amber-500/10'
            }),
            React.createElement(
              'div',
              { className: 'absolute -bottom-1 -right-1 bg-indigo-600 text-white w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 shadow text-[8px]' },
              React.createElement('i', { className: 'fas fa-graduation-cap text-[8px]' })
            )
          ),
          React.createElement(
            'div',
            { className: 'hidden sm:block' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement('span', { className: 'font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent' }, 'TDV BTL E-School'),
              React.createElement('span', { className: 'text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40' }, 'RƏSMİ')
            ),
            React.createElement('p', { className: 'text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-0.5' }, 'BAKI TÜRK LİSEYİ • MİLLİ TƏDRİS PORTALI')
          )
        ),

        // Mərkəzi Axtarış Paneli
        React.createElement(
          'div',
          { className: 'flex-1 max-w-md hidden md:block' },
          React.createElement(
            'div',
            { className: 'relative' },
            React.createElement('i', { className: 'fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none' }),
            React.createElement('input', {
              type: 'text',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: 'Mövzu, düstur və ya fənn üzrə axtarın (məs: Törəmə, Nyuton, BSQ)...',
              className: 'w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition'
            }),
            searchQuery && React.createElement(
              'button',
              {
                onClick: () => setSearchQuery(''),
                className: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs'
              },
              React.createElement('i', { className: 'fas fa-times-circle' })
            )
          )
        ),

        // Əsas Menyular (Desktop - Təmiz naviqasiya)
        React.createElement(
          'nav',
          { className: 'hidden lg:flex items-center space-x-1' },
          [
            { id: 'dashboard', label: 'Ana Səhifə', icon: 'fa-house' },
            { id: 'lessons', label: 'Dərslər', icon: 'fa-book-open-reader' },
            { id: 'exams', label: 'BSQ / KSQ Arxiv', icon: 'fa-file-lines' },
            { id: 'pvp', label: '1v1 Viktorina', icon: 'fa-gamepad', badge: 'Canlı' },
            { id: 'admin', label: 'İdarəetmə & Skan', icon: 'fa-database' }
          ].map(item => {
            const isActive = activeTab === item.id;
            return React.createElement(
              'button',
              {
                key: item.id,
                onClick: () => setActiveTab(item.id),
                className: `px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all duration-200 relative ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              },
              React.createElement('i', { className: `fas ${item.icon} text-sm ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}` }),
              React.createElement('span', null, item.label),
              item.badge && React.createElement(
                'span',
                { className: 'text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse' },
                item.badge
              )
            );
          })
        ),

        // Sağ Paneldəki Əməliyyatlar
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2.5' },
          
          // Alətlər Düyməsi (Sağ tərəfdən sürüşərək açılan laboratoriya)
          React.createElement(
            'button',
            {
              onClick: onOpenTools,
              title: 'İnteraktiv Alətlər və Calculus Hesablayıcısı',
              className: 'px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs flex items-center space-x-1.5 transition shadow-sm'
            },
            React.createElement('i', { className: 'fas fa-toolbox text-sm text-indigo-500' }),
            React.createElement('span', { className: 'hidden sm:inline' }, 'Alətlər & Lab')
          ),

          // Qaranlıq / İşıqlı rejim
          React.createElement(
            'button',
            {
              onClick: () => setDarkMode(!darkMode),
              title: darkMode ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç',
              'aria-label': darkMode ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç',
              className: 'p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition'
            },
            React.createElement('i', { className: darkMode ? 'fas fa-sun text-amber-400' : 'fas fa-moon text-indigo-600' })
          ),

          // İstifadəçi Reytinqi / XP
          React.createElement(
            'div',
            {
              onClick: onOpenProfile || (() => setActiveTab('pvp')),
              title: 'Şəxsi Kabinet və İnkişaf Analitikası',
              className: 'hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800/60 cursor-pointer hover:scale-105 transition transform'
            },
            React.createElement('span', { className: 'text-base' }, '⚡'),
            React.createElement(
              'div',
              { className: 'text-left' },
              React.createElement('div', { className: 'text-[11px] font-black text-amber-600 dark:text-amber-400 leading-none' }, `${userStats?.pvpScore || 1420} XP`),
              React.createElement('div', { className: 'text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold' }, 'Qızıl Liqa')
            )
          ),

          // Profil Düyməsi (Şagirdin Şəxsi Kabineti)
          React.createElement(
            'button',
            {
              onClick: onOpenProfile,
              title: 'Şəxsi Kabinet və İnkişaf Analitikası',
              className: 'flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 transition border border-slate-200/60 dark:border-slate-700/60'
            },
            React.createElement('span', { className: 'text-base leading-none' }, userStats?.avatar || '🧑‍🎓'),
            React.createElement('span', { className: 'hidden md:inline text-xs font-bold text-slate-700 dark:text-slate-200' }, userStats?.name || 'Məktəbli')
          ),

          // Mobil menyu düyməsi
          React.createElement(
            'button',
            {
              onClick: onOpenMobileMenu,
              className: 'lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            },
            React.createElement('i', { className: 'fas fa-bars text-base' })
          )
        )
      )
    )
  );
};
