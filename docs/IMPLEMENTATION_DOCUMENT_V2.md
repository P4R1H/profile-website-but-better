PLEASE KEEP THIS AS A GUIDE, YOU DO NOT NEED TO FOLLOW IT SPEC FOR SPEC
# Portfolio Implementation Document
**Parth Gupta - Personal Portfolio**  
**Version**: 2.0 (Corrected)  
**Architecture**: Modular, Component-Based, Data-Driven

---

## Technical Architecture

### Tech Stack

**Core**:
- Next.js 15 (App Router)
- React 18
- TypeScript
- Framer Motion (layout animations)
- Tailwind CSS (utility styling)

**State Management**:
- Zustand (navigation state) OR Context API (simpler, sufficient)

**Utilities**:
- Lucide React (icons)
- clsx (conditional classNames)

**Deployment**: Vercel

---

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts, providers
│   │   ├── page.tsx            # Home page (Level 0 grid)
│   │   ├── globals.css         # Tailwind + custom styles
│   │   └── api/chat/route.ts  # Chat API endpoint
│   │
│   ├── components/
│   │   ├── grid/
│   │   │   ├── bento-grid.tsx      # Main grid container (Level 0)
│   │   │   ├── bento-card.tsx      # Individual card
│   │   │   └── hub-grid.tsx        # Level 1 hub grids
│   │   │
│   │   ├── details/
│   │   │   ├── experience-detail.tsx
│   │   │   ├── project-detail.tsx
│   │   │   ├── stack-detail.tsx
│   │   │   ├── about-detail.tsx
│   │   │   └── recognition-detail.tsx
│   │   │
│   │   ├── navigation/
│   │   │   ├── breadcrumb.tsx
│   │   │   └── close-button.tsx
│   │   │
│   │   ├── special/
│   │   │   ├── profile-card.tsx
│   │   │   ├── connect-card.tsx
│   │   │   └── chat-interface.tsx
│   │   │
│   │   └── ui/
│   │       ├── footer.tsx
│   │       └── scroll-indicator.tsx
│   │
│   ├── data/
│   │   ├── blocks.ts          # Level 0 grid config
│   │   ├── experience.ts      # Companies data
│   │   ├── projects.ts        # Projects data
│   │   ├── stack.ts           # Tech stack
│   │   ├── recognition.ts     # Achievements
│   │   └── about.ts           # About content
│   │
│   ├── hooks/
│   │   ├── use-navigation.ts  # Navigation state
│   │   └── use-viewport.ts    # Responsive utilities
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   │
│   └── lib/
│       ├── utils.ts           # Helper functions
│       └── constants.ts       # Colors, breakpoints
│
├── public/
│   ├── images/
│   │   ├── companies/         # Logos
│   │   ├── projects/          # Screenshots
│   │   └── profile.jpg
│   └── resume.pdf
│
└── config files (package.json, tailwind.config.ts, etc.)
```

---

## Data Architecture

### Data Files

**Modular Configuration**: Each data file exports an array/object

`blocks.ts`:
```typescript
export const blocks: BentoBlock[] = [
  {
    id: 'experience',
    title: 'Experience',
    subtitle: 'Career Journey',
    size: { cols: 3, rows: 2 },
    icon: 'Briefcase',
    itemCount: 5,
    type: 'hub',
    themeColor: '#3b82f6',
    expandable: true
  },
  // ... more blocks
];
```

**Why This Works**:
- Add block → automatically renders in grid
- Change size → grid reflows
- Remove block → grid adapts
- No hardcoded layout logic in components

---

## Component Architecture

### Navigation State Machine

**Zustand Store** (`use-navigation.ts`):
- `level`: 0 | 1 | 2
- `currentHub`: string | null (e.g., "experience")
- `currentItem`: string | null (e.g., "cred")
- `breadcrumb`: string[] (e.g., ["Home", "Experience", "CRED"])
- `navigateTo(level, hub?, item?)`: Update state + breadcrumb
- `goBack()`: Level 2→1 or 1→0
- `reset()`: Return to Level 0

**Flow**:
1. User clicks card → call `navigateTo(1, 'experience')`
2. Component reads `level` → renders HubGrid or DetailView
3. User clicks breadcrumb "Home" → call `navigateTo(0)`

### Layout System

**BentoGrid Component**:
- Reads `blocks` from data
- Renders CSS Grid with configurable columns (6 or 4)
- Uses `gap-px` + `bg-separator` for thin lines
- Maps blocks → BentoCard components

**Grid Configuration**:
```typescript
// Tailwind classes generated dynamically
const gridCols = 6; // or 4, configurable
const gridClass = `grid-cols-${gridCols}`;

// Card spans calculated from block.size
const colSpan = `col-span-${block.size.cols}`;
const rowSpan = `row-span-${block.size.rows}`;
```

**Responsive**:
- Use Tailwind breakpoints: `md:grid-cols-4`, `lg:grid-cols-6`
- Cards auto-respan using Tailwind responsive utilities

### Card Interactions

**BentoCard Component**:

**Props**: block (BentoBlock), onExpand (callback)

**States**:
- Idle: Black background, no border
- Hover: Scale 1.1, border 2px accent color, glow
- Active: Morphs via Framer Motion layoutId

**Hover Logic**:
```typescript
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}

