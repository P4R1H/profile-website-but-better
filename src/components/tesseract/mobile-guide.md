# Tesseract Mobile Implementation Guide

## Overview

The Tesseract component now features a fully native mobile experience that preserves the beautiful, fluid animations of the desktop version while adapting to touch interactions and mobile viewport constraints.

### Key Mobile Features

- 🎯 **Single-column layout** optimized for portrait orientation
- 📱 **Touch-native gestures** (tap to expand, swipe-down to close)
- 🎆 **Haptic feedback** on interactions and scroll snap points
- 📜 **Snap scrolling** with blur gradients indicating scroll availability
- ✨ **Preserved animations** - same beautiful flex-based transitions
- 🔄 **Full feature parity** - all desktop features work on mobile

---

## Architecture

### Component Structure

```
Mobile Tesseract Stack:
┌─────────────────────────────────┐
│  MobileScrollContainer          │ ← Snap scrolling + blur edges
│  ┌───────────────────────────┐  │
│  │  Tesseract (isMobile)     │  │ ← 1 column + mobile config
│  │  ┌─────────────────────┐  │  │
│  │  │  TesseractCell      │  │  │ ← Touch gestures + haptics
│  │  │  (snap-start)       │  │  │
│  │  └─────────────────────┘  │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  TesseractCell      │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Mobile-Specific Components

### 1. useMobileDetection Hook

**Location:** `/hooks/useMobileDetection.ts`

Detects mobile viewport and touch capability with automatic resize handling.

```typescript
import { useMobileDetection } from "@/hooks/useMobileDetection";

const { isMobile, isTouch, viewport } = useMobileDetection();

// isMobile: true if viewport width < 768px
// isTouch: true if touch events are supported
// viewport: { width, height } current dimensions
```

**Features:**
- Automatic window resize detection with debounce (150ms)
- Orientation change detection
- SSR-safe initialization

---

### 2. useHaptics Hook

**Location:** `/hooks/useHaptics.ts`

Provides haptic feedback using the Vibration API for tactile user feedback.

```typescript
import { useHaptics } from "@/hooks/useHaptics";

const haptics = useHaptics();

// Usage:
haptics.trigger("medium");  // Generic vibration
haptics.snap();             // Scroll snap feedback
haptics.expand();           // Cell expansion feedback
haptics.collapse();         // Cell collapse feedback
haptics.cancel();           // Stop vibration
```

**Vibration Patterns:**
- `light`: 50ms single pulse
- `medium`: 100ms single pulse (default)
- `heavy`: 200ms single pulse
- `snap`: Double-tap pattern [50, 30, 50]
- `expand`: Rising intensity [30, 20, 60]
- `collapse`: Falling intensity [60, 20, 30]

**Browser Support:**
- Automatically detects Vibration API support
- Gracefully degrades if not supported
- Returns `isSupported` boolean

---

### 3. MobileScrollContainer Component

**Location:** `/components/tesseract/MobileScrollContainer.tsx`

Creates an isolated scroll context with snap points, blur edges, and haptic feedback.

```typescript
<MobileScrollContainer
  enableSnap={true}
  enableBlur={true}
  enableHaptics={true}
>
  <Tesseract {...props} />
</MobileScrollContainer>
```

**Features:**
- **Snap Scrolling**: Cards snap to viewport boundaries
- **Blur Gradients**: Top/bottom blur indicates more content
- **Haptic Feedback**: Vibrates on scroll snap (every 50px movement)
- **Scroll Isolation**: Prevents body scroll, contains overscroll
- **iOS Optimization**: Momentum scrolling enabled
- **Scroll Indicator**: Subtle visual cue for scrollability

**Props:**
- `enableSnap` (default: `true`) - Enable snap scrolling
- `enableBlur` (default: `true`) - Show blur gradients at edges
- `enableHaptics` (default: `true`) - Trigger haptics on snap
- `className` - Optional additional classes

---

## Mobile Configuration

### TesseractConfig Mobile Options

```typescript
interface TesseractConfig {
  // Desktop config
  columns?: number;
  gap?: number;
  expandDuration?: number;
  collapseDuration?: number;

