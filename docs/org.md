## 1. Folder Structure (Essentials Only)

```
src/
  app/                       # Next.js app
  components/                # UI (cards, tesseract, shared)
  data/                      # Content layer (folder-per-entity)
  types/                     # TS types
  lib/                       # utils, constants, api client
  hooks/                     # GitHub, CF, LC, Live stats
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

