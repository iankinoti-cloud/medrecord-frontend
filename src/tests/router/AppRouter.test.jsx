import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AppRouter } from '../../router/AppRouter'
import { authService } from '../../services/authService'

vi.mock('../../services/authService', () => ({
  authService: {
    getStoredUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    getMe: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    loginWithGoogle: vi.fn(),
    loginWithGithub: vi.fn(),
  },
}))

vi.mock('../../services/adminService', () => ({
  adminService: {
    getUsers: vi.fn().mockResolvedValue([]),
    getAuditLog: vi.fn().mockResolvedValue([]),
  },
}))

describe('AppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState({}, '', '/')
  })

  it('redirects the root route to login', async () => {
    render(<AppRouter />)
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('protects dashboard for unauthenticated users', async () => {
    window.history.pushState({}, '', '/dashboard')
    render(<AppRouter />)
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('renders an authenticated admin route after getMe resolves', async () => {
    authService.getStoredUser.mockReturnValue({ full_name: 'Admin User', role: 'Admin' })
    authService.isAuthenticated.mockReturnValue(true)
    authService.getMe.mockResolvedValue({ full_name: 'Admin User', role: 'Admin' })
    window.history.pushState({}, '', '/admin')

    render(<AppRouter />)

    expect(screen.getByRole('status')).toHaveTextContent(/authenticating/i)
    await waitFor(() => expect(screen.getByRole('heading', { name: /admin panel/i })).toBeInTheDocument())
  })
})
