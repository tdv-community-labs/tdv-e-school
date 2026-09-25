// MəktəbPlus - KaTeX Riyazi və Elmi Düstur Renderləyicisi

import React, { useEffect, useRef } from 'react';

/**
 * Mətndəki $...$ (inline) və $$...$$ (display) LaTeX bloklarını aşkar edir və KaTeX ilə render edir.
 * Error boundary: bütün katex.render() çağırışları try/catch ilə qorunur.
 * Render xətası zamanı katex-error fallback span göstərilir.
 */
export const KatexRenderer = ({ text = '', className = '', block = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Null guard — container mövcud deyilsə çıx
    if (!containerRef.current) return;

    // KaTeX yüklənməyibsə sadə mətn göstər
    if (!window.katex) {
      try { containerRef.current.innerText = text; } catch (_) {}
      return;
    }

    // Render xətasında fallback elementini yarat
    const createErrorFallback = (formulaText) => {
      const span = document.createElement('span');
      span.className = 'katex-error';
      span.title = 'Render failed';
      try { span.innerText = formulaText; } catch (_) {}
      return span;
    };

    if (block) {
      try {
        const cleanLatex = (text || '').replace(/^\$\$/, '').replace(/\$\$$/, '').trim();
        window.katex.render(cleanLatex, containerRef.current, {
          displayMode: true,
          throwOnError: false
        });
      } catch (e) {
        console.warn('KaTeX block render error:', e);
        try {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(createErrorFallback(text));
        } catch (_) {}
      }
      return;
    }

    // Qarışıq mətn: mətni LaTeX hissələrinə və adi mətnə parçalayırıq
    // $$...$$ əvvəlcə, sonra $...$
    try {
      const tokens = [];
      let lastIndex = 0;

      // Regex for display math $$...$$ and inline math $...$
      // Qeyd: \$ qorunmalıdır
      const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          tokens.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        const fullMatch = match[0];
        if (fullMatch.startsWith('$$')) {
          tokens.push({
            type: 'math-block',
            content: fullMatch.slice(2, -2).trim()
          });
        } else {
          tokens.push({
            type: 'math-inline',
            content: fullMatch.slice(1, -1).trim()
          });
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        tokens.push({ type: 'text', content: text.substring(lastIndex) });
      }

      // Köhnə məzmunu təmizlə
      containerRef.current.innerHTML = '';

      tokens.forEach(tok => {
        try {
          if (tok.type === 'text') {
            const span = document.createElement('span');
            span.innerText = tok.content;
            containerRef.current.appendChild(span);
          } else if (tok.type === 'math-inline') {
            const span = document.createElement('span');
            span.className = 'katex-inline-formula mx-0.5';
            try {
              window.katex.render(tok.content, span, { displayMode: false, throwOnError: false });
            } catch (err) {
              // FIX: inline render xətası — fallback span göstər
              console.warn('KaTeX inline render error:', err);
              span.appendChild(createErrorFallback(`$${tok.content}$`));
            }
            containerRef.current.appendChild(span);
          } else if (tok.type === 'math-block') {
            const div = document.createElement('div');
            div.className = 'katex-block-formula my-3 overflow-x-auto py-1 text-center';
            try {
              window.katex.render(tok.content, div, { displayMode: true, throwOnError: false });
            } catch (err) {
              // FIX: block render xətası — fallback span göstər
              console.warn('KaTeX block render error:', err);
              div.appendChild(createErrorFallback(`$$${tok.content}$$`));
            }
            containerRef.current.appendChild(div);
          }
        } catch (tokenErr) {
          // Token səviyyəsindəki hər hansı xəta qlobal sfera çıxmasın
          console.warn('KaTeX token render error:', tokenErr);
          try {
            containerRef.current.appendChild(createErrorFallback(tok.content));
          } catch (_) {}
        }
      });
    } catch (err) {
      // Parse xətası — global sferaya çıxmaq əvəzinə fallback göstər
      console.error('KaTeX parse error:', err);
      try {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(createErrorFallback(text));
      } catch (_) {}
    }
  }, [text, block]);

  return React.createElement('span', {
    ref: containerRef,
    className: `katex-container ${className}`
  });
};
