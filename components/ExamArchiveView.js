// MəktəbPlus - BSQ / KSQ İmtahan Arxiv Bölməsi (İnteraktiv Həll & məktəb Çap/PDF Rejimi)

import React, { useState, useMemo, useEffect } from 'react';
import { SUBJECTS, GRADES } from '../data/subjects.js';
import { KatexRenderer } from './KatexRenderer.js';

export const ExamArchiveView = ({
  exams,
  activeExam,
  setActiveExam,
  onExamFinished
}) => {
  // Süzgəclər
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterType, setFilterType] = useState('all'); // BSQ, KSQ, all
  const [filterSemester, setFilterSemester] = useState('all'); // 1, 2, all

  // İmtahan İcra Rejimi Vəziyyəti
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  // Süzgəclənmiş İmtahanlar
  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      const matchSub = filterSubject === 'all' || e.subjectId === filterSubject;
      const matchGrade = filterGrade === 'all' || e.grade === Number(filterGrade);
      const matchType = filterType === 'all' || e.examType === filterType;
      const matchSem = filterSemester === 'all' || e.semester === Number(filterSemester);
      return matchSub && matchGrade && matchType && matchSem;
    });
  }, [exams, filterSubject, filterGrade, filterType, filterSemester]);

  // İmtahan başladılanda taymeri aktivləşdir
  useEffect(() => {
    if (activeExam && !isExamCompleted) {
      setTimeLeft(activeExam.durationMinutes * 60);
      setSelectedAnswers({});
      setMarkedForReview({});
      setCurrentQuestionIndex(0);
      setIsExamCompleted(false);
    }
  }, [activeExam]);

  // Taymer Sayğacı
  useEffect(() => {
    if (!activeExam || isExamCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, isExamCompleted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionId, key) => {
    if (isExamCompleted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: key }));
  };

  const toggleReviewMark = (qIndex) => {
    setMarkedForReview(prev => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };

  const finishExam = () => {
    setIsExamCompleted(true);
    if (onExamFinished) {
      onExamFinished(calculateResults());
    }
  };

  // Nəticələrin və Məktəb Qiymətinin (2, 3, 4, 5) Hesablanması
  const calculateResults = () => {
    if (!activeExam) return null;

    let totalScore = 0;
    let correctCount = 0;
    const details = activeExam.questions.map(q => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctKey;
      if (isCorrect) {
        correctCount++;
        totalScore += (q.points || 20);
      }
      return {
        questionId: q.id,
        selected,
        correct: q.correctKey,
        isCorrect
      };
    });

    const percentage = Math.round((correctCount / activeExam.questions.length) * 100);
    
    // Azərbaycan məktəb qiymətləndirmə şkalası (2, 3, 4, 5)
    let schoolGrade = 2;
    let gradeLabel = 'Qeyri-kafi (2)';
    if (percentage >= 81) {
      schoolGrade = 5;
      gradeLabel = 'Əla (5)';
    } else if (percentage >= 61) {
      schoolGrade = 4;
      gradeLabel = 'Yaxşı (4)';
    } else if (percentage >= 31) {
      schoolGrade = 3;
      gradeLabel = 'Kafi (3)';
    }

    return {
      totalScore,
      correctCount,
      totalQuestions: activeExam.questions.length,
      percentage,
      schoolGrade,
      gradeLabel,
      details
    };
  };

  const results = isExamCompleted ? calculateResults() : null;

  // Çap / PDF Əməliyyatı
  const handlePrint = () => {
    window.print();
  };

  // Əgər aktiv imtahan seçilməyibsə, İmtahan Arxivinin Siyahısını göstəririk
  if (!activeExam) {
    return React.createElement(
      'div',
      { className: 'space-y-6 animate-fadeIn pb-16 no-print' },
      
      // Başlıq və Süzgəclər Paneli
      React.createElement(
        'div',
        { className: 'bento-card p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-4' },
        React.createElement(
          'div',
          { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800' },
          React.createElement(
            'div',
            null,
            React.createElement('h2', { className: 'text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight' }, 'BSQ və KSQ İmtahan Arxiv Kitabxanası'),
            React.createElement('p', { className: 'text-xs text-slate-500 dark:text-slate-400' }, 'Fənn, sinif və yarımil üzrə süzgəcdən keçirin, interaktiv həll edin və ya çap vərəqi kimi çıxarın')
          ),
          React.createElement(
            'span',
            { className: 'px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-xs font-bold' },
            `${filteredExams.length} İmtahan Tapıldı`
          )
        ),

        // Çoxölçülü Süzgəc Forması
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3' },
          
          // Fənn süzgəci
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-slate-500 mb-1' }, 'Fənn:'),
            React.createElement(
              'select',
              {
                value: filterSubject,
                onChange: e => setFilterSubject(e.target.value),
                className: 'w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors'
              },
              React.createElement('option', { value: 'all' }, 'Bütün Fənlər'),
              SUBJECTS.map(s => React.createElement('option', { key: s.id, value: s.id }, s.name))
            )
          ),

          // Sinif süzgəci
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-slate-500 mb-1' }, 'Sinif:'),
            React.createElement(
              'select',
              {
                value: filterGrade,
                onChange: e => setFilterGrade(e.target.value),
                className: 'w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors'
              },
              React.createElement('option', { value: 'all' }, 'Bütün Siniflər (6-11)'),
              GRADES.map(g => React.createElement('option', { key: g, value: g }, `${g}-ci sinif`))
            )
          ),

          // Növ (BSQ / KSQ)
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-slate-500 mb-1' }, 'İmtahan Növü:'),
            React.createElement(
              'select',
              {
                value: filterType,
                onChange: e => setFilterType(e.target.value),
                className: 'w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors'
              },
              React.createElement('option', { value: 'all' }, 'BSQ və KSQ Birlikdə'),
              React.createElement('option', { value: 'BSQ' }, 'BSQ (Böyük Summativ)'),
              React.createElement('option', { value: 'KSQ' }, 'KSQ (Kiçik Summativ)')
            )
          ),

          // Yarımil
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-slate-500 mb-1' }, 'Yarımil:'),
            React.createElement(
              'select',
              {
                value: filterSemester,
                onChange: e => setFilterSemester(e.target.value),
                className: 'w-full p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors'
              },
              React.createElement('option', { value: 'all' }, 'Hər İki Yarımil'),
              React.createElement('option', { value: '1' }, 'I Yarımil'),
              React.createElement('option', { value: '2' }, 'II Yarımil')
            )
          )
        )
      ),

      // İmtahan Kartları Şəbəkəsi
      filteredExams.length === 0 ? React.createElement(
        'div',
        { className: 'bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800' },
        React.createElement('i', { className: 'fas fa-magnifying-glass text-3xl mb-3 block text-slate-300' }),
        'Seçilmiş süzgəc parametrlərinə uyğun imtahan vərəqi tapılmadı.'
      ) : React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-5' },
        filteredExams.map(exam => {
          const subject = SUBJECTS.find(s => s.id === exam.subjectId);
          return React.createElement(
            'div',
            {
              key: exam.id,
              className: 'bento-card rounded-3xl p-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg hover:border-indigo-500/40 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between'
            },
            React.createElement(
              'div',
              { className: 'space-y-3' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between' },
                React.createElement(
                  'div',
                  { className: 'flex items-center space-x-2' },
                  React.createElement('span', { className: `px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${subject?.badgeBg} ${subject?.badgeText}` }, subject?.name),
                  React.createElement('span', { className: 'px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' }, `${exam.grade}-ci sinif`),
                  React.createElement('span', { className: 'px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400' }, `Variant ${exam.variant}`)
                ),
                React.createElement(
                  'span',
                  { className: 'text-xs font-black text-indigo-600 dark:text-indigo-400' },
                  exam.examType
                )
              ),
              React.createElement('h3', { className: 'font-black text-slate-900 dark:text-slate-100 text-base leading-snug' }, exam.title),
              React.createElement(
                'div',
                { className: 'flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1' },
                React.createElement('span', { className: 'flex items-center gap-1.5' },
                  React.createElement('i', { className: 'fas fa-question-circle text-indigo-500' }),
                  React.createElement('span', null, `${exam.totalQuestions} Sual`)
                ),
                React.createElement('span', { className: 'flex items-center gap-1.5' },
                  React.createElement('i', { className: 'fas fa-clock text-cyan-500' }),
                  React.createElement('span', null, `${exam.durationMinutes} Dəqiqə`)
                ),
                React.createElement('span', { className: 'flex items-center gap-1.5' },
                  React.createElement('i', { className: 'fas fa-star text-amber-500' }),
                  React.createElement('span', null, `${exam.maxScore} Bal`)
                )
              )
            ),

            // Düymələr: İnteraktiv Həll Et və məktəb Çap Görünüşü
            React.createElement(
              'div',
              { className: 'mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3' },
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setActiveExam(exam);
                    setPrintMode(false);
                  },
                  className: 'flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center space-x-2'
                },
                React.createElement('i', { className: 'fas fa-play text-[11px]' }),
                React.createElement('span', null, 'İnteraktiv Həll Et')
              ),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setActiveExam(exam);
                    setPrintMode(true);
                  },
                  className: 'px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center space-x-2'
                },
                React.createElement('i', { className: 'fas fa-print text-[11px]' }),
                React.createElement('span', null, 'Çap / PDF')
              )
            )
          );
        })
      )
    );
  }

  // =========================================================================
  // məktəb ÇAP / PDF GÖRÜNÜŞÜ (@media print)
  // =========================================================================
  if (printMode) {
    return React.createElement(
      'div',
      { className: 'max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16' },
      
      // Çap üçün İdarəetmə Paneli (Ekran rejimində görünür, çapda gizlənir)
      React.createElement(
        'div',
        { className: 'no-print bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between' },
        React.createElement(
          'button',
          {
            onClick: () => {
              setActiveExam(null);
              setPrintMode(false);
            },
            className: 'px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          },
          '← Arxivə Qayıt'
        ),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement(
            'button',
            {
              onClick: () => setPrintMode(false),
              className: 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            },
            'İnteraktiv Rejimə Keç'
          ),
          React.createElement(
            'button',
            {
              onClick: handlePrint,
              className: 'px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 flex items-center space-x-2'
            },
            React.createElement('i', { className: 'fas fa-print' }),
            React.createElement('span', null, 'Vərəqi Çap Et / PDF Saxla')
          )
        )
      ),

      // Standart Məktəb İmtahan Vərəqi (A4 dizaynı)
      React.createElement(
        'div',
        {
          className: 'print-page bg-white text-black p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200'
        },
        // məktəb Başlıq
        React.createElement(
          'div',
          { className: 'text-center border-b-2 border-black pb-4 mb-6 space-y-1' },
          React.createElement('div', { className: 'text-xs font-bold uppercase tracking-wider' }, activeExam.schoolMetadata?.ministry || 'Azərbaycan Respublikası Elm və Təhsil Nazirliyi'),
          React.createElement('div', { className: 'text-sm font-black' }, activeExam.schoolMetadata?.schoolName || 'Məktəb-Lisey Kompleksi'),
          React.createElement('div', { className: 'text-base font-extrabold uppercase mt-2' }, `${activeExam.grade}-ci Sinif ${activeExam.title}`),
          React.createElement('div', { className: 'text-xs font-bold' }, `Variant: ${activeExam.variant} • Müddət: ${activeExam.durationMinutes} dəqiqə • Maksimum bal: ${activeExam.maxScore}`)
        ),

        // Şagird Məlumat Xanaları
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4 border border-black p-3 mb-6 text-xs' },
          React.createElement('div', null, React.createElement('span', { className: 'font-bold' }, 'Şagirdin A.S.A: '), '_________________________________________'),
          React.createElement('div', null, React.createElement('span', { className: 'font-bold' }, 'Sinif: '), `${activeExam.grade} / _____`),
          React.createElement('div', null, React.createElement('span', { className: 'font-bold' }, 'Tarix: '), '_____ / _____ / 202___-ci il'),
          React.createElement('div', null, React.createElement('span', { className: 'font-bold' }, 'Topladığı bal / Qiymət: '), '_______ / _______')
        ),

        // Suallar (2 sütunlu səliqəli düzülüş)
        React.createElement(
          'div',
          { className: 'space-y-6 mb-8' },
          activeExam.questions.map((q, idx) => {
            return React.createElement(
              'div',
              { key: q.id, className: 'break-inside-avoid pb-4 border-b border-dashed border-gray-300' },
              React.createElement(
                'div',
                { className: 'font-bold text-sm mb-2 flex items-start space-x-2' },
                React.createElement('span', null, `${idx + 1}.`),
                React.createElement(KatexRenderer, { text: q.text })
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pl-5' },
                q.options.map(opt => {
                  return React.createElement(
                    'div',
                    { key: opt.key, className: 'flex items-center space-x-1.5' },
                    React.createElement('span', { className: 'font-bold' }, `${opt.key})`),
                    React.createElement(KatexRenderer, { text: opt.text })
                  );
                })
              )
            );
          })
        ),

        // İmtahan Vərəqinin Aşağı Cavab Kartı (Kodlaşdırma Cədvəli)
        React.createElement(
          'div',
          { className: 'border border-black p-4 text-xs break-inside-avoid space-y-3' },
          React.createElement('div', { className: 'font-bold text-center uppercase tracking-wider' }, 'Cavab Cədvəli'),
          React.createElement(
            'div',
            { className: 'grid grid-cols-5 gap-2 text-center' },
            activeExam.questions.map((_, idx) => {
              return React.createElement(
                'div',
                { key: idx, className: 'border border-gray-400 p-2 rounded' },
                React.createElement('div', { className: 'font-bold' }, `Sual ${idx + 1}`),
                React.createElement('div', { className: 'mt-1 text-gray-400 font-mono' }, '[   ]')
              );
            })
          ),
          React.createElement(
            'div',
            { className: 'pt-4 flex justify-between items-center text-[11px] text-gray-700' },
            React.createElement('span', null, activeExam.schoolMetadata?.teacherSignatureLabel || 'Fənn müəlliminin imzası: ___________________'),
            React.createElement('span', null, 'Yoxlayan komissiya: ___________________')
          )
        )
      )
    );
  }

  // =========================================================================
  // İNTERAKTİV İMTAHAN REJİMİ
  // =========================================================================
  const currentQ = activeExam.questions[currentQuestionIndex];
  const isSelected = selectedAnswers[currentQ?.id];

  return React.createElement(
    'div',
    { className: 'space-y-6 animate-fadeIn pb-16 no-print' },
    
    // Yuxarı Başlıq və Taymer Paneli
    React.createElement(
      'div',
      { className: 'bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-20 z-20' },
      
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(
          'button',
          {
            onClick: () => setActiveExam(null),
            className: 'p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
          },
          React.createElement('i', { className: 'fas fa-arrow-left' })
        ),
        React.createElement(
          'div',
          null,
          React.createElement('h3', { className: 'font-black text-sm text-slate-800 dark:text-slate-100 line-clamp-1' }, activeExam.title),
          React.createElement('p', { className: 'text-[10px] text-slate-400' }, `Variant ${activeExam.variant} • Cəmi ${activeExam.totalQuestions} Sual`)
        )
      ),

      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        
        // Taymer (əgər bitməyibsə)
        !isExamCompleted && React.createElement(
          'div',
          { className: `px-3.5 py-1.5 rounded-xl font-mono text-xs font-black flex items-center space-x-2 ${
            timeLeft < 300 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }` },
          React.createElement('i', { className: 'fas fa-stopwatch text-indigo-500' }),
          React.createElement('span', null, formatTime(timeLeft))
        ),

        // Çap rejimini aç
        React.createElement(
          'button',
          {
            onClick: () => setPrintMode(true),
            title: 'Çap vərəqi görünüşü',
            className: 'p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          },
          React.createElement('i', { className: 'fas fa-print' })
        ),

        // İmtahanı Bitir Düyməsi
        !isExamCompleted ? React.createElement(
          'button',
          {
            onClick: finishExam,
            className: 'px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition'
          },
          'İmtahanı Bitir'
        ) : React.createElement(
          'button',
          {
            onClick: () => {
              setIsExamCompleted(false);
              setTimeLeft(activeExam.durationMinutes * 60);
              setSelectedAnswers({});
            },
            className: 'px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition'
          },
          'Yenidən Həll Et'
        )
      )
    ),

    // NƏTİCƏ BLOKU (Əgər imtahan bitibsə)
    isExamCompleted && results && React.createElement(
      'div',
      { className: 'rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl space-y-6' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-700/50' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'text-xs font-bold text-indigo-300 uppercase tracking-wider' }, 'Summativ Qiymətləndirmə Nəticəsi'),
          React.createElement('h2', { className: 'text-2xl sm:text-3xl font-black mt-1' }, `Yekun Qiymətiniz: ${results.gradeLabel}`),
          React.createElement('p', { className: 'text-xs text-indigo-200 mt-1' }, `${results.totalQuestions} sualdan ${results.correctCount} düzgün cavab (${results.percentage}%)`)
        ),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-3 self-end sm:self-auto' },
          React.createElement(
            'div',
            { className: 'text-center px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20' },
            React.createElement('div', { className: 'text-2xl font-black text-amber-300' }, `${results.totalScore}`),
            React.createElement('div', { className: 'text-[10px] text-indigo-200 uppercase font-bold' }, 'Toplanan Bal')
          ),
          React.createElement(
            'div',
            { className: 'text-center px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20' },
            React.createElement('div', { className: 'text-2xl font-black text-emerald-400' }, `${results.schoolGrade}`),
            React.createElement('div', { className: 'text-[10px] text-indigo-200 uppercase font-bold' }, 'Məktəb Qiyməti')
          )
        )
      ),
      React.createElement(
        'p',
        { className: 'text-xs text-indigo-200' },
        'Aşağıdakı sual vərəqində hər bir sual üçün AI Chain-of-Thought (Addım-addım həll izahı) açılmışdır. Səhvlərinizi analiz edin.'
      )
    ),

    // Əsas İmtahan Vərəqi: Sol (Suallar Naviqasiyası) & Sağ (Aktiv Sual və ya Bütün Suallar İzahla)
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
      
      // Sol: Suallar Paneli (3 sütun)
      React.createElement(
        'div',
        { className: 'lg:col-span-3 space-y-4' },
        React.createElement(
          'div',
          { className: 'bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm' },
          React.createElement('h4', { className: 'text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3' }, 'Suallar Palitrası'),
          React.createElement(
            'div',
            { className: 'grid grid-cols-5 gap-2' },
            activeExam.questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentQuestionIndex === idx;
              const isFlagged = markedForReview[idx];

              let btnBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
              if (isExamCompleted) {
                const isCorrect = selectedAnswers[q.id] === q.correctKey;
                btnBg = isCorrect ? 'bg-emerald-500 text-white font-bold' : 'bg-rose-500 text-white font-bold';
              } else if (isCurrent) {
                btnBg = 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/30';
              } else if (isAnswered) {
                btnBg = 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-300 dark:border-indigo-700';
              }

              return React.createElement(
                'button',
                {
                  key: q.id,
                  onClick: () => setCurrentQuestionIndex(idx),
                  className: `h-10 rounded-xl text-xs font-bold transition relative ${btnBg}`
                },
                idx + 1,
                isFlagged && !isExamCompleted && React.createElement('span', { className: 'absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500' })
              );
            })
          ),
          !isExamCompleted && React.createElement(
            'div',
            { className: 'mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-500' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full bg-indigo-600' }),
              React.createElement('span', null, 'Aktiv sual')
            ),
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full bg-indigo-200 dark:bg-indigo-800' }),
              React.createElement('span', null, 'Cavablandırılmış')
            ),
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full bg-amber-500' }),
              React.createElement('span', null, 'Şübhəli / Bayraq qoyulmuş')
            )
          )
        )
      ),

      // Sağ: Sual Məzmunu və Variantlar (9 sütun)
      React.createElement(
        'div',
        { className: 'lg:col-span-9 space-y-6' },
        
        // Cari Sual Kartı
        React.createElement(
          'div',
          { className: 'bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6' },
          
          // Sualın Başlıq Barı
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement('span', { className: 'px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-xs' }, `Sual ${currentQuestionIndex + 1} / ${activeExam.questions.length}`),
              React.createElement('span', { className: 'text-xs text-slate-400 font-semibold' }, `${currentQ.points || 20} Bal`)
            ),
            !isExamCompleted && React.createElement(
              'button',
              {
                onClick: () => toggleReviewMark(currentQuestionIndex),
                className: `px-3 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  markedForReview[currentQuestionIndex]
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              },
              React.createElement('i', { className: 'fas fa-flag text-xs' }),
              React.createElement('span', null, markedForReview[currentQuestionIndex] ? 'Bayraq çıxar' : 'Sonra bax')
            )
          ),

          // Sualın Mətni (KaTeX)
          React.createElement(
            'div',
            { className: 'text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed' },
            React.createElement(KatexRenderer, { text: currentQ.text })
          ),

          // Variantlar Siyahısı
          React.createElement(
            'div',
            { className: 'space-y-2.5' },
            currentQ.options.map(opt => {
              const isCurrentSelected = isSelected === opt.key;
              let optClass = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';

              if (isExamCompleted) {
                if (opt.key === currentQ.correctKey) {
                  optClass = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                } else if (isCurrentSelected && opt.key !== currentQ.correctKey) {
                  optClass = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200 font-bold';
                }
              } else if (isCurrentSelected) {
                optClass = 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm';
              }

              return React.createElement(
                'button',
                {
                  key: opt.key,
                  onClick: () => handleSelectAnswer(currentQ.id, opt.key),
                  className: `w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center space-x-3 transition-all ${optClass}`
                },
                React.createElement(
                  'span',
                  { className: `w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCurrentSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }` },
                  opt.key
                ),
                React.createElement('div', { className: 'flex-1' },
                  React.createElement(KatexRenderer, { text: opt.text })
                )
              );
            })
          ),

          // Naviqasiya Düymələri (Əvvəlki / Növbəti)
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800' },
            React.createElement(
              'button',
              {
                onClick: () => setCurrentQuestionIndex(prev => Math.max(0, prev - 1)),
                disabled: currentQuestionIndex === 0,
                className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                }`
              },
              React.createElement('i', { className: 'fas fa-arrow-left text-[10px]' }),
              React.createElement('span', null, 'Əvvəlki')
            ),
            React.createElement(
              'button',
              {
                onClick: () => setCurrentQuestionIndex(prev => Math.min(activeExam.questions.length - 1, prev + 1)),
                disabled: currentQuestionIndex === activeExam.questions.length - 1,
                className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  currentQuestionIndex === activeExam.questions.length - 1 ? 'opacity-40 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`
              },
              React.createElement('span', null, 'Növbəti'),
              React.createElement('i', { className: 'fas fa-arrow-right text-[10px]' })
            )
          )
        ),

        // AI CHAIN-OF-THOUGHT (Addım-addım Həll İzahı - İmtahan Bitdikdə Görünür)
        isExamCompleted && currentQ.explanationCoT && React.createElement(
          'div',
          { className: 'bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-900 shadow-sm space-y-5 animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2.5 text-indigo-600 dark:text-indigo-400 pb-3 border-b border-indigo-100 dark:border-indigo-900/50' },
            React.createElement('i', { className: 'fas fa-robot text-lg' }),
            React.createElement('h3', { className: 'font-black text-base' }, 'AI Addım-Addım Həll İzahı (Chain-of-Thought)')
          ),

          // 1. Verilənlər
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm' },
            React.createElement('div', { className: 'font-bold text-slate-500 text-[11px] uppercase mb-1' }, '1. Verilənlər və Şərt:'),
            React.createElement(KatexRenderer, { text: currentQ.explanationCoT.given })
          ),

          // 2. Qayda / Düstur
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 text-xs sm:text-sm' },
            React.createElement('div', { className: 'font-bold text-indigo-500 text-[11px] uppercase mb-1' }, '2. Əsas Qayda və Düstur:'),
            React.createElement(KatexRenderer, { text: currentQ.explanationCoT.formula })
          ),

          // 3. Addımlar
          React.createElement(
            'div',
            { className: 'space-y-3' },
            React.createElement('div', { className: 'font-bold text-slate-500 text-[11px] uppercase' }, '3. Addım-Addım Hesablama Gedişi:'),
            currentQ.explanationCoT.steps.map(st => {
              return React.createElement(
                'div',
                { key: st.stepNumber, className: 'p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm space-y-1' },
                React.createElement('div', { className: 'font-black text-indigo-600 dark:text-indigo-400' }, `Addım ${st.stepNumber}: ${st.title}`),
                React.createElement(KatexRenderer, { text: st.content })
              );
            })
          ),

          // 4. Yekun Nəticə
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm' },
            React.createElement('div', { className: 'font-bold text-emerald-700 dark:text-emerald-300 text-[11px] uppercase mb-1' }, '4. Yekun Nəticə və Doğru Variant:'),
            React.createElement(KatexRenderer, { text: currentQ.explanationCoT.conclusion })
          )
        )
      )
    )
  );
};
