"use client";

import { useState, useEffect } from "react";

interface MobileDetection {
  isMobile: boolean;
  isTouch: boolean;
  viewport: {
    width: number;
    height: number;
  };
}

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect mobile viewport and touch capability
 * Updates on window resize for responsive behavior
 */
export const useMobileDetection = (): MobileDetection => {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTouch: false,
    viewport: {
      width: typeof window !== "undefined" ? window.innerWidth : 1024,
      height: typeof window !== "undefined" ? window.innerHeight : 768,
    },
  });

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < MOBILE_BREAKPOINT;
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      setDetection({
        isMobile,
        isTouch,
        viewport: { width, height },
      });
    };

    // Initial check
    checkMobile();

    // Listen for resize with debounce for performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener("resize", handleResize);

    // Also listen for orientation change on mobile
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  return detection;
};
