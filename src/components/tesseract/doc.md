# Tesseract - Technical Documentation

## Table of Contents

1.  [Overview](https://www.google.com/search?q=%23overview)
2.  [File Structure](https://www.google.com/search?q=%23file-structure)
3.  [Quick Start](https://www.google.com/search?q=%23quick-start)
4.  [Core Concepts](https://www.google.com/search?q=%23core-concepts)
5.  [Type Definitions](https://www.google.com/search?q=%23type-definitions)
6.  [Feature Examples](https://www.google.com/search?q=%23feature-examples)
7.  [Advanced Patterns](https://www.google.com/search?q=%23advanced-patterns)
8.  [Animation System](https://www.google.com/search?q=%23animation-system)
9.  [Best Practices](https://www.google.com/search?q=%23best-practices)
10. [API Reference](https://www.google.com/search?q=%23api-reference)

-----

## Overview

Tesseract is a recursive, animated grid system designed for complex hierarchical data navigation. It utilizes a layout engine that distributes items into columns and handles fluid transitions between collapsed, hovered, and expanded states.

**Key Capabilities:**

  * **Infinite Recursion:** Nested grids to arbitrary depths.
  * **Variable Dimensions:** Support for items spanning multiple rows.
  * **Polymorphic Expansion:** Items can expand into nested grids or custom React components (forms, terminals, dashboards).
  * **State-Driven Navigation:** Path-based routing compatible with deep linking.
  * **Performance:** Optimized rendering with Framer Motion layout projection.

-----

## File Structure

The component is architected using separation of concerns to ensure maintainability.

  * **`types.ts`**: Contains shared interfaces (`TesseractCellData`) to prevent circular dependencies.
  * **`TesseractCell.tsx`**: The presentation component responsible for rendering individual cards and handling local interaction events.
  * **`Tesseract.tsx`**: The orchestration component that manages the grid layout, column distribution, and global state.
  * **`index.ts`**: Barrel file for clean imports.

-----

## Quick Start

### Basic Implementation

```typescript
import { Tesseract } from '@/components/tesseract';
import { TesseractCellData } from '@/components/tesseract/types';
import { useState } from 'react';

const items: TesseractCellData[] = [
  { id: "about", title: "About Me", subtitle: "Learn More" },
  { id: "projects", title: "Projects", subtitle: "View Portfolio" },
  { id: "settings", title: "Settings", subtitle: "Configuration" },
];

export default function Page() {
  const [path, setPath] = useState<string[]>([]);
  
  return (
    <div className="w-full h-[700px]">
      <Tesseract 
        items={items}
        path={path}
        onNavigate={setPath}
      />
    </div>
  );
}
```

-----

## Core Concepts

### 1\. Column Distribution

The grid automatically distributes items into 3 vertical columns using a modulo operation. This ensures a balanced layout regardless of the number of items.

### 2\. Path-Based Navigation

Navigation is controlled by a string array representing the current hierarchy. This allows the grid to know exactly which item is active and at what depth.

  * `[]`: Root level
  * `['projects']`: Inside "projects" node
  * `['projects', 'backend']`: Inside "backend" node within "projects"

### 3\. Expansion Logic

Items exist in three states:

1.  **Idle:** Displays title, subtitle, and summary content.
2.  **Hover:** Expands vertically (2x flex-grow) to reveal more detail (unless disabled).
3.  **Active:** Expands to fill the parent container (100x flex-grow), rendering either `children` (nested grid) or `renderExpanded` (custom UI).

-----

## Type Definitions

The core data structure is `TesseractCellData`.

```typescript
interface TesseractCellData {
  // Identity
  id: string;                // Unique identifier
  title: string;             // Primary text
  
  // Display
  subtitle?: string;         // Secondary text
  content?: React.ReactNode; // Collapsed view content
  
  // Layout
  rowSpan?: number;          // Vertical height multiplier (Default: 1)
  colSpan?: number;          // Reserved for future use
  
  // Recursion
  children?: TesseractCellData[]; // Nested grid items
  
  // Custom Expansion
  renderExpanded?: (props: {      // Custom UI renderer
    onClose: () => void;
    cell: TesseractCellData;
  }) => React.ReactNode;
  
  // Configuration
  isLeaf?: boolean;          // Disables click/expansion logic
  disableHover?: boolean;    // Disables hover size expansion
  
  // Styling
  themeColor?: string;       // Optional theme override
}
```

-----

## Feature Examples

### 1\. Nested Grid (Recursion)

To create a folder-like structure, provide an array of items to the `children` property.

```typescript
{
  id: "projects",
  title: "Projects",
  children: [
    { id: "web", title: "Web Apps" },
    { id: "mobile", title: "Mobile Apps" }
  ]
}
```

### 2\. Custom Dimensions

Use `rowSpan` to emphasize specific items. A `rowSpan` of 2 makes the item twice as tall as standard items.

```typescript
{
  id: "analytics",
  title: "Weekly Analytics",
  rowSpan: 2, 
  content: <GraphPreview />
}
```

### 3\. Custom UI Expansion

Use `renderExpanded` to break out of the grid layout and render a full component (e.g., a Terminal, Form, or Canvas).

```typescript
{
  id: "cli",
  title: "Command Line",
  renderExpanded: ({ onClose, cell }) => (
    <TerminalComponent 
      onExit={onClose} 
      initialCommand="help" 
    />
  )
}
```

### 4\. Static/Leaf Nodes

Use `isLeaf` for items that convey information but should not trigger navigation. Use `disableHover` to prevent the layout shift effect on interaction.

```typescript
{
  id: "status",
  title: "System Status: Online",
  isLeaf: true,
  disableHover: true,
  content: <StatusIndicator status="healthy" />
}
```

-----

## Advanced Patterns

### Dynamic Data Loading

You can map API responses directly to `TesseractCellData`.

```typescript
const mapApiToGrid = (data: ApiResponse[]): TesseractCellData[] => {
  return data.map(item => ({
    id: item.uuid,
    title: item.name,
    children: item.hasSubItems ? mapApiToGrid(item.subItems) : undefined
  }));
};
```

### Mixed Content Types

The grid handles mixed content gracefully. You can have a folder (nested grid), a leaf node (static info), and an application (custom expanded view) all at the same hierarchy level.

### Breadcrumb Integration

The `Breadcrumb` component utilizes a drill-down lookup strategy to resolve titles from IDs, ensuring O(N) performance relative to path depth rather than tree size.

-----

## Animation System

The animation logic relies on CSS Flexbox transition via Framer Motion.

1.  **Flex-Grow Transition:**

      * Idle items have `flex: 1`.
      * Hovered items have `flex: 2`.
      * Active items have `flex: 100`.
      * Siblings of active items have `flex: 0.001`.

2.  **Timing:**

      * Expansion: `duration: 1.2s`, `ease: [0.22, 1, 0.36, 1]`
      * Collapse: `duration: 0.8s`
      * Opacity: Delays are applied to content entry to ensure layout stabilizes before text appears.

-----

## Best Practices

1.  **Container Sizing:** The parent of `<Tesseract />` must have a defined height (fixed pixels or percentage) because the grid uses `h-full`.
2.  **Custom Expansion Layout:** When using `renderExpanded`, the returned component should generally use `w-full h-full` to fill the expanded card area.
3.  **Close Handlers:** Always ensure your custom expanded components trigger the `onClose` callback provided in the props, otherwise the user will be trapped in the expanded state.
4.  **Key Stability:** Ensure `id`s are unique at their specific tree level to prevent animation glitches.

-----

## API Reference

### Tesseract Component

```typescript
interface TesseractProps {
  items: TesseractCellData[];        // Data array
  path: string[];                    // Navigation state
  onNavigate: (path: string[]) => void; // State setter
  className?: string;                // Optional styling
}
```

### Breadcrumb Component

```typescript
interface BreadcrumbProps {
  path: string[];
  rootItems: TesseractCellData[];
  onNavigate: (path: string[]) => void;
  className?: string;
}
```

-----

## Complete Implementation Example

```typescript
"use client";

import { Tesseract } from '@/components/tesseract';
import { TesseractCellData } from '@/components/tesseract/types';
import { Breadcrumb } from '@/components/breadcrumb';
import { useState } from 'react';

// Mock Data
const rootItems: TesseractCellData[] = [
  { 
    id: "dashboard", 
    title: "Dashboard", 
    subtitle: "Overview",
    rowSpan: 2 
  },
  { 
    id: "settings", 
    title: "Settings", 
    children: [
      { id: "profile", title: "Profile" },
      { id: "security", title: "Security" }
    ] 
  },
  { 
    id: "logs", 
    title: "System Logs", 
    renderExpanded: ({ onClose }) => (
      <div className="w-full h-full bg-zinc-900 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-white">Logs</h2>
          <button onClick={onClose} className="text-red-400">Close</button>
        </div>
        <pre className="text-green-400 font-mono text-sm">System initialized...</pre>
      </div>
    )
  }
];

export default function Interface() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      {/* Navigation Header */}
      <div className="w-full max-w-7xl mb-4 h-8 flex items-center">
        <Breadcrumb 
          path={path} 
          rootItems={rootItems} 
          onNavigate={setPath} 
        />
      </div>
      
      {/* Main Interface */}
      <div className="w-full max-w-7xl h-[700px]">
        <Tesseract 
          items={rootItems} 
          path={path} 
          onNavigate={setPath} 
        />
      </div>
    </main>
  );
}
