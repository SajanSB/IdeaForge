# Developer Handoff
## IdeaForge — AI-Powered SDLC Documentation Platform

| Field | Value |
|---|---|
| Document ID | UIUX-04-IDEAFORGE |
| Version | 1.0 |
| Prepared By | Principal UI/UX Architect |
| Date | June 2026 |
| Traces To | UIUX-01, UIUX-02, UIUX-03 |
| Stack | React 18 + Vite + TypeScript · Tailwind CSS · shadcn/ui · Zustand · React Hook Form · Recharts · React Router v6 · IBM Plex Mono + Inter |

---

## 1. Frontend Folder Structure

```
ideaforge/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Router root
│   │
│   ├── routes/
│   │   ├── index.tsx               # All React Router route definitions
│   │   ├── PublicRoutes.tsx        # Unauthenticated-only routes (landing, funnel)
│   │   ├── ProtectedRoutes.tsx     # Auth-required routes (payment, viewer, dashboard)
│   │   └── AdminRoutes.tsx         # Admin-role-only routes
│   │
│   ├── layouts/
│   │   ├── PublicFunnelLayout.tsx  # Minimal top bar + step indicator shell
│   │   ├── UserPortalLayout.tsx    # Full top nav + optional sidebar
│   │   ├── DocumentViewerLayout.tsx# Top nav + 240px sidebar + content panel
│   │   └── AdminLayout.tsx         # 240px sidebar + content
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── IdeaSubmissionPage.tsx
│   │   │   ├── ElicitationPage.tsx
│   │   │   ├── IdeaReviewPage.tsx
│   │   │   └── TokenEstimatePage.tsx
│   │   ├── auth/
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── SignInPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── VerifyEmailPage.tsx
│   │   ├── user/
│   │   │   ├── PaymentPage.tsx
│   │   │   ├── GenerationProgressPage.tsx
│   │   │   ├── DocumentViewerPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   └── settings/
│   │   │       ├── ProfileSettingsPage.tsx
│   │   │       ├── PaymentHistoryPage.tsx
│   │   │       └── NotificationsPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminAnalyticsPage.tsx
│   │   │   ├── AdminSkillManagerPage.tsx
│   │   │   ├── AdminPricingPage.tsx
│   │   │   ├── AdminUsersPage.tsx
│   │   │   └── AdminDisputePage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui generated components (do not edit)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── table.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── brand/                  # IdeaForge-specific branded components
│   │   │   ├── DocTag.tsx          # BRD/FRD/SRS tag chips
│   │   │   ├── AgentPill.tsx       # BA/UX/PE agent pills
│   │   │   ├── StatusBadge.tsx     # Complete/Generating/Failed/Draft
│   │   │   ├── MonoId.tsx          # Amber monospace ID renderer
│   │   │   └── RequirementId.tsx   # FR-XXX/US-XXX inline span
│   │   │
│   │   ├── layout/
│   │   │   ├── TopBar.tsx          # Public funnel minimal bar
│   │   │   ├── UserTopNav.tsx      # Authenticated top nav
│   │   │   ├── AdminSidebar.tsx    # Admin left sidebar
│   │   │   ├── DocumentSidebar.tsx # 13-doc sidebar for viewer
│   │   │   └── StepIndicator.tsx   # 5-node step progress
│   │   │
│   │   ├── funnel/
│   │   │   ├── IdeaTextarea.tsx
│   │   │   ├── CharacterCount.tsx
│   │   │   ├── ElicitationThread.tsx
│   │   │   ├── AgentBubble.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   ├── CostBreakdownCard.tsx
│   │   │   ├── DocTagStrip.tsx
│   │   │   └── GatewaySelector.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthGateModal.tsx
│   │   │   ├── EmailPasswordForm.tsx
│   │   │   └── GoogleOAuthButton.tsx
│   │   │
│   │   ├── generation/
│   │   │   ├── AgentPipelineStrip.tsx
│   │   │   ├── DocumentChecklist.tsx
│   │   │   ├── ChecklistItem.tsx
│   │   │   ├── GenerationProgressBar.tsx
│   │   │   └── GenerationErrorCard.tsx
│   │   │
│   │   ├── viewer/
│   │   │   ├── DocumentPanel.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── DocumentActions.tsx
│   │   │   └── FullscreenViewer.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   └── DeleteConfirmModal.tsx
│   │   │
│   │   └── admin/
│   │       ├── KPICardRow.tsx
│   │       ├── DateRangeToggle.tsx
│   │       ├── GenerationTable.tsx
│   │       ├── SkillEditor.tsx
│   │       ├── SkillPreviewPanel.tsx
│   │       └── VersionBadge.tsx
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useIdeaStore.ts
│   │   ├── useElicitationStore.ts
│   │   ├── useEstimateStore.ts
│   │   ├── usePaymentStore.ts
│   │   ├── useGenerationStore.ts
│   │   ├── useDocumentStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useUIStore.ts
│   │   └── useAdminStore.ts
│   │
│   ├── services/
│   │   ├── claudeProxyService.ts   # POST /api/generate, /api/verify-payment
│   │   ├── strapiService.ts        # Strapi REST API client
│   │   ├── supabaseClient.ts       # Supabase Auth client
│   │   ├── razorpayService.ts      # Razorpay.js integration
│   │   ├── stripeService.ts        # Stripe.js integration
│   │   └── localStorageService.ts  # Typed localStorage wrapper
│   │
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth state + sign in/out helpers
│   │   ├── useGenerationPoll.ts    # Poll Strapi for generation status
│   │   ├── useEstimateCalc.ts      # Client-side token estimation
│   │   ├── useSessionMerge.ts      # Guest → auth session merge
│   │   ├── useClipboard.ts         # Copy to clipboard with toast
│   │   └── useDocumentExport.ts    # MD download + JSZip export
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts       # INR/USD formatting
│   │   ├── formatTokens.ts         # 284K, 1.2M display formatting
│   │   ├── requirementIdRegex.ts   # Regex for FR-XXX/US-XXX detection
│   │   ├── generateProjectId.ts    # UUID v4 generation
│   │   └── estimateCalc.ts         # Pure token estimation logic
│   │
│   ├── types/
│   │   ├── project.ts
│   │   ├── elicitation.ts
│   │   ├── estimate.ts
│   │   ├── payment.ts
│   │   ├── document.ts
│   │   ├── generation.ts
│   │   ├── skill.ts
│   │   └── strapi.ts               # Strapi API response types
│   │
│   └── styles/
│       ├── globals.css             # Tailwind directives + focus-visible override
│       └── markdown.css            # Markdown renderer prose styles
│
├── api/                            # Vercel serverless functions
│   ├── generate.ts                 # Main Claude proxy + Strapi writer
│   ├── verify-payment.ts           # Razorpay/Stripe signature verification
│   ├── admin/
│   │   └── skill.ts                # Skill update endpoint (admin only)
│   └── webhooks/
│       └── stripe.ts               # Stripe payment webhook handler
│
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── .env.local                      # Local dev secrets (never commit)
└── vercel.json                     # Route rewrites + function config
```

