import React from "react";

export interface TesseractCellData {
  id: string;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  children?: TesseractCellData[]; // Recursive definition
  
  // Layout configuration
  colSpan?: number; // Horizontal span (1-columns, default: 1)
  rowSpan?: number; // Vertical span multiplier (default: 1)
  themeColor?: string;
  
  // Custom expansion behavior
  renderExpanded?: (props: {
    onClose: () => void;
    cell: TesseractCellData;
  }) => React.ReactNode;
  
  // Leaf node configuration
  isLeaf?: boolean; 
  disableHover?: boolean;
  hideOnMobile?: boolean;
}

export interface TesseractConfig {
  columns?: number; // Number of columns (default: 3)
  gap?: number; // Gap between items in pixels (default: 8)
  expandDuration?: number; // Expansion animation duration in seconds (default: 1.2)
  collapseDuration?: number; // Collapse animation duration in seconds (default: 0.8)
}