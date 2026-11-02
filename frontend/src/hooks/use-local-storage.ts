"use client";

import { useCallback, useSyncExternalStore } from "react";

function getStorageSnapshot(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Safe localStorage hook using useSyncExternalStore for full React 19 / SSR compatibility
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const getSnapshot = useCallback(() => getStorageSnapshot(key), [key]);
  const getServerSnapshot = () => null;

  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let storedValue: T = initialValue;
  if (rawValue !== null) {
    try {
      storedValue = JSON.parse(rawValue) as T;
    } catch {
      storedValue = initialValue;
    }
  }

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const currentValue = getStorageSnapshot(key);
        const parsedCurrent: T = currentValue !== null ? (JSON.parse(currentValue) as T) : initialValue;
        const valueToStore =
          value instanceof Function ? value(parsedCurrent) : value;

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          window.dispatchEvent(new Event("storage"));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue]
  );

  return [storedValue, setValue];
}
