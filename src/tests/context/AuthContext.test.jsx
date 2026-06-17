import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuthContext } from '../../context/AuthContext'
import { SESSION_TIMEOUT_MS } from '../../utils/constants'
import { createMockUser } from '../testUtils'

vi.mock('../../services/authService', () => ({
  authService: {
    getStoredUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    getMe: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

import { authService } from '../../services/authService'

function Consumer() {
  const { user, loading, login, logout } = useAuthContext()
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user ? user.full_name : 'no-user'}</div>
      <button type="button" onClick={() => login('test@test.com', 'password')}>login</button>
      <button type="button" onClick={logout}>logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('throws when useAuthContext is used outside provider', () => {
    expect(() => render(<Consumer />)).toThrow('useAuthContext must be inside AuthProvider')
  })

  it('starts with no user when not authenticated', async () => {
    authService.isAuthenticated.mockReturnValue(false)
    authService.getStoredUser.mockReturnValue(null)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('ready'))
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
  })

  it('loads current user when authenticated', async () => {
    const mockUser = createMockUser()
    authService.isAuthenticated.mockReturnValue(true)
    authService.getMe.mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('ready'))
    expect(screen.getByTestId('user')).toHaveTextContent(mockUser.full_name)
  })

  it('login updates user in context', async () => {
    const mockUser = createMockUser()
    authService.login.mockResolvedValue(mockUser)
    authService.isAuthenticated.mockReturnValue(false)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('ready'))
    screen.getByRole('button', { name: 'login' }).click()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent(mockUser.full_name))
  })

  it('logout clears user from context', async () => {
    const mockUser = createMockUser()
    authService.isAuthenticated.mockReturnValue(true)
    authService.getMe.mockResolvedValue(mockUser)
    authService.logout.mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent(mockUser.full_name))

    screen.getByRole('button', { name: 'logout' }).click()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('no-user'))
  })

  it('handles getMe failure by logging out', async () => {
    authService.isAuthenticated.mockReturnValue(true)
    authService.getMe.mockRejectedValue(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled()
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should set up session timeout', async () => {
    const mockUser = createMockUser()
    authService.isAuthenticated.mockReturnValue(true)
    authService.getMe.mockResolvedValue(mockUser)
    authService.logout.mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(mockUser.full_name)
    })

    // Advance time past session timeout
    vi.advanceTimersByTime(SESSION_TIMEOUT_MS + 1000)

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled()
    })
  })

  it('should provide loading state initially', () => {
    authService.isAuthenticated.mockReturnValue(false)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    // After initial render, should be ready (not loading)
    expect(screen.getByTestId('loading')).toHaveTextContent('ready')
  })

  it('should not fetch user if not authenticated', async () => {
    authService.isAuthenticated.mockReturnValue(false)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(authService.getMe).not.toHaveBeenCalled()
    })
  })

  it('should update user state after successful login', async () => {
    const mockUser = createMockUser({ full_name: 'New User' })
    authService.login.mockResolvedValue(mockUser)
    authService.isAuthenticated.mockReturnValue(false)

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    const loginBtn = screen.getByRole('button', { name: 'login' })
    loginBtn.click()

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password')
      expect(screen.getByTestId('user')).toHaveTextContent('New User')
    })
  })
})
