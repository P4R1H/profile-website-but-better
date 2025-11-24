# Tesseract Grid Component - Technical Documentation

## Overview

Tesseract is a recursive, animated grid system designed for complex hierarchical data navigation. It features fluid push/pull animations, multi-dimensional spanning, and seamless transitions between collapsed, hovered, and expanded states.

## Architecture

### Core Principles

1. **Immutable Data Flow**: No mutations of input data
2. **Context-Driven State**: Centralized state management via React Context
3. **Separation of Concerns**: Clear component boundaries and responsibilities
4. **Performance by Design**: Efficient rendering without excessive memoization

### Component Structure

```
TesseractProvider (Context)
└── Tesseract (Grid Container)
    └── Motion Column Wrappers
        └── TesseractCell (Individual Cells)
            ├── CollapsedContent
            ├── ExpandedContent
            │   └── Tesseract (Recursive) OR Custom Component
            └── HoverOverlay
```

## API Reference

### Tesseract Component

The main grid container component.

```typescript
interface TesseractProps {
  items: TesseractCellData[];       // Array of cell data
  path: string[];                    // Current navigation path
  onNavigate: (path: string[]) => void; // Navigation callback
  level?: number;                    // Recursion depth (internal)
  className?: string;                // Additional CSS classes
  config?: TesseractConfig;          // Grid configuration
}
```

#### Usage Example

```tsx
import { Tesseract } from '@/components/tesseract';
import { useState } from 'react';

function App() {
  const [path, setPath] = useState<string[]>([]);
  
  return (
    <div className="h-screen">
      <Tesseract 
        items={gridItems}
        path={path}
        onNavigate={setPath}
        config={{
          columns: 3,
          gap: 12,
          expandDuration: 1.2,
          collapseDuration: 0.8
        }}
      />
    </div>
  );
}
```

### TesseractCellData Interface

Defines the structure of each grid cell.

```typescript
interface TesseractCellData {
  // Required
  id: string;                        // Unique identifier
  title: string;                     // Primary text
  
  // Display
  subtitle?: string;                 // Secondary text
  content?: ReactNode;               // Collapsed state content
  
  // Layout
  rowSpan?: number;                  // Vertical multiplier (default: 1)
  colSpan?: number;                  // Horizontal multiplier (default: 1)
  hideOnMobile?: boolean;            // Hide on mobile layouts
  
  // Hierarchy
  children?: TesseractCellData[];    // Nested grid items
  
  // Custom Expansion
  renderExpanded?: (props: {         // Custom expanded view
    onClose: () => void;
    cell: TesseractCellData;
  }) => ReactNode;
  
  // Behavior
  isLeaf?: boolean;                  // Disable expansion
  disableHover?: boolean;            // Disable hover effects
  
  // Styling
  themeColor?: string;               // Theme override
}
```

### TesseractConfig Interface

Configuration options for the grid.

```typescript
interface TesseractConfig {
  columns?: number;           // Grid columns (default: 3)
  gap?: number;              // Gap in pixels (default: 8)
  expandDuration?: number;   // Expand animation (default: 1.2s)
  collapseDuration?: number; // Collapse animation (default: 0.8s)
}
```

## Features

### 1. Multi-Dimensional Spanning

Items can span multiple rows and columns:

```typescript
const items: TesseractCellData[] = [
  {
    id: "hero",
    title: "Hero Section",
    rowSpan: 2,  // 2x height
    colSpan: 2,  // 2x width
    content: <HeroContent />
  },
  {
    id: "sidebar",
    title: "Sidebar",
    rowSpan: 3,  // 3x height
    content: <SidebarContent />
  }
];
```

### 2. Recursive Nesting

Create infinitely nested grid hierarchies:

```typescript
const items: TesseractCellData[] = [
  {
    id: "projects",
    title: "Projects",
    children: [
      {
        id: "web",
        title: "Web Apps",
        children: [
          { id: "react", title: "React Projects" },
          { id: "vue", title: "Vue Projects" }
        ]
      },
      {
        id: "mobile",
        title: "Mobile Apps"
      }
    ]
  }
];
```

### 3. Custom Expanded Views

Render custom components in expanded state:

