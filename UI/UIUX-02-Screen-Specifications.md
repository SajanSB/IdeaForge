# Screen Specifications
## IdeaForge — AI-Powered SDLC Documentation Platform

| Field | Value |
|---|---|
| Document ID | UIUX-02-IDEAFORGE |
| Version | 1.0 |
| Prepared By | Principal UI/UX Architect |
| Date | June 2026 |
| Traces To | UIUX-01-IDEAFORGE, FRD-IDEAFORGE-001 v1.1, USR-IDEAFORGE-001 v1.0 |

---

## SCR-01 — Landing Page

### 1. Purpose
Convert visitors into first-generation users. Primary CTA is "Start for free" — no sign-up required. Secondary goal: eliminate quality doubt by showing a real, scrollable sample document.

### 2. Primary Users & Roles
Guest (unauthenticated). All personas.

### 3. Entry Points
Direct URL, search engine, referral link, social share.

### 4. Layout & Regions

```
[Minimal top bar: wordmark left · Sign in right]
[Hero: one-line headline + sub + primary CTA]
[Sample output: scrollable BRD preview card]
[How it works: 4-step horizontal strip]
[What you get: doc tag cloud — all 13 tags]
[Pricing anchor: "Starts from ₹199"]
[Footer: minimal — Privacy · Terms]
```

### 5. Content & Data Presentation
- Headline: "From idea to 13 SDLC documents in under 15 minutes."
- Sub: "AI-powered Business Analyst, UX Architect, and Prompt Engineer — one generation, one payment."
- Sample output card: a real excerpt from a generated BRD (first 600 chars), with a `BRD` tag and `BRD-001` mono identifier visible. Fade-out at bottom with "See full output →" link.
- How it works strip: 4 nodes with icons and one-line labels: `ti-bulb` Idea → `ti-messages` Q&A → `ti-credit-card` Pay → `ti-file-description` Docs
- Doc tag cloud: all 13 `doc-tag` chips in agent colour groups (purple BA / teal UX / amber PE)
- No pricing table — single anchor line only

### 6. Actions
- Primary: "Start for free →" → navigates to `/idea/new`
- Secondary: "Sign in" (top right) → `/login`
- Tertiary: "See full output →" on sample card → opens sample doc in a modal

### 7. States
- Default: as above
- Loading state: N/A — static page
- Empty state: N/A
- Error state: N/A
- Success feedback: N/A

### 8. Validation & Error Handling
N/A — no form on this screen.

### 9. Responsive Behavior
- Mobile (< 640px): hero text scales to 24px; CTA full-width; how-it-works strip stacks vertically 2×2; doc tags wrap naturally; sample card full-width
- Tablet (640–1024px): two-column how-it-works; sample card centred at max-width 560px
- Desktop (> 1024px): max-width 760px content column, centred; sample card max-width 640px

### 10. Accessibility Notes
- Headline is `<h1>`; section headings are `<h2>`
- "Start for free" CTA has `aria-label="Start generating documents for free — no sign-up required"`
- Sample output card is `role="region" aria-label="Sample BRD document preview"`
- Doc tag cloud is `role="list"` with each tag as `role="listitem"`
- All Tabler icons decorative: `aria-hidden="true"`
- Colour contrast: amber `#BA7517` on white background = 4.6:1 ✓

### 11. Component Inventory
`TopBar`, `HeroSection`, `SampleDocCard`, `HowItWorksStrip`, `DocTagCloud`, `PricingAnchor`, `Footer`
shadcn: `Button`, `Badge`

### 12. Interaction / UX Notes
- No animation on load — static, fast, trustworthy
- Sample card uses `overflow: hidden` with a CSS fade gradient at bottom — not a "read more" button; creates intrigue
- "Start for free" uses amber primary button style; Sign in is ghost text link only

---

## SCR-02 — Idea Submission

### 1. Purpose
Capture the user's raw application idea and optional metadata. Gate: idea must be ≥ 50 characters before proceeding.

### 2. Primary Users & Roles
Guest or authenticated user. All personas.

### 3. Entry Points
Landing page CTA, dashboard "New idea" link, direct URL `/idea/new`.

### 4. Layout & Regions

