"use client";

import React, { createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData } from "@/types/types";
import { Tesseract } from "./Tesseract";
import { useLongPress } from "@/lib/hooks";

type CellContextType = {
  isHovered: boolean;
  isLocked: boolean;
  isActive: boolean;
};

const CellContext = createContext<CellContextType>({
  isHovered: false,
  isLocked: false,
  isActive: false,
});

// --- 2. HOOK EXPORT ---
// Import this hook in your content components to detect hover/lock state.
export const useCellState = () => useContext(CellContext);

interface TesseractCellProps {
  cell: TesseractCellData;
  path: string[];
  onNavigate: (newPath: string[]) => void;
  activeId: string | undefined;
  isLocked: boolean;
  isHovered: boolean;
  level: number;
  expandDuration: number;
  collapseDuration: number;
  style?: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  // Mobile props
  setHoveredItemId?: (id: string | null) => void;
  setHoveredColIndex?: (index: number | null) => void;
  colIndex?: number;
  isMobile?: boolean;
}

export const TesseractCell = ({
  cell,
  path,
  onNavigate,
  activeId,
  isLocked,
  isHovered,
  level,
  expandDuration,
  collapseDuration,
  style,
  onMouseEnter,
  onMouseLeave,
  setHoveredItemId,
  setHoveredColIndex,
  colIndex,
  isMobile,
}: TesseractCellProps) => {
  const isActive = cell.id === activeId;
  const canExpand = !cell.isLeaf && (cell.renderExpanded || (cell.children && cell.children.length > 0));
  const isLongPressTriggered = useRef(false);

  const handleLongPress = () => {
    if (isLocked || cell.disableHover || !isMobile) return;
    if (navigator.vibrate) navigator.vibrate(15);
    setHoveredItemId?.(cell.id);
    setHoveredColIndex?.(colIndex ?? 0);
    isLongPressTriggered.current = true;
  };

  const handlePressRelease = () => {
    if (isMobile && isLongPressTriggered.current) {
        setHoveredItemId?.(null);
        setHoveredColIndex?.(null);
    }
  };

  const { onTouchStart, onTouchEnd, onTouchMove } = useLongPress(handleLongPress, {
    threshold: 300,
    onStart: () => { isLongPressTriggered.current = false; },
    onFinish: handlePressRelease,
    onCancel: handlePressRelease
  });

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile && isLongPressTriggered.current) {
        e.stopPropagation();
        return;
    }

    if (isLocked || cell.isLeaf) return;
    
    if (canExpand) {
      if (navigator.vibrate && isMobile) navigator.vibrate(5);
      onNavigate([cell.id]); 
    } else {
      console.log("Leaf clicked:", cell.title);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative overflow-hidden bg-black border flex flex-col select-none",
        // 1. Default State
        "border-zinc-900",
        // 2. Hover State
        !isActive && !isLocked && isHovered && !cell.disableHover && "border-zinc-700",
        // 3. Active State
        isActive && "border-transparent cursor-default",
        // 4. Cursor Logic
        !isActive && !isLocked && canExpand && "cursor-pointer",
        // 5. Leaf nodes
        cell.isLeaf && "cursor-default"
      )}
      style={style}
      animate={{
        opacity: isLocked && !isActive ? 0 : 1,
      }}
      transition={{ 
        layout: { duration: isLocked ? expandDuration : collapseDuration, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3, delay: isLocked ? 0.9 : 0 }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
    >
      
      {/* Collapsed View Content */}
      <motion.div
        layout="position"
        className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none overflow-hidden"
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ opacity: { duration: 0.8 } }}
      >
        {/* PROVIDER WRAPPER: Synchronizes state with all children */}
        <CellContext.Provider value={{ isHovered, isLocked, isActive }}>
          <motion.div layout="position" className="flex flex-col gap-2 min-w-[200px] pointer-events-auto h-full">
            <motion.div layout="position" className="shrink-0">
              <motion.h3 
                layout="position"
                className={cn(
                  "text-zinc-100 font-bold uppercase tracking-tight",
                  isMobile ? "text-2xl" : "text-lg"
                )}
              >
                {cell.title}
              </motion.h3>
              
              {cell.subtitle && (
                <motion.p 
                  layout="position"
                  className={cn(
                      "text-zinc-500 font-mono",
                      isMobile ? "text-sm" : "text-xs"
                  )}
                >
                  {cell.subtitle}
                </motion.p>
              )}
            </motion.div>
            
            <motion.div layout="position" className="grow min-h-0 relative">
                {cell.content}
            </motion.div>
          </motion.div>
        </CellContext.Provider>
      </motion.div>

      {/* Expanded View Content */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { 
                duration: 0.8, 
                delay: isActive ? 0.2 : 0,
                ease: "easeInOut"
              }
            }}
            className="absolute inset-0 z-20 flex flex-col"
          >
            <div className="flex-1 min-h-0 overflow-hidden">
              {cell.renderExpanded ? (
                <motion.div
                  layout="preserve-aspect"
                  className="w-full h-full"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    layout: { duration: collapseDuration, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.4, ease: "easeOut" },
                  }}
                >
                  {cell.renderExpanded({
                    onClose: () => onNavigate(path.slice(0, -1)),
                    cell: cell,
                  })}
                </motion.div>
              ) : (
                <Tesseract 
                  items={cell.children || []}
                  path={path.slice(1)} 
                  onNavigate={(subPath) => onNavigate([cell.id, ...subPath])}
                  level={level + 1}
                  config={{
                    expandDuration,
                    collapseDuration,
                    columns: isMobile ? 1 : 3, // Pass down mobile column count
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Gradient */}
      {!cell.disableHover && (
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br from-zinc-800/20 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none",
            isHovered && !isLocked && "opacity-100"
          )}
        />
      )}
    </motion.div>
  );
};