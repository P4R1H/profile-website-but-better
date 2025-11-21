"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

interface MobileScrollContainerProps {
  children: React.ReactNode;
  enableSnap?: boolean;
  enableBlur?: boolean;
  enableHaptics?: boolean;
  className?: string;
}

/**
 * Mobile scroll container with snap points, blur edges, and haptic feedback
 * Prevents body scroll and creates isolated scroll context
 */
export const MobileScrollContainer = ({
  children,
  enableSnap = true,
  enableBlur = true,
  enableHaptics = true,
  className,
}: MobileScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    isAtTop: true,
    isAtBottom: false,
    canScroll: false,
  });

  const haptics = useHaptics();
  const lastSnapPosition = useRef<number>(0);
  const isSnapping = useRef<boolean>(false);

  // Check scroll position and update blur visibility
  const checkScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtTop = scrollTop < 10;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const canScroll = scrollHeight > clientHeight;

    setScrollState({
      isAtTop,
      isAtBottom,
      canScroll,
    });
  }, []);

  // Handle snap scrolling with haptic feedback
  const handleScroll = useCallback(() => {
    checkScrollPosition();

    if (!enableSnap || !enableHaptics || isSnapping.current) return;

    const container = containerRef.current;
    if (!container) return;

    const currentPosition = container.scrollTop;
    const snapThreshold = 50; // Pixels of movement needed to trigger haptic

    if (Math.abs(currentPosition - lastSnapPosition.current) > snapThreshold) {
      haptics.snap();
      lastSnapPosition.current = currentPosition;
    }
  }, [checkScrollPosition, enableSnap, enableHaptics, haptics]);

  // Debounced scroll handler for performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleScroll();
        isSnapping.current = false;
      }, 50);
    };

    container.addEventListener("scroll", debouncedScroll, { passive: true });

    // Initial check
    checkScrollPosition();

    // Recheck when content changes
    const resizeObserver = new ResizeObserver(() => {
      checkScrollPosition();
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", debouncedScroll);
      resizeObserver.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll, checkScrollPosition]);

  // Prevent body scroll on mobile when this container is active
  useEffect(() => {
    const preventBodyScroll = (e: TouchEvent) => {
      // Only prevent if we're not at the edges
      if (!scrollState.isAtTop && !scrollState.isAtBottom) {
        e.preventDefault();
      }
    };

    // Prevent overscroll
    document.body.style.overscrollBehavior = "none";
    document.addEventListener("touchmove", preventBodyScroll, {
      passive: false,
    });

    return () => {
      document.body.style.overscrollBehavior = "auto";
      document.removeEventListener("touchmove", preventBodyScroll);
    };
  }, [scrollState.isAtTop, scrollState.isAtBottom]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Top Blur Gradient */}
      <AnimatePresence>
        {enableBlur && !scrollState.isAtTop && scrollState.canScroll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-50"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full overflow-y-auto overflow-x-hidden",
          enableSnap && "snap-y snap-mandatory",
          // Hide scrollbar but keep functionality
          "scrollbar-none",
          // Smooth scrolling
          "scroll-smooth"
        )}
        style={{
          // iOS momentum scrolling
          WebkitOverflowScrolling: "touch",
          // Prevent pull-to-refresh
          overscrollBehaviorY: "contain",
        }}
      >
        {children}
      </div>

      {/* Bottom Blur Gradient */}
      <AnimatePresence>
        {enableBlur && !scrollState.isAtBottom && scrollState.canScroll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-50"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Scroll Indicator (Optional subtle visual cue) */}
      {scrollState.canScroll && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 pointer-events-none z-40">
          {!scrollState.isAtTop && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.3, y: 0 }}
              className="w-1 h-8 bg-zinc-600 rounded-full"
            />
          )}
          {!scrollState.isAtBottom && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 0.3, y: 0 }}
              className="w-1 h-8 bg-zinc-600 rounded-full"
            />
          )}
        </div>
      )}
    </div>
  );
};
