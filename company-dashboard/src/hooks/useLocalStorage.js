import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue, enabled = true) {
  const [value, setValue] = useState(() => {
    if (enabled && typeof window !== 'undefined') {
      try {
        const item = sessionStorage.getItem(key);
        if (item) return JSON.parse(item);
      } catch {}
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }
  }, [key, value, enabled]);

  return [value, setValue];
}