---

## 2. Component Specifications

### COMP-01 — DocTag

**Purpose:** Renders a monospaced document type identifier chip (BRD, FRD, SRS etc.) with agent-specific colour coding.

**Props:**
```typescript
interface DocTagProps {
  type: 'BRD' | 'FRD' | 'SRS' | 'BMP' | 'USR' | 'PFD' | 'UC' |
        'DMD' | 'UAT' | 'RTM' | 'UIUX' | 'DEVPROMPT' | 'ELICITATION'
  size?: 'sm' | 'md'           // default: 'md'
  className?: string
}
```

**Variants & Sizes:**
- `md`: 11px IBM Plex Mono 500, padding 3px 8px, border-radius 4px
- `sm`: 10px IBM Plex Mono 500, padding 2px 6px, border-radius 4px

**Agent colour mapping (internal):**
```typescript
const agentColours = {
  BA: { bg: '#EEEDFE', border: '#AFA9EC', text: '#3C3489' },
  UX: { bg: '#E1F5EE', border: '#5DCAA5', text: '#085041' },
  PE: { bg: '#FAEEDA', border: '#EF9F27', text: '#633806' },
  SYS: { bg: 'var(--bg-secondary)', border: 'var(--border-secondary)', text: 'var(--text-secondary)' },
}
const docToAgent: Record<DocTagProps['type'], 'BA' | 'UX' | 'PE' | 'SYS'> = {
  BRD: 'BA', FRD: 'BA', SRS: 'BA', BMP: 'BA', USR: 'BA',
  PFD: 'BA', UC: 'BA', DMD: 'BA', UAT: 'BA', RTM: 'BA',
  UIUX: 'UX', DEVPROMPT: 'PE', ELICITATION: 'SYS',
}
```

