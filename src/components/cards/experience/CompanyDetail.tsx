"use client";

import { useState, useRef, useEffect } from "react";

interface CompanyData {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  stack: string[];
}

interface CompanyDetailProps {
  data: CompanyData;
  onClose: () => void;
}

export const CompanyDetail = ({ data }: CompanyDetailProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopBlur, setShowTopBlur] = useState(false);
  const [showBottomBlur, setShowBottomBlur] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // Show top blur only if scrolled down > 10px
    setShowTopBlur(scrollTop > 10);
    
    // Show bottom blur only if there is content below (with 10px buffer)
    setShowBottomBlur(scrollHeight - scrollTop - clientHeight > 10);
  };

  // Initial check (wait for render/paint)
  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [data]);

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      
      {/* --- Top Gradient Blur (Conditional) --- */}
      <div 
        className={`absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-black via-black/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showTopBlur ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* --- Scrollable Content --- */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto scrollbar-hide relative z-0"
      >
        <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
          
          {/* Metadata Strip */}
          <div className="flex flex-wrap items-center gap-4 mb-8 font-mono text-xs text-zinc-500">
              <span className="text-zinc-300">{data.period}</span>
              <span className="text-zinc-700">•</span>
              <span>{data.location}</span>
              <span className="text-zinc-700">•</span>
              <span>{data.role}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 tracking-tighter mb-8">
              {data.company}
          </h1>

          {/* Tech Stack - Text Only Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
               {data.stack.map((tech) => (
                   <span 
                     key={tech} 
                     className="px-2.5 py-1 border border-zinc-800 rounded-full text-zinc-400 text-[11px] font-mono hover:text-zinc-200 hover:border-zinc-600 transition-colors cursor-default"
                   >
                      {tech}
                   </span>
               ))}
          </div>

          {/* Lead Paragraph / Description */}
          <div className="prose prose-invert max-w-none mb-16">
              <p className="text-xl md:text-2xl text-zinc-200 font-light leading-normal">
                  {data.description}
              </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 gap-8">
              {data.highlights.map((highlight, index) => {
                  const [title, ...rest] = highlight.split(":");
                  const description = rest.join(":").trim();
                  
                  return (
                      <div key={index} className="relative pl-6 border-l-2 border-zinc-800 hover:border-zinc-500 transition-colors duration-300">
                          <h3 className="text-lg font-medium text-zinc-100 mb-2">
                              {title}
                          </h3>
                          <p className="text-zinc-400 text-sm leading-relaxed">
                              {description}
                          </p>
                      </div>
                  );
              })}
          </div>
        </div>
      </div>

      {/* --- Bottom Gradient Blur (Conditional) --- */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black via-black/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showBottomBlur ? 'opacity-100' : 'opacity-0'}`} 
      />
      
    </div>
  );
};