"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData, TesseractConfig } from "@/types";
import { TesseractCell } from "./TesseractCell";
import { useMobileDetection } from "@/hooks/useMobileDetection";

type ProcessedCell = TesseractCellData & {
  _spanStart?: number;
  _actualColSpan?: number;
};

interface TesseractProps {
  items: TesseractCellData[];
  path: string[]; 
  onNavigate: (newPath: string[]) => void;
  level?: number; 
  className?: string;
  config?: TesseractConfig;
}

export const Tesseract = ({
  items,
  path,
  onNavigate,
  level = 0,
  className,
  config = {},
}: TesseractProps) => {
  // Mobile detection
  const { isMobile } = useMobileDetection();

  // Extract configuration with mobile-aware defaults
  const columns = isMobile
    ? (config.mobile?.columns ?? 1)
    : (config.columns ?? 3);
  const gap = isMobile
    ? (config.mobile?.gap ?? 12)
    : (config.gap ?? 8);
  const expandDuration = config.expandDuration ?? 1.2;
  const collapseDuration = config.collapseDuration ?? 0.8;

  // Mobile-specific configuration
  const mobileHorizontalPadding = config.mobile?.horizontalPadding ?? 16;

  // OPTIMIZATION 1: Memoize column distribution
  const distributedColumns = useMemo(() => {
    const dist: ProcessedCell[][] = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);

    items.forEach((item) => {
      const itemColSpan = Math.min(item.colSpan ?? 1, columns);
      const itemRowSpan = item.rowSpan ?? 1;

      if (itemColSpan === 1) {
        const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
        dist[minHeightIndex].push(item);
        columnHeights[minHeightIndex] += itemRowSpan;
      } else {
        let bestStartCol = 0;
        let minSpanHeight = Infinity;

        for (let col = 0; col <= columns - itemColSpan; col++) {
          const spanHeight = Math.max(...columnHeights.slice(col, col + itemColSpan));
          if (spanHeight < minSpanHeight) {
            minSpanHeight = spanHeight;
            bestStartCol = col;
          }
        }

        const itemWithSpan: ProcessedCell = { 
          ...item, 
          _spanStart: bestStartCol, 
          _actualColSpan: itemColSpan 
        };
        dist[bestStartCol].push(itemWithSpan);
        
        for (let i = 0; i < itemColSpan; i++) {
          columnHeights[bestStartCol + i] = minSpanHeight + itemRowSpan;
        }
      }
    });

    return dist;
  }, [items, columns]);

  // Local hover state
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Expansion state
  const activeId = path[0]; 
  const isLocked = !!activeId;

  // OPTIMIZATION 2: Pre-compute which column contains the active item
  const activeColumnIndex = useMemo(() => {
    if (!activeId) return -1;
    return distributedColumns.findIndex(col => 
      col.some(item => item.id === activeId)
    );
  }, [activeId, distributedColumns]);

  return (
    <div
      className={cn(
        "flex w-full h-full overflow-hidden",
        isMobile && "flex-col",
        className
      )}
      style={{
        gap: `${gap}px`,
        ...(isMobile && {
          paddingLeft: `${mobileHorizontalPadding}px`,
          paddingRight: `${mobileHorizontalPadding}px`,
        })
      }}
    >
      {distributedColumns.map((colItems, colIndex) => {
        const isColActive = colIndex === activeColumnIndex;
        const colFlex = isLocked 
          ? (isColActive ? 100 : 0.001)
          : (hoveredColIndex === colIndex ? 2 : 1);

        return (
          <motion.div
            key={colIndex}
            layout
            className={cn(
              "flex flex-col overflow-hidden",
              isMobile ? "w-full" : "h-full"
            )}
            onMouseLeave={() => !isMobile && !isLocked && setHoveredColIndex(null)}
            style={{
              flex: colFlex,
              gap: `${gap}px`,
              willChange: "flex",
            }}
            animate={{
              opacity: isLocked && !isColActive ? 0 : 1,
            }}
            transition={{ 
              layout: { 
                duration: isLocked ? expandDuration : collapseDuration, 
                ease: [0.22, 1, 0.36, 1] 
              },
              opacity: { duration: 0.3, delay: isLocked ? 0.9 : 0 }
            }}
          >
            {colItems.map((cell) => {
              const rowMultiplier = cell.rowSpan || 1;
              const itemFlex = isLocked
                ? (cell.id === activeId ? 100 : 0.001)
                : cell.disableHover
                  ? rowMultiplier
                  : (hoveredItemId === cell.id ? 2 : 1) * rowMultiplier;
              
              const span = cell._actualColSpan || cell.colSpan || 1;
              const cellStyle = span > 1
                ? {
                    flex: itemFlex,
                    width: `calc(${(100 / columns) * span}% + ${(span - 1) * (gap / columns)}px)`,
                    minWidth: `calc(${(100 / columns) * span}% + ${(span - 1) * (gap / columns)}px)`,
                  }
                : { flex: itemFlex };
              
              return (
                <TesseractCell
                  key={cell.id}
                  cell={cell}
                  path={path}
                  onNavigate={onNavigate}
                  activeId={activeId}
                  isLocked={isLocked}
                  isHovered={!isMobile && hoveredItemId === cell.id}
                  isMobile={isMobile}
                  level={level}
                  expandDuration={expandDuration}
                  collapseDuration={collapseDuration}
                  style={cellStyle}
                  onMouseEnter={() => {
                    if (isMobile || isLocked) return;

                    if (cell.disableHover) {
                        setHoveredColIndex(null);
                        setHoveredItemId(null);
                    } else {
                        setHoveredColIndex(colIndex);
                        setHoveredItemId(cell.id);
                    }
                  }}
                  onMouseLeave={() => !isMobile && !isLocked && setHoveredItemId(null)}
                />
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
};