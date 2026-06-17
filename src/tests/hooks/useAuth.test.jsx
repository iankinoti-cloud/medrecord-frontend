import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../../hooks/useAuth'
import { AuthProvider } from '../../context/AuthContext'
import { createMockUser } from '../testUtils'

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
    getStoredUser: vi.fn(),
    getToken: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}))

import { authService } from '../../services/authService'

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    authService.isAuthenticated.mockReturnValue(false)
    authService.getStoredUser.mockReturnValue(null)
  })

  it('should return auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current.user).toBeDefined()
    expect(result.current.loading).toBeDefined()
    expect(result.current.login).toBeDefined()
    expect(result.current.logout).toBeDefined()
  })

  it('should provide login function', async () => {
    const mockUser = createMockUser()
    authService.login.mockResolvedValueOnce(mockUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await result.current.login('test@test.com', 'password123')

    expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password123')
  })

  it('should provide logout function', async () => {
    authService.isAuthenticated.mockReturnValue(true)
    const mockUser = createMockUser()
    authService.getStoredUser.mockReturnValue(mockUser)
    authService.getMe.mockResolvedValueOnce(mockUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toBeDefined()
    })

    await result.current.logout()

    expect(authService.logout).toHaveBeenCalled()
  })

  it('should handle loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.loading).toBe(true)
  })

  it('should set loading to false after initialization', async () => {
    authService.isAuthenticated.mockReturnValue(false)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should fetch user on mount when authenticated', async () => {
    const mockUser = createMockUser()
    authService.isAuthenticated.mockReturnValue(true)
    authService.getMe.mockResolvedValueOnce(mockUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(authService.getMe).toHaveBeenCalled()
    })
  })

  it('should logout and clear user on getMe error', async () => {
    authService.isAuthenticated.mockReturnValue(true)
    authService.getMe.mockRejectedValueOnce(new Error('Unauthorized'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled()
      expect(result.current.user).toBeNull()
    })
  })

  it('should throw error when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuthContext must be inside AuthProvider')
  })
})
