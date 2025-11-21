"use client";

import React, { useState, useEffect } from "react";
import { Tesseract } from "../components/tesseract/Tesseract"; 
import { Breadcrumb } from "@/components/breadcrumb"; 
import { rootItems } from "./data/data";
import { useMediaQuery } from "@/lib/hooks";

export default function Home() {
  const [path, setPath] = useState<string[]>([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to 1 column (mobile) to ensure mobile users get the right view immediately
  // Desktop users might see a quick shift, but that's better than broken mobile view
  const columns = mounted ? (isDesktop ? 3 : 1) : 1;

  return (
    <main className="h-dvh w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
      <div className="w-full max-w-7xl h-12 flex items-center px-4 md:px-8 shrink-0 z-50">
        <Breadcrumb 
          path={path} 
          rootItems={rootItems} 
          onNavigate={setPath} 
        />
      </div>
      
      <div className="w-full max-w-7xl flex-1 min-h-0 relative">
        <Tesseract 
          items={rootItems} 
          path={path} 
          onNavigate={setPath}
          config={{
            columns: columns,
            gap: isDesktop ? 8 : 12 // Larger gap on mobile for touch
          }}
          className="pb-4 px-4 md:px-0"
        />
      </div>
    </main>
  );
}