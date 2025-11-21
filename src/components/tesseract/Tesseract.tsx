"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData, TesseractConfig } from "@/types";
import { TesseractCell } from "./TesseractCell";

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

  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isLocked && activeColumnIndex !== -1) {
      const activeCol = columnRefs.current[activeColumnIndex];
      if (activeCol) {
        activeCol.scrollTop = 0;
      }
    }
  }, [isLocked, activeColumnIndex]);

  const isMobile = columns === 1;

  return (
    <div
      className={cn("flex w-full h-full relative", isMobile ? "overflow-hidden" : "overflow-hidden", className)}
      style={{ gap: `${gap}px` }}
    >
      {/* Mobile Scroll Gradients */}
      {isMobile && !isLocked && (
        <>
          <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-black to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-black to-transparent z-20 pointer-events-none" />
        </>
      )}

      {distributedColumns.map((colItems, colIndex) => {
        const isColActive = colIndex === activeColumnIndex;
        const colFlex = isLocked
          ? (isColActive ? 100 : 0.001)
          : (hoveredColIndex === colIndex ? 2 : 1);

        return (
          <motion.div
            key={colIndex}
            ref={(el) => { columnRefs.current[colIndex] = el; }}
            layout
            className={cn(
              "flex flex-col",
              // Mobile: Allow scrolling, hide scrollbar. Desktop: Hidden overflow
              isMobile
                ? (isLocked ? "h-full overflow-hidden" : "h-full overflow-y-auto no-scrollbar pb-20 pt-1")
                : "h-full overflow-hidden"
            )}
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
              const rowMultiplier = cell.rowSpan || 1;
              // On mobile, we don't want flex expansion for hover, just fixed height or auto
              // But to keep animations consistent, we can keep flex logic but adjust values

              const itemFlex = isLocked
                ? (cell.id === activeId ? 100 : 0.001)
                : cell.disableHover
                  ? rowMultiplier
                  : (hoveredItemId === cell.id && !isMobile ? 2 : 1) * rowMultiplier;

              // On mobile, items should have a minimum height to be visible
              const mobileHeight = isLocked && cell.id === activeId ? "100%" : "auto";
              const mobileMinHeight = isLocked ? (cell.id === activeId ? "100%" : "0px") : "180px";

              const span = cell._actualColSpan || cell.colSpan || 1;
              const cellStyle = span > 1 && !isMobile
                ? {
                  flex: itemFlex,
                  width: `calc(${(100 / columns) * span}% + ${(span - 1) * (gap / columns)}px)`,
                  minWidth: `calc(${(100 / columns) * span}% + ${(span - 1) * (gap / columns)}px)`,
                }
                : {
                  flex: isMobile ? "none" : itemFlex,
                  height: isMobile ? mobileHeight : "auto",
                  minHeight: isMobile ? mobileMinHeight : "auto"
                };

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
                  onMouseEnter={() => {
                    if (isLocked || isMobile) return; // Disable hover on mobile

                    if (cell.disableHover) {
                      setHoveredColIndex(null);
                      setHoveredItemId(null);
                    } else {
                      setHoveredColIndex(colIndex);
                      setHoveredItemId(cell.id);
                    }
                  }}
                  onMouseLeave={() => !isLocked && !isMobile && setHoveredItemId(null)}
                  // Pass handlers for mobile interaction
                  setHoveredItemId={setHoveredItemId}
                  setHoveredColIndex={setHoveredColIndex}
                  colIndex={colIndex}
                  isMobile={isMobile}
                />
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
};