// MəktəbPlus - Sağdan Sürüşərək Açılan İnteraktiv Alətlər və Virtual Laboratoriya Paneli (Tools Slide-Over Drawer)

import React, { useState } from 'react';
import { PhetEmbed } from './PhetEmbed.js';
import { KatexRenderer } from './KatexRenderer.js';

export const ToolsDrawer = ({ isOpen, onClose }) => {
  const [activeTool, setActiveTool] = useState('calculus'); // 'calculus', 'derivative_calc', 'physics_sim', 'geometry', 'periodic_table', 'unit_converter'

  // Törəmə və Funksiya Kalkulyatoru vəziyyəti
  const [polyA, setPolyA] = useState(2);
  const [polyB, setPolyB] = useState(-4);
  const [polyC, setPolyC] = useState(1);
  const [evalX, setEvalX] = useState(2);

  // Həndəsə Kalkulyatoru vəziyyəti (Düzbucaqlı üçbucaq)
  const [geomA, setGeomA] = useState(6);
  const [geomB, setGeomB] = useState(8);

  // Vahid Çevirici vəziyyəti
  const [convertType, setConvertType] = useState('speed'); // 'speed', 'length', 'data', 'temp'
  const [convertVal, setConvertVal] = useState(100);

  // Dövri Cədvəl axtarış vəziyyəti
  const [chemSearch, setChemSearch] = useState('');

  // Hesablamalar: f(x) = ax^2 + bx + c, f'(x) = 2ax + b
  const derivativeSlope = 2 * polyA * evalX + polyB;
  const funcValue = polyA * Math.pow(evalX, 2) + polyB * evalX + polyC;

  // Həndəsə: c = sqrt(a^2 + b^2)
  const geomC = Math.sqrt(Math.pow(geomA, 2) + Math.pow(geomB, 2));
  const geomArea = (geomA * geomB) / 2;
  const geomR = geomC / 2;
  const geomSmallR = (geomA + geomB - geomC) / 2;

  // Kimyəvi Elementlər Bazasından nümunələr
  const chemicalElements = [
    { num: 1, sym: 'H', name: 'Hidrogen', mass: 1.008, group: 'IA', period: 1, val: 'I' },
    { num: 2, sym: 'He', name: 'Helium', mass: 4.003, group: 'VIIIA', period: 1, val: '0' },
    { num: 6, sym: 'C', name: 'Karbon', mass: 12.011, group: 'IVA', period: 2, val: 'II, IV' },
    { num: 7, sym: 'N', name: 'Azot', mass: 14.007, group: 'VA', period: 2, val: 'I-IV' },
    { num: 8, sym: 'O', name: 'Oksigen', mass: 15.999, group: 'VIA', period: 2, val: 'II' },
    { num: 11, sym: 'Na', name: 'Natrium', mass: 22.990, group: 'IA', period: 3, val: 'I' },
    { num: 12, sym: 'Mg', name: 'Maqnezium', mass: 24.305, group: 'IIA', period: 3, val: 'II' },
    { num: 13, sym: 'Al', name: 'Alüminium', mass: 26.982, group: 'IIIA', period: 3, val: 'III' },
    { num: 14, sym: 'Si', name: 'Silisium', mass: 28.085, group: 'IVA', period: 3, val: 'IV' },
    { num: 15, sym: 'P', name: 'Fosfor', mass: 30.974, group: 'VA', period: 3, val: 'III, V' },
    { num: 16, sym: 'S', name: 'Kükürd', mass: 32.065, group: 'VIA', period: 3, val: 'II, IV, VI' },
    { num: 17, sym: 'Cl', name: 'Xlor', mass: 35.453, group: 'VIIA', period: 3, val: 'I, III, V, VII' },
    { num: 19, sym: 'K', name: 'Kalium', mass: 39.098, group: 'IA', period: 4, val: 'I' },
    { num: 20, sym: 'Ca', name: 'Kalsium', mass: 40.078, group: 'IIA', period: 4, val: 'II' },
    { num: 26, sym: 'Fe', name: 'Dəmir', mass: 55.845, group: 'VIIIB', period: 4, val: 'II, III' },
    { num: 29, sym: 'Cu', name: 'Mis', mass: 63.546, group: 'IB', period: 4, val: 'I, II' },
    { num: 47, sym: 'Ag', name: 'Gümüş', mass: 107.868, group: 'IB', period: 5, val: 'I' },
    { num: 79, sym: 'Au', name: 'Qızıl', mass: 196.967, group: 'IB', period: 6, val: 'I, III' }
  ];

  const filteredElements = chemicalElements.filter(el => {
    const q = chemSearch.toLowerCase().trim();
    return !q || el.name.toLowerCase().includes(q) || el.sym.toLowerCase().includes(q) || String(el.num) === q;
  });

  const toolsList = [
    { id: 'calculus', title: 'Calculus', icon: 'fa-chart-line', badge: 'PhET' },
    { id: 'derivative_calc', title: 'Törəmə', icon: 'fa-square-root-variable', badge: 'Kalkulyator' },
    { id: 'physics_sim', title: 'Fizika Sim', icon: 'fa-atom', badge: 'PhET' },
    { id: 'geometry', title: 'Pifaqor', icon: 'fa-shapes', badge: 'Həndəsə' },
    { id: 'periodic_table', title: 'Dövri Cədvəl', icon: 'fa-flask', badge: 'Kimya' },
    { id: 'unit_converter', title: 'Vahid Çevirici', icon: 'fa-repeat', badge: 'Fizika' }
  ];

  return React.createElement(
    'div',
    {
      className: `fixed inset-0 z-50 overflow-hidden transition-all duration-200 no-print ${
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`
    },
    // Tünd fon overlay
    React.createElement('div', {
      className: `fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`,
      onClick: onClose
    }),

    // Sağ tərəfdən sürüşərək gələn panel
    React.createElement(
      'div',
      {
        className: `fixed inset-y-0 right-0 max-w-2xl w-full bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200/80 dark:border-zinc-800 flex flex-col transform transition-transform duration-200 ease-out z-10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`
      },
      
      // Panel Başlığı (Header)
      React.createElement(
        'div',
        { className: 'p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-800/60' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md' },
            React.createElement('i', { className: 'fas fa-toolbox text-base' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h3', { className: 'font-black text-base text-zinc-800 dark:text-zinc-100' }, 'İnteraktiv Alətlər və Laboratoriya'),
            React.createElement('p', { className: 'text-[11px] text-zinc-400' }, 'Dərs və imtahan zamanı istifadə edilə bilən interaktiv STEM paneli')
          )
        ),
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'w-9 h-9 rounded-xl bg-zinc-200/70 dark:bg-zinc-700/70 hover:bg-rose-500 hover:text-white text-zinc-600 dark:text-zinc-300 transition flex items-center justify-center text-sm font-bold'
          },
          '✕'
        )
      ),

      // Alət Seçim Düymələri (Tabs)
      React.createElement(
        'div',
        { className: 'p-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 grid grid-cols-3 sm:grid-cols-6 gap-1.5' },
        toolsList.map(t => {
          const isActive = activeTool === t.id;
          return React.createElement(
            'button',
            {
              key: t.id,
              onClick: () => setActiveTool(t.id),
              className: `px-2 py-2 rounded-xl text-center transition flex flex-col items-center justify-center text-[11px] font-bold ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`
            },
            React.createElement('i', { className: `fas ${t.icon} text-xs mb-1 ${isActive ? 'text-white' : 'text-indigo-500'}` }),
            React.createElement('span', { className: 'truncate w-full text-[10px]' }, t.title)
          );
        })
      ),

      // Sürüşən Məzmun Sahəsi (Scrollable Body)
      React.createElement(
        'div',
        { className: 'flex-1 overflow-y-auto p-5 sm:p-6 space-y-6' },
        
        // 1. PHET CALCULUS GRAPHER
        activeTool === 'calculus' && React.createElement(
          'div',
          { className: 'space-y-4 animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60' },
            React.createElement('h4', { className: 'text-xs font-bold text-indigo-700 dark:text-indigo-300' }, 'PhET Calculus Grapher (Funksiya və Törəmə)'),
            React.createElement('p', { className: 'text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5' },
              "Ekranda əyri çəkərək onun törəmə mailliyini ($f'(x)$) və inteqral sahəsini real vaxtda vizual öyrənin."
            )
          ),
          React.createElement(PhetEmbed, {
            simUrl: 'https://phet.colorado.edu/sims/html/calculus-grapher/latest/calculus-grapher_all.html',
            title: 'PhET Calculus Grapher',
            description: 'Canlı funksiya və törəmə qrafiki'
          })
        ),

        // 2. TÖRƏMƏ VƏ TOXUNAN KALKULYATORU
        activeTool === 'derivative_calc' && React.createElement(
          'div',
          { className: 'space-y-5 animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-4' },
            React.createElement('h4', { className: 'text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase' }, 'f(x) = ax² + bx + c Parametrləri'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-3 gap-3' },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-400 mb-1' }, 'a əmsalı:'),
                React.createElement('input', {
                  type: 'number',
                  value: polyA,
                  onChange: e => setPolyA(Number(e.target.value) || 0),
                  className: 'w-full p-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-bold'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-400 mb-1' }, 'b əmsalı:'),
                React.createElement('input', {
                  type: 'number',
                  value: polyB,
                  onChange: e => setPolyB(Number(e.target.value) || 0),
                  className: 'w-full p-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-bold'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-400 mb-1' }, 'c sərbəst həd:'),
                React.createElement('input', {
                  type: 'number',
                  value: polyC,
                  onChange: e => setPolyC(Number(e.target.value) || 0),
                  className: 'w-full p-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-bold'
                })
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-400 mb-1' }, 'Toxunma nöqtəsi (x₀):'),
              React.createElement('input', {
                type: 'number',
                value: evalX,
                onChange: e => setEvalX(Number(e.target.value) || 0),
                className: 'w-full p-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-bold'
              })
            )
          ),

          // Nəticə Paneli
          React.createElement(
            'div',
            { className: 'p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-3' },
            React.createElement('div', { className: 'text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide' }, 'Canlı Hesablama Nəticəsi:'),
            React.createElement(KatexRenderer, { text: `$$f(x) = ${polyA}x^2 + (${polyB})x + (${polyC})$$`, block: true }),
            React.createElement(KatexRenderer, { text: `$$f'(x) = ${2 * polyA}x + (${polyB})$$`, block: true }),
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 gap-3 pt-2' },
              React.createElement(
                'div',
                { className: 'p-3 rounded-xl bg-white dark:bg-zinc-900 text-center' },
                React.createElement('div', { className: 'text-[10px] text-zinc-400 font-bold' }, 'f(x₀) Qiyməti'),
                React.createElement('div', { className: 'text-xl font-black text-indigo-600 dark:text-indigo-400' }, funcValue)
              ),
              React.createElement(
                'div',
                { className: 'p-3 rounded-xl bg-white dark:bg-zinc-900 text-center' },
                React.createElement('div', { className: 'text-[10px] text-zinc-400 font-bold' }, 'Bucaq Əmsalı (k)'),
                React.createElement('div', { className: 'text-xl font-black text-cyan-600 dark:text-cyan-400' }, derivativeSlope)
              )
            ),
            React.createElement(
              'div',
              { className: 'p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center' },
              React.createElement(KatexRenderer, { text: `Toxunan: y - (${funcValue}) = ${derivativeSlope}(x - ${evalX})` })
            )
          )
        ),

        // 3. PHET FİZİKA QÜVVƏ VƏ HƏRƏKƏT
        activeTool === 'physics_sim' && React.createElement(
          'div',
          { className: 'space-y-4 animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900' },
            React.createElement('h4', { className: 'text-xs font-bold text-emerald-700 dark:text-emerald-300' }, 'PhET: Forces and Motion (Nyuton Qanunları)'),
            React.createElement('p', { className: 'text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5' },
              'Kütlə və qüvvə parametrlərini idarə edərək təcillənmə prosesini müşahidə edin.'
            )
          ),
          React.createElement(PhetEmbed, {
            simUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
            title: 'PhET Qüvvə və Hərəkət Simulyatoru',
            description: 'Canlı fizika laboratoriyası'
          })
        ),

        // 4. HƏNDƏSƏ VƏ PİFAQOR
        activeTool === 'geometry' && React.createElement(
          'div',
          { className: 'space-y-5 animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3' },
            React.createElement('h4', { className: 'text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase' }, 'Düzbucaqlı Üçbucaq Katetləri'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 gap-3' },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-400 mb-1' }, 'Katet a:'),
                React.createElement('input', {
                  type: 'number',
                  value: geomA,
                  onChange: e => setGeomA(Math.max(1, Number(e.target.value) || 1)),
                  className: 'w-full p-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-bold'
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-400 mb-1' }, 'Katet b:'),
                React.createElement('input', {
                  type: 'number',
                  value: geomB,
                  onChange: e => setGeomB(Math.max(1, Number(e.target.value) || 1)),
                  className: 'w-full p-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-bold'
                })
              )
            )
          ),

          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-3' },
            React.createElement(
              'div',
              { className: 'p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900' },
              React.createElement('div', { className: 'text-[10px] text-zinc-400 font-bold' }, 'Hipotenuz (c)'),
              React.createElement('div', { className: 'text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1' }, geomC.toFixed(2))
            ),
            React.createElement(
              'div',
              { className: 'p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900' },
              React.createElement('div', { className: 'text-[10px] text-zinc-400 font-bold' }, 'Sahə (S)'),
              React.createElement('div', { className: 'text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1' }, geomArea.toFixed(2))
            ),
            React.createElement(
              'div',
              { className: 'p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900' },
              React.createElement('div', { className: 'text-[10px] text-zinc-400 font-bold' }, 'Xarici Radius (R)'),
              React.createElement('div', { className: 'text-xl font-black text-amber-600 dark:text-amber-400 mt-1' }, geomR.toFixed(2))
            ),
            React.createElement(
              'div',
              { className: 'p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900' },
              React.createElement('div', { className: 'text-[10px] text-zinc-400 font-bold' }, 'Daxili Radius (r)'),
              React.createElement('div', { className: 'text-xl font-black text-rose-600 dark:text-rose-400 mt-1' }, geomSmallR.toFixed(2))
            )
          )
        ),

        // 5. DÖVRİ CƏDVƏL (KİMYA)
        activeTool === 'periodic_table' && React.createElement(
          'div',
          { className: 'space-y-4 animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between' },
            React.createElement(
              'div',
              null,
              React.createElement('h4', { className: 'text-xs font-bold text-emerald-800 dark:text-emerald-200' }, 'Mendeleyev Dövri Cədvəli & Elementlər'),
              React.createElement('p', { className: 'text-[10px] text-zinc-500 mt-0.5' }, 'Atom nömrəsi, simvolu, kütləsi və valentliyi')
            ),
            React.createElement('i', { className: 'fas fa-atom text-2xl text-emerald-500 opacity-60' })
          ),

          // Axtarış xanası
          React.createElement('input', {
            type: 'text',
            value: chemSearch,
            onChange: e => setChemSearch(e.target.value),
            placeholder: 'Element adı, simvol və ya nömrə (məs: Na, O, Dəmir)...',
            className: 'w-full p-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
          }),

          // Elementlər şəbəkəsi
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1' },
            filteredElements.map(el => {
              return React.createElement(
                'div',
                {
                  key: el.num,
                  className: 'p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center space-x-3'
                },
                React.createElement(
                  'div',
                  { className: 'w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black flex flex-col items-center justify-center leading-tight' },
                  React.createElement('span', { className: 'text-[9px] text-zinc-400' }, el.num),
                  React.createElement('span', { className: 'text-sm font-black' }, el.sym)
                ),
                React.createElement(
                  'div',
                  { className: 'min-w-0 flex-1' },
                  React.createElement('div', { className: 'text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate' }, el.name),
                  React.createElement('div', { className: 'text-[10px] text-zinc-400' }, `Ar: ${el.mass} • Qrup ${el.group}`)
                )
              );
            })
          )
        ),

        // 6. VAHİD ÇEVİRİCİ
        activeTool === 'unit_converter' && React.createElement(
          'div',
          { className: 'space-y-4 animate-fadeIn' },
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900' },
            React.createElement('h4', { className: 'text-xs font-bold text-sky-800 dark:text-sky-200' }, 'Fiziki Kəmiyyət və Vahid Çeviricisi'),
            React.createElement('p', { className: 'text-[10px] text-zinc-500 mt-0.5' }, 'Məktəb fizikası və riyaziyyatı üçün dərhal çevrilmələr')
          ),

          // Çevirmə növü seçimi
          React.createElement(
            'div',
            { className: 'grid grid-cols-4 gap-2' },
            [
              { id: 'speed', label: 'Sürət' },
              { id: 'length', label: 'Uzunluq' },
              { id: 'data', label: 'Məlumat' },
              { id: 'temp', label: 'Temperatur' }
            ].map(type => {
              const isSel = convertType === type.id;
              return React.createElement(
                'button',
                {
                  key: type.id,
                  onClick: () => setConvertType(type.id),
                  className: `py-1.5 rounded-lg text-xs font-bold ${
                    isSel ? 'bg-sky-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                  }`
                },
                type.label
              );
            })
          ),

          // Qiymət daxiletmə
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-400 mb-1' }, 'Daxil edilən kəmiyyət:'),
            React.createElement('input', {
              type: 'number',
              value: convertVal,
              onChange: e => setConvertVal(Number(e.target.value) || 0),
              className: 'w-full p-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-bold'
            })
          ),

          // Çevrilmə Nəticələri
          React.createElement(
            'div',
            { className: 'p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2' },
            convertType === 'speed' && React.createElement(
              'div',
              { className: 'space-y-1 text-xs font-bold' },
              React.createElement('div', null, `${convertVal} km/saat = ${(convertVal / 3.6).toFixed(2)} m/s`),
              React.createElement('div', null, `${convertVal} m/s = ${(convertVal * 3.6).toFixed(2)} km/saat`)
            ),
            convertType === 'length' && React.createElement(
              'div',
              { className: 'space-y-1 text-xs font-bold' },
              React.createElement('div', null, `${convertVal} metr = ${(convertVal * 100).toFixed(0)} sm = ${(convertVal / 1000).toFixed(4)} km`),
              React.createElement('div', null, `${convertVal} km = ${(convertVal * 1000).toFixed(0)} metr`)
            ),
            convertType === 'data' && React.createElement(
              'div',
              { className: 'space-y-1 text-xs font-bold' },
              React.createElement('div', null, `${convertVal} Kilobayt (KB) = ${(convertVal * 1024).toFixed(0)} Bayt = ${(convertVal * 8192).toFixed(0)} bit`),
              React.createElement('div', null, `${convertVal} Meqabayt (MB) = ${(convertVal * 1024).toFixed(0)} KB`)
            ),
            convertType === 'temp' && React.createElement(
              'div',
              { className: 'space-y-1 text-xs font-bold' },
              React.createElement('div', null, `${convertVal}°C = ${(convertVal + 273.15).toFixed(2)} Kelvin (K)`),
              React.createElement('div', null, `${convertVal}°C = ${(convertVal * 1.8 + 32).toFixed(2)} Fahrenheit (°F)`)
            )
          )
        )
      )
    )
  );
};