className={cn(
  'transition-transform duration-150',
  hovered && 'scale-110 z-10 border-2',
  hovered && `shadow-[0_0_40px_${block.themeColor}20]`
)}
```

**Click Logic**:
```typescript
onClick={() => {
  if (!block.expandable) return;
  if (block.type === 'hub') navigateTo(1, block.id);
  if (block.type === 'leaf') navigateTo(2, block.id);
}}
```

### Expansion System

**Framer Motion LayoutId**:
- Same `layoutId` on collapsed and expanded states
- Framer Motion morphs between them smoothly

**Example**:
```typescript
// Level 0 (collapsed)
<motion.div layoutId={`card-${block.id}`}>
  <BentoCard />
</motion.div>

// Level 1 (expanded)
<motion.div layoutId={`card-${block.id}`}>
  <HubGrid />
</motion.div>
```

**Theme Takeover**:
- On expand, set body background via `document.body.style`
- Transition: 200ms ease-out
- Background: `linear-gradient(135deg, #000 0%, rgba(accent, 0.05) 100%)`

---

## Routing & History

**No URL Routing**: Single-page app, no `/experience/cred` routes

**Browser History Integration**:
- Use `window.history.pushState()` on navigation forward
- Listen to `popstate` event → call `goBack()`
- Enables browser back button without page reload

**Example Hook**:
```typescript
useEffect(() => {
  const handlePopState = () => {
    if (level > 0) goBack();
  };
  window.addEventListener('popstate', handlePopState);
  
  // Push state on navigate
  if (level > 0) {
    window.history.pushState({ level }, '');
  }
  
  return () => window.removeEventListener('popstate', handlePopState);
}, [level]);
```

---

## Styling System

### Tailwind Configuration

**tailwind.config.ts**:
- Extend colors: Add custom zinc shades, accent colors
- Extend fontFamily: Inter (sans), JetBrains Mono (mono)
- Extend spacing: Custom card padding values
- Extend animation: Custom keyframes for stagger, fade

**Global Styles** (`globals.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-black text-white;
    scrollbar-width: none; /* Hide scrollbar */
  }
  body::-webkit-scrollbar {
    display: none; /* Hide scrollbar WebKit */
  }
}
```

### Dynamic Styling

**Accent Colors**:
- Stored in block data as hex string
- Applied via inline styles where needed:
  ```typescript
  style={{ borderColor: block.themeColor }}
  ```

**No CSS Modules**: Use Tailwind utilities + clsx for conditional classes

---

## Animation Implementation

### Framer Motion Best Practices

**1. Layout Animations**:
- Use `layout` prop on elements that change size/position
- Use `layoutId` for morphing between states
- Wrap in `AnimatePresence` for exit animations

**2. Stagger Children**:
```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.div key={i.id} variants={item} />)}
</motion.div>
```

**3. Exit Animations**:
```typescript
<AnimatePresence mode="wait">
  {level === 0 && <BentoGrid key="grid" />}
  {level === 1 && <HubGrid key="hub" />}
</AnimatePresence>
```

### Performance Optimization

**1. Use `transform` and `opacity`**: Hardware accelerated
**2. Avoid `width`/`height` animations**: Use `scale` instead
**3. Add `will-change` hint**: On frequently animated elements
**4. Lazy load detail views**: Use `dynamic()` from Next.js

---

## Content Integration

### Dynamic Data Loading

**Pattern**: Components read from data files, not hardcoded

**Example - Experience Hub**:
```typescript
import { companies } from '@/data/experience';

export function ExperienceHub() {
  return (
    <div className="grid grid-cols-2 gap-px bg-zinc-800">
      {companies.map(company => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
```

**Adding Content**:
1. Add entry to data file
2. Component automatically renders new card
3. No code changes needed

### Image Handling

**Next.js Image Component**:
- Use `<Image>` for all images (logos, screenshots)
- Automatic optimization, lazy loading
- Priority loading for Level 0 images

**Example**:
```typescript
<Image
  src={company.logo}
  alt={company.name}
  width={64}
  height={64}
  priority={level === 0}
/>
```

---

## Special Features

### Chat Interface

**Architecture**:
- Frontend: React component with message state
- Backend: Next.js API route (`/api/chat`)
- LLM: Gemini SDK

**Flow**:
1. User types message → POST to `/api/chat`
2. API route: Append to conversation context + call LLM
3. Stream response back to frontend
4. Update UI with new message

**Context Loading**:
- Pre-load portfolio content (experiences, projects, stack)
- Include in system prompt to LLM
- LLM can answer questions about Parth's work

**State Management**:
```typescript
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');

const sendMessage = async () => {
  const newMsg = { role: 'user', content: input };
  setMessages([...messages, newMsg]);
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: [...messages, newMsg] })
  });
  
  const data = await response.json();
  setMessages([...messages, newMsg, data.message]);
};
```

### Profile Card (Non-Interactive)

**Implementation**:
- Separate component, different styling
- No onClick handler
- Different cursor (default, not pointer)
- Dashed border via Tailwind: `border-2 border-dashed`

### Connect Card (Hover Expand)

**Implementation**:
- Two states: collapsed (icon + title), expanded (link list)
- Use `useState` for hover tracking
- Expanded state: Absolute positioned overlay
- Mobile: Skip hover, show links always

---

## Build & Deployment

### Development Setup

```bash
npx create-next-app@latest portfolio --typescript --tailwind --app
cd portfolio
npm install framer-motion zustand clsx lucide-react
npm run dev
```

### Build Process

**Production Build**:
```bash
npm run build
```

**Output**: Static export (if no dynamic features) or Node.js server

### Deployment to Vercel

```bash
npm i -g vercel
vercel login
vercel deploy --prod
```

**Environment Variables** (for chat):
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- Set in Vercel dashboard → Settings → Environment Variables

### Performance Optimization

**Next.js Features**:
- Image optimization (automatic)
- Font optimization (next/font)
- Code splitting (automatic per route)
- Static generation where possible

**Manual Optimizations**:
- Lazy load detail views: `const Detail = dynamic(() => import('./detail'))`
- Preload critical fonts in layout.tsx
- Minify CSS (automatic in production)

---

## Testing Strategy

### Manual Testing Checklist

**Functionality**:
- [ ] All cards render correctly at Level 0
- [ ] Hover effects work (scale, border, badge)
- [ ] Click opens correct level (hub or detail)
- [ ] Breadcrumb navigation works
- [ ] Close button returns to previous level
- [ ] ESC key closes views
- [ ] Browser back button works
- [ ] Profile card is non-interactive
- [ ] Connect hover shows links
- [ ] Footer links work (email, resume, chat)
- [ ] Chat interface sends/receives messages

**Responsive**:
- [ ] Desktop (1920px): Grid fits, no scroll
- [ ] Tablet (768px): 4 columns, cards reflow
- [ ] Mobile (375px): 1 column, vertical scroll
- [ ] Scroll indicators appear when needed

**Visual**:
- [ ] Pure black (#000000) background
- [ ] Thin separator lines visible
- [ ] Hover scale is noticeable (1.1x or 1.15x)
- [ ] Theme takeover is subtle (5-8% tint)
- [ ] Text is readable (contrast)

**Performance**:
- [ ] No animation jank (60fps)
- [ ] Fast load (<2s FCP)
- [ ] Smooth transitions (no flicker)

### Browser Testing

**Required**: Chrome, Safari, Firefox (latest)  
**Mobile**: iOS Safari, Chrome Android

---

## Open Implementation Questions

1. **State Management**: Zustand (external lib) or Context API (built-in)?
   - Context: Simpler, no deps
   - Zustand: Better devtools, easier to scale

2. **Grid Columns**: 6-column or 4-column base?
   - 6-col: More flexibility, harder to reason about
   - 4-col: Simpler, less flexible

3. **Hover Scale**: 1.1x or 1.15x?
   - Test in mockup, user decides

4. **Chat LLM**: OpenAI, Anthropic, or Gemini?
   - Depends on API access and preference

5. **Image Assets**: User provides or use placeholders?
   - Need company logos (5), profile photo, project screenshots

---

## Next Steps (Build Order)

### Phase 1: Foundation (Days 1-3)
- Setup Next.js project
- Create data files (blocks, experience, projects, stack)
- Define TypeScript types
- Configure Tailwind (colors, fonts)

### Phase 2: Core Grid (Days 4-6)
- Build BentoGrid component
- Build BentoCard component
- Implement hover effects (scale, border)
- Add navigation state (Zustand/Context)

### Phase 3: Expansion (Days 7-10)
- Build HubGrid component (Level 1)
- Implement Framer Motion morphing
- Add theme takeover system
- Build Breadcrumb + CloseButton

### Phase 4: Details (Days 11-14)
- Build detail view components (Experience, Project, Stack, About)
- Add content sections (hero, stats, description)
- Implement stagger animations

### Phase 5: Special Features (Days 15-17)
- Build Profile card (non-interactive)
- Build Connect card (hover expand)
- Build Chat interface + API route
- Add Footer component

### Phase 6: Polish (Days 18-20)
- Add scroll indicators
- Optimize images (Next.js Image)
- Test responsive behavior
- Fix bugs, refine animations
- Deploy to Vercel

---

## Success Criteria

**Functional**:
- ✅ All interactions work as specified
- ✅ Navigation is intuitive (tested with 3 users)
- ✅ Content loads dynamically from data files

**Visual**:
- ✅ Pure black AMOLED design
- ✅ Angular aesthetic (no rounded corners)
- ✅ Subtle theme takeover (not jarring)

**Performance**:
- ✅ Lighthouse score: 90+ (all categories except SEO)
- ✅ 60fps animations (no jank)
- ✅ Fast load (<2s FCP on fast 3G)

**Modularity**:
- ✅ Can add new card without touching component code
- ✅ Can change card size in data → auto-reflows
- ✅ Data-driven architecture (no hardcoded content)

---

**End of Implementation Document**