**States:** default only (no interactive states — purely presentational)

**Accessibility:** `aria-label={type}` when used standalone; `aria-hidden="true"` when adjacent to visible text containing the type name

**Composed-from:** native `<span>` with Tailwind inline styles

---

### COMP-02 — StatusBadge

**Purpose:** Shows project / document lifecycle state with a colour dot indicator.

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'complete' | 'generating' | 'failed' | 'draft' | 'paid' | 'pending'
  size?: 'sm' | 'md'           // default: 'md'
}
```

**Dot colour per status:**
- `complete` / `paid`: `#639922` (success green)
- `generating`: `#378ADD` (info blue) — animated pulse
- `failed`: `#E24B4A` (error red)
- `draft` / `pending`: `var(--color-text-tertiary)` (muted)

**States:** default only; `generating` triggers CSS pulse animation

**Accessibility:** `aria-label={status}` on the badge container; dot is `aria-hidden="true"`

**Composed-from:** shadcn/ui `Badge` with custom colour overrides

---

### COMP-03 — StepIndicator

**Purpose:** Shows where the user is in the 5-step public funnel flow.

**Props:**
```typescript
interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  steps: Array<{ label: string }>   // default: ['Idea', 'Q&A', 'Review', 'Cost', 'Pay']
}
```

**Visual states per node:**
- Done (< currentStep): `bg-success-fill border-success-border` + `IconCheck`
- Active (= currentStep): `bg-amber-tint border-amber-primary text-amber-primary` + step number
- Pending (> currentStep): `bg-background-primary border-default text-muted` + step number

**Connecting line:**
- Done segment: `border-success-border`
- Pending segment: `border-default`

**Accessibility:**
- `role="list"` on container; `role="listitem"` on each step
- `aria-current="step"` on the active node
- `aria-label="Step {n} of 5: {label}. {status}"` per node

**Composed-from:** native `<div>` flex layout

---

### COMP-04 — AgentPipelineStrip

**Purpose:** Shows the three-agent pipeline with active/done/pending states on the generation progress screen.

**Props:**
```typescript
interface AgentPipelineStripProps {
  activeAgent: 'ba' | 'ux' | 'pe' | 'complete'
}
```

**Visual states:**
- Done agent: agent background colour at 60% opacity, `IconCheck` in success green
- Active agent: full agent colour, pulsing amber outline `ring-2 ring-amber-primary animate-pulse`
- Pending agent: background-secondary, muted text

**Connecting arrows:** `IconArrowRight` in muted colour between nodes

**Accessibility:**
- `role="list" aria-label="Generation pipeline"`
- Each agent node: `aria-label="{agent name}: {status}"` e.g. "BA Agent: generating"
- Active agent: `aria-current="true"`

**Composed-from:** native flex layout + `AgentPill` component per node

---

### COMP-05 — ChecklistItem

**Purpose:** Single row in the 13-item document generation checklist.

**Props:**
```typescript
interface ChecklistItemProps {
  docType: DocTagProps['type']
  docName: string
  status: 'complete' | 'generating' | 'pending'
  tokensGenerated?: number      // shown on active item only
}
```

**Visual states:**
- `complete`: green `IconCheck` circle + full-opacity text + `DocTag`
- `generating`: amber `IconLoader2` (spinning) + full-opacity text + "generating..." in mono-data + `DocTag`
- `pending`: empty circle + muted text + `DocTag` at 50% opacity

**Composed-from:** `DocTag`, `IconCheck`, `IconLoader2`, native flex row

**Accessibility:**
- `role="listitem"`
- `aria-label="{docName}: {status}"` e.g. "User Stories: generating"
- `aria-live="polite"` on the list container for status changes

---

### COMP-06 — MarkdownRenderer

**Purpose:** Renders generated document Markdown with custom styling and requirement ID highlighting.

**Props:**
```typescript
interface MarkdownRendererProps {
  content: string                // raw Markdown string
  className?: string
}
```

**Implementation notes:**
- Use `react-markdown` with `remarkGfm` plugin for GitHub-Flavored Markdown (tables, strikethrough)
- Apply custom `components` prop to override default HTML rendering with Tailwind-styled elements
- Post-process text nodes to detect `[A-Z]{2,4}-\d{3}` pattern and wrap in `<RequirementId>` component
- Tables: wrap in a `div` with `overflow-x-auto` to handle wide tables on mobile
- Code blocks: use `IBM Plex Mono` font

