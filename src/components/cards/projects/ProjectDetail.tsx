"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface ProjectData {
  name: string;
  type: string;
  period?: string;
  description: string;
  highlights: string[];
  stack: string[];
  link?: string;
}

interface ProjectDetailProps {
  data: ProjectData;
  onClose: () => void;
}

export const ProjectDetail = ({ data }: ProjectDetailProps) => {
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
            
            {/* Header Section */}
            <div className="mb-10 pl-3 md:pl-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 tracking-tighter mb-2">
                        {data.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-400 text-sm md:text-base">
                        <span className="text-zinc-100 font-medium">{data.type}</span>
                        {data.period && (
                            <>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span>{data.period}</span>
                            </>
                        )}
                        </div>
                    </div>
                    {data.link && (
                        <a 
                            href={data.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100"
                        >
                            <ArrowUpRight size={20} />
                        </a>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 md:gap-12 pl-3 md:pl-8">
                {/* Main Content */}
                <div className="space-y-8">
                    <div className="prose prose-invert">
                        <p className="text-zinc-300 text-lg leading-relaxed">
                        {data.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                        Key Highlights
                        </h3>
                        <ul className="space-y-3">
                        {data.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start gap-3 text-zinc-300">
                            <span className="mt-2 w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
                            <span className="leading-relaxed">{highlight}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                        Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                        {data.stack.map((tech) => (
                            <span 
                            key={tech}
                            className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium"
                            >
                            {tech}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
          showBottomBlur ? "opacity-100" : "opacity-0"
        }`} 
      />
    </div>
  );
};
