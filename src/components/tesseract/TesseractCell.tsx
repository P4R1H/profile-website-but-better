"use client";

import React, { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData, TesseractConfig } from "@/types/types";
import { Tesseract } from "./Tesseract";
import { useTesseractContext, useCellState } from "./TesseractContext";
import { useLongPress, useMobileScrubber } from "@/lib/hooks";

interface TesseractCellProps {
  cell: TesseractCellData;
  path: string[];
  onNavigate: (newPath: string[]) => void;
  level: number;
  columnIndex: number;
  columnSpan: number;
  isMultiColumn?: boolean;
  onHoverEnter: (itemId: string, columnIndex: number, disableHover?: boolean) => void;
  onHoverLeave: () => void;
  onMobileLongPress: (itemId: string, columnIndex: number) => void;
  onMobileRelease: () => void;
}

export const TesseractCell = ({
  cell,
  path,
  onNavigate,
  level,
  columnIndex,
  columnSpan,
  isMultiColumn,
  onHoverEnter,
  onHoverLeave,
  onMobileLongPress,
  onMobileRelease,
}: TesseractCellProps) => {
  const { config, isLocked, activeId, isMobile, state } = useTesseractContext();
  
  const isActive = cell.id === activeId;
  const isHovered = state.hoveredItemId === cell.id;
  const canExpand = !cell.isLeaf && (cell.renderExpanded || (cell.children && cell.children.length > 0));

  // --- REFS ---
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);    
  const progressRef = useRef<HTMLDivElement | null>(null); 

  // --- INTERACTION ---

  // 1. Standard Long Press (No Children / Desktop)
  const handleStandardLongPressStart = useCallback(() => {
    if (isLocked || cell.disableHover || !isMobile) return;
    if (navigator.vibrate) navigator.vibrate(15);
    onMobileLongPress(cell.id, columnIndex);
  }, [isLocked, cell.disableHover, cell.id, isMobile, columnIndex, onMobileLongPress]);

  const {
    onTouchStart: onStandardStart,
    onTouchEnd: onStandardEnd,
    onTouchMove: onStandardMove
  } = useLongPress(handleStandardLongPressStart, {
    threshold: 300,
    onFinish: onMobileRelease,
    onCancel: onMobileRelease
  });

  // 2. Mobile Scrubber (Children + Mobile)
  const hasChildren = cell.children && cell.children.length > 0;

  const {
    onTouchStart: onScrubStart,
    onTouchMove: onScrubMove,
    onTouchEnd: onScrubEnd
  } = useMobileScrubber({
    enabled: isMobile && !isLocked && !!hasChildren,
    items: cell.children || [],
    originalTitle: cell.title,
    onNavigate: (subPath) => onNavigate([cell.id, ...subPath]),
    textRef: titleRef,
    trackRef: trackRef,
    progressRef: progressRef,
  });

  const touchHandlers = (isMobile && hasChildren && !isLocked)
    ? { onTouchStart: onScrubStart, onTouchMove: onScrubMove, onTouchEnd: onScrubEnd }
    : { onTouchStart: onStandardStart, onTouchMove: onStandardMove, onTouchEnd: onStandardEnd };

  // --- STYLING ---
  const calculateCellFlex = useCallback(() => {
    const rowMultiplier = cell.rowSpan || 1;
    if (isLocked) return isActive ? 100 : 0.001;
    if (cell.disableHover || isMobile) return rowMultiplier;
    return (state.expandedItemId === cell.id ? 2 : 1) * rowMultiplier;
  }, [cell, isLocked, isActive, isMobile, state.expandedItemId]);

  const calculateCellStyle = useCallback((): React.CSSProperties => {
    const flex = calculateCellFlex();
    if (isMobile) {
      const height = isLocked && isActive ? "100%" : "auto";
      const minHeight = isLocked
        ? (isActive ? "100%" : "0px")
        : (isHovered && !cell.disableHover ? "360px" : "180px");

      return { flex: "none", height, minHeight };
    }
    if (isMultiColumn && columnSpan > 1) {
      const widthPercent = (100 / config.columns) * columnSpan;
      const gapAdjustment = (columnSpan - 1) * (config.gap / config.columns);
      return { flex, width: `calc(${widthPercent}% + ${gapAdjustment}px)`, minWidth: `calc(${widthPercent}% + ${gapAdjustment}px)` };
    }
    return { flex };
  }, [calculateCellFlex, isMobile, isLocked, isActive, isHovered, cell.disableHover, isMultiColumn, columnSpan, config.columns, config.gap]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isLocked || cell.isLeaf || !canExpand) return;
    if (navigator.vibrate && isMobile) navigator.vibrate(5);
    onNavigate([cell.id]);
  }, [isMobile, isLocked, cell.isLeaf, cell.id, canExpand, onNavigate]);

  const layoutTransition = {
    duration: isLocked ? config.expandDuration : config.collapseDuration,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
  };

  const opacityTransition = {
    duration: 0.3,
    delay: isLocked && !isActive ? 0.9 : 0
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative overflow-hidden bg-black border flex flex-col select-none",
        "border-zinc-900",
        !isActive && !isLocked && isHovered && !cell.disableHover && "border-zinc-700",
        isActive && "border-transparent cursor-default",
        !isActive && !isLocked && canExpand && "cursor-pointer",
        cell.isLeaf && "cursor-default"
      )}
      style={{
        ...calculateCellStyle(),
        touchAction: (isMobile && hasChildren && !isLocked) ? "none" : "auto"
      }}
      animate={{ opacity: isLocked && !isActive ? 0 : 1 }}
      transition={{ layout: layoutTransition, opacity: opacityTransition }}
      onMouseEnter={() => onHoverEnter(cell.id, columnIndex, cell.disableHover)}
      onMouseLeave={onHoverLeave}
      onClick={handleClick}
      {...(isMobile ? touchHandlers : {})}
    >
      
      {/* --- SMART RAIL --- */}
      {isMobile && hasChildren && !isLocked && (
        <div 
          ref={trackRef}
          className="absolute top-0 bottom-0 w-0.5 z-50 pointer-events-none transition-opacity duration-200 opacity-0"
        >
          {/* Static Line (Darker) */}
          <div className="absolute inset-y-0 w-full bg-zinc-800/30" />

          {/* Active Thumb (Subtle Glow) */}
          <div className="relative w-full h-full overflow-hidden">
             <div 
               ref={progressRef}
               className="absolute w-[3px] bg-zinc-500"
               style={{ 
                 left: 0, 
                 height: '20%', 
                 // FIXED: Significantly reduced glow opacity and spread
                 boxShadow: '0 0 6px 1px rgba(255, 255, 255, 0.2)'
               }} 
             />
          </div>
        </div>
      )}

      <CollapsedContent
        cell={cell}
        isActive={isActive}
        isMobile={isMobile}
        titleRef={titleRef} 
      />

      <ExpandedContent
        cell={cell}
        path={path}
        onNavigate={onNavigate}
        isActive={isActive}
        level={level}
        config={config}
        isMobile={isMobile}
      />

      {!cell.disableHover && (
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br from-zinc-800/20 to-transparent",
            "opacity-0 transition-opacity duration-300 pointer-events-none",
            isHovered && !isLocked && "opacity-100"
          )}
        />
      )}
    </motion.div>
  );
};

