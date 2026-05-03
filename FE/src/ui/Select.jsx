import React from 'react';
import { inputBaseClassName } from './Field';
import { cn } from './cn';

export default function Select({ className, error, children, ...props }) {
  return (
    <select
      className={cn(
        inputBaseClassName({ hasError: !!error }),
        'appearance-none pr-10',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

