import { useState, useEffect, useCallback, useRef, RefObject } from "react";
import { TesseractCellData } from "@/types/types";

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


type GesturePhase = 'idle' | 'deciding' | 'scrolling' | 'scrubbing' | 'cancelled';

interface VelocitySample {
  time: number;
  position: number;
}

interface VelocityTracker {
  samples: VelocitySample[];
}

interface UseMobileScrubberProps {
  enabled: boolean;
  items: TesseractCellData[];
  originalTitle: string;
  onNavigate: (path: string[]) => void;
  textRef: RefObject<HTMLElement | null>;
  progressRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLElement | null>;
  wrapperRef: RefObject<HTMLDivElement | null>;
}

// Helper to find scroll parent
function getScrollableAncestor(element: HTMLElement | null): HTMLElement | Window | null {
  if (typeof window === 'undefined') return null;
  if (!element) return window;
  
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
    const canScroll = current.scrollHeight > current.clientHeight;
    
    if (isScrollable && canScroll) return current;
    current = current.parentElement;
  }
  return window;
}

function getScrollPosition(scrollable: HTMLElement | Window | null): number {
  if (!scrollable) return 0;
  if (scrollable === window) return window.scrollY;
  return (scrollable as HTMLElement).scrollTop;
}

function setScrollPosition(scrollable: HTMLElement | Window | null, position: number): void {
  if (!scrollable) return;
  if (scrollable === window) window.scrollTo(0, position);
  else (scrollable as HTMLElement).scrollTop = position;
}

function getMaxScroll(scrollable: HTMLElement | Window | null): number {
  if (!scrollable) return 0;
  if (scrollable === window) return document.documentElement.scrollHeight - window.innerHeight;
  const el = scrollable as HTMLElement;
  return el.scrollHeight - el.clientHeight;
}

// ============================================================================
// THE HOOK
// ============================================================================

