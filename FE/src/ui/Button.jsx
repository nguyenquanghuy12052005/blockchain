import React from 'react';
import { cn } from './cn';

const VARIANTS = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus-visible:ring-blue-500',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500',
  ghost:
    'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-blue-500',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'disabled:opacity-60 disabled:pointer-events-none',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}
      {!loading && leftIcon}
      <span className="whitespace-nowrap">{children}</span>
      {!loading && rightIcon}
    </button>
  );
}

