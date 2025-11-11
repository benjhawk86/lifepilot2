import { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import type { User } from './types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, deleteUser] = useKV<User | null>('lifepilot-user', null)

  const login = async (email: string, password: string, isAdmin = false) => {
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: isAdmin ? 'admin' : 'general',
      createdAt: new Date().toISOString(),
    }
    setUser(mockUser)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
