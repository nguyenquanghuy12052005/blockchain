import React from 'react';
import { cn } from './cn';

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200 bg-white/80 backdrop-blur shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pt-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pb-6 pt-1', className)} {...props}>
      {children}
    </div>
  );
}

