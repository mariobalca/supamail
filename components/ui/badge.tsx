import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      secondary: 'bg-slate-50 text-slate-700 border-slate-100',
      success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      danger: 'bg-rose-50 text-rose-700 border-rose-100',
      warning: 'bg-amber-50 text-amber-700 border-amber-100',
      outline: 'bg-transparent text-slate-600 border-slate-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
