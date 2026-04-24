import React, { useEffect, useState } from 'react';
import { cn } from './cn';
import { subscribe } from './toastStore';

const TONE = {
  success: {
    ring: 'ring-emerald-200',
    title: 'text-emerald-900',
    body: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  error: {
    ring: 'ring-red-200',
    title: 'text-red-900',
    body: 'text-red-800',
    dot: 'bg-red-500',
  },
  info: {
    ring: 'ring-blue-200',
    title: 'text-blue-900',
    body: 'text-blue-800',
    dot: 'bg-blue-500',
  },
};

export default function ToastViewport() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return subscribe(setItems);
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
      {items.map((t) => {
        const tone = TONE[t.tone] || TONE.info;
        return (
          <div
            key={t.id}
            className={cn(
              'rounded-2xl bg-white/90 backdrop-blur border border-slate-200 shadow-lg',
              'ring-1',
              tone.ring,
              'px-4 py-3',
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('mt-1 h-2.5 w-2.5 rounded-full', tone.dot)} />
              <div className="min-w-0">
                {t.title ? (
                  <div className={cn('text-sm font-bold', tone.title)}>{t.title}</div>
                ) : null}
                <div className={cn('text-sm font-medium', tone.body)}>{t.message}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

