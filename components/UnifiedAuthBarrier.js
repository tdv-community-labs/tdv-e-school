// TDV Community Labs - Vahid Giriş və Qeydiyyat Baryeri (Unified Auth & Registration Gate)
// Bu komponent aktiv vahid sessiya olmadıqda portala girişi tamamilə bloklayır və həm giriş, həm qeydiyyat təqdim edir.

import React, { useState } from 'react';
import { authService } from '../services/authService.js';

export const UnifiedAuthBarrier = ({ onLogin }) => {
  const [tab, setTab] = useState('login'); // 'login' və ya 'register'

  // Daxilolma sahələri
  const [loginUsername, setLoginUsername] = useState('');
  const [loginGrade, setLoginGrade] = useState(10);
  const [loginPin, setLoginPin] = useState('');

  // Qeydiyyat sahələri
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regGrade, setRegGrade] = useState(10);
  const [regClassLetter, setRegClassLetter] = useState('A');
  const [regAvatar, setRegAvatar] = useState('🧑‍🎓');
  const [regPin, setRegPin] = useState('');
  const [regConfirmPin, setRegConfirmPin] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const avatarsList = ['🧑‍🎓', '👩‍🔬', '👨‍💻', '🚀', '🧠', '⭐', '🦉', '🏆'];

  // Daxilolma göndərilməsi
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!loginUsername.trim()) {
      setError('Zəhmət olmasa istifadəçi adınızı və ya şagird kodunuzu daxil edin.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        const session = authService.login(loginUsername, loginGrade, loginPin, 'student');
        if (onLogin) onLogin(session);
      } catch (err) {
        setError(err.message || 'Giriş zamanı xəta baş verdi.');
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  // Qeydiyyat göndərilməsi
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regFullName.trim()) {
      setError('Zəhmət olmasa ad və soyadınızı daxil edin.');
      return;
    }
    if (!regUsername.trim()) {
      setError('Zəhmət olmasa istifadəçi adı təyin edin.');
      return;
    }
    if (regPin && regConfirmPin && regPin !== regConfirmPin) {
      setError('Daxil edilən şifrələr bir-birinə uyğun gəlmir.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        const session = authService.register({
          fullName: regFullName,
          username: regUsername,
          grade: regGrade,
          schoolClass: `${regGrade}${regClassLetter}`,
          avatar: regAvatar,
          pin: regPin,
          role: regGrade === 0 ? 'teacher' : 'student'
        });
        setSuccessMsg('Hesabınız uğurla yaradıldı! Portala daxil olunur...');
        setTimeout(() => {
          if (onLogin) onLogin(session);
        }, 500);
      } catch (err) {
        setError(err.message || 'Qeydiyyat zamanı xəta baş verdi.');
      } finally {
        setIsLoading(false);
      }
    }, 450);
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
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b] text-zinc-100 overflow-y-auto'
    },
    
    // Arxa plan ambient aura
    React.createElement('div', {
      className: 'absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none'
    }),
    React.createElement('div', {
      className: 'absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none'
    }),

    // Giriş və Qeydiyyat Kartı (Bento Glass)
    React.createElement(
      'div',
      {
        className: 'relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-5 my-auto'
      },

      // Təşkilat Emblemi və Başlıq
      React.createElement(
        'div',
        { className: 'text-center space-y-2.5' },
        
        React.createElement(
          'div',
          { className: 'inline-flex items-center justify-center p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-fuchsia-500/20 border border-purple-400/30 shadow-lg shadow-purple-500/10' },
          React.createElement('img', {
            src: 'assets/tdv-logo.png',
            alt: 'TDV Crest',
            className: 'w-11 h-11 rounded-full object-contain border border-amber-400/60 shadow-md'
          })
        ),

        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-1.5' },
            React.createElement('span', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' }),
            'Vahid Ekosistem Profili • 1 Hesab = Bütün Ekosistem'
          ),
          React.createElement('h1', { className: 'text-2xl font-black text-white tracking-tight' }, 'TDV E-School'),
          React.createElement('p', { className: 'text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed' },
            'Tək 1 profil E-School, Futbol Turniri, Games və Mafia portallarının hamısına bəs edir! Vahid profilinizlə daxil olun və ya yeni vahid profil yaradın.'
          )
        )
      ),

      // Daxil Ol / Qeydiyyatdan Keç Segmented Tablar
      React.createElement(
        'div',
        { className: 'flex p-1 rounded-2xl bg-zinc-800/80 border border-white/10' },
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => { setTab('login'); setError(''); setSuccessMsg(''); },
            className: `flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'login'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`
          },
          React.createElement('i', { className: 'fas fa-arrow-right-to-bracket text-xs' }),
          React.createElement('span', null, 'Vahid Giriş')
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => { setTab('register'); setError(''); setSuccessMsg(''); },
            className: `flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'register'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`
          },
          React.createElement('i', { className: 'fas fa-user-plus text-xs' }),
          React.createElement('span', null, 'Vahid Profil Yarat')
        )
      ),

      // Bildirişlər
      error && React.createElement(
        'div',
        { className: 'p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex flex-col gap-1.5' },
        React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('i', { className: 'fas fa-triangle-exclamation text-rose-400 shrink-0' }),
          React.createElement('span', null, error)
        ),
        (error.includes('qeydiyyat tapılmadı') || error.includes('qeydiyyatdan keçməyib')) && React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => { setTab('register'); setRegUsername(loginUsername); setRegFullName(loginUsername); setError(''); },
            className: 'self-start text-[11px] font-black text-amber-300 hover:text-amber-200 underline mt-0.5 cursor-pointer'
          },
          '👉 İndi qeydiyyatdan keçin və vahid profil yaradın'
        )
      ),
      successMsg && React.createElement(
        'div',
        { className: 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2' },
        React.createElement('i', { className: 'fas fa-circle-check text-emerald-400' }),
        React.createElement('span', null, successMsg)
      ),

      // ================= TAB 1: DAXİL OL =================
      tab === 'login' && React.createElement(
        'form',
        { onSubmit: handleLoginSubmit, className: 'space-y-3.5' },

        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'İstifadəçi Adı və ya Şagird Kodu:'),
          React.createElement('div', { className: 'relative' },
            React.createElement('i', { className: 'fas fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs' }),
            React.createElement('input', {
              type: 'text',
              value: loginUsername,
              onChange: (e) => setLoginUsername(e.target.value),
              placeholder: 'Məs: orxan_10a və ya adınız',
              required: true,
              className: 'w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition'
            })
          )
        ),

        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Sinif Səviyyəsi:'),
          React.createElement('div', { className: 'relative' },
            React.createElement('i', { className: 'fas fa-graduation-cap absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs' }),
            React.createElement('select', {
              value: loginGrade,
              onChange: (e) => setLoginGrade(Number(e.target.value)),
              className: 'w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition appearance-none cursor-pointer'
            },
              [6, 7, 8, 9, 10, 11].map(g => React.createElement('option', { key: g, value: g }, `${g}-ci Sinif`)),
              React.createElement('option', { value: 0 }, 'Fənn Müəllimi')
            )
          )
        ),

        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Giriş Şifrəsi və ya PİN:'),
          React.createElement('div', { className: 'relative' },
            React.createElement('i', { className: 'fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs' }),
            React.createElement('input', {
              type: 'password',
              value: loginPin,
              onChange: (e) => setLoginPin(e.target.value),
              placeholder: '••••••••',
              className: 'w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition'
            })
          )
        ),

        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: isLoading,
            className: 'w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-1'
          },
          isLoading
            ? React.createElement('i', { className: 'fas fa-circle-notch fa-spin text-xs' })
            : React.createElement('i', { className: 'fas fa-arrow-right-to-bracket text-xs' }),
          React.createElement('span', null, isLoading ? 'Yoxlanılır...' : 'Portala Daxil Ol')
        )
      ),

      // ================= TAB 2: QEYDİYYATDAN KEÇ =================
      tab === 'register' && React.createElement(
        'form',
        { onSubmit: handleRegisterSubmit, className: 'space-y-3' },

        // Ad və Soyad
        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Ad və Soyad:'),
          React.createElement('input', {
            type: 'text',
            value: regFullName,
            onChange: (e) => setRegFullName(e.target.value),
            placeholder: 'Məs: Elmir Qasımov',
            required: true,
            className: 'w-full px-3 py-2 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500'
          })
        ),

        // İstifadəçi Adı
        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'İstifadəçi Adı (Giriş üçün kod):'),
          React.createElement('input', {
            type: 'text',
            value: regUsername,
            onChange: (e) => setRegUsername(e.target.value),
            placeholder: 'Məs: elmir_10a',
            required: true,
            className: 'w-full px-3 py-2 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500'
          })
        ),

        // Sinif və Qrup Hərfi
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-2' },
          React.createElement(
            'div',
            { className: 'space-y-1' },
            React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Sinif:'),
            React.createElement('select', {
              value: regGrade,
              onChange: (e) => setRegGrade(Number(e.target.value)),
              className: 'w-full px-3 py-2 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 cursor-pointer'
            },
              [6, 7, 8, 9, 10, 11].map(g => React.createElement('option', { key: g, value: g }, `${g}-ci Sinif`)),
              React.createElement('option', { value: 0 }, 'Müəllim')
            )
          ),
          React.createElement(
            'div',
            { className: 'space-y-1' },
            React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Bölmə:'),
            React.createElement('select', {
              value: regClassLetter,
              onChange: (e) => setRegClassLetter(e.target.value),
              className: 'w-full px-3 py-2 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 cursor-pointer'
            },
              ['A', 'B', 'C', 'D', 'E'].map(l => React.createElement('option', { key: l, value: l }, `${l} Qrupu`))
            )
          )
        ),

        // Avatar Seçici
        React.createElement(
          'div',
          { className: 'space-y-1' },
          React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Profil Avatarı:'),
          React.createElement(
            'div',
            { className: 'flex items-center gap-2 overflow-x-auto py-1' },
            avatarsList.map(av => React.createElement(
              'button',
              {
                key: av,
                type: 'button',
                onClick: () => setRegAvatar(av),
                className: `w-8 h-8 rounded-xl flex items-center justify-center text-base transition ${
                  regAvatar === av
                    ? 'bg-cyan-500 text-zinc-950 scale-110 shadow-md ring-2 ring-cyan-400'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`
              },
              av
            ))
          )
        ),

        // Şifrə
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-2' },
          React.createElement(
            'div',
            { className: 'space-y-1' },
            React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Şifrə / PİN:'),
            React.createElement('input', {
              type: 'password',
              value: regPin,
              onChange: (e) => setRegPin(e.target.value),
              placeholder: '••••••••',
              className: 'w-full px-3 py-2 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500'
            })
          ),
          React.createElement(
            'div',
            { className: 'space-y-1' },
            React.createElement('label', { className: 'block text-xs font-bold text-zinc-300' }, 'Təkrarı:'),
            React.createElement('input', {
              type: 'password',
              value: regConfirmPin,
              onChange: (e) => setRegConfirmPin(e.target.value),
              placeholder: '••••••••',
              className: 'w-full px-3 py-2 rounded-xl bg-zinc-800/80 border border-white/10 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500'
            })
          )
        ),

        // Qeydiyyat Düyməsi
        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: isLoading,
            className: 'w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-1'
          },
          isLoading
            ? React.createElement('i', { className: 'fas fa-circle-notch fa-spin text-xs' })
            : React.createElement('i', { className: 'fas fa-user-check text-xs' }),
          React.createElement('span', null, isLoading ? 'Hesab Yaradılır...' : 'Vahid Profil Yarat və Ekosistemə Daxil Ol')
        )
      ),

      // Sürətli Tələbə Girişi (1-Click Quick Demo)
      React.createElement(
        'div',
        { className: 'pt-2.5 border-t border-white/10 space-y-1.5' },
        React.createElement('div', { className: 'text-[10px] font-bold text-zinc-400 text-center uppercase tracking-wider' }, 'Sürətli Sınaq Girişi:'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-3 gap-2' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleQuickLogin('student-10'),
              className: 'p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5 text-center transition group cursor-pointer'
            },
            React.createElement('span', { className: 'text-sm block' }, '🧑‍🎓'),
            React.createElement('span', { className: 'text-[10px] font-bold text-zinc-300 block' }, '10-cu Sinif')
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleQuickLogin('student-11'),
              className: 'p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5 text-center transition group cursor-pointer'
            },
            React.createElement('span', { className: 'text-sm block' }, '🎒'),
            React.createElement('span', { className: 'text-[10px] font-bold text-zinc-300 block' }, '11-ci Sinif')
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => handleQuickLogin('teacher'),
              className: 'p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5 text-center transition group cursor-pointer'
            },
            React.createElement('span', { className: 'text-sm block' }, '👨‍🏫'),
            React.createElement('span', { className: 'text-[10px] font-bold text-zinc-300 block' }, 'Müəllim')
          )
        )
      ),

      // Alt Link: TDV Hub
      React.createElement(
        'div',
        { className: 'text-center pt-1' },
        React.createElement(
          'a',
          {
            href: 'https://tdv-community-hubs.vercel.app/',
            className: 'text-[11px] font-semibold text-zinc-400 hover:text-purple-400 transition inline-flex items-center gap-1.5'
          },
          React.createElement('i', { className: 'fas fa-arrow-left text-[10px]' }),
          React.createElement('span', null, 'TDV Community Labs Mərkəzi Qovşağına Qayıt')
        )
      )
    )
  );
};
