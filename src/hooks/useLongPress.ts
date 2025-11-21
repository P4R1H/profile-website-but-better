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
}

export interface LongPressHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
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
}: LongPressOptions): LongPressHandlers => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = useCallback(() => {
    isLongPressRef.current = false;
    onPressStart?.();

    // Set timer for long press
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress?.();
    }, threshold);
  }, [threshold, onLongPress, onPressStart]);

  const endPress = useCallback(() => {
    // Clear timer if still running
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Call onPressEnd regardless of whether it was a long press
    onPressEnd?.();

    // Reset flag
    isLongPressRef.current = false;
  }, [onPressEnd]);

  const cancelPress = useCallback(() => {
    // Clear timer and reset without calling onPressEnd
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  // Mouse handlers (for desktop testing)
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only respond to left click
      if (e.button === 0) {
        e.preventDefault();
        startPress();
      }
    },
    [startPress]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
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
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Don't prevent default to allow scrolling if not held
      startPress();
    },
    [startPress]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      endPress();
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
    onTouchEnd,
    onTouchCancel,
  };
};
