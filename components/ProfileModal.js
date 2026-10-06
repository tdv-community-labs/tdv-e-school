// MəktəbPlus - Şagirdin Şəxsi Kabineti, İnkişaf Analitikası və Nailiyyətlər Paneli (Profile & Analytics Modal)

import React, { useState } from 'react';
import { SUBJECTS, GRADES } from '../data/subjects.js';

export const ProfileModal = ({
  isOpen,
  onClose,
  userStats,
  onUpdateStats,
  lessonsCount,
  examsCount
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'mastery', 'badges'
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userStats?.name || 'Məktəbli');
  const [grade, setGrade] = useState(userStats?.grade || 10);
  const [avatar, setAvatar] = useState(userStats?.avatar || '🎓');

  const avatarsList = ['🎓', '📚', '⚡', '🏆', '🦁', '🦉', '🚀', '🧠', '👑', '🥇', '🔬', '🎨'];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateStats) {
      onUpdateStats({
        ...userStats,
        name: name.trim() || 'Məktəbli',
        grade: Number(grade) || 10,
        avatar: avatar
      });
    }
    setIsEditing(false);
  };

  // Hesablanmış analitika
  const streak = userStats?.streak || 5;
  const pvpScore = userStats?.pvpScore || 1420;
  const matchesWon = userStats?.matchesWon || 8;
  const totalMatches = userStats?.totalMatches || 10;
  const winRate = totalMatches > 0 ? Math.round((matchesWon / totalMatches) * 100) : 0;

  // Nailiyyətlər (Achievements & Badges)
  const badges = [
    { id: 'b1', title: 'İlk Qələbə', icon: '🏆', desc: '1v1 PvP-də ilk qalibiyyət', unlocked: true },
    { id: 'b2', title: 'Pifaqor Dostu', icon: '📐', desc: 'Riyaziyyat dərslərini fəal oxumaq', unlocked: true },
    { id: 'b3', title: 'İldırım Sürəti', icon: '⚡', desc: 'Suala 3 saniyədən tez cavab vermək', unlocked: true },
    { id: 'b4', title: 'Gənc Laborant', icon: '🧪', desc: 'PhET və Virtual alətləri işə salmaq', unlocked: true },
    { id: 'b5', title: 'Əlaçı Summativ', icon: '🥇', desc: 'BSQ/KSQ imtahanından 5 qiymət almaq', unlocked: true },
    { id: 'b6', title: 'Alovlu Seriya', icon: '🔥', desc: '5 gün fasiləsiz platformaya daxil olmaq', unlocked: streak >= 5 },
    { id: 'b7', title: 'Kod Ulduzu', icon: '💻', desc: 'İnformatika və Python dərslərini tamamlamaq', unlocked: false },
    { id: 'b8', title: 'Elm Magistri', icon: '👑', desc: '2000 XP həddini aşmaq', unlocked: pvpScore >= 2000 }
  ];

  // Fənn mənimsəmə dərəcələri (Mastery bars)
  const masteryData = [
    { name: 'Riyaziyyat', percent: 88, color: 'bg-indigo-600', icon: 'fa-calculator' },
    { name: 'Fizika', percent: 74, color: 'bg-cyan-500', icon: 'fa-atom' },
    { name: 'Kimya', percent: 65, color: 'bg-emerald-500', icon: 'fa-flask' },
    { name: 'Biologiya', percent: 92, color: 'bg-lime-500', icon: 'fa-dna' },
    { name: 'İnformatika', percent: 95, color: 'bg-teal-500', icon: 'fa-cpu' },
    { name: 'Coğrafiya', percent: 80, color: 'bg-sky-500', icon: 'fa-globe-americas' },
    { name: 'Tarix', percent: 78, color: 'bg-amber-500', icon: 'fa-landmark' },
    { name: 'Azərbaycan dili', percent: 85, color: 'bg-rose-500', icon: 'fa-book-open' },
    { name: 'İngilis dili', percent: 82, color: 'bg-violet-500', icon: 'fa-language' }
  ];

  return React.createElement(
    'div',
    { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[16px] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] no-print' },
    
    React.createElement(
      'div',
      { className: 'bg-white dark:bg-[#080808] dark:backdrop-blur-xl rounded-[20px] max-w-2xl w-full shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]' },
      
      // Başlıq və Profil Kartı
      React.createElement(
        'div',
        { className: 'p-6 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white relative' },
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'absolute right-5 top-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition'
          },
          '✕'
        ),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-4' },
          React.createElement(
            'div',
            { className: 'w-16 h-16 rounded-[20px] bg-white/20 backdrop-blur-[16px] border border-white/30 flex items-center justify-center text-3xl shadow-inner' },
            avatar
          ),
          React.createElement(
            'div',
            { className: 'flex-1' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement('h2', { className: 'text-xl xl tabular-nums' }, name),
              React.createElement(
                'button',
                {
                  onClick: () => setIsEditing(!isEditing),
                  className: 'text-xs text-indigo-200 hover:text-white underline'
                },
                isEditing ? 'Ləğv et' : 'Düzəliş et'
              )
            ),
            React.createElement('p', { className: 'text-xs text-indigo-100' }, `${grade}-ci sinif şagirdi • Qızıl Liqa`),
            React.createElement(
              'div',
              { className: 'flex items-center space-x-3 mt-2 text-[11px] font-bold' },
              React.createElement('span', { className: 'px-2 py-0.5 rounded-full bg-amber-400 text-zinc-900 flex items-center space-x-1' },
                React.createElement('i', { className: 'fa-solid fa-star text-xs' }),
                React.createElement('span', null, `${pvpScore} XP`)
              ),
              React.createElement('span', { className: 'px-2 py-0.5 rounded-full bg-rose-500/80 text-white flex items-center space-x-1' },
                React.createElement('i', { className: 'fa-solid fa-fire text-xs' }),
                React.createElement('span', null, `${streak} Günlük Seriya`)
              )
            )
          )
        )
      ),

      // Redaktə Forması (əgər aktivdirsə)
      isEditing && React.createElement(
        'form',
        { onSubmit: handleSaveProfile, className: 'p-4 bg-indigo-50 dark:bg-[#050505] border-b border-indigo-100 dark:border-zinc-700 flex flex-wrap items-center gap-3' },
        React.createElement(
          'div',
          { className: 'flex-1 min-w-[150px]' },
          React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-500 mb-1' }, 'Adınız:'),
          React.createElement('input', {
            type: 'text',
            value: name,
            onChange: (e) => setName(e.target.value),
            className: 'w-full p-2 text-xs rounded-[8px] bg-white dark:bg-[#080808] dark:backdrop-blur-xl border border-zinc-300 dark:border-zinc-700 font-bold'
          })
        ),
        React.createElement(
          'div',
          { className: 'w-24' },
          React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-500 mb-1' }, 'Sinif:'),
          React.createElement('div', { className: 'flex flex-wrap gap-2' },
              avatarsList.map(a => React.createElement('button', {
                type: 'button',
                key: a,
                onClick: () => setAvatar(a),
                className: `w-10 h-10 flex items-center justify-center rounded-[8px] border-2 transition ${avatar === a ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-emerald-300'}`,
                dangerouslySetInnerHTML: { __html: a }
              }))
            )
        ),
        React.createElement(
          'button',
          {
            type: 'submit',
            className: 'mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-[8px] shadow'
          },
          'Yadda saxla'
        )
      ),

      // Naviqasiya Tabları
      React.createElement(
        'div',
        { className: 'p-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-white/10 flex space-x-2' },
        [
          { id: 'overview', label: 'Ümumi Statistikalar', icon: 'fa-chart-pie' },
          { id: 'mastery', label: 'Fənn Mənimsəməsi', icon: 'fa-graduation-cap' },
          { id: 'badges', label: 'Nailiyyətlər və Nişanlar', icon: 'fa-medal' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return React.createElement(
            'button',
            {
              key: tab.id,
              onClick: () => setActiveTab(tab.id),
              className: `px-3.5 py-2 rounded-[8px] text-xs font-bold flex items-center space-x-1.5 transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`
            },
            React.createElement('i', { className: `fas ${tab.icon} text-xs` }),
            React.createElement('span', null, tab.label)
          );
        })
      ),

      // Sürüşən Məzmun Sahəsi
      React.createElement(
        'div',
        { className: 'p-6 overflow-y-auto space-y-6 flex-1' },

        // 1. ÜMUMİ İNKİŞAF STATİSTİKASI
        activeTab === 'overview' && React.createElement(
          'div',
          { className: 'space-y-6' },
          
          // Kartlar
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 sm:grid-cols-4 gap-3' },
            React.createElement(
              'div',
              { className: 'p-4 rounded-[20px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-center' },
              React.createElement('div', { className: 'text-2xl 2xl tabular-nums text-indigo-600 dark:text-indigo-400' }, lessonsCount || 58),
              React.createElement('div', { className: 'text-[10px] font-bold text-zinc-500 uppercase mt-1' }, 'Mövcud Dərslər')
            ),
            React.createElement(
              'div',
              { className: 'p-4 rounded-[20px] bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900 text-center' },
              React.createElement('div', { className: 'text-2xl 2xl tabular-nums text-cyan-600 dark:text-cyan-400' }, examsCount || 7),
              React.createElement('div', { className: 'text-[10px] font-bold text-zinc-500 uppercase mt-1' }, 'Rəsmi BSQ/KSQ')
            ),
            React.createElement(
              'div',
              { className: 'p-4 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-center' },
              React.createElement('div', { className: 'text-2xl 2xl tabular-nums text-emerald-600 dark:text-emerald-400' }, `${winRate}%`),
              React.createElement('div', { className: 'text-[10px] font-bold text-zinc-500 uppercase mt-1' }, 'PvP Qələbə Faizi')
            ),
            React.createElement(
              'div',
              { className: 'p-4 rounded-[20px] bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 text-center' },
              React.createElement('div', { className: 'text-2xl 2xl tabular-nums text-amber-600 dark:text-amber-400' }, '4.8 / 5'),
              React.createElement('div', { className: 'text-[10px] font-bold text-zinc-500 uppercase mt-1' }, 'Orta Qiymət')
            )
          ),

          // AI Fərdi Tədris Tövsiyəsi (Smart AI Recommendation)
          React.createElement(
            'div',
            { className: 'p-4 rounded-[20px] bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 space-y-2' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement('i', { className: 'fa-solid fa-robot text-base text-indigo-500' }),
              React.createElement('h4', { className: 'text-xs font-black uppercase text-indigo-700 dark:text-indigo-300' }, 'Süni İntellekt Tədris Məsləhətçisi:')
            ),
            React.createElement(
              'p',
              { className: 'text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed' },
              'Riyaziyyat və İnformatika üzrə mənimsəmə dərəcəniz yüksəkdir (90%+). Biliklərinizi daha da möhkəmləndirmək üçün Kimyadan ',
              React.createElement('strong', { className: 'text-indigo-600 dark:text-indigo-400' }, '"Maddə Miqdarı və Avoqadro Qanunu"'),
              ' və Fizikadan ',
              React.createElement('strong', { className: 'text-indigo-600 dark:text-indigo-400' }, '"Kulon Qanunu"'),
              ' dərslərini təkrar oxumaq və KSQ-ləri sınaqdan keçirmək tövsiyə olunur.'
            )
          )
        ),

        // 2. FƏNN MƏNİMSƏMƏSİ (PROGRESS BARS)
        activeTab === 'mastery' && React.createElement(
          'div',
          { className: 'space-y-4' },
          React.createElement('p', { className: 'text-xs text-zinc-500' }, 'Test və dərslərdəki aktivliyinizə əsasən hesablanmış mənimsəmə faizləri:'),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            masteryData.map(m => {
              return React.createElement(
                'div',
                { key: m.name, className: 'space-y-1' },
                React.createElement(
                  'div',
                  { className: 'flex justify-between text-xs font-bold' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center space-x-2 text-zinc-700 dark:text-zinc-300' },
                    React.createElement('i', { className: `fas ${m.icon} text-indigo-500 text-xs` }),
                    React.createElement('span', null, m.name)
                  ),
                  React.createElement('span', { className: 'text-zinc-600 dark:text-zinc-400' }, `${m.percent}%`)
                ),
                React.createElement(
                  'div',
                  { className: 'w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden' },
                  React.createElement('div', {
                    className: `h-full rounded-full ${m.color} transition-all duration-500`,
                    style: { width: `${m.percent}%` }
                  })
                )
              );
            })
          )
        ),

        // 3. NAİLİYYƏTLƏR VƏ NİŞANLAR (BADGES GRID)
        activeTab === 'badges' && React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-4 gap-3' },
          badges.map(b => {
            return React.createElement(
              'div',
              {
                key: b.id,
                className: `p-3.5 rounded-[20px] border text-center transition-all ${
                  b.unlocked
                    ? 'bg-white dark:bg-zinc-800 border-amber-300 dark:border-amber-600/60 shadow-sm'
                    : 'bg-zinc-50 dark:bg-[#080808] dark:backdrop-blur-xl border-zinc-200 dark:border-white/10 opacity-40 grayscale'
                }`
              },
              React.createElement('div', { className: 'text-3xl mb-1.5' }, b.icon),
              React.createElement('h5', { className: 'text-xs font-black text-zinc-800 dark:text-zinc-200' }, b.title),
              React.createElement('p', { className: 'text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-tight' }, b.desc),
              React.createElement(
                'span',
                { className: `inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-[8px] mt-2 ${
                  b.unlocked ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }` },
                b.unlocked ? 'Qazanıldı' : 'Kilidli'
              )
            );
          })
        )
      )
    )
  );
};