```
[Minimal top bar: wordmark · Sign in]
[Step indicator: ● ○ ○ ○ ○  "Step 1 of 5 — Your idea"]
[Screen heading: "Describe your application idea"]
[Idea textarea — full width, tall]
[Character count: "0 / 2000 · min 50 to continue"]
[Hint text: example idea (collapsed, expandable)]
[Row: Industry dropdown · Tech preference dropdown]
[Primary CTA: "Start elicitation →" — disabled until ≥ 50 chars]
[Guest notice banner: "Progress saved in this browser session"]
```

### 5. Content & Data Presentation
- Textarea placeholder: "e.g. A mobile app for independent clinic owners to manage appointments, patient records, billing, and staff schedules — targeting small clinics in India with 1–10 doctors."
- Industry dropdown options: SaaS · E-commerce · HealthTech · EdTech · FinTech · Field Service · Construction · Other
- Tech preference options: Any (default) · React · Next.js · Angular · Vue · Flutter · Other

### 6. Actions
- Primary: "Start elicitation →" — disabled until ≥ 50 chars; enabled on reach
- No secondary action (back would go to landing)

### 7. States
- Default: empty textarea, CTA disabled
- Typing: character count updates live; CTA enables at 50
- Near limit: counter turns amber at 1800/2000
- At limit: counter turns red; input stops accepting characters
- Error: textarea border red + inline message if user somehow submits empty
- Loading: N/A — no async on this screen
- Success: on submit, brief loading state on CTA button ("Saving...") then navigate

### 8. Validation & Error Handling
- Min 50 chars: enforced client-side; CTA disabled (not just showing an error)
- Max 2000 chars: enforced via `maxLength` — no truncation warning needed, just the counter
- Validation fires on: character count live (for min gate); no on-blur needed
- Error message (if JS fails): "Please describe your idea in at least 50 characters."

### 9. Responsive Behavior
- Mobile: textarea height 200px minimum; industry + tech preference stack vertically; CTA full-width
- Tablet / desktop: textarea height 240px; dropdowns side by side in a 2-column row

### 10. Accessibility Notes
- Textarea has `<label>` "Application idea" visually and programmatically associated via `htmlFor`
- Character count live region: `aria-live="polite"` so screen readers announce it on change
- CTA has `aria-disabled="true"` when below 50 chars (not `disabled` attr — allows focus and explanation on keyboard)
- Guest notice uses `role="status"`

### 11. Component Inventory
`StepIndicator`, `IdeaTextarea`, `CharacterCount`, `HintExpander`, `MetadataRow`
shadcn: `Textarea`, `Select`, `Button`, `Badge`
React Hook Form for form state

### 12. Interaction / UX Notes
- CTA text is "Start elicitation →" not "Next" — tells the user what happens, not just that they're moving
- Hint text shows a real example idea, not lorem ipsum — helps Priya (low confidence) see the right level of detail
- Guest notice is informational, not alarming — uses `ti-info-circle` icon

---

## SCR-03 — Elicitation Q&A

### 1. Purpose
The BA agent asks 5–8 clarifying questions one at a time. The user answers conversationally. The output is a Q&A transcript that fuels the generation pipeline.

### 2. Primary Users & Roles
Guest or authenticated user.

### 3. Entry Points
Idea submission screen (on submit).

### 4. Layout & Regions

```
[Minimal top bar: wordmark · Sign in]
[Step + question indicator: ● ● ○ ○ ○  "Step 2 · Question 3 of 7"]
[Conversation thread — scrollable]
  [Agent message bubble — left aligned]
  [Prior user answer — right aligned — muted]
  [Agent next question — left aligned — highlighted]
[Answer textarea — fixed at bottom of thread]
[Row: "Answer →" primary button · "Skip this question" ghost link]
```

### 5. Content & Data Presentation
- Agent messages use a subtle agent badge: `[BA Agent]` in IBM Plex Mono amber
- Prior Q&A pairs are visible above the current question (collapsed accordion for > 3 prior pairs)
- Current question is visually distinct (full opacity, slight amber left-border accent)
- Skipped questions appear in the thread with "(skipped)" in muted mono text

### 6. Actions
- Primary: "Answer →" — submits answer, loads next question
- Secondary: "Skip this question" — logs null answer, loads next question
- On last question: button changes to "Review my answers →"

