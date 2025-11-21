"use client";

import { useCallback, useRef } from "react";

export interface LongPressOptions {
  /** Duration in ms before triggering long press (default: 500) */
  threshold?: number;
  /** Called when long press threshold is met */
  onLongPress?: () => void;
  /** Called when press starts (both tap and long press) */
  onPressStart?: () => void;
  /** Called when press ends (release) */
  onPressEnd?: () => void;
  /** Called on tap (short press) */
  onTap?: () => void;
}

export interface LongPressHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: (e: React.TouchEvent) => void;
}

/**
 * Hook for detecting long press (hold) gestures.
 * Used for mobile "hold to preview" interaction.
 *
 * Usage:
 * ```tsx
 * const longPressHandlers = useLongPress({
 *   threshold: 500,
 *   onLongPress: () => setIsPreview(true),
 *   onPressEnd: () => setIsPreview(false),
 * });
 *
 * <div {...longPressHandlers}>Hold me</div>
 * ```
 */
export const useLongPress = ({
  threshold = 500,
  onLongPress,
  onPressStart,
  onPressEnd,
  onTap,
}: LongPressOptions): LongPressHandlers => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);

  const startPress = useCallback(() => {
    isLongPressRef.current = false;
    hasMoved.current = false;
    onPressStart?.();

    // Set timer for long press
    timerRef.current = setTimeout(() => {
      if (!hasMoved.current) {
        isLongPressRef.current = true;
        onLongPress?.();
      }
    }, threshold);
  }, [threshold, onLongPress, onPressStart]);

  const endPress = useCallback((wasTap: boolean = false) => {
    // Clear timer if still running
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // If it was a tap (short press, no movement), trigger onTap
    if (wasTap && !isLongPressRef.current && !hasMoved.current) {
      onTap?.();
    }

    // Call onPressEnd regardless of whether it was a long press
    onPressEnd?.();

    // Reset flags
    isLongPressRef.current = false;
    hasMoved.current = false;
    touchStartPos.current = null;
  }, [onPressEnd, onTap]);

  const cancelPress = useCallback(() => {
    // Clear timer and reset without calling onPressEnd
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isLongPressRef.current = false;
    hasMoved.current = false;
    touchStartPos.current = null;
  }, []);

  // Mouse handlers (for desktop testing)
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only respond to left click
      if (e.button === 0) {
        startPress();
      }
    },
    [startPress]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      endPress();
    },
    [endPress]
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      // Cancel if mouse leaves during press
      cancelPress();
    },
    [cancelPress]
  );

  // Touch handlers (for mobile)
  // CRITICAL: Do NOT preventDefault to allow scrolling
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      startPress();
    },
    [startPress]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      // If user moves their finger significantly, it's a scroll, not a tap
      if (touchStartPos.current) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

        // Movement threshold: 10px
        if (deltaX > 10 || deltaY > 10) {
          hasMoved.current = true;
          cancelPress(); // Cancel long press if user is scrolling
        }
      }
    },
    [cancelPress]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      endPress(true); // true = this was a potential tap
    },
    [endPress]
  );

  const onTouchCancel = useCallback(
    (e: React.TouchEvent) => {
      // Touch was interrupted (e.g., system gesture)
      cancelPress();
    },
    [cancelPress]
  );

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  };
};
