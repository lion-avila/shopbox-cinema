import { useState, useEffect, useCallback, useRef } from 'react';

const HOLD_STORAGE_KEY = 'shopbox_active_hold_v1';
const HOLD_DURATION_SECONDS = 10 * 60; // 10 minutes = 600s

export interface SeatHoldPayload {
  showtimeId: string;
  seatIds: number[];
  expiresAt: number; // timestamp in ms
}

export function getStoredHold(): SeatHoldPayload | null {
  try {
    const raw = sessionStorage.getItem(HOLD_STORAGE_KEY);
    if (!raw) return null;
    const parsed: SeatHoldPayload = JSON.parse(raw);
    if (typeof parsed.expiresAt !== 'number' || !parsed.showtimeId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredHold(payload: SeatHoldPayload | null) {
  try {
    if (!payload) {
      sessionStorage.removeItem(HOLD_STORAGE_KEY);
    } else {
      sessionStorage.setItem(HOLD_STORAGE_KEY, JSON.stringify(payload));
    }
  } catch {
    // ignore sessionStorage errors in incognito/quota
  }
}

export function useSeatHoldTimer(
  showtimeId: string | undefined,
  selectedSeats: number[],
  onExpire?: () => void
) {
  const [secondsLeft, setSecondsLeft] = useState<number>(HOLD_DURATION_SECONDS);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Initialize or synchronize hold timer
  useEffect(() => {
    if (!showtimeId || selectedSeats.length === 0) {
      // If no seats selected, clear hold if it matches this showtime
      const current = getStoredHold();
      if (current && current.showtimeId === showtimeId) {
        saveStoredHold(null);
      }
      setSecondsLeft(HOLD_DURATION_SECONDS);
      setIsExpired(false);
      return;
    }

    const now = Date.now();
    const existing = getStoredHold();

    let expiresAt: number;
    if (existing && existing.showtimeId === showtimeId && existing.expiresAt > now) {
      // Continue existing hold
      expiresAt = existing.expiresAt;
      saveStoredHold({
        showtimeId,
        seatIds: selectedSeats,
        expiresAt,
      });
    } else {
      // Start fresh 10-minute hold
      expiresAt = now + HOLD_DURATION_SECONDS * 1000;
      saveStoredHold({
        showtimeId,
        seatIds: selectedSeats,
        expiresAt,
      });
    }

    const calcRemaining = () => {
      const remainingMs = expiresAt - Date.now();
      const remSec = Math.max(0, Math.floor(remainingMs / 1000));
      return remSec;
    };

    const initialRem = calcRemaining();
    setSecondsLeft(initialRem);
    if (initialRem <= 0) {
      setIsExpired(true);
      if (onExpireRef.current) onExpireRef.current();
    } else {
      setIsExpired(false);
    }

    const interval = setInterval(() => {
      const rem = calcRemaining();
      setSecondsLeft(rem);
      if (rem <= 0) {
        clearInterval(interval);
        setIsExpired(true);
        saveStoredHold(null);
        if (onExpireRef.current) {
          onExpireRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showtimeId, selectedSeats.length > 0]); // Re-evaluate when entering/leaving hold

  const formatRemaining = useCallback((sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const resetHold = useCallback(() => {
    if (!showtimeId) return;
    const expiresAt = Date.now() + HOLD_DURATION_SECONDS * 1000;
    saveStoredHold({
      showtimeId,
      seatIds: selectedSeats,
      expiresAt,
    });
    setSecondsLeft(HOLD_DURATION_SECONDS);
    setIsExpired(false);
  }, [showtimeId, selectedSeats]);

  const clearHold = useCallback(() => {
    saveStoredHold(null);
    setSecondsLeft(HOLD_DURATION_SECONDS);
    setIsExpired(false);
  }, []);

  return {
    secondsLeft,
    formattedTime: formatRemaining(secondsLeft),
    isWarning: secondsLeft <= 120 && secondsLeft > 0, // < 2 minutes left
    isExpired,
    resetHold,
    clearHold,
  };
}
