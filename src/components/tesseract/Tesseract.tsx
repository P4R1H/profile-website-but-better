"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  TesseractCellData, 
  TesseractConfig,
  TesseractState,
  ColumnDistribution 
} from "@/types/types";
import { TesseractCell } from "./TesseractCell";
import { TesseractProvider } from "./TesseractContext";

interface TesseractProps {
  items: TesseractCellData[];
  path: string[];
  onNavigate: (newPath: string[]) => void;
  level?: number;
  className?: string;
  config?: TesseractConfig;
}

/**
 * Calculate column distribution without mutating original items
 */
function distributeItemsToColumns(
  items: TesseractCellData[], 
  columns: number,
  isMobile: boolean
): ColumnDistribution {
  const distribution: Map<number, TesseractCellData[]> = new Map();
  const columnHeights = new Array(columns).fill(0);
  const itemPositions = new Map<string, { column: number; span: number }>();

  // Initialize columns
  for (let i = 0; i < columns; i++) {
    distribution.set(i, []);
  }

  // Filter items based on mobile visibility
  const visibleItems = items.filter(item => !isMobile || !item.hideOnMobile);

  visibleItems.forEach((item) => {
    const itemColSpan = Math.min(item.colSpan ?? 1, columns);
    const itemRowSpan = item.rowSpan ?? 1;

    if (itemColSpan === 1) {
      // Single column item - place in shortest column
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      distribution.get(minHeightIndex)!.push(item);
      columnHeights[minHeightIndex] += itemRowSpan;
      itemPositions.set(item.id, { column: minHeightIndex, span: 1 });
    } else {
      // Multi-column item - find best position
      let bestStartCol = 0;
      let minSpanHeight = Infinity;

      for (let col = 0; col <= columns - itemColSpan; col++) {
        const spanHeight = Math.max(...columnHeights.slice(col, col + itemColSpan));
        if (spanHeight < minSpanHeight) {
          minSpanHeight = spanHeight;
          bestStartCol = col;
        }
      }

      distribution.get(bestStartCol)!.push(item);
      itemPositions.set(item.id, { column: bestStartCol, span: itemColSpan });

      // Update heights for all spanned columns
      for (let i = 0; i < itemColSpan; i++) {
        columnHeights[bestStartCol + i] = minSpanHeight + itemRowSpan;
      }
    }
  });

  return { distribution, positions: itemPositions };
}

