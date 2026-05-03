import React from 'react';
import { cn } from './cn';

const STYLES = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide',
        STYLES[tone] || STYLES.neutral,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

