import React from 'react';
import { cn } from './cn';

export function Field({ label, hint, error, required, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      )}
      {children}
      {error ? (
        <div className="text-xs font-medium text-red-600">{error}</div>
      ) : hint ? (
        <div className="text-xs text-slate-500">{hint}</div>
      ) : null}
    </div>
  );
}

export function inputBaseClassName({ hasError } = {}) {
  return cn(
    'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400',
    'shadow-sm outline-none transition',
    'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400',
    hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-200',
  );
}

