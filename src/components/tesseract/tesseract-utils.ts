import { TesseractCellData, TesseractConfig } from "@/types/types";

// --- Constants ---
export const DEFAULT_CONFIG: Required<TesseractConfig> = {
  columns: 3,
  gap: 8,
  expandDuration: 1.2,
  collapseDuration: 0.8,
};

// --- Types ---
export type ProcessedCell = TesseractCellData & {
  _spanStart?: number;
  _actualColSpan?: number;
};

// --- Layout Engine ---
/**
 * Distributes a flat list of items into N balanced columns,
 * handling rowSpan and colSpan logic.
 */
export const distributeItemsToColumns = (
  items: TesseractCellData[],
  columns: number,
  isMobile: boolean
): ProcessedCell[][] => {
  // 1. Initialize columns
  const dist: ProcessedCell[][] = Array.from({ length: columns }, () => []);
  const columnHeights = new Array(columns).fill(0);

  // 2. Filter hidden items
  const visibleItems = items.filter((item) => !isMobile || !item.hideOnMobile);

  // 3. Distribute
  visibleItems.forEach((item) => {
    // Clamp colSpan to max available columns
    const itemColSpan = Math.min(item.colSpan ?? 1, columns);
    const itemRowSpan = item.rowSpan ?? 1;

    if (itemColSpan === 1) {
      // SIMPLE CASE: Add to shortest column
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      dist[minHeightIndex].push(item);
      columnHeights[minHeightIndex] += itemRowSpan;
    } else {
      // COMPLEX CASE: Find best fit for multi-column item
      let bestStartCol = 0;
      let minSpanHeight = Infinity;

      // Scan possible start positions
      for (let col = 0; col <= columns - itemColSpan; col++) {
        // Height of this specific span of columns
        const spanHeight = Math.max(...columnHeights.slice(col, col + itemColSpan));
        if (spanHeight < minSpanHeight) {
          minSpanHeight = spanHeight;
          bestStartCol = col;
        }
      }

      // Add item with metadata
      const itemWithSpan: ProcessedCell = {
        ...item,
        _spanStart: bestStartCol,
        _actualColSpan: itemColSpan,
      };
      dist[bestStartCol].push(itemWithSpan);

      // Update heights for all affected columns
      for (let i = 0; i < itemColSpan; i++) {
        columnHeights[bestStartCol + i] = minSpanHeight + itemRowSpan;
      }
    }
  });

  return dist;
};