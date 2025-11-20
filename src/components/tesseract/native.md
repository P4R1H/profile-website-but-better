# The Tesseract Component Protocol (TCP)

### A Guide to "Native-Feeling" Custom Extensions

## 1\. The Mechanics of Expansion

To build a smooth component, you must understand how `TesseractCell.tsx` handles your component.

When a cell expands, Tesseract does not just "show" your component. It wraps it in a layout-preserving container:

```typescript
// TesseractCell.tsx (Internal Wrapper)
<motion.div
  layout="preserve-aspect" // <--- CRITICAL: The container scales like an image, then corrects
  initial={{ scale: 0.95 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0.95 }}
  transition={{ ... }}
>
  {/* Your Component Renders Here */}
</motion.div>
```

**The Implication:** Your component is being *stretched* and *scaled* during the transition, not just resized. If you use fixed dimensions or assume the container is static, the content will warp or jitter.

-----

## 2\. The Golden Rules of Implementation

### Rule \#1: Fluid Geometry

Your component must **always** consume 100% of the available width and height.

  * ✅ `className="w-full h-full flex flex-col"`
  * ❌ `width={500} height={500}` or `h-screen`

### Rule \#2: Overflow Discipline

During the 1.2s expansion animation, the container size changes wildly.

  * **Always** apply `overflow-hidden` to your root container.
  * **Only** allow scrolling on internal content containers *after* the animation stabilizes.

### Rule \#3: The "0.2s" Content Delay

The Tesseract expansion takes `~1.2s`. If you show dense text or complex charts immediately, they will look squashed during the layout projection.

  * **Best Practice:** Fade in your internal content with a slight delay (`delay: 0.2` or `0.3`) so it appears only when the box has gained enough shape.

### Rule \#4: Wired "Back" Functionality

You receive an `onClose` prop. You **must** provide a clear UI element (usually top-right or top-left) to trigger this, otherwise, the user is trapped.

-----

## 3\. The "Native" Blueprint

Here is a starter template that perfectly mimics the physics of a native Tesseract cell.

```typescript
import { motion } from "framer-motion";
import { X } from "lucide-react"; // Assuming lucide-react for icons
import { TesseractCellData } from "@/types";

interface CustomProps {
  onClose: () => void;
  cell: TesseractCellData;
}

export const NativeExtension = ({ onClose, cell }: CustomProps) => {
  return (
    // 1. Root: Full size, relative for positioning, overflow hidden
    <div className="w-full h-full relative bg-zinc-950 overflow-hidden flex flex-col">
      
      {/* 2. Header: Fixed height, fades in slightly late to avoid jitter */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0"
      >
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{cell.title}</h2>
          <p className="text-zinc-500 text-sm font-mono uppercase">{cell.subtitle}</p>
        </div>
        
        {/* 3. The Escape Hatch */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent bubbling
            onClose();
          }}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors group"
        >
          <X className="w-6 h-6 text-zinc-500 group-hover:text-white" />
        </button>
      </motion.header>

      {/* 4. Content Body: Flex-1 to take remaining space */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex-1 p-6 overflow-y-auto"
      >
        {/* Your Custom Content Here */}
        <div className="prose prose-invert max-w-none">
          <p>This content fades in smoothly after the grid finishes its primary expansion.</p>
        </div>
      </motion.div>
    </div>
  );
};
```

-----

## 4\. Advanced Patterns

### Pattern A: The "Hero" Image Layout

If you want an image to expand from the thumbnail to the full view without fading (a shared layout transition), you usually can't do true shared element transitions easily inside a nested grid.

**The Tesseract Trick:**
Use `layoutId` internally, but scoped to the component.

```typescript
<div className="w-full h-full grid grid-cols-2">
   <motion.div 
      className="h-full w-full bg-zinc-800"
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Sync with Tesseract Config
   >
      {/* Image content */}
   </motion.div>
   <div className="p-8">
      {/* Text content */}
   </div>
</div>
```

### Pattern B: The Data Dashboard (Chart Stability)

Charts (Recharts/Chart.js) hate being resized dynamically. They often crash or render at size 0.

**Solution:** Render the chart only after the layout stabilizes, or use a resize observer that debounces.

```typescript
const [ready, setReady] = useState(false);

useEffect(() => {
  // Tesseract default expansion is ~1.2s
  const timer = setTimeout(() => setReady(true), 800); 
  return () => clearTimeout(timer);
}, []);

return (
  <div className="w-full h-full">
    {ready ? <MyHeavyChart /> : <SkeletonLoader />}
  </div>
)
```

-----

## 5\. Styling & Aesthetics (The Look)

To make the component feel like it belongs to the system, use these Tailwind utility combinations:

| Element | Recommended Classes |
| :--- | :--- |
| **Background** | `bg-black` or `bg-zinc-950` (Avoid pure grays) |
| **Borders** | `border-zinc-800` or `border-zinc-900` |
| **Primary Text** | `text-zinc-100` |
| **Secondary Text** | `text-zinc-500 uppercase font-mono text-xs` |
| **Accent Colors** | Use sparingly. Tesseract is brutalist; let the content be the color. |

-----

## 6\. Troubleshooting Common Issues

**Issue: "The text looks stretched horizontally during the animation."**

  * **Cause:** The parent is using `layout="preserve-aspect"`.
  * **Fix:** This is actually intended behavior to keep the frame rate high (60fps). If it's noticeable on specific text, apply `layout` to the text element itself, or simply fade the text in *after* the stretch is done.

**Issue: "My close button triggers the parent click handler."**

  * **Cause:** Event bubbling.
  * **Fix:** Always use `e.stopPropagation()` on your interactive elements inside the custom component.

**Issue: "Scrollbars appear and disappear rapidly."**

  * **Cause:** Content is overflowing during the transition.
  * **Fix:** Ensure the root of your custom component has `overflow-hidden`. Apply `overflow-y-auto` only to the inner content container, and perhaps hide the scrollbar with CSS until the animation completes.

-----

### Example: A "Terminal" Component

This is a perfect use case for Tesseract.

```typescript
export const TerminalCell = ({ onClose, cell }) => (
  <div className="w-full h-full bg-[#0d0d0d] font-mono text-sm flex flex-col overflow-hidden">
    {/* Window Bar */}
    <div className="h-10 bg-[#1a1a1a] flex items-center px-4 justify-between border-b border-[#333]">
      <span className="text-zinc-400">user@tesseract:~/{cell.id}</span>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-red-500 hover:text-red-400">✕</button>
    </div>
    
    {/* Content */}
    <motion.div 
      className="p-6 text-green-500 overflow-y-auto flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }} // Wait for expansion
    >
      <p>{`> initializing protocol...`}</p>
      <p>{`> mounting ${cell.title}...`}</p>
      <p className="text-zinc-500 mt-2">{`> access granted.`}</p>
      <span className="animate-pulse">_</span>
    </motion.div>
  </div>
);
