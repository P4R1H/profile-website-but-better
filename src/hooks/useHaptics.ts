"use client";

import { useCallback, useRef } from "react";

interface HapticPattern {
  duration: number;
  intensity?: "light" | "medium" | "heavy";
}

const HAPTIC_DURATIONS = {
  light: 50,
  medium: 100,
  heavy: 200,
} as const;

/**
 * Hook for haptic feedback using Vibration API
 * Provides tactile feedback for mobile interactions
 */
export const useHaptics = () => {
  const isVibrateSupported =
    typeof navigator !== "undefined" && "vibrate" in navigator;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!isVibrateSupported) return;

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }, [isVibrateSupported]);

  const trigger = useCallback(
    (intensity: HapticPattern["intensity"] = "medium") => {
      const duration = HAPTIC_DURATIONS[intensity];
      vibrate(duration);
    },
    [vibrate]
  );

  const snap = useCallback(() => {
    // Double-tap pattern for scroll snap feedback
    vibrate([50, 30, 50]);
  }, [vibrate]);

  const expand = useCallback(() => {
    // Rising intensity for expansion
    vibrate([30, 20, 60]);
  }, [vibrate]);

  const collapse = useCallback(() => {
    // Falling intensity for collapse
    vibrate([60, 20, 30]);
  }, [vibrate]);

  const cancel = useCallback(() => {
    vibrate(0);
  }, [vibrate]);

  return {
    trigger,
    snap,
    expand,
    collapse,
    cancel,
    isSupported: isVibrateSupported,
  };
};
