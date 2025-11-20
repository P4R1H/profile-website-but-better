# MASTER IMPLEMENTATION PLAN
**Project:** Parth Gupta Portfolio V2
**Status:** Initialization
**Tech Stack:** Next.js 15, Tailwind CSS, Framer Motion, TypeScript

---

## 1. Core Mechanics (Non-Negotiable)

### The "Physical" Grid
- **Behavior:** Cards are not static images. They are physical objects in a grid.
- **Hover Interaction:** 
    - When a card is hovered, it **must** physically expand (taking up more grid space if possible, or scaling while affecting neighbors).
    - **Implementation Strategy:** Use Framer Motion `layout` prop. 
    - *Note:* Changing grid-column-span on hover can be jarring. We will implement a "Focus" state where the hovered item scales up and pushes neighbors using layout projection, or we use a flex-like grid where items have `flex-grow`.
    - **Decision:** We will use a **Bento Grid** where the hovered item z-indexes up and scales (standard) OR we use Framer Motion to animate `grid-template-columns` / `flex-grow`. 
    - *Refined Decision based on "Pushing":* We will attempt a layout animation where the hovered card expands its flex basis or grid track, forcing others to shrink or move.

### Navigation Levels
1.  **Level 0 (Home):** The Bento Grid. All major categories.
2.  **Level 1 (Hub):** Clicking a category (e.g., Experience) morphs the grid into a filtered view of that category.
3.  **Level 2 (Detail):** Clicking an item (e.g., CRED) opens the full case study.

---

## 2. Data Structure (Source of Truth)

We will strictly follow the `data/*.ts` pattern to keep content modular.

-   `blocks.ts`: Defines the Level 0 Grid layout.
-   `experience.ts`: Companies, roles, dates, deep details.
-   `projects.ts`: Projects, stats, tech stacks.
-   `stack.ts`: Categorized skills.
-   `about.ts`: The narrative content.

---

## 3. Visual Style Guide

-   **Background:** `#000000` (Pure Black)
-   **Borders/Separators:** `#1a1a1a` (Zinc-900/950) - Thin, sharp lines.
-   **Corners:** `0px` (Sharp).
-   **Typography:** 
    -   Headings: `Inter` (Uppercase, Bold, Tight Tracking)
    -   Body: `Inter` (Regular)
    -   Meta/Code: `JetBrains Mono`
-   **Accents:**
    -   Experience: Blue
    -   Projects: Purple
    -   Stack: Green
    -   Recognition: Gold

---

## 4. Implementation Steps

### Phase 1: Setup & Core Grid
- [ ] Initialize Next.js 15 project with Tailwind & TypeScript.
- [ ] Install dependencies: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`.
- [ ] Configure Tailwind colors and fonts.
- [ ] Create the `BentoGrid` and `BentoCard` components.
- [ ] **CRITICAL:** Implement the "Push/Squeeze" hover effect prototype.

### Phase 2: Data & Content
- [ ] Create `src/data` folder and populate `blocks.ts`, `experience.ts`, etc., with data from `AboutMe.md`.
- [ ] Connect `BentoGrid` to `blocks.ts`.

### Phase 3: Navigation & Expansion
- [ ] Implement Zustand store for Navigation State (`level`, `currentHub`, `currentItem`).
- [ ] Create `HubGrid` (Level 1) component.
- [ ] Implement `layoutId` morphing transitions between Level 0 and Level 1.

### Phase 4: Detail Views
- [ ] Create `DetailView` (Level 2) component.
- [ ] Implement the "Apple-style" bento details (Header, Stats, Description).

### Phase 5: Special Cards
- [ ] **Profile Card:** Static, visual anchor.
- [ ] **Connect Card:** Hover to reveal links.
- [ ] **Stack Card:** Expand to show full tech stack.
- [ ] **Chat Interface:** (Mock or Real API integration).

### Phase 6: Polish
- [ ] Scroll indicators (fade gradients).
- [ ] Responsive adjustments (Mobile vertical scroll).
- [ ] Performance tuning (will-change, lazy loading).

---

## 5. File Structure Target

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── grid/
│   │   ├── bento-grid.tsx
│   │   ├── bento-card.tsx
│   │   └── hub-grid.tsx
│   ├── details/
│   ├── ui/
│   └── navigation/
├── data/
│   ├── blocks.ts
│   └── ...
├── store/
│   └── use-nav-store.ts
└── lib/
    └── utils.ts
```
