// MəktəbPlus - Məlumat İdarəetmə və Gələcək Skan Paneli (Content Manager)

import React, { useState } from 'react';
import { SUBJECTS, GRADES } from '../data/subjects.js';
import { StorageService } from '../services/storageService.js';
import { KatexRenderer } from './KatexRenderer.js';

export const ContentManagerView = ({
  exams,
  lessons,
  pvpQuestions,
  onDataRefresh
}) => {
  const [activeSubTab, setActiveSubTab] = useState('form'); // 'form', 'json', 'scanner'
  const [toastMessage, setToastMessage] = useState(null);

  // Forma vəziyyəti: Yeni Sual Daxil Etmə
  const [targetExamId, setTargetExamId] = useState(exams[0]?.id || '');
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    subjectId: 'riyaziyyat',
    grade: 10,
    topicTags: 'Törəmə, Analiz',
    difficulty: 2,
    points: 20,
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    optionE: '',
    correctKey: 'A',
    explanationGiven: '',
    explanationFormula: '',
    explanationStep1: '',
    explanationConclusion: ''
  });

  // JSON Daxil Etmə / İxrac vəziyyəti
  const [rawJsonInput, setRawJsonInput] = useState('');

  // Skaner / OCR Mətn Çevirici köməkçisi
  const [ocrRawText, setOcrRawText] = useState(`1. Funksiyanın törəməsini tapın: f(x) = 3x^2 - 4x + 1
A) 6x - 4
B) 6x + 4
C) 3x - 4
D) 6x
E) 12x
İzah: Törəmə qaydasına əsasən (x^2)' = 2x, buradan f'(x) = 6x - 4 alınır.`);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Forma ilə sual əlavə et
  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.text.trim()) {
      showToast('Zəhmət olmasa sualın mətnini daxil edin!', true);
      return;
    }

    const questionObj = {
      id: `q-custom-${Date.now()}`,
      text: newQuestion.text,
      subjectId: newQuestion.subjectId,
      grade: Number(newQuestion.grade),
      topicTags: newQuestion.topicTags.split(',').map(t => t.trim()),
      difficulty: Number(newQuestion.difficulty),
      points: Number(newQuestion.points),
      options: [
        { key: 'A', text: newQuestion.optionA || 'Variant A' },
        { key: 'B', text: newQuestion.optionB || 'Variant B' },
        { key: 'C', text: newQuestion.optionC || 'Variant C' },
        { key: 'D', text: newQuestion.optionD || 'Variant D' },
        { key: 'E', text: newQuestion.optionE || 'Variant E' }
      ],
      correctKey: newQuestion.correctKey,
      explanationCoT: {
        given: newQuestion.explanationGiven || 'İlkin verilənlər qeyd olunub.',
        formula: newQuestion.explanationFormula || 'Əsas riyazi/elmi düstur.',
        steps: [
          {
            stepNumber: 1,
            title: 'Hesablama və sadələşdirmə',
            content: newQuestion.explanationStep1 || 'Addım-addım hesablama.'
          }
        ],
        conclusion: newQuestion.explanationConclusion || `Doğru variant ${newQuestion.correctKey}-dir.`
      }
    };

    // Həm seçilmiş imtahana, həm də PvP suallarına əlavə et
    if (targetExamId) {
      StorageService.addQuestionToExam(targetExamId, questionObj);
    }
    StorageService.addPvpQuestion(questionObj);

    showToast('Yeni sual uğurla bazaya və imtahana əlavə edildi!');
    if (onDataRefresh) onDataRefresh();

    // Formanı təmizlə
    setNewQuestion(prev => ({
      ...prev,
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      optionE: '',
      explanationGiven: '',
      explanationFormula: '',
      explanationStep1: '',
      explanationConclusion: ''
    }));
  };

  // JSON İdxal et
  const handleImportJson = () => {
    if (!rawJsonInput.trim()) {
      showToast('Zəhmət olmasa JSON mətnini yapışdırın!', true);
      return;
    }
    const res = StorageService.importDatabaseJson(rawJsonInput);
    if (res.success) {
      showToast(res.message);
      if (onDataRefresh) onDataRefresh();
      setRawJsonInput('');
    } else {
      showToast(res.message, true);
    }
  };

  // Bütün Bazanı JSON faylı kimi endir
  const handleDownloadDatabase = () => {
    const jsonStr = StorageService.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mekteb_plus_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Məlumat bazası JSON faylı olaraq endirildi!');
  };

  // Standart vəziyyətə sıfırla
  const handleResetDefaults = () => {
    if (confirm('Bütün fərdi əlavə edilmiş testlər silinəcək və ilkin mock verilənlər bərpa ediləcək. Davam edilsin?')) {
      StorageService.resetToDefault();
      if (onDataRefresh) onDataRefresh();
      showToast('Baza ilkin vəziyyətinə qaytarıldı!');
    }
  };

  // Skaner OCR Mətnindən Sual Hazırla
  const handleParseOcr = () => {
    // Sadə regex ilə variantları ayırırıq
    const lines = ocrRawText.split('\n');
    let qText = lines[0] || '';
    let optA = '', optB = '', optC = '', optD = '', optE = '';
    let expl = '';

    lines.forEach(l => {
      const trimmed = l.trim();
      if (trimmed.startsWith('A)')) optA = trimmed.replace('A)', '').trim();
      else if (trimmed.startsWith('B)')) optB = trimmed.replace('B)', '').trim();
      else if (trimmed.startsWith('C)')) optC = trimmed.replace('C)', '').trim();
      else if (trimmed.startsWith('D)')) optD = trimmed.replace('D)', '').trim();
      else if (trimmed.startsWith('E)')) optE = trimmed.replace('E)', '').trim();
      else if (trimmed.toLowerCase().startsWith('izah:')) expl = trimmed.replace(/izah:/i, '').trim();
    });

    setNewQuestion(prev => ({
      ...prev,
      text: qText.replace(/^\d+\.\s*/, ''),
      optionA: optA,
      optionB: optB,
      optionC: optC,
      optionD: optD,
      optionE: optE,
      explanationConclusion: expl
    }));

    setActiveSubTab('form');
    showToast('OCR mətni təhlil edildi və formaya köçürüldü!');
  };

  return React.createElement(
    'div',
    { className: 'space-y-6 animate-fadeIn pb-16 no-print' },
    
    // Toast Bildirişi
    toastMessage && React.createElement(
      'div',
      { className: `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-xs flex items-center space-x-2 animate-bounce ${
        toastMessage.isError ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
      }` },
      React.createElement('i', { className: `fas fa-${toastMessage.isError ? 'exclamation-circle' : 'check-circle'}` }),
      React.createElement('span', null, toastMessage.text)
    ),

    // Başlıq Kartı
    React.createElement(
      'div',
      { className: 'bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3' },
      React.createElement(
        'div',
        { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3' },
        React.createElement(
          'div',
          null,
          React.createElement('h2', { className: 'text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight' }, 'Məzmun İdarəetmə və Skaner Portalı'),
          React.createElement('p', { className: 'text-xs text-zinc-500 dark:text-zinc-400 mt-0.5' },
            'Fiziki vərəqlər skan edilənədək sistemi yeni testlər və dərslərlə zənginləşdirmək üçün modulyar daxiletmə mərkəzi.'
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement(
            'button',
            {
              onClick: handleDownloadDatabase,
              className: 'px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition flex items-center space-x-1.5'
            },
            React.createElement('i', { className: 'fas fa-download' }),
            React.createElement('span', null, 'Bazanı Endir (JSON)')
          ),
          React.createElement(
            'button',
            {
              onClick: handleResetDefaults,
              className: 'px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:bg-zinc-200 transition'
            },
            'Sıfırla'
          )
        )
      ),

      // Alt Bölmə Tabbikləri
      React.createElement(
        'div',
        { className: 'flex space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800' },
        [
          { id: 'form', label: 'Forma İlə Yeni Sual', icon: 'fa-plus-circle' },
          { id: 'scanner', label: 'OCR Skan Köməkçisi', icon: 'fa-scanner' },
          { id: 'json', label: 'Birbaşa JSON İmport/İxrac', icon: 'fa-code' }
        ].map(t => {
          const isActive = activeSubTab === t.id;
          return React.createElement(
            'button',
            {
              key: t.id,
              onClick: () => setActiveSubTab(t.id),
              className: `px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`
            },
            React.createElement('i', { className: `fas ${t.icon}` }),
            React.createElement('span', null, t.label)
          );
        })
      )
    ),

    // =========================================================================
    // 1. FORMA İLƏ YENİ SUAL DAXİL ETMƏ
    // =========================================================================
    activeSubTab === 'form' && React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
      
      // Sol: Forma Sahələri (7 sütun)
      React.createElement(
        'form',
        {
          onSubmit: handleSaveQuestion,
          className: 'lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4'
        },
        React.createElement('h3', { className: 'font-black text-sm text-zinc-800 dark:text-zinc-200 pb-2 border-b border-zinc-100 dark:border-zinc-800' }, 'Yeni Test Sualı Qeydiyyatı'),

        // Fənn və Sinif
        React.createElement(
          'div',
          { className: 'grid grid-cols-3 gap-3' },
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'Fənn:'),
            React.createElement(
              'select',
              {
                value: newQuestion.subjectId,
                onChange: e => setNewQuestion({ ...newQuestion, subjectId: e.target.value }),
                className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200'
              },
              SUBJECTS.map(s => React.createElement('option', { key: s.id, value: s.id }, s.name))
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'Sinif:'),
            React.createElement(
              'select',
              {
                value: newQuestion.grade,
                onChange: e => setNewQuestion({ ...newQuestion, grade: Number(e.target.value) }),
                className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200'
              },
              GRADES.map(g => React.createElement('option', { key: g, value: g }, `${g}-ci sinif`))
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'İmtahana Əlavə Et:'),
            React.createElement(
              'select',
              {
                value: targetExamId,
                onChange: e => setTargetExamId(e.target.value),
                className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200'
              },
              exams.map(ex => React.createElement('option', { key: ex.id, value: ex.id }, `${ex.grade}-ci sinif ${ex.examType} (${ex.variant})`))
            )
          )
        ),

        // Sual Mətni (KaTeX dəstəkli)
        React.createElement(
          'div',
          null,
          React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'Sual Mətni (Riyazi formullar üçün $...$ və ya $$...$$ istifadə edin):'),
          React.createElement('textarea', {
            rows: 3,
            value: newQuestion.text,
            onChange: e => setNewQuestion({ ...newQuestion, text: e.target.value }),
            placeholder: 'Məsələn: $f(x) = x^3 - 3x$ funksiyasının $x = 2$ nöqtəsində törəməsini tapın.',
            className: 'w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 font-mono focus:outline-none focus:border-indigo-500'
          })
        ),

        // Variantlar (A, B, C, D, E)
        React.createElement(
          'div',
          { className: 'space-y-2' },
          React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500' }, 'Variantlar və Doğru Cavab:'),
          ['A', 'B', 'C', 'D', 'E'].map(optKey => {
            return React.createElement(
              'div',
              { key: optKey, className: 'flex items-center space-x-2' },
              React.createElement(
                'label',
                { className: 'flex items-center space-x-1 cursor-pointer shrink-0' },
                React.createElement('input', {
                  type: 'radio',
                  name: 'correctKeyRadio',
                  checked: newQuestion.correctKey === optKey,
                  onChange: () => setNewQuestion({ ...newQuestion, correctKey: optKey }),
                  className: 'accent-indigo-600'
                }),
                React.createElement('span', { className: 'font-bold text-xs w-5 text-center' }, `${optKey})`)
              ),
              React.createElement('input', {
                type: 'text',
                value: newQuestion[`option${optKey}`],
                onChange: e => setNewQuestion({ ...newQuestion, [`option${optKey}`]: e.target.value }),
                placeholder: `Variant ${optKey} mətni (LaTeX $..$)`,
                className: 'flex-1 p-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
              })
            );
          })
        ),

        // AI Chain-of-Thought Həll İzahı
        React.createElement(
          'div',
          { className: 'pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2' },
          React.createElement('div', { className: 'font-bold text-xs text-indigo-600 dark:text-indigo-400' }, 'AI Chain-of-Thought (Addım-addım Həll İzahı):'),
          React.createElement('input', {
            type: 'text',
            value: newQuestion.explanationFormula,
            onChange: e => setNewQuestion({ ...newQuestion, explanationFormula: e.target.value }),
            placeholder: 'Tətbiq edilən əsas düstur (məs: $(x^n)\' = n x^{n-1}$)',
            className: 'w-full p-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
          }),
          React.createElement('textarea', {
            rows: 2,
            value: newQuestion.explanationStep1,
            onChange: e => setNewQuestion({ ...newQuestion, explanationStep1: e.target.value }),
            placeholder: 'Addım-addım hesablama gedişi...',
            className: 'w-full p-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
          })
        ),

        // Təsdiq Düyməsi
        React.createElement(
          'button',
          {
            type: 'submit',
            className: 'w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition'
          },
          'Sualı Məlumat Bazasına Əlavə Et'
        )
      ),

      // Sağ: Canlı KaTeX Önbaxış (5 sütun)
      React.createElement(
        'div',
        { className: 'lg:col-span-5 space-y-4' },
        React.createElement(
          'div',
          { className: 'bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4 sticky top-24' },
          React.createElement('h4', { className: 'font-black text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5' },
            React.createElement('i', { className: 'fas fa-eye' }),
            React.createElement('span', null, 'Canlı KaTeX Önbaxış')
          ),
          
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 min-h-[120px]' },
            newQuestion.text ? React.createElement(KatexRenderer, { text: newQuestion.text }) : React.createElement('span', { className: 'text-xs text-zinc-400 italic' }, 'Sol tərəfdə sual mətni yazdıqca burada canlı riyazi render görünəcək.')
          ),

          React.createElement(
            'div',
            { className: 'space-y-1.5 text-xs' },
            ['A', 'B', 'C', 'D', 'E'].map(optKey => {
              const val = newQuestion[`option${optKey}`];
              const isCorrect = newQuestion.correctKey === optKey;
              return React.createElement(
                'div',
                {
                  key: optKey,
                  className: `p-2.5 rounded-xl border flex items-center space-x-2 ${
                    isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700'
                  }`
                },
                React.createElement('span', { className: 'w-5 h-5 rounded-md bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-black' }, optKey),
                React.createElement(KatexRenderer, { text: val || `(${optKey} variantı boşdur)` })
              );
            })
          )
        )
      )
    ),

    // =========================================================================
    // 2. OCR SKANER KÖMƏKÇİSİ
    // =========================================================================
    activeSubTab === 'scanner' && React.createElement(
      'div',
      { className: 'bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4' },
      React.createElement(
        'div',
        null,
        React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100' }, 'Fiziki Test Vərəqlərinin OCR Mətnindən Çevirici'),
        React.createElement('p', { className: 'text-xs text-zinc-500 dark:text-zinc-400 mt-0.5' },
          'Məktəb test kitabçalarından və ya skaner aparatından çıxan xam mətni bura yapışdırın. Sistem sual və variantları avtomatik ayıraraq şablona köçürəcək.'
        )
      ),
      React.createElement('textarea', {
        rows: 8,
        value: ocrRawText,
        onChange: e => setOcrRawText(e.target.value),
        className: 'w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500'
      }),
      React.createElement(
        'button',
        {
          onClick: handleParseOcr,
          className: 'px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2'
        },
        React.createElement('i', { className: 'fas fa-wand-magic-sparkles' }),
        React.createElement('span', null, 'Mətni Təhlil Et və Formaya Göndər')
      )
    ),

    // =========================================================================
    // 3. BİRBAŞA JSON İMPORT / İXRAC
    // =========================================================================
    activeSubTab === 'json' && React.createElement(
      'div',
      { className: 'bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4' },
      React.createElement(
        'div',
        null,
        React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100' }, 'JSON Formatında Toplu Məlumat Yükləməsi'),
        React.createElement('p', { className: 'text-xs text-zinc-500 dark:text-zinc-400 mt-0.5' },
          'Gələcəkdə Supabase və ya server bazasından ixrac edilmiş JSON massivini bura yapışdıraraq bir kliklə yüzlərlə sualı yerli bazaya əlavə edə bilərsiniz.'
        )
      ),
      React.createElement('textarea', {
        rows: 8,
        value: rawJsonInput,
        onChange: e => setRawJsonInput(e.target.value),
        placeholder: '{"lessons": [...], "exams": [...], "pvpQuestions": [...]}',
        className: 'w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500'
      }),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(
          'button',
          {
            onClick: handleImportJson,
            className: 'px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition'
          },
          'JSON Məlumatını Bazaya İdxal Et'
        ),
        React.createElement(
          'button',
          {
            onClick: () => setRawJsonInput(StorageService.exportDatabaseJson()),
            className: 'px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200'
          },
          'Cari Bazanı Ekrana Çıxar'
        )
      )
    )
  );
};
