let idSeq = 1;
const listeners = new Set();
let toasts = [];

export function subscribe(listener) {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
}

function emit() {
  for (const l of listeners) l(toasts);
}

export function pushToast({ tone = 'info', title, message, durationMs = 3200 }) {
  const id = String(idSeq++);
  const toast = { id, tone, title, message };
  toasts = [toast, ...toasts].slice(0, 5);
  emit();

  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, durationMs);

  return id;
}

export const toast = {
  success: (message, opts) => pushToast({ tone: 'success', message, ...opts }),
  error: (message, opts) => pushToast({ tone: 'error', message, ...opts }),
  info: (message, opts) => pushToast({ tone: 'info', message, ...opts }),
};

