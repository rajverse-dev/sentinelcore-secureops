import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'healthy' | 'default';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border',
        {
          'bg-status-critical/15 text-status-critical border-status-critical/30': variant === 'critical',
          'bg-orange-500/15 text-orange-400 border-orange-500/30': variant === 'high',
          'bg-status-warning/15 text-status-warning border-status-warning/30': variant === 'medium',
          'bg-slate-500/15 text-slate-400 border-slate-500/30': variant === 'low',
          'bg-status-success/15 text-status-success border-status-success/30': variant === 'healthy',
          'bg-navy-700/80 text-slate-300 border-slate-700': variant === 'default',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
