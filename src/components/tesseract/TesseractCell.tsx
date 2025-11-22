"use client";

import React, { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData, TesseractConfig } from "@/types/types";
import { Tesseract } from "./Tesseract";
import { useTesseractContext, useCellState } from "./TesseractContext";
import { useLongPress } from "@/lib/hooks";

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
  const cellState = useCellState(cell.id);
  
  const isActive = cell.id === activeId;
  const isHovered = state.hoveredItemId === cell.id;
  const canExpand = !cell.isLeaf && (cell.renderExpanded || (cell.children && cell.children.length > 0));
  
  const longPressTriggered = useRef(false);

  // Calculate cell flex based on state
  const calculateCellFlex = useCallback(() => {
    const rowMultiplier = cell.rowSpan || 1;
    
    if (isLocked) {
      return isActive ? 100 : 0.001;
    }
    
    if (cell.disableHover || isMobile) {
      return rowMultiplier;
    }
    
    return (state.expandedItemId === cell.id ? 2 : 1) * rowMultiplier;
  }, [cell, isLocked, isActive, isMobile, state.expandedItemId]);

  // Calculate cell style for spanning
  const calculateCellStyle = useCallback((): React.CSSProperties => {
    const flex = calculateCellFlex();
    
    if (isMobile) {
      const height = isLocked && isActive ? "100%" : "auto";
      const minHeight = isLocked 
        ? (isActive ? "100%" : "0px") 
        : (isHovered && !cell.disableHover ? "360px" : "180px");
      
      return {
        flex: "none",
        height,
        minHeight,
      };
    }
    
    if (isMultiColumn && columnSpan > 1) {
      const widthPercent = (100 / config.columns) * columnSpan;
      const gapAdjustment = (columnSpan - 1) * (config.gap / config.columns);
      
      return {
        flex,
        width: `calc(${widthPercent}% + ${gapAdjustment}px)`,
        minWidth: `calc(${widthPercent}% + ${gapAdjustment}px)`,
      };
    }
    
    return { flex };
  }, [calculateCellFlex, isMobile, isLocked, isActive, isHovered, cell.disableHover, 
      isMultiColumn, columnSpan, config.columns, config.gap]);

  // Handle click interaction
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isMobile && longPressTriggered.current) {
      e.stopPropagation();
      longPressTriggered.current = false;
      return;
    }

    if (isLocked || cell.isLeaf || !canExpand) return;
    
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(5);
    }
    
    onNavigate([cell.id]);
  }, [isMobile, isLocked, cell.isLeaf, cell.id, canExpand, onNavigate]);

  // Long press handlers for mobile
  const handleLongPressStart = useCallback(() => {
    if (isLocked || cell.disableHover || !isMobile) return;
    
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    
    longPressTriggered.current = true;
    onMobileLongPress(cell.id, columnIndex);
  }, [isLocked, cell.disableHover, cell.id, isMobile, columnIndex, onMobileLongPress]);

  const handleLongPressEnd = useCallback(() => {
    if (isMobile && longPressTriggered.current) {
      onMobileRelease();
    }
  }, [isMobile, onMobileRelease]);

  const { onTouchStart, onTouchEnd, onTouchMove } = useLongPress(handleLongPressStart, {
    threshold: 300,
    onStart: () => { longPressTriggered.current = false; },
    onFinish: handleLongPressEnd,
    onCancel: handleLongPressEnd
  });

  // Animation transitions
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
      style={calculateCellStyle()}
      animate={{
        opacity: isLocked && !isActive ? 0 : 1,
      }}
      transition={{ 
        layout: layoutTransition,
        opacity: opacityTransition
      }}
      onMouseEnter={() => onHoverEnter(cell.id, columnIndex, cell.disableHover)}
      onMouseLeave={onHoverLeave}
      onClick={handleClick}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
    >
      {/* Collapsed Content Layer */}
      <CollapsedContent 
        cell={cell}
        isActive={isActive}
        isMobile={isMobile}
      />

      {/* Expanded Content Layer */}
      <ExpandedContent
        cell={cell}
        path={path}
        onNavigate={onNavigate}
        isActive={isActive}
        level={level}
        config={config}
        isMobile={isMobile}
      />

      {/* Hover Overlay */}
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

// Collapsed content component
interface CollapsedContentProps {
  cell: TesseractCellData;
  isActive: boolean;
  isMobile: boolean;
}

const CollapsedContent: React.FC<CollapsedContentProps> = ({ cell, isActive, isMobile }) => {
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
    </motion.div>
  );
};

// Expanded content component
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
  cell, 
  path, 
  onNavigate, 
  isActive, 
  level, 
  config,
  isMobile 
}) => {
  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="expanded-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { 
            duration: 0.8, 
            delay: 0.2,
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
                layout: { 
                  duration: config.collapseDuration, 
                  ease: [0.22, 1, 0.36, 1] 
                },
                scale: { 
                  duration: 0.4, 
                  ease: "easeOut" 
                },
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
                ...config,
                columns: isMobile ? 1 : config.columns,
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Export the useCellState hook for external use
export { useCellState };