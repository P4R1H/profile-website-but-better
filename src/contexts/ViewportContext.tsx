"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useViewport, ViewportConfig } from "@/hooks/useViewport";

/**
 * Context to share viewport configuration across all Tesseract instances.
 * This prevents children from recalculating viewport differently than root.
 */
const ViewportContext = createContext<ViewportConfig>({
  columns: 1,
  gap: 16,
  isMobile: true,
  isTablet: false,
  isDesktop: false,
});

/**
 * Hook to access viewport configuration.
 * Must be used inside ViewportProvider.
 */
export const useViewportContext = () => {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error("useViewportContext must be used within ViewportProvider");
  }
  return context;
};

interface ViewportProviderProps {
  children: ReactNode;
}

/**
 * Provider that calculates viewport once at root and shares it with all children.
 * Wrap your app root with this.
 */
export const ViewportProvider = ({ children }: ViewportProviderProps) => {
  const viewport = useViewport();

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
};
