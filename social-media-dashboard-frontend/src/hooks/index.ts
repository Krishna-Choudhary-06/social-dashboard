import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

// ============================================================
// Custom Hooks
// ============================================================

/** Debounced value hook */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/** Responsive breakpoint hooks */
export function useIsMobile() {
  return useMediaQuery('(max-width:899px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width:600px) and (max-width:899px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width:900px)');
}

/** Copy to clipboard */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return { copied, copy };
}

/** Keyboard shortcut listener */
export function useKeyboardShortcut(key: string, callback: () => void, ctrlKey = false) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key && (!ctrlKey || e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, ctrlKey]);
}
