import { authService } from './services/authService.js';
import { UnifiedAuthBarrier } from './components/UnifiedAuthBarrier.js';
// TDV Community Labs - E-School Əsas Tətbiq Komponenti (Root Application)



import React, { useState, useEffect } from 'react';

import { Navbar } from './components/Navbar.js';

import { Sidebar } from './components/Sidebar.js';

import { DashboardView } from './components/DashboardView.js';

import { LessonsView } from './components/LessonsView.js';

import { ExamArchiveView } from './components/ExamArchiveView.js';

import { PvpArenaView } from './components/PvpArenaView.js';

import { ContentManagerView } from './components/ContentManagerView.js';

import { ToolsDrawer } from './components/ToolsDrawer.js';

import { ProfileModal } from './components/ProfileModal.js';

import { StorageService } from './services/storageService.js';



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TDV E-School Runtime Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        { className: 'min-h-[60vh] flex flex-col items-center justify-center p-6 text-center' },
        React.createElement(
          'div',
          { className: 'max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4' },
          React.createElement('div', { className: 'w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl' }, '⚠️'),
          React.createElement('h2', { className: 'text-lg font-black text-zinc-900 dark:text-white' }, 'İş sahəsində xəta baş verdi'),
          React.createElement('p', { className: 'text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed' }, 'Resurslar yüklənərkən müvəqqəti problem yarandı. Səhifəni yenidən yükləyərək davam edə bilərsiniz.'),
          React.createElement(
            'div',
            { className: 'flex gap-2 justify-center pt-2' },
            React.createElement(
              'button',
              {
                onClick: () => { this.setState({ hasError: false, error: null }); window.location.reload(); },
                className: 'px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition cursor-pointer'
              },
              'Səhifəni Yenilə'
            ),
            React.createElement(
              'button',
              {
                onClick: () => {
                  try { localStorage.clear(); } catch(e) {}
                  window.location.reload();
                },
                className: 'px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer'
              },
              'Keşi Sıfırla'
            )
          )
        )
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [session, setSession] = useState(() => authService.getSession());
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => !authService.getSession());

  useEffect(() => {
    const unsub = authService.subscribe((newSession) => {
      setSession(newSession);
      if (newSession) setIsCheckingAuth(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isCheckingAuth) {
      const timer = setTimeout(() => {
        setIsCheckingAuth(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isCheckingAuth]);


  const [activeTab, setActiveTab] = useState('dashboard');

  const [darkMode, setDarkMode] = useState(() => {

    const hubTheme = localStorage.getItem('tdv_theme');

    if (hubTheme) return hubTheme === 'dark';

    const legacy = localStorage.getItem('mekteb_plus_dark');

    if (legacy !== null) return legacy === 'true';

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  });

  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const [activeLessonId, setActiveLessonId] = useState(null);

  const [activeExam, setActiveExam] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  // Verilənlər Bazasının Cari Vəziyyəti

  const [lessons, setLessons] = useState(() => StorageService.getLessons());

  const [exams, setExams] = useState(() => StorageService.getExams());

  const [pvpQuestions, setPvpQuestions] = useState(() => StorageService.getPvpQuestions());

  const [userStats, setUserStats] = useState(() => StorageService.getUserStats());



  // Qaranlıq rejim sinifinin tətbiqi (Ekosistem ilə sinxron)

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add('dark');

      localStorage.setItem('mekteb_plus_dark', 'true');

      localStorage.setItem('tdv_theme', 'dark');

    } else {

      document.documentElement.classList.remove('dark');

      localStorage.setItem('mekteb_plus_dark', 'false');

      localStorage.setItem('tdv_theme', 'light');

    }

  }, [darkMode]);



  // Firebase Firestore Real-Time Sinxronizasiyası

  useEffect(() => {

    const unsubscribe = StorageService.subscribe((type, data) => {

      if (type === 'lessons') setLessons(data);

      if (type === 'exams') setExams(data);

      if (type === 'pvp_questions') setPvpQuestions(data);

    });

    StorageService.initSync();

    return () => unsubscribe();

  }, []);



  // Məlumatlar dəyişdikdə yeniləmə funksiyası

  const refreshData = () => {

    setLessons(StorageService.getLessons());

    setExams(StorageService.getExams());

    setPvpQuestions(StorageService.getPvpQuestions());

    setUserStats(StorageService.getUserStats());

  };



  const handleUpdateStats = (updater) => {

    const updated = StorageService.updateUserStats(updater);

    setUserStats(updated);

  };



  const handleLogout = () => {

    authService.logout();

    setSession(null);

  };



  const handleStartPvp = (mode) => {

    setActiveTab('pvp');

  };



  const handleOpenExam = (exam) => {

    setActiveExam(exam);

    setActiveTab('exams');

  };



  // Klaviatura qısayolları (Escape ilə axtarışı və mobil menyunu təmizlə)

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === 'Escape') {

        if (searchQuery) setSearchQuery('');

        if (mobileMenuOpen) setMobileMenuOpen(false);

      }

    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);

  }, [searchQuery, mobileMenuOpen]);



  // Qlobal Axtarış Nəticələri (Dərslər və İmtahanlar üzrə təhlükəsiz süzgəc)

  const searchResults = searchQuery.trim() ? {

    lessons: lessons.filter(l =>

      (l.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||

      (l.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||

      (l.unit || '').toLowerCase().includes(searchQuery.toLowerCase())

    ),

    exams: exams.filter(e =>

      (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||

      (e.subjectId || '').toLowerCase().includes(searchQuery.toLowerCase())

    )

  } : null;



  // MƏCBURİ VAHİD GİRİŞ QAPISI (MANDATORY AUTH GATE)
  if (isCheckingAuth && !session) {
    return React.createElement(
      'div',
      { className: 'min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-white' },
      React.createElement(
        'div',
        { className: 'w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center animate-pulse' },
        React.createElement('img', { src: 'assets/tdv-logo.png', className: 'w-8 h-8 rounded-full', alt: 'TDV' })
      ),
      React.createElement('p', { className: 'text-xs text-zinc-400 font-medium' }, 'Vahid TDV Girişi yoxlanılır...')
    );
  }

  if (!session) {
    return React.createElement(UnifiedAuthBarrier, {
      onLogin: (newSession) => setSession(newSession)
    });
  }

  return React.createElement(

    'div',

    { className: 'min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-200 flex flex-col' },

    

    // Yuxarı Naviqasiya Paneli

    React.createElement(Navbar, {

      activeTab,

      setActiveTab,

      darkMode,

      setDarkMode,

      searchQuery,

      setSearchQuery,

      userStats,

      userSession: session,

      onLogout: handleLogout,

      onOpenMobileMenu: () => setMobileMenuOpen(true),

      onOpenTools: () => setIsToolsOpen(true),

      onOpenProfile: () => setIsProfileOpen(true)

    }),



    // Mobil Menyu Yan Paneli

    React.createElement(Sidebar, {

      isOpen: mobileMenuOpen,

      onClose: () => setMobileMenuOpen(false),

      activeTab,

      setActiveTab,

      userStats,

      userSession: session,

      onLogout: handleLogout,

      onOpenTools: () => setIsToolsOpen(true),

      onOpenProfile: () => setIsProfileOpen(true)

    }),



    // Qlobal Axtarış Dropdown Nəticələri (əgər axtarış sorğusu varsa)

    searchResults && React.createElement(

      'div',

      { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 z-30' },

      React.createElement(

        'div',

        { className: 'p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-purple-200 dark:border-purple-900 shadow-2xl space-y-4 animate-fadeIn' },

        React.createElement(

          'div',

          { className: 'flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800' },

          React.createElement('h3', { className: 'text-xs font-black uppercase text-purple-600 dark:text-purple-400' }, `Axtarış Nəticələri: "${searchQuery}"`),

          React.createElement('button', { onClick: () => setSearchQuery(''), className: 'text-xs text-zinc-400 hover:text-zinc-600' }, 'Bağla ✕')

        ),

        React.createElement(

          'div',

          { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 max-h-72 overflow-y-auto' },

          

          // Dərslər Nəticələri

          React.createElement(

            'div',

            { className: 'space-y-2' },

            React.createElement('div', { className: 'text-[11px] font-bold text-zinc-400 uppercase' }, `Tapılan Dərslər (${searchResults.lessons.length})`),

            searchResults.lessons.length === 0 ? React.createElement('p', { className: 'text-xs text-zinc-400' }, 'Dərs tapılmadı.') :

            searchResults.lessons.map(les => {

              return React.createElement(

                'div',

                {

                  key: les.id,

                  onClick: () => {

                    setSelectedSubjectId(les.subjectId);

                    setActiveLessonId(les.id);

                    setActiveTab('lessons');

                    setSearchQuery('');

                  },

                  className: 'p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-zinc-700/80 cursor-pointer text-xs font-bold'

                },

                les.title

              );

            })

          ),



          // İmtahanlar Nəticələri

          React.createElement(

            'div',

            { className: 'space-y-2' },

            React.createElement('div', { className: 'text-[11px] font-bold text-zinc-400 uppercase' }, `Tapılan İmtahanlar (${searchResults.exams.length})`),

            searchResults.exams.length === 0 ? React.createElement('p', { className: 'text-xs text-zinc-400' }, 'İmtahan tapılmadı.') :

            searchResults.exams.map(ex => {

              return React.createElement(

                'div',

                {

                  key: ex.id,

                  onClick: () => {

                    setActiveExam(ex);

                    setActiveTab('exams');

                    setSearchQuery('');

                  },

                  className: 'p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-zinc-700/80 cursor-pointer text-xs font-bold'

                },

                ex.title

              );

            })

          )

        )

      )

    ),



    // Əsas Məzmun Sahəsi

    React.createElement(

      ErrorBoundary,

      null,

      React.createElement(

        'main',

        { className: 'flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full' },

      

      activeTab === 'dashboard' && React.createElement(DashboardView, {

        setActiveTab,

        setSelectedSubjectId,

        lessons,

        exams,

        onStartPvp: handleStartPvp,

        onOpenExam: handleOpenExam,

        onOpenTools: () => setIsToolsOpen(true)

      }),



      activeTab === 'lessons' && React.createElement(LessonsView, {

        lessons,

        selectedSubjectId,

        setSelectedSubjectId,

        activeLessonId,

        setActiveLessonId

      }),



      activeTab === 'exams' && React.createElement(ExamArchiveView, {

        exams,

        activeExam,

        setActiveExam,

        onExamFinished: () => {}

      }),



      activeTab === 'pvp' && React.createElement(PvpArenaView, {

        pvpQuestions,

        userStats,

        onUpdateStats: handleUpdateStats

      }),



      activeTab === 'admin' && React.createElement(ContentManagerView, {

        exams,

        lessons,

        pvpQuestions,

        onDataRefresh: refreshData

      })

      )

    ),



    // Sağ Kənarda Sabit Üzən Alətlər Düyməsi (Basanda sağdan sürüşərək açılır)

    React.createElement(

      'button',

      {

        onClick: () => setIsToolsOpen(true),

        title: 'İnteraktiv Alətlər və Calculus Hesablayıcısı',

        className: 'fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-l from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 px-2.5 rounded-l-2xl shadow-2xl transition-all duration-200 transform hover:-translate-x-1 flex flex-col items-center space-y-1.5 no-print group border-y border-l border-purple-400/30'

      },

      React.createElement('i', { className: 'fas fa-toolbox text-sm group-hover:rotate-12 transition' }),

      React.createElement('span', { className: 'text-[9px] font-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180' }, 'Alətlər & Lab')

    ),



    // Sağdan Sürüşərək Açılan Panel (Drawer)

    React.createElement(ToolsDrawer, {

      isOpen: isToolsOpen,

      onClose: () => setIsToolsOpen(false)

    }),



    // Şagird Şəxsi Kabineti & Nailiyyət Modalı (Profile & Analytics)

    React.createElement(ProfileModal, {

      isOpen: isProfileOpen,

      onClose: () => setIsProfileOpen(false),

      userStats,

      onUpdateStats: handleUpdateStats,

      lessonsCount: lessons.length,

      examsCount: exams.length

    }),



    // Aşağı Footer (no-print)

    React.createElement(

      'footer',

      { className: 'no-print border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 py-6 text-center text-xs text-zinc-400 mt-auto' },

      React.createElement(

        'div',

        { className: 'max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2' },

        React.createElement('div', { className: 'font-semibold' }, '© 2026 TDV Community Labs • Bütün hüquqlar qorunur.'),

        React.createElement(

          'div',

          { className: 'flex items-center space-x-4 text-[11px]' },

          React.createElement('span', null, 'KaTeX & PhET İnteqrasiyalı'),

          React.createElement('span', null, 'BSQ/KSQ Çap Standartı'),

          React.createElement('span', null, '1v1 Canlı PvP')

        )

      )

    )

  );

}