### 7. States
- Default: question visible, textarea empty
- Typing: character counter updates; "Answer →" enabled immediately (no minimum)
- Loading (waiting for next question): CTA shows loading spinner; thread shows typing indicator from agent
- Agent typing indicator: three animated dots in an agent bubble
- Error (API timeout): "The BA agent couldn't load the next question. [Retry]"
- Complete: auto-navigate to review screen
- Empty state: N/A — questions are pre-generated from the idea

### 8. Validation & Error Handling
- Max 500 chars per answer: enforced via `maxLength`; counter shown when > 400
- Answer can be empty only via the explicit "Skip" action — the "Answer →" button requires ≥ 1 char
- If API call for next question fails after 3 retries: error state with retry button; existing answers preserved in sessionStorage

### 9. Responsive Behavior
- Mobile: conversation thread takes full width; textarea pinned to bottom of viewport (sticky); "Skip" becomes a small text link below the CTA
- Tablet / desktop: max-width 680px centred column; comfortable reading width

### 10. Accessibility Notes
- New agent questions announced via `aria-live="polite"` on the thread container
- Typing indicator: `role="status" aria-label="BA agent is composing a question"`
- Answer textarea: `<label>` "Your answer" tied via `htmlFor`; `aria-describedby` pointing to character count
- Skip link: `aria-label="Skip this question and move to the next one"`

### 11. Component Inventory
`QuestionThread`, `AgentBubble`, `UserAnswerBubble`, `TypingIndicator`, `AnswerInput`
shadcn: `Textarea`, `Button`

### 12. Interaction / UX Notes
- Thread scrolls automatically to the latest question on load — user doesn't hunt for where they are
- Typing indicator (three dots) appears for 1–2 seconds before each new question — even if the API returns instantly — to signal that the agent is "thinking"
- This is the most cognitively demanding screen; keep the interface extremely minimal — no sidebar, no distractions

---

## SCR-04 — Token Estimate & Cost Breakdown

### 1. Purpose
Show the user exactly what they will pay, and what they will receive, before requesting payment. The design imperative: no surprises.

### 2. Primary Users & Roles
Guest or authenticated user.

### 3. Entry Points
Idea review screen (on confirm).

### 4. Layout & Regions

```
[Minimal top bar]
[Step indicator: ● ● ● ● ○  "Step 4 of 5 — Your cost"]
[Heading: "Your generation estimate"]
[Cost breakdown card]
  Model badge · token count
  Line items: API cost · Platform fee · GST · Total
  [Info icon] tooltip: "Includes 1.4× safety buffer..."
[What you'll receive: doc tag strip — all 13]
[Primary CTA: "Pay ₹{total} & generate documents"]
[Back link: "← Edit my answers"]
```

### 5. Content & Data Presentation
- Model badge: `[Claude Sonnet 4.6]` in IBM Plex Mono
- Token count: `~284,000 tokens` — shown as an approximate; includes "(incl. 1.4× safety buffer)"
- Cost table:

| Item | Amount |
|---|---|
| Anthropic API cost | ₹82.00 |
| Platform fee | ₹82.00 |
| GST (18%) | ₹29.52 |
| **Total** | **₹193.52** |

- Info icon next to total: tooltip explaining buffer and no-refund policy
- Doc tag strip: all 13 tags, grouped by agent, as a visual confirmation of what is being purchased
- Gateway selector: Razorpay (India) shown by default; Stripe (International) as secondary option

### 6. Actions
- Primary: "Pay ₹{total} & generate documents" — amber primary button
- If not signed in: clicking CTA triggers auth modal before payment opens
- Secondary: "← Edit my answers" — returns to review screen preserving all data
- Gateway toggle: Razorpay / Stripe radio-style selector

### 7. States
- Default: cost displayed; CTA enabled
- Loading (calculating): skeleton shimmer on cost lines while client-side calc runs (< 100ms typically)
- Auth gate: modal overlay appears before payment; cost screen remains visible beneath
- Post-auth: modal closes; CTA proceeds to payment gateway
- Error (calc failure): "Unable to calculate cost. Please try again." with retry

### 8. Validation & Error Handling
- Cost calculation is client-side; no API call needed — no validation failure expected
- Gateway mismatch (Stripe selected but INR only): not applicable — Stripe handles USD, Razorpay handles INR; selector controls which opens

### 9. Responsive Behavior
- Mobile: cost card full-width; doc tags wrap to 3 per row; CTA full-width sticky at bottom
- Tablet / desktop: cost card max-width 480px centred; CTA 320px centred

