# System Design & Architecture

## 1. Architectural Overview

The project is built as a modern, interactive portfolio website using **Next.js 15 (App Router)**. It emphasizes fluid animations and a unique grid-based navigation system called "Tesseract".

*   **Framework:** Next.js 15
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Animation:** Framer Motion
*   **State Management:** React State + History API

## 2. Core Design Philosophy

### The "Tesseract" Layout
Unlike traditional websites that separate navigation from content, the Tesseract system merges them. The grid *is* the navigation.
*   **Masonry-style Grid:** Items are distributed across columns based on height to minimize gaps.
*   **Variable Spans:** Cells can span multiple columns or rows (`colSpan`, `rowSpan`).
*   **Recursive Depth:** Clicking a cell expands it to reveal either nested grid items or custom content.

### Fluidity & Physics
All interactions—hovering, expanding, navigating—are animated using `framer-motion` layout transitions. The goal is to make the interface feel physical and responsive, rather than just switching states.

## 3. Responsive Strategy (Hybrid Rendering)

A critical design challenge was ensuring the complex grid layout renders correctly on both mobile and desktop without "layout shifts" (FOUC) during hydration.

### The Problem
*   Desktop requires a 3-column grid.
*   Mobile requires a 1-column grid.
*   Standard `window.matchMedia` only runs on the client, causing the server to render a default (e.g., mobile) which then "snaps" to desktop after loading.

### The Solution: Server-Side Detection
We implement a hybrid approach:
1.  **Server Component (`page.tsx`)**: Inspects the `User-Agent` header to make a high-confidence guess about the device type.
2.  **Client Component (`Portfolio.tsx`)**: Receives an `initialIsDesktop` prop. It initializes the grid state immediately with the correct column count.
3.  **Hydration**: The client takes over and attaches a real `ResizeObserver` / `matchMedia` listener to handle window resizing dynamically after the initial load.

## 4. Mobile vs. Desktop Interaction Model

The application adapts its interaction model based on the device capabilities.

| Feature | Desktop | Mobile |
| :--- | :--- | :--- |
| **Layout** | Multi-column (3 cols) | Single column (1 col) |
| **Hover** | Mouse hover expands cell slightly | **Long Press** expands cell height |
| **Selection** | Standard text selection | `select-none` to prevent conflict with long-press |
| **Gestures** | Click to navigate | Tap to navigate, Swipe to scroll (cancels long-press) |
| **Spacers** | Visible for layout balance | Hidden via `hideOnMobile` property |

### Mobile Specifics
*   **Long Press Logic:** A custom `useLongPress` hook detects sustained touches. It includes a "dead zone" (movement threshold) to distinguish between a scroll/swipe and a deliberate hold.
*   **Vertical Expansion:** On mobile, "hovering" (holding) a cell smoothly increases its `min-height` to reveal more content or negative space, mimicking the desktop hover effect but adapted for vertical scrolling.

## 5. Component Architecture

### `Tesseract` (Container)
*   **Responsibility:** Layout engine.
*   **Logic:** Calculates column distribution. It places items into columns to balance heights, respecting `colSpan`.
*   **Optimization:** Memoizes the distribution calculation to prevent re-renders during animations.

### `TesseractCell` (Item)
*   **Responsibility:** Interaction & Presentation.
*   **Logic:** Handles `onClick`, `onMouseEnter`, and `onTouchStart`.
*   **Context:** Provides a `CellContext` so internal content knows if it is currently hovered, locked (active), or passive.

### `Portfolio` (Page Wrapper)
*   **Responsibility:** State orchestration.
*   **Logic:** Manages the navigation `path` (array of IDs). Syncs the internal React state with the browser's History API (`pushState`, `popState`) to ensure the Back button works as expected within the single-page application.

## 6. Data Structure

The content is defined as a recursive tree of `TesseractCellData`:

```typescript
interface TesseractCellData {
  id: string;
  title: string;
  
  // Layout
  colSpan?: number;
  rowSpan?: number;
  hideOnMobile?: boolean; // New: allows hiding spacers on mobile
  
  // Behavior
  disableHover?: boolean;
  isLeaf?: boolean;
  
  // Content
  children?: TesseractCellData[]; // Nested grid
  renderExpanded?: (props) => React.ReactNode; // Custom view
}
```

## 7. Visual Design System

### Color Scheme
The application uses a minimalist, high-contrast dark mode aesthetic, primarily leveraging the Tailwind CSS `zinc` scale.

*   **Background:** `bg-black` (#000000) - The canvas is pure black.
*   **Cell Background:** `bg-black` - Cells share the background color but are defined by their borders.
*   **Borders:**
    *   **Default:** `border-zinc-900` - Subtle, barely visible grid lines.
    *   **Hover:** `border-zinc-700` - Brighter border to indicate interactivity.
    *   **Active:** `border-transparent` - Borders disappear when a cell expands to fill the screen.
*   **Typography:**
    *   **Primary Text:** `text-zinc-100` - High readability for titles.
    *   **Secondary Text:** `text-zinc-500` - Muted text for subtitles or metadata.

### Cell Anatomy
Each `TesseractCell` is a self-contained interactive unit composed of layers:

1.  **Container (`motion.div`)**:
    *   Handles the layout transitions (size, position).
    *   Manages the border color state changes.
    *   Contains the `select-none` class to prevent text selection during gestures.

2.  **Collapsed View (Overlay)**:
    *   Visible when the cell is part of the grid.
    *   Contains the Title and Subtitle.
    *   Fades out (`opacity: 0`) when the cell expands.
    *   `pointer-events-none` ensures clicks pass through to the container, except for specific interactive children.

3.  **Expanded View (Content)**:
    *   Rendered only when the cell is active.
    *   Can be a nested `Tesseract` grid (recursive) or a custom React component (leaf).
    *   Fades in after the expansion animation completes.

### Animation Physics
We use a spring-based physics model for a "heavy" but responsive feel.

*   **Expansion:** `duration: 1.2s`, `ease: [0.22, 1, 0.36, 1]` (Custom Bezier for a snappy start and slow settle).
*   **Collapse:** `duration: 0.8s` - Slightly faster to return to the grid.
*   **Opacity:** `duration: 0.3s` - Content fades in/out with a slight delay to prevent visual clutter during the morph.