**Performance:** Memoize with `React.memo` — documents can be 50,000+ chars. Only re-render when `content` prop changes.

**Accessibility:**
- Document headings preserve the `h1`/`h2`/`h3` hierarchy from the source Markdown
- Tables use `<caption>` derived from the preceding heading

**Composed-from:** `react-markdown`, `remark-gfm`, `RequirementId` component

**Package:**
```bash
npm install react-markdown remark-gfm
```

---

### COMP-07 — CostBreakdownCard

**Purpose:** Displays the token estimate and INR cost breakdown before payment.

**Props:**
```typescript
interface CostBreakdownCardProps {
  model: string                  // e.g. "Claude Sonnet 4.6"
  estimatedTokens: number        // total buffered tokens
  apiCostInr: number
  platformFeeInr: number
  gstInr: number
  totalInr: number
  bufferMultiplier: number       // e.g. 1.4
}
```

**Derived display values** (computed inside component):
- Token display: `formatTokens(estimatedTokens)` → "284K"
- All INR values: `formatCurrency(value, 'INR')` → "₹193.52"

**Accessibility:**
- Rendered as `<table>` with `<caption>` "Generation cost breakdown"
- Total row uses `<th scope="row">`
- Info tooltip: `<button aria-label="What is the safety buffer?">` with `IconInfoCircle`

**Composed-from:** native `<table>`, shadcn/ui `Tooltip`, `DocTagStrip`

---

### COMP-08 — AuthGateModal

**Purpose:** Collects sign-up or sign-in at the payment gate without navigating away from the estimate screen.

**Props:**
```typescript
interface AuthGateModalProps {
  isOpen: boolean
  onSuccess: (userId: string) => void
  onDismiss: () => void
  ideaProjectId: string          // used for session merge after auth
}
```

**Internal state:** `activeTab: 'signup' | 'signin'`

**Form fields (sign-up):** email · password · (no name — added in profile setup)

**Form fields (sign-in):** email · password

**Validation rules (React Hook Form):**
```typescript
// Sign up
email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
password: {
  required: true,
  minLength: 8,
  validate: {
    hasUppercase: v => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
    hasNumber: v => /\d/.test(v) || 'Must contain at least one number',
  }
}
// Sign in
email: { required: true }
password: { required: true }
```

**On success flow:**
1. Call `useSessionMerge(ideaProjectId)` to transfer sessionStorage data
2. Call `onSuccess(userId)` prop
3. Modal closes; payment gateway opens automatically

**Accessibility:**
- `role="dialog" aria-modal="true" aria-labelledby="auth-modal-heading"`
- Focus trap while open (shadcn/ui `Dialog` handles this)
- On open: focus moves to email input
- On close: focus returns to "Pay ₹{total}" button

**Composed-from:** shadcn/ui `Dialog`, `Tabs`, `Input`, `Button`, `Label`; React Hook Form

---

### COMP-09 — DocumentSidebar

**Purpose:** Left sidebar in the document viewer listing all 13 generated documents grouped by agent.

**Props:**
```typescript
interface DocumentSidebarProps {
  documents: GeneratedDocument[]
  activeDocType: DocTagProps['type']
  onSelectDoc: (docType: DocTagProps['type']) => void
  onExportZip: () => void
  isExporting: boolean
}

interface GeneratedDocument {
  type: DocTagProps['type']
  name: string
  status: 'complete' | 'failed' | 'pending'
  agent: 'ba' | 'ux' | 'pe'
}
```

**Groups rendered:**
1. BA Agent (10 docs) — header with `AgentPill agent="ba"`
2. UX Agent (1 doc) — header with `AgentPill agent="ux"`
3. Prompt Engineer (1 doc) — header with `AgentPill agent="pe"`
4. Elicitation Q&A (1 doc) — no header, standalone item

**Active item style:** `border-l-2 border-amber-primary bg-amber-tint/40 text-ink`

**Export ZIP button:** pinned to bottom of sidebar, full-width secondary style

**Accessibility:**
- `role="navigation" aria-label="Generated documents"`
- Section headers: `role="group" aria-label="{agent name} documents"`
- Active item: `aria-current="page"`
- Export button: `aria-label="Export all 13 documents as ZIP file"`; loading state: `aria-busy="true"`

