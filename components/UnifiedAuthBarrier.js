// TDV Community Labs - Vahid Giriş Baryeri (Unified Auth Gate Barrier)
// Bu komponent aktiv vahid sessiya olmadıqda portala girişi tamamilə bloklayır.

import React, { useState } from 'react';
import { authService } from '../services/authService.js';

export const UnifiedAuthBarrier = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState(10);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Zəhmət olmasa istifadəçi adınızı və ya şagird kodunuzu daxil edin.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        const session = authService.login(username, grade, pin, 'student');
        if (onLogin) onLogin(session);
      } catch (err) {
        setError(err.message || 'Giriş zamanı xəta baş verdi.');
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const session = authService.loginWithDemo(type);
        if (onLogin) onLogin(session);
      } catch (err) {
        setError(err.message || 'Sürətli giriş xətası.');
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090e] text-slate-100 overflow-y-auto'
    },
    
    // Arxa plan ambient aura
    React.createElement('div', {
      className: 'absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none'
    }),
    React.createElement('div', {
      className: 'absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none'
    }),

    // Giriş Kartı (Bento Glass)
    React.createElement(
      'div',
      {
        className: 'relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6 my-auto'
      },

      // Təşkilat Emblemi və Başlıq
      React.createElement(
        'div',
        { className: 'text-center space-y-3' },
        
        React.createElement(
          'div',
          { className: 'inline-flex items-center justify-center p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-cyan-500/20 border border-indigo-400/30 shadow-lg shadow-indigo-500/10' },
          React.createElement('img', {
            src: 'assets/tdv-logo.png',
            alt: 'TDV Crest',
            className: 'w-12 h-12 rounded-full object-contain border border-amber-400/60 shadow-md'
          })
        ),

        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-2' },
            React.createElement('span', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' }),
            'Vahid Giriş Sistemi • Qorunan Resurs'
          ),
          React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white tracking-tight' }, 'TDV E-School'),
          React.createElement('p', { className: 'text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed' },
            'Tədris portalına, elektron dərslərə və sınaq arxivinə daxil olmaq üçün məktəb profilinizlə daxil olun.'
          )
        )
      ),

      // Xəta Bildirişi
      error && React.createElement(
        'div',
        { className: 'p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2' },
        React.createElement('i', { className: 'fas fa-triangle-exclamation text-rose-400' }),
        React.createElement('span', null, error)
      ),

      // Əsas Giriş Forması
      React.createElement(
        'form',
        { onSubmit: handleSubmit, className: 'space-y-4' },

        // İstifadəçi Adı
        React.createElement(
          'div',
          { className: 'space-y-1.5' },
          React.createElement('label', { className: 'block text-xs font-bold text-slate-300' }, 'İstifadəçi Adı və ya Şagird Kodu:'),
          React.createElement('div', { className: 'relative' },
            React.createElement('i', { className: 'fas fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs' }),
            React.createElement('input', {
              type: 'text',
              value: username,
              onChange: (e) => setUsername(e.target.value),
              placeholder: 'Məs: orxan_10a və ya adınız',
              required: true,
              className: 'w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition'
            })
          )
        ),

        // Sinif Seçimi
        React.createElement(
          'div',
          { className: 'space-y-1.5' },
          React.createElement('label', { className: 'block text-xs font-bold text-slate-300' }, 'Sinif Səviyyəsi:'),
          React.createElement('div', { className: 'relative' },
            React.createElement('i', { className: 'fas fa-graduation-cap absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs' }),
            React.createElement('select', {
              value: grade,
              onChange: (e) => setGrade(Number(e.target.value)),
              className: 'w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer'
            },
              [6, 7, 8, 9, 10, 11].map(g => React.createElement('option', { key: g, value: g }, `${g}-ci Sinif`)),
              React.createElement('option', { value: 0 }, 'Fənn Müəllimi')
            )
          )
        ),

        // PİN / Şifrə (İxtiyari)
        React.createElement(
          'div',
          { className: 'space-y-1.5' },
          React.createElement('label', { className: 'block text-xs font-bold text-slate-300' }, 'Giriş Şifrəsi və ya PİN:'),
          React.createElement('div', { className: 'relative' },
            React.createElement('i', { className: 'fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs' }),
            React.createElement('input', {
              type: 'password',
              value: pin,
              onChange: (e) => setPin(e.target.value),
              placeholder: '••••••••',
              className: 'w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition'
            })
          )
        ),

        // Giriş Düyməsi
        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: isLoading,
            className: 'w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center space-x-2 cursor-pointer'
          },
          isLoading
            ? React.createElement('i', { className: 'fas fa-circle-notch fa-spin text-xs' })
            : React.createElement('i', { className: 'fas fa-arrow-right-to-bracket text-xs' }),
          React.createElement('span', null, isLoading ? 'Yoxlanılır...' : 'Portala Daxil Ol')
        )
      ),

      // Sürətli Tələbə Girişi (1-Click Quick Demo)
      React.createElement(
        'div',
        { className: 'pt-3 border-t border-white/10 space-y-2' },
        React.createElement('div', { className: 'text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider' }, 'Sürətli Məktəb Girişi:'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-3 gap-2' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleQuickLogin('student-10'),
              className: 'p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-center transition group cursor-pointer'
            },
            React.createElement('span', { className: 'text-sm block mb-0.5' }, '🧑‍🎓'),
            React.createElement('span', { className: 'text-[10px] font-bold text-slate-300 block' }, '10-cu Sinif')
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleQuickLogin('student-11'),
              className: 'p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-center transition group cursor-pointer'
            },
            React.createElement('span', { className: 'text-sm block mb-0.5' }, '🎒'),
            React.createElement('span', { className: 'text-[10px] font-bold text-slate-300 block' }, '11-ci Sinif')
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleQuickLogin('teacher'),
              className: 'p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-center transition group cursor-pointer'
            },
            React.createElement('span', { className: 'text-sm block mb-0.5' }, '👨‍🏫'),
            React.createElement('span', { className: 'text-[10px] font-bold text-slate-300 block' }, 'Müəllim')
          )
        )
      ),

      // Alt Link: TDV Hub
      React.createElement(
        'div',
        { className: 'text-center pt-2' },
        React.createElement(
          'a',
          {
            href: 'https://tdv-community-hubs.vercel.app/',
            className: 'text-[11px] font-semibold text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1.5'
          },
          React.createElement('i', { className: 'fas fa-arrow-left text-[10px]' }),
          React.createElement('span', null, 'TDV Community Labs Mərkəzi Qovşağına Qayıt')
        )
      )
    )
  );
};
