"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BentoItem } from "./grid/recursive-grid";

interface BreadcrumbProps {
  path: string[];
  rootItems: BentoItem[];
  onNavigate: (path: string[]) => void;
  className?: string;
}

export const Breadcrumb = ({ path, rootItems, onNavigate, className }: BreadcrumbProps) => {
  // Helper to find item title by ID
  const findItem = (items: BentoItem[], id: string): BentoItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

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
      {path.map((id, index) => {
        const item = findItem(rootItems, id);
        const isLast = index === path.length - 1;
        // The path to this segment is the slice up to this index + 1
        const segmentPath = path.slice(0, index + 1);

        return (
          <React.Fragment key={id}>
            <span className="text-zinc-700">/</span>
            <button
              onClick={() => onNavigate(segmentPath)}
              className={cn(
                "hover:text-white transition-colors",
                isLast ? "text-white font-bold" : "text-zinc-500"
              )}
            >
              {item?.title || id}
            </button>
          </React.Fragment>
        );
      })}

      {/* Back Button (only if deep) */}
      {path.length > 0 && (
        <>
          <span className="text-zinc-700 mx-2">|</span>
          <button
            onClick={() => onNavigate(path.slice(0, -1))}
            className="text-zinc-500 hover:text-red-400 transition-colors"
          >
            [BACK]
          </button>
        </>
      )}
    </div>
  );
};
