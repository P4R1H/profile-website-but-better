"use client";

import { motion } from "framer-motion";
import { useCellState } from "@/components/tesseract/TesseractCell";
import { stackSkills } from "@/data/stack";

export const StackPreview = () => {
  const { isHovered, isLocked } = useCellState();

  const totalTools = Object.values(stackSkills).flat().length;
  const totalDomains = Object.keys(stackSkills).length;

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
          className="absolute bottom-3 right-3 flex items-center gap-2 text-zinc-500 text-xs font-mono tracking-wider"
        >
          <span className="uppercase">{totalTools} TOOLS</span>
          <span className="text-zinc-800">|</span>
          <span className="uppercase">{totalDomains} DOMAINS</span>
        </motion.div>
      )}
    </div>
  );
};