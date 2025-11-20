"use client";

import { RecursiveGrid, BentoItem } from "../components/grid/recursive-grid";
import { Breadcrumb } from "@/components/breadcrumb";
import { useState } from "react";

// --- Dummy Data for Recursion ---

const experienceItems: BentoItem[] = [
  { id: "cred", title: "CRED", subtitle: "Backend Intern", content: <div className="text-zinc-500 text-xs">Wealth Management</div> },
  { id: "hpe", title: "HPE", subtitle: "Project Intern", content: <div className="text-zinc-500 text-xs">Infrastructure</div> },
  { id: "ecom", title: "Ecom Express", subtitle: "ML Intern", content: <div className="text-zinc-500 text-xs">Computer Vision</div> },
  { id: "conscent", title: "Conscent", subtitle: "Data Science", content: <div className="text-zinc-500 text-xs">Big Data</div> },
  { id: "persona", title: "Persona", subtitle: "Team Lead", content: <div className="text-zinc-500 text-xs">Full Stack</div> },
];

const projectItems: BentoItem[] = [
  { id: "stockpiece", title: "StockPiece", subtitle: "Fintech Game" },
  { id: "skilljourney", title: "Skill Journey", subtitle: "AI EdTech" },
  { id: "bots", title: "Community Bots", subtitle: "Automation" },
];

const rootItems: BentoItem[] = [
  { id: "profile", title: "Parth Gupta", subtitle: "Full Stack Developer", content: <div className="text-sm text-zinc-400 mt-2">Building things that matter.</div> },
  { id: "exp", title: "Experience", subtitle: "My Journey", children: experienceItems }, // Has children!
  { id: "projects", title: "Projects", subtitle: "What I've Built", children: projectItems }, // Has children!
  { id: "stack", title: "Stack", subtitle: "My Arsenal" },
  { id: "connect", title: "Connect", subtitle: "Reach Out" },
  { id: "blog", title: "Blog", subtitle: "Thoughts" },
  { id: "photos", title: "Photos", subtitle: "Gallery" },
  { id: "extra", title: "Extra", subtitle: "More Stuff" },
  { id: "extra2", title: "Misc", subtitle: "Details" },
];

export default function Home() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mb-4 h-8 flex items-center">
        <Breadcrumb 
          path={path} 
          rootItems={rootItems} 
          onNavigate={setPath} 
        />
      </div>
      
      <div className="w-full max-w-7xl h-[700px]">
        <RecursiveGrid 
          items={rootItems} 
          path={path} 
          onNavigate={setPath} 
        />
      </div>
    </main>
  );
}
