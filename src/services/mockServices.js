// Client-side simulator for IdeaForge core services

export const MOCK_QUESTIONS = [
  "Who are the primary target users of this application, and what are their technical proficiency levels?",
  "What is the core value proposition and the main user pain point this application solves?",
  "What are the absolute must-have features required for the Minimum Viable Product (MVP)?",
  "Will the system require integration with any third-party APIs (e.g. Stripe, SendGrid, Twilio, maps)?",
  "Are there specific compliance or security requirements (e.g. GDPR, HIPAA, PCI-DSS, local regulations)?",
  "Should the application have offline capability or focus-only on desktop real-time sync?",
  "What are the expected growth plans (e.g., will this start as a web-only MVP and expand to mobile later)?"
];

export const MOCK_DOCS_DATA = {
  BRD: `# Business Requirements Document (BRD)
## Document ID: BRD-001 v1.0
## Prepared for SajanSB/IdeaForge

### 1. Project Background
The platform, **IdeaForge**, seeks to eliminate discovery friction by automating SDLC documentation. This document establishes the business requirements for the MVP. Refer to **BR-001** for client-onboarding scope.

### 2. Objectives
- **BR-002**: Reduce client discovery cycles from 2 weeks to under 15 minutes.
- **BR-003**: Provide invoices and consulting-grade documents matching consulting firm standards.
- **BR-004**: Achieve a funnel conversion rate of at least 30% from token estimate to payment.

### 3. Business Scope
- **BR-005**: Support guest user checkout where elicitation flows run prior to auth gate.
- **BR-006**: Support INR payments via Razorpay (refer to **FR-042**) and USD payments via Stripe.
- **BR-007**: Admin console (refer to **US-099**) to manage pricing parameters and agent skill prompts.`,

  FRD: `# Functional Requirements Document (FRD)
## Document ID: FRD-042 v1.0
## Traces To: BRD-001

### 1. Functional Specification
The functional specifications detail the system behavior across auth, payments, and document rendering layers.

### 2. User Authentication & Session Merge
- **FR-001**: Guests must be able to input raw ideas and answer BA elicitation questions without an active session.
- **FR-002**: Upon clicking "Pay", the system must show the Auth Gate Modal.
- **FR-003**: After sign-up, the guest session must merge sessionStorage data into the newly created account.

### 3. Payment Gateway Integration
- **FR-004**: In India, the payment interface must display UPI as the default checkout option.
- **FR-005**: Webhooks must verify signature hashes before updating the document generation status.

### 4. Interactive Document Viewer
- **FR-006**: The viewer must render Markdown content dynamically.
- **FR-007**: Highlight any trace indicators matching regular expression \`[A-Z]{2,4}-\\d{3}\` (e.g. **FR-007**, **BR-002**) in amber mono.`,

  SRS: `# System Requirements Specification (SRS)
## Document ID: SRS-089 v1.0

### 1. System Architecture
Vite React SPA running on Vercel Edge Serverless functions.

### 2. Database Schema
- **SR-001**: Projects must persist in a relational Postgres db via Strapi CMS.
- **SR-002**: Documents are stored in localStorage for guest sessions and backed up to Strapi on user checkout.

### 3. Non-Functional Requirements
- **SR-003**: Average page load time must stay below 1.5 seconds.
- **SR-004**: API timeouts must be handled gracefully with a retry prompt after 3 failed connections (refer to **FR-006**).`,

  BMP: `# Benefit Measurement Plan (BMP)
## Document ID: BMP-004 v1.0

### 1. Value Realization Metrics
This document details how value will be measured post-deployment.

### 2. KPI Checklist
- **BM-001**: Elicitation questionnaire completion rate (Target: > 75%).
- **BM-002**: Average cost per generation for Claude API tokens (Target: < ₹90.00).
- **BM-003**: Returning user scoping frequency (Target: 1.5 generations/month).`,

  USR: `# User Stories
## Document ID: USR-011 v1.0

### 1. User Journeys
The following user stories express user requirements for founders, developers, and platform admins.

### 2. Epics
- **US-001 (Founder)**: As a non-technical founder, I want to receive clean PDF/Markdown SDLC documents so I can hand them to my freelance developer without confusion.
- **US-002 (Developer)**: As a freelance developer, I want a structured AI Dev Prompt so I can immediately paste it into Cursor/VSCode and start scaffolding.
- **US-003 (Admin)**: As a platform administrator, I want to edit SKILL.md rules in an online editor so I don't have to push code changes. Refer to **FR-007** for viewer.`,

  PFD: `# Process Flow Diagrams (PFD)
## Document ID: PFD-012 v1.0

### 1. Flow Diagrams
- **PF-001**: Funnel Flow: Landing -> Idea -> Q&A -> Cost -> Auth Gate -> Payment Gateway.
- **PF-002**: Session Merge Flow: Local guest state merged with Strapi DB on login success.
- **PF-003**: Skill Version Flow: Admin edit -> validation check -> version increment -> active on next run.`,

  UC: `# Use Cases (UC)
## Document ID: UC-055 v1.0

### 1. Use Case Definitions
- **UC-101**: Submit raw startup idea.
- **UC-102**: Complete Razorpay payment (UPI default).
- **UC-103**: Copy individual Markdown document.
- **UC-104**: Export all 13 documents as ZIP (using JSZip).`,

  DMD: `# Data Mapping Document (DMD)
## Document ID: DMD-033 v1.0

### 1. Data Schemas
Field-level schema map for Project, Payment, and Documents database tables.
- **DM-001**: \`project_id\` is UUID v4.
- **DM-002**: \`status\` enum: \`draft\`, \`paid\`, \`generating\`, \`complete\`, \`failed\`.`,

  UAT: `# User Acceptance Testing (UAT)
## Document ID: UAT-077 v1.0

### 1. Acceptance Criteria Checklist
- **UA-001**: Verify that character counter alerts user when nearing the 2000 character limit.
- **UA-002**: Focus outline offset is 2px to satisfy WCAG AA contrast rules.
- **UA-003**: PDF and MD formats copy correctly with copy-button state feedback.`,

  RTM: `# Requirements Traceability Matrix (RTM)
## Document ID: RTM-099 v1.0

### 1. Requirements Trace Map
Traces implementation files to Business Goals:
- **RT-001**: Traces **BR-001** -> **FR-001** (Landing Guest submission).
- **RT-002**: Traces **BR-006** -> **FR-004** (Razorpay payment config).
- **RT-003**: Traces **BR-007** -> **US-003** (Admin Skill Manager).`,

  UIUX: `# UI/UX Design Specification
## Document ID: UIUX-010 v1.0

### 1. Styling Foundations
- **UX-001**: Font Inter loaded for UI and IBM Plex Mono loaded for document numbers and stats.
- **UX-002**: Accent color Amber '#BA7517' used for CTAs and focus outlines.
- **UX-003**: Zero shadows; depth is conveyed via 0.5px border weights and contrast backdrops.`,

  DEVPROMPT: `# AI Developer Prompt (DEV PROMPT)
## Document ID: DEV-100 v1.0

### 1. AI Assistant System Prompt
You are a senior full-stack software engineer. Scaffold the project using React 18, Vite, and Tailwind CSS.
Use the following BRD specification to build the page components:
- **DEV-001**: Integrate auth validation using Supabase.
- **DEV-002**: Configure Razorpay API checks.`,

  ELICITATION: `# Elicitation Q&A Transcript
## Document ID: ELC-001 v1.0

### 1. System Transcript
Original idea submission and responses collected during the Guest Elicitation process.
- **Q1**: Target audience: First-time SaaS founders.
- **Q2**: Tech stack: React edge, Strapi CMS, Supabase.
- **Q3**: Integrations: Stripe, Razorpay.`,
};

