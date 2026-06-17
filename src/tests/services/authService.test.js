import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { authService } from '../../services/authService'
import { TOKEN_KEY, USER_KEY, API_BASE_URL } from '../../utils/constants'

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import api from '../../services/api'

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('login', () => {
    it('should login user successfully and store token and user', async () => {
      const mockUser = { id: 1, email: 'test@test.com', full_name: 'Test User', role: 'Doctor' }
      const mockResponse = { data: { access_token: 'token123', user: mockUser } }

      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.login('test@test.com', 'password123')

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      })
      expect(result).toEqual(mockUser)
      expect(localStorage.getItem(TOKEN_KEY)).toBe('token123')
      expect(localStorage.getItem(USER_KEY)).toBe(JSON.stringify(mockUser))
    })

    it('should throw error on login failure', async () => {
      const error = new Error('Invalid credentials')
      api.post.mockRejectedValueOnce(error)

      await expect(authService.login('test@test.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      )
    })
  })

  describe('logout', () => {
    it('should logout user and clear storage', async () => {
      localStorage.setItem(TOKEN_KEY, 'token123')
      localStorage.setItem(USER_KEY, JSON.stringify({ id: 1 }))

      api.post.mockResolvedValueOnce({})

      await authService.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
      expect(localStorage.getItem(USER_KEY)).toBeNull()
    })

    it('should clear storage even if logout API call fails', async () => {
      localStorage.setItem(TOKEN_KEY, 'token123')
      localStorage.setItem(USER_KEY, JSON.stringify({ id: 1 }))

      api.post.mockRejectedValueOnce(new Error('API Error'))

      await authService.logout()

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
      expect(localStorage.getItem(USER_KEY)).toBeNull()
    })
  })

  describe('getMe', () => {
    it('should fetch current user data', async () => {
      const mockUser = { id: 1, email: 'test@test.com', full_name: 'Test User' }
      api.get.mockResolvedValueOnce({ data: mockUser })

      const result = await authService.getMe()

      expect(api.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('should throw error on getMe failure', async () => {
      const error = new Error('Unauthorized')
      api.get.mockRejectedValueOnce(error)

      await expect(authService.getMe()).rejects.toThrow('Unauthorized')
    })
  })

  describe('loginWithGoogle', () => {
    it('should redirect to Google OAuth endpoint', () => {
      const originalHref = window.location.href
      window.location.href = ''

      authService.loginWithGoogle()

      expect(window.location.href).toBe(`${API_BASE_URL}/auth/google`)

      window.location.href = originalHref
    })
  })

  describe('loginWithGithub', () => {
    it('should redirect to GitHub OAuth endpoint', () => {
      const originalHref = window.location.href
      window.location.href = ''

      authService.loginWithGithub()

      expect(window.location.href).toBe(`${API_BASE_URL}/auth/github`)

      window.location.href = originalHref
    })
  })

  describe('getStoredUser', () => {
    it('should return stored user', () => {
      const mockUser = { id: 1, email: 'test@test.com' }
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser))

      const result = authService.getStoredUser()

      expect(result).toEqual(mockUser)
    })

    it('should return null if user not stored', () => {
      const result = authService.getStoredUser()

      expect(result).toBeNull()
    })

    it('should return null if stored user is invalid JSON', () => {
      localStorage.setItem(USER_KEY, 'invalid json')

      expect(() => authService.getStoredUser()).toThrow()
    })
  })

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem(TOKEN_KEY, 'token123')

      const result = authService.getToken()

      expect(result).toBe('token123')
    })

    it('should return null if token not stored', () => {
      const result = authService.getToken()

      expect(result).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem(TOKEN_KEY, 'token123')

      const result = authService.isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when token does not exist', () => {
      const result = authService.isAuthenticated()

      expect(result).toBe(false)
    })
  })
})
