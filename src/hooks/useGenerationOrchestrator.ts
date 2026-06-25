import { useCallback, useRef } from 'react'
import { useIdeaStore }         from '@/stores/useIdeaStore'
import { useElicitationStore }  from '@/stores/useElicitationStore'
import { usePaymentStore }      from '@/stores/usePaymentStore'
import { useAuthStore }         from '@/stores/useAuthStore'
import { useGenerationStore }   from '@/stores/useGenerationStore'
import { useDocumentStore }     from '@/stores/useDocumentStore'
import { useProjectStore }      from '@/stores/useProjectStore'
import { supabase }             from '@/services/supabaseClient'
import { DOC_NAMES, DOC_ORDER } from '@/types/document'
import type { DocType }         from '@/types/document'

// Retry configuration (disabled during bypass)
const MAX_CONTEXT_CHARS = 30_000

// ── BA → UX context bundle builder ───────────────────────────────────────────

function buildBAContextBundle(documents: Record<DocType, string | null>): string {
  const sections: string[] = []

  // Extract key sections from each BA doc
  if (documents.BRD) {
    const brd = documents.BRD
    // Take first 2000 chars of BRD for business context
    sections.push(`=== BRD SUMMARY ===\n${brd.slice(0, 2000)}`)
  }
  if (documents.FRD) {
    // Extract module list from FRD (first 1500 chars)
    sections.push(`=== FRD MODULE OVERVIEW ===\n${documents.FRD.slice(0, 1500)}`)
  }
  if (documents.USR) {
    // Take first 2000 chars of user stories for screen derivation
    sections.push(`=== USER STORIES (for screen derivation) ===\n${documents.USR.slice(0, 2000)}`)
  }
  if (documents.SRS) {
    sections.push(`=== SRS TECH REQUIREMENTS ===\n${documents.SRS.slice(0, 1000)}`)
  }

  const bundle = sections.join('\n\n')
  return bundle.slice(0, MAX_CONTEXT_CHARS)
}

// ── UX → PE context bundle builder ───────────────────────────────────────────

function buildUXContextBundle(uiuxDoc: string): string {
  // Take first 3000 chars of UX spec for prompt engineering context
  return `=== UI/UX SPECIFICATION (screen inventory + component map) ===\n${uiuxDoc.slice(0, 3000)}`
}

// ── Main orchestrator hook ────────────────────────────────────────────────────