export const Tesseract = ({
  items,
  path,
  onNavigate,
  level = 0,
  className,
  config = {},
}: TesseractProps) => {
  // Configuration with defaults
  const gridConfig: Required<TesseractConfig> = {
    columns: config.columns ?? 3,
    gap: config.gap ?? 8,
    expandDuration: config.expandDuration ?? 1.2,
    collapseDuration: config.collapseDuration ?? 0.8,
  };

  const isMobile = gridConfig.columns === 1;
  const activeId = path[0];
  const isLocked = !!activeId;

  // Unified interaction state
  const [interactionState, setInteractionState] = useState<TesseractState>({
    hoveredItemId: null,
    hoveredColumnIndex: null,
    expandedItemId: null,
    expandedColumnIndex: null,
  });

  // Cleanup timer for hover states
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Column distribution calculation
  const { distribution, positions } = useMemo(
    () => distributeItemsToColumns(items, gridConfig.columns, isMobile),
    [items, gridConfig.columns, isMobile]
  );

  // Find active column index
  const activeColumnIndex = useMemo(() => {
    if (!activeId || !positions.has(activeId)) return -1;
    return positions.get(activeId)!.column;
  }, [activeId, positions]);

  // Column refs for scroll control
  const columnRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Handle hover enter
  const handleItemHoverEnter = useCallback((itemId: string, columnIndex: number, disableHover?: boolean) => {
    if (isLocked || isMobile) return;

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (disableHover) {
      setInteractionState({
        hoveredItemId: null,
        hoveredColumnIndex: null,
        expandedItemId: null,
        expandedColumnIndex: null,
      });
    } else {
      setInteractionState({
        hoveredItemId: itemId,
        hoveredColumnIndex: columnIndex,
        expandedItemId: itemId,
        expandedColumnIndex: columnIndex,
      });
    }
  }, [isLocked, isMobile]);

  // Handle hover leave
  const handleItemHoverLeave = useCallback(() => {
    if (isLocked || isMobile) return;

    setInteractionState(prev => ({
      ...prev,
      hoveredItemId: null,
      hoveredColumnIndex: null,
    }));

    hoverTimerRef.current = setTimeout(() => {
      setInteractionState({
        hoveredItemId: null,
        hoveredColumnIndex: null,
        expandedItemId: null,
        expandedColumnIndex: null,
      });
    }, 10);
  }, [isLocked, isMobile]);

  // Handle mobile long press
  const handleMobileLongPress = useCallback((itemId: string, columnIndex: number) => {
    if (!isMobile || isLocked) return;
    
    setInteractionState({
      hoveredItemId: itemId,
      hoveredColumnIndex: columnIndex,
      expandedItemId: itemId,
      expandedColumnIndex: columnIndex,
    });
  }, [isMobile, isLocked]);

  // Handle mobile release
  const handleMobileRelease = useCallback(() => {
    if (!isMobile) return;
    
    setInteractionState({
      hoveredItemId: null,
      hoveredColumnIndex: null,
      expandedItemId: null,
      expandedColumnIndex: null,
    });
  }, [isMobile]);

  // Reset scroll when locking
  useEffect(() => {
    if (isLocked && activeColumnIndex !== -1) {
      const activeCol = columnRefs.current.get(activeColumnIndex);
      if (activeCol) {
        activeCol.scrollTop = 0;
      }
    }
  }, [isLocked, activeColumnIndex]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  return (
    <TesseractProvider 
      config={gridConfig}
      state={interactionState}
      isLocked={isLocked}
      activeId={activeId}
      isMobile={isMobile}
    >
      <div
        className={cn(
          "flex w-full h-full relative overflow-hidden",
          className
        )}
        style={{ gap: `${gridConfig.gap}px` }}
      >
        {/* Mobile Scroll Gradients */}
        {isMobile && !isLocked && (
          <>
            <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-black to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-black to-transparent z-20 pointer-events-none" />
          </>
        )}

        {/* Render Columns */}
        {Array.from(distribution.entries()).map(([columnIndex, columnItems]) => {
          const isActiveColumn = columnIndex === activeColumnIndex;
          const isExpandedColumn = interactionState.expandedColumnIndex === columnIndex;
          
          const columnFlex = isLocked
            ? (isActiveColumn ? 100 : 0.001)
            : (isExpandedColumn ? 2 : 1);

          return (
            <motion.div
              key={columnIndex}
              ref={(el) => {
                if (el) columnRefs.current.set(columnIndex, el);
                else columnRefs.current.delete(columnIndex);
              }}
              layout
              className={cn(
                "flex flex-col",
                isMobile
                  ? (isLocked ? "h-full overflow-hidden" : "h-full overflow-y-auto scrollbar-none pb-20 pt-1")
                  : "h-full overflow-hidden"
              )}
              style={{
                flex: columnFlex,
                gap: isLocked ? 0 : `${gridConfig.gap}px`,
              }}
              animate={{
                opacity: isLocked && !isActiveColumn ? 0 : 1,
              }}
              transition={{
                layout: {
                  duration: isLocked ? gridConfig.expandDuration : gridConfig.collapseDuration,
                  ease: [0.22, 1, 0.36, 1]
                },
                opacity: { 
                  duration: 0.3, 
                  delay: isLocked && !isActiveColumn ? 0.9 : 0 
                }
              }}
            >
              {columnItems.map((cell) => {
                const position = positions.get(cell.id);
                const isMultiColumn = position && position.span > 1;

                return (
                  <TesseractCell
                    key={cell.id}
                    cell={cell}
                    path={path}
                    onNavigate={onNavigate}
                    level={level}
                    columnIndex={columnIndex}
                    columnSpan={position?.span ?? 1}
                    isMultiColumn={isMultiColumn}
                    onHoverEnter={handleItemHoverEnter}
                    onHoverLeave={handleItemHoverLeave}
                    onMobileLongPress={handleMobileLongPress}
                    onMobileRelease={handleMobileRelease}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </TesseractProvider>
  );
};