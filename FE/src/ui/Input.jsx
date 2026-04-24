import React from 'react';
import { inputBaseClassName } from './Field';
import { cn } from './cn';

export default function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(inputBaseClassName({ hasError: !!error }), className)}
      {...props}
    />
  );
}

