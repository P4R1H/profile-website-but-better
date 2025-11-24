"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { TesseractCellData } from "@/types/types"; // Importing from your new types file

interface BreadcrumbProps {
  path: string[];
  rootItems: TesseractCellData[];
  onNavigate: (path: string[]) => void;
  className?: string;
}

export const Breadcrumb = ({ 
  path, 
  rootItems, 
  onNavigate, 
  className 
}: BreadcrumbProps) => {
  
  // Optimized: Resolve the full object chain based on the path
  // This is much faster than searching the whole tree for every segment
  const breadcrumbItems = useMemo(() => {
    let currentLevel = rootItems;
    
    return path.map((id) => {
      const item = currentLevel.find((n) => n.id === id);
      
      // If we found the item, update the scope to search its children next
      if (item?.children) {
        currentLevel = item.children;
      }
      
      return { id, title: item?.title || id, original: item };
    });
  }, [path, rootItems]);

  return (
    <div className={cn("flex items-center gap-2 text-sm font-mono uppercase", className)}>
      {/* Root Node */}
      <button
        onClick={() => onNavigate([])}
        className={cn(
          "hover:text-white transition-colors",
          path.length === 0 ? "text-white font-bold" : "text-zinc-500"
        )}
      >
        ~root
      </button>
      {/* Path Segments */}
      {breadcrumbItems.map((crumb, index) => {
        const isLast = index === path.length - 1;
        // The path to this segment is the slice up to this index + 1
        const segmentPath = path.slice(0, index + 1);

        return (
          <React.Fragment key={crumb.id}>
            <span className="text-zinc-700 select-none">/</span>
            <button
              onClick={() => onNavigate(segmentPath)}
              className={cn(
                "hover:text-white transition-colors truncate max-w-[150px]",
                isLast ? "text-white font-bold cursor-default" : "text-zinc-500"
              )}
              disabled={isLast} // Disable clicking the active item
            >
              {crumb.title}
            </button>
          </React.Fragment>
        );
      })}

      {/* Back Button (Visual Helper) */}
      {path.length > 0 && (
        <>
          <span className="text-zinc-700 mx-2 select-none">|</span>
          <button
            onClick={() => onNavigate(path.slice(0, -1))}
            className="text-xs text-zinc-600 hover:text-red-400 transition-colors flex items-center gap-1"
            aria-label="Go back"
          >
            <span>[BACK]</span>
          </button>
        </>
      )}
    </div>
  );
};