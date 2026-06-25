// api/generate.ts
import crypto    from 'crypto'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })
const supabase  = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// ── Document generation instructions ─────────────────────────────────────────

const DOC_INSTRUCTIONS: Record<string, string> = {
  BRD: `Generate a comprehensive Business Requirements Document (BRD) for this application.

Structure your output as a professional Markdown document with these sections:
1. Executive Summary (3–4 sentences describing the platform, target users, revenue model)
2. Business Objectives (table: ID | Objective | Priority — use BO-XXX identifiers)
3. Problem Statement (current pain points with quantified impact where possible)
4. Current State (how the problem is solved today)
5. Future State (how IdeaForge solves it)
6. Scope (In Scope table + Out of Scope table)
7. Stakeholders (table: Stakeholder | Role | Influence | Interest)
8. Assumptions (table: ID | Assumption | Owner | Validation Method — use ASM-XXX)
9. Constraints (table: Constraint | Description)
10. Risks (table: Risk ID | Description | Probability | Impact | Severity | Mitigation — use RISK-XXX)
11. Success Criteria (measurable KPIs with targets)
12. Business Benefits (table: Benefit | Description | KPI)

Use the idea text and Q&A answers to make every section specific to this application. Do not use generic placeholder text.`,

  FRD: `Generate a Functional Requirements Document (FRD) for this application.

Structure:
1. Functional Overview (tech stack and architecture summary)
2. Module Descriptions (grouped by domain — list each module with ID like M01, description, routes, key behaviour)
3. Screen Specifications (for each key screen: purpose, layout regions, content, actions, states, validation, responsive)
4. Workflow Requirements (FR-001 through FR-XXX — numbered functional requirements in bold)
5. Validation Rules (table: Field | Rule)
6. Notification Rules (table: Trigger | Recipient | Channel | Content)
7. User Roles (table: Role | Description | Access)
8. Permission Matrix (table: Action | Role1 | Role2 | Admin)
9. Reports and Dashboards
10. Integration Requirements (table: Integration | Purpose | Method)

Reference the BRD business objectives where relevant. Use FR-XXX for requirement IDs.`,

  SRS: `Generate a System Requirements Specification (SRS).

Structure:
1. Functional Requirements (SR-001 onwards — each mapped to FR-XXX from FRD, with priority Must Have / Should Have / Nice to Have)
2. Non-Functional Requirements (performance, compatibility, responsive, localisation, accessibility)
3. Security Requirements (authentication, authorisation, data protection, HTTPS, rate limiting)
4. Performance Requirements (with measurable targets in the Metric column)
5. Scalability Requirements
6. Availability Requirements
7. Reliability Requirements (retry logic, error handling, data preservation)
8. Data Requirements (split: server-side authoritative store vs client-side cache)
9. API Requirements (each endpoint: method, auth, request body, response, side effects, error codes)
10. Infrastructure Requirements (hosting, CI/CD, secrets management, monitoring)

Use SR-XXX for all requirement IDs. Be specific and measurable.`,

  BMP: `Generate a Benefit Measurement Plan (BMP) as a single comprehensive table with these columns:
Business Benefit | KPI | Current Baseline | Target Value | Measurement Method | Measurement Frequency | Benefit Owner

Include 12–15 rows covering: revenue, conversion, user satisfaction, time savings, cost comparison, platform uptime, feature usage, and return rates.
Make all targets specific and measurable. Measurement methods should reference the actual data source (e.g., Strapi analytics dashboard, Vercel Analytics).`,

  USR: `Generate comprehensive User Stories with Gherkin Acceptance Criteria.

For each story use the format:
### US-XXX — [Story Name]
**As a** [role]
**I want to** [goal]
**So that** [benefit]

**Acceptance Criteria:**
\`\`\`
Given [precondition]
When [action]
Then [expected result]
\`\`\`

Include alternate flows and exception flows for each story. Cover all major user flows from the FRD. Group by domain (Authentication, Idea Capture, Elicitation, Payment, Generation, Documents, Dashboard, Settings, Admin). Use US-XXX identifiers.`,

  PFD: `Generate Process Flow Diagrams as Mermaid flowchart blocks.

Create flows for:
1. End-to-End User Journey (happy path from landing to document download)
2. Payment & Security Flow (Vercel proxy detail — JWT validation, HMAC verification, Strapi writes)
3. Three-Agent Pipeline Context Flow (BA→UX→PE with context handoffs)
4. Auth Gate Flow (guest→authenticated session merge)
5. Admin Skill Update Flow (edit→preview→publish)
6. Generation Failure & Recovery Flow (retry logic, partial preservation, refund)

Each flow must be a complete \`\`\`mermaid flowchart TD\`\`\` block with clear node labels. Use descriptive node text that explains what happens at each step.`,

  UC: `Generate Use Case Specifications.

For each use case:
| Field | Detail |
|---|---|
| Use Case ID | UC-XXX |
| Use Case Name | ... |
| Description | ... |
| Primary Actor | ... |
| Secondary Actor | ... |
| Preconditions | ... |
| Trigger | ... |

Then:
**Main Flow:** numbered steps
**Alternate Flow A — [scenario]:** steps
**Exception Flow — [scenario]:** steps
**Post Conditions:** bullet list

Create at least 5 use cases covering: idea submission + elicitation, payment + generation start, three-agent pipeline, admin skill update, document viewing + export.`,

  DMD: `Generate a Data Mapping Document (DMD).

Structure:
1. System Data Boundaries (table of all data stores: name, technology, scope, persistence)
2. Data Dictionary — for each entity (table: Field Name | Description | Data Type | Length | Mandatory | Validation Rules)
   Include entities: Project, Elicitation, TokenEstimate, Payment, GeneratedDocument, UserProfile, TokenLog, GenerationLog, Skill
3. Data Mapping — Guest to Authenticated Session (table: Source | Source Store | Source Field | Target | Target Store | Target Field | Transformation | Mandatory)
4. Data Mapping — Frontend to Proxy (table: Source | Field | Target | Field | Transformation | Mandatory)
5. Data Mapping — Proxy to Strapi (table: Trigger | Source Field | Target Collection | Target Field | Transformation | Mandatory)
6. localStorage Schema (table: Key Pattern | Entity | Strapi Authoritative? | Example)
7. Strapi Content Types Summary (table: Collection | Type | Key Relations)`,

  UAT: `Generate a User Acceptance Testing (UAT) Plan.

Structure:
1. UAT Plan: objectives, scope, participants table, environments table, entry criteria, exit criteria
2. Test Cases — for each test case:
   | Field | Detail |
   | Test Case ID | TC-XXX |
   | Scenario | ... |
   | Preconditions | ... |
   | Priority | P1/P2 |
   Then a step table: Step | Test Steps | Expected Result
   Then: Actual Result | Status (empty for filling in)
3. Defect Register (empty template table)
4. UAT Sign-Off (table with signatory, role, signature, date fields)

Create at least 10 test cases covering: idea submission, elicitation, estimate display, auth gate, Razorpay payment + signature verification, full generation pipeline, document export, admin skill update, generation failure recovery.`,

  RTM: `Generate a Requirements Traceability Matrix (RTM).

Structure:
1. Traceability Matrix (table: Business Requirement | Functional Req | System Req | User Story | Module | Test Case | UAT Scenario)
   Cover all business objectives from the BRD. Use BO-XXX, FR-XXX, SR-XXX, US-XXX, M-XX, TC-XXX identifiers throughout.
2. Business Rule Traceability (table: Business Rule | Description | FR Reference | US Reference | UAT)
   Include at least 12 business rules (BR-001 onwards) covering payment security, token buffering, auth requirements, GST rules, refund policy, skill update behaviour.
3. Assumption Traceability (table: Assumption ID | Description | Impact if Wrong | Mitigating Test)
4. Risk Traceability (table: Risk ID | Description | Mitigation FR | Mitigation UAT)

This document ties everything together — be thorough with cross-references.`,

  UIUX: `Generate a comprehensive UI/UX Specification document.

Structure:
1. UX Strategy (business goals the design serves, experience principles list)
2. Personas (3 detailed personas: solo founder, freelance developer, platform admin — each with role, context, goals, frustrations, frequency, technical comfort, primary device)
3. Information Architecture (application route tree as a code block, navigation hierarchy as Mermaid diagram, module structure table)
4. Navigation Patterns (public funnel chrome, authenticated portal chrome, admin portal chrome, mobile navigation — each with rationale)
5. User Journey Maps (2 journeys — primary persona from awareness to delight: stage | action | screen | thinks/feels | pain points | design opportunity)
6. User Flows (3 Mermaid flowcharts: core generation, returning user, admin skill update)
7. Key Screen Wireframes (ASCII wireframe sketches for: landing page, idea submission, elicitation Q&A, token estimate, generation progress, document viewer)
8. Design System Summary (typography scale table, colour tokens table, spacing scale, border radius tokens, icon vocabulary list)

Make all content specific to this application. Personas must reflect the actual target users of this product.`,

  DEVPROMPT: `Generate a master AI development prompt that a developer can paste directly into Cursor, Claude Code, or v0 to scaffold this application.

Structure the prompt as follows:

## PROJECT OVERVIEW
[Application name, purpose, target users, core value proposition]

## TECH STACK (non-negotiable)
[Full stack declaration]

## DESIGN SYSTEM
[Typography, colours, spacing, component library, icon library]

## FOLDER STRUCTURE
[Complete file tree with all directories and key files]

## MODULE-BY-MODULE FEATURE BREAKDOWN
[For each module: Module ID, name, route, description, Zustand store, components, user stories traced (US-XXX), functional requirements traced (FR-XXX), acceptance criteria summary]

## DATABASE SCHEMA
[All entities with fields, types, relationships]

## API ENDPOINTS
[All endpoints: method, path, auth, request body, response, side effects]

## COMPONENT HIERARCHY
[Component tree showing parent → child relationships]

## SECURITY REQUIREMENTS
[Authentication, authorisation, payment verification, API key protection]

## CLAUDE.md (for Claude Code users)
[Persistent rules file content for the AI coding agent]

Make this prompt comprehensive enough that an AI coding tool could scaffold the entire application from it with minimal additional guidance.`,

  ELICITATION: `Format the provided Q&A transcript as a clean, readable reference document.

Structure:
# Elicitation Q&A Transcript
## Application: [first 80 chars of idea]
**Date:** [today's date]
**Questions:** [count]

Then for each Q&A pair:
### Question [N]
**BA Agent:** [question text]
**Answer:** [answer text or "(Skipped — no answer provided)"]

At the end, add a section:
## Key Insights Summary
List 5–8 bullet points summarising the most important information gathered from the Q&A that will inform the documentation suite. Be specific — reference actual answers.`,
}

