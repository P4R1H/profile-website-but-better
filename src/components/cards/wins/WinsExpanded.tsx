"use client";

import { motion } from "framer-motion";
import { winsList } from "@/data/wins";
import { useState, useRef, useEffect } from "react";

interface WinsExpandedProps {
  onClose: () => void;
}

export const WinsExpanded = ({ onClose }: WinsExpandedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomBlur, setShowBottomBlur] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowBottomBlur(scrollHeight - scrollTop - clientHeight > 10);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-8 md:h-12 bg-linear-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-hide"
      >
        <div className="max-w-3xl mx-auto px-2 md:px-12 pt-6 md:pt-16 pb-32">
          
          {/* Header Section */}
          <div className="mb-10 pl-3 md:pl-8">
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 tracking-tighter mb-2">
              ACHIEVEMENTS
            </h1>
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-1 md:gap-3 font-mono text-xs md:text-sm text-zinc-500">
              <span className="text-zinc-300">Recognition & Milestones</span>
            </div>
          </div>

          {/* The Timeline Container */}
          <div className="relative border-l border-zinc-800 ml-2 md:ml-4 space-y-12 pb-8">
            {winsList.map((item, index) => {
              const isFeatured = item.featured;
              const isHero = item.variant === 'hero';
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-3 md:pl-12 group"
                >
                  {/* Node Dot/Star - Different styles based on type */}
                  {isFeatured ? (
                    <div className="absolute left-0 top-[5px] -translate-x-1/2 text-amber-600/40 text-lg leading-none">
                      ★
                    </div>
                  ) : (
                    <div className={`absolute -left-[5px] top-2 ${
                      item.variant === 'stat'
                        ? "w-2 h-2 -left-1 rounded-none"
                        : "w-2.5 h-2.5"
                    } bg-zinc-950 border border-zinc-600 rounded-full`} />
                  )}
                  
                  {/* Category & Year */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                      {item.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="text-[10px] font-mono text-zinc-600">
                      {item.year}
                    </span>
                  </div>

                  {/* Title - Larger for hero items */}
                  <h3 className={`font-bold text-zinc-200 group-hover:text-white transition-colors mb-2 ${
                    isHero ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                  }`}>
                    {item.title}
                  </h3>
                  
                  {/* Organization */}
                  {item.organization && (
                    <div className="text-sm text-zinc-400 font-mono mb-3">
                      {item.organization}
                    </div>
                  )}
                  
                  {/* Description */}
                  {item.description && (
                    <p className="text-zinc-400 leading-relaxed mb-4 max-w-2xl">
                      {item.description}
                    </p>
                  )}

                  {/* Stats */}
                  {item.stats && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {item.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[10px] uppercase font-mono text-zinc-600">{stat.label}</span>
                          <span className="text-sm font-mono text-zinc-300 font-semibold">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${showBottomBlur ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
