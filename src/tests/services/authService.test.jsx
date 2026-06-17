import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '../../services/api'
import { authService } from '../../services/authService'
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../../utils/constants'

vi.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('stores login token and user from API response', async () => {
    const response = { access_token: 'token-1', user: { id: 'u-1', full_name: 'Test User', role: 'Doctor' } }
    api.post.mockResolvedValueOnce({ data: response })

    await expect(authService.login('doctor@test.local', 'password')).resolves.toEqual(response.user)

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'doctor@test.local',
      password: 'password',
    })
    expect(localStorage.getItem(TOKEN_KEY)).toBe('token-1')
    expect(JSON.parse(localStorage.getItem(USER_KEY))).toEqual(response.user)
  })

  it('clears auth storage even when logout request fails', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-1')
    localStorage.setItem(USER_KEY, JSON.stringify({ id: 'u-1' }))
    api.post.mockRejectedValueOnce(new Error('offline'))

    await expect(authService.logout()).rejects.toThrow('offline')

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(USER_KEY)).toBeNull()
  })

  it('returns current user and token helpers from storage', async () => {
    const user = { id: 'u-2', full_name: 'Stored User' }
    localStorage.setItem(TOKEN_KEY, 'token-2')
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    api.get.mockResolvedValueOnce({ data: user })

    await expect(authService.getMe()).resolves.toEqual(user)
    expect(authService.getStoredUser()).toEqual(user)
    expect(authService.getToken()).toBe('token-2')
    expect(authService.isAuthenticated()).toBe(true)
  })

  it('redirects to provider login endpoints', () => {
    const original = window.location
    delete window.location
    window.location = { href: '' }

    authService.loginWithGoogle()
    expect(window.location.href).toBe(`${API_BASE_URL}/auth/google`)

    authService.loginWithGithub()
    expect(window.location.href).toBe(`${API_BASE_URL}/auth/github`)

    window.location = original
  })
})
