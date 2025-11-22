"use client";

import { motion, AnimatePresence } from "framer-motion";
import { allSkills, skillCategories } from "@/data/stack";
import { useState } from "react";

interface StackExpandedProps {
  onClose: () => void;
}

export const StackExpanded = ({ onClose }: StackExpandedProps) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const currentWords = hoveredSkill && skillCategories[hoveredSkill]
    ? skillCategories[hoveredSkill]
    : { word1: "variety", word2: "versatility" };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />

      {/* Dynamic Sentence - Floating Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-8 left-0 right-0 z-20 flex justify-center pointer-events-none"
      >
        <div className="flex items-center justify-center px-6 py-2 pointer-events-auto">
          <span className="text-zinc-500 font-mono text-sm md:text-base">behold</span>
          <span className="w-3 md:w-4"></span>
          
          <div className="inline-flex items-center font-mono text-sm md:text-base">
            <span className="text-zinc-500">{"{"}</span>
            <div className="relative inline-block min-w-[1ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWords.word1}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-zinc-300 inline-block px-1"
                >
                  {currentWords.word1}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-zinc-500">{"}"}</span>
          </div>

          <span className="w-3 md:w-4"></span>
          <span className="text-zinc-500 font-mono text-sm md:text-base">for</span>
          <span className="w-3 md:w-4"></span>
          
          <div className="inline-flex items-center font-mono text-sm md:text-base">
            <span className="text-zinc-500">{"{"}</span>
            <div className="relative inline-block min-w-[1ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWords.word2}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-zinc-300 inline-block px-1"
                >
                  {currentWords.word2}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-zinc-500">{"}"}</span>
          </div>
        </div>
      </motion.div>

      {/* Scrollable Grid Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full h-full overflow-y-auto scrollbar-hide"
      >
        <div className="min-h-full flex flex-col items-center pt-32 pb-16 px-4 md:px-12">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-1 w-fit mx-auto">
            {allSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.02, duration: 0.3 }}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="w-20 h-20 md:w-24 md:h-24 bg-zinc-950 border border-zinc-800 flex items-center justify-center hover:border-zinc-600 hover:bg-zinc-900 hover:scale-110 transition-all cursor-pointer"
              >
                <img
                  src={`https://skillicons.dev/icons?i=${skill}`}
                  alt={skill}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain block"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};