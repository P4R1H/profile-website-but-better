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
  }, [data]);

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
            
            {/* Header Section (No line yet) */}
            <div className="mb-10 pl-3 md:pl-8">
                <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 tracking-tighter mb-2">
                    {data.company}
                </h1>
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-1 md:gap-3 font-mono text-xs md:text-sm text-zinc-500">
                    <span className="text-zinc-300">{data.role}</span>
                    <span>{data.period}</span>
                </div>
            </div>

            {/* The Timeline Container */}
            <div className="relative border-l border-zinc-800 ml-2 md:ml-4 space-y-12 pb-8">
                
                {/* Section 1: Description */}
                <div className="relative pl-3 md:pl-12">
                    {/* Node Dot */}
                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-zinc-950 border border-zinc-600 rounded-full" />
                    
                    <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
                        {data.description}
                    </p>
                </div>

                {/* Section 2: Stack */}
                <div className="relative pl-3 md:pl-12">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-zinc-950 border border-zinc-600 rounded-full" />
                    
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.stack.map((tech) => (
                            <span 
                                key={tech} 
                                className="px-3 py-1 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-xs font-mono hover:border-zinc-600 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Section 3: Highlights */}
                <div className="relative pl-3 md:pl-12">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-zinc-950 border border-zinc-600 rounded-full" />
                    
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">Key Outcomes</h3>
                    <div className="space-y-8">
                        {data.highlights.map((highlight, index) => {
                            const [title, ...rest] = highlight.split(":");
                            return (
                                <div key={index} className="group">
                                    <h4 className="text-zinc-200 font-medium mb-2 group-hover:text-white transition-colors">
                                        {title}
                                    </h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {rest.join(":").trim()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
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