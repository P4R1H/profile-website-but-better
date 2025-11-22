# Portfolio Architecture Design Document

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── chat/
│           └── route.ts              # Gemini chat endpoint
│
├── components/
│   ├── tesseract/                    # Core grid system
│   │   ├── Tesseract.tsx
│   │   ├── TesseractCell.tsx
│   │   └── Breadcrumb.tsx
│   │
│   ├── cards/                        # Card UI components
│   │   ├── hero/
│   │   │   └── HeroCard.tsx
│   │   │
│   │   ├── connect/
│   │   │   ├── ConnectCard.tsx
│   │   │   └── ConnectExpanded.tsx
│   │   │
│   │   ├── experience/
│   │   │   ├── ExperienceCard.tsx    # Root collapsed view
│   │   │   └── CompanyDetail.tsx     # Reusable for each company
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectsCard.tsx      # Root collapsed view
│   │   │   └── ProjectDetail.tsx     # Reusable for each project
│   │   │
│   │   ├── stack/
│   │   │   ├── StackCard.tsx
│   │   │   └── StackExpanded.tsx
│   │   │
│   │   ├── wins/
│   │   │   ├── WinsCard.tsx
│   │   │   └── WinsExpanded.tsx
│   │   │
│   │   └── live/
│   │       ├── LiveCard.tsx
│   │       └── LiveDashboard.tsx
│   │
│   └── shared/                       # Reusable UI primitives
│       ├── Badge.tsx
│       ├── MetricCard.tsx
│       ├── Timeline.tsx
│       └── IconLink.tsx
│
├── data/                             # Content layer (folder-per-entity)
│   ├── hero/
│   │   └── index.ts                  # Hero content
│   │
│   ├── connect/
│   │   └── index.ts                  # Social links
│   │
│   ├── experience/
│   │   ├── index.ts                  # Hub config + imports children
│   │   ├── cred/
│   │   │   └── index.ts
│   │   ├── hpe/
│   │   │   └── index.ts
│   │   ├── ecom/
│   │   │   └── index.ts
│   │   ├── conscent/
│   │   │   └── index.ts
│   │   └── persona/
│   │       └── index.ts
│   │
│   ├── projects/
│   │   ├── index.ts                  # Hub config + imports categories
│   │   ├── scale/
│   │   │   ├── index.ts              # Category config
│   │   │   ├── stockpiece/
│   │   │   │   └── index.ts
│   │   │   └── persona/
│   │   │       └── index.ts
│   │   ├── aiml/
│   │   │   ├── index.ts
│   │   │   ├── skilljourney/
│   │   │   │   └── index.ts
│   │   │   └── helmet/
│   │   │       └── index.ts
│   │   ├── tools/
│   │   │   ├── index.ts
│   │   │   └── bots/
│   │   │       └── index.ts
│   │   └── infra/
│   │       ├── index.ts
│   │       ├── cred-wealth/
│   │       │   └── index.ts
│   │       └── hpe-events/
│   │           └── index.ts
│   │
│   ├── stack/
│   │   └── index.ts
│   │
│   ├── wins/
│   │   └── index.ts
│   │
│   ├── live/
│   │   └── index.ts
│   │
│   ├── config.ts                     # Site config (colors, fonts, durations)
│   └── portfolio.ts                  # Main export (imports all sections)
│
├── types/                            # TypeScript definitions
│   ├── index.ts                      # Re-exports everything
│   ├── portfolio.ts                  # Experience, Project, Achievement types
│   └── tesseract.ts                  # TesseractCellData, Config
│
├── lib/                              # Utilities & helpers
│   ├── utils.ts                      # cn(), formatDate(), etc.
│   ├── api-client.ts                 # Fetch wrappers
│   └── constants.ts                  # URLs, limits, defaults
│
└── hooks/                            # Custom React hooks
    ├── useGitHub.ts                  # Fetch GitHub stats
    ├── useCodeforces.ts              # Fetch CF rating
    ├── useLeetCode.ts                # Fetch LC stats
    └── useLiveStats.ts               # Aggregates all live data
```

---

## Core Principles

### 1. **Folder-per-Entity = Scalable Convention**

Each data entity gets its own folder with an `index.ts`, regardless of complexity:

```typescript
// Simple entity (1 level)
data/hero/
└── index.ts              // Just exports the data

// Medium complexity (2 levels)
data/experience/
├── index.ts              // Imports all companies, exports hub
└── cred/index.ts         // Individual company data

// Complex nesting (4+ levels)
data/projects/
├── index.ts              
└── scale/
    ├── index.ts
    └── stockpiece/
        ├── index.ts
        └── versions/          // Future-proof for deep nesting
            ├── v1/index.ts
            └── v2/index.ts
