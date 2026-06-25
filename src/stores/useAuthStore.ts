import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/services/supabaseClient'
import type { User } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  setUser: (user: User | null) => void
}

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '').split(',').map((e: string) => e.trim())

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isAdmin: !!user && ADMIN_EMAILS.includes(user.email ?? ''),
      }),

      signUp: async (email, password) => {
        set({ isLoading: true })
        const { error } = await supabase.auth.signUp({ email, password })
        set({ isLoading: false })
        return { error: error?.message ?? null }
      },

      signIn: async (email, password) => {
        set({ isLoading: true })
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (data.user) get().setUser(data.user)
        set({ isLoading: false })
        return { error: error?.message ?? null }
      },

      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
        return { error: error?.message ?? null }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false, isAdmin: false })
      },

      refreshSession: async () => {
        const { data } = await supabase.auth.getUser()
        if (data.user) get().setUser(data.user)
        else set({ user: null, isAuthenticated: false, isAdmin: false })
      },
    }),
    { name: 'ideaforge_v1_auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated, isAdmin: s.isAdmin }) }
  )
)

// Initialize session on app load
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null)
})