  // Mobile-specific config
  mobile?: {
    columns?: number;              // Default: 1
    gap?: number;                  // Default: 12
    enableHaptics?: boolean;       // Default: true
    snapScroll?: boolean;          // Default: true
    blurEdges?: boolean;           // Default: true
    horizontalPadding?: number;    // Default: 16
  };
}
```

### Usage Example

```typescript
<Tesseract
  items={items}
  path={path}
  onNavigate={setPath}
  config={{
    // Desktop configuration
    columns: 3,
    gap: 8,
    expandDuration: 1.2,
    collapseDuration: 0.8,

    // Mobile configuration
    mobile: {
      columns: 1,
      gap: 12,
      enableHaptics: true,
      snapScroll: true,
      blurEdges: true,
      horizontalPadding: 16,
    },
  }}
/>
```

---

## Mobile Behavior

### State Management

**Desktop (3 states):**
1. **Idle**: `flex: 1`
2. **Hover**: `flex: 2` (expands vertically)
3. **Active**: `flex: 100` (expands to fill container)

**Mobile (2 states):**
1. **Default**: Natural content height, auto flex
2. **Expanded**: `position: fixed; inset: 0` (fills viewport)

### Touch Interactions

#### Tap to Expand
```typescript
// TesseractCell automatically handles tap to expand
// No hover state on mobile
<TesseractCell onClick={handleExpand} />
```

#### Swipe-Down to Close
```typescript
// Built-in gesture handler in TesseractCell
// Swipe threshold: 100px OR velocity > 500px/s
// Triggers haptics.collapse() on success
```

### Animation Preservation

The core flex-based animation system is **100% preserved** on mobile:

```typescript
// Same animation timing
layout: {
  duration: isLocked ? 1.2 : 0.8,
  ease: [0.22, 1, 0.36, 1] // Same easing curve
}

// Same flex transitions
flex: isActive ? 100 : 1
```

The only differences:
- Hover state removed (2 states instead of 3)
- Expanded cells use `position: fixed` for full-screen
- Touch gestures replace mouse events

---

## Responsive Viewport Handling

### Recommended Page Structure

```typescript
export default function Home() {
  const [path, setPath] = useState<string[]>([]);
  const { isMobile } = useMobileDetection();

  return (
    <main className="min-h-screen bg-black flex flex-col p-4 md:p-8">
      {/* Breadcrumb - Always visible */}
      <div className="w-full max-w-7xl mb-4 h-8">
        <Breadcrumb path={path} onNavigate={setPath} />
      </div>

      {/* Tesseract Container - Responsive height */}
      <div className="w-full max-w-7xl h-[calc(100vh-8rem)] md:h-[700px]">
        {isMobile ? (
          <MobileScrollContainer>
            <Tesseract
              items={items}
              path={path}
              onNavigate={setPath}
              config={{ mobile: { /* ... */ } }}
            />
          </MobileScrollContainer>
        ) : (
          <Tesseract
            items={items}
            path={path}
            onNavigate={setPath}
            config={{ columns: 3, /* ... */ }}
          />
        )}
      </div>
    </main>
  );
}
```

### Breakpoint

- **Mobile**: `< 768px` viewport width
- **Desktop**: `≥ 768px` viewport width

This aligns with standard Tailwind `md:` breakpoint.

---

## Feature Parity

All desktop features work seamlessly on mobile:

### ✅ Nested Grids (Recursion)
```typescript
{
  id: "projects",
  title: "Projects",
  children: [
    { id: "web", title: "Web Apps" },
    { id: "mobile", title: "Mobile Apps" }
  ]
}
// ✓ Works on mobile - tap to expand, nested grid appears
```

### ✅ Custom renderExpanded Components
```typescript
{
  id: "terminal",
  title: "Terminal",
  renderExpanded: ({ onClose }) => <TerminalUI onClose={onClose} />
}
// ✓ Works on mobile - tap to expand, custom component fills viewport
```

### ✅ rowSpan (Vertical Height)
```typescript
{
  id: "analytics",
  title: "Analytics",
  rowSpan: 2  // Takes 2x vertical space
}
// ✓ Works on mobile - card takes natural content height
```

### ✅ colSpan (Horizontal Width)
```typescript
{
  id: "hero",
  title: "Hero",
  colSpan: 2  // Spans 2 columns
}
// ℹ️ On mobile (1 column), colSpan is ignored gracefully
// Card takes full width naturally
```

### ✅ useCellState Hook
```typescript
const SmartButton = () => {
  const { isHovered, isActive, isMobile } = useCellState();
  // ✓ Works on mobile - isMobile flag available
  // isHovered is always false on mobile
};
```

---

## Performance Optimizations

### 1. Debounced Scroll Handling
```typescript
// MobileScrollContainer uses 50ms debounce
// Prevents excessive haptic triggers
```

### 2. Resize Observer for Content Changes
```typescript
// Automatically detects content height changes
// Updates blur visibility dynamically
```

### 3. Passive Event Listeners
```typescript
container.addEventListener("scroll", handler, { passive: true });
// Improves scroll performance on mobile
```

### 4. Will-Change Optimization
```typescript
style={{ willChange: "flex" }}
// Hints browser for GPU acceleration
```

### 5. Conditional Rendering
```typescript
{isMobile ? <MobileView /> : <DesktopView />}
// Only renders mobile-specific components when needed
```

---

## CSS Utilities

### Added to globals.css

```css
/* Hide scrollbar while maintaining functionality */
.scrollbar-none { /* ... */ }

