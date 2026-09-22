// MəktəbPlus - Ana Səhifə (Dashboard)

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
    { className: 'space-y-8 animate-fadeIn pb-12' },
    
    // 1. Qəbul və Təqdimat Hero Banneri
    React.createElement(
      'div',
      {
        className: 'relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 p-6 sm:p-10 text-white shadow-xl shadow-indigo-500/20'
      },
      // Dekorativ dairələr
      React.createElement('div', { className: 'absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none' }),
      React.createElement('div', { className: 'absolute right-1/3 -bottom-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none' }),

      React.createElement(
        'div',
        { className: 'relative z-10 max-w-2xl' },
        React.createElement(
          'div',
          { className: 'inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-4 border border-white/20' },
          React.createElement('span', { className: 'text-amber-300 font-bold' }, '✦'),
          React.createElement('span', null, 'Bakı Türk Liseyi Tədris Portalı')
        ),
        React.createElement(
          'h1',
          { className: 'text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3' },
          'Məktəb Dərsləri, BSQ/KSQ İmtahanları və 1v1 PvP Arenası'
        ),
        React.createElement(
          'p',
          { className: 'text-sm sm:text-base text-indigo-100 mb-6 leading-relaxed' },
          'Bütün fənlər üzrə KaTeX dəstəkli nəzəriyyə konspektləri, PhET laboratoriyaları, məktəb standartlı BSQ/KSQ test vərəqləri və dostlarınızla canlı yarış!'
        ),
        
        // Fəaliyyət düymələri
        React.createElement(
          'div',
          { className: 'flex flex-wrap gap-3' },
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('lessons'),
              className: 'px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-md transition transform active:scale-95 flex items-center space-x-2'
            },
            React.createElement('i', { className: 'fas fa-book-open-reader' }),
            React.createElement('span', null, 'Dərslərə Başla')
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('exams'),
              className: 'px-5 py-2.5 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/60 border border-white/30 text-white font-bold text-xs sm:text-sm transition flex items-center space-x-2'
            },
            React.createElement('i', { className: 'fas fa-file-signature' }),
            React.createElement('span', null, 'BSQ / KSQ Həll Et')
          ),
          React.createElement(
            'button',
            {
              onClick: onOpenTools,
              className: 'px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-300/40 text-cyan-200 font-bold text-xs sm:text-sm transition flex items-center space-x-2'
            },
            React.createElement('i', { className: 'fas fa-toolbox' }),
            React.createElement('span', null, 'Alətlər & Calculus')
          ),
          React.createElement(
            'button',
            {
              onClick: () => onStartPvp('quick'),
              className: 'px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center space-x-2'
            },
            React.createElement('i', { className: 'fas fa-bolt' }),
            React.createElement('span', null, '1v1 Sürətli Döyüş')
          )
        )
      )
    ),

    // 2. Günün PvP Çağırışı (Geymifikasiya Vitrini)
    React.createElement(
      'div',
      {
        className: 'rounded-2xl p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-300/40 dark:border-amber-800/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm'
      },
      React.createElement(
        'div',
        { className: 'flex items-center space-x-4' },
        React.createElement(
          'div',
          { className: 'w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-2xl text-white shadow-lg shadow-amber-500/30 shrink-0' },
          '⚔️'
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'flex items-center gap-2' },
            React.createElement('h3', { className: 'font-black text-slate-800 dark:text-slate-100 text-base' }, 'Günün Canlı PvP Çağırışı'),
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
            className: 'w-full md:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition'
          },
          'Çağırışı Qəbul Et'
        )
      )
    ),

    // 3. Fənlər Şəbəkəsi (Subjects Grid)
    React.createElement(
      'div',
      { className: 'space-y-4' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement(
          'div',
          null,
          React.createElement('h2', { className: 'text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight' }, 'Tədris Fənləri Kataloqu'),
          React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400' }, 'Fənn seçərək mövcud nəzəriyyə dərslərinə və testlərinə keçid edin')
        ),
        React.createElement(
          'span',
          { className: 'text-xs font-bold text-indigo-600 dark:text-indigo-400' },
          `${SUBJECTS.length} Fənn Mövcuddur`
        )
      ),

      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
        SUBJECTS.map(subject => {
          return React.createElement(
            'div',
            {
              key: subject.id,
              onClick: () => {
                setSelectedSubjectId(subject.id);
                setActiveTab('lessons');
              },
              className: 'group cursor-pointer rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'
            },
            React.createElement(
              'div',
              { className: 'flex items-start justify-between mb-3' },
              React.createElement(
                'div',
                {
                  className: `w-11 h-11 rounded-xl bg-gradient-to-tr ${subject.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition transform`
                },
                React.createElement('i', { className: `fas ${getSubjectIconClass(subject.icon)} text-lg` })
              ),
              React.createElement(
                'span',
                { className: `text-[11px] font-bold px-2 py-0.5 rounded-lg ${subject.badgeBg} ${subject.badgeText}` },
                subject.shortName
              )
            ),
            React.createElement('h3', { className: 'font-black text-slate-800 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition' }, subject.name),
            React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2' }, subject.description),
            React.createElement(
              'div',
              { className: 'mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400' },
              React.createElement(
                'span',
                { className: 'flex items-center space-x-1 font-medium' },
                React.createElement('i', { className: 'fas fa-book-open text-indigo-500 text-[10px]' }),
                React.createElement('span', null, `${subject.totalLessons} Dərs`)
              ),
              React.createElement(
                'span',
                { className: 'flex items-center space-x-1 font-medium' },
                React.createElement('i', { className: 'fas fa-file-lines text-cyan-500 text-[10px]' }),
                React.createElement('span', null, `${subject.totalExams} BSQ/KSQ`)
              ),
              React.createElement(
                'span',
                { className: 'text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition' },
                '→'
              )
            )
          );
        })
      )
    ),

    // 4. İki sütunlu Xülasə: Son BSQ/KSQ Testləri & Ən Son Dərslər
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      
      // Son İmtahanlar
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-4' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement('i', { className: 'fas fa-file-signature text-indigo-600 text-lg' }),
            React.createElement('h3', { className: 'font-black text-slate-800 dark:text-slate-100 text-base' }, 'Son Əlavə Edilmiş İmtahanlar')
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('exams'),
              className: 'text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline'
            },
            'Hamısını Gör →'
          )
        ),
        React.createElement(
          'div',
          { className: 'space-y-3' },
          recentExams.map(exam => {
            return React.createElement(
              'div',
              {
                key: exam.id,
                onClick: () => onOpenExam(exam),
                className: 'p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer transition flex items-center justify-between'
              },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-3' },
                React.createElement(
                  'div',
                  { className: 'w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs' },
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
                { className: 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-sm' },
                'Həll Et'
              )
            );
          })
        )
      ),

      // Son Dərslər
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-4' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement('i', { className: 'fas fa-graduation-cap text-cyan-600 text-lg' }),
            React.createElement('h3', { className: 'font-black text-slate-800 dark:text-slate-100 text-base' }, 'Tövsiyə Olunan Dərslər')
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('lessons'),
              className: 'text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline'
            },
            'Kataloqa Keç →'
          )
        ),
        React.createElement(
          'div',
          { className: 'space-y-3' },
          recentLessons.map(les => {
            return React.createElement(
              'div',
              {
                key: les.id,
                onClick: () => {
                  setSelectedSubjectId(les.subjectId);
                  setActiveTab('lessons');
                },
                className: 'p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50/50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer transition flex items-center justify-between'
              },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-3' },
                React.createElement(
                  'div',
                  { className: 'w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs' },
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
                { className: 'px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold' },
                'Oxu'
              )
            );
          })
        )
      )
    )
  );
};
