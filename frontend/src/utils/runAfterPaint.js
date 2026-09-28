export const runAfterPaint = (callback, timeout = 3000) => {
  if (typeof window === 'undefined') return null;

  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout });
  }

  return window.setTimeout(callback, Math.min(timeout, 1000));
};

export const cancelAfterPaint = (id) => {
  if (id == null || typeof window === 'undefined') return;

  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
};
