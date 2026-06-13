import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { SESSION_TIMEOUT_MS } from '../utils/constants'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(authService.getStoredUser)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLoading(false)
      return
    }
    authService.getMe()
      .then(setUser)
      .catch(() => { authService.logout(); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  // Session timeout
  useEffect(() => {
    if (!user) return
    const timer = setTimeout(logout, SESSION_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [user, logout])

  const login = useCallback(async (email, password) => {
    const u = await authService.login(email, password)
    setUser(u)
    return u
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider')
  return ctx
}