// --- Sub-Components ---
interface CollapsedContentProps {
  cell: TesseractCellData;
  isActive: boolean;
  isMobile: boolean;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
}

const CollapsedContent: React.FC<CollapsedContentProps> = ({ cell, isActive, isMobile, titleRef }) => {
  return (
    <motion.div
      layout="position"
      className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none overflow-hidden"
      animate={{ opacity: isActive ? 0 : 1 }}
      transition={{ opacity: { duration: 0.8 } }}
    >
      <motion.div layout="position" className="flex flex-col gap-2 min-w-[200px] pointer-events-auto h-full">
        <motion.div layout="position" className="shrink-0">
          <motion.h3
            ref={titleRef}
            layout="position"
            className={cn(
              "text-zinc-100 font-bold uppercase tracking-tight transition-all duration-200", 
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
    </motion.div>
  );
};

interface ExpandedContentProps {
  cell: TesseractCellData;
  path: string[];
  onNavigate: (newPath: string[]) => void;
  isActive: boolean;
  level: number;
  config: Required<TesseractConfig>;
  isMobile: boolean;
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({
  cell, path, onNavigate, isActive, level, config, isMobile
}) => {
  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="expanded-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ opacity: { duration: 0.8, delay: 0.2, ease: "easeInOut" } }}
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
                layout: { duration: config.collapseDuration, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.4, ease: "easeOut" },
              }}
            >
              {cell.renderExpanded({ onClose: () => onNavigate(path.slice(0, -1)), cell })}
            </motion.div>
          ) : (
            <Tesseract
              items={cell.children || []}
              path={path.slice(1)}
              onNavigate={(subPath) => onNavigate([cell.id, ...subPath])}
              level={level + 1}
              config={{ ...config, columns: isMobile ? 1 : config.columns }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export { useCellState };