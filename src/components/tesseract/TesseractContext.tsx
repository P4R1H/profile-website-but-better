"use client";

import React, { createContext, useContext } from "react";
import { TesseractConfig, TesseractState } from "@/types/types";

interface TesseractContextValue {
  config: Required<TesseractConfig>;
  state: TesseractState;
  isLocked: boolean;
  activeId: string | undefined;
  isMobile: boolean;
}

const TesseractContext = createContext<TesseractContextValue | null>(null);

interface TesseractProviderProps {
  children: React.ReactNode;
  config: Required<TesseractConfig>;
  state: TesseractState;
  isLocked: boolean;
  activeId: string | undefined;
  isMobile: boolean;
}

export const TesseractProvider: React.FC<TesseractProviderProps> = ({
  children,
  config,
  state,
  isLocked,
  activeId,
  isMobile,
}) => {
  return (
    <TesseractContext.Provider
      value={{
        config,
        state,
        isLocked,
        activeId,
        isMobile,
      }}
    >
      {children}
    </TesseractContext.Provider>
  );
};

// Hook to access the full tesseract context
export const useTesseractContext = () => {
  const context = useContext(TesseractContext);
  if (!context) {
    throw new Error("useTesseractContext must be used within TesseractProvider");
  }
  return context;
};

// Hook for individual cells to access their state
export const useCellState = (cellId: string) => {
  const context = useTesseractContext();
  
  return {
    isHovered: context.state.hoveredItemId === cellId,
    isLocked: context.isLocked,
    isActive: context.activeId === cellId,
    isExpanded: context.state.expandedItemId === cellId,
  };
};