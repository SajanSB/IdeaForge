import { useMemo } from 'react'
import { cn } from '@/utils/cn'

interface Heading {
  level:  number
  text:   string
  id:     string
}

interface TableOfContentsProps {
  content: string
  activeId?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractHeadings(markdown: string): Heading[] {
  const lines    = markdown.split('\n')
  const headings: Heading[] = []
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text  = match[2].replace(/`[A-Z]{2,5}-\d{3,4}`/g, '').trim()
      headings.push({ level, text, id: slugify(text) })
    }
  }
  return headings.slice(0, 30)  // cap at 30 entries
}

export function TableOfContents({ content, activeId }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(content), [content])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-6 hidden xl:block w-52 flex-shrink-0 ml-6"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans mb-3">
        Contents
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                'block text-[12px] leading-snug py-0.5 transition-colors font-sans',
                heading.level === 1 && 'font-medium',
                heading.level === 2 && 'pl-2',
                heading.level === 3 && 'pl-4',
                activeId === heading.id
                  ? 'text-[#BA7517]'
                  : 'text-[#6B7280] hover:text-[#0F0F0F]',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
