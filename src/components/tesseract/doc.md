# Tesseract - Enhanced Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Type Definitions](#type-definitions)
5. [Configuration Options](#configuration-options)
6. [Feature Examples](#feature-examples)
7. [Advanced Patterns](#advanced-patterns)
8. [Animation System](#animation-system)
9. [Mobile Implementation](#mobile-implementation)
10. [Best Practices](#best-practices)

-----

## Overview

Tesseract is a recursive, animated grid system designed for complex hierarchical data navigation. It utilizes a layout engine that distributes items into columns and handles fluid transitions between collapsed, hovered, and expanded states.

**Key Capabilities:**

* **Infinite Recursion:** Nested grids to arbitrary depths.
* **Variable Dimensions:** Support for items spanning multiple rows AND columns.
* **Configurable Layout:** Adjustable column count, gaps, and animation timings.
* **Polymorphic Expansion:** Items can expand into nested grids or custom React components.
* **State-Driven Navigation:** Path-based routing compatible with deep linking.
* **Performance:** Optimized rendering with Framer Motion layout projection.
* **Smooth Animations:** Zero jitter on all expansion types including custom components.
* **Mobile-Native:** Fully responsive with touch gestures, haptics, and snap scrolling.

-----

## Quick Start

### Basic Implementation

```typescript
import { Tesseract } from '@/components/tesseract';
import { TesseractCellData } from '@/types';
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
        config={{ columns: 3 }} // Optional configuration
      />
    </div>
  );
}
```

-----

## Core Concepts

### 1. Intelligent Column Distribution

The grid automatically distributes items into N columns (configurable) using an intelligent algorithm that:
- Balances column heights
- Respects `colSpan` and `rowSpan` values
- Optimally places multi-column items

### 2. Path-Based Navigation

Navigation is controlled by a string array representing the current hierarchy:

* `[]`: Root level
* `['projects']`: Inside "projects" node
* `['projects', 'backend']`: Inside "backend" node within "projects"

### 3. Expansion Logic

Items exist in three states:

1. **Idle:** Displays title, subtitle, and summary content.
2. **Hover:** Expands vertically (2x flex-grow) to reveal more detail.
3. **Active:** Expands to fill the parent container, rendering either `children` or `renderExpanded`.

### 4. Two-Dimensional Spanning

Items can now control their size in both dimensions:
- **rowSpan:** Vertical height multiplier (e.g., `rowSpan: 2` = 2x taller)
- **colSpan:** Horizontal width multiplier (e.g., `colSpan: 2` = spans 2 columns)

-----

## Type Definitions

### TesseractCellData

```typescript
interface TesseractCellData {
  // Identity
  id: string;                // Unique identifier
  title: string;             // Primary text
  
  // Display
  subtitle?: string;         // Secondary text
  content?: React.ReactNode; // Collapsed view content
  
  // Layout (NEW: colSpan now functional!)
  rowSpan?: number;          // Vertical height multiplier (Default: 1)
  colSpan?: number;          // Horizontal width multiplier (Default: 1)
  
  // Recursion
  children?: TesseractCellData[]; // Nested grid items
  
  // Custom Expansion
  renderExpanded?: (props: {
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

### TesseractConfig (NEW!)

```typescript
interface TesseractConfig {
  columns?: number;           // Number of columns (default: 3)
  gap?: number;              // Gap between items in pixels (default: 8)
  expandDuration?: number;   // Expansion duration in seconds (default: 1.2)
  collapseDuration?: number; // Collapse duration in seconds (default: 0.8)
}
```

-----

## Configuration Options

### Column Count

Adjust the number of columns to suit your layout:

```typescript
<Tesseract 
  items={items}
  path={path}
  onNavigate={setPath}
  config={{ columns: 4 }} // 4 columns instead of default 3
/>
```

### Gap Sizing

Control spacing between grid items:

```typescript
config={{ gap: 16 }} // Larger gaps (default: 8px)
```

### Animation Timing

Fine-tune animation speeds:

```typescript
config={{
  expandDuration: 1.5,    // Slower expansion (default: 1.2)
  collapseDuration: 0.6,  // Faster collapse (default: 0.8)
}}
```

-----

## Feature Examples

### 1. Nested Grid (Recursion)

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

### 2. Multi-Row Item (rowSpan)

```typescript
{
  id: "analytics",
  title: "Weekly Analytics",
  rowSpan: 2, // 2x vertical height
  content: <GraphPreview />
}
```

### 3. Multi-Column Item (colSpan)

```typescript
{
  id: "dashboard",
  title: "Wide Dashboard",
  colSpan: 2, // Spans 2 columns horizontally
  content: <DashboardPreview />
}
```

### 4. Combined Spanning

```typescript
{
  id: "hero",
  title: "Hero Section",
  rowSpan: 2,  // 2x taller
  colSpan: 2,  // 2x wider
  content: <HeroContent />
}
```

### 5. Custom UI Expansion 

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
Refer to native.md for guide to make performant components.

### 6. Static/Leaf Nodes

```typescript
{
  id: "status",
  title: "System Status: Online",
  isLeaf: true,
  disableHover: true,
  content: <StatusIndicator status="healthy" />
}
```

### 7. Reactive Internal Content (Hooks)
Use the useCellState hook to access the cell's hover/lock state. This eliminates "padding lag" and ensures your component animates exactly when the grid does.

```
import { useCellState } from '@/components/tesseract/TesseractCell';

const SmartButton = () => {
  const { isHovered } = useCellState(); // <--- Hook into parent state

  return (
    <div className={`transition-all duration-500 ${
      isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}>
      <button>View Details →</button>
    </div>
  );
};

// Usage in data
{
  id: "feature",
  title: "Smart Feature",
  content: <SmartButton />
}
```
-----

## Advanced Patterns

### Responsive Column Count

Adjust columns based on viewport:

```typescript
const [columns, setColumns] = useState(3);

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) setColumns(1);
    else if (window.innerWidth < 1200) setColumns(2);
    else setColumns(3);
  };
  
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

return <Tesseract config={{ columns }} {...props} />;
```

### Dynamic Data Loading

```typescript
const mapApiToGrid = (data: ApiResponse[]): TesseractCellData[] => {
  return data.map(item => ({
    id: item.uuid,
    title: item.name,
    colSpan: item.featured ? 2 : 1, // Featured items span 2 columns
    rowSpan: item.priority === 'high' ? 2 : 1,
    children: item.hasSubItems ? mapApiToGrid(item.subItems) : undefined
  }));
};
```

### Mixed Content Types

The grid handles mixed content gracefully:
- Folders (nested grids)
- Leaf nodes (static info)
- Applications (custom expanded views)
- Wide items (colSpan > 1)
- Tall items (rowSpan > 1)

All at the same hierarchy level!

-----

## Animation System

The animation logic uses CSS Flexbox transitions via Framer Motion.

### Flex-Grow Transition

* Idle items: `flex: 1`
* Hovered items: `flex: 2`
* Active items: `flex: 100`
* Siblings of active: `flex: 0.001`

### Timing (Configurable!)

* Expansion: `duration: 1.2s` (default), `ease: [0.22, 1, 0.36, 1]`
* Collapse: `duration: 0.8s` (default)
* Opacity: Delays applied to ensure layout stabilizes

### Custom Component Handling

Custom `renderExpanded` components are now wrapped in:
```typescript
<motion.div
  layout="preserve"
  initial={{ scale: 0.95 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0.95 }}
/>
```

This prevents jitter during collapse by:
1. Preserving layout during animation
2. Adding subtle scale transitions
3. Coordinating with parent flex transitions

-----

## Mobile Implementation

Tesseract now features a **fully native mobile experience** with the same beautiful animations as desktop.

### Key Mobile Features

- 🎯 Single-column layout optimized for touch
- 📱 Touch gestures (tap to expand, swipe-down to close)
- 🎆 Haptic feedback on interactions
- 📜 Snap scrolling with blur gradients
- ✨ 100% animation preservation
- 🔄 Full feature parity with desktop

### Quick Mobile Setup

```typescript
import { Tesseract } from "@/components/tesseract/Tesseract";
import { MobileScrollContainer } from "@/components/tesseract/MobileScrollContainer";
import { useMobileDetection } from "@/hooks/useMobileDetection";

export default function Page() {
  const { isMobile } = useMobileDetection();
  const [path, setPath] = useState<string[]>([]);

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[700px]">
      {isMobile ? (
        <MobileScrollContainer>
          <Tesseract
            items={items}
            path={path}
            onNavigate={setPath}
            config={{
              mobile: {
                columns: 1,
                gap: 12,
                enableHaptics: true,
                snapScroll: true,
                blurEdges: true,
                horizontalPadding: 16,
              }
            }}
          />
        </MobileScrollContainer>
      ) : (
        <Tesseract items={items} path={path} onNavigate={setPath} />
      )}
    </div>
  );
}
```

### Mobile Configuration

```typescript
config={{
  mobile: {
    columns?: number;              // Default: 1
    gap?: number;                  // Default: 12
    enableHaptics?: boolean;       // Default: true
    snapScroll?: boolean;          // Default: true
    blurEdges?: boolean;           // Default: true
    horizontalPadding?: number;    // Default: 16
  }
}}
```

### Mobile Utilities

**Hooks:**
- `useMobileDetection()` - Detect mobile viewport and touch capability
- `useHaptics()` - Trigger haptic feedback patterns

**Components:**
- `MobileScrollContainer` - Snap scrolling with blur edges

**Enhanced `useCellState()` hook:**
```typescript
const { isHovered, isLocked, isActive, isMobile } = useCellState();
// Now includes isMobile flag!
```

### Comprehensive Documentation

For complete mobile implementation details, see **[mobile-guide.md](./mobile-guide.md)** which includes:
- Architecture and component structure
- Touch gesture handling
- Haptic feedback patterns
- Performance optimizations
- Mobile-specific best practices
- Troubleshooting guide
- Migration guide
- API reference

-----

## Best Practices

### 1. Container Sizing
The parent of `<Tesseract />` must have a defined height.

### 2. colSpan Guidelines
- Use `colSpan` sparingly for featured/important items
- Keep `colSpan` values reasonable (≤ total columns)
- Consider responsive column counts with colSpan

### 3. Custom Expansion Layout
When using `renderExpanded`:
- Return components that use `w-full h-full`
- Ensure `onClose` callback is wired up
- Avoid complex animations that conflict with Tesseract's

### 4. Key Stability
Ensure `id`s are unique at each tree level to prevent animation glitches.

### 5. Performance
- For grids with 50+ items, consider virtualization
- Use `React.memo` on custom renderExpanded components
- Keep rowSpan/colSpan values reasonable

-----

## Complete Implementation Example

```typescript
"use client";

import { Tesseract } from '@/components/tesseract';
import { TesseractCellData } from '@/types';
import { Breadcrumb } from '@/components/breadcrumb';
import { useState } from 'react';

const rootItems: TesseractCellData[] = [
  { 
    id: "hero", 
    title: "Welcome", 
    subtitle: "Start Here",
    rowSpan: 2,
    colSpan: 2,
    content: <div className="text-lg">Featured content</div>
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
    colSpan: 2, 
    renderExpanded: ({ onClose }) => (
      <div className="w-full h-full bg-zinc-900 p-4">
        <button onClick={onClose}>Close</button>
        <pre className="text-green-400">System initialized...</pre>
      </div>
    )
  }
];

export default function Interface() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mb-4 h-8">
        <Breadcrumb 
          path={path} 
          rootItems={rootItems} 
          onNavigate={setPath} 
        />
      </div>
      
      <div className="w-full max-w-7xl h-[700px]">
        <Tesseract 
          items={rootItems} 
          path={path} 
          onNavigate={setPath}
          config={{
            columns: 3,           // Try 2, 4, or 5!
            gap: 12,              // Larger gaps
            expandDuration: 1.4,  // Slower expansion
            collapseDuration: 0.7 // Faster collapse
          }}
        />
      </div>
    </main>
  );
}

```

## Troubleshooting

### Q: colSpan items don't look right?
A: Ensure your column count supports the colSpan (e.g., colSpan: 3 in a 2-column grid won't work properly).

### Q: Still seeing jitter on custom components?
A: Ensure your custom component doesn't have conflicting animations or complex layout shifts. Use simple, flex-based layouts.

### Q: Performance issues with many items?
A: Consider reducing column count, using smaller gap values, or implementing virtualization for 100+ items.

### Q: Animations too fast/slow?
A: Adjust `expandDuration` and `collapseDuration` in the config object to your preference.