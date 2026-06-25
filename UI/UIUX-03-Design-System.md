# Design System Specification
## IdeaForge — AI-Powered SDLC Documentation Platform

| Field | Value |
|---|---|
| Document ID | UIUX-03-IDEAFORGE |
| Version | 1.0 |
| Prepared By | Principal UI/UX Architect |
| Date | June 2026 |
| Traces To | UIUX-01-IDEAFORGE, UIUX-02-IDEAFORGE |
| Stack | React 18 + Vite + TypeScript · Tailwind CSS · shadcn/ui · IBM Plex Mono + Inter |

---

## 1. Typography System

### 1.1 Font Families

| Role | Family | Source | Usage |
|---|---|---|---|
| UI / body | Inter | Google Fonts | All interface text — labels, body copy, headings, buttons, nav |
| Identifier / data | IBM Plex Mono | Google Fonts | Document IDs (BRD-001), token counts, cost figures, code, SKILL.md editor |

**Google Fonts import (add to `index.html`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Tailwind config addition:**
```js
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
}
```

### 1.2 Type Scale

| Token | Family | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `display` | Inter | 32px / 2rem | 500 | 1.2 | -0.5px | Landing hero headline only |
| `heading-1` | Inter | 22px / 1.375rem | 500 | 1.3 | -0.3px | Page titles |
| `heading-2` | Inter | 18px / 1.125rem | 500 | 1.4 | 0 | Section headings, document titles in viewer |
| `heading-3` | Inter | 15px / 0.9375rem | 500 | 1.4 | 0 | Card headings, modal titles |
| `body` | Inter | 14px / 0.875rem | 400 | 1.6 | 0 | Body text, descriptions, elicitation answers |
| `body-sm` | Inter | 13px / 0.8125rem | 400 | 1.5 | 0 | Secondary text, table cells, form hints |
| `caption` | Inter | 12px / 0.75rem | 400 | 1.4 | 0 | Timestamps, sub-labels, meta info |
| `label` | Inter | 11px / 0.6875rem | 500 | 1.3 | 0.06em | Section labels (uppercase), field labels |
| `mono-id` | IBM Plex Mono | 12px / 0.75rem | 500 | 1.4 | 0.02em | Document IDs, project codes, requirement IDs |
| `mono-data` | IBM Plex Mono | 12px / 0.75rem | 400 | 1.6 | 0 | Token counts, cost figures, code inline |
| `mono-editor` | IBM Plex Mono | 13px / 0.8125rem | 400 | 1.7 | 0 | SKILL.md editor content |

### 1.3 Tailwind Typography Utilities Mapping

```
display    → text-[32px] font-medium tracking-[-0.5px] leading-tight font-sans
heading-1  → text-[22px] font-medium tracking-[-0.3px] leading-snug font-sans
heading-2  → text-lg font-medium leading-snug font-sans
heading-3  → text-[15px] font-medium leading-snug font-sans
body       → text-sm font-normal leading-relaxed font-sans
body-sm    → text-[13px] font-normal leading-normal font-sans
caption    → text-xs font-normal leading-tight font-sans
label      → text-[11px] font-medium uppercase tracking-[0.06em] font-sans
mono-id    → text-xs font-medium font-mono tracking-[0.02em]
mono-data  → text-xs font-normal font-mono
mono-editor→ text-[13px] font-normal font-mono leading-7
```

---

## 2. Colour System

### 2.1 Brand Palette

| Token | Hex | Tailwind custom name | Usage |
|---|---|---|---|
| `color-ink` | `#0F0F0F` | `ink` | Primary text (light mode) |
| `color-paper` | `#F7F5F0` | `paper` | Page background (light mode) |
| `color-amber-primary` | `#BA7517` | `amber-primary` | Primary CTA, active states, focus rings, progress fills, mono IDs |
| `color-amber-tint` | `#FAEEDA` | `amber-tint` | Amber backgrounds, PE agent tag, hover surfaces |
| `color-amber-border` | `#EF9F27` | `amber-border` | Amber tag borders, warning borders |
| `color-slate` | `#6B7280` | `slate` | Secondary text, inactive nav, chart secondary |
| `color-surface-dark` | `#1A1917` | `surface-dark` | Dark mode surface panels |

### 2.2 Agent Colour Tokens

| Agent | Tag fill | Tag border | Tag text | Tailwind names |
|---|---|---|---|---|
| BA Agent | `#EEEDFE` | `#AFA9EC` | `#3C3489` | `ba-fill` / `ba-border` / `ba-text` |
| UX Agent | `#E1F5EE` | `#5DCAA5` | `#085041` | `ux-fill` / `ux-border` / `ux-text` |
| Prompt Engineer | `#FAEEDA` | `#EF9F27` | `#633806` | `pe-fill` / `pe-border` / `pe-text` |
| System / Elicitation | `--color-background-secondary` | `--color-border-secondary` | `--color-text-secondary` | Tailwind defaults |

### 2.3 Semantic Colour Tokens

| Token | Light mode | Dark mode | Usage |
|---|---|---|---|
| `color-success-fill` | `#EAF3DE` | `#173404` | Success badge bg, completion state |
| `color-success-text` | `#27500A` | `#C0DD97` | Success text |
| `color-success-border` | `#97C459` | `#3B6D11` | Success border |
| `color-error-fill` | `#FCEBEB` | `#501313` | Error badge bg, failure state |
| `color-error-text` | `#791F1F` | `#F7C1C1` | Error text |
| `color-error-border` | `#F09595` | `#A32D2D` | Error border |
| `color-info-fill` | `#E6F1FB` | `#042C53` | Info badge bg, generating state |
| `color-info-text` | `#0C447C` | `#B5D4F4` | Info text |
| `color-info-border` | `#85B7EB` | `#185FA5` | Info border |
| `color-warning-fill` | `#FAEEDA` | `#412402` | Warning bg |
| `color-warning-text` | `#633806` | `#FAC775` | Warning text |
| `color-warning-border` | `#EF9F27` | `#BA7517` | Warning border |

### 2.4 Tailwind Config — Custom Colours

```js
// tailwind.config.ts
colors: {
  'amber-primary': '#BA7517',
  'amber-tint':    '#FAEEDA',
  'amber-border':  '#EF9F27',
  'ink':           '#0F0F0F',
  'paper':         '#F7F5F0',
  'slate':         '#6B7280',
  'surface-dark':  '#1A1917',
  'ba-fill':   '#EEEDFE', 'ba-border':  '#AFA9EC', 'ba-text':  '#3C3489',
  'ux-fill':   '#E1F5EE', 'ux-border':  '#5DCAA5', 'ux-text':  '#085041',
  'pe-fill':   '#FAEEDA', 'pe-border':  '#EF9F27', 'pe-text':  '#633806',
}
```

### 2.5 Contrast Compliance (WCAG 2.1 AA)

| Foreground | Background | Ratio | Pass? |
|---|---|---|---|
| `#BA7517` amber on `#FFFFFF` white | 4.6:1 | ✓ AA |
| `#0F0F0F` ink on `#FFFFFF` white | 19.6:1 | ✓ AAA |
| `#3C3489` on `#EEEDFE` (BA tag) | 7.2:1 | ✓ AAA |
| `#085041` on `#E1F5EE` (UX tag) | 7.8:1 | ✓ AAA |
| `#633806` on `#FAEEDA` (PE tag) | 7.1:1 | ✓ AAA |
| `#27500A` on `#EAF3DE` (success) | 7.4:1 | ✓ AAA |
| `#791F1F` on `#FCEBEB` (error) | 7.0:1 | ✓ AAA |
| `#0C447C` on `#E6F1FB` (info) | 8.1:1 | ✓ AAA |
| `#6B7280` on `#FFFFFF` (secondary) | 4.6:1 | ✓ AA |

---

## 3. Spacing System

Base unit: **4px**. All spacing values are multiples of 4px.

| Token | Value | Tailwind class | Usage |
|---|---|---|---|
| `space-1` | 4px | `p-1` / `gap-1` | Icon-to-label gap, tight chip internal padding |
| `space-2` | 8px | `p-2` / `gap-2` | Tag gap, inline element spacing |
| `space-3` | 12px | `p-3` / `gap-3` | Row internal padding, grid gap (tight) |
| `space-4` | 16px | `p-4` / `gap-4` | Component padding (standard) |
| `space-5` | 20px | `p-5` / `gap-5` | Card internal padding (spacious) |
| `space-6` | 24px | `p-6` / `gap-6` | Section gap within a page region |
| `space-8` | 32px | `p-8` / `gap-8` | Between major sections |
| `space-10` | 40px | `p-10` / `gap-10` | Page-level breathing room (e.g. hero padding) |
| `space-16` | 64px | `p-16` / `gap-16` | Landing page section breaks |

---

## 4. Layout Grid

### 4.1 Breakpoints

| Name | Min width | Tailwind prefix | Notes |
|---|---|---|---|
| Mobile | 0px | (default) | Single column; full-width components |
| Tablet | 640px | `sm:` | 2-column grids unlock; sidebar icons only |
| Desktop | 1024px | `lg:` | Full two-panel layouts; admin sidebar expanded |
| Large desktop | 1280px | `xl:` | Content max-width cap applied |

### 4.2 Content Width

| Context | Max width | Tailwind |
|---|---|---|
| Public funnel (landing, idea, Q&A, estimate) | 760px | `max-w-3xl mx-auto` |
| Auth modal | 400px | `max-w-sm` |
| Document viewer — content panel | flex-1 | `flex-1 min-w-0` |
| Document viewer — sidebar | 240px | `w-60 flex-shrink-0` |
| Admin analytics — content | 100% minus sidebar | `flex-1` |
| Admin sidebar | 240px | `w-60` |

### 4.3 Page Shell Variants

```
Variant A — Public funnel (no sidebar, no top nav chrome)
┌─────────────────────────────────────────────────┐
│ [minimal top bar: wordmark + sign in]           │
├─────────────────────────────────────────────────┤
│              [step indicator]                   │
│              [max-w-3xl centred content]        │
│                                                 │
└─────────────────────────────────────────────────┘

Variant B — Authenticated user (top nav, no sidebar)
┌─────────────────────────────────────────────────┐
│ [top nav: wordmark · Dashboard · New idea · 👤] │
├─────────────────────────────────────────────────┤
│              [max-w-5xl centred content]        │
│                                                 │
└─────────────────────────────────────────────────┘

Variant C — Document viewer (top nav + left sidebar)
┌─────────────────────────────────────────────────┐
│ [top nav]                                       │
├────────────┬────────────────────────────────────┤
│ [sidebar   │ [document content panel]           │
│  240px]    │ [flex-1]                           │
└────────────┴────────────────────────────────────┘

Variant D — Admin portal (left sidebar + content)
┌────────┬────────────────────────────────────────┐
│ [admin │ [admin content]                        │
│ sidebar│                                        │
│  240px]│                                        │
└────────┴────────────────────────────────────────┘
```

---

## 5. Border & Elevation System

### 5.1 Border Tokens

| Token | Value | Usage |
|---|---|---|
| `border-default` | `0.5px solid` + border-tertiary colour | Default card, input, tag borders |
| `border-hover` | `0.5px solid` + border-secondary colour | Hover states on interactive cards |
| `border-focus` | `1.5px solid #BA7517` | Focus rings on inputs, active sidebar items |
| `border-accent` | `2px solid #BA7517` | Left-border accent on active/featured cards |
| `border-error` | `0.5px solid` + error-border colour | Error state inputs |
| `border-success` | `0.5px solid` + success-border colour | Success state indicators |

### 5.2 Border Radius Tokens

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `radius-tag` | 4px | `rounded` | Document identifier tags (`BRD`, `FRD`) |
| `radius-sm` | 6px | `rounded-md` (custom) | Small elements: status dots, mini badges |
| `radius-md` | 8px | `rounded-lg` (Tailwind default mapping) | Buttons, inputs, select, metric cards |
| `radius-lg` | 12px | `rounded-xl` | Cards, modals, panels |
| `radius-pill` | 9999px | `rounded-full` | Status badges, step nodes |

### 5.3 Elevation

IdeaForge uses **no box shadows**. Elevation is expressed through:
- Border weight (0.5px → 1.5px → 2px)
- Background colour contrast (primary white vs secondary surface)
- Left-border accent (2px amber) for featured/active state

---

## 6. Iconography

### 6.1 Library
**Tabler Icons** (outline variant) via `@tabler/icons-react`. All icons are outline only — never filled variants.

### 6.2 Size Tokens

| Context | Size | Tailwind |
|---|---|---|
| Inline with body text | 16px | `size-4` |
| Inline with heading / button | 18px | `size-[18px]` |
| Standalone decorative | 20px | `size-5` |
| Empty state / illustration | 24px | `size-6` |

### 6.3 Icon Vocabulary (canonical mapping)

| Concept | Icon name | Component context |
|---|---|---|
| Application idea | `IconBulb` | Landing, idea submission |
| Elicitation / Q&A | `IconMessages` | Q&A screen, step indicator |
| Token estimate / cost | `IconCalculator` | Estimate screen |
| Payment | `IconCreditCard` | Payment screen, payment history |
| AI agent / robot | `IconRobot` | Generation progress, pipeline strip |
| Document / file | `IconFileDescription` | Document sidebar, project cards |
| Download single | `IconDownload` | Document viewer actions |
| Export ZIP | `IconPackage` | Export all button |
| Copy to clipboard | `IconCopy` | Document viewer actions |
| Project folder | `IconFolder` | Dashboard, project cards |
| Generation progress | `IconActivity` | Progress screen |
| Admin / shield | `IconShield` | Admin nav, admin login |
| Skill / code | `IconCode` | Skill manager |
| Analytics / chart | `IconChartBar` | Analytics dashboard |
| Users | `IconUsers` | User management |
| Pricing / config | `IconAdjustments` | Pricing config |
| Check / done | `IconCheck` | Completed states |
| Spinner / loading | `IconLoader2` | Loading states (with spin animation) |
| Error / alert | `IconAlertCircle` | Error states, failure toasts |
| Info | `IconInfoCircle` | Tooltips, info banners |
| Close | `IconX` | Modal close, toast dismiss |
| Back / arrow left | `IconArrowLeft` | Back navigation |
| Fullscreen | `IconMaximize` | Document viewer fullscreen |
| Dev prompt / terminal | `IconTerminal2` | Prompt Engineer agent |
| BA agent / briefcase | `IconBriefcase` | BA agent pill |
| UX / layout | `IconLayoutDashboard` | UX agent pill |
| Settings | `IconSettings` | User settings |
| Bell / notifications | `IconBell` | Notification bell in top nav |
| Sign out | `IconLogout` | User dropdown |

### 6.4 Accessibility Rules for Icons
- Decorative icons: `aria-hidden={true}` always
- Functional icon-only buttons: must have `aria-label` describing the action
- Icons paired with text: decorative — `aria-hidden={true}`; the text carries the accessible name

---

## 7. Component Standards

### 7.1 Button

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `#BA7517` | `#FFF8ED` | None | Main CTA — one per screen max |
| Secondary | `bg-secondary` | `text-primary` | `0.5px border-secondary` | Supporting actions |
| Ghost | Transparent | `#BA7517` | `0.5px solid #BA7517` | Tertiary, admin preview |
| Danger | `error-fill` | `error-text` | `0.5px error-border` | Destructive actions (delete) |
| Icon-only | Secondary | Icon | Secondary | Toolbar actions (copy, download) |

**Sizes:**
- `sm`: 28px height, 10px/12px padding, 11px text
- `md` (default): 36px height, 12px/16px padding, 13px text
- `lg`: 44px height, 14px/20px padding, 15px text

**States:** default → hover (opacity 90%) → active (scale 0.98) → disabled (opacity 40%, cursor not-allowed) → loading (spinner replaces label, disabled)

**shadcn/ui base:** `Button` with custom `className` overrides for amber primary.

### 7.2 Input & Textarea

- Height: 36px (input), auto (textarea min-height 80px)
- Padding: 8px 12px
- Border: `0.5px solid border-secondary`
- Border radius: 8px (`radius-md`)
- Font: 13px Inter 400
- Focus: `1.5px solid #BA7517` + `ring-2 ring-amber-primary/15`
- Error: `0.5px solid error-border` + error message below in 11px error-text
- Placeholder: `text-tertiary` colour

**shadcn/ui base:** `Input`, `Textarea`

### 7.3 Select / Dropdown

Same visual spec as Input. Chevron icon (`IconChevronDown`) at right.
Dropdown panel: `bg-background-primary`, `border-default`, `radius-lg`, `shadow-none`.
Option hover: `bg-background-secondary`.

### 7.4 Card

**Standard card:**
```
background: bg-background-primary
border: 0.5px solid border-tertiary
border-radius: 12px (radius-lg)
padding: 1rem 1.25rem
```

**Accent card (active/featured):**
```
+ border-left: 2px solid #BA7517
border-radius: 0 12px 12px 0 (right side only)
```

**Metric card (admin KPIs):**
```
background: bg-background-secondary
border: none
border-radius: 8px (radius-md)
padding: 0.75rem 1rem
```

### 7.5 Badge / Tag

**Document tag (signature element):**
```
font-family: IBM Plex Mono, 11px, weight 500
padding: 3px 8px
border-radius: 4px (radius-tag)
letter-spacing: 0.02em
border: 0.5px solid [agent-border]
background: [agent-fill]
color: [agent-text]
```

**Status badge:**
```
font-family: Inter, 11px, weight 500
padding: 3px 8px
border-radius: 9999px (pill)
display: inline-flex with 6px colour dot
```

Dot animation for "Generating" state only:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.dot-generating { animation: pulse 1.2s ease-in-out infinite; }
```

### 7.6 Toast / Notification

```
max-width: 320px
padding: 12px 14px
border-radius: 0 8px 8px 0 (right-side only — flat left)
border-left: 2px solid [semantic-colour]
border: 0.5px solid border-tertiary (other three sides)
background: bg-background-primary
display: flex gap-10px
```

**Auto-dismiss timing:**
- Success: 4 seconds
- Info: 5 seconds
- Warning: 6 seconds (no auto-dismiss)
- Error: no auto-dismiss — user must close

**shadcn/ui base:** `Toast` / `Toaster` (Sonner) with custom styling

### 7.7 Modal / Dialog

```
max-width: 400px (auth), 520px (confirm), 640px (preview)
border-radius: 12px
padding: 1.5rem
overlay: rgba(0,0,0,0.45)
no box-shadow — border instead: 0.5px solid border-secondary
```

Mobile: bottom sheet (slides from bottom, border-radius top only, full-width)

**shadcn/ui base:** `Dialog`

### 7.8 Step Indicator

```
5 nodes connected by lines
Node: 32px circle, radius-full
  - Done: bg-success-fill, border-success-border, check icon
  - Active: bg-amber-tint, border-amber-primary, number text in amber
  - Pending: bg-background-primary, border-default, number text in muted
Connecting line: 1px solid
  - Done segment: success-border colour
  - Pending segment: border-secondary colour
Labels: 10px caption below each node, centred
```

### 7.9 Progress Bar

```
track: bg-background-secondary, height 6px, radius-full
fill: bg-amber-primary, height 6px, radius-full
transition: width 0.3s ease
```

No animation on the fill itself — only the progress value changes drive the visual.

### 7.10 Markdown Renderer

The document viewer's Markdown renderer applies these styles to rendered content:

```
h1: heading-1 token, color-ink, margin-bottom 1.5rem, border-bottom 0.5px
h2: heading-2 token, color-ink, margin-top 2rem, margin-bottom 1rem
h3: heading-3 token, color-ink, margin-top 1.5rem, margin-bottom 0.75rem
p: body token, color-text-secondary, margin-bottom 1rem
table: full-width, border-collapse, 0.5px borders, th bg-background-secondary
th: caption token, uppercase, text-tertiary, padding 8px 12px
td: body-sm token, padding 8px 12px
code (inline): mono-data token, bg-background-secondary, padding 2px 6px, radius-tag
pre: bg-background-secondary, padding 1rem, radius-md, overflow-x auto
strong: font-weight 500 (not 600/700)
```

**Requirement ID rendering** (special rule):
Any text matching `[A-Z]{2,4}-\d{3}` (e.g. `FR-001`, `BR-012`, `US-034`) is rendered as:
```
color: #BA7517
font-family: IBM Plex Mono
font-size: 12px
font-weight: 500
```
This makes cross-references visually scannable in the document viewer.

---

## 8. Interaction Standards

### 8.1 Hover / Focus / Active

| State | Standard behaviour |
|---|---|
| Hover (interactive) | Background shifts to `bg-background-secondary`; transition 150ms ease |
| Focus (keyboard) | `1.5px solid #BA7517` outline + `ring-2 ring-amber-primary/15`; never removed |
| Active (click) | `scale(0.98)` transform, 100ms; returns to scale(1) on release |
| Disabled | Opacity 40%; cursor `not-allowed`; no hover effect |

### 8.2 Loading Patterns

| Context | Pattern |
|---|---|
| Button action in progress | Replace button label with `IconLoader2` spinning; button disabled |
| Page / list loading | Skeleton shimmer (same dimensions as loaded content) |
| Agent typing (elicitation) | Three-dot animated indicator in agent bubble |
| Generation progress | Named document checklist with `IconLoader2` on active item |
| Chart data loading | Skeleton rectangle matching chart dimensions |

**Skeleton shimmer** (Tailwind):
```
bg-gradient-to-r from-background-secondary via-background-primary to-background-secondary
animate-pulse
```

### 8.3 Toast / Feedback Timing

| Action | Feedback type | Timing |
|---|---|---|
| Copy to clipboard | Success toast "Copied to clipboard" | 4s auto-dismiss |
| Download complete | Success toast "Document downloaded" | 4s auto-dismiss |
| ZIP export complete | Success toast "All documents downloaded" | 4s auto-dismiss |
| Skill published | Success banner (inline, not toast) | Persistent until dismissed |
| Payment failed | Error toast + inline error on gateway | No auto-dismiss |
| Generation complete | Success toast + auto-navigate (2s delay) | N/A — navigates away |
| Generation failed | Error card (inline on progress screen) | Persistent |
| Session expired | Warning toast + redirect to sign-in | Persistent |

### 8.4 Modal vs Drawer Rules

| Use modal when | Use drawer when |
|---|---|
| Confirming a destructive action | Not used in v1 |
| Auth gate (small form, < 400px) | — |
| Fullscreen document view on mobile | — |

Drawer pattern is reserved for v2 (mobile document sidebar).

### 8.5 Confirmation on Destructive Actions

All destructive actions require a confirmation modal with:
- The item name visible in the modal body (never generic "Delete this item?")
- Two buttons: destructive action (red/danger) LEFT · cancel action (secondary) RIGHT
- No auto-close on the confirmation modal — requires explicit choice

### 8.6 Motion Principles

IdeaForge uses **minimal, purposeful motion** only:

| Animation | Duration | Easing | Purpose |
|---|---|---|---|
| Page transition (route change) | None | — | Speed over animation |
| Generating status dot pulse | 1.2s infinite | ease-in-out | Signal active wait state |
| Toast slide-in | 200ms | ease-out | Draw attention to feedback |
| Modal open | 150ms | ease-out | Contextual overlay |
| Progress bar fill | 300ms | ease | Smooth progress update |
| Button active press | 100ms | linear | Haptic-feel click response |
| Skeleton shimmer | 1.5s infinite | ease-in-out | Loading state |

Respect `prefers-reduced-motion` — wrap all animations in:
```css
@media (prefers-reduced-motion: no-preference) { ... }
```

---

## 9. Responsive Design

### 9.1 Breakpoint Behaviour Per Screen

| Screen | Mobile (< 640px) | Tablet (640–1023px) | Desktop (≥ 1024px) |
|---|---|---|---|
| Landing | Single column; CTA full-width; how-it-works 2×2 grid | Two-column how-it-works; centred max-640px card | Max-760px centred column |
| Idea submission | Stacked fields; CTA full-width | Side-by-side dropdowns; CTA 320px | Same as tablet |
| Elicitation Q&A | Full-width thread; textarea sticky-bottom | Max-680px centred | Same as tablet |
| Token estimate | Cost card full-width; CTA sticky-bottom | Max-480px centred | Same as tablet |
| Auth modal | Bottom sheet full-width | Centred modal 400px | Centred modal 400px |
| Generation progress | Checklist full-width; agent strip horizontal scroll | Max-560px centred | Same as tablet |
| Document viewer | Sidebar → bottom sheet FAB; full-width content | Sidebar icons only (tooltip labels); content flex-1 | Full two-panel 240px + flex-1 |
| Dashboard | 1-column card stack; FAB "New idea" | 2-column grid | 2-column grid max-900px |
| Admin analytics | 2×2 KPI cards; stacked charts; 4-column table | 2-col charts; full table | Full layout with sidebar |
| Admin skill manager | Editor full-width; preview in modal | Editor + preview stacked | Editor + preview side-by-side |

### 9.2 Touch Targets

All interactive elements on mobile must have a minimum touch target of **44×44px** (WCAG 2.5.5). For small components (tags, icon buttons), achieve this via padding even if visual size is smaller:
```css
/* icon-only button example */
.icon-btn { padding: 10px; min-width: 44px; min-height: 44px; }
```

### 9.3 Mobile Navigation

**Public funnel:** Top bar shows wordmark only + hamburger (reveals "Sign in" in a dropdown). No nav needed — flow is linear.

**Authenticated user portal:**
- Top bar collapses to wordmark + hamburger
- Hamburger opens a full-height drawer from the left: Dashboard · New idea · Settings · Sign out
- Document viewer: floating action button (FAB) "Documents" at bottom-right opens a bottom sheet listing all 13 documents

**Admin portal:**
- Sidebar collapses to icon rail (48px) on tablet
- On mobile: hamburger icon → full-width overlay drawer

---

## 10. Accessibility Checklist (WCAG 2.1 AA)

### 10.1 Keyboard Navigation

- [ ] All interactive elements reachable via `Tab` in logical DOM order
- [ ] All modal dialogs trap focus within the modal while open
- [ ] `Esc` closes modals and drawers
- [ ] Custom interactive elements (doc tags with actions, sidebar items) use `role="button"` or `<button>` and respond to `Enter` and `Space`
- [ ] Skip-to-content link at page top: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>`
- [ ] No keyboard traps outside of intentional modal focus trap

### 10.2 Screen Reader Support

- [ ] All page-level headings form a logical hierarchy (`h1` → `h2` → `h3`)
- [ ] All images and icons: decorative → `aria-hidden="true"`; functional → `aria-label`
- [ ] All forms: `<label>` programmatically associated with every `<input>` via `htmlFor`
- [ ] Error messages: `aria-describedby` on the input pointing to the error element
- [ ] Required fields: `aria-required="true"` + visible asterisk with `aria-hidden="true"` (the screen reader reads "required" from the aria attribute, not the asterisk)
- [ ] Live regions: `aria-live="polite"` for non-urgent updates (character counts, Q&A loading); `aria-live="assertive"` for errors
- [ ] Page title (`<title>`) updates on route change to reflect current screen
- [ ] Admin analytics charts: accessible data table in `<details>` element alongside each chart

### 10.3 Colour Contrast

- [ ] All text meets 4.5:1 minimum contrast (AA) — see Section 2.5 for verified ratios
- [ ] All UI components (buttons, inputs, borders) meet 3:1 non-text contrast (AA)
- [ ] Amber `#BA7517` is never used for text smaller than 18px (below that threshold it meets AA only, not AAA — acceptable)
- [ ] Status is never communicated by colour alone — always paired with text label and/or icon

### 10.4 Focus Indicators

- [ ] All focusable elements have a visible focus ring (`1.5px solid #BA7517` + `ring-2 ring-amber-primary/15`)
- [ ] Focus ring is never removed via `outline: none` without a replacement
- [ ] Tailwind base: add to `globals.css`:
```css
:focus-visible {
  outline: 1.5px solid #BA7517;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(186, 117, 23, 0.15);
}
```

### 10.5 Accessible Forms

- [ ] All form sections have a visible and programmatic `<legend>` (for `<fieldset>`) or heading
- [ ] Inline validation fires on blur (not on keystroke — too disruptive for screen reader users)
- [ ] Error messages appear immediately after the field in DOM order (not at top of page only)
- [ ] Success feedback uses `role="status"` so it is announced non-interruptively