```typescript
const items: TesseractCellData[] = [
  {
    id: "terminal",
    title: "Terminal",
    renderExpanded: ({ onClose }) => (
      <TerminalEmulator 
        onExit={onClose}
        initialCommand="help"
      />
    )
  }
];
```

### 4. State Hook Integration

Access cell state within content components:

```typescript
import { useCellState } from '@/components/tesseract';

const InteractiveContent: React.FC<{ cellId: string }> = ({ cellId }) => {
  const { isHovered, isActive, isExpanded } = useCellState(cellId);
  
  return (
    <div className={`transition-all ${isHovered ? 'scale-105' : 'scale-100'}`}>
      {isExpanded && <DetailedView />}
      {!isExpanded && <SummaryView />}
    </div>
  );
};

// Usage in cell data
{
  id: "interactive",
  title: "Interactive Cell",
  content: <InteractiveContent cellId="interactive" />
}
```

### 5. Mobile Optimization

Automatic mobile adaptations:
- Long-press for hover preview
- Single column layout
- Touch-optimized interactions
- Scroll indicators

```typescript
// Responsive configuration
const [columns, setColumns] = useState(3);

useEffect(() => {
  const updateColumns = () => {
    setColumns(window.innerWidth < 768 ? 1 : 3);
  };
  
  updateColumns();
  window.addEventListener('resize', updateColumns);
  return () => window.removeEventListener('resize', updateColumns);
}, []);

<Tesseract config={{ columns }} {...props} />
```

## Animation System

### Core Animation Principles

The Tesseract uses a flex-based animation system:

```
Idle state:     flex: 1
Hover state:    flex: 2
Active state:   flex: 100
Inactive:       flex: 0.001
```

### Animation Configuration

```typescript
const config: TesseractConfig = {
  expandDuration: 1.5,    // Slower expansion
  collapseDuration: 0.6,  // Faster collapse
};
```

### Animation Coordination

The component uses Framer Motion's layout animation system:

```tsx
<motion.div
  layout
  transition={{
    layout: {
      duration: expandDuration,
      ease: [0.22, 1, 0.36, 1]  // Custom easing
    }
  }}
>
  {content}
</motion.div>
```

## Context API

### TesseractContext

Access grid-wide state and configuration:

```typescript
import { useTesseractContext } from '@/components/tesseract';

const Component = () => {
  const { 
    config,      // Grid configuration
    state,       // Interaction state
    isLocked,    // Is an item expanded?
    activeId,    // Currently active item
    isMobile     // Mobile detection
  } = useTesseractContext();
  
  // Use context values
};
```

### useCellState Hook

Access individual cell state:

```typescript
import { useCellState } from '@/components/tesseract';

const CellContent = ({ cellId }: { cellId: string }) => {
  const {
    isHovered,   // Is this cell hovered?
    isLocked,    // Is grid locked?
    isActive,    // Is this cell active?
    isExpanded   // Is this cell expanded?
  } = useCellState(cellId);
  
  // React to state changes
};
```

## Advanced Patterns

### Dynamic Data Loading

```typescript
const [items, setItems] = useState<TesseractCellData[]>([]);

useEffect(() => {
  async function loadData() {
    const response = await fetch('/api/grid-data');
    const data = await response.json();
    
    const gridItems = data.map(item => ({
      id: item.uuid,
      title: item.name,
      subtitle: item.category,
      colSpan: item.featured ? 2 : 1,
      rowSpan: item.priority === 'high' ? 2 : 1,
      children: item.children ? mapChildren(item.children) : undefined
    }));
    
    setItems(gridItems);
  }
  
  loadData();
}, []);
```

### Theme Integration

```typescript
const themedItems: TesseractCellData[] = items.map(item => ({
  ...item,
  themeColor: getThemeColor(item.category),
  content: (
    <div style={{ borderColor: item.themeColor }}>
      {item.content}
    </div>
  )
}));
```

### Performance Optimization

For large datasets (50+ items):

