import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { QAPair } from '@/types/elicitation'

interface ElicitationStore {
  projectId: string | null
  questions: string[]
  answers: (string | null)[]   // null means skipped
  currentIndex: number
  isComplete: boolean
  questionsLoaded: boolean

  setQuestions: (projectId: string, questions: string[]) => void
  saveAnswer: (index: number, answer: string | null) => void
  advance: () => void
  getTranscript: () => QAPair[]
  reset: () => void
}

export const useElicitationStore = create<ElicitationStore>()(
  persist(
    (set, get) => ({
      projectId: null,
      questions: [],
      answers: [],
      currentIndex: 0,
      isComplete: false,
      questionsLoaded: false,

      setQuestions: (projectId, questions) =>
        set({
          projectId,
          questions,
          answers: new Array(questions.length).fill(null),
          currentIndex: 0,
          isComplete: false,
          questionsLoaded: true,
        }),

      saveAnswer: (index, answer) => {
        const answers = [...get().answers]
        answers[index] = answer
        set({ answers })
      },

      advance: () => {
        const { currentIndex, questions } = get()
        const next = currentIndex + 1
        if (next >= questions.length) {
          set({ isComplete: true })
        } else {
          set({ currentIndex: next })
        }
      },

      getTranscript: () => {
        const { questions, answers } = get()
        return questions.map((question, i) => ({
          question,
          answer: answers[i],
        }))
      },

      reset: () =>
        set({
          projectId: null,
          questions: [],
          answers: [],
          currentIndex: 0,
          isComplete: false,
          questionsLoaded: false,
        }),
    }),
    {
      name: 'ideaforge_v1_elicitation',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
