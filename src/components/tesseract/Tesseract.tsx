"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData, TesseractConfig } from "@/types";
import { TesseractCell } from "./TesseractCell";

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

  // 1. Distribute items into columns
  // Enhanced distribution algorithm that respects colSpan
  const distributedColumns: TesseractCellData[][] = Array.from(
    { length: columns },
    () => []
  );

  // Track which columns are "filled" at each position
  const columnHeights = new Array(columns).fill(0);

  items.forEach((item) => {
    const itemColSpan = Math.min(item.colSpan ?? 1, columns);
    const itemRowSpan = item.rowSpan ?? 1;

    if (itemColSpan === 1) {
      // Simple case: single column item
      // Find the column with minimum height
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      distributedColumns[minHeightIndex].push(item);
      columnHeights[minHeightIndex] += itemRowSpan;
    } else {
      // Complex case: multi-column spanning item
      // Find consecutive columns that can accommodate this item
      let bestStartCol = 0;
      let minSpanHeight = Infinity;

      for (let col = 0; col <= columns - itemColSpan; col++) {
        const spanHeight = Math.max(
          ...columnHeights.slice(col, col + itemColSpan)
        );
        if (spanHeight < minSpanHeight) {
          minSpanHeight = spanHeight;
          bestStartCol = col;
        }
      }

      // Place the item in the first column of the span
      // and mark it as spanning
      const itemWithSpan = { ...item, _spanStart: bestStartCol, _actualColSpan: itemColSpan };
      distributedColumns[bestStartCol].push(itemWithSpan);
      
      // Update heights for all spanned columns
      for (let i = 0; i < itemColSpan; i++) {
        columnHeights[bestStartCol + i] = minSpanHeight + itemRowSpan;
      }
    }
  });

  // 2. Local Hover State
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // 3. Determine active expansion
  const activeId = path[0]; 
  const isLocked = !!activeId; 

  // 4. Logic Handlers
  const handleColumnEnter = (colIndex: number) => {
    if (isLocked) return;
    setHoveredColIndex(colIndex);
  };

  const handleColumnLeave = () => {
    if (isLocked) return;
    setHoveredColIndex(null);
  };

  const handleItemEnter = (itemId: string, item: TesseractCellData) => {
    if (isLocked || item.disableHover) return;
    setHoveredItemId(itemId);
  };

  const handleItemLeave = () => {
    if (isLocked) return;
    setHoveredItemId(null);
  };

  // 5. Flex Calculation Helpers
  const getColumnFlex = (colIndex: number) => {
    if (isLocked) {
      const hasActive = distributedColumns[colIndex].some((i) => i.id === activeId);
      return hasActive ? 100 : 0.001;
    }
    return hoveredColIndex === colIndex ? 2 : 1;
  };

  const getItemFlex = (item: TesseractCellData & { _spanStart?: number; _actualColSpan?: number }) => {
    const rowMultiplier = item.rowSpan || 1;
    const colMultiplier = item._actualColSpan || item.colSpan || 1;
    
    if (isLocked) {
      return item.id === activeId ? 100 : 0.001;
    }
    
    if (item.disableHover) {
      return rowMultiplier * colMultiplier; 
    }
    
    const baseFlexGrow = hoveredItemId === item.id ? 2 : 1;
    return baseFlexGrow * rowMultiplier;
  };

  // Calculate the width for spanning items
  const getItemWidth = (item: TesseractCellData & { _actualColSpan?: number }) => {
    const span = item._actualColSpan || item.colSpan || 1;
    if (span === 1) return undefined;
    
    // Calculate percentage based on column span
    // Account for gaps between columns
    const colWidth = 100 / columns;
    const totalGaps = (span - 1) * (gap / columns);
    return `calc(${colWidth * span}% + ${totalGaps}px)`;
  };

  return (
    <div 
      className={cn("flex w-full h-full overflow-hidden", className)}
      style={{ gap: `${gap}px` }}
    >
      {distributedColumns.map((colItems, colIndex) => (
        <motion.div
          key={colIndex}
          layout
          className="flex flex-col h-full overflow-hidden"
          onMouseEnter={() => handleColumnEnter(colIndex)}
          onMouseLeave={handleColumnLeave}
          style={{
            flex: getColumnFlex(colIndex),
            gap: `${gap}px`,
            willChange: "flex", 
          }}
          animate={{
            opacity: isLocked && !distributedColumns[colIndex].some((i) => i.id === activeId) ? 0 : 1,
          }}
          transition={{ 
            layout: { duration: isLocked ? expandDuration : collapseDuration, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3, delay: isLocked ? 0.9 : 0 }
          }}
        >
          {colItems.map((cell) => {
            const cellWithSpan = cell as TesseractCellData & { _spanStart?: number; _actualColSpan?: number };
            
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
                style={{ 
                  flex: getItemFlex(cellWithSpan),
                  width: getItemWidth(cellWithSpan),
                  minWidth: getItemWidth(cellWithSpan),
                }}
                onMouseEnter={() => handleItemEnter(cell.id, cell)}
                onMouseLeave={handleItemLeave}
              />
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};