import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-navy-900 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        {
          'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20': variant === 'primary',
          'bg-navy-800 text-white hover:bg-navy-700 border border-slate-700': variant === 'secondary',
          'border border-slate-700 bg-transparent text-slate-300 hover:bg-navy-800 hover:text-white': variant === 'outline',
          'bg-transparent text-slate-400 hover:text-white hover:bg-navy-800/80': variant === 'ghost',
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-4 py-2 text-sm': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
