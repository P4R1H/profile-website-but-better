# Portfolio Design Document
**Parth Gupta - Personal Portfolio**  
**Version**: 2.0 (Corrected)  
**Design Philosophy**: Modular, Angular, AMOLED Black

---

## Design Philosophy

### Core Principles

1. **Modular by Design**: Grid system can grow infinitely without breaking. Add/remove cards without touching layout code.

2. **Angular Minimalism**: Sharp corners, no border radius, AMOLED black (#000000), thin separator lines between cards. No gaps, no shadows (except on hover/expand).

3. **Physical Interaction**: Cards feel like physical objects. Hover = visibly squeeze and push neighbors away. Click = expand and morph into new view. The child becomes the new parent

4. **Immersive Navigation**: No persistent chrome (navbar). Footer only at Level 0. Theme shifts subtly per section.

5. **Performance First**: Fast transitions (150-250ms), 60fps animations, no jank.

---

Need both light and dark modes.

## Grid System

### Modular Architecture

**Base Unit**: Cards defined by span values (columns × rows)
- Not fixed to specific grid dimensions
- Can be reconfigured per card without breaking layout
- New cards can be added to data file → automatically render

**Example Card Configurations**:
```
Experience: 3×2 (spans 3 columns, 2 rows)
Stack: 3×1 
Projects: 3×1
Profile: 1×1
Connect: 1×1
About: 1×1
Recognition: 1×1
```

**Grid Container**:
- Uses CSS Grid with configurable columns (e.g., 6-column base for flexibility)
- `gap: 1px` with `background: #1a1a1a` creates thin separator lines
- Cards are `background: #000000` (pure black)

**Scalability**: 
- Adding card: Define size in data → automatically fits in grid
- Removing card: Delete from data → grid reflows
- No hardcoded positions

### Responsive Behavior

**Desktop (>1280px)**: Full grid as designed  
**Tablet (768-1280px)**: Reduce to 4 columns, cards respan automatically  
**Mobile (<768px)**: Single column, all cards full-width, vertical scroll

**Scroll Behavior**:
- Hidden scrollbar (`scrollbar-width: none`)
- Top/bottom blur gradient (60px fade) when content overflows
- Indicates more content without visible scrollbar

---

## Interaction Design

### Level 0: Home Grid

**Idle State**:
- Pure black cards with thin gray separators
- Small icon + uppercase title + monospace subtitle
- Item count badge hidden (opacity 0)

**Hover State** (Desktop Only):
- Card grows visibly: `scale(1.5)` or `scale(2)`
- Pushes adjacent cards away (native CSS Grid behavior)
- Subtle glow in accent color
- Item count badge fades in
- Transition: 150ms
- Now the card has much more information visible, based on the context of what the card is it could just be more social links, or it could be the names of the projects inside etc

**Click**:
- Expandable cards → morph to Level 1 or 2
- Profile → no action (static)
- Connect → see special behavior below

### Special: Profile Card

**Visual Distinction**:
- Dashed border (2px, zinc-700)
- No hover effects
- No cursor pointer
- Centered layout: photo/initials + name + tagline
Only visible 

**Purpose**: Visual anchor, not interactive
stays at top right, becomes the back button when you go to future levels

### Special: Connect Card

**Hover Behavior**:
- Card content replaced by overlay
- Shows clickable list: EMAIL, RESUME, LINKEDIN, GITHUB, LEETCODE
- 2px colored border appears
- Transition: 200ms

**Mobile**: Icons always visible (no hover state needed)

### Special: Stack Card
Normally:
Shows stack but blurred at left and right to signify more
When hovered/clicked, expands and shows full stack (The stack will just be icons of things i use, can use skillicon.dev etc)


NOTE:
the system should we built in such a modular way that BOTh special cards and normal cards are addable, IE special cards functionality should be contained within themselves
---

## Navigation Hierarchy

### 3-Level System

**Level 0: Home Grid**
- All cards visible
- Footer visible (Email | Resume | Chat)
- No breadcrumb, no close button

**Level 1: Hub View** (e.g., Experience → Grid of Companies)
- Previous grid morphs into new grid
- Breadcrumb appears: `← HOME / EXPERIENCE`
- Close button appears: `[X]` top-right
- Footer disappears
- Background tints subtly (5-8% of hub accent color)

**Level 2: Detail View** (e.g., CRED → Role Details)
- Card morphs into full grid size
- Breadcrumb updates: `← HOME / EXPERIENCE / CRED`
- Background tints deeper (8-10% of item color)
- Becomes an apple-style bento grid with lot more visual details (company logo in the case of experience etc)

### Navigation Actions

**Breadcrumb Click**: Jump to that level directly
- Click "HOME" → Level 0
- Click "EXPERIENCE" → Level 1

**Close Button**: Go back one level
- Level 2 → Level 1
- Level 1 → Level 0

**ESC Key**: Same as close button

**Browser Back**: Enabled via History API pushState

---

## Visual Style

### Color System

**Base**:
- Background: `#000000` (AMOLED pure black)
- Separators: `#1a1a1a` (barely visible gray lines)
- Text Primary: `#ffffff`
- Text Secondary: `#737373` (zinc-500)
- Text Muted: `#404040` (zinc-600)

**Accent Colors** (for theme takeover + borders):
- Experience: Blue `#3b82f6`
- Projects: Purple `#a855f7`
- Stack: Green `#22c55e`
- Recognition: Gold `#fbbf24`
- About: Indigo `#8b5cf6`

**Theme Takeover**:
- When expanding a card, background transitions from `#000000` to a gradient:
  - `linear-gradient(135deg, #000000 0%, rgba(accent, 0.05-0.08) 100%)`
- All borders/accents inherit accent color
- Transition: 200ms ease-out

### Typography

**Fonts**:
- UI Text: Inter (weights: 400, 600, 700)
- Code/Mono: JetBrains Mono (weights: 400, 500)

**Style**:
- Titles: UPPERCASE, bold, tight tracking
- Body: Normal case, regular weight
- Meta info (dates, counts): Monospace, small

### Spacing

**Card Padding**:
- Small cards (1×1): 24px
- Medium cards (3×1): 32px
- Large cards (3×2): 32px

**Content Spacing**:
- Between sections: 40px
- Between paragraphs: 16px
- Between list items: 8px

### Borders & Lines

**Separator Lines**: 1px solid `#1a1a1a` (via CSS Grid gap)

**Card Borders**:
- Idle: None (just separator)
can explore mor epossibilites

**No Shadows** 

---

## Component Specifications

### Bento Card

**Structure**:
Example: CAN BE DIFFERENT< WE COULD JUST DO ALL TEXT CARDS AS WELL>
```
┌────────────────┐
│ [Icon]  [5]    │  ← Icon (24px), Badge (top-right, hidden until hover)
│                │
│ TITLE          │  ← Uppercase, bold, 14-16px
│ Subtitle       │  ← Monospace, 12px, muted
│                │
│ [Preview]      │  ← Optional: logo grid, tech pills, etc.
└────────────────┘
```

**States**: Idle, Hover (scale + border), Active (expanded)

**Props**: id, title, subtitle, size (col×row), icon, itemCount, type (hub/leaf/special), themeColor

### Hub Grid (Level 1)

**Layout**:
- Top bar: Breadcrumb (left) + Close (right), sticky
- Card grid: 2-3 columns depending on item count
- Cards: uniform size, hover effects, clickable
- Stagger animation on load (50ms per card)

**Example**: Experience hub shows 5 company cards, Projects hub shows 4 project cards

### Detail View (Level 2)

**Layout**:
- Top bar: Breadcrumb + Close
- Hero image: Optional, 16:9 aspect ratio
- Content sections: Header, Stats Grid (3 columns), Description, Tech Stack, Achievements
- Max width: 900px centered
- Scroll if content overflows

**Content Sections**:
1. **Header**: Role/Project title, dates, location/status
2. **Stats Grid**: 3 key metrics in cards (e.g., "10k users", "2ms latency")
3. **Description**: Paragraph text, 16px line height
4. **Achievements**: Bullet list, bold highlights
5. **Tech Stack**: Pills with tech names (no icons unless provided)

### Footer (Level 0 Only)

**Layout**:
```
────────────────────────────────────────────
EMAIL | RESUME | CHAT
────────────────────────────────────────────
```

- Fixed at bottom
- Border top: 1px `#1a1a1a`
- Text: 12px monospace, uppercase
- Hover: text color → white
- Disappears (opacity 0) when expanding to Level 1+

---

## Content Architecture

### Data Model

**Blocks (Level 0)**:
- id, title, subtitle, size, icon, itemCount, type, themeColor, expandable

**Companies (Experience Hub)**:
- id, name, logo, role, duration, location, description, achievements[], techStack[], stats[], heroImage, themeColor

**Projects (Projects Hub)**:
- id, name, tagline, description, techStack[], stats[], links{}, thumbnail, heroImage, themeColor

**Stack (Leaf)**:
- categories[] { name, technologies[] { name, icon, proficiency } }

**Recognition (Hub)**:
- achievements[] { id, title, organization, date, description, category }

**About (Leaf)**:
- Markdown content: "The Builder's Journey" narrative

### EXAMPLE Content from Resume

**Experience** (5 companies):
1. CRED - Backend Intern (Wealth), Oct 2025 – Jan 2026
2. HPE - Backend Infrastructure, Feb 2025 – July 2025
3. Ecom Express - ML Intern, May 2024 – July 2024
4. Conscent.ai - Data Science, June 2023 – July 2023
5. Persona Essential - Team Lead, Mar 2021 – Dec 2023

**Projects**:
1. StockPiece - 140k users, 8M+ requests/month
2. Skill Journey - AI roadmap generator, Gemini API
3. Community Tools - Reddit/Discord bots, 10M+ members
4. Chat with AI - Portfolio chat interface (NEW)

**Stack**:
- Languages: Python, TypeScript, Go, JavaScript, C++, Java, SQL, C, Kotlin
- Frameworks: React, Next.js, FastAPI, Express, TensorFlow, Keras, React Native, Discord.py
- Databases: MongoDB, PostgreSQL, MySQL, Redis, ClickHouse
- Cloud/DevOps: AWS, GCP, Docker, Linux, Git, CI/CD, Jenkins, Hetzner, Cloudflare

**Recognition**:
- Education: Shiv Nadar University, 8.78 CGPA, Dean's List
- Hackathons: Google Hack4Change Finalist, SIH Semi-Finalist
- CP: Codeforces Specialist (1538), CodeChef 3-Star
- Research: IEEE MCSoC 2025 paper
- Open Source: GSSOC'24, Hacktoberfest (TensorFlow, React)
i will add more detail AS WELL as more items in the actual site, i want each item to have a lot of information at leaf level

---


**Hover Squeeze**:
- Transform: `scale(1.1)` or `scale(1.15)`
- Border appears: 0→2px colored
- Glow appears: `box-shadow: 0 0 40px rgba(accent, 0.1)`
- Duration: 150ms

**Card Expand** (Level 0→1 or 1→2):
- Uses Framer Motion `layoutId` for morph effect
- Background color fade to tinted gradient
- Content fade out → new content fade in with stagger
- Duration: 250-300ms

**List Stagger** (Hub items):
- Each item: `opacity 0→1`, `translateY 20px→0`
- Delay: 50ms between items
- Duration: 300ms per item

**Footer Hide/Show**:
- Opacity: 1→0 when expanding
- TranslateY: 0→10px
- Duration: 200ms

---

## Special Features

### Chat Interface

**Access Points**:
1. Projects Hub → "Chat with AI" card
2. Footer → "CHAT" link (direct access)

**Behavior**:
- Clicking opens chat → entire grid morphs into chat UI
- Chat UI: Fixed header (breadcrumb + close), message list (scrollable), input bar (fixed bottom)
- Messages: User (right-aligned), AI (left-aligned), timestamps
- Input: Text field + Send button, Enter key submits

**Backend**: API route `/api/chat`, integrates with LLM (Gemini), context includes portfolio content

### Scroll Indicators

**When**: Content height > viewport height

**Visual**:
- Top: 60px gradient fade from tinted-black → transparent
- Bottom: 60px gradient fade from transparent → tinted-black
- Indicates scrollability without visible scrollbar

---

## Technical Requirements

**Framework**: Next.js 15 (App Router)  
**Animation**: Framer Motion (for layoutId morphing)  
**Styling**: Tailwind CSS (custom config for spacing, colors)  
**State**: Zustand or Context API (for navigation level, breadcrumb)  
**Fonts**: Inter + JetBrains Mono (via next/font/google)  
**Deployment**: Vercel

**Performance Targets**:
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Total Blocking Time: <200ms
- All animations: 60fps

**No Requirements**: SEO, Accessibility

---

## Assets Needed

**From User**:
1. Profile photo (square, 500×500px min)
2. Company logos (5 images: CRED, HPE, Ecom, Conscent, Persona)
3. Project screenshots (optional: StockPiece, Skill Journey dashboards)
4. Resume PDF (for download link)
5. We will favor high quality images over icons

**Generated**:
1. Tech icons (use devicon library or simple text pills)
2. Favicon (PG initials)

---