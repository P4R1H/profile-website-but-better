"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData, TesseractConfig } from "@/types";
import { TesseractCell } from "./TesseractCell";

// Type-safe processed cell with internal span markers
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
  // Extract configuration with defaults
  const columns = config.columns ?? 3;
  const gap = config.gap ?? 8;
  const expandDuration = config.expandDuration ?? 1.2;
  const collapseDuration = config.collapseDuration ?? 0.8;

  // OPTIMIZATION 1: Memoize column distribution
  // Only recalculates when items or column count changes
  const distributedColumns = useMemo(() => {
    const dist: ProcessedCell[][] = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);

    items.forEach((item) => {
      const itemColSpan = Math.min(item.colSpan ?? 1, columns);
      const itemRowSpan = item.rowSpan ?? 1;

      if (itemColSpan === 1) {
        // Single column item - find shortest column
        const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
        dist[minHeightIndex].push(item);
        columnHeights[minHeightIndex] += itemRowSpan;
      } else {
        // Multi-column spanning item - find best consecutive span
        let bestStartCol = 0;
        let minSpanHeight = Infinity;

        for (let col = 0; col <= columns - itemColSpan; col++) {
          const spanHeight = Math.max(...columnHeights.slice(col, col + itemColSpan));
          if (spanHeight < minSpanHeight) {
            minSpanHeight = spanHeight;
            bestStartCol = col;
          }
        }

        // Mark item with span metadata
        const itemWithSpan: ProcessedCell = { 
          ...item, 
          _spanStart: bestStartCol, 
          _actualColSpan: itemColSpan 
        };
        dist[bestStartCol].push(itemWithSpan);
        
        // Update all spanned column heights
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
  // Prevents O(n) search on every column render
  const activeColumnIndex = useMemo(() => {
    if (!activeId) return -1;
    return distributedColumns.findIndex(col => 
      col.some(item => item.id === activeId)
    );
  }, [activeId, distributedColumns]);

  return (
    <div 
      className={cn("flex w-full h-full overflow-hidden", className)}
      style={{ gap: `${gap}px` }}
    >
      {distributedColumns.map((colItems, colIndex) => {
        // Determine if this column contains the active item
        const isColActive = colIndex === activeColumnIndex;
        const colFlex = isLocked 
          ? (isColActive ? 100 : 0.001)
          : (hoveredColIndex === colIndex ? 2 : 1);

        return (
          <motion.div
            key={colIndex}
            layout
            className="flex flex-col h-full overflow-hidden"
            onMouseEnter={() => !isLocked && setHoveredColIndex(colIndex)}
            onMouseLeave={() => !isLocked && setHoveredColIndex(null)}
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
              // OPTIMIZATION 3: Inline style calculation
              // Compute flex value based on state
              const rowMultiplier = cell.rowSpan || 1;
              const itemFlex = isLocked
                ? (cell.id === activeId ? 100 : 0.001)
                : cell.disableHover
                  ? rowMultiplier
                  : (hoveredItemId === cell.id ? 2 : 1) * rowMultiplier;
              
              // Compute width for spanning items
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
                  isHovered={hoveredItemId === cell.id}
                  level={level}
                  expandDuration={expandDuration}
                  collapseDuration={collapseDuration}
                  style={cellStyle}
                  onMouseEnter={() => !isLocked && !cell.disableHover && setHoveredItemId(cell.id)}
                  onMouseLeave={() => !isLocked && setHoveredItemId(null)}
                />
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
};