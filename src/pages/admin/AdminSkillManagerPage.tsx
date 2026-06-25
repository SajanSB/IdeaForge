import { useState, useEffect } from 'react'
import { toast }  from 'sonner'
import { IconLoader2, IconSparkles, IconCheck, IconAlertTriangle } from '@tabler/icons-react'
import { Button }       from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { adminService, type StrapiSkill } from '@/services/adminService'
import { VersionBadge }      from '@/components/admin/VersionBadge'
import { SkillEditor }       from '@/components/admin/SkillEditor'
import { SkillPreviewPanel } from '@/components/admin/SkillPreviewPanel'
import { supabase }          from '@/services/supabaseClient'
import { useRequireAdmin }   from '@/hooks/useAuth'

type AgentType = 'ba' | 'ux' | 'pe'

const AGENT_LABELS: Record<AgentType, string> = {
  ba: 'BA Agent',
  ux: 'UX Agent',
  pe: 'Prompt Engineer',
}

const TEST_IDEA = 'A task management SaaS for freelancers with client portal, invoice generation, time tracking, and Razorpay payment collection — targeting Indian freelancers earning ₹5–50L annually.'

export function AdminSkillManagerPage() {
  useRequireAdmin()

  const [activeAgent, setActiveAgent]       = useState<AgentType>('ba')
  const [currentSkill, setCurrentSkill]     = useState<StrapiSkill | null>(null)
  const [editorContent, setEditorContent]   = useState('')
  const [savedContent, setSavedContent]     = useState('')
  const [isLoading, setIsLoading]           = useState(true)
  const [isPreviewing, setIsPreviewing]     = useState(false)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [previewError, setPreviewError]     = useState<string | null>(null)
  const [isPublishing, setIsPublishing]     = useState(false)
  const [publishDialog, setPublishDialog]   = useState(false)
  const [switchWarning, setSwitchWarning]   = useState<AgentType | null>(null)

  useEffect(() => {
    document.title = 'Skill manager — IdeaForge Admin'
  }, [])

  useEffect(() => {
    loadSkill(activeAgent)
  }, [activeAgent])

  async function loadSkill(agent: AgentType) {
    setIsLoading(true)
    setPreviewContent(null)
    setPreviewError(null)
    try {
      const res = await adminService.getActiveSkill(agent)
      const skill = res.data?.[0]?.attributes ?? null
      setCurrentSkill(skill)
      const content = skill?.content ?? ''
      setEditorContent(content)
      setSavedContent(content)
    } catch {
      toast.error('Could not load skill content')
    } finally {
      setIsLoading(false)
    }
  }

  const isDirty = editorContent !== savedContent

  // Check if switching tabs when dirty
  function handleTabChange(agent: AgentType) {
    if (isDirty && agent !== activeAgent) {
      setSwitchWarning(agent)
    } else {
      setActiveAgent(agent)
    }
  }

  function confirmTabSwitch() {
    if (switchWarning) {
      setActiveAgent(switchWarning)
      setSwitchWarning(null)
    }
  }

  // Validate skill before publish
  function validateSkill(): string | null {
    if (!editorContent.trim()) return 'Skill content cannot be empty.'
    if (editorContent.length > 50_000) return `Skill content exceeds 50,000 characters (${editorContent.length.toLocaleString()} chars).`
    return null
  }

  // Preview — test generation with currently active prompt and sample idea
  async function handleTestGeneration() {
    setIsPreviewing(true)
    setPreviewContent(null)
    setPreviewError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          agentType:     activeAgent === 'ba' ? 'ba' : activeAgent,
          documentIndex: activeAgent === 'ba' ? 'BRD' : activeAgent === 'ux' ? 'UIUX' : 'DEV',
          projectId:     'preview-project',
          ideaText:      TEST_IDEA,
          qaTranscript:  [],
          priorContext:  '',
          paymentId:     'preview-pay',
          sessionToken:  'bypass_token',
        })
      })

      if (!res.ok) {
        throw new Error(`Generation failed: ${await res.text()}`)
      }

      const result = await res.json() as { content: string }
      setPreviewContent(result.content)
      toast.success('Test generation complete!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      setPreviewError(msg)
      toast.error('Test generation failed')
    } finally {
      setIsPreviewing(false)
    }
  }

  // Publish to Strapi using serverless function proxy
  async function handlePublish() {
    const validationErr = validateSkill()
    if (validationErr) { toast.error(validationErr); return }

    setIsPublishing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/admin/skill', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          agentType:    activeAgent,
          skillContent: editorContent.trim(),
        })
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      const result = await res.json() as { success: boolean; version: number }
      toast.success(`Published version ${result.version} successfully!`)
      setSavedContent(editorContent)
      setPublishDialog(false)
      // Reload skill to refresh metadata
      loadSkill(activeAgent)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Publish failed'
      toast.error(`Publish failed: ${msg}`)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="p-8 font-sans flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[0.5px] border-border">
        <div>
          <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans">
            Skill Manager
          </h1>
          <p className="text-[12px] text-[#6B7280] font-sans mt-0.5">
            Modify agent instructions and prompt templates dynamically.
          </p>
        </div>
        {currentSkill && (
          <VersionBadge
            version={currentSkill.version}
            publishedAt={currentSkill.published_at}
            publishedBy={currentSkill.published_by}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F7F5F0] border border-[0.5px] border-border p-1 rounded-lg text-xs font-semibold select-none max-w-md">
        {(['ba', 'ux', 'pe'] as AgentType[]).map(agent => (
          <button
            key={agent}
            onClick={() => handleTabChange(agent)}
            className={`flex-1 py-1.5 px-3 rounded-md cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
              activeAgent === agent ? 'bg-white text-[#0F0F0F] font-medium' : 'text-[#6B7280] hover:text-[#0F0F0F]'
            }`}
          >
            <span>{AGENT_LABELS[agent]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <IconLoader2 className="animate-spin text-[#BA7517]" size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[450px]">
          {/* Editor Column */}
          <div className="flex flex-col h-full">
            <SkillEditor
              value={editorContent}
              onChange={setEditorContent}
              disabled={isPublishing}
            />
          </div>

          {/* Preview/Action Column */}
          <div className="flex flex-col h-full space-y-4">
            <div className="flex-1">
              <SkillPreviewPanel content={editorContent} />
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between p-4 bg-[#F7F5F0] border border-[0.5px] border-border rounded-xl">
              <Button
                variant="outline"
                onClick={handleTestGeneration}
                disabled={isPreviewing}
                className="h-10 text-[13px] border-[#BA7517] text-[#BA7517] hover:bg-[#FAEEDA]/30"
              >
                {isPreviewing ? (
                  <>
                    <IconLoader2 className="animate-spin mr-1.5" size={16} /> Generating...
                  </>
                ) : (
                  <>
                    <IconSparkles className="mr-1.5" size={16} /> Test active prompt
                  </>
                )}
              </Button>

              <Button
                onClick={() => setPublishDialog(true)}
                disabled={!isDirty || isPublishing}
                className="h-10 text-[13px] bg-[#BA7517] hover:bg-[#A06010] text-[#FFF8ED]"
              >
                Publish prompt
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Tab Warning Dialog */}
      <Dialog open={!!switchWarning} onOpenChange={() => setSwitchWarning(null)}>
        <DialogContent className="max-w-md font-sans">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-[#FAEEDA] flex items-center justify-center mb-3">
              <IconAlertTriangle className="text-[#BA7517]" size={20} />
            </div>
            <DialogTitle>Unsaved Prompt Changes</DialogTitle>
            <DialogDescription>
              You have unsaved adjustments in your prompt editor. Switching tabs will discard all unsaved edits.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setSwitchWarning(null)} className="h-9 text-[12px]">
              Cancel
            </Button>
            <Button
              onClick={confirmTabSwitch}
              className="h-9 text-[12px] bg-red-600 hover:bg-red-700 text-white"
            >
              Discard and switch
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog open={publishDialog} onOpenChange={setPublishDialog}>
        <DialogContent className="max-w-md font-sans">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-[#FAEEDA] flex items-center justify-center mb-3">
              <IconCheck className="text-[#BA7517]" size={20} />
            </div>
            <DialogTitle>Publish Skill Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish these changes? This prompt will take effect immediately for all subsequent customer generation runs.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setPublishDialog(false)} className="h-9 text-[12px]">
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="h-9 text-[12px] bg-[#BA7517] hover:bg-[#A06010] text-[#FFF8ED]"
            >
              {isPublishing ? 'Publishing...' : 'Yes, publish skill'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Generation Preview Dialog */}
      <Dialog open={!!previewContent || !!previewError} onOpenChange={() => { setPreviewContent(null); setPreviewError(null) }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle>Test Generation Results</DialogTitle>
            <DialogDescription>
              Generated using the sample idea: <span className="italic">"{TEST_IDEA}"</span> under the active agent prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 border border-[0.5px] border-border bg-[#F7F5F0] rounded-xl overflow-x-auto">
            {previewError ? (
              <p className="text-[13px] text-red-600 font-mono">{previewError}</p>
            ) : (
              <pre className="text-[12px] font-mono whitespace-pre-wrap text-[#0F0F0F]">{previewContent}</pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
