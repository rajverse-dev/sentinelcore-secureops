import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800 bg-navy-800/60 backdrop-blur-sm p-6 shadow-sm hover:border-slate-700/80 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