### 10. Accessibility Notes
- Cost table is a `<table>` with `<caption>` "Generation cost breakdown"
- Total row uses `<th scope="row">` for screen reader association
- Info tooltip: `role="tooltip"` with `aria-describedby` on the total row
- CTA `aria-label` includes the exact amount: "Pay ₹193.52 and generate documents"

### 11. Component Inventory
`StepIndicator`, `CostBreakdownCard`, `DocTagStrip`, `GatewaySelector`, `AuthGateModal`
shadcn: `Button`, `Badge`, `Tooltip`, `Dialog` (auth modal)

### 12. Interaction / UX Notes
- The total is the largest typography element on this screen — 28px Inter 500 in amber
- "Platform fee" is labelled neutrally — not "profit margin" or "service fee"
- Buffer explanation is in the tooltip, not inline — reduces visual noise for confident users while remaining transparent
- Estimated time notice: small caption "Generation takes 10–15 minutes" below CTA

---

## SCR-05 — Auth Gate Modal

### 1. Purpose
Collect user identity at the lowest-friction point possible, immediately before payment. Framed as account creation for document access and receipt — not as a prerequisite.

### 2. Primary Users & Roles
Guest user transitioning to authenticated.

### 3. Entry Points
Payment CTA on token estimate screen.

### 4. Layout & Regions

```
[Overlay: cost estimate screen dimmed behind]
[Modal — centred, max-width 400px]
  [Close ×]
  [Heading: "Save your documents & get your receipt"]
  [Sub: "One account — access your docs on any device"]
  [Tab: Sign up | Sign in]
  [Form: email + password]
  [OR divider]
  [Google sign-in button]
  [Submit CTA: "Continue to payment →"]
  [Terms micro-copy]
```

### 5. Content & Data Presentation
- Heading is benefit-led, not gate-led: "Save your documents" not "Please create an account"
- Sign up tab is default (most users will be new)
- Sign in tab for returning users
- Google OAuth as a prominent alternative — reduces friction for Rohan (technical user)

### 6. Actions
- Primary: "Continue to payment →"
- Secondary: Google sign-in
- Tab switch: Sign up ↔ Sign in (no page navigation — inline tab)
- Close: × dismisses modal; returns to estimate screen (CTA re-enabled)

### 7. States
- Default: Sign up tab, empty form
- Submitting: CTA loading spinner; form disabled
- Error (email exists on sign-up): inline error: "An account with this email already exists. Sign in instead?" with link
- Error (wrong password on sign-in): "Incorrect password." inline under password field
- Error (network): "Something went wrong. Please try again."
- Success: modal closes; seamless transition to payment gateway; session merge fires in background

### 8. Validation & Error Handling
- Email: valid format check on blur; "Please enter a valid email address"
- Password (sign-up): min 8 chars, 1 uppercase, 1 number — validated on blur with specific message per rule
- Required fields: both email and password required; inline error on submit attempt
- All errors inline under the relevant field — no banner-only errors

### 9. Responsive Behavior
- Mobile: modal is a bottom sheet (slides up from bottom); full-width; `border-radius` top only
- Tablet / desktop: centred modal with overlay; max-width 400px

### 10. Accessibility Notes
- Modal uses `role="dialog" aria-modal="true" aria-labelledby="auth-modal-heading"`
- Focus trapped within modal while open
- Close button: `aria-label="Close and return to cost estimate"`
- On open: focus moves to first field (email)
- On close: focus returns to "Pay" CTA on estimate screen
- Error messages: `aria-live="assertive"` for immediate announcement

### 11. Component Inventory
`AuthGateModal`, `AuthTabs`, `EmailPasswordForm`, `GoogleOAuthButton`
shadcn: `Dialog`, `Tabs`, `Input`, `Button`, `Label`
React Hook Form

### 12. Interaction / UX Notes
- Session merge (sessionStorage → Zustand authenticated store) fires silently on successful auth — user never re-enters their idea
- If session merge fails: toast warning "We couldn't recover your session data — you may need to re-enter your idea" with support link
- Google OAuth callback must return to `/idea/:id/payment` not to dashboard

---

## SCR-06 — Generation Progress

### 1. Purpose
Keep the user informed and reassured during a 10–15 minute wait. The single most emotionally critical screen in the product.

