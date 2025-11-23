"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCellState } from "@/components/tesseract";
import { useState, useEffect } from "react";

const CATEGORIES = ["CTFs", "Open Source", "Research", "Hackathons", "Certifications"];

export const WinsPreview = () => {
  const { isHovered, isLocked } = useCellState("wins");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isHovered || isLocked) return;
    
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % CATEGORIES.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isHovered, isLocked]);

  return (
    <div className="w-full h-full relative pointer-events-none overflow-hidden">
      {!isLocked && (
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 0.2 : 0,
          }}
          transition={{ 
            duration: isHovered ? 0.4 : 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute bottom-3 right-3 flex items-center gap-3"
        >
          {/* Cycling text */}
          <div className="text-zinc-500 text-xs font-mono tracking-wider">
            <AnimatePresence mode="wait">
              <motion.span
                key={CATEGORIES[index]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="uppercase inline-block"
              >
                {CATEGORIES[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Continuously pulsing indicator */}
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-[pulse_1s_ease-in-out_infinite]" />
        </motion.div>
      )}
    </div>
  );
};
