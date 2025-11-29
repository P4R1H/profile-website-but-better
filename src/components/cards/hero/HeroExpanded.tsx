"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroExpandedProps {
  onClose: () => void;
}

const stuffOptions = [
  { label: "Products", color: "bg-red-500" },
  { label: "Companies", color: "bg-blue-500" },
  { label: "Food", color: "bg-amber-500" },
  { label: "LEGO", color: "bg-purple-500" },
  { label: "Myself", color: "bg-zinc-100 text-black" },
];

export const HeroExpanded = ({ onClose }: HeroExpandedProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isStuffOpen, setIsStuffOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"rules" | "media" | "output">("rules");

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleLines(1), 200),
      setTimeout(() => setVisibleLines(2), 1000),
      setTimeout(() => setVisibleLines(3), 1500),
      setTimeout(() => setVisibleLines(4), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-dvh bg-black text-zinc-100 flex flex-col justify-center items-center overflow-hidden relative pb-20 md:pb-32">
      <div className="max-w-4xl w-full px-6 md:px-16 z-10">
        
        {/* Line 1 */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visibleLines >= 1 ? 1 : 0, y: visibleLines >= 1 ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-bold tracking-tighter mb-2 md:mb-8"
        >
          Hi, I'm Parth.
        </motion.h1>

        {/* Line 2 - The Interaction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visibleLines >= 2 ? 1 : 0, y: visibleLines >= 2 ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-400 leading-tight relative"
        >
          <span className="mr-2 md:mr-3">I really, really like building</span>
          
          {/* "stuff" Interaction */}
          <div 
            className="inline-block relative"
            onMouseEnter={() => setIsStuffOpen(true)}
            onMouseLeave={() => setIsStuffOpen(false)}
            onClick={() => setIsStuffOpen(!isStuffOpen)}
          >
            <span className="cursor-pointer text-zinc-100 border-b-4 border-zinc-800 hover:border-white transition-colors pb-1">
              stuff
            </span>

            <div className="absolute top-full left-0 mt-4 w-[300px] pointer-events-none z-50">
              <AnimatePresence>
                {isStuffOpen && (
                  <div className="flex flex-col items-start gap-2 perspective-[1000px]">
                    {stuffOptions.map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: -50, rotateX: -90 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                        transition={{ 
                          type: "spring", stiffness: 300, damping: 15, mass: 1.2, delay: i * 0.08 
                        }}
                        className={`
                          px-4 py-2 rounded-lg text-lg md:text-xl font-bold shadow-2xl
                          ${item.color} ${item.label === 'Myself' ? 'text-black' : 'text-white'}
                        `}
                        style={{ transformOrigin: "top center" }}
                      >
                        {item.label}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <span>.</span>
        </motion.div>

        {/* Line 3 - Philosophy with highlighted Resume Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleLines >= 3 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="mt-6 md:mt-12 text-lg md:text-2xl text-zinc-600 max-w-2xl leading-relaxed"
        >
          A generalist, slowly working towards becoming a general specialist. Not much here I know, I prefer to let my{' '}
          <a 
            href="https://drive.google.com/file/d/1HyfCKnOmNcYyDir5b6j7yugNU12aLgTN/view" // TODO: Update path to your resume
            target="_blank" 
            rel="noopener noreferrer"
            // Same styling classes as "stuff"
            className="cursor-pointer text-zinc-100 border-b-4 border-zinc-800 hover:border-white transition-colors pb-1 inline-block leading-none"
          >
            work
          </a>
          {' '}do the talk.
        </motion.p>

        {/* Bottom Section: Tabs Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleLines >= 4 ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="mt-6 md:mt-16 border-t border-zinc-900 pt-4 md:pt-8"
        >
          {/* THE TOGGLE SWITCH */}
          <div className="flex gap-6 mb-4 md:mb-6 text-xs font-mono uppercase tracking-widest">
            <button 
              onClick={() => setActiveTab("rules")}
              className={`${activeTab === "rules" ? "text-zinc-100" : "text-zinc-600 hover:text-zinc-400"} transition-colors`}
            >
              01. Mindset
            </button>
            <button 
              onClick={() => setActiveTab("media")}
              className={`${activeTab === "media" ? "text-zinc-100" : "text-zinc-600 hover:text-zinc-400"} transition-colors`}
            >
              02. Input
            </button>
            <button 
              onClick={() => setActiveTab("output")}
              className={`${activeTab === "output" ? "text-zinc-100" : "text-zinc-600 hover:text-zinc-400"} transition-colors`}
            >
              03. Output
            </button>
          </div>

          {/* THE CONTENT GRID */}
          <div className="relative min-h-[150px] md:min-h-[100px]"> 
            <AnimatePresence mode="wait">
              
              {/* 01. RULES VIEW */}
              {activeTab === "rules" && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 absolute w-full top-0 left-0"
                >
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 md:mb-2">Rule 1</span>
                    <p className="text-zinc-400 text-sm md:text-base leading-snug">Grow higher order thinking. Architects replace engineers.</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 md:mb-2">Rule 2</span>
                    <p className="text-zinc-400 text-sm md:text-base leading-snug">Be curious, be a skeptic. "If" can become a "When"</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 md:mb-2">Rule 3</span>
                    <p className="text-zinc-400 text-sm md:text-base leading-snug">Embrace a state of flux, It's the only constant.</p>
                  </div>
                </motion.div>
              )}

              {/* 02. MEDIA VIEW */}
              {activeTab === "media" && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 absolute w-full top-0 left-0"
                >
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 md:mb-2">Reading</span>
                    <ul className="text-zinc-400 text-sm md:text-base leading-snug space-y-0.5">
                      <li>What If? <span className="text-zinc-600">- Randall Munroe</span></li>
                      <li>Vagabond <span className="text-zinc-600">- Takehiko Inoue</span></li>
                      <li>Vinland Saga <span className="text-zinc-600">- Makoto Yukimura</span></li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 md:mb-2">Listening</span>
                    <p className="text-zinc-400 text-sm md:text-base leading-snug">
                      The NBHD, Don Toliver, Joji, Arctic Monkeys, JID, Metro Boomin, SZA, Kendrick Lamar.
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 md:mb-2">Watching</span>
                    <p className="text-zinc-400 text-sm md:text-base leading-snug">
                      Mostly youtube, my feed's gold.
                      <span className="block mt-1 text-zinc-500">Veritasium, 3b1b, Nilered, Low level, Scott Yu Jan</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 03. OUTPUT VIEW */}
              {activeTab === "output" && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 absolute w-full top-0 left-0"
                >
                  {/* Column 1 */}
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 md:mb-2">Cool stuff</span>
                    <p className="text-zinc-400 text-sm md:text-base leading-snug">
                      like this website
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
};