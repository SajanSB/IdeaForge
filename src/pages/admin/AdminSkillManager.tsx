import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import ReactMarkdown from 'react-markdown'
// @ts-ignore
import remarkGfm from 'remark-gfm'
import { Bold, Italic, Code, Heading, Minus, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Agent = 'ba' | 'ux' | 'pe'

const AGENT_LABELS: Record<Agent, string> = {
  ba: 'BA Agent',
  ux: 'UX Agent',
  pe: 'Prompt Engineer',
}

export function AdminSkillManager() {
  const [activeAgent, setActiveAgent] = useState<Agent>('ba')
  const [skills, setSkills]           = useState<Record<Agent, string>>({ ba: '', ux: '', pe: '' })
  const [versions, setVersions]       = useState<Record<Agent, number>>({ ba: 1, ux: 1, pe: 1 })
  const [updatedAt, setUpdatedAt]     = useState<Record<Agent, string>>({ ba: '', ux: '', pe: '' })
  const [loading, setLoading]         = useState(true)
  const [isDirty, setIsDirty]         = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewContent, setPreviewContent] = useState<string | null>(null)

  const { toast } = useToast()

  // Load all skills on mount
  useEffect(() => {
    supabase
      .from('agent_skills')
      .select('agent, content, version, updated_at')
      .then(({ data, error }) => {
        if (error) {
          toast({ title: 'Failed to load skills', description: error.message, variant: 'destructive' })
        } else if (data) {
          const s = { ...skills }
          const v = { ...versions }
          const u = { ...updatedAt }
          data.forEach((row) => {
            const a = row.agent as Agent
            s[a] = row.content
            v[a] = row.version
            u[a] = row.updated_at
          })
          setSkills(s)
          setVersions(v)
          setUpdatedAt(u)
        }
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const content = skills[activeAgent] ?? ''

  const handleTabChange = (val: string) => {
    if (isDirty && !window.confirm('You have unsaved changes. Discard?')) return
    setActiveAgent(val as Agent)
    setIsDirty(false)
    setPreviewContent(null)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSkills((prev) => ({ ...prev, [activeAgent]: e.target.value }))
    setIsDirty(true)
    setPreviewContent(null)
  }

  const handlePreview = () => {
    if (!content.trim()) return
    setIsPreviewing(true)
    setTimeout(() => {
      setPreviewContent(
        `## Preview — ${AGENT_LABELS[activeAgent]}\n\n> Prompt excerpt:\n\n${content.slice(0, 300).replace(/\n/g, ' ')}…\n\n*This shows how the skill will be used as the system prompt. The actual output depends on the project context.*`
      )
      setIsPreviewing(false)
    }, 800)
  }

  const handlePublish = async () => {
    if (!content.trim()) {
      toast({ title: 'Validation Error', description: 'Skill content cannot be empty', variant: 'destructive' })
      return
    }
    if (content.length > 50000) {
      toast({ title: 'Validation Error', description: 'Content exceeds 50,000 characters', variant: 'destructive' })
      return
    }

    setIsPublishing(true)

    const newVersion = (versions[activeAgent] ?? 1) + 1
    const { error } = await supabase
      .from('agent_skills')
      .upsert({
        agent:      activeAgent,
        content,
        version:    newVersion,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'agent' })

    setIsPublishing(false)

    if (error) {
      toast({ title: 'Publish failed', description: error.message, variant: 'destructive' })
      return
    }

    setVersions((prev) => ({ ...prev, [activeAgent]: newVersion }))
    setUpdatedAt((prev) => ({ ...prev, [activeAgent]: new Date().toISOString() }))
    setIsDirty(false)
    toast({ title: 'Skill published', description: `${AGENT_LABELS[activeAgent]} v${newVersion} is now active on next generation.` })
  }

  const formatDate = (iso: string) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-chrome-subtle">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[14px]">Loading skills…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white">Skill Manager</h1>
        <p className="text-chrome-muted mt-1">Edit and publish agent system prompts — changes take effect on the next generation run.</p>
      </div>

      <Tabs value={activeAgent} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
        <TabsList className="bg-chrome-elevated border border-chrome-border w-full justify-start rounded-none rounded-t-lg p-0 h-auto shrink-0">
          {(Object.keys(AGENT_LABELS) as Agent[]).map((agent) => (
            <TabsTrigger
              key={agent}
              value={agent}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-b-[var(--primary)] rounded-none py-3 px-6 text-sm"
            >
              {AGENT_LABELS[agent]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 mt-4 min-h-0">
          {/* Editor */}
          <div className="flex-1 flex flex-col bg-chrome-elevated border border-chrome-border rounded-lg overflow-hidden min-h-[400px]">
            <div className="h-10 border-b border-chrome-border bg-white/[0.02] flex items-center px-2 gap-1 shrink-0">
              {[Bold, Italic, Code, Heading, Minus].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-7 w-7 text-chrome-muted hover:text-white hover:bg-white/10">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <Textarea
              value={content}
              onChange={handleContentChange}
              className="flex-1 resize-none bg-transparent border-0 focus-visible:ring-0 p-4 font-mono text-sm text-white/90 placeholder:text-white/30 rounded-none shadow-none"
              placeholder="Enter agent system prompt in Markdown…"
              maxLength={50000}
            />

            <div className="h-10 border-t border-chrome-border bg-white/[0.02] flex items-center justify-between px-4 shrink-0 text-xs text-chrome-muted">
              <div className="flex items-center gap-3">
                <span className={content.length > 45000 ? 'text-amber-500' : ''}>
                  {content.length.toLocaleString()} / 50,000
                </span>
                {isDirty && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] h-5 px-1.5 font-normal">
                    Unsaved
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>v{versions[activeAgent]}</span>
                <span>·</span>
                <span>{formatDate(updatedAt[activeAgent])}</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col bg-chrome-elevated border border-chrome-border rounded-lg overflow-hidden min-h-[400px]">
            <div className="h-10 border-b border-chrome-border bg-white/[0.02] flex items-center px-4 shrink-0">
              <span className="text-xs font-semibold uppercase text-chrome-muted tracking-wider">Preview</span>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {isPreviewing ? (
                <div className="h-full flex flex-col items-center justify-center text-chrome-subtle gap-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-sm font-mono">Rendering preview…</p>
                </div>
              ) : previewContent ? (
                <div className="prose prose-invert prose-amber max-w-none prose-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{previewContent}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-chrome-subtle gap-2">
                  <p className="text-sm">Click Preview to see a rendered summary</p>
                  <p className="text-[11px] text-white/25">The skill content is used as the Claude system prompt during generation</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-chrome-border shrink-0">
          <div className="text-sm text-chrome-muted">
            Last published: {formatDate(updatedAt[activeAgent])} · v{versions[activeAgent]}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={isPreviewing || !content.trim()}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Preview
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!isDirty || isPublishing}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isPublishing
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Publishing…</>
                : <><Save className="h-4 w-4 mr-2" />Publish update</>}
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
