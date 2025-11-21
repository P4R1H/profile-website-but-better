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

  // Handle browser back/forward button
  useEffect(() => {
    // Initialize history state on mount
    if (mounted && !window.history.state?.tesseractPath) {
      window.history.replaceState({ tesseractPath: [] }, "", window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      // If the user presses back and there's a tesseract path in history
      if (event.state?.tesseractPath) {
        setPath(event.state.tesseractPath);
      } else if (path.length > 0) {
        // If there's no state but we have a path, go back one level
        setPath([]);
      }
      // If path is already empty, let the browser handle it (will close the page)
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [mounted, path]);

  // Custom navigation handler that updates both state and history
  const handleNavigate = (newPath: string[]) => {
    // If navigating deeper or to a different path, push to history
    if (newPath.length > 0) {
      window.history.pushState(
        { tesseractPath: newPath },
        "",
        window.location.href
      );
    } else if (path.length > 0) {
      // Going back to root
      window.history.pushState(
        { tesseractPath: [] },
        "",
        window.location.href
      );
    }

    setPath(newPath);
  };

  // Default to 1 column (mobile) to ensure mobile users get the right view immediately
  // Desktop users might see a quick shift, but that's better than broken mobile view
  const columns = mounted ? (isDesktop ? 3 : 1) : 1;

  return (
    <main className="h-dvh w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
      <div className="w-full max-w-7xl h-12 flex items-center px-4 md:px-8 shrink-0 z-50">
        <Breadcrumb
          path={path}
          rootItems={rootItems}
          onNavigate={handleNavigate}
        />
      </div>

      <div className="w-full max-w-7xl flex-1 min-h-0 relative">
        <Tesseract
          items={rootItems}
          path={path}
          onNavigate={handleNavigate}
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