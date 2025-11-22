# Project Overview

This is a personal portfolio website for Parth Gupta, built as a modern web application using Next.js. It features an interactive Tesseract navigation system for exploring different sections including hero, connect, experience, projects, tech stack, live status, and achievements.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Utilities:** clsx, tailwind-merge

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm, yarn, pnpm, or bun

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/P4R1H/profile-website-but-better.git
   cd profile-website-but-better
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

- **TypeScript:** Configured with strict mode, paths `@/*` pointing to `./src/*`
- **ESLint:** Next.js config
- **Tailwind:** v4 with PostCSS
- **Next.js:** Default config, ready for deployment

## Current State

- **Branch:** personal
- **Version:** 0.1.0
- **Status:** Development
- **Features:** Interactive Tesseract grid, responsive design, dark theme optimized for AMOLED displays

## 1. Folder Structure (Complete)

```
src/
  app/                       # Next.js app directory
    globals.css              # Global styles
    layout.tsx               # Root layout
    page.tsx                 # Home page
  components/                # Reusable UI components
    breadcrumb.tsx           # Navigation breadcrumb
    cards/                   # Card components for each section
      blank/                 # Placeholder
      connect/               # Contact section
      experience/            # Work experience
      hero/                  # Hero/intro section
      live/                  # Live status
      projects/              # Projects showcase
      shared/                # Shared card utilities
      stack/                 # Tech stack
      wins/                  # Achievements
    shared/                  # Shared components
    tesseract/               # Tesseract navigation system
      Tesseract.tsx          # Main Tesseract component
      TesseractCell.tsx      # Individual cell component
  data/                      # Content and data layer
    portfolio.ts             # Root portfolio data aggregation
    connect/                 # Contact data
    empty/                   # Empty/placeholder data
    experience/              # Experience data
    hero/                    # Hero data
    projects/                # Projects data
    stack/                   # Tech stack data
    thoughts/                # Thoughts/blog data
    wins/                    # Wins/achievements data
  lib/                       # Utilities and hooks
    hooks.ts                 # Custom React hooks
    utils.ts                 # Utility functions
  types/                     # TypeScript type definitions
    types.ts                 # Global types
```

### Folder-per-Entity Pattern

Every entity = folder + `index.ts`. Works at all depths.

```
data/experience/cred/index.ts
data/projects/scale/stockpiece/index.ts
```

---

## 2. Data + Tesseract Co-location

**Each entity exports its raw data + its Tesseract cell config:**

```ts
// data/experience/cred/index.ts
export const credData = { /* ... */ };

export const credCell = {
  id: "cred",
  title: "CRED",
  renderExpanded: ({ onClose }) =>
    <CompanyDetail experience={credData} onClose={onClose} />
};
```

Parent indexes aggregate children:

```ts
export const experienceData = {
  id: "experience",
  content: <ExperienceCard />,
  children: [credCell, hpeCell, ecomCell, ...]
};
```

Root aggregates all sections:

```ts
export const rootItems = [
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

## 3. Grid Layout (Minimal)

Each section declares its own layout:

```ts
rowSpan: 1 | 2,
colSpan: 1 | 2,
```

Desktop = **3 columns**, mobile = **1 column**.

```ts
setColumns(window.innerWidth < 768 ? 1 : 3);
```

---

## 4. Card Copy (Clean, Consistent)

**Format:**

* Title: `MONO • CAPS • BOLD`
* Subtitle: `MONO • XS • WIDE`
* Description: `Sans • Normal case`

**Final copy:**

```
HERO:       PARTH GUPTA / THE BUILDER
CONNECT:    CONNECT / GET IN TOUCH
EXP:        EXP / GROWTH & LEARNINGS
PROJECTS:   PROJECTS / BUILT
STACK:      STACK / TOOLS
LIVE:       LIVE / CURRENT STATE
WINS:       WINS / MILESTONES
```

---

## 5. Theme (AMOLED-Optimized)

```ts
background: "#000"
card: "#0a0a0a"
border: "#1a1a1a"
text: "#e4e4e7"
muted: "#71717a"
accent: "#3b82f6"
```

Animations:

```ts
expand: 1.2s
collapse: 0.8s
gap: 12px
columns: 3
```

---

## 6. Workflow (Minimal Steps)

### Add an Experience

1. Create folder → `data/experience/newcompany`.
2. Add `index.ts` exporting data + cell.
3. Import into `data/experience/index.ts → children`.

### Add a Project

Same pattern as above.

### Add a New Root Card

1. `data/newcard/index.ts`
2. Components in `components/cards/newcard`
3. Add to `rootItems`.

---

## 7. Key Ideas (One-Liners)

* **Folder-per-entity** gives infinite nesting without changing conventions.
* **Data and layout co-located** → no hunting through files.
* **Root = single array** → easy to rearrange or delete sections.
* **TypeScript everywhere** → instant validation.
* **No design noise** → theme + copy described in <50 lines.

