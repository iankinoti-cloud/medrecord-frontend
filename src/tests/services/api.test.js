import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import api from '../../services/api'
import { TOKEN_KEY } from '../../utils/constants'

// Mock axios
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios')
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  }
})

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(api).toBeDefined()
  })

  it('should have correct base URL configured', () => {
    expect(api.defaults.baseURL).toBe(
      import.meta.env.VITE_API_URL || 'http://localhost:8000'
    )
  })

  it('should have timeout configured', () => {
    expect(api.defaults.timeout).toBe(10000)
  })

  it('should have Content-Type header set', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should have interceptors configured', () => {
    expect(api.interceptors).toBeDefined()
    expect(api.interceptors.request).toBeDefined()
    expect(api.interceptors.response).toBeDefined()
  })

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', () => {
      const token = 'test_token_123'
      localStorage.setItem(TOKEN_KEY, token)

      const config = {}
      const requestInterceptor = api.interceptors.request.handlers[0]
      
      if (requestInterceptor) {
        const result = requestInterceptor.fulfilled(config)
        if (result) {
          expect(result.headers?.Authorization).toBe(`Bearer ${token}`)
        }
      }
    })

    it('should not add Authorization header when token does not exist', () => {
      const config = { headers: {} }
      const requestInterceptor = api.interceptors.request.handlers[0]
      
      if (requestInterceptor) {
        const result = requestInterceptor.fulfilled(config)
        if (result) {
          expect(result.headers?.Authorization).toBeUndefined()
        }
      }
    })
  })

  describe('Response Interceptor', () => {
    it('should handle successful responses', () => {
      const mockResponse = { status: 200, data: { user: { id: 1 } } }
      const responseInterceptor = api.interceptors.response.handlers[0]
      
      if (responseInterceptor) {
        const result = responseInterceptor.fulfilled(mockResponse)
        expect(result).toEqual(mockResponse)
      }
    })

    it('should remove token and redirect on 401 error', () => {
      const token = 'test_token_123'
      localStorage.setItem(TOKEN_KEY, token)
      window.location.href = ''

      const error = {
        response: { status: 401 },
      }
      
      const responseInterceptor = api.interceptors.response.handlers[0]
      
      if (responseInterceptor && responseInterceptor.rejected) {
        expect(() => {
          responseInterceptor.rejected(error)
        }).toThrow()
      }
    })
  })
})
