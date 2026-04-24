import React from 'react';
import { inputBaseClassName } from './Field';
import { cn } from './cn';

export default function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(inputBaseClassName({ hasError: !!error }), 'resize-none', className)}
      {...props}
    />
  );
}

