// TDV E-School - Bespoke Product Dashboard (Bento Grid & Linear-Grade UI)

import React from 'react';
import { SUBJECTS } from '../data/subjects.js';

export const DashboardView = ({
  setActiveTab,
  setSelectedSubjectId,
  lessons,
  exams,
  onStartPvp,
  onOpenExam,
  onOpenTools
}) => {
  const recentExams = exams.slice(0, 3);
  const recentLessons = lessons.slice(0, 3);

  const getSubjectIconClass = (iconName) => {
    switch (iconName) {
      case 'calculator': return 'fa-calculator';
      case 'atom': return 'fa-atom';
      case 'flask-conical': return 'fa-flask';
      case 'dna': return 'fa-dna';
      case 'globe-2': return 'fa-earth-americas';
      case 'landmark': return 'fa-landmark';
      case 'book-open': return 'fa-book-open';
      case 'languages': return 'fa-language';
      case 'cpu': return 'fa-microchip';
      default: return 'fa-graduation-cap';
    }
  };

  return React.createElement(
    'div',
    { className: 'space-y-8 animate-fadeIn pb-16 max-w-7xl mx-auto' },
    
    // 1. Bespoke Editorial Hero & Learning Command Center
    React.createElement(
      'div',
      {
        className: 'relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0c1222] to-slate-950 border border-indigo-500/20 p-6 sm:p-10 text-white shadow-2xl shadow-indigo-950/40'
      },
      // Atmospheric Aurora Glows
      React.createElement('div', { className: 'absolute -right-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none' }),
      React.createElement('div', { className: 'absolute right-1/3 -bottom-24 w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none' }),

      React.createElement(
        'div',
        { className: 'relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center' },
        
        // Left Column: Editorial Proposition & Action Suite
        React.createElement(
          'div',
          { className: 'lg:col-span-8 space-y-4' },
          React.createElement(
            'div',
            { className: 'inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-xs font-medium text-indigo-300 backdrop-blur-md' },
            React.createElement('span', { className: 'w-2 h-2 rounded-full bg-cyan-400 animate-pulse' }),
            React.createElement('span', { className: 'font-bold text-white' }, 'TDV BTL'),
            React.createElement('span', { className: 'text-indigo-300/90' }, '• Təhsil Portalı')
          ),
          React.createElement(
            'h1',
            { className: 'text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white' },
            'Akademik Zəka, BSQ/KSQ İmtahanları və ',
            React.createElement('span', { className: 'bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent' }, '1v1 Bilik Arenası')
          ),
          React.createElement(
            'p',
            { className: 'text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal' },
            'Bütün fənlər üzrə KaTeX düsturlu nəzəriyyə konspektləri, PhET laboratoriyaları, imtahan test vərəqləri və dostlarınızla canlı yarışlar.'
          ),

          // Actions Suite
          React.createElement(
            'div',
            { className: 'flex flex-wrap gap-2.5 pt-2' },
            React.createElement(
              'button',
              {
                onClick: () => setActiveTab('lessons'),
                className: 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition transform flex items-center space-x-2 cursor-pointer'
              },
              React.createElement('i', { className: 'fas fa-book-open-reader text-xs' }),
              React.createElement('span', null, 'Dərslərə Başla'),
              React.createElement('span', { className: 'text-indigo-200 ml-1' }, '→')
            ),
            React.createElement(
              'button',
              {
                onClick: () => setActiveTab('exams'),
                className: 'px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-200 font-bold text-xs sm:text-sm transition flex items-center space-x-2 cursor-pointer'
              },
              React.createElement('i', { className: 'fas fa-file-signature text-xs text-indigo-400' }),
              React.createElement('span', null, 'BSQ / KSQ Arxiv')
            ),
            React.createElement(
              'button',
              {
                onClick: () => onStartPvp('quick'),
                className: 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center space-x-2 cursor-pointer'
              },
              React.createElement('i', { className: 'fas fa-bolt text-xs' }),
              React.createElement('span', null, '1v1 Sürətli Döyüş')
            ),
            React.createElement(
              'button',
              {
                onClick: onOpenTools,
                className: 'px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold text-xs sm:text-sm transition flex items-center space-x-2 cursor-pointer'
              },
              React.createElement('i', { className: 'fas fa-toolbox text-xs' }),
              React.createElement('span', null, 'Alətlər & Lab')
            )
          ),

          // Live Metric Ticker
          React.createElement(
            'div',
            { className: 'pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400' },
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-indigo-400' }),
              React.createElement('span', { className: 'font-extrabold text-white' }, `${SUBJECTS.length}`),
              React.createElement('span', null, 'Tədris Fənni')
            ),
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-cyan-400' }),
              React.createElement('span', { className: 'font-extrabold text-white' }, `${lessons.length}+`),
              React.createElement('span', null, 'Dərs Konspekti')
            ),
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-emerald-400' }),
              React.createElement('span', { className: 'font-extrabold text-white' }, `${exams.length}`),
              React.createElement('span', null, 'BSQ/KSQ İmtahanı')
            ),
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-amber-400' }),
              React.createElement('span', { className: 'font-extrabold text-white' }, 'PhET & KaTeX'),
              React.createElement('span', null, 'Mühərriki')
            )
          )
        ),

        // Right Column: Interactive Live Spotlight Bento Card
        React.createElement(
          'div',
          { className: 'lg:col-span-4 hidden lg:block' },
          React.createElement(
            'div',
            { className: 'rounded-2xl bg-slate-950/80 border border-white/10 p-5 shadow-2xl backdrop-blur-xl space-y-4' },
            React.createElement(
              'div',
              { className: 'flex items-center justify-between' },
              React.createElement(
                'span',
                { className: 'text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5' },
                React.createElement('span', { className: 'w-2 h-2 rounded-full bg-cyan-400 animate-pulse' }),
                'Canlı Formula Spotlight'
              ),
              React.createElement(
                'span',
                { className: 'text-[10px] font-mono text-slate-400' },
                'Calculus & Fizika'
              )
            ),
            React.createElement(
              'div',
              { className: 'p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center font-mono text-cyan-300 text-sm py-5 space-y-1' },
              React.createElement('div', { className: 'text-xs text-slate-400' }, 'Nyuton-Leybnits Teoremi:'),
              React.createElement('div', { className: 'text-base font-bold text-white py-1' }, '∫[a, b] f(x) dx = F(b) - F(a)'),
              React.createElement('div', { className: 'text-[10px] text-slate-500' }, "F'(x) = f(x) • Törəmə və İnteqral")
            ),
            React.createElement(
              'div',
              { className: 'flex items-center justify-between text-xs pt-1' },
              React.createElement('span', { className: 'text-slate-400' }, 'Fənn laboratoriyası:'),
              React.createElement(
                'button',
                {
                  onClick: onOpenTools,
                  className: 'text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer'
                },
                'Kalkulyatoru Aç →'
              )
            )
          )
        )
      )
    ),

    // 2. Günün PvP Çağırışı (Bento Gamification Strip)
    React.createElement(
      'div',
      {
        className: 'rounded-2xl p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm'
      },
      React.createElement(
        'div',
        { className: 'flex items-center space-x-4' },
        React.createElement(
          'div',
          { className: 'w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-2xl text-slate-950 shadow-lg shadow-amber-500/30 shrink-0' },
          '⚔️'
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'flex items-center gap-2' },
            React.createElement('h3', { className: 'font-extrabold text-slate-900 dark:text-slate-100 text-base' }, 'Günün Canlı PvP Çağırışı'),
            React.createElement('span', { className: 'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950' }, '+150 Bonus XP')
          ),
          React.createElement('p', { className: 'text-xs text-slate-600 dark:text-slate-300 mt-0.5' }, 'Günün təsadüfi rəqibi ilə 5 suallıq sürətli dueldə yarış, həftəlik liderlər cədvəlində yüksəl!')
        )
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-2 w-full md:w-auto' },
        React.createElement(
          'button',
          {
            onClick: () => onStartPvp('quick'),
            className: 'w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md transition cursor-pointer'
          },
          'Çağırışı Qəbul Et'
        )
      )
    ),

    // 3. Fənlər Kataloqu (Bento Grid)
    React.createElement(
      'div',
      { className: 'space-y-4' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement(
          'div',
          null,
          React.createElement('h2', { className: 'text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight' }, 'Tədris Fənləri Kataloqu'),
          React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400' }, 'Fənn seçərək nəzəriyyə konspektlərinə və sınaq testlərinə keçid edin')
        ),
        React.createElement(
          'span',
          { className: 'text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20' },
          `${SUBJECTS.length} Fənn Mövcuddur`
        )
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5' },
        SUBJECTS.map(subject => {
          return React.createElement(
            'div',
            {
              key: subject.id,
              onClick: () => {
                setSelectedSubjectId(subject.id);
                setActiveTab('lessons');
              },
              className: 'bento-card group cursor-pointer rounded-2xl p-5 bg-white/90 dark:bg-[#0c101a]/85 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl transition-all duration-200'
            },
            React.createElement(
              'div',
              { className: 'flex items-start justify-between mb-3' },
              React.createElement(
                'div',
                {
                  className: `w-11 h-11 rounded-xl bg-gradient-to-tr ${subject.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`
                },
                React.createElement('i', { className: `fas ${getSubjectIconClass(subject.icon)} text-base` })
              ),
              React.createElement(
                'span',
                { className: `text-[10px] font-extrabold px-2 py-0.5 rounded-md ${subject.badgeBg} ${subject.badgeText}` },
                subject.shortName
              )
            ),
            React.createElement('h3', { className: 'font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-indigo-500 transition-colors' }, subject.name),
            React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed' }, subject.description),
            React.createElement(
              'div',
              { className: 'mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400' },
              React.createElement(
                'span',
                { className: 'flex items-center space-x-1.5 font-medium' },
                React.createElement('i', { className: 'fas fa-book-open text-indigo-500 text-[10px]' }),
                React.createElement('span', null, `${subject.totalLessons} Dərs`)
              ),
              React.createElement(
                'span',
                { className: 'flex items-center space-x-1.5 font-medium' },
                React.createElement('i', { className: 'fas fa-file-lines text-cyan-500 text-[10px]' }),
                React.createElement('span', null, `${subject.totalExams} BSQ/KSQ`)
              ),
              React.createElement(
                'span',
                { className: 'text-indigo-500 font-bold group-hover:translate-x-1 transition-transform' },
                '→'
              )
            )
          );
        })
      )
    ),

    // 4. İki Sütunlu Bento Bölməsi: Son BSQ/KSQ Testləri & Ən Son Dərslər
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      
      // Son İmtahanlar
      React.createElement(
        'div',
        { className: 'bento-card bg-white/90 dark:bg-[#0c101a]/85 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-sm' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-4' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement('i', { className: 'fas fa-file-signature text-indigo-500 text-base' }),
            React.createElement('h3', { className: 'font-bold text-slate-900 dark:text-slate-100 text-base' }, 'Son Əlavə Edilmiş İmtahanlar')
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('exams'),
              className: 'text-xs font-bold text-indigo-500 hover:text-indigo-400 transition cursor-pointer'
            },
            'Hamısını Gör →'
          )
        ),
        React.createElement(
          'div',
          { className: 'space-y-2.5' },
          recentExams.map(exam => {
            return React.createElement(
              'div',
              {
                key: exam.id,
                onClick: () => onOpenExam(exam),
                className: 'p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 hover:bg-indigo-50/40 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-white/[0.06] cursor-pointer transition flex items-center justify-between'
              },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-3' },
                React.createElement(
                  'div',
                  { className: 'w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-extrabold text-xs' },
                  exam.examType
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('h4', { className: 'text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1' }, exam.title),
                  React.createElement('p', { className: 'text-[10px] text-slate-400' }, `${exam.grade}-ci sinif • Variant ${exam.variant} • ${exam.totalQuestions} Sual • ${exam.durationMinutes} dəq`)
                )
              ),
              React.createElement(
                'span',
                { className: 'px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm transition' },
                'Həll Et'
              )
            );
          })
        )
      ),

      // Son Dərslər
      React.createElement(
        'div',
        { className: 'bento-card bg-white/90 dark:bg-[#0c101a]/85 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-sm' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-4' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement('i', { className: 'fas fa-graduation-cap text-cyan-500 text-base' }),
            React.createElement('h3', { className: 'font-bold text-slate-900 dark:text-slate-100 text-base' }, 'Tövsiyə Olunan Dərslər')
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('lessons'),
              className: 'text-xs font-bold text-cyan-500 hover:text-cyan-400 transition cursor-pointer'
            },
            'Kataloqa Keç →'
          )
        ),
        React.createElement(
          'div',
          { className: 'space-y-2.5' },
          recentLessons.map(les => {
            return React.createElement(
              'div',
              {
                key: les.id,
                onClick: () => {
                  setSelectedSubjectId(les.subjectId);
                  setActiveTab('lessons');
                },
                className: 'p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 hover:bg-cyan-50/40 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-white/[0.06] cursor-pointer transition flex items-center justify-between'
              },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-3' },
                React.createElement(
                  'div',
                  { className: 'w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-extrabold text-xs' },
                  les.grade + ' kl'
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('h4', { className: 'text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1' }, les.title),
                  React.createElement('p', { className: 'text-[10px] text-slate-400' }, `${les.unit} • ${les.readTimeMinutes} dəq oxu • KaTeX & PhET`)
                )
              ),
              React.createElement(
                'span',
                { className: 'px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold' },
                'Oxu'
              )
            );
          })
        )
      )
    )
  );
};
