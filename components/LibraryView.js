import React, { useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const LibraryView = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const books = [
    { id: 1, title: 'Riyazi Analiz', author: 'Yaqubov', color: 'bg-indigo-600', cat: 'math' },
    { id: 2, title: 'Kvant Fizikası', author: 'Feynman', color: 'bg-blue-600', cat: 'physics' },
    { id: 3, title: 'Ümumi Tarix', author: 'Mahmudov', color: 'bg-amber-700', cat: 'history' },
    { id: 4, title: 'Olimpiada Sirləri', author: 'TDV Labs', color: 'bg-emerald-600', cat: 'olympiad' },
    { id: 5, title: 'Python 101', author: 'Alan Turing', color: 'bg-zinc-800', cat: 'cs' },
    { id: 6, title: 'Genetika', author: 'Mendel', color: 'bg-rose-600', cat: 'biology' },
  ];

  const filteredBooks = activeCategory === 'all' ? books : books.filter(b => b.cat === activeCategory);

  return html`
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-4">
            <i className="fa-solid fa-book-journal-whills"></i>
            <span>3D E-Kitabxana Mərkəzi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Rəqəmsal Kitabxana</h1>
          <p className="text-zinc-500 mt-2 max-w-lg leading-relaxed">PDF dərs vəsaitləri, olimpiada materialları və əlavə oxu ehtiyatları.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          ${[
            { id: 'all', label: 'Bütün Kitablar' },
            { id: 'math', label: 'Riyaziyyat' },
            { id: 'physics', label: 'Fizika' },
            { id: 'olympiad', label: 'Olimpiada' }
          ].map(c => html`
            <button 
              key=${c.id}
              onClick=${() => setActiveCategory(c.id)}
              className=${`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === c.id 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md' 
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              ${c.label}
            </button>
          `)}
        </div>
      </div>

      {/* 3D Bookshelf Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-16 mt-10" style=${{ perspective: '1000px' }}>
        ${filteredBooks.map((book, idx) => html`
          <div 
            key=${book.id} 
            className="group relative h-64 w-full cursor-pointer transition-transform duration-500 hover:-translate-y-4"
            style=${{ transformStyle: 'preserve-3d', animationDelay: `${idx * 100}ms`, transform: 'rotateY(-5deg)' }}
            onMouseEnter=${(e) => e.currentTarget.style.transform = 'rotateY(10deg) translateY(-10px)'}
            onMouseLeave=${(e) => e.currentTarget.style.transform = 'rotateY(-5deg) translateY(0px)'}
          >
            {/* Book Spine (sol tərəf) */}
            <div className="absolute inset-y-0 left-0 w-6 bg-black/40 border-l border-white/20 flex items-center justify-center" 
                 style=${{ transformOrigin: 'left', transform: 'rotateY(-90deg)', zIndex: 10 }}>
              <span className="text-[8px] text-white/50 -rotate-90 whitespace-nowrap font-mono uppercase tracking-widest">${book.author}</span>
            </div>

            {/* Book Front Cover */}
            <div className=${`absolute inset-0 ${book.color} rounded-r-md border-l border-white/10 shadow-[5px_5px_15px_rgba(0,0,0,0.3)] group-hover:shadow-[15px_15px_25px_rgba(0,0,0,0.4)] transition-shadow duration-500 overflow-hidden flex flex-col p-4`} 
                 style=${{ transform: 'translateZ(24px)' }}>
              
              {/* Cover Design Details */}
              <div className="w-full h-full border-2 border-white/10 rounded flex flex-col justify-between relative z-10">
                <div className="p-3 border-b border-white/10 bg-black/20">
                  <h3 className="text-white font-black text-sm uppercase tracking-wider leading-tight shadow-sm">${book.title}</h3>
                </div>
                <div className="p-3 flex items-end justify-between">
                  <div className="text-[9px] text-white/70 uppercase tracking-widest">${book.author}</div>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <i className="fa-brands fa-readme text-white/80 text-[10px]"></i>
                  </div>
                </div>
              </div>

              {/* Glossy overlay */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" style=${{ transform: 'skewX(-12deg) translateX(25%)' }}></div>
            </div>

            {/* Book Pages (sağ tərəf) */}
            <div className="absolute inset-y-1 right-0 w-6 bg-zinc-200 border-y border-r border-zinc-300"
                 style=${{ transformOrigin: 'right', transform: 'rotateY(90deg)' }}>
               {/* Page lines */}
               <div className="w-full h-full flex flex-col justify-evenly px-0.5">
                 <div className="w-full h-px bg-zinc-300"></div>
                 <div className="w-full h-px bg-zinc-300"></div>
                 <div className="w-full h-px bg-zinc-300"></div>
                 <div className="w-full h-px bg-zinc-300"></div>
                 <div className="w-full h-px bg-zinc-300"></div>
               </div>
            </div>

          </div>
        `)}
      </div>

    </div>
  `;
};
