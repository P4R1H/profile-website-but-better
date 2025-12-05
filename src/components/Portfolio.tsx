"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tesseract } from "@/components/tesseract/Tesseract";
import { Breadcrumb } from "@/components/breadcrumb";
import { rootItems } from "@/data/portfolio";
import { useMediaQuery } from "@/lib/hooks";
import { getTitleForPath } from "@/lib/seo";

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface PortfolioProps {
  initialIsDesktop: boolean;
  initialPath?: string[];
}

export function Portfolio({ initialIsDesktop, initialPath = [] }: PortfolioProps) {
  const [path, setPath] = useState<string[]>(initialPath);
  const isDesktop = useMediaQuery("(min-width: 768px)", initialIsDesktop);
  const [mounted, setMounted] = useState(false);

  // Track page view in GA4
  const trackPageView = useCallback((pagePath: string[]) => {
    if (typeof window !== "undefined" && window.gtag) {
      const url = "/" + pagePath.join("/");
      const title = getTitleForPath(pagePath);
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: title,
        page_location: window.location.origin + url,
      });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle browser back/forward button
  useEffect(() => {
    if (!mounted) return;

    // Initialize history state on mount with current URL
    const currentUrl = "/" + path.join("/");
    if (!window.history.state?.tesseractPath) {
      window.history.replaceState({ tesseractPath: path }, "", currentUrl || "/");
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.tesseractPath) {
        setPath(event.state.tesseractPath);
        trackPageView(event.state.tesseractPath);
      } else {
        // Parse path from URL as fallback
        const urlPath = window.location.pathname.split("/").filter(Boolean);
        setPath(urlPath);
        trackPageView(urlPath);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [mounted, trackPageView]);

  // Custom navigation handler that updates both state, history, and URL
  const handleNavigate = useCallback((newPath: string[]) => {
    const newUrl = "/" + newPath.join("/");
    
    window.history.pushState(
      { tesseractPath: newPath },
      "",
      newUrl || "/"
    );

    setPath(newPath);
    trackPageView(newPath);
  }, [trackPageView]);

  // Use isDesktop directly since we have a good initial guess
  const columns = isDesktop ? 3 : 1;

  return (
    <main className="h-dvh w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
      <div className="w-full max-w-6xl h-12 flex items-center px-4 md:px-8 shrink-0 z-50">
        <Breadcrumb
          path={path}
          rootItems={rootItems}
          onNavigate={handleNavigate}
        />
      </div>

      <div className="w-full max-w-6xl flex-1 min-h-0 max-h-[90%] relative">
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