// Simulation delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockPaymentCheckout = async (gateway, amount) => {
  await delay(1200);
  return {
    success: true,
    transactionId: `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
  };
};

export const simulateDocStreaming = async (onProgress) => {
  const docKeys = Object.keys(MOCK_DOCS_DATA);
  const total = docKeys.length;
  
  const docStatuses = docKeys.reduce((acc, key) => {
    acc[key] = 'pending';
    return acc;
  }, {});

  onProgress({
    status: 'running',
    currentAgent: 'ba',
    docsComplete: 0,
    docStatuses,
    activeTokenCount: 0,
    estimatedMinutesRemaining: 12
  });

  await delay(1000);

  for (let i = 0; i < total; i++) {
    const key = docKeys[i];
    
    // Assign agents
    let agent = 'ba';
    if (key === 'UIUX') agent = 'ux';
    if (key === 'DEVPROMPT') agent = 'pe';

    docStatuses[key] = 'generating';
    onProgress({
      status: 'running',
      currentAgent: agent,
      docsComplete: i,
      docStatuses,
      activeTokenCount: 0,
      estimatedMinutesRemaining: Math.ceil((total - i) * 0.8)
    });

    // Stream tokens simulation
    for (let t = 0; t <= 3; t++) {
      await delay(200);
      onProgress({
        status: 'running',
        currentAgent: agent,
        docsComplete: i,
        docStatuses,
        activeTokenCount: (t + 1) * 800 + Math.floor(Math.random() * 200),
        estimatedMinutesRemaining: Math.ceil((total - i) * 0.8)
      });
    }

    docStatuses[key] = 'complete';
    onProgress({
      status: 'running',
      currentAgent: agent,
      docsComplete: i + 1,
      docStatuses,
      activeTokenCount: 0,
      estimatedMinutesRemaining: Math.ceil((total - (i + 1)) * 0.8)
    });

    await delay(300);
  }

  onProgress({
    status: 'complete',
    currentAgent: null,
    docsComplete: total,
    docStatuses,
    activeTokenCount: 0,
    estimatedMinutesRemaining: 0
  });
};
