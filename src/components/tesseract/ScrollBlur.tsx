"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollBlurProps {
  children: React.ReactNode;
  showBlur: boolean;
  className?: string;
}

/**
 * Wrapper component that adds blur gradients at top/bottom when scrolling
 * Only active on mobile devices
 */
export const ScrollBlur: React.FC<ScrollBlurProps> = ({
  children,
  showBlur,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopBlur, setShowTopBlur] = useState(false);
  const [showBottomBlur, setShowBottomBlur] = useState(false);

  useEffect(() => {
    if (!showBlur) {
      setShowTopBlur(false);
      setShowBottomBlur(false);
      return;
    }

    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;

      // Show top blur if scrolled down
      setShowTopBlur(scrollTop > 20);

      // Show bottom blur if not at bottom
      setShowBottomBlur(scrollTop < scrollHeight - clientHeight - 20);
    };

    // Initial check
    checkScroll();

    // Listen for scroll events
    scrollElement.addEventListener("scroll", checkScroll);

    // Listen for resize (content might change)
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener("scroll", checkScroll);
      resizeObserver.disconnect();
    };
  }, [showBlur]);

  return (
    <div className="relative w-full h-full">
      {/* Scrollable content */}
      <div ref={scrollRef} className={cn("w-full h-full", className)}>
        {children}
      </div>

      {/* Top blur gradient */}
      {showBlur && (
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-16 pointer-events-none transition-opacity duration-300 z-30",
            "bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm",
            showTopBlur ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Bottom blur gradient */}
      {showBlur && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-16 pointer-events-none transition-opacity duration-300 z-30",
            "bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm",
            showBottomBlur ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
};
