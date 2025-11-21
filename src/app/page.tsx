"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tesseract } from "../components/tesseract/Tesseract";
import { Breadcrumb } from "@/components/breadcrumb";
import { rootItems } from "./data/data";
import { ViewportProvider } from "@/contexts/ViewportContext";

export default function Home() {
  const [path, setPath] = useState<string[]>([]);

  // Browser history integration: back button collapses
  const handleNavigate = useCallback((newPath: string[]) => {
    setPath(newPath);

    // Push to browser history when expanding (path grows)
    if (newPath.length > path.length) {
      window.history.pushState({ tesseractPath: newPath }, "");
    }
  }, [path.length]);

  // Listen for browser back/forward button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.tesseractPath) {
        // User navigated to a history entry with a path
        setPath(event.state.tesseractPath);
      } else {
        // User went back to root
        setPath([]);
      }
    };

    // Set initial history state
    window.history.replaceState({ tesseractPath: [] }, "");

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <ViewportProvider>
      <main className="min-h-screen bg-black p-4 sm:p-8 flex flex-col items-center sm:justify-center">
        <div className="w-full max-w-7xl mb-4 h-8 flex items-center">
          <Breadcrumb
            path={path}
            rootItems={rootItems}
            onNavigate={setPath}
          />
        </div>

        <div className="w-full max-w-7xl min-h-[600px] sm:h-[700px]">
          <Tesseract
            items={rootItems}
            path={path}
            onNavigate={handleNavigate}
          />
        </div>
      </main>
    </ViewportProvider>
  );
}