```typescript
// 1. Limit visible depth
const MAX_DEPTH = 3;

// 2. Lazy load children
const lazyItem: TesseractCellData = {
  id: "lazy",
  title: "Load More",
  renderExpanded: ({ onClose }) => {
    const [children, setChildren] = useState<TesseractCellData[]>([]);
    
    useEffect(() => {
      loadChildren().then(setChildren);
    }, []);
    
    return children.length > 0 
      ? <Tesseract items={children} />
      : <Loading />;
  }
};

// 3. Use windowing for very large lists
import { VirtualGrid } from '@/components/virtual';

const virtualizedGrid = (
  <VirtualGrid
    items={items}
    renderItem={(item) => <TesseractCell {...item} />}
  />
);
```

## Best Practices

### 1. Container Requirements

The parent container must have defined dimensions:

```tsx
// Good
<div className="h-screen">
  <Tesseract {...props} />
</div>

// Bad - No height defined
<div>
  <Tesseract {...props} />
</div>
```

### 2. Unique IDs

Ensure IDs are unique within each level:

```typescript
// Good
const items = [
  { id: "home-1", title: "Home" },
  { id: "about-1", title: "About" }
];

// Bad - Duplicate IDs
const items = [
  { id: "item", title: "Item 1" },
  { id: "item", title: "Item 2" }  // Duplicate ID!
];
```

### 3. Responsive Design

Always consider mobile layouts:

```typescript
const items: TesseractCellData[] = [
  {
    id: "desktop-only",
    title: "Desktop Feature",
    hideOnMobile: true,
    colSpan: 3
  },
  {
    id: "mobile-friendly",
    title: "Works Everywhere",
    colSpan: 1  // Works on mobile
  }
];
```

### 4. Animation Performance

Keep animations smooth:

```typescript
// Good - Let Tesseract handle animations
const content = <SimpleContent />;

// Avoid - Conflicting animations
const content = (
  <motion.div animate={{ scale: [1, 2, 1] }}>
    Complex animation that might conflict
  </motion.div>
);
```

### 5. Content Guidelines

Design content for both states:

```typescript
const cellContent = (
  <>
    {/* Always visible */}
    <h4>Summary</h4>
    
    {/* Show on hover/expand */}
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DetailedInfo />
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
```

## Troubleshooting

### Issue: Animations are janky

**Solution**: Check for conflicting CSS transitions or animations in child components.

### Issue: Multi-column items don't display correctly

**Solution**: Ensure `colSpan` values don't exceed the total column count.

### Issue: Mobile interactions not working

**Solution**: Verify the column count is set to 1 for mobile layouts.

### Issue: Expansion doesn't work

**Solution**: Check that items have either `children` or `renderExpanded` defined, and `isLeaf` is not set to `true`.

### Issue: Performance degradation with many items

**Solution**: Consider implementing virtualization or pagination for datasets over 100 items.

## Complete Example

```tsx
"use client";

import { useState, useEffect } from 'react';
import { Tesseract, useCellState } from '@/components/tesseract';
import type { TesseractCellData } from '@/components/tesseract';

// Custom content component
const DashboardWidget: React.FC<{ cellId: string }> = ({ cellId }) => {
  const { isHovered } = useCellState(cellId);
  
  return (
    <div className={`p-4 transition-all ${isHovered ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
      <div className="text-2xl font-bold">42</div>
      <div className="text-sm text-zinc-500">Active Users</div>
    </div>
  );
};

// Main component
export default function Dashboard() {
  const [path, setPath] = useState<string[]>([]);
  const [columns, setColumns] = useState(3);
  
  // Responsive columns
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
  
  const items: TesseractCellData[] = [
    {
      id: "analytics",
      title: "Analytics",
      subtitle: "Real-time data",
      rowSpan: 2,
      colSpan: 2,
      content: <DashboardWidget cellId="analytics" />,
      children: [
        { id: "users", title: "Users" },
        { id: "revenue", title: "Revenue" }
      ]
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "3 new",
      content: <NotificationList />
    },
    {
      id: "settings",
      title: "Settings",
      renderExpanded: ({ onClose }) => (
        <SettingsPanel onClose={onClose} />
      )
    }
  ];
  
  return (
    <main className="h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto h-full">
        <Tesseract 
          items={items}
          path={path}
          onNavigate={setPath}
          config={{
            columns,
            gap: 12,
            expandDuration: 1.2,
            collapseDuration: 0.8
          }}
        />
      </div>
    </main>
  );
}
```