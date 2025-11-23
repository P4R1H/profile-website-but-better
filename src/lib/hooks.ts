import { useState, useEffect, useCallback, useRef } from "react";
import { TesseractCellData } from "@/types/types";

// --- EXISTING HELPERS ---
export function useMediaQuery(query: string, defaultValue: boolean = false): boolean {
  const [matches, setMatches] = useState(defaultValue);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
}

interface LongPressOptions {
  threshold?: number;
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

export function useLongPress(
  callback: () => void,
  options: LongPressOptions = {}
) {
  const { threshold = 500, onStart, onFinish, onCancel } = options;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (onStart) onStart();
      isLongPress.current = false;
      if ('touches' in event) {
        startX.current = event.touches[0].clientX;
        startY.current = event.touches[0].clientY;
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        isLongPress.current = true;
        callback();
      }, threshold);
    },
    [callback, threshold, onStart]
  );

  const move = useCallback((event: React.TouchEvent) => {
    if (timerRef.current && 'touches' in event) {
      const x = event.touches[0].clientX;
      const y = event.touches[0].clientY;
      const diffX = Math.abs(x - startX.current);
      const diffY = Math.abs(y - startY.current);
      if (diffX > 10 || diffY > 10) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (onCancel) onCancel();
      }
    }
  }, [onCancel]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (onCancel) onCancel();
  }, [onCancel]);

  const finish = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (onFinish) onFinish();
  }, [onFinish]);

  return {
    onMouseDown: start,
    onMouseUp: finish,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: finish,
    onTouchMove: move,
  };
}

// --- MOBILE SCRUBBER HOOK (FIXED) ---

interface UseMobileScrubberProps {
  enabled: boolean;
  items: TesseractCellData[];
  originalTitle: string;
  onNavigate: (path: string[]) => void;
  textRef: React.RefObject<HTMLElement | null>;
  progressRef: React.RefObject<HTMLElement | null>;
  trackRef: React.RefObject<HTMLElement | null>;
}

export const useMobileScrubber = ({
  enabled,
  items,
  originalTitle,
  onNavigate,
  textRef,
  progressRef,
  trackRef,
}: UseMobileScrubberProps) => {
  const isScrubbing = useRef(false);
  const startY = useRef<number>(0);
  const startX = useRef<number>(0);
  const activeIndex = useRef<number>(-1);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Configuration
  const LONG_PRESS_MS = 400;
  const ITEM_HEIGHT_THRESHOLD = 35; 
  const DEADZONE = 10;
  const CANCEL_THRESHOLD_X = 60; // Distance to cancel

  const reset = useCallback(() => {
    isScrubbing.current = false;
    activeIndex.current = -1;
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Reset Text
    if (textRef.current) {
      textRef.current.textContent = originalTitle;
      textRef.current.style.opacity = "1";
      textRef.current.style.color = "";
      textRef.current.style.filter = "blur(0px)";
      textRef.current.style.transform = "translateY(0px)";
      textRef.current.style.transition = ""; 
    }
    
    // Hide Rail
    if (trackRef.current) {
      trackRef.current.style.opacity = "0";
    }
  }, [originalTitle, textRef, trackRef, progressRef]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || items.length === 0) return;

    startY.current = e.touches[0].clientY;
    startX.current = e.touches[0].clientX;

    longPressTimer.current = setTimeout(() => {
      isScrubbing.current = true;
      
      // 1. Haptic & Visual Start
      if (navigator.vibrate) navigator.vibrate(20);
      
      if (textRef.current) {
        textRef.current.style.opacity = "0.5";
      }

      // 2. Dynamic Rail Positioning (Smart Mirror)
      if (trackRef.current) {
        const isRightSideTouch = startX.current > window.innerWidth / 2;
        
        // Reset both first
        trackRef.current.style.left = "";
        trackRef.current.style.right = "";
        
        if (isRightSideTouch) {
           trackRef.current.style.left = "0px"; // Show on Left
        } else {
           trackRef.current.style.right = "0px"; // Show on Right
        }
        
        trackRef.current.style.opacity = "1";
      }
      
      // 3. Init Thumb Height & Position
      // Logic: Thumb height is exactly 1 unit of the total length (100% / N)
      if (progressRef.current) {
          progressRef.current.style.top = "0%";
          const thumbHeight = 100 / items.length; // Exact segment height
          progressRef.current.style.height = `${thumbHeight}%`;
      }
    }, LONG_PRESS_MS);
  }, [enabled, items.length, textRef, trackRef, progressRef]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isScrubbing.current) {
      const moveY = Math.abs(e.touches[0].clientY - startY.current);
      const moveX = Math.abs(e.touches[0].clientX - startX.current);
      if (moveY > 10 || moveX > 10) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      }
      return;
    }

    if (e.cancelable) e.preventDefault();
    e.stopPropagation();

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;

    // --- 1. OMNIDIRECTIONAL CANCEL ---
    // Check absolute distance from start X. If dragged too far left OR right, cancel.
    const deltaX = Math.abs(currentX - startX.current);
    
    if (deltaX > CANCEL_THRESHOLD_X) {
      if (navigator.vibrate) navigator.vibrate([10, 50, 10]); 
      reset();
      return;
    }

    // --- 2. STEP LOGIC ---
    const deltaY = startY.current - currentY;
    if (Math.abs(deltaY) < DEADZONE) return;

    const effectiveDistance = deltaY > 0 ? deltaY - DEADZONE : deltaY + DEADZONE;
    const steps = Math.floor(effectiveDistance / ITEM_HEIGHT_THRESHOLD);
    const length = items.length;
    
    const newIndex = ((steps % length) + length) % length;

    // --- 3. DOM UPDATES (FIXED CALCULATION) ---
    if (progressRef.current) {
        // Logic: Calculate top based on slots. 
        // If there are 5 items, each is 20%. Item 0 starts at 0%, Item 4 starts at 80%.
        // It will never exceed 100% because the height is included in the remaining space.
        const percent = (newIndex / length) * 100;
        progressRef.current.style.top = `${percent}%`;
    }

    if (newIndex !== activeIndex.current) {
      activeIndex.current = newIndex;

      if (textRef.current) {
        textRef.current.textContent = items[newIndex].title;
        
        textRef.current.style.transition = "none"; 
        textRef.current.style.filter = "blur(1.5px)"; 
        textRef.current.style.color = "#ffffff";      
        textRef.current.style.transform = deltaY > 0 ? "translateY(-2px)" : "translateY(2px)";
        
        requestAnimationFrame(() => {
           if(textRef.current) {
               textRef.current.style.transition = "all 0.15s ease-out";
               textRef.current.style.filter = "blur(0px)";
               textRef.current.style.color = ""; 
               textRef.current.style.transform = "translateY(0px)";
           }
        });
      }

      if (navigator.vibrate) navigator.vibrate(10);
    }
  }, [items, reset, textRef, progressRef]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);

    if (isScrubbing.current) {
      e.preventDefault();
      e.stopPropagation();

      if (activeIndex.current !== -1 && items[activeIndex.current]) {
        if (navigator.vibrate) navigator.vibrate(30);
        onNavigate([items[activeIndex.current].id]);
      }
    }
    reset();
  }, [items, onNavigate, reset]);

  useEffect(() => reset, [reset]);

  return { onTouchStart, onTouchMove, onTouchEnd };
};