"use client";

import { motion } from "framer-motion";
import { useCellState } from "@/components/tesseract";

export const ThoughtsPreview = () => {
  const { isHovered, isLocked } = useCellState("thoughts");

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
          className="absolute bottom-3 right-3 text-zinc-500 text-xs font-mono tracking-wider uppercase"
        >
          Question everything.
        </motion.div>
      )}
    </div>
  );
};