/* Smooth scroll with iOS momentum */
.scroll-smooth { /* ... */ }

/* Snap scrolling */
.snap-y { scroll-snap-type: y mandatory; }
.snap-start { scroll-snap-align: start; }

/* Prevent overscroll bounce */
.no-overscroll { overscroll-behavior: none; }

/* Touch action controls */
.touch-pan-y { touch-action: pan-y; }
```

---

## Best Practices

### 1. Natural Content Height

On mobile, let cards breathe with natural content height:

```typescript
// ✅ Good - Natural content
content: (
  <div className="space-y-2">
    <p>Short description</p>
    <button>Learn More</button>
  </div>
)

// ❌ Avoid - Fixed heights
content: (
  <div className="h-[400px]">  // Don't do this
    <p>Content</p>
  </div>
)
```

### 2. Touch-Friendly Targets

Ensure tap targets are large enough (minimum 44x44px):

```typescript
// ✅ Good
<button className="p-4 text-lg">Tap Me</button>

// ❌ Too small
<button className="p-1 text-xs">Tap Me</button>
```

### 3. Prevent Zoom on Input Focus

In your viewport meta tag:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1"
/>
```

### 4. Test on Real Devices

Emulators don't support:
- Haptic feedback
- True touch physics
- Performance characteristics

Always test on:
- iOS Safari (iPhone)
- Chrome Mobile (Android)
- Various screen sizes

### 5. Respect User Preferences

```typescript
// Consider reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

config={{
  expandDuration: prefersReducedMotion ? 0.3 : 1.2,
  mobile: {
    enableHaptics: !prefersReducedMotion,
  }
}}
```

---

## Troubleshooting

### Issue: Haptics not working

**Solution:**
- Haptics require user interaction to activate
- Only works on HTTPS (not localhost HTTP)
- Not supported in all browsers (check `haptics.isSupported`)
- iOS requires sound to be on (respect silent mode)

### Issue: Scroll feels janky

**Solution:**
- Ensure `MobileScrollContainer` is used
- Check for heavy re-renders in content
- Use `React.memo` for cell content components
- Verify `-webkit-overflow-scrolling: touch` is applied

### Issue: Cards not snapping

**Solution:**
- Verify `enableSnap={true}` on MobileScrollContainer
- Check CSS `.snap-start` class is applied to cells
- Ensure container has fixed height
- Test on real device (snap behavior varies in simulators)

