import { useState, useEffect, useCallback, useRef } from "react";

export function useMediaQuery(query: string, defaultValue: boolean = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const media = window.matchMedia(query);
    // Update matches if the initial value was different from the actual media query result
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
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

      // Store initial touch position
      if ('touches' in event) {
        startX.current = event.touches[0].clientX;
        startY.current = event.touches[0].clientY;
      }

      timerRef.current = setTimeout(() => {
        timerRef.current = null; // Clear ref so move doesn't process anymore
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

      // If moved more than 10px, cancel long press
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
