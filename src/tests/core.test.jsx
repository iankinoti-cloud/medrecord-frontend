import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from '../services/api'
import { authService } from '../services/authService'
import { adminService } from '../services/adminService'
import { ROLES, ROUTES, API_BASE_URL, TOKEN_KEY, USER_KEY } from '../utils/constants'
import { StatusBadge } from '../components/shared/StatusBadge'
import { RoleBadge } from '../components/shared/RoleBadge'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { ErrorMessage } from '../components/shared/ErrorMessage'
import { OAuthButton } from '../components/auth/OAuthButton'

vi.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    interceptors: {
      request: { handlers: [] },
      response: { handlers: [] },
      use: vi.fn(),
    },
  },
}))

describe('Core utilities and services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('exports expected constants', () => {
    expect(ROLES.DOCTOR).toBe('Doctor')
    expect(ROUTES.LOGIN).toBe('/login')
    expect(API_BASE_URL).toBe('http://localhost:8000')
    expect(TOKEN_KEY).toBe('hrms_token')
  })

  it('renders StatusBadge with known status', () => {
    render(<StatusBadge status="In ER" />)
    expect(screen.getByText('In ER')).toHaveClass('inline-flex')
  })

  it('renders RoleBadge fallback for unknown role', () => {
    render(<RoleBadge role="Unknown" />)
    expect(screen.getByText('Unknown')).toHaveClass('inline-flex')
  })

  it('displays LoadingSpinner label', () => {
    render(<LoadingSpinner label="Working..." />)
    expect(screen.getByRole('status')).toHaveTextContent('Working...')
  })

  it('renders ErrorMessage and retry button', async () => {
    const retry = vi.fn()
    render(<ErrorMessage message="Oops" onRetry={retry} />)
    expect(screen.getByText('Oops')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(retry).toHaveBeenCalled()
  })

  it('renders OAuthButton and responds to click', async () => {
    const handler = vi.fn()
    render(<OAuthButton provider="github" onClick={handler} />)
    await userEvent.click(screen.getByRole('button', { name: /continue with github/i }))
    expect(handler).toHaveBeenCalled()
  })

  it('authService login stores token and user', async () => {
    const mockData = { access_token: 'tok', user: { full_name: 'Test User' } }
    api.post.mockResolvedValueOnce({ data: mockData })
    await expect(authService.login('a', 'b')).resolves.toEqual(mockData.user)
    expect(localStorage.getItem(TOKEN_KEY)).toBe('tok')
    expect(JSON.parse(localStorage.getItem(USER_KEY))).toEqual(mockData.user)
  })

  it('authService logout clears localStorage after api call', async () => {
    localStorage.setItem(TOKEN_KEY, 'tok')
    localStorage.setItem(USER_KEY, JSON.stringify({}))
    api.post.mockResolvedValueOnce({ data: {} })
    await authService.logout()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(USER_KEY)).toBeNull()
  })

  it('adminService methods call api endpoints', async () => {
    api.get.mockResolvedValueOnce({ data: { items: [] } })
    await expect(adminService.getUsers()).resolves.toEqual({ items: [] })
    expect(api.get).toHaveBeenCalledWith('/admin/users', { params: {} })

    api.post.mockResolvedValueOnce({ data: { id: 1 } })
    await expect(adminService.createUser({ a: 1 })).resolves.toEqual({ id: 1 })
    expect(api.post).toHaveBeenCalledWith('/admin/users', { a: 1 })

    api.put.mockResolvedValueOnce({ data: { updated: true } })
    await expect(adminService.updateUser(2, { b: 2 })).resolves.toEqual({ updated: true })
    expect(api.put).toHaveBeenCalledWith('/admin/users/2', { b: 2 })

    api.patch.mockResolvedValueOnce({ data: {} })
    await expect(adminService.deactivateUser(3)).resolves.toEqual({})
    expect(api.patch).toHaveBeenCalledWith('/admin/users/3/deactivate')

    api.get.mockResolvedValueOnce({ data: { items: [] } })
    await expect(adminService.getAuditLog({})).resolves.toEqual({ items: [] })
    expect(api.get).toHaveBeenCalledWith('/admin/audit-log', { params: {} })
  })
})
