import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const variants = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95',
      secondary:
        'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-95',
      outline:
        'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm active:scale-95',
      ghost:
        'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 active:scale-95',
      danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
      md: 'px-5 py-2.5 text-sm font-bold rounded-xl',
      lg: 'px-6 py-4 text-base font-bold rounded-xl',
      icon: 'p-2 rounded-lg',
    };

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center transition-all disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
