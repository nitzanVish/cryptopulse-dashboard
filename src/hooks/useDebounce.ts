/**
 * useDebounce Hook
 *
 * Custom hook for debouncing values to optimize performance.
 * Useful for search inputs, API calls, and other operations that should
 * not execute on every keystroke.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: SEARCH_DEBOUNCE_MS from constants)
 * @returns Debounced value
 */

import { useState, useEffect } from 'react';
import { SEARCH_DEBOUNCE_MS } from '@/constants/ui';

export function useDebounce<T>(value: T, delay: number = SEARCH_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay completes
    // This prevents unnecessary updates
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
