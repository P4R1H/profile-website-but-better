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

// ============================================================================
// MOBILE SCRUBBER - Hybrid Approach with Manual Scroll Simulation
// ============================================================================
// 
// ARCHITECTURE:
// The fundamental problem is that `touch-action` is evaluated at touchstart and
// cannot be changed mid-gesture. If we use `touch-action: none`, browser won't
// scroll but our scrubbing works. If we allow scroll, we can't reliably take
// over the gesture for scrubbing.
//
// SOLUTION: Use `touch-action: none` to take full control, then manually
// simulate scrolling for quick swipes. This gives us:
// - Quick swipe → Manual scroll (we simulate it)
// - Long-press → Scrub mode
//
// The trade-off is losing native scroll momentum, but we implement basic
// momentum physics to compensate.
// ============================================================================

type GesturePhase = 'idle' | 'deciding' | 'scrolling' | 'scrubbing' | 'cancelled';

interface VelocitySample {
  time: number;
  position: number;
}

interface VelocityTracker {
  samples: VelocitySample[];
  maxAge: number; // Max age in ms to keep samples
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

// Find the nearest scrollable ancestor
function getScrollableAncestor(element: HTMLElement | null): HTMLElement | Window | null {
  if (typeof window === 'undefined') return null;
  if (!element) return window;
  
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
    const canScroll = current.scrollHeight > current.clientHeight;
    
    if (isScrollable && canScroll) {
      return current;
    }
    current = current.parentElement;
  }
  
  return window;
}

function getScrollPosition(scrollable: HTMLElement | Window | null): number {
  if (typeof window === 'undefined' || !scrollable) return 0;
  if (scrollable === window) {
    return window.scrollY;
  }
  return (scrollable as HTMLElement).scrollTop;
}

function setScrollPosition(scrollable: HTMLElement | Window | null, position: number): void {
  if (typeof window === 'undefined' || !scrollable) return;
  if (scrollable === window) {
    window.scrollTo(0, position);
  } else {
    (scrollable as HTMLElement).scrollTop = position;
  }
}

