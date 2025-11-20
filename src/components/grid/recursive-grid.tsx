"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Types ---
export interface BentoItem {
  id: string;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  children?: BentoItem[];
  colSpan?: number;
  rowSpan?: number;
  themeColor?: string; 
}

interface RecursiveGridProps {
  items: BentoItem[];
  path: string[]; 
  onNavigate: (newPath: string[]) => void;
  level?: number; 
  className?: string;
}

export const RecursiveGrid = ({
  items,
  path,
  onNavigate,
  level = 0,
  className,
}: RecursiveGridProps) => {
  // 1. Distribute items into 3 columns
  const columns = [[], [], []] as BentoItem[][];
  items.forEach((item, i) => {
    columns[i % 3].push(item);
  });

  // 2. Local Hover State
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // 3. Determine active expansion
  const activeId = path[0]; 
  const isLocked = !!activeId; 

  // 4. Event Handlers
  const handleColumnEnter = (colIndex: number) => {
    if (isLocked) return;
    setHoveredColIndex(colIndex);
  };

  const handleColumnLeave = () => {
    if (isLocked) return;
    setHoveredColIndex(null);
  };

  const handleItemEnter = (itemId: string) => {
    if (isLocked) return;
    setHoveredItemId(itemId);
  };

  const handleItemLeave = () => {
    if (isLocked) return;
    setHoveredItemId(null);
  };

  const handleClick = (item: BentoItem) => {
    if (isLocked) return; 
    if (item.children && item.children.length > 0) {
      onNavigate([item.id]); 
    } else {
      console.log("Leaf clicked:", item.title);
    }
  };

  // 5. Helper for Flex Values
  const getColumnFlex = (colIndex: number) => {
    if (isLocked) {
      const hasActive = columns[colIndex].some((i) => i.id === activeId);
      return hasActive ? 100 : 0.001;
    }
    return hoveredColIndex === colIndex ? 2 : 1;
  };

  const getItemFlex = (item: BentoItem) => {
    if (isLocked) {
      return item.id === activeId ? 100 : 0.001;
    }
    return hoveredItemId === item.id ? 2 : 1;
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
          {colItems.map((item) => {
            const isActive = item.id === activeId;
            const isHovered = hoveredItemId === item.id; // Check state for styling
            
            return (
              <motion.div
                layout
                key={item.id}
                className={cn(
                  "relative overflow-hidden bg-black border flex flex-col",
                  // 1. Default State
                  "border-zinc-900",
                  // 2. Hover State (Driven by REACT STATE, not CSS :hover)
                  !isActive && !isLocked && isHovered && "border-zinc-700",
                  // 3. Active State
                  isActive && "border-transparent cursor-default",
                  // 4. Cursor Logic
                  !isActive && !isLocked && "cursor-pointer"
                )}
                style={{
                  flex: getItemFlex(item),
                }}
                animate={{
                  opacity: isLocked && !isActive ? 0 : 1,
                }}
                transition={{ 
                  layout: { duration: isLocked ? 1.2 : 0.8, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.3, delay: isLocked ? 0.9 : 0 }
                }}
                onMouseEnter={() => handleItemEnter(item.id)}
                onMouseLeave={handleItemLeave}
                onClick={() => handleClick(item)}
              >
                
                {/* Collapsed View Content */}
                <motion.div
                  layout="position"
                  className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none overflow-hidden"
                  animate={{ 
                    opacity: isActive ? 0 : 1,
                  }}
                  transition={{ 
                    opacity: { duration: 0.8 }
                  }}
                >
                  <motion.div 
                    layout="position" 
                    className="flex flex-col gap-2 min-w-[200px]"
                  >
                    <motion.h3 
                      layout="position"
                      className="text-zinc-100 font-bold uppercase tracking-tight text-lg"
                    >
                      {item.title}
                    </motion.h3>
                    
                    {item.subtitle && (
                      <motion.p 
                        layout="position"
                        className="text-zinc-500 font-mono text-xs uppercase"
                      >
                        {item.subtitle}
                      </motion.p>
                    )}
                    
                    <motion.div layout="position">
                        {item.content}
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Expanded View Content */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.2 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      className="absolute inset-0 z-20 flex flex-col"
                    >
                      <div className="flex-1 min-h-0">
                         <RecursiveGrid 
                            items={item.children || []}
                            path={path.slice(1)} 
                            onNavigate={(subPath) => onNavigate([item.id, ...subPath])}
                            level={level + 1}
                         />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover Gradient */}
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br from-zinc-800/20 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none",
                    isHovered && !isLocked && "opacity-100"
                  )}
                />
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};