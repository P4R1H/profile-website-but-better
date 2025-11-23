"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

interface ProjectListItem {
  id: string;
  name: string;
  category: "Web" | "ML" | "Mobile" | "Automation" | "Other";
  year: string;
  description: string;
  link?: string;
}

const allProjects: ProjectListItem[] = [
  { id: "1", name: "StockPiece", category: "Web", year: "2024", description: "Inventory management system", link: "#" },
  { id: "2", name: "Community Bots", category: "Automation", year: "2023", description: "Discord/Reddit moderation tools", link: "#" },
  { id: "3", name: "Persona Tools", category: "ML", year: "2024", description: "AI-powered persona generation", link: "#" },
  { id: "4", name: "Portfolio V1", category: "Web", year: "2022", description: "Previous portfolio site", link: "#" },
  { id: "5", name: "E-commerce Platform", category: "Web", year: "2023", description: "Scalable online store", link: "#" },
  { id: "6", name: "Neural Net Vis", category: "ML", year: "2023", description: "Interactive visualization", link: "#" },
  { id: "7", name: "Task Manager", category: "Mobile", year: "2022", description: "React Native app", link: "#" },
];

export const ProjectList = ({ onClose }: { onClose: () => void }) => {
  const [filter, setFilter] = useState<string>("All");
  
  const categories = ["All", "Web", "ML", "Automation", "Mobile"];
  
  const filteredProjects = filter === "All" 
    ? allProjects 
    : allProjects.filter(p => p.category === filter);

  return (
    <div className="w-full h-full bg-black flex flex-col p-6 md:p-12 overflow-hidden relative">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-12 md:right-12 p-2 text-zinc-500 hover:text-zinc-100 transition-colors z-50"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 mt-8 md:mt-0">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold text-zinc-100 tracking-tighter mb-2">ALL PROJECTS</h2>
          <p className="text-zinc-500 font-mono text-sm">A complete archive of my work.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-colors ${
                filter === cat 
                  ? "bg-zinc-100 text-black border-zinc-100" 
                  : "text-zinc-500 border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex flex-col md:flex-row md:items-center justify-between p-4 border border-zinc-900 hover:border-zinc-700 bg-zinc-950/50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-zinc-200 font-bold text-lg">{project.name}</h3>
                  <span className="text-xs text-zinc-600 font-mono px-2 py-0.5 border border-zinc-900 rounded-full">{project.category}</span>
                </div>
                <p className="text-zinc-500 text-sm">{project.description}</p>
              </div>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="text-zinc-700 font-mono text-xs">{project.year}</span>
                {project.link && (
                  <a href={project.link} className="text-zinc-500 hover:text-zinc-100 transition-colors">
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