```

**Why:** Consistent pattern at every depth. No convention-breaking when complexity increases.

---

### 2. **Each `index.ts` is Self-Contained**

Every entity exports both raw data AND its Tesseract cell configuration:

```typescript
// data/experience/cred/index.ts
import { Experience, TesseractCellData } from '@/types';
import CompanyDetail from '@/components/cards/experience/CompanyDetail';

// Raw data
export const credData: Experience = {
  id: "cred",
  company: "CRED",
  role: "Backend Intern (Wealth)",
  dates: "Oct 2025 - Jan 2026",
  achievements: [/* ... */],
  tech: ["Go", "Java", "JavaScript", "AWS"],
  logo: "/logos/cred.svg"
};

// Tesseract cell configuration
export const credCell: TesseractCellData = {
  id: "cred",
  title: "CRED",
  subtitle: "BACKEND INTERN",
  renderExpanded: ({ onClose }) => (
    <CompanyDetail experience={credData} onClose={onClose} />
  )
};
```

---

### 3. **Parent `index.ts` Aggregates Children**

Parent folders import and compose children:

```typescript
// data/experience/index.ts
import { TesseractCellData } from '@/types';
import ExperienceCard from '@/components/cards/experience/ExperienceCard';
import { credCell } from './cred';
import { hpeCell } from './hpe';
import { ecomCell } from './ecom';
import { conscentCell } from './conscent';
import { personaCell } from './persona';

export const experienceData: TesseractCellData = {
  id: "experience",
  title: "EXP",
  subtitle: "GROWTH & LEARNINGS",
  rowSpan: 2,        // Grid layout config
  colSpan: 1,
  content: <ExperienceCard />,
  children: [
    credCell,
    hpeCell,
    ecomCell,
    conscentCell,
    personaCell
  ]
};
```

---

### 4. **Root Aggregates All Sections**

Top-level portfolio file imports all sections:

```typescript
// data/portfolio.ts
import { TesseractCellData } from '@/types';
import { heroData } from './hero';
import { connectData } from './connect';
import { experienceData } from './experience';
import { projectsData } from './projects';
import { stackData } from './stack';
import { liveData } from './live';
import { winsData } from './wins';

export const rootItems: TesseractCellData[] = [
  heroData,
  connectData,
  experienceData,
  projectsData,
  stackData,
  liveData,
  winsData,
];
```

---

## Grid Layout Configuration

### Layout Storage

Grid layout (`rowSpan`, `colSpan`) is defined **directly in each section's `TesseractCellData`**:

```typescript
// data/experience/index.ts
export const experienceData: TesseractCellData = {
  id: "experience",
  title: "EXP",
  subtitle: "GROWTH & LEARNINGS",
  
  // 🎯 Layout configuration
  rowSpan: 2,    // Tall sentinel (2 rows)
  colSpan: 1,    // Standard width
  
  content: <ExperienceCard />,
  children: [...]
};
```

**Why co-locate:** Layout is intrinsic to the section. Change layout = edit one file.

---

### Root Grid Layout (Desktop: 3 columns)

```
┌──────────────┬──────────────┬──────────────┐
│    HERO      │   CONNECT    │     EXP      │  ROW 1
│    (1×1)     │    (1×1)     │    (1×2)     │
├──────────────┴──────────────┤              │
│     PROJECTS (2×1)          │              │  ROW 2
├──────────────┬──────────────┼──────────────┤
│    STACK     │     LIVE     │    WINS      │  ROW 3
│    (1×1)     │    (1×1)     │    (1×1)     │
└──────────────┴──────────────┴──────────────┘
```

**Layout Specs:**
- **Hero:** 1×1 (standard)
- **Connect:** 1×1 (standard)
- **Experience:** 1×2 (tall - spans 2 rows)
- **Projects:** 2×1 (wide - spans 2 columns)
- **Stack:** 1×1 (standard)
- **Live:** 1×1 (standard)
- **Wins:** 1×1 (standard)

---

### Responsive Behavior

```typescript
// app/page.tsx
const [columns, setColumns] = useState(3);

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) setColumns(1);  // Mobile: stack
    else setColumns(3);                          // Desktop: 3 cols
  };
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

<Tesseract 
  items={rootItems} 
  path={path} 
  onNavigate={setPath}
  config={{ columns, gap: 12, expandDuration: 1.2, collapseDuration: 0.8 }}
