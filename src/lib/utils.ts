import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Haptic feedback types for mobile devices.
 */
export type HapticType = "light" | "medium" | "heavy" | "selection";

/**
 * Triggers haptic feedback on supported devices.
 * Gracefully degrades on devices/browsers that don't support haptics.
 *
 * @param type - Type of haptic feedback
 * @returns true if haptic was triggered, false if not supported
 */
export function triggerHaptic(type: HapticType = "light"): boolean {
  // Check if running in browser
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  try {
    // Vibration API (supported on Android, some browsers)
    if ("vibrate" in navigator) {
      const patterns: Record<HapticType, number[]> = {
        light: [10], // Short, light tap
        medium: [20], // Medium tap
        heavy: [30], // Strong tap
        selection: [5], // Very subtle, for selections
      };

      const pattern = patterns[type] || patterns.light;
      navigator.vibrate(pattern);
      return true;
    }

    // iOS Safari doesn't support vibration API well
    // But we can still return false gracefully
    return false;
  } catch (error) {
    // Haptics failed - this is okay, they're optional
    console.debug("Haptic feedback not available:", error);
    return false;
  }
}