function getMaxScroll(scrollable: HTMLElement | Window | null): number {
  if (typeof window === 'undefined' || !scrollable) return 0;
  if (scrollable === window) {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
  const el = scrollable as HTMLElement;
  return el.scrollHeight - el.clientHeight;
}

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
  // All mutable state in refs to avoid stale closures
  const phaseRef = useRef<GesturePhase>('idle');
  const startYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const activeIndexRef = useRef<number>(-1);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrubStartYRef = useRef<number>(0);
  
  // Scroll simulation state
  const scrollableRef = useRef<HTMLElement | Window | null>(null);
  const scrollStartPosRef = useRef<number>(0);
  const maxScrollRef = useRef<number>(0); // Cached to avoid layout thrashing
  const velocityRef = useRef<VelocityTracker>({
    samples: [],
    maxAge: 100, // Only use samples from last 100ms for velocity calc
  });
  const momentumFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Stable refs for props
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

  // Configuration
  const LONG_PRESS_MS = 400;
  const ITEM_HEIGHT_THRESHOLD = 35;
  const DEADZONE = 10;
  const CANCEL_THRESHOLD_X = 60;
  const SCROLL_THRESHOLD = 8; // Pixels of movement to commit to scrolling
  
  // Momentum physics (time-based)
  // Deceleration rate per millisecond - tuned to approximate native iOS/Android feel
  // Native uses ~0.998 but we use slightly lower for snappier stop
  const DECELERATION_RATE = 0.994;
  const MIN_VELOCITY = 0.01; // px/ms threshold to stop animation

  // -------------------------------------------------------------------------
  // Velocity Tracking for Momentum (Time-Based)
  // -------------------------------------------------------------------------
  const trackVelocity = useCallback((position: number) => {
    const tracker = velocityRef.current;
    const now = performance.now();
    
    // Add new sample
    tracker.samples.push({ time: now, position });
    
    // Prune samples older than maxAge
    const cutoff = now - tracker.maxAge;
    while (tracker.samples.length > 0 && tracker.samples[0].time < cutoff) {
      tracker.samples.shift();
    }
  }, []);

  const calculateVelocity = useCallback((): number => {
    const tracker = velocityRef.current;
    if (tracker.samples.length < 2) return 0;
    
    const first = tracker.samples[0];
    const last = tracker.samples[tracker.samples.length - 1];
    const dt = last.time - first.time;
    if (dt === 0) return 0;
    
    const dy = last.position - first.position;
    // Return velocity in px/ms (not per frame)
    return dy / dt;
  }, []);

  const resetVelocityTracker = useCallback(() => {
    velocityRef.current.samples = [];
  }, []);

  // -------------------------------------------------------------------------
  // Momentum Scroll Animation
  // -------------------------------------------------------------------------
  const stopMomentum = useCallback(() => {
    if (momentumFrameRef.current !== null) {
      cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
  }, []);

  const startMomentumScroll = useCallback((initialVelocity: number) => {
    stopMomentum();
    
    let velocity = initialVelocity; // px/ms
    const scrollable = scrollableRef.current;
    const maxScroll = maxScrollRef.current;
    lastFrameTimeRef.current = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const dt = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      
      // Skip if dt is too large (tab was hidden, etc)
      if (dt > 100) {
        momentumFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Time-based deceleration: velocity decays exponentially over time
      velocity *= Math.pow(DECELERATION_RATE, dt);
      
      // Stop if velocity is negligible
      if (Math.abs(velocity) < MIN_VELOCITY) {
        momentumFrameRef.current = null;
        return;
      }
      
      // Calculate displacement: velocity (px/ms) * time (ms) = pixels
      const displacement = velocity * dt;
      const currentPos = getScrollPosition(scrollable);
      const newPos = Math.max(0, Math.min(maxScroll, currentPos - displacement));
      
      setScrollPosition(scrollable, newPos);
      
      // Stop at boundaries
      if (newPos <= 0 || newPos >= maxScroll) {
        momentumFrameRef.current = null;
        return;
      }
      
      momentumFrameRef.current = requestAnimationFrame(animate);
    };
    
    momentumFrameRef.current = requestAnimationFrame(animate);
  }, [stopMomentum]);

  // -------------------------------------------------------------------------
  // Reset Function
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

    // Reset scrub UI
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
  // Enter Scrub Mode
  // -------------------------------------------------------------------------
  const enterScrubMode = useCallback((currentY: number) => {
    phaseRef.current = 'scrubbing';
    scrubStartYRef.current = currentY;

    if (navigator.vibrate) navigator.vibrate(20);

    if (textRef.current) {
      textRef.current.style.opacity = "0.5";
    }

    if (trackRef.current) {
      const isRightSideTouch = startXRef.current > window.innerWidth / 2;
      trackRef.current.style.left = "";
      trackRef.current.style.right = "";

      if (isRightSideTouch) {
        trackRef.current.style.left = "0px";
      } else {
        trackRef.current.style.right = "0px";
      }
      trackRef.current.style.opacity = "1";
    }

    if (progressRef.current && itemsRef.current.length > 0) {
      progressRef.current.style.top = "0%";
      const thumbHeight = 100 / itemsRef.current.length;
      progressRef.current.style.height = `${thumbHeight}%`;
    }
  }, [textRef, trackRef, progressRef]);

  // -------------------------------------------------------------------------
  // Update Scrub Index
  // -------------------------------------------------------------------------
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
      const percent = (newIndex / length) * 100;
      progressRef.current.style.top = `${percent}%`;
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

      // Find and cache the scrollable ancestor and its max scroll
      scrollableRef.current = getScrollableAncestor(wrapper);
      scrollStartPosRef.current = getScrollPosition(scrollableRef.current);
      maxScrollRef.current = getMaxScroll(scrollableRef.current);

      // Track initial position for velocity
      trackVelocity(touch.clientY);

      // Start long-press timer
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        if (phaseRef.current === 'deciding') {
          enterScrubMode(startYRef.current);
        }
      }, LONG_PRESS_MS);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const phase = phaseRef.current;
      if (phase === 'idle' || phase === 'cancelled') return;

      const touch = e.touches[0];
      const currentY = touch.clientY;
      const currentX = touch.clientX;
      const deltaYFromStart = currentY - startYRef.current;
      const deltaXFromStart = Math.abs(currentX - startXRef.current);

      // Always prevent default since we have touch-action: none
      // and we're handling all touch behavior ourselves
      if (e.cancelable) {
        e.preventDefault();
      }

      // --- DECIDING PHASE ---
      if (phase === 'deciding') {
        // Horizontal cancel
        if (deltaXFromStart > CANCEL_THRESHOLD_X) {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          phaseRef.current = 'cancelled';
          return;
        }

        // Check if user wants to scroll (significant vertical movement)
        if (Math.abs(deltaYFromStart) > SCROLL_THRESHOLD) {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          phaseRef.current = 'scrolling';
          // Fall through to scrolling handling
        } else {
          // Still deciding, waiting for long-press
          return;
        }
      }

      // --- SCROLLING PHASE (Manual Scroll Simulation) ---
      if (phase === 'scrolling' || phaseRef.current === 'scrolling') {
        // Track velocity for momentum
        trackVelocity(currentY);

        // Calculate new scroll position
        // Negative deltaY (finger moved up) = scroll down (increase scrollTop)
        const scrollDelta = -deltaYFromStart;
        const newScrollPos = scrollStartPosRef.current + scrollDelta;
        
        // Use cached maxScroll to avoid layout thrashing
        const clampedPos = Math.max(0, Math.min(maxScrollRef.current, newScrollPos));
        setScrollPosition(scrollableRef.current, clampedPos);

        lastYRef.current = currentY;
        return;
      }

      // --- SCRUBBING PHASE ---
      if (phase === 'scrubbing') {
        // Check for horizontal cancel
        if (deltaXFromStart > CANCEL_THRESHOLD_X) {
          if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
          reset();
          return;
        }

        updateScrubIndex(currentY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const phase = phaseRef.current;

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      // Start momentum scroll if we were scrolling
      if (phase === 'scrolling') {
        const velocity = calculateVelocity();
        if (Math.abs(velocity) > MIN_VELOCITY) {
          startMomentumScroll(velocity);
        }
        phaseRef.current = 'idle';
        resetVelocityTracker();
        return;
      }

      // Handle scrub completion
      if (phase === 'scrubbing') {
        e.preventDefault();
        e.stopPropagation();

        const items = itemsRef.current;
        const activeIndex = activeIndexRef.current;
        if (activeIndex !== -1 && items[activeIndex]) {
          if (navigator.vibrate) navigator.vibrate(30);
          onNavigateRef.current([items[activeIndex].id]);
        }
      }

      reset();
    };

    const handleTouchCancel = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      reset();
    };

    // Attach native listeners
    // All listeners need { passive: false } to allow preventDefault
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: false });
    wrapper.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchcancel', handleTouchCancel);

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      stopMomentum();
    };
  }, [
    wrapperRef,
    reset,
    enterScrubMode,
    updateScrubIndex,
    trackVelocity,
    calculateVelocity,
    resetVelocityTracker,
    startMomentumScroll,
    stopMomentum,
  ]);

  // Cleanup
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Return empty - native listeners handle everything
  return {
    onTouchStart: undefined,
    onTouchMove: undefined,
    onTouchEnd: undefined,
  };
};