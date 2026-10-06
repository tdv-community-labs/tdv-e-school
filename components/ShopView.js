import React, { useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const ShopView = ({ userStats }) => {
  const [currentXP, setCurrentXP] = useState(userStats?.xp || 3450);
  const [purchasedItems, setPurchasedItems] = useState(['theme_dark']);

  const shopItems = [
    {
      id: 'border_gold',
      title: 'Qızıl Avatar Çərçivəsi',
      desc: 'Profil şəkilinizin ətrafında parıldayan qızıl çərçivə',
      price: 500,
      icon: 'fa-circle-user',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      id: 'theme_hacker',
      title: 'Hacker Mövzusu (Yaşıl)',
      desc: 'Bütün platformanı Matrix tərzinə çevirir',
      price: 1500,
      icon: 'fa-terminal',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      id: 'coupon_coffee',
      title: 'Kafeterya Kuponu',
      desc: 'Məktəb bufetində 1 ədəd pulsuz qəhvə/çay',
      price: 5000,
      icon: 'fa-mug-hot',
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 'title_master',
      title: '"Mütləq Hakim" Statusu',
      desc: 'Liderlər lövhəsində adınızın yanında xüsusi titul',
      price: 3000,
      icon: 'fa-crown',
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'ai_pro',
      title: 'AI Müəllim (PRO)',
      desc: 'Süni intellektə limitsiz müraciət hüququ',
      price: 2500,
      icon: 'fa-robot',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'pvp_shield',
      title: 'PvP Qorunma Qalxanı',
      desc: 'Məğlubiyyət zamanı reytinqiniz (Elo) düşmür (1 dəfəlik)',
      price: 800,
      icon: 'fa-shield-cat',
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    }
  ];

  const handlePurchase = (item) => {
    if (purchasedItems.includes(item.id)) {
      alert('Bu əşya artıq sizdə var!');
      return;
    }
    if (currentXP >= item.price) {
      if (confirm(`"${item.title}" məhsulunu ${item.price} XP qarşılığında almaq istəyirsiniz?`)) {
        setCurrentXP(prev => prev - item.price);
        setPurchasedItems(prev => [...prev, item.id]);
      }
    } else {
      alert('Kifayət qədər XP xalınız yoxdur! Daha çox dərs oxuyun.');
    }
  };

  return html`
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 bg-gradient-to-r from-violet-900 to-fuchsia-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-fuchsia-200 mb-4 backdrop-blur-md">
            <i className="fa-solid fa-store"></i>
            <span>Tələbə Mükafat Mərkəzi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">XP Mağazası</h1>
          <p className="text-fuchsia-200 mt-2 max-w-lg">Qazandığınız Təcrübə Xallarını (XP) vizual əlavələrə və ya real məktəb kuponlarına dəyişin.</p>
        </div>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[160px]">
          <div className="text-[10px] text-fuchsia-200 font-bold uppercase tracking-wider mb-1">Balansınız</div>
          <div className="text-4xl font-black text-amber-400 drop-shadow-md flex items-center gap-2">
            ${currentXP} <span className="text-xl">XP</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${shopItems.map((item) => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = currentXP >= item.price;
          
          return html`
            <div key=${item.id} className="bg-white dark:bg-[#080808] dark:backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col">
              
              ${isPurchased && html`
                <div className="absolute -right-10 top-6 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-10 rotate-45 shadow-sm">
                  Alındı
                </div>
              `}

              <div className="flex items-start justify-between mb-4">
                <div className=${`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                  <i className=${`fa-solid ${item.icon}`}></i>
                </div>
                
                ${!isPurchased && html`
                  <div className=${`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 ${canAfford ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                    <i className="fa-solid fa-star text-[10px]"></i>
                    ${item.price} XP
                  </div>
                `}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">${item.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">${item.desc}</p>
              </div>

              <button 
                onClick=${() => handlePurchase(item)}
                disabled=${isPurchased}
                className=${`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  isPurchased 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                    : canAfford
                      ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 cursor-not-allowed'
                }`}
              >
                ${isPurchased ? 'Aktivdir' : canAfford ? 'İndi Al' : 'XP Çatmır'}
              </button>
            </div>
          `;
        })}
      </div>

    </div>
  `;
};
