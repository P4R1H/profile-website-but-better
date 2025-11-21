"use client";

import { useState, useEffect } from "react";

export interface ViewportConfig {
  columns: number;
  gap: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Hook to detect viewport size and read Tesseract config from CSS variables.
 * This prevents flash-of-wrong-layout by reading CSS media queries that match SSR.
 *
 * @returns ViewportConfig with columns, gap, and device type flags
 */
export const useViewport = (): ViewportConfig => {
  const [config, setConfig] = useState<ViewportConfig>(() => {
    // SSR-safe: Return mobile default during server render
    if (typeof window === "undefined") {
      return {
        columns: 1,
        gap: 16,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      };
    }

    // Client-side: Read from CSS variables (matches media queries)
    return getViewportConfigFromCSS();
  });

  useEffect(() => {
    // Initial read on mount
    setConfig(getViewportConfigFromCSS());

    // Update on resize
    const handleResize = () => {
      setConfig(getViewportConfigFromCSS());
    };

    window.addEventListener("resize", handleResize);

    // Also listen for orientation changes on mobile
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return config;
};

/**
 * Reads Tesseract configuration from CSS variables.
 * This ensures client-side JS matches server-rendered CSS.
 */
function getViewportConfigFromCSS(): ViewportConfig {
  if (typeof window === "undefined") {
    return {
      columns: 1,
      gap: 16,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    };
  }

  const styles = getComputedStyle(document.documentElement);

  // Read CSS variables
  const columnsStr = styles.getPropertyValue("--tesseract-columns").trim();
  const gapStr = styles.getPropertyValue("--tesseract-gap").trim();

  const columns = parseInt(columnsStr) || 1;
  const gap = parseInt(gapStr) || 16;

  // Determine device type from columns (matches our media queries)
  const isMobile = columns === 1;
  const isTablet = columns === 2;
  const isDesktop = columns === 3;

  return {
    columns,
    gap,
    isMobile,
    isTablet,
    isDesktop,
  };
}