**Composed-from:** `DocTag`, `AgentPill`, shadcn/ui `ScrollArea` (for overflow), shadcn/ui `Button`

---

### COMP-10 — KPICardRow

**Purpose:** 4-card metric strip for admin analytics dashboard.

**Props:**
```typescript
interface KPICardRowProps {
  metrics: Array<{
    label: string
    value: string | number
    sub: string
    delta?: { value: number; positive: boolean }   // e.g. +12% vs last month
    valueIsCode?: boolean    // true → IBM Plex Mono rendering
  }>
}
```

**Rendering rules:**
- `value`: 22px Inter 500 for standard values; 18px IBM Plex Mono 400 for `valueIsCode: true` (token counts)
- `delta`: small coloured chip below `sub` — green for positive, red for negative
- Grid: `grid-cols-4` desktop, `grid-cols-2` tablet, `grid-cols-2` mobile

**Accessibility:**
- Each card: `role="article" aria-label="{label}: {value}"`
- Delta: `aria-label="{delta value}% {positive ? 'increase' : 'decrease'} vs last period"`

**Composed-from:** native `<div>` grid

---

## 3. Zustand Store Shapes

### useIdeaStore
```typescript
interface IdeaStore {
  projectId: string | null
  ideaText: string
  industry: string
  techPreference: string
  status: 'draft' | 'eliciting' | 'reviewing' | 'estimating' | 'paying' | 'generating' | 'complete' | 'failed'
  setIdea: (text: string, industry: string, tech: string) => void
  setProjectId: (id: string) => void
  setStatus: (status: IdeaStore['status']) => void
  reset: () => void
}
```

### useElicitationStore
```typescript
interface ElicitationStore {
  questions: string[]
  answers: (string | null)[]    // null = skipped
  currentIndex: number
  isComplete: boolean
  addAnswer: (index: number, answer: string | null) => void
  setQuestions: (questions: string[]) => void
  reset: () => void
}
```

### useEstimateStore
```typescript
interface EstimateStore {
  complexityLevel: 'simple' | 'medium' | 'complex'
  moduleCount: number
  model: string
  rawInputTokens: number
  rawOutputTokens: number
  bufferedInputTokens: number
  bufferedOutputTokens: number
  apiCostUsd: number
  apiCostInr: number
  platformFeeInr: number
  gstInr: number
  totalInr: number
  usdInrRate: number
  calculate: (ideaText: string, qaTranscript: QATranscript[], config: PricingConfig) => void
}
```

### useGenerationStore
```typescript
interface GenerationStore {
  status: 'idle' | 'running' | 'complete' | 'failed'
  currentAgent: 'ba' | 'ux' | 'pe' | null
  currentDocIndex: number           // 0–12
  docsComplete: number              // 0–13
  docStatuses: Record<DocType, 'pending' | 'generating' | 'complete' | 'failed'>
  activeTokenCount: number          // tokens streamed for current doc
  estimatedMinutesRemaining: number
  errorMessage: string | null
  setDocStatus: (docType: DocType, status: DocStatus) => void
  setActiveTokenCount: (count: number) => void
  markComplete: () => void
  markFailed: (message: string, docType: DocType) => void
  reset: () => void
}
```

### useDocumentStore
```typescript
interface DocumentStore {
  documents: Record<DocType, string | null>   // null = not yet generated
  setDocument: (docType: DocType, content: string) => void
  getDocument: (docType: DocType) => string | null
  hasAllDocuments: () => boolean
  clearAll: () => void
}
```

---

## 4. Key Implementation Guidelines

### 4.1 React

- All components: functional with TypeScript typed props — no `any`
- Separation of concerns: pages fetch/orchestrate; components render
- Memoize heavy components: `React.memo` on `MarkdownRenderer`, `DocumentChecklist`, `ProjectGrid`
- Stable keys: always use `docType` or `projectId` as keys, never array index
- Error boundaries: wrap `DocumentViewerPage` and `GenerationProgressPage` in `ErrorBoundary`

### 4.2 Tailwind

- Custom colours defined in `tailwind.config.ts` (see Section 2.4 of UIUX-03)
- Never inline hex values directly in JSX — always use Tailwind classes or CSS variables
- `cn()` utility (from shadcn/ui) for conditional class merging
- Mobile-first: default styles are mobile; `sm:`, `lg:`, `xl:` add tablet/desktop overrides

