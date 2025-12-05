// types/types.ts

import { ReactNode } from "react";

/**
 * Configuration for the Tesseract grid
 */
export interface TesseractConfig {
  columns?: number;           // Number of columns (default: 3)
  gap?: number;              // Gap between items in pixels (default: 8)
  expandDuration?: number;   // Expansion animation duration in seconds (default: 1.2)
  collapseDuration?: number; // Collapse animation duration in seconds (default: 0.8)
}

/**
 * Individual cell data for the Tesseract grid
 */
export interface TesseractCellData {
  // Identity
  id: string;                // Unique identifier for the cell
  title: string;             // Primary display text
  
  // Display Options
  subtitle?: string;         // Secondary display text
  content?: ReactNode;       // Content shown in collapsed state
  
  // Layout Control
  rowSpan?: number;          // Vertical height multiplier (default: 1)
  colSpan?: number;          // Horizontal width multiplier (default: 1)
  hideOnMobile?: boolean;    // Hide this item on mobile layouts
  
  // Hierarchy
  children?: TesseractCellData[]; // Nested grid items
  
  // Custom Expansion
  renderExpanded?: (props: {
    onClose: () => void;
    cell: TesseractCellData;
    path: string[];           // Current navigation path
    onNavigate: (newPath: string[]) => void; // Navigate to a new path
  }) => ReactNode;           // Custom component for expanded state
  
  // Behavior Flags
  isLeaf?: boolean;          // Prevents expansion (terminal node)
  disableHover?: boolean;    // Disables hover expansion effect
  
  // Styling
  themeColor?: string;       // Optional theme color override
}

/**
 * Unified interaction state for the Tesseract grid
 */
export interface TesseractState {
  hoveredItemId: string | null;
  hoveredColumnIndex: number | null;
  expandedItemId: string | null;
  expandedColumnIndex: number | null;
}

/**
 * Column distribution result
 */
export interface ColumnDistribution {
  distribution: Map<number, TesseractCellData[]>;
  positions: Map<string, { column: number; span: number }>;
}

/**
 * Props for expanded cell render function
 */
export interface ExpandedRenderProps {
  onClose: () => void;
  cell: TesseractCellData;
}