// MəktəbPlus - PhET İnteraktiv Simulyasiya Komponenti

import React, { useState, useRef, useEffect, useCallback } from 'react';

const LOAD_TIMEOUT_MS = 10000; // 10 saniyə gözləmə limiti

export const PhetEmbed = ({ simUrl, title, description }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  // 10 saniyəlik timeout — yükləmə bitməyibsə xəta göstər
  useEffect(() => {
    if (!isLoading) return;

    timeoutRef.current = setTimeout(() => {
      // FIX: timeout — iframe 10s ərzində yüklənmədi, fallback göstər
      setHasError(true);
      setIsLoading(false);
    }, LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, simUrl]);

  const handleIframeLoad = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    // FIX: iframe onerror — yükləmə uğursuz oldu, fallback göstər
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
    setHasError(true);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.warn('Fullscreen error:', err);
        });
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen toggle error:', e);
    }
  };

  const reloadIframe = () => {
    try {
      setIsLoading(true);
      setHasError(false);
      // URL-i sıfırlayaraq yenidən yükləməni başlat
      if (iframeRef.current) {
        iframeRef.current.src = '';
        // Növbəti tick-də əsl URL-i yenidən təyin et
        requestAnimationFrame(() => {
          if (iframeRef.current) iframeRef.current.src = simUrl;
        });
      }
    } catch (e) {
      console.warn('Reload iframe error:', e);
    }
  };

  // Yükləmə xətası fallback UI
  const fallbackEl = React.createElement(
    'div',
    { className: 'phet-fallback flex flex-col items-center justify-center gap-3 text-center p-8 text-zinc-400 w-full h-full' },
    React.createElement('i', { className: 'fas fa-circle-exclamation text-4xl text-rose-400 mb-2' }),
    React.createElement('p', { className: 'text-sm font-semibold text-zinc-600 dark:text-zinc-300' }, 'Simulyasiya yüklənmədi.'),
    React.createElement(
      'a',
      {
        href: simUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: (e) => { e.preventDefault(); reloadIframe(); },
        className: 'text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer'
      },
      'Yenidən cəhd edin'
    )
  );

  return React.createElement(
    'div',
    {
      ref: containerRef,
      className: 'bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-lg my-6 transition-all duration-200'
    },
    // Başlıq və Alətlər Paneli
    React.createElement(
      'div',
      {
        className: 'flex items-center justify-between px-5 py-3.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800'
      },
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(
          'span',
          { className: 'flex h-3 w-3 relative' },
          React.createElement('span', { className: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75' }),
          React.createElement('span', { className: 'relative inline-flex rounded-full h-3 w-3 bg-cyan-500' })
        ),
        React.createElement(
          'div',
          null,
          React.createElement('h4', { className: 'font-bold text-zinc-800 dark:text-zinc-100 text-sm' }, title || 'PhET İnteraktiv Laboratoriyası'),
          React.createElement('p', { className: 'text-xs text-zinc-500 dark:text-zinc-400' }, description || 'Laboratoriya təcrübəsini ekranda idarə edin')
        )
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-2' },
        React.createElement(
          'button',
          {
            onClick: reloadIframe,
            title: 'Simulyasiyanı yenilə',
            className: 'p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition'
          },
          React.createElement('i', { className: 'fas fa-rotate-right text-sm' })
        ),
        React.createElement(
          'button',
          {
            onClick: toggleFullscreen,
            title: 'Tam ekran',
            className: 'p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition'
          },
          React.createElement('i', { className: isFullscreen ? 'fas fa-compress text-sm' : 'fas fa-expand text-sm' })
        )
      )
    ),
    // Simulyasiya Çərçivəsi
    React.createElement(
      'div',
      { className: 'relative w-full aspect-video bg-zinc-950 flex items-center justify-center' },
      // Yükləmə spineri
      isLoading && !hasError && React.createElement(
        'div',
        { className: 'absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-10 text-white' },
        React.createElement('div', { className: 'animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent mb-3' }),
        React.createElement('p', { className: 'text-xs font-semibold text-cyan-400 tracking-wider uppercase' }, 'PhET Simulyasiyası Yüklənir...')
      ),
      // Xəta fallback
      hasError && React.createElement(
        'div',
        { className: 'absolute inset-0 z-10 bg-zinc-900/95' },
        fallbackEl
      ),
      // İframe — həmişə DOM-da qalır (timeout/error üçün gerekli)
      React.createElement('iframe', {
        ref: iframeRef,
        src: simUrl,
        title: title,
        onLoad: handleIframeLoad,
        onError: handleIframeError,
        allowFullScreen: true,
        className: 'w-full h-full border-0'
      })
    ),
    // Alt Bildiriş
    React.createElement(
      'div',
      { className: 'px-5 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between' },
      React.createElement(
        'span',
        null,
        'Mənbə: University of Colorado Boulder (PhET İnteraktiv Simulyasiyaları)'
      ),
      React.createElement(
        'a',
        {
          href: simUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium'
        },
        React.createElement('span', null, 'Yeni pəncərədə aç'),
        React.createElement('i', { className: 'fas fa-external-link-alt text-[10px]' })
      )
    )
  );
};
