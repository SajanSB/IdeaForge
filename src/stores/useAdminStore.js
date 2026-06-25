import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_SKILLS = {
  ba: `# Business Analyst Agent Skill Configuration
## Version: v7
## Last Updated: 2026-06-20

### 1. Elicitation Directives
- Identify primary client actors and user goals.
- Ask details on payment integrations and currency scopes.
- Map business goals to BR-XXX references.

### 2. Output Formatting
- Generate BRD, FRD, SRS, BMP, USR, PFD, UC, DMD, UAT, and RTM documents.
- Anchor all functional specs to FR-XXX monospaced identifiers.`,

  ux: `# UX Architect Agent Skill Configuration
## Version: v3
## Last Updated: 2026-06-19

### 1. Interface Guidelines
- Apply Inter UI typeface and IBM Plex Mono formatting.
- Ensure all interactive nodes support coarse pointers.
- Implement outline spacing filters.

### 2. High-Contrast Rules
- Pair focus visible highlights with outline-offsets.
- Preserve 4.5:1 text-to-backdrop contrast parameters.`,

  pe: `# Prompt Engineer Agent Skill Configuration
## Version: v5
## Last Updated: 2026-06-18

### 1. Developer Prompt Scaffolding
- Generate structural prompts ready to paste in cursor.
- Breakdown requirements into clean modules.
- Include Supabase DB and Razorpay/Stripe integrations.`
};

export const useAdminStore = create(
  persist(
    (set, get) => ({
      skills: DEFAULT_SKILLS,
      skillVersions: { ba: 7, ux: 3, pe: 5 },
      skillDates: { ba: '2026-06-20', ux: '2026-06-19', pe: '2026-06-18' },
      
      updateSkill: (agent, content) => {
        const currentSkills = { ...get().skills };
        const currentVersions = { ...get().skillVersions };
        const currentDates = { ...get().skillDates };
        
        currentSkills[agent] = content;
        currentVersions[agent] += 1;
        currentDates[agent] = new Date().toISOString().split('T')[0];
        
        set({
          skills: currentSkills,
          skillVersions: currentVersions,
          skillDates: currentDates
        });
      },
      
      pricingMargin: 100, // %
      pricingBuffer: 1.4, // multiplier
      updatePricing: (margin, buffer) => set({ pricingMargin: margin, pricingBuffer: buffer })
    }),
    { name: 'ideaforge_v1_admin' }
  )
);
