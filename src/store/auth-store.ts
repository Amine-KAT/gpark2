import { create } from "zustand"
import { type MockUser, type UserRole } from "@/src/mock/users"

interface AuthState {
  currentUser: MockUser | null
  isAuthenticated: boolean
  role: UserRole
  // Supabase-driven auth: these are set after successful Supabase auth
  setUserFromProfile: (profile: MockUser) => void
  logout: () => void
  switchRole: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  role: "client",

  setUserFromProfile: (profile: MockUser) => {
    set({ currentUser: profile, isAuthenticated: true, role: profile.role })
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false, role: "client" })
  },

  switchRole: () => {
    const { role, currentUser } = get()
    const newRole: UserRole = role === "client" ? "host" : "client"
    if (currentUser) {
      set({ role: newRole, currentUser: { ...currentUser, role: newRole } })
    }
  },
}))