/>
```

On mobile (< 768px):
- All cards become 1×1
- Stack vertically
- Experience stays taller visually (can use 1×2 on mobile too)

---

## Card Copy Guidelines

Each card has three text elements:

### Title (Large, Bold, Mono)
- All caps
- Example: `PARTH GUPTA`, `EXPERIENCE`, `PROJECTS`

### Subtitle (Small, Muted, Mono)
- All caps, wide letter spacing
- Example: `THE BUILDER`, `GROWTH & LEARNINGS`, `BUILT`

### Description (Body, Sans)
- Normal case, readable
- Example: `Ideas become products. Products become impact.`

---

### Finalized Copy

```typescript
// Hero
title: "PARTH GUPTA"
subtitle: "THE BUILDER"
description: "Ideas become products. Products become impact."

// Connect
title: "CONNECT"
subtitle: "GET IN TOUCH"
description: "The best work starts with a conversation."

// Experience
title: "EXP"
subtitle: "GROWTH & LEARNINGS"
description: "Startups, unicorns, and onwards."

// Projects
title: "PROJECTS"
subtitle: "BUILT"
description: "Millions in metrics."

// Stack
title: "STACK"
subtitle: "TOOLS"
description: "Jack of all trades, master of some?"

// Live
title: "LIVE"
subtitle: "CURRENT STATE"
description: "Always shipping. Always learning."

// Wins
title: "WINS"
subtitle: "MILESTONES"
description: "Good enough just isn't good enough."
```

---

## Development Workflow

### Adding New Experience

```bash
# 1. Create folder
mkdir src/data/experience/newcompany

# 2. Create index.ts with template
# (Copy from existing company, modify data)

# 3. Import in parent
# src/data/experience/index.ts
import { newcompanyCell } from './newcompany';

export const experienceData: TesseractCellData = {
  // ...
  children: [
    credCell,
    hpeCell,
    newcompanyCell,  // ← Add here
  ]
};
```

### Adding New Project

```bash
# 1. Create nested folders
mkdir -p src/data/projects/scale/newproject

# 2. Create index.ts with data

# 3. Import in category
# src/data/projects/scale/index.ts
import { newprojectCell } from './newproject';

export const scaleCategory: TesseractCellData = {
  // ...
  children: [
    stockpieceCell,
    newprojectCell,  // ← Add here
  ]
};
```

### Adding New Root Card

```bash
# 1. Create data folder
mkdir src/data/newcard

# 2. Create card components
mkdir src/components/cards/newcard

# 3. Create data/newcard/index.ts
export const newcardData: TesseractCellData = {
  id: "newcard",
  title: "NEWCARD",
  subtitle: "SUBTITLE",
  rowSpan: 1,
  colSpan: 1,
  content: <NewCard />
};

# 4. Import in portfolio
# src/data/portfolio.ts
import { newcardData } from './newcard';

export const rootItems = [
  // ...
  newcardData,  // ← Add here
];
```

---

## Design System

### Colors (AMOLED Theme)
```typescript
// data/config.ts
export const siteConfig = {
  theme: {
    colors: {
      background: "#000000",    // Pure black
      card: "#0a0a0a",         // Subtle lift
      border: "#1a1a1a",       // Barely visible
      text: "#e4e4e7",         // zinc-200
      muted: "#71717a",        // zinc-500
      accent: "#3b82f6",       // blue-500 (sparingly!)
    }
  }
};
```

### Typography
```css
Title:       20px, font-mono, uppercase, tracking-wider
Subtitle:    11px, font-mono, uppercase, tracking-widest, zinc-500
Description: 13px, sans-serif, normal case, zinc-400
```

### Animation Timing
```typescript
export const siteConfig = {
  tesseract: {
    columns: 3,
    gap: 12,
    expandDuration: 1.2,
    collapseDuration: 0.8
  }
};
```

---

## Key Benefits

### ✅ Scalability
- Add 4th or 5th nesting level? Same folder pattern.
- Convention never breaks regardless of complexity.

### ✅ Modularity
- Each section is self-contained.
- Delete a section? Just remove its import from `portfolio.ts`.

### ✅ Co-location
- Data, layout config, and rendering logic live together.
- Change experience layout? Edit `data/experience/index.ts`.

### ✅ Type Safety
- TypeScript enforces correct structure at every level.

### ✅ Clarity
- File path = data hierarchy: `data/projects/scale/stockpiece/index.ts`

---

## Future Considerations

### Assets
Future screenshots/media can live alongside data:
```
data/projects/scale/stockpiece/
├── index.ts
├── hero.png
├── dashboard.png
└── trading.png
```

### Internationalization
If needed, nest locale data:
```
data/experience/cred/
├── index.ts        # Default (English)
├── en.ts
└── hi.ts           # Hindi
```

### Testing
Data and components are separated, enabling:
- Unit test components with mock data
- Validate data structure independently

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Production-Ready