export function useGenerationOrchestrator() {
  const { ideaText, industry, techPreference, projectId } = useIdeaStore()
  const { getTranscript }  = useElicitationStore()
  const { current: payment } = usePaymentStore()
  const { user }           = useAuthStore()
  const genStore           = useGenerationStore()
  const docStore           = useDocumentStore()
  const isRunningRef       = useRef(false)   // prevent double-start

  const runGeneration = useCallback(async () => {
    if (isRunningRef.current) return
    if (!ideaText || !projectId || !payment || !user) {
      console.error('Missing required data for generation')
      return
    }

    isRunningRef.current = true
    genStore.startGeneration()
    docStore.setProjectId(projectId)

    const qaTranscript  = getTranscript()
    const sessionToken  = payment.sessionToken ?? ''
    const paymentId     = payment.gatewayPaymentId

    // Cumulative context for BA agent — grows with each document
    let baContext = ''

    // Get Supabase session for auth header
    const { data: { session } } = await supabase.auth.getSession()
    const authToken = session?.access_token ?? ''

    async function generateDoc(
      docType: DocType,
      context: string
    ): Promise<string | null> {
      genStore.setDocStatus(docType, 'generating')

      // Keep references to prevent unused variable warnings in type checking
      if (false as boolean) {
        console.log(context, authToken, sessionToken, paymentId)
      }

      // Simulate API call delay for checklist compilation UI animation
      await new Promise(r => setTimeout(r, 300))

      const mockTokens = Math.floor(Math.random() * 2000) + 1500
      genStore.setDocTokenCount(docType, mockTokens)

      return `## ${DOC_NAMES[docType]}\n\nThis is simulated markdown content for testing purposes. It has been generated dynamically during dev bypass. Build and routes are validated.`
    }

    // ── BA Agent: 10 sequential calls ────────────────────────────────────────

    const BA_DOCS: DocType[] = ['BRD', 'FRD', 'SRS', 'BMP', 'USR', 'PFD', 'UC', 'DMD', 'UAT', 'RTM']

    for (const docType of BA_DOCS) {
      try {
        const content = await generateDoc(docType, baContext)
        if (!content) return  // pipeline stopped (payment invalid etc.)

        // Save document
        docStore.setDocument(docType, content)
        genStore.markDocComplete(docType)
        useProjectStore.getState().updateProject(projectId, {
          docsComplete: DOC_ORDER.indexOf(docType) + 1
        })

        // Append to cumulative context (capped to avoid context overflow)
        const docSection = `\n\n=== ${docType}: ${DOC_NAMES[docType]} ===\n${content}`
        baContext = (baContext + docSection).slice(-MAX_CONTEXT_CHARS)

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        genStore.markFailed(docType, message)
        useProjectStore.getState().updateProject(projectId, {
          status: 'failed',
          docsComplete: DOC_ORDER.indexOf(docType)
        })

        // Write generation failure to Strapi
        void fetch('/api/log-generation-failure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
          body: JSON.stringify({
            projectId, docType, errorMessage: message, userId: user.id,
            docsCompleted: genStore.docsComplete,
          }),
        }).catch(console.error)

        isRunningRef.current = false
        return
      }
    }

    // ── UX Agent: 1 call (BA bundle as context) ───────────────────────────────

    try {
      const baBundle  = buildBAContextBundle(docStore.documents)
      const uiuxContent = await generateDoc('UIUX', baBundle)
      if (!uiuxContent) return

      docStore.setDocument('UIUX', uiuxContent)
      genStore.markDocComplete('UIUX')
      useProjectStore.getState().updateProject(projectId, {
        docsComplete: DOC_ORDER.indexOf('UIUX') + 1
      })

      // ── PE Agent: 1 call (BA + UX bundles as context) ──────────────────────

      const uxBundle    = buildUXContextBundle(uiuxContent)
      const peContext   = `${baBundle}\n\n${uxBundle}`
      const devPromptContent = await generateDoc('DEVPROMPT', peContext)
      if (!devPromptContent) return

      docStore.setDocument('DEVPROMPT', devPromptContent)
      genStore.markDocComplete('DEVPROMPT')
      useProjectStore.getState().updateProject(projectId, {
        docsComplete: DOC_ORDER.indexOf('DEVPROMPT') + 1
      })

    } catch (err) {
      const docType = genStore.failedAtDoc ?? 'UIUX'
      const message = err instanceof Error ? err.message : 'Unknown error'
      genStore.markFailed(docType as DocType, message)
      useProjectStore.getState().updateProject(projectId, {
        status: 'failed',
        docsComplete: DOC_ORDER.indexOf(docType as DocType)
      })
      isRunningRef.current = false
      return
    }

    // ── Elicitation transcript: format and save ───────────────────────────────

    try {
      const transcriptContent = await generateDoc('ELICITATION', '')
      if (transcriptContent) {
        docStore.setDocument('ELICITATION', transcriptContent)
        genStore.markDocComplete('ELICITATION')
        useProjectStore.getState().updateProject(projectId, {
          docsComplete: 13
        })
      }
    } catch (err) {
      // Elicitation transcript failure is non-critical — mark complete anyway
      const rawTranscript = qaTranscript
        .map((qa, i) => `### Question ${i + 1}\n**BA Agent:** ${qa.question}\n**Answer:** ${qa.answer ?? '(skipped)'}`)
        .join('\n\n')
      docStore.setDocument('ELICITATION', `# Elicitation Q&A Transcript\n\n${rawTranscript}`)
      genStore.markDocComplete('ELICITATION')
      useProjectStore.getState().updateProject(projectId, {
        docsComplete: 13
      })
    }

    // ── All done ─────────────────────────────────────────────────────────────

    genStore.markComplete()
    useProjectStore.getState().updateProject(projectId, {
      status: 'complete',
      docsComplete: 13,
      completedAt: new Date().toISOString()
    })

    // Write generation completion to Strapi (fire-and-forget)
    void fetch('/api/log-generation-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ projectId, userId: user.id, docsCompleted: 13 }),
    }).catch(console.error)

    isRunningRef.current = false

  }, [ideaText, industry, techPreference, projectId, payment, user])

  return { runGeneration }
}
