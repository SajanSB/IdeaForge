import { create } from 'zustand'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type UserRole = 'guest' | 'user' | 'admin'

interface AuthState {
  user:        User | null
  session:     Session | null
  role:        UserRole
  name:        string | null
  email:       string | null
  loading:     boolean

  // Actions
  initialize:  () => Promise<void>
  signUp:      (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signIn:      (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut:     () => Promise<void>
  /** @deprecated use signIn */
  login:       (email: string, role?: UserRole) => void
  /** @deprecated use signOut */
  logout:      () => void
}

function roleFromUser(user: User | null): UserRole {
  if (!user) return 'guest'
  // Store admin emails in user_metadata or app_metadata via Supabase dashboard
  if (user.app_metadata?.role === 'admin') return 'admin'
  return 'user'
}

export const useAuthStore = create<AuthState>((set) => ({
  user:    null,
  session: null,
  role:    'guest',
  name:    null,
  email:   null,
  loading: true,

  initialize: async () => {
    // Load existing session from storage
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user ?? null
    set({
      user,
      session,
      role:    roleFromUser(user),
      name:    user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null,
      email:   user?.email ?? null,
      loading: false,
    })

    // Keep store in sync with Supabase auth events
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      set({
        user,
        session,
        role:  roleFromUser(user),
        name:  user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null,
        email: user?.email ?? null,
      })
    })
  },

  signUp: async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { error }
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, role: 'guest', name: null, email: null })
  },

  // Legacy shims — pages will be migrated to signIn/signOut
  login:  (email, role = 'user') => set({ email, role, name: email.split('@')[0] }),
  logout: () => set({ role: 'guest', email: null, name: null }),
}))
