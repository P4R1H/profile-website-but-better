"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  className?: string;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  title?: string;
  subtitle?: string;
}

export const BentoCard = ({
  className,
  children,
  colSpan = 1,
  rowSpan = 1,
  title,
  subtitle,
}: BentoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate spans based on hover state
  // For MVP: If 1x1, expand to 2x2. If already big, stay big.
  const isSmall = colSpan === 1 && rowSpan === 1;
  
  // Dynamic classes for spans
  const spanClasses = {
    col: isHovered && isSmall ? "md:col-span-2" : `md:col-span-${colSpan}`,
    row: isHovered && isSmall ? "md:row-span-2" : `md:row-span-${rowSpan}`,
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden bg-black border border-zinc-900 p-6 flex flex-col justify-between",
        // Spans
        spanClasses.col,
        spanClasses.row,
        // Hover effects
        "hover:border-zinc-700 hover:z-10",
        className
      )}
      transition={{
        layout: { duration: 0.2, type: "spring", stiffness: 300, damping: 30 },
      }}
    >
      <div className="z-10 flex flex-col gap-2">
        {title && (
          <h3 className="text-zinc-100 font-bold uppercase tracking-tight text-lg">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-zinc-500 font-mono text-xs uppercase">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      
      {/* Background Gradient on Hover */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br from-zinc-800/20 to-transparent opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}
      />
    </motion.div>
  );
};
