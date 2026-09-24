// MəktəbPlus - İnteraktiv Alətlər və Kalkulyatorlar Laboratoriyası (Tools & Lab)

import React, { useState } from 'react';
import { PhetEmbed } from './PhetEmbed.js';
import { KatexRenderer } from './KatexRenderer.js';

export const ToolsView = () => {
  const [activeTool, setActiveTool] = useState('calculus'); // 'calculus', 'derivative_calc', 'physics_sim', 'geometry', 'periodic'

  // Törəmə və Funksiya Kalkulyatoru vəziyyəti
  const [polyA, setPolyA] = useState(2);
  const [polyB, setPolyB] = useState(-4);
  const [polyC, setPolyC] = useState(1);
  const [evalX, setEvalX] = useState(2);

  // Həndəsə Kalkulyatoru vəziyyəti (Düzbucaqlı üçbucaq)
  const [geomA, setGeomA] = useState(6);
  const [geomB, setGeomB] = useState(8);

  // Hesablamalar: f(x) = ax^2 + bx + c
  // f'(x) = 2ax + b
  const derivativeSlope = 2 * polyA * evalX + polyB;
  const funcValue = polyA * Math.pow(evalX, 2) + polyB * evalX + polyC;

  // Həndəsə: c = sqrt(a^2 + b^2)
  const geomC = Math.sqrt(Math.pow(geomA, 2) + Math.pow(geomB, 2));
  const geomArea = (geomA * geomB) / 2;
  const geomR = geomC / 2; // Xaricə çəkilmiş çevrənin radiusu
  const geomSmallR = (geomA + geomB - geomC) / 2; // Daxilə çəkilmiş çevrənin radiusu

  const toolsList = [
    {
      id: 'calculus',
      title: 'Calculus Grapher (Funksiya və Törəmə)',
      icon: 'fa-chart-line',
      badge: 'PhET Simulyasiyası',
      color: 'indigo'
    },
    {
      id: 'derivative_calc',
      title: 'Törəmə və Toxunan Kalkulyatoru',
      icon: 'fa-square-root-variable',
      badge: 'Hesablayıcı',
      color: 'cyan'
    },
    {
      id: 'physics_sim',
      title: 'Qüvvə və Hərəkət Simulyatoru',
      icon: 'fa-atom',
      badge: 'PhET Fizika',
      color: 'emerald'
    },
    {
      id: 'geometry',
      title: 'Pifaqor və Həndəsə Həlledicisi',
      icon: 'fa-shapes',
      badge: 'Həndəsə',
      color: 'amber'
    }
  ];

  return React.createElement(
    'div',
    { className: 'space-y-6 animate-fadeIn pb-16 no-print' },

    // Yuxarı Başlıq
    React.createElement(
      'div',
      { className: 'bento-card bg-gradient-to-r from-purple-950 via-zinc-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white border border-white/10 shadow-2xl relative overflow-hidden' },
      React.createElement(
        'div',
        { className: 'max-w-2xl' },
        React.createElement('span', { className: 'text-xs font-black uppercase px-3 py-1 rounded-full bg-white/20 backdrop-blur-md' }, 'Virtual Laboratoriya'),
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black mt-2' }, 'İnteraktiv Alətlər və Kalkulyatorlar'),
        React.createElement('p', { className: 'text-xs sm:text-sm text-purple-100 mt-1' },
          'Riyazi analiz, funksiya törəmələri, PhET hərəkət laboratoriyaları və həndəsi fiqurların canlı vizualizasiyası.'
        )
      )
    ),

    // Alətlər Menyu Şəbəkəsi (Tabs)
    React.createElement(
      'div',
      { className: 'grid grid-cols-2 sm:grid-cols-4 gap-3' },
      toolsList.map(tool => {
        const isActive = activeTool === tool.id;
        return React.createElement(
          'button',
          {
            key: tool.id,
            onClick: () => setActiveTool(tool.id),
            className: `p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 ${
              isActive
                ? 'bg-white dark:bg-zinc-900 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                : 'bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:border-purple-300'
            }`
          },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between' },
            React.createElement('i', { className: `fas ${tool.icon} text-lg ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400'}` }),
            React.createElement('span', { className: 'text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300' }, tool.badge)
          ),
          React.createElement('span', { className: `text-xs font-bold ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}` }, tool.title)
        );
      })
    ),

    // =========================================================================
    // 1. PHET CALCULUS GRAPHER
    // =========================================================================
    activeTool === 'calculus' && React.createElement(
      'div',
      { className: 'space-y-4 animate-fadeIn' },
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-2' },
        React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100 flex items-center gap-2' },
          React.createElement('i', { className: 'fas fa-chart-line text-indigo-600' }),
          React.createElement('span', null, 'PhET: Calculus Grapher (Funksiya, Törəmə və İnteqral Qrafiki)')
        ),
        React.createElement('p', { className: 'text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed' },
          'Ekranda istənilən $f(x)$ əyrisini qurun. Simulyator avtomatik olaraq onun birinci tərtib törəməsini $f\'(x)$, ikinci tərtib törəməsini $f\'\'(x)$ və inteqral sahəsini real vaxtda vizual olaraq hesablayır.'
        )
      ),
      React.createElement(PhetEmbed, {
        simUrl: 'https://phet.colorado.edu/sims/html/calculus-grapher/latest/calculus-grapher_all.html',
        title: 'PhET Calculus Grapher',
        description: 'Toxunanın mailliyini və törəmə dinamikasını interaktiv öyrənin'
      })
    ),

    // =========================================================================
    // 2. TÖRƏMƏ VƏ TOXUNAN KALKULYATORU
    // =========================================================================
    activeTool === 'derivative_calc' && React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn' },
      
      // Sol: Parametrlər Paneli
      React.createElement(
        'div',
        { className: 'lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5' },
        React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100' }, 'Kvadratik Funksiya və Törəmə Tənliyi'),
        React.createElement('p', { className: 'text-xs text-zinc-400' },
          'Parametrləri dəyişərək $f(x) = ax^2 + bx + c$ funksiyasının verilmiş nöqtədə toxunanının tənliyini və bucaq əmsalını hesablayın.'
        ),

        React.createElement(
          'div',
          { className: 'grid grid-cols-3 gap-3' },
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'a əmsalı:'),
            React.createElement('input', {
              type: 'number',
              value: polyA,
              onChange: e => setPolyA(Number(e.target.value) || 0),
              className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'b əmsalı:'),
            React.createElement('input', {
              type: 'number',
              value: polyB,
              onChange: e => setPolyB(Number(e.target.value) || 0),
              className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'c sərbəst həd:'),
            React.createElement('input', {
              type: 'number',
              value: polyC,
              onChange: e => setPolyC(Number(e.target.value) || 0),
              className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold'
            })
          )
        ),

        React.createElement(
          'div',
          null,
          React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'Toxunma nöqtəsi (x₀):'),
          React.createElement('input', {
            type: 'number',
            value: evalX,
            onChange: e => setEvalX(Number(e.target.value) || 0),
            className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold'
          })
        )
      ),

      // Sağ: Hesablama və Nəticə Paneli
      React.createElement(
        'div',
        { className: 'lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-900 shadow-sm space-y-4' },
        React.createElement('h4', { className: 'font-black text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400' }, 'Addım-Addım Hesablama Nəticəsi'),
        
        React.createElement(
          'div',
          { className: 'p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 space-y-2' },
          React.createElement('div', { className: 'text-xs text-zinc-500' }, 'Funksiya:'),
          React.createElement(KatexRenderer, { text: `$$f(x) = ${polyA}x^2 + (${polyB})x + (${polyC})$$`, block: true }),
          React.createElement('div', { className: 'text-xs text-zinc-500' }, 'Törəmə Funksiyası:'),
          React.createElement(KatexRenderer, { text: `$$f'(x) = ${2 * polyA}x + (${polyB})$$`, block: true })
        ),

        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-3' },
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700' },
            React.createElement('div', { className: 'text-[11px] font-bold text-zinc-400 uppercase' }, 'f(x₀) Qiyməti'),
            React.createElement('div', { className: 'text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1' }, funcValue)
          ),
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700' },
            React.createElement('div', { className: 'text-[11px] font-bold text-zinc-400 uppercase' }, 'Bucaq Əmsalı (k = f\'(x₀))'),
            React.createElement('div', { className: 'text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1' }, derivativeSlope)
          )
        ),

        React.createElement(
          'div',
          { className: 'p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs' },
          React.createElement('span', { className: 'font-bold text-emerald-800 dark:text-emerald-300 mr-1' }, 'Toxunanın Tənliyi:'),
          React.createElement(KatexRenderer, { text: `$y - (${funcValue}) = ${derivativeSlope}(x - ${evalX})$` })
        )
      )
    ),

    // =========================================================================
    // 3. PHET FİZİKA QÜVVƏ VƏ HƏRƏKƏT
    // =========================================================================
    activeTool === 'physics_sim' && React.createElement(
      'div',
      { className: 'space-y-4 animate-fadeIn' },
      React.createElement(
        'div',
        { className: 'bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm' },
        React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100 flex items-center gap-2' },
          React.createElement('i', { className: 'fas fa-atom text-emerald-600' }),
          React.createElement('span', null, 'PhET: Forces and Motion (Qüvvələr, Sürtünmə və Nyuton Qanunları)')
        ),
        React.createElement('p', { className: 'text-xs text-zinc-500 dark:text-zinc-400 mt-1' },
          'Cismin kütləsini, tətbiq olunan dartı və sürtünmə qüvvəsini tənzimləyin. Nyutonun II qanununun ($F=ma$) canlı icrasını izləyin.'
        )
      ),
      React.createElement(PhetEmbed, {
        simUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
        title: 'PhET Qüvvə və Hərəkət Simulyatoru',
        description: 'Nyuton dinamikası təcrübəsini ekranda idarə edin'
      })
    ),

    // =========================================================================
    // 4. PİFAQOR VƏ HƏNDƏSƏ HƏLLEDİCİSİ
    // =========================================================================
    activeTool === 'geometry' && React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn' },
      
      React.createElement(
        'div',
        { className: 'lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4' },
        React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100' }, 'Düzbucaqlı Üçbucaq və Çevrə Parametrləri'),
        React.createElement('p', { className: 'text-xs text-zinc-400' },
          'Katetləri daxil edin. Alət hipotenuzu ($c$), sahəni ($S$), xaricə ($R$) və daxilə ($r$) çəkilmiş çevrələrin radiuslarını hesablayır.'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4' },
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'Katet a:'),
            React.createElement('input', {
              type: 'number',
              value: geomA,
              onChange: e => setGeomA(Math.max(1, Number(e.target.value) || 1)),
              className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[11px] font-bold text-zinc-500 mb-1' }, 'Katet b:'),
            React.createElement('input', {
              type: 'number',
              value: geomB,
              onChange: e => setGeomB(Math.max(1, Number(e.target.value) || 1)),
              className: 'w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold'
            })
          )
        )
      ),

      React.createElement(
        'div',
        { className: 'lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-amber-900 shadow-sm space-y-4' },
        React.createElement('h4', { className: 'font-black text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400' }, 'Həndəsi Hesablama Nəticələri'),
        
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-3 text-xs' },
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700' },
            React.createElement('div', { className: 'text-zinc-400 text-[10px] uppercase font-bold' }, 'Hipotenuz (c = √(a²+b²))'),
            React.createElement('div', { className: 'text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1' }, geomC.toFixed(2))
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700' },
            React.createElement('div', { className: 'text-zinc-400 text-[10px] uppercase font-bold' }, 'Üçbucağın Sahəsi (S = ab/2)'),
            React.createElement('div', { className: 'text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1' }, geomArea.toFixed(2))
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700' },
            React.createElement('div', { className: 'text-zinc-400 text-[10px] uppercase font-bold' }, 'Xaricə Çəkilmiş Çevrə (R = c/2)'),
            React.createElement('div', { className: 'text-xl font-black text-amber-600 dark:text-amber-400 mt-1' }, geomR.toFixed(2))
          ),
          React.createElement(
            'div',
            { className: 'p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700' },
            React.createElement('div', { className: 'text-zinc-400 text-[10px] uppercase font-bold' }, 'Daxilə Çəkilmiş Çevrə (r)'),
            React.createElement('div', { className: 'text-xl font-black text-rose-600 dark:text-rose-400 mt-1' }, geomSmallR.toFixed(2))
          )
        )
      )
    )
  );
};