### Issue: Swipe-to-close not working

**Solution:**
- Ensure you're in expanded state (`isActive === true`)
- Swipe threshold is 100px - swipe further
- Check if drag is enabled: `drag={isMobile && isActive ? "y" : false}`
- Verify `onPanEnd` handler is attached

### Issue: Content cut off on small screens

**Solution:**
- Use responsive viewport height: `h-[calc(100vh-8rem)]`
- Adjust padding: `p-4 md:p-8`
- Test on devices < 375px width (iPhone SE)
- Consider reducing gap on very small screens

---

## Migration Guide

### From Desktop-Only to Mobile-Native

#### Step 1: Wrap with MobileScrollContainer

```diff
- <div className="h-[700px]">
+ <div className="h-[calc(100vh-8rem)] md:h-[700px]">
+   {isMobile ? (
+     <MobileScrollContainer>
        <Tesseract {...props} />
+     </MobileScrollContainer>
+   ) : (
+     <Tesseract {...props} />
+   )}
  </div>
```

#### Step 2: Add Mobile Config

```diff
  <Tesseract
    items={items}
    path={path}
    onNavigate={setPath}
    config={{
      columns: 3,
      gap: 8,
+     mobile: {
+       columns: 1,
+       gap: 12,
+       enableHaptics: true,
+       snapScroll: true,
+       blurEdges: true,
+       horizontalPadding: 16,
+     }
    }}
  />
```

#### Step 3: Make Padding Responsive

```diff
- <main className="p-8">
+ <main className="p-4 md:p-8">
```

That's it! Your Tesseract is now fully mobile-native.

---

## API Reference

### useMobileDetection()

```typescript
const {
  isMobile: boolean,    // true if width < 768px
  isTouch: boolean,     // true if touch events supported
  viewport: {
    width: number,      // Current viewport width
    height: number,     // Current viewport height
  }
} = useMobileDetection();
```

### useHaptics()

```typescript
const {
  trigger: (intensity?: "light" | "medium" | "heavy") => void,
  snap: () => void,
  expand: () => void,
  collapse: () => void,
  cancel: () => void,
  isSupported: boolean,
} = useHaptics();
```

### MobileScrollContainer Props

```typescript
interface MobileScrollContainerProps {
  children: React.ReactNode;
  enableSnap?: boolean;      // Default: true
  enableBlur?: boolean;      // Default: true
  enableHaptics?: boolean;   // Default: true
  className?: string;
}
```

---

## Examples

### Example 1: Portfolio with Mobile

```typescript
const portfolioItems: TesseractCellData[] = [
  {
    id: "about",
    title: "About Me",
    subtitle: "Developer & Designer",
    content: <AboutPreview />,
    renderExpanded: ({ onClose }) => <AboutFull onClose={onClose} />
  },
  {
    id: "projects",
    title: "Projects",
    children: [
      { id: "web", title: "Web Apps", rowSpan: 2 },
      { id: "mobile", title: "Mobile Apps" }
    ]
  }
];

// ✓ Works perfectly on mobile with tap-to-expand and swipe-to-close
```

### Example 2: Dashboard with Mobile Optimization

```typescript
const dashboardItems: TesseractCellData[] = [
  {
    id: "analytics",
    title: "Analytics",
    rowSpan: 2,  // Tall card on desktop, natural height on mobile
    renderExpanded: ({ onClose }) => (
      <AnalyticsDashboard onClose={onClose} />
    )
  }
];

// Mobile: Taller card in stack, tap to see full dashboard
// Desktop: 2x height in grid, click to expand
```

---

## Conclusion

The mobile implementation brings the same polished, fluid animation experience to mobile devices while respecting mobile UX conventions:

- ✅ Beautiful animations preserved
- ✅ Touch-native interactions
- ✅ Haptic feedback for satisfaction
- ✅ Snap scrolling for structure
- ✅ Full feature parity
- ✅ Zero compromises on quality

The foundation is solid, performant, and ready for production use.
