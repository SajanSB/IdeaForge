import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/utils/cn'
import type { Components } from 'react-markdown'

// Regex for requirement IDs: FR-001, BR-012, US-034, SR-056, BO-003 etc.
const REQ_ID_REGEX = /\b([A-Z]{2,5}-\d{3,4})\b/g

// Split text to wrap requirement IDs in styled spans
function highlightReqIds(text: string): React.ReactNode[] {
  const parts = text.split(REQ_ID_REGEX)
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // Odd indices are the captured groups (requirement IDs)
      return (
        <span
          key={i}
          className="font-mono text-xs font-medium text-[#BA7517] tracking-[0.02em]"
          title={`Requirement ID: ${part}`}
        >
          {part}
        </span>
      )
    }
    return part
  })
}

// Custom component for text nodes — applies req ID highlighting
function processText(text: string): React.ReactNode {
  if (!REQ_ID_REGEX.test(text)) return text
  REQ_ID_REGEX.lastIndex = 0  // reset stateful regex
  return <>{highlightReqIds(text)}</>
}

interface MarkdownRendererProps {
  content:    string
  className?: string
}

// Build the custom components map for react-markdown
function buildComponents(): Components {
  return {
    // ── Headings ─────────────────────────────────────────────────────────
    h1: ({ children }) => (
      <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] leading-snug mb-6 pb-3 border-b border-[0.5px] border-border font-sans mt-0 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-medium text-[#0F0F0F] leading-snug mt-8 mb-3 font-sans scroll-mt-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-[15px] font-medium text-[#0F0F0F] leading-snug mt-5 mb-2 font-sans scroll-mt-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-[14px] font-medium text-[#0F0F0F] mt-4 mb-1.5 font-sans">
        {children}
      </h4>
    ),

    // ── Paragraphs ────────────────────────────────────────────────────────
    p: ({ children }) => (
      <p className="text-sm text-[#6B7280] leading-relaxed mb-4 font-sans">
        {children}
      </p>
    ),

    // ── Emphasis ─────────────────────────────────────────────────────────
    strong: ({ children }) => (
      // 500 weight not 700 — per design system spec
      <strong className="font-medium text-[#0F0F0F]">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-[#6B7280]">{children}</em>
    ),

    // ── Lists ─────────────────────────────────────────────────────────────
    ul: ({ children }) => (
      <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-[#6B7280] font-sans">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 mb-4 space-y-1 text-sm text-[#6B7280] font-sans">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),

    // ── Tables — wrapped for horizontal scroll ────────────────────────────
    table: ({ children }) => (
      <div className="overflow-x-auto my-5 rounded-xl border border-[0.5px] border-border">
        <table className="w-full border-collapse text-[13px] font-sans">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-[#F7F5F0]">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="text-left px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] border-b border-[0.5px] border-border whitespace-nowrap">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2.5 text-[13px] text-[#0F0F0F] border-b border-[0.5px] border-border align-top">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-[#F7F5F0]/50 transition-colors">{children}</tr>
    ),

    // ── Code ──────────────────────────────────────────────────────────────
    code: ({ children, className }) => {
      // Check if this is a fenced code block (has a language class)
      const isBlock = className?.startsWith('language-')
      if (isBlock) {
        return (
          <code className={cn('font-mono text-[13px] text-[#0F0F0F]', className)}>
            {children}
          </code>
        )
      }
      // Inline code
      const text = String(children)
      // Check if this is a requirement ID
      if (/^[A-Z]{2,5}-\d{3,4}$/.test(text)) {
        return (
          <span className="font-mono text-xs font-medium text-[#BA7517] tracking-[0.02em]">
            {text}
          </span>
        )
      }
      return (
        <code className="font-mono text-xs bg-[#F7F5F0] text-[#0F0F0F] px-1.5 py-0.5 rounded border border-[0.5px] border-border">
          {children}
        </code>
      )
    },
    pre: ({ children }) => (
      <pre className="bg-[#F7F5F0] rounded-xl p-4 overflow-x-auto my-4 border border-[0.5px] border-border font-mono text-[13px] leading-relaxed">
        {children}
      </pre>
    ),

    // ── Block elements ────────────────────────────────────────────────────
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#BA7517] pl-4 my-4 italic text-[#6B7280] text-sm">
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className="border-none border-t border-[0.5px] border-border my-6" />
    ),

    // ── Links ─────────────────────────────────────────────────────────────
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#BA7517] underline underline-offset-2 hover:text-[#A06010] transition-colors"
      >
        {children}
      </a>
    ),
  }
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  // Pre-process: wrap plain-text requirement IDs in backticks
  // so they get picked up by the custom code component
  const processedContent = useMemo(() => {
    if (!content) return ''
    // Replace bare requirement IDs (not already in backticks) with backtick versions
    return content.replace(
      /(?<!`)(\b[A-Z]{2,5}-\d{3,4}\b)(?!`)/g,
      '`$1`'
    )
  }, [content])

  const components = useMemo(() => buildComponents(), [])

  return (
    <div className={cn('markdown-body', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
})
export { processText } // Keep export statement alive
