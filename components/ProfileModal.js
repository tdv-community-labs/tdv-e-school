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
  const [avatar, setAvatar] = useState(userStats?.avatar || '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span><span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>');

  const avatarsList = ['<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span><span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>', '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span><span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg></span>', '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span><span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><rect width="14" height="8" x="5" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h2"/><path d="M12 18h2"/></svg></span>', '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg></span>', '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 3.82-13 1.5 1.5 0 0 0-2.18 2.18A22 22 0 0 1 12 15Z"/><path d="m15 12-3-3"/><path d="m10 7-2-2"/><path d="m17 14-2-2"/></svg></span>', '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="12" r="10"/></svg></span>', '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M12 2C7 2 3 6 3 11c0 2.2.9 4.2 2.3 5.6C4 18 3 20 3 22h18c0-2-1-4-2.3-5.4C20.1 15.2 21 13.2 21 11c0-5-4-9-9-9z"/><path d="M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M15 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 15v2"/></svg></span>', '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>'];

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
    { id: 'b1', title: 'İlk Qələbə', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>', desc: '1v1 PvP-də ilk qalibiyyət', unlocked: true },
    { id: 'b2', title: 'Pifaqor Dostu', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M12.232 4.032a1.5 1.5 0 0 0-2.122 0L3 11.103a1.5 1.5 0 0 0 0 2.121l7.07 7.071a1.5 1.5 0 0 0 2.122 0l7.07-7.07a1.5 1.5 0 0 0 0-2.122Z"/><path d="M11 11h2"/><path d="M14 8h2"/><path d="M8 14h2"/></svg></span>', desc: 'Riyaziyyat dərslərini fəal oxumaq', unlocked: true },
    { id: 'b3', title: 'İldırım Sürəti', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="12" r="10"/></svg></span>', desc: 'Suala 3 saniyədən tez cavab vermək', unlocked: true },
    { id: 'b4', title: 'Gənc Laborant', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg></span>', desc: 'PhET və Virtual alətləri işə salmaq', unlocked: true },
    { id: 'b5', title: 'Əlaçı Summativ', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>', desc: 'BSQ/KSQ imtahanından 5 qiymət almaq', unlocked: true },
    { id: 'b6', title: 'Alovlu Seriya', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span>', desc: '5 gün fasiləsiz platformaya daxil olmaq', unlocked: streak >= 5 },
    { id: 'b7', title: 'Kod Ulduzu', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><rect width="14" height="8" x="5" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h2"/><path d="M12 18h2"/></svg></span>', desc: 'İnformatika və Python dərslərini tamamlamaq', unlocked: false },
    { id: 'b8', title: 'Elm Magistri', icon: '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.518l4.276 3.664a1 1 0 0 0 1.516-.294z"/></svg></span>', desc: '2000 XP həddini aşmaq', unlocked: pvpScore >= 2000 }
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
      { className: 'bg-white dark:bg-zinc-900 rounded-[20px] max-w-2xl w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]' },
      
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
                React.createElement('span', null, '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><circle cx="12" cy="12" r="10"/></svg></span>'),
                React.createElement('span', null, `${pvpScore} XP`)
              ),
              React.createElement('span', { className: 'px-2 py-0.5 rounded-full bg-rose-500/80 text-white flex items-center space-x-1' },
                React.createElement('span', null, '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span>'),
                React.createElement('span', null, `${streak} Günlük Seriya`)
              )
            )
          )
        )
      ),

      // Redaktə Forması (əgər aktivdirsə)
      isEditing && React.createElement(
        'form',
        { onSubmit: handleSaveProfile, className: 'p-4 bg-indigo-50 dark:bg-zinc-800/80 border-b border-indigo-100 dark:border-zinc-700 flex flex-wrap items-center gap-3' },
        React.createElement(
          'div',
          { className: 'flex-1 min-w-[150px]' },
          React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-500 mb-1' }, 'Adınız:'),
          React.createElement('input', {
            type: 'text',
            value: name,
            onChange: (e) => setName(e.target.value),
            className: 'w-full p-2 text-xs rounded-[8px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-bold'
          })
        ),
        React.createElement(
          'div',
          { className: 'w-24' },
          React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-500 mb-1' }, 'Sinif:'),
          React.createElement('select', {
            value: grade,
            onChange: (e) => setGrade(e.target.value),
            className: 'w-full p-2 text-xs rounded-[8px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-bold'
          },
            GRADES.map(g => React.createElement('option', { key: g, value: g }, `${g}-ci sinif`))
          )
        ),
        React.createElement(
          'div',
          { className: 'w-32' },
          React.createElement('label', { className: 'block text-[10px] font-bold text-zinc-500 mb-1' }, 'Avatar:'),
          React.createElement('select', {
            value: avatar,
            onChange: (e) => setAvatar(e.target.value),
            className: 'w-full p-2 text-xs rounded-[8px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-bold text-base'
          },
            avatarsList.map(a => React.createElement('option', { key: a, value: a }, a))
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
        { className: 'p-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex space-x-2' },
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
              React.createElement('span', { className: 'text-base' }, '<span className="inline-block align-middle mr-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-block opacity-80"><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/><path d="M12 3v5"/><path d="M12 3a2 2 0 0 0 0-4 2 2 0 0 0 0 4Z"/></svg></span>'),
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
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-40 grayscale'
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