export const useMobileScrubber = ({
  enabled,
  items,
  originalTitle,
  onNavigate,
  textRef,
  progressRef,
  trackRef,
  wrapperRef,
}: UseMobileScrubberProps) => {
  // --- Mutable State (Refs) ---
  const phaseRef = useRef<GesturePhase>('idle');
  const startYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const activeIndexRef = useRef<number>(-1);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrubStartYRef = useRef<number>(0);
  
  // Scroll Physics State
  const scrollableRef = useRef<HTMLElement | Window | null>(null);
  const scrollStartPosRef = useRef<number>(0);
  const maxScrollRef = useRef<number>(0);
  const velocityRef = useRef<VelocityTracker>({ samples: [] });
  const momentumFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Stable Props
  const enabledRef = useRef(enabled);
  const itemsRef = useRef(items);
  const originalTitleRef = useRef(originalTitle);
  const onNavigateRef = useRef(onNavigate);

  useEffect(() => {
    enabledRef.current = enabled;
    itemsRef.current = items;
    originalTitleRef.current = originalTitle;
    onNavigateRef.current = onNavigate;
  }, [enabled, items, originalTitle, onNavigate]);

  // --- Configuration Constants ---
  const LONG_PRESS_MS = 300; // Slightly faster for snappier feel
  const ITEM_HEIGHT_THRESHOLD = 35;
  const DEADZONE = 10;
  const CANCEL_THRESHOLD_X = 60;
  const SCROLL_THRESHOLD = 6; 

  // --- Physics Tuning (The "Native Feel" Config) ---
  const VELOCITY_WINDOW = 40; // ms. ONLY consider moves in this window.
  const VELOCITY_MULTIPLIER = 1.8; // Amplifies the flick.
  const FRICTION = 0.96; // Base friction per ~16ms frame.
  const STOP_VELOCITY = 0.05; // Stop threshold.

  // -------------------------------------------------------------------------
  // Velocity Tracking
  // -------------------------------------------------------------------------
  const trackVelocity = useCallback((position: number) => {
    const now = performance.now();
    velocityRef.current.samples.push({ time: now, position });
    
    // Prune very old samples to keep memory low, though we filter logic later
    if (velocityRef.current.samples.length > 20) {
      velocityRef.current.samples.shift();
    }
  }, []);

  const calculateVelocity = useCallback((): number => {
    const samples = velocityRef.current.samples;
    if (samples.length < 2) return 0;

    const now = performance.now();
    
    // 1. FILTER: Only look at samples from the last X ms.
    // This is crucial. If you drag, stop for 100ms, then let go, velocity MUST be 0.
    const recentSamples = samples.filter(s => now - s.time < VELOCITY_WINDOW);

    if (recentSamples.length < 2) return 0;

    const first = recentSamples[0];
    const last = recentSamples[recentSamples.length - 1];
    
    const dt = last.time - first.time;
    const dy = last.position - first.position;

    if (dt <= 0) return 0;
    
    // Return px/ms
    return dy / dt;
  }, []);

  const resetVelocityTracker = useCallback(() => {
    velocityRef.current.samples = [];
  }, []);

  // -------------------------------------------------------------------------
  // Momentum Engine
  // -------------------------------------------------------------------------
  const stopMomentum = useCallback(() => {
    if (momentumFrameRef.current !== null) {
      cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
  }, []);

  const startMomentumScroll = useCallback((initialVelocity: number) => {
    stopMomentum();
    
    // Invert because dragging UP (negative delta) moves scroll DOWN (positive scroll)
    // Apply multiplier to make it feel responsive
    let velocity = -initialVelocity * VELOCITY_MULTIPLIER;
    
    const scrollable = scrollableRef.current;
    if (!scrollable) return;

    lastFrameTimeRef.current = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const dt = Math.min(now - lastFrameTimeRef.current, 60); // Cap dt to prevent huge jumps on lag
      lastFrameTimeRef.current = now;

      // 1. Apply Friction adjusted for time (Frame independence)
      //    This mimics natural deceleration
      const frameRatio = dt / 16; 
      velocity *= Math.pow(FRICTION, frameRatio);

      // 2. Heavy Drag at low speeds (The "Weight" fix)
      //    Native scroll doesn't slide endlessly; it grabs near the end.
      if (Math.abs(velocity) < 0.5) {
         velocity *= Math.pow(0.90, frameRatio);
      }

      // 3. Stop threshold
      if (Math.abs(velocity) < STOP_VELOCITY) {
        momentumFrameRef.current = null;
        return;
      }

      // 4. Move
      const displacement = velocity * dt;
      const currentPos = getScrollPosition(scrollable);
      const newPos = currentPos + displacement;
      const maxS = maxScrollRef.current; // Use cached max
      
      // 5. Boundary Checks (Clamping)
      //    Note: We cannot do "Rubber Banding" easily with scrollTop 
      //    without causing visual jitter or needing CSS transforms.
      //    Hard clamping is the standard for non-transform scrolling.
      if (newPos <= 0) {
        setScrollPosition(scrollable, 0);
        momentumFrameRef.current = null;
        return;
      } else if (newPos >= maxS) {
        setScrollPosition(scrollable, maxS);
        momentumFrameRef.current = null;
        return;
      }

      setScrollPosition(scrollable, newPos);
      momentumFrameRef.current = requestAnimationFrame(animate);
    };
    
    momentumFrameRef.current = requestAnimationFrame(animate);
  }, [stopMomentum]);

  // -------------------------------------------------------------------------
  // Reset / Cleanup
  // -------------------------------------------------------------------------
  const reset = useCallback(() => {
    phaseRef.current = 'idle';
    activeIndexRef.current = -1;
    stopMomentum();
    resetVelocityTracker();

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Reset Scrub UI
    if (textRef.current) {
      textRef.current.textContent = originalTitleRef.current;
      textRef.current.style.opacity = "1";
      textRef.current.style.color = "";
      textRef.current.style.filter = "blur(0px)";
      textRef.current.style.transform = "translateY(0px)";
      textRef.current.style.transition = "";
    }
    if (trackRef.current) {
      trackRef.current.style.opacity = "0";
    }
  }, [textRef, trackRef, stopMomentum, resetVelocityTracker]);

  // -------------------------------------------------------------------------
  // Mode: Scrubbing
  // -------------------------------------------------------------------------
  const enterScrubMode = useCallback((currentY: number) => {
    phaseRef.current = 'scrubbing';
    scrubStartYRef.current = currentY;

    if (navigator.vibrate) navigator.vibrate(20);

    if (textRef.current) textRef.current.style.opacity = "0.5";

    if (trackRef.current) {
      const isRight = startXRef.current > window.innerWidth / 2;
      trackRef.current.style.left = isRight ? "0px" : "";
      trackRef.current.style.right = isRight ? "" : "0px";
      trackRef.current.style.opacity = "1";
    }

    if (progressRef.current && itemsRef.current.length > 0) {
      progressRef.current.style.top = "0%";
      progressRef.current.style.height = `${100 / itemsRef.current.length}%`;
    }
  }, [textRef, trackRef, progressRef]);

  const updateScrubIndex = useCallback((currentY: number) => {
    const items = itemsRef.current;
    if (items.length === 0) return;

    const deltaY = scrubStartYRef.current - currentY;
    if (Math.abs(deltaY) < DEADZONE) return;

    const effectiveDistance = deltaY > 0 ? deltaY - DEADZONE : deltaY + DEADZONE;
    const steps = Math.floor(effectiveDistance / ITEM_HEIGHT_THRESHOLD);
    const length = items.length;
    const newIndex = ((steps % length) + length) % length;

    if (progressRef.current) {
      progressRef.current.style.top = `${(newIndex / length) * 100}%`;
    }

    if (newIndex !== activeIndexRef.current) {
      activeIndexRef.current = newIndex;
      if (textRef.current) {
        textRef.current.textContent = items[newIndex].title;
        textRef.current.style.transition = "none";
        textRef.current.style.filter = "blur(1.5px)";
        textRef.current.style.color = "#ffffff";
        textRef.current.style.transform = deltaY > 0 ? "translateY(-2px)" : "translateY(2px)";

        requestAnimationFrame(() => {
          if (textRef.current) {
            textRef.current.style.transition = "all 0.15s ease-out";
            textRef.current.style.filter = "blur(0px)";
            textRef.current.style.color = "";
            textRef.current.style.transform = "translateY(0px)";
          }
        });
      }
      if (navigator.vibrate) navigator.vibrate(10);
    }
  }, [textRef, progressRef]);

  // -------------------------------------------------------------------------
  // Native Event Handlers
  // -------------------------------------------------------------------------
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current || itemsRef.current.length === 0) return;

      stopMomentum();
      resetVelocityTracker();

      const touch = e.touches[0];
      startYRef.current = touch.clientY;
      startXRef.current = touch.clientX;
      lastYRef.current = touch.clientY;
      phaseRef.current = 'deciding';
      activeIndexRef.current = -1;

      scrollableRef.current = getScrollableAncestor(wrapper);
      scrollStartPosRef.current = getScrollPosition(scrollableRef.current);
      maxScrollRef.current = getMaxScroll(scrollableRef.current);

      trackVelocity(touch.clientY);

      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        if (phaseRef.current === 'deciding') {
          enterScrubMode(startYRef.current);
        }
      }, LONG_PRESS_MS);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (phaseRef.current === 'idle' || phaseRef.current === 'cancelled') return;

      const touch = e.touches[0];
      const currentY = touch.clientY;
      const currentX = touch.clientX;
      const deltaY = currentY - startYRef.current;
      const deltaX = Math.abs(currentX - startXRef.current);

      if (e.cancelable) e.preventDefault();

      // --- DECIDING ---
      if (phaseRef.current === 'deciding') {
        if (deltaX > CANCEL_THRESHOLD_X) {
          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          phaseRef.current = 'cancelled';
          return;
        }

        if (Math.abs(deltaY) > SCROLL_THRESHOLD) {
          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          phaseRef.current = 'scrolling';
          // Immediately fall through to scrolling logic so we don't skip the first frame of movement
        } else {
          return;
        }
      }

      // --- SCROLLING ---
      if (phaseRef.current === 'scrolling') {
        trackVelocity(currentY);
        const scrollDelta = -deltaY; // Finger up = scroll down
        const newPos = scrollStartPosRef.current + scrollDelta;
        
        // Clamp immediately during drag (standard behavior for non-transform scroll)
        const clampedPos = Math.max(0, Math.min(maxScrollRef.current, newPos));
        setScrollPosition(scrollableRef.current, clampedPos);
        
        lastYRef.current = currentY;
      }

      // --- SCRUBBING ---
      else if (phaseRef.current === 'scrubbing') {
        if (deltaX > CANCEL_THRESHOLD_X) {
          if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
          reset();
          return;
        }
        updateScrubIndex(currentY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);

      if (phaseRef.current === 'scrolling') {
        // Calculate velocity one last time
        const velocity = calculateVelocity();
        // If speed is sufficient, trigger momentum
        if (Math.abs(velocity) > 0.1) {
          startMomentumScroll(velocity);
        } else {
            resetVelocityTracker();
        }
        phaseRef.current = 'idle';
        return;
      }

      if (phaseRef.current === 'scrubbing') {
        e.preventDefault();
        e.stopPropagation();
        const idx = activeIndexRef.current;
        if (idx !== -1 && itemsRef.current[idx]) {
          if (navigator.vibrate) navigator.vibrate(30);
          onNavigateRef.current([itemsRef.current[idx].id]);
        }
      }
      
      reset();
    };

    const handleTouchCancel = () => {
      reset();
    };

    // Passive: false is mandatory to prevent native scrolling
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: false });
    wrapper.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchcancel', handleTouchCancel);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      stopMomentum();
    };
  }, [
    wrapperRef, reset, enterScrubMode, updateScrubIndex, 
    trackVelocity, calculateVelocity, resetVelocityTracker, 
    startMomentumScroll, stopMomentum
  ]);

  return {
    onTouchStart: undefined,
    onTouchMove: undefined,
    onTouchEnd: undefined,
  };
};