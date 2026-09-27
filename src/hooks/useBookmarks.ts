import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'oppchain_bookmarks';

function loadBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveBookmarks(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/**
 * Manages bookmark/saved opportunity IDs with localStorage persistence.
 */
export function useBookmarks() {
  const [savedIds, setSavedIds] = useState<string[]>(loadBookmarks);

  const toggleBookmark = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setSavedIds(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return { savedIds, toggleBookmark, isBookmarked };
}
