// MəktəbPlus - Dərslər və Nəzəriyyə Kataloqu (Tree View & Interactive Reader)

import React, { useState, useEffect, useMemo } from 'react';
import { SUBJECTS, GRADES } from '../data/subjects.js';
import { KatexRenderer } from './KatexRenderer.js';
import { PhetEmbed } from './PhetEmbed.js';

export const LessonsView = ({
  lessons,
  selectedSubjectId,
  setSelectedSubjectId,
  activeLessonId,
  setActiveLessonId
}) => {
  const [selectedGrade, setSelectedGrade] = useState(null); // null = Hamısı (Bütün siniflər)
  const [expandedUnits, setExpandedUnits] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fənn və sinifə görə dərsləri filtrləyirik
  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchSubject = selectedSubjectId ? l.subjectId === selectedSubjectId : true;
      const matchGrade = selectedGrade !== null ? l.grade === selectedGrade : true;
      return matchSubject && matchGrade;
    });
  }, [lessons, selectedSubjectId, selectedGrade]);

  // Tree View üçün Bölmələrə (Units) qruplaşdırma və nizamlı sıralama
  const unitsTree = useMemo(() => {
    const sorted = [...filteredLessons].sort((a, b) => {
      if (a.grade !== b.grade) return a.grade - b.grade;
      if (a.unitOrder !== b.unitOrder) return (a.unitOrder || 0) - (b.unitOrder || 0);
      return (a.order || 0) - (b.order || 0);
    });
    const tree = {};
    sorted.forEach(les => {
      const key = selectedGrade === null ? `${les.grade}-ci Sinif: ${les.unit}` : les.unit;
      if (!tree[key]) {
        tree[key] = [];
      }
      tree[key].push(les);
    });
    return tree;
  }, [filteredLessons, selectedGrade]);

  // Cari aktiv dərs
  const currentLesson = useMemo(() => {
    if (activeLessonId) {
      const found = lessons.find(l => l.id === activeLessonId);
      if (found) return found;
    }
    return filteredLessons[0] || lessons[0];
  }, [lessons, activeLessonId, filteredLessons]);

  const toggleUnit = (unit) => {
    setExpandedUnits(prev => ({ ...prev, [unit]: !prev[unit] }));
  };

  const toggleSolution = (id) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectQuizOption = (questionId, key) => {
    if (quizSubmitted[questionId]) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: key }));
  };

  const handleCheckQuiz = (questionId) => {
    setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));
  };

  // Dərs dəyişdikdə və ya pəncərə bağlandıqda səsləndirməni dayandırırıq
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentLesson?.id]);

  // Markdown və KaTeX simvollarını təmizləyən köməkçi funksiya
  const cleanTextForSpeech = (text) => {
    if (!text) return '';
    return text
      .split('###').join('')
      .split('##').join('')
      .split('#').join('')
      .replace(new RegExp('\\*\\*([^\\*]+)\\*\\*', 'g'), '$1')
      .replace(new RegExp('\\*([^\\*]+)\\*', 'g'), '$1')
      .replace(new RegExp('`([^`]+)`', 'g'), '$1')
      .replace(new RegExp('\\$\\$([^\\$]+)\\$\\$', 'g'), ' düsturu ')
      .replace(new RegExp('\\$([^\\$]+)\\$', 'g'), ' ifadəsi ')
      .replace(new RegExp('\\[([^\\]]+)\\]\\([^\\)]+\\)', 'g'), '$1')
      .split('- ').join('')
      .split('>').join('')
      .trim();
  };

  // Səsli oxuma funksiyası (Web Speech API)
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Sizin brauzerinizdə səsli oxuma funksiyası dəstəklənmir.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      if (!currentLesson) return;
      const rawText = `${currentLesson.title}. ${currentLesson.summary || ''}. ${currentLesson.theoryMarkdown || ''}`;
      const textToRead = cleanTextForSpeech(rawText);

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95; // Rahat başa düşülən sürət

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith('az') || v.lang.startsWith('tr'));
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = voice ? voice.lang : 'az-AZ';

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const currentSubjectMeta = SUBJECTS.find(s => s.id === currentLesson?.subjectId) || SUBJECTS[0];

  return React.createElement(
    'div',
    { className: 'space-y-6 animate-fadeIn pb-16' },
    
    // Yuxarı Fənn və Sinif Filtrləri
    React.createElement(
      'div',
      { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 bento-card p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-lg' },
      
      // Fənn Seçimi Scroll Bar
      React.createElement(
        'div',
        { className: 'flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin' },
        SUBJECTS.map(sub => {
          const isSelected = selectedSubjectId === sub.id;
          return React.createElement(
            'button',
            {
              key: sub.id,
              onClick: () => {
                setSelectedSubjectId(sub.id);
                const subjectLessons = lessons.filter(l => l.subjectId === sub.id);
                if (subjectLessons.length > 0) {
                  if (selectedGrade !== null && !subjectLessons.some(l => l.grade === selectedGrade)) {
                    setSelectedGrade(null);
                  }
                  const match = (selectedGrade !== null ? subjectLessons.find(l => l.grade === selectedGrade) : null) || subjectLessons[0];
                  if (match) setActiveLessonId(match.id);
                }
              },
              className: `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`
            },
            React.createElement('span', null, sub.name)
          );
        })
      ),

      // Sinif Seçimi
      React.createElement(
        'div',
        { className: 'flex items-center space-x-1 self-end sm:self-auto shrink-0' },
        React.createElement('span', { className: 'text-xs font-bold text-zinc-400 mr-1' }, 'Sinif:'),
        React.createElement(
          'button',
          {
            onClick: () => {
              setSelectedGrade(null);
              const firstLes = lessons.find(l => (selectedSubjectId ? l.subjectId === selectedSubjectId : true));
              if (firstLes) setActiveLessonId(firstLes.id);
            },
            className: `px-2 py-1 rounded-lg text-xs font-bold transition ${
              selectedGrade === null
                ? 'bg-cyan-500 text-zinc-950 font-black shadow-sm'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`
          },
          'Hamısı'
        ),
        GRADES.map(grade => {
          const isSelected = selectedGrade === grade;
          return React.createElement(
            'button',
            {
              key: grade,
              onClick: () => {
                setSelectedGrade(grade);
                const firstLes = lessons.find(l => l.grade === grade && (selectedSubjectId ? l.subjectId === selectedSubjectId : true));
                if (firstLes) setActiveLessonId(firstLes.id);
              },
              className: `w-7 h-7 rounded-lg text-xs font-bold transition ${
                isSelected
                  ? 'bg-cyan-500 text-zinc-950 font-black shadow-sm'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            },
            grade
          );
        })
      )
    ),

    // Əsas Məzmun: Sol (Tree View) və Sağ (Oxu və İnteraktiv Məzmun)
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
      
      // 1. Sol: Sinif -> Bölmə -> Mövzu Ağac Naviqasiyası (Tree View) (4 sütun)
      React.createElement(
        'aside',
        { className: 'lg:col-span-4 space-y-4' },
        React.createElement(
          'div',
          { className: 'bento-card rounded-3xl p-5 bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-xl sticky top-24' },
          
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement('i', { className: 'fas fa-folder-tree text-indigo-500' }),
              React.createElement('h3', { className: 'font-black text-sm text-zinc-800 dark:text-zinc-200' }, 'Mövzu Ağacı (Kataloq)')
            ),
            React.createElement('span', { className: 'text-[11px] font-semibold text-zinc-400' }, `${filteredLessons.length} Mövzu`)
          ),

          Object.keys(unitsTree).length === 0 ? React.createElement(
            'div',
            { className: 'py-8 text-center text-xs text-zinc-400' },
            React.createElement('i', { className: 'fas fa-box-open text-2xl mb-2 block' }),
            'Bu fənn və sinif üçün hələ dərs əlavə edilməyib. İdarəetmə panelindən yeni dərs əlavə edə bilərsiniz.'
          ) : React.createElement(
            'div',
            { className: 'space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-1' },
            Object.entries(unitsTree).map(([unitName, unitLessons]) => {
              const isExpanded = expandedUnits[unitName] ?? true;
              return React.createElement(
                'div',
                { key: unitName, className: 'rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden' },
                // Unit header (Collapsible)
                React.createElement(
                  'button',
                  {
                    onClick: () => toggleUnit(unitName),
                    className: 'w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition'
                  },
                  React.createElement(
                    'div',
                    { className: 'flex items-center space-x-2' },
                    React.createElement('i', { className: `fas fa-chevron-${isExpanded ? 'down' : 'right'} text-[10px] text-indigo-500` }),
                    React.createElement('span', null, unitName)
                  ),
                  React.createElement('span', { className: 'text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400' }, unitLessons.length)
                ),
                // Lessons in unit
                isExpanded && React.createElement(
                  'div',
                  { className: 'p-1.5 space-y-1 bg-white dark:bg-zinc-900' },
                  unitLessons.map(les => {
                    const isCurrent = currentLesson?.id === les.id;
                    return React.createElement(
                      'button',
                      {
                        key: les.id,
                        onClick: () => setActiveLessonId(les.id),
                        className: `w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between space-x-2 transition ${
                          isCurrent
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`
                      },
                      React.createElement(
                        'div',
                        { className: 'flex items-center space-x-2 min-w-0 flex-1' },
                        React.createElement('i', { className: `fas fa-file-lines text-[11px] shrink-0 ${isCurrent ? 'text-indigo-600' : 'text-zinc-400'}` }),
                        React.createElement('span', { className: 'line-clamp-1 truncate' }, les.title)
                      ),
                      React.createElement(
                        'span',
                        { className: `text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${isCurrent ? 'bg-indigo-200/60 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}` },
                        `${les.grade}-ci sinif`
                      )
                    );
                  })
                )
              );
            })
          )
        )
      ),

      // 2. Sağ: Təmiz Oxu Pəncərəsi (8 sütun)
      React.createElement(
        'main',
        { className: 'lg:col-span-8 space-y-6' },
        
        currentLesson ? React.createElement(
          'article',
          { className: 'bento-card rounded-3xl p-6 sm:p-8 bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-6' },
          
          // Dərs Başlığı və Metadata (Səsli Oxuma ilə)
          React.createElement(
            'div',
            { className: 'pb-5 border-b border-zinc-100 dark:border-zinc-800' },
            React.createElement(
              'div',
              { className: 'flex flex-wrap items-center justify-between gap-3 mb-3' },
              React.createElement(
                'div',
                { className: 'flex flex-wrap items-center gap-2' },
                React.createElement('span', { className: `text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${currentSubjectMeta.badgeBg} ${currentSubjectMeta.badgeText}` }, currentSubjectMeta.name),
                React.createElement('span', { className: 'text-[11px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' }, `${currentLesson.grade}-ci sinif`),
                React.createElement('span', { className: 'text-[11px] font-medium text-zinc-400 flex items-center gap-1' },
                  React.createElement('i', { className: 'fas fa-clock text-[10px]' }),
                  React.createElement('span', null, `${currentLesson.readTimeMinutes} dəqiqəlik oxu`)
                )
              ),
              // AI Səsli Oxuma Düyməsi
              React.createElement(
                'button',
                {
                  onClick: handleToggleAudio,
                  title: isPlayingAudio ? 'Səsləndirməni dayandır' : 'Dərsi səsli oxu (AI Audio)',
                  className: `px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-sm ${
                    isPlayingAudio
                      ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/25'
                      : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800'
                  }`
                },
                React.createElement('i', { className: `fas ${isPlayingAudio ? 'fa-pause' : 'fa-volume-high text-indigo-600 dark:text-indigo-400'}` }),
                React.createElement('span', null, isPlayingAudio ? 'Dayandır' : 'Dərsi Səsləndir')
              )
            ),
            React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight' }, currentLesson.title),
            React.createElement('p', { className: 'text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed' }, currentLesson.summary)
          ),

          // Nəzəriyyə Mətni (KaTeX Render)
          React.createElement(
            'div',
            { className: 'prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4' },
            React.createElement(KatexRenderer, { text: currentLesson.theoryMarkdown })
          ),

          // Əsas Düsturlar Paneli (Key Formulas)
          currentLesson.keyFormulas && currentLesson.keyFormulas.length > 0 && React.createElement(
            'div',
            { className: 'rounded-2xl p-5 bg-gradient-to-br from-indigo-950/50 to-zinc-900/60 border border-indigo-500/30 shadow-inner space-y-3' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-black text-sm' },
              React.createElement('i', { className: 'fas fa-square-root-variable text-base' }),
              React.createElement('span', null, 'Əsas Qaydalar və Düsturlar')
            ),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
              currentLesson.keyFormulas.map(f => {
                return React.createElement(
                  'div',
                  { key: f.id, className: 'p-3 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900 shadow-sm' },
                  React.createElement('div', { className: 'text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1' }, f.name),
                  React.createElement(KatexRenderer, { text: `$$${f.latex}$$`, block: true }),
                  React.createElement('div', { className: 'text-[11px] text-zinc-500 dark:text-zinc-400 mt-1' }, f.description)
                );
              })
            )
          ),

          // PhET İnteraktiv Simulyasiya Bölməsi (Əgər varsa)
          currentLesson.interactiveSim?.enabled && React.createElement(
            'div',
            null,
            React.createElement(PhetEmbed, {
              simUrl: currentLesson.interactiveSim.url,
              title: currentLesson.interactiveSim.title,
              description: currentLesson.interactiveSim.description
            })
          ),

          // Terminlərin Xülasəsi (Glossary)
          currentLesson.glossary && currentLesson.glossary.length > 0 && React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement('h3', { className: 'font-black text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2' },
              React.createElement('i', { className: 'fas fa-spell-check text-cyan-500' }),
              React.createElement('span', null, 'Terminlərin Xülasəsi')
            ),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' },
              currentLesson.glossary.map((g, idx) => {
                return React.createElement(
                  'div',
                  { key: idx, className: 'p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800' },
                  React.createElement('div', { className: 'text-xs font-black text-indigo-600 dark:text-indigo-400' }, g.term),
                  React.createElement('div', { className: 'text-xs text-zinc-600 dark:text-zinc-300 mt-0.5' }, g.definition)
                );
              })
            )
          ),

          // Həlli Gizlədilmiş Nümunəvi Məsələlər (Accordion)
          currentLesson.solvedExamples && currentLesson.solvedExamples.length > 0 && React.createElement(
            'div',
            { className: 'space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800' },
            React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-200 flex items-center gap-2' },
              React.createElement('i', { className: 'fas fa-lightbulb text-amber-500' }),
              React.createElement('span', null, 'Nümunəvi Məsələ və Addım-Addım Həlli')
            ),
            currentLesson.solvedExamples.map(ex => {
              const isRevealed = revealedSolutions[ex.id];
              return React.createElement(
                'div',
                { key: ex.id, className: 'rounded-2xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20 overflow-hidden' },
                React.createElement(
                  'div',
                  { className: 'p-4 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200' },
                  React.createElement('span', { className: 'text-amber-600 dark:text-amber-400 font-bold mr-1' }, 'Məsələ:'),
                  React.createElement(KatexRenderer, { text: ex.question })
                ),
                React.createElement(
                  'div',
                  { className: 'px-4 pb-3' },
                  React.createElement(
                    'button',
                    {
                      onClick: () => toggleSolution(ex.id),
                      className: 'px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center space-x-1.5 transition'
                    },
                    React.createElement('i', { className: `fas fa-${isRevealed ? 'eye-slash' : 'eye'}` }),
                    React.createElement('span', null, isRevealed ? 'Həlli Gizlət' : 'Həlli Göstər (Addım-addım)')
                  )
                ),
                isRevealed && React.createElement(
                  'div',
                  { className: 'p-4 bg-white dark:bg-zinc-900 border-t border-amber-200/70 dark:border-amber-900/50 text-xs sm:text-sm space-y-2' },
                  React.createElement(KatexRenderer, { text: ex.solution })
                )
              );
            })
          ),

          // Dərsin Sonunda "Özünü Yoxla" Mini-Testi
          currentLesson.miniQuiz && currentLesson.miniQuiz.length > 0 && React.createElement(
            'div',
            { className: 'rounded-2xl p-6 bg-zinc-800/50 backdrop-blur-md border border-white/10 space-y-4 pt-6' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement('i', { className: 'fas fa-circle-check text-emerald-500 text-lg' }),
              React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-200' }, 'Dərsi Mənimsəmə Mini-Testi (Özünü Yoxla)')
            ),
            currentLesson.miniQuiz.map((q, qIndex) => {
              const selectedKey = quizAnswers[q.questionId];
              const isChecked = quizSubmitted[q.questionId];
              const isCorrect = selectedKey === q.correctKey;

              return React.createElement(
                'div',
                { key: q.questionId, className: 'p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3' },
                React.createElement(
                  'div',
                  { className: 'text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200' },
                  React.createElement('span', { className: 'text-indigo-600 mr-2' }, `${qIndex + 1}.`),
                  React.createElement(KatexRenderer, { text: q.question })
                ),
                // Variantlar
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
                  q.options.map(opt => {
                    const isOptionSelected = selectedKey === opt.key;
                    let btnClass = 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';

                    if (isChecked) {
                      if (opt.key === q.correctKey) {
                        btnClass = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold';
                      } else if (isOptionSelected && !isCorrect) {
                        btnClass = 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-500 font-bold';
                      }
                    } else if (isOptionSelected) {
                      btnClass = 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-500 font-bold';
                    }

                    return React.createElement(
                      'button',
                      {
                        key: opt.key,
                        onClick: () => handleSelectQuizOption(q.questionId, opt.key),
                        className: `p-2.5 rounded-xl border text-left text-xs flex items-center space-x-2 transition ${btnClass}`
                      },
                      React.createElement('span', { className: 'w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-[10px]' }, opt.key),
                      React.createElement(KatexRenderer, { text: opt.text })
                    );
                  })
                ),
                // Yoxla düyməsi və nəticə
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between pt-2' },
                  !isChecked ? React.createElement(
                    'button',
                    {
                      onClick: () => handleCheckQuiz(q.questionId),
                      disabled: !selectedKey,
                      className: `px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedKey
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      }`
                    },
                    'Cavabı Yoxla'
                  ) : React.createElement(
                    'div',
                    { className: 'w-full' },
                    React.createElement(
                      'div',
                      { className: `p-2.5 rounded-lg text-xs font-semibold ${isCorrect ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'}` },
                      React.createElement('p', { className: 'font-bold' }, isCorrect ? '✓ Əla! Doğru cavab verdiniz.' : `✗ Səhv cavab. Doğru variant: ${q.correctKey}`),
                      React.createElement('p', { className: 'mt-1 text-[11px] opacity-90' }, q.explanation)
                    )
                  )
                )
              );
            })
          )
        ) : React.createElement(
          'div',
          { className: 'bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center text-zinc-400 border border-zinc-200 dark:border-zinc-800' },
          'Dərs seçilməyib'
        )
      )
    )
  );
};
