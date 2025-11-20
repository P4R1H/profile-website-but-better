"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TesseractCellData } from "@/types";
import { TesseractCell } from "./TesseractCell";

interface TesseractProps {
  items: TesseractCellData[];
  path: string[]; 
  onNavigate: (newPath: string[]) => void;
  level?: number; 
  className?: string;
}

export const Tesseract = ({
  items,
  path,
  onNavigate,
  level = 0,
  className,
}: TesseractProps) => {
  // 1. Distribute items into 3 columns
  const columns = [[], [], []] as TesseractCellData[][];
  items.forEach((item, i) => {
    columns[i % 3].push(item);
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
      const hasActive = columns[colIndex].some((i) => i.id === activeId);
      return hasActive ? 100 : 0.001;
    }
    return hoveredColIndex === colIndex ? 2 : 1;
  };

  const getItemFlex = (item: TesseractCellData) => {
    const rowMultiplier = item.rowSpan || 1;
    
    if (isLocked) {
      return item.id === activeId ? 100 : 0.001;
    }
    
    if (item.disableHover) {
      return rowMultiplier; 
    }
    
    const baseFlexGrow = hoveredItemId === item.id ? 2 : 1;
    return baseFlexGrow * rowMultiplier;
  };

  return (
    <div className={cn("flex w-full h-full gap-2 overflow-hidden", className)}>
      {columns.map((colItems, colIndex) => (
        <motion.div
          key={colIndex}
          layout
          className="flex flex-col gap-2 h-full overflow-hidden"
          onMouseEnter={() => handleColumnEnter(colIndex)}
          onMouseLeave={handleColumnLeave}
          style={{
            flex: getColumnFlex(colIndex),
            willChange: "flex", 
          }}
          animate={{
            opacity: isLocked && !columns[colIndex].some((i) => i.id === activeId) ? 0 : 1,
          }}
          transition={{ 
            layout: { duration: isLocked ? 1.2 : 0.8, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3, delay: isLocked ? 0.9 : 0 }
          }}
        >
          {colItems.map((cell) => (
            <TesseractCell
              key={cell.id}
              cell={cell}
              path={path}
              onNavigate={onNavigate}
              activeId={activeId}
              isLocked={isLocked}
              isHovered={hoveredItemId === cell.id}
              level={level}
              style={{ flex: getItemFlex(cell) }}
              onMouseEnter={() => handleItemEnter(cell.id, cell)}
              onMouseLeave={handleItemLeave}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};