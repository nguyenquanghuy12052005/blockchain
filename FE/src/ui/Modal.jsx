import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';

function useBodyScrollLock(isOpen) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  showClose = true,
}) {
  useBodyScrollLock(open);

  const el = useMemo(() => {
    const existing = document.getElementById('modal-root');
    if (existing) return existing;
    const div = document.createElement('div');
    div.id = 'modal-root';
    document.body.appendChild(div);
    return div;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className={cn(
          'relative w-full max-w-2xl rounded-3xl border border-white/30 bg-white shadow-2xl',
          'overflow-hidden',
          className,
        )}
      >
        {(title || description || showClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div className="min-w-0">
              {title && (
                <div className="text-xl font-bold text-slate-900">{title}</div>
              )}
              {description && (
                <div className="mt-1 text-sm text-slate-500">{description}</div>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => onClose?.()}
                aria-label="Đóng"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="px-6 pb-6 pt-5">{children}</div>
      </div>
    </div>,
    el,
  );
}