### 2. Primary Users & Roles
Authenticated user (paid).

### 3. Entry Points
Successful payment confirmation.

### 4. Layout & Regions

```
[Full app shell: top nav with wordmark + user avatar]
[Screen heading: "Generating your documents"]
[Project sub-header: PRJ-00143 · idea snippet · ₹193.52 paid]
[Agent pipeline strip: BA Agent → UX Agent → PE Agent]
  [Active agent highlighted with amber pulse dot]
[Document checklist — 13 items]
  [✓ Completed — green check + doc tag]
  [⟳ Active — amber spinner + doc tag + "generating..."]
  [○ Pending — empty circle + doc tag muted]
[Progress bar: "4 / 13 documents complete"]
[Estimated time remaining: "~9 minutes remaining"]
[Email notice: "We'll email you when done — you can close this tab"]
```

### 5. Content & Data Presentation
- Agent pipeline: three nodes with connecting line; active node has pulsing amber outline
- Document checklist uses exact doc names from the BA skill output (not generic "Document 4")
- Each item shows: status icon · doc name · `doc-tag` chip · agent name in mono
- Active item shows token count as it streams: "3,241 tokens generated"
- Progress bar uses amber fill; percentage label at right end
- Estimated time: calculated from average per-document generation time × remaining count

### 6. Actions
- No primary action during generation — generation cannot be cancelled once started
- "Email me when done" toggle: opt-in (on by default if notification_email is true in settings)
- "Close tab" is explicitly permitted — email notification covers it

### 7. States
- Generating: animated as described above
- Complete: all 13 items show green check; progress bar 100% amber; 2 seconds then auto-navigate to document viewer with a success toast
- Partial failure: failed item shows red × icon; "Generation stopped at [doc name]" error card appears; refund instructions shown below checklist
- Full failure: error card full-width; all items show muted state; refund instructions prominent

### 8. Validation & Error Handling
- If user navigates away and returns: screen re-hydrates from Zustand + Strapi status; correct state shown
- If browser closes during generation: email is sent on completion; user can return to `/project/:id` to access docs

### 9. Responsive Behavior
- Mobile: agent pipeline strip is horizontal scroll; checklist is full-width single column; progress bar full-width
- Tablet / desktop: checklist max-width 560px centred; agent strip above it

### 10. Accessibility Notes
- Checklist items use `role="listitem"`; status changes announced via `aria-live="polite"` on the list container
- Active spinner: `aria-label="Generating: Benefit Measurement Plan"` on the spinner element
- Progress bar: `<progress value="4" max="13">` with visible label "4 of 13 documents complete"
- Error state: `role="alert"` on error card for immediate screen reader announcement

### 11. Component Inventory
`AgentPipelineStrip`, `DocumentChecklist`, `ChecklistItem`, `GenerationProgressBar`, `TimeEstimate`, `GenerationErrorCard`
shadcn: `Progress`, `Badge`, `Alert`

### 12. Interaction / UX Notes
- The pulse animation on the active agent node is the ONLY animation on this screen — purposeful, not decorative
- Token counter on active item satisfies technical users (Rohan); non-technical users (Priya) can ignore it
- "You can close this tab" is explicitly stated — prevents users from feeling trapped
- Typing-indicator style animation is NOT used here — this screen must feel like real work is happening, not chat

---

## SCR-07 — Document Viewer

### 1. Purpose
Present all 13 generated documents in a professional, readable, usable format. Enable copy, download, and export. The quality of this screen determines whether users return.

### 2. Primary Users & Roles
Authenticated user (post-generation).

### 3. Entry Points
Auto-navigate from generation progress screen; direct URL `/idea/:id/documents`; project detail screen.

### 4. Layout & Regions

```
[Top nav: wordmark · Dashboard · New idea · User ▾]
[Sub-header bar]
  [Project: PRJ-00143 · idea snippet]
  [Right: "↓ Export all (ZIP)" button]
[Two-panel layout]
  [Left sidebar — 240px fixed]
    [Section: BA Agent (10)]
      [List item: ✓ BRD — Business Requirements]
      [List item: ✓ FRD — Functional Requirements]
      ... 8 more
    [Section: UX Agent (1)]
      [List item: ✓ UI/UX Specification]
    [Section: Prompt Engineer (1)]
      [List item: ✓ AI Dev Prompt]
    [List item: Elicitation Q&A]
  [Right panel — flex 1]
    [Document header: doc name · doc-tag chip · mono ID]
    [Actions row: Copy · Download MD · Fullscreen]
    [Markdown renderer — full content]
```

### 5. Content & Data Presentation
- Left sidebar: document names with status icons; active item highlighted with amber left-border accent
- Document header: large doc name (18px Inter 500) + `doc-tag` chip + mono ID (`BRD-001` in `#BA7517`)
- Actions row: `ti-copy` Copy · `ti-download` Download MD · `ti-maximize` Fullscreen
- Markdown renderer: full document with heading hierarchy, tables (horizontal scroll if needed), code blocks in mono font
- BA identifier references (FR-001, US-017 etc.) rendered in amber mono colour for scannability

### 6. Actions
- Primary: none — this is a viewing screen
- Copy: copies raw Markdown to clipboard; success toast "Copied to clipboard"
- Download MD: downloads `BRD-PRJ-00143.md`
- Fullscreen: expands right panel to full viewport; `Esc` or close button to exit
- Export all ZIP: downloads `ideaforge-PRJ-00143-docs.zip`
- Sidebar item click: switches active document; scroll to top of right panel

### 7. States
- Default: BRD selected, content visible
- Loading (switching doc): right panel shows skeleton while content hydrates from localStorage
- Content unavailable (localStorage cleared): "This document is not available. Your payment and generation records are safe — please contact support to regenerate." with support link
- Fullscreen: overlay mode, same content
- Empty state: N/A — viewer only accessible after successful generation

### 8. Validation & Error Handling
- If a specific document is missing from localStorage: show placeholder card within the sidebar item with "Document unavailable" and a support link — do not hide the sidebar item
- ZIP export failure: toast "Export failed. Please try again." with retry button

### 9. Responsive Behavior
- Mobile: sidebar becomes a bottom sheet triggered by a FAB "Documents" button; right panel takes full width; fullscreen is default
- Tablet (640–1024px): sidebar collapses to icon rail (doc-tag chips only); tooltip on hover shows full name
- Desktop (> 1024px): full two-panel layout as described

### 10. Accessibility Notes
- Sidebar uses `role="navigation" aria-label="Generated documents"`
- Active document: `aria-current="page"` on the active sidebar item
- Document heading hierarchy must be preserved in Markdown rendering (h1 = document title only; h2, h3 for sections)
- Copy button: `aria-label="Copy BRD Markdown to clipboard"`; after copy: `aria-label="Copied!"` for 2 seconds
- Fullscreen: `role="dialog" aria-modal="true"` when in fullscreen mode; focus trapped; `Esc` closes

### 11. Component Inventory
`ViewerShell`, `DocumentSidebar`, `SidebarSection`, `SidebarItem`, `DocumentPanel`, `MarkdownRenderer`, `DocumentActions`, `FullscreenViewer`, `ExportZipButton`
shadcn: `ScrollArea`, `Button`, `Tooltip`, `Badge`

### 12. Interaction / UX Notes
- BRD is pre-selected on load — the first and most foundational document; satisfies Priya
- Dev Prompt is visually distinct in the sidebar — larger font weight, `PE` amber tag — to help Rohan find it immediately
- Requirement identifiers (FR-XXX, BR-XXX, US-XXX) in document content should render as styled mono spans, not plain text — makes documents look like professional BA output
- Table of contents anchor links are generated from document headings — accessible via keyboard and visible on desktop

---

## SCR-08 — User Dashboard

### 1. Purpose
Overview of all past projects; entry point for continuing or starting work.

### 2. Primary Users & Roles
Authenticated user.

### 3. Entry Points
Top nav "Dashboard" link; post-generation "Go to dashboard" link; direct URL `/dashboard`.

### 4. Layout & Regions

```
[Top nav]
[Page heading: "Your projects"  [+ New idea] button]
[Search bar — filter by idea text]
[Projects grid: 2-column cards on desktop, 1 on mobile]
  [Project card]
    [doc-tag: top doc type] [status-badge right]
    [Idea snippet: 14px, 2 lines max]
    [Mono ID + date]
    [Progress bar if generating; doc count if complete]
    [Actions: Open · Delete]
```

### 5. Content & Data Presentation
- Projects sorted by `created_at` descending (most recent first)
- Each card shows: idea snippet (first 100 chars), project ID, date, status badge, document count or progress
- Status badges: Complete (green) · Generating (blue pulse) · Failed (red) · Draft (gray)

### 6. Actions
- Primary: "Open" — navigates to document viewer or generation progress
- Global: "+ New idea" — navigates to `/idea/new`
- Destructive: "Delete" — triggers confirmation modal
- Search: filters project list client-side in real time

### 7. States
- Default: project grid populated
- Empty state: "No projects yet. Generate your first SDLC suite." with large "Start for free" CTA centred
- Loading: skeleton cards (same dimensions as real cards) while localStorage hydrates
- Search with no results: "No projects match '[query]'. [Clear search]"
- Error (localStorage read failure): "Unable to load projects. Please refresh." toast

### 8. Validation & Error Handling
- Delete confirmation: modal with project idea snippet visible — "Delete 'Clinic management SaaS'? This permanently removes all documents." Two buttons: "Delete" (red) · "Keep it" (secondary)
- No bulk delete in v1

### 9. Responsive Behavior
- Mobile: single-column card stack; search bar full-width above cards; "+ New idea" floats as FAB bottom-right
- Tablet: 2-column grid
- Desktop: 2-column grid, max-width 900px centred

### 10. Accessibility Notes
- Project cards are `<article>` elements
- "Open" action: `aria-label="Open project: Clinic management SaaS"`
- Delete: `aria-label="Delete project: Clinic management SaaS"` — confirmation modal traps focus
- Empty state: `role="status"` with the empty message

### 11. Component Inventory
`ProjectGrid`, `ProjectCard`, `ProjectStatusBadge`, `ProjectSearch`, `DeleteConfirmModal`
shadcn: `Card`, `Badge`, `Button`, `Dialog`, `Input`

### 12. Interaction / UX Notes
- "Generating" cards show a live-updating progress bar — poll Zustand store (which polls Strapi) every 5 seconds
- Cards are not draggable or sortable in v1 — sort is always newest-first
- Card click (anywhere except "Delete") opens the project

---

## SCR-09 — Admin Analytics Dashboard

### 1. Purpose
Give Sajan an instant read on platform health: revenue, generation volume, token costs, and conversion — all from Strapi data.

### 2. Primary Users & Roles
Admin only.

### 3. Entry Points
Admin sidebar "Analytics" link; admin login success redirect.

### 4. Layout & Regions

```
[Admin shell: left sidebar 240px]
[Page heading: "Analytics"]
[Date range selector: This month | Last 30 days | All time]
[KPI card row: 4 cards]
  Generations · Revenue (₹) · Avg tokens · Conversion %
[Chart row: 2-column]
  [Daily generation volume — Recharts LineChart]
  [Model usage split — Recharts PieChart]
[Chart row: 2-column]
  [Revenue by week — Recharts BarChart]
  [Top industries — Recharts BarChart horizontal]
[Recent generations table]
  Columns: Idea snippet · User email · Amount · Tokens · Model · Status · Date
  Filters: Status · Date range
  Pagination: 20 per page
```

### 5. Content & Data Presentation
- KPI cards: metric in 22px Inter 500; label in 11px muted; delta vs previous period in green/red
- Charts use Recharts; amber `#BA7517` as primary chart colour; slate `#6B7280` as secondary
- Table rows show IBM Plex Mono for amounts and token counts; sentence case for status badges

### 6. Actions
- Date range toggle (radio pills): changes all data on the screen
- Table row click: navigates to user detail / dispute resolution screen
- Table: sortable by Amount, Tokens, Date

### 7. States
- Loading: skeleton shimmer on KPI cards and charts; table shows 5 skeleton rows
- Empty (no data yet): empty state with "No generations yet. Share IdeaForge to get your first generation."
- Error (Strapi unavailable): error banner "Analytics data unavailable — Strapi connection failed." with retry

### 8. Validation & Error Handling
- Date range: "All time" is capped at 12 months in v1 for performance
- Charts gracefully handle 0-value data (empty state message inside chart area)

### 9. Responsive Behavior
- Tablet: 2-column chart row collapses to 1 column; table allows horizontal scroll
- Mobile: KPI cards 2×2 grid; charts stack vertically; table shows 4 columns only (snippet, amount, status, date)