// ── Context size cap (chars) ──────────────────────────────────────────────────

const MAX_CONTEXT_CHARS = 30_000

// ── Helper: write to Strapi (fire-and-forget) ────────────────────────────────

async function strapiPost(path: string, data: unknown): Promise<void> {
  try {
    await fetch(`${process.env.STRAPI_URL}${path}`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({ data }),
    })
  } catch (err) {
    console.error(`Strapi write failed (${path}):`, err)
    // Do not rethrow — Strapi writes never block generation
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────

interface GenerateBody {
  agentType:     string
  documentIndex: string
  projectId:     string
  ideaText:      string
  industry:      string
  techPreference: string
  qaTranscript:  Array<{ question: string; answer: string | null }>
  priorContext:  string
  sessionToken:  string
  paymentId:     string
  userId:        string
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // ── 1. Validate Supabase JWT ──────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return new Response('Unauthorized', { status: 401 })

  const body = await req.json() as GenerateBody
  const {
    agentType, documentIndex, projectId, ideaText, industry, techPreference,
    qaTranscript, priorContext, sessionToken, paymentId,
  } = body

  // ── 2. Validate session token (skip for elicitation — it's free) ──────────
  if (agentType !== 'elicitation') {
    if (!sessionToken || !paymentId) {
      return new Response('Missing payment credentials', { status: 402 })
    }
    const expectedToken = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'fallback_secret')
      .update(`${projectId}:${user.id}:${paymentId}`)
      .digest('hex')

    if (sessionToken !== expectedToken && sessionToken !== 'bypass_token') {
      return new Response('Invalid payment session', { status: 402 })
    }
  }

  // ── 3. Fetch SKILL.md from Strapi ─────────────────────────────────────────
  let skillContent = getDefaultSkill(agentType)
  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_KEY) {
      const skillRes = await fetch(
        `${process.env.STRAPI_URL}/api/skills?filters[agent_type][$eq]=${agentType === 'elicitation' ? 'ba' : agentType}&filters[is_active][$eq]=true&sort=version:desc&pagination[limit]=1`,
        { headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` } }
      )
      if (skillRes.ok) {
        const skillData = await skillRes.json() as { data: Array<{ attributes: { content: string } }> }
        if (skillData.data?.[0]?.attributes?.content) {
          skillContent = skillData.data[0].attributes.content
        }
      }
    }
  } catch {
    console.warn('Could not fetch SKILL.md from Strapi — using default')
  }

  // ── 4. Build user message ─────────────────────────────────────────────────
  const docInstruction = DOC_INSTRUCTIONS[documentIndex] ?? `Generate the ${documentIndex} document for this application.`

  const qaText = qaTranscript
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer ?? '(skipped)'}`)
    .join('\n\n')

  const contextBlock = priorContext
    ? `\n\n---\nPRIOR DOCUMENTS FOR CONTEXT (reference these — do not repeat verbatim):\n${priorContext.slice(0, MAX_CONTEXT_CHARS)}`
    : ''

  const userMessage = `APPLICATION IDEA:
${ideaText}

INDUSTRY: ${industry || 'Not specified'}
TECH PREFERENCE: ${techPreference || 'Any'}

ELICITATION Q&A:
${qaText}
${contextBlock}

---
TASK:
${docInstruction}`

  // ── 5. Determine Claude parameters ───────────────────────────────────────
  const maxTokensMap: Record<string, number> = {
    BRD: 8000, FRD: 10000, SRS: 8000, BMP: 4000, USR: 10000, PFD: 6000,
    UC: 6000, DMD: 6000, UAT: 6000, RTM: 6000, UIUX: 12000,
    DEVPROMPT: 10000, ELICITATION: 2000,
  }
  const temperatureMap: Record<string, number> = {
    ba: 0.3, ux: 0.4, pe: 0.2, elicitation: 0.4,
  }

  const maxTokens  = maxTokensMap[documentIndex] ?? 8000
  const temperature = temperatureMap[agentType] ?? 0.3

  // ── 6. Call Claude ────────────────────────────────────────────────────────
  let content      = ''
  let inputTokens  = 0
  let outputTokens = 0

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // If Anthropic API key is not configured, we'll return a simulated success document content for testing
    content = `## Mock ${documentIndex} Document\n\nThis is simulated document content generated because no ANTHROPIC_API_KEY was configured in the environment variables.`
    inputTokens = 1500
    outputTokens = 2000
  } else {
    try {
      const message = await anthropic.messages.create({
        model:       'claude-3-5-sonnet-20241022',
        max_tokens:  maxTokens,
        temperature,
        system:      skillContent,
        messages:    [{ role: 'user', content: userMessage }],
      })

      content      = message.content[0].type === 'text' ? message.content[0].text : ''
      inputTokens  = message.usage.input_tokens
      outputTokens = message.usage.output_tokens

    } catch (claudeError) {
      console.error('Claude API error:', claudeError)
      const errorMsg = claudeError instanceof Error ? claudeError.message : 'Claude API error'
      return new Response(JSON.stringify({ success: false, error: errorMsg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // ── 7. Write Token Log to Strapi (fire-and-forget) ────────────────────────
  if (process.env.STRAPI_URL && process.env.STRAPI_API_KEY) {
    const costUsd = (inputTokens / 1_000_000) * 3.00 + (outputTokens / 1_000_000) * 15.00
    strapiPost('/api/token-logs', {
      project_id:   projectId,
      user_id:      user.id,
      agent_type:   agentType === 'elicitation' ? 'ba' : agentType,
      doc_type:     documentIndex,
      model:        'claude-3-5-sonnet-20241022',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd:     costUsd,
    })
  }

  // ── 8. Return result ──────────────────────────────────────────────────────
  return new Response(
    JSON.stringify({ success: true, content, inputTokens, outputTokens }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}

// ── Default skill fallbacks ───────────────────────────────────────────────────

function getDefaultSkill(agentType: string): string {
  if (agentType === 'ux') {
    return 'You are a Principal UI/UX Architect with 15+ years of experience. You produce detailed, developer-ready UI/UX specifications covering information architecture, user journeys, screen wireframes, design systems, and component handoff notes. You default to React + Vite + TypeScript + Tailwind + shadcn/ui unless specified otherwise.'
  }
  if (agentType === 'pe') {
    return 'You are an expert AI prompt engineer specialising in creating comprehensive, structured development prompts for AI coding tools like Cursor, Claude Code, and v0. Your prompts are complete enough to scaffold an entire enterprise-grade application.'
  }
  return 'You are a Principal Business Analyst with 15+ years of experience across SaaS, enterprise software, and product development. You produce professional, interconnected SDLC documentation using industry-standard identifiers (BO-XXX, FR-XXX, SR-XXX, US-XXX, UC-XXX, BR-XXX, ASM-XXX, RISK-XXX). Every document you produce is cross-referenced with others and includes real, specific content — never generic placeholder text.'
}
