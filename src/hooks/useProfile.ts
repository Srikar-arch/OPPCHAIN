import { useState, useEffect, useCallback } from 'react';
import type { StudentProfile } from '../types';
import { defaultProfile } from '../data/demo';

const STORAGE_KEY = 'oppchain_profile';

function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StudentProfile;
      // Merge with defaults so new fields added later get defaults
      return { ...defaultProfile, ...parsed };
    }
  } catch {
    // Corrupted storage — fall back to defaults
  }
  return { ...defaultProfile };
}

function saveProfile(profile: StudentProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/**
 * Manages student profile state with localStorage persistence.
 * Designed so Phase 3 can replace localStorage with an API call.
 */
export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);

  const updateProfile = useCallback((updates: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveProfile(next);
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    const fresh = { ...defaultProfile };
    saveProfile(fresh);
    setProfile(fresh);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setProfile(JSON.parse(e.newValue));
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return { profile, updateProfile, resetProfile };
}
