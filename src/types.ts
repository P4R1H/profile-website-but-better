import React from "react";

export interface TesseractCellData {
  id: string;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  children?: TesseractCellData[]; // Recursive definition
  colSpan?: number; 
  rowSpan?: number; // Controls vertical size (default: 1)
  themeColor?: string;
  
  // Custom expansion behavior
  renderExpanded?: (props: {
    onClose: () => void;
    cell: TesseractCellData;
  }) => React.ReactNode;
  
  // Leaf node configuration
  isLeaf?: boolean; 
  disableHover?: boolean; 
}