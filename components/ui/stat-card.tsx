import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';

export interface StatCardProps {
  name: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: string;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  name,
  value,
  icon: Icon,
  color,
  bg,
  trend,
  loading,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className={cn(
            'rounded-xl p-3 transition-transform duration-500 group-hover:scale-110',
            bg
          )}
        >
          <Icon size={22} className={color} />
        </div>
        <div className="flex flex-col items-end">
          {trend && (
            <span className="mb-1 flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-600">
              <TrendingUp size={9} />
              {trend}
            </span>
          )}
          <ArrowUpRight
            size={18}
            className="text-slate-200 transition-colors group-hover:text-indigo-400"
          />
        </div>
      </div>
      <h3 className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {name}
      </h3>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
      ) : (
        <p className="truncate text-3xl font-black tracking-tighter text-slate-900">
          {value}
        </p>
      )}

      {/* Decorative background icon */}
      <Icon
        size={60}
        className="absolute -bottom-3 -right-3 text-slate-900 opacity-[0.03] transition-transform duration-700 group-hover:rotate-12"
      />
    </div>
  );
}