### 4.3 shadcn/ui

- Install components individually: `npx shadcn@latest add button dialog input textarea tabs toast progress badge scroll-area table tooltip`
- Customise via `className` overrides — never edit files in `src/components/ui/` directly
- Amber primary button override:
```tsx
// Usage
<Button className="bg-amber-primary hover:bg-amber-primary/90 text-[#FFF8ED]">
  Generate documents
</Button>
```

### 4.4 React Hook Form

- Use `useForm` with `zodResolver` for schema validation
- Fire validation `mode: 'onBlur'` (not `onChange`) for accessibility
- Surface errors via `formState.errors` and render inline below each field
- Never disable the submit button on invalid form — instead show inline errors on submit attempt (better for accessibility)

### 4.5 Zustand

- All stores with `persist` middleware for localStorage:
```typescript
import { persist } from 'zustand/middleware'
export const useDocumentStore = create(
  persist<DocumentStore>(
    (set, get) => ({ ... }),
    { name: 'ideaforge_v1_documents' }
  )
)
```
- `useIdeaStore` and `useElicitationStore`: use `sessionStorage` as the persist storage for pre-auth data:
```typescript
import { createJSONStorage } from 'zustand/middleware'
storage: createJSONStorage(() => sessionStorage)
```

### 4.6 Environment Variables

```bash
# .env.local (never commit)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_RAZORPAY_KEY_ID=         # public key only — secret is in Vercel env

# Vercel env vars (server-side only — never in VITE_ prefix)
ANTHROPIC_API_KEY=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRAPI_URL=
STRAPI_API_KEY=
ADMIN_EMAIL_WHITELIST=         # comma-separated
```

**Rule:** Any variable prefixed `VITE_` is bundled into the client. Never put secrets in `VITE_` variables.

### 4.7 Vercel Configuration

```json
// vercel.json
{
  "functions": {
    "api/*.ts": { "maxDuration": 300 }
  },
  "regions": ["sin1"],
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

### 4.8 Google Fonts Loading

Add to `index.html` — not in CSS `@import` (avoids render-blocking):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### 4.9 Global CSS

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: 'Inter', ui-sans-serif, system-ui;
}

:focus-visible {
  outline: 1.5px solid #BA7517;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(186, 117, 23, 0.15);
}

/* Pulse animation for generating status dot */
@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.animate-status-pulse {
  animation: statusPulse 1.2s ease-in-out infinite;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-status-pulse,
  .animate-pulse,
  .animate-spin {
    animation: none;
  }
}
```

### 4.10 Page Title Management

Update `document.title` on every route change for accessibility and browser history:
```typescript
// In each page component
useEffect(() => {
  document.title = 'Elicitation Q&A — IdeaForge'
}, [])
```

Or use a `usePageTitle(title: string)` custom hook that sets it in `useEffect`.

---

## 5. Validation Rules Reference

| Field | Rule | When fires | Error message |
|---|---|---|---|
| Idea textarea | Min 50 chars | Live (char count); submit | "Please describe your idea in at least 50 characters" |
| Idea textarea | Max 2000 chars | Live | Counter only; input blocked |
| Elicitation answer | Max 500 chars | Live | Counter; input blocked |
| Auth email | Valid email format | On blur | "Please enter a valid email address" |
| Auth password (sign-up) | Min 8 chars | On blur | "Password must be at least 8 characters" |
| Auth password (sign-up) | 1 uppercase | On blur | "Must contain at least one uppercase letter" |
| Auth password (sign-up) | 1 number | On blur | "Must contain at least one number" |
| Skill editor | Non-empty | On publish | "Skill content cannot be empty" |
| Skill editor | Max 50,000 chars | Live | Counter in footer; publish blocked |
| Platform margin | Integer 10–500% | On save | "Margin must be between 10% and 500%" |
| Buffer multiplier | Decimal 1.0–3.0 | On save | "Buffer multiplier must be between 1.0 and 3.0" |

---

## 6. Key Third-Party Package List

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.24.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.7.0",
    "zod": "^3.23.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "recharts": "^2.12.0",
    "@tabler/icons-react": "^3.5.0",
    "@supabase/supabase-js": "^2.44.0",
    "jszip": "^3.10.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**shadcn/ui components (add via CLI):**
```bash
npx shadcn@latest init
npx shadcn@latest add button dialog input textarea tabs toast progress badge scroll-area table tooltip select
```
