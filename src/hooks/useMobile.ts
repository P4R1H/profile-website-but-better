"use client";

import { useState, useEffect } from "react";

/**
 * Detects if the device is a touch device
 * Uses both media query and touch detection for reliability
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Method 1: CSS hover capability (most reliable)
      const hasHover = window.matchMedia("(hover: hover)").matches;

      // Method 2: Touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Method 3: Screen width fallback
      const isSmallScreen = window.innerWidth < 768;

      // Device is mobile if it has touch AND (no hover OR small screen)
      const mobile = hasTouch && (!hasHover || isSmallScreen);

      setIsMobile(mobile);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events (e.g., device rotation)
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Haptic feedback utility
 * Provides different vibration patterns for different interactions
 */
export const haptics = {
  /**
   * Light tap feedback (touch start, hover)
   */
  light: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium feedback (touch hold detected)
   */
  medium: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Heavy feedback (expansion, major state change)
   */
  heavy: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([30, 10, 20]);
    }
  },

  /**
   * Error/cancel feedback
   */
  error: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  },
};

/**
 * Get the number of columns based on viewport width
 */
export function useResponsiveColumns(defaultColumns: number = 3): number {
  const [columns, setColumns] = useState(defaultColumns);
  const isMobile = useMobile();

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // Mobile: single column
        setColumns(1);
      } else if (width < 1024) {
        // Tablet: two columns
        setColumns(2);
      } else {
        // Desktop: use default
        setColumns(defaultColumns);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, [defaultColumns, isMobile]);

  return columns;
}