### 10. Accessibility Notes
- Charts: `aria-label` on each chart container; data also available in a `<details>` summary table for screen readers
- KPI cards: values are plain text numbers — no icon-only values
- Table: full `<thead>` with `<th scope="col">`; sortable headers have `aria-sort`

### 11. Component Inventory
`AdminShell`, `KPICardRow`, `DateRangeToggle`, `GenerationLineChart`, `ModelPieChart`, `RevenueBarChart`, `IndustryBarChart`, `GenerationTable`
shadcn: `Card`, `Badge`, `Button`, `Table`, `Pagination`
Recharts: `LineChart`, `PieChart`, `BarChart`

### 12. Interaction / UX Notes
- Default date range: "Last 30 days" — most actionable window
- Revenue KPI shows net margin (after API cost), not gross — Sajan's most useful number
- Clicking a table row navigates to a dispute resolution view showing full payment + token audit trail from Strapi

---

## SCR-10 — Admin Skill Manager

### 1. Purpose
Allow Sajan to edit, preview, and publish the SKILL.md for any of the three AI agents without code changes.

### 2. Primary Users & Roles
Admin only.

### 3. Entry Points
Admin sidebar "Skill manager" link.

### 4. Layout & Regions

```
[Admin shell]
[Page heading: "Skill manager"]
[Agent selector: [BA Agent ▾] [UX Agent] [Prompt Engineer] — tab style]
[Two-column split: 50/50]
  [Left: Markdown editor]
    [Toolbar: Bold · Italic · Code · Heading · Divider]
    [Monaco-style textarea with mono font]
    [Footer: character count · Version badge: "v7 · Published 20 Jun"]
  [Right: Preview panel]
    [Empty state: "Click Preview to test this skill"]
    [OR: rendered sample generation output]
[Action bar below editor]
  [Preview (test generation)] [Publish update]
  [Last published: 20 Jun 2026 · v7]
```

### 5. Content & Data Presentation
- Editor uses `IBM Plex Mono` for content — essential for Markdown readability
- Version badge shows current active version and publish date
- Preview panel shows the output of a test generation using a hardcoded sample idea ("A task management SaaS for freelancers")
- After publish: success banner "Skill v8 published — active on next generation"

### 6. Actions
- Primary: "Publish update" — triggers validation then POST to Strapi
- Secondary: "Preview" — runs test generation; result shown in right panel
- Tab switch: changes active agent; prompts "Unsaved changes — discard and switch?" if editor is dirty

### 7. States
- Default: editor loaded with current skill content; preview panel empty
- Editing: "Unsaved changes" pill appears in editor footer
- Previewing: right panel shows loading skeleton then rendered Markdown output
- Publishing: "Publish update" button loading; editor disabled
- Success: success banner; version badge increments; "Unsaved changes" pill clears
- Validation error: inline error below editor "Skill content cannot be empty / exceeds 50,000 characters"
- Preview error (Claude API): "Preview generation failed. Check the skill content for errors." with raw error detail in a `<details>` block

### 8. Validation & Error Handling
- Non-empty: enforced on publish attempt
- Max 50,000 chars: counter in editor footer; publish blocked if exceeded
- Markdown structure check: warn (not block) if no headings found — "Skill has no headings — this may affect agent quality"

### 9. Responsive Behavior
- Tablet: editor and preview stack vertically; preview below editor
- Mobile: preview hidden; editor full-width with "Preview" opening a modal

### 10. Accessibility Notes
- Markdown editor: `<textarea>` with `aria-label="Skill content for BA Agent"` and `aria-describedby` pointing to character count
- Version badge: `aria-label="Current published version: v7, published 20 June 2026"`
- Publish button: `aria-disabled` when content is unchanged; confirmation dialog before publish

### 11. Component Inventory
`SkillAgentTabs`, `MarkdownSkillEditor`, `SkillPreviewPanel`, `VersionBadge`, `PublishConfirmDialog`
shadcn: `Tabs`, `Button`, `Textarea`, `Badge`, `Alert`, `Dialog`

### 12. Interaction / UX Notes
- "Preview" is separated from "Publish" intentionally — never accidentally publish while testing
- The preview panel uses the exact same Markdown renderer as the document viewer — WYSIWYG fidelity
- The hardcoded test idea for preview is shown above the preview panel so Sajan understands what the output is based on
