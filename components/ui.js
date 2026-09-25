// TDV Community Labs - E-School UI Design System Components
// Strict Dual-Theme Standard: Zinc-950 (Dark) / Zinc-50 (Light) + WCAG AA Compliance

import React from 'react';

/**
 * Standardized Button with Primary, Secondary, Destructive, Outline & Ghost variants
 */
export const Button = ({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon = null,
  iconRight = null,
  className = '',
  title = '',
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed btn-spring tap-target';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base rounded-2xl gap-2.5'
  }[size] || 'px-4 py-2 text-xs sm:text-sm rounded-xl gap-2';

  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white shadow-sm shadow-purple-600/25 border border-purple-500/30',
    secondary: 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-sm shadow-rose-600/25 border border-rose-500/30',
    outline: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700',
    ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
  }[variant] || 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm';

  return React.createElement(
    'button',
    {
      type,
      disabled,
      onClick,
      title,
      className: `${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`,
      ...rest
    },
    icon && React.createElement('span', { className: 'shrink-0' }, icon),
    children && React.createElement('span', null, children),
    iconRight && React.createElement('span', { className: 'shrink-0' }, iconRight)
  );
};

/**
 * Standardized Status Badge with Semi-Transparent Background and Thin Border
 */
export const Badge = ({
  children,
  tone = 'purple', // 'purple' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'zinc'
  size = 'sm',
  className = '',
  icon = null
}) => {
  const toneClasses = {
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 dark:border-purple-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 dark:border-indigo-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20 dark:border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 dark:border-rose-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 dark:border-cyan-500/30',
    zinc: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
  }[tone] || 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.2 rounded-md font-bold'
    : 'text-xs px-2.5 py-0.5 rounded-full font-semibold';

  return React.createElement(
    'span',
    {
      className: `inline-flex items-center gap-1.5 border tracking-wide transition-colors duration-200 ${sizeClasses} ${toneClasses} ${className}`
    },
    icon && React.createElement('span', { className: 'shrink-0' }, icon),
    children
  );
};

/**
 * Standardized Empty State Component
 */
export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel = null,
  onAction = null,
  className = ''
}) => {
  return React.createElement(
    'div',
    {
      className: `flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[20px] border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 transition-colors duration-200 ${className}`
    },
    React.createElement(
      'div',
      {
        className: 'w-14 h-14 rounded-[8px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 mb-4 shadow-sm text-2xl'
      },
      icon || '🔍'
    ),
    React.createElement(
      'h3',
      {
        className: 'text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 tracking-tight'
      },
      title
    ),
    React.createElement(
      'p',
      {
        className: 'text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-65ch mb-6 leading-relaxed'
      },
      description
    ),
    actionLabel && onAction && React.createElement(
      Button,
      {
        variant: 'primary',
        size: 'sm',
        onClick: onAction
      },
      actionLabel
    )
  );
};

export const Skeleton = ({ className = 'h-4 w-full' }) => { return React.createElement('div', { className: 'skeleton-pulse rounded-md ' + className }); };

export const Card = ({ children, className = '' }) => { return React.createElement('div', { className: 'card-spring rounded-[20px] p-1 ' + className }, children); };
