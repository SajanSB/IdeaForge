import { useEffect, useRef } from 'react'
import { AgentBubble } from './AgentBubble'
import { UserAnswerBubble } from './UserAnswerBubble'
import { TypingIndicator } from './TypingIndicator'

interface QAPair {
  question: string
  answer: string | null
}

interface QuestionThreadProps {
  questions: string[]
  answers: (string | null)[]
  currentIndex: number
  isTyping: boolean       // show typing indicator before new question appears
}

export function QuestionThread({
  questions,
  answers,
  currentIndex,
  isTyping,
}: QuestionThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom whenever a new question appears or typing starts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [currentIndex, isTyping])

  // Determine which past pairs to show
  const completedPairs: QAPair[] = questions
    .slice(0, currentIndex)
    .map((q, i) => ({ question: q, answer: answers[i] ?? null }))

  const currentQuestion = questions[currentIndex] ?? null

  return (
    <div
      className="flex-1 overflow-y-auto py-4"
      aria-live="polite"
      aria-label="Conversation with BA Agent"
      role="log"
    >
      {/* Completed Q&A pairs */}
      {completedPairs.map((pair, i) => (
        <div key={i} className="mb-2">
          <AgentBubble
            question={pair.question}
            questionNumber={i + 1}
            isCurrent={false}
          />
          <UserAnswerBubble
            answer={pair.answer}
            questionNumber={i + 1}
          />
        </div>
      ))}

      {/* Typing indicator — shown between questions */}
      {isTyping && <TypingIndicator />}

      {/* Current question */}
      {!isTyping && currentQuestion && (
        <AgentBubble
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          isCurrent={true}
        />
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} className="h-2" aria-hidden="true" />
    </div>
  )
}
