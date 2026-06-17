import { describe, it, expect, beforeEach, vi } from 'vitest'
import api from '../../services/api'
import { TOKEN_KEY } from '../../utils/constants'

describe('api interceptor behavior', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('adds Authorization header when token exists', async () => {
    localStorage.setItem(TOKEN_KEY, 'secret')
    const request = { headers: {} }
    const fulfilled = api.interceptors.request.handlers[0].fulfilled
    const result = await fulfilled(request)
    expect(result.headers.Authorization).toBe('Bearer secret')
  })

  it('does not modify request headers when token is missing', async () => {
    const request = { headers: {} }
    const fulfilled = api.interceptors.request.handlers[0].fulfilled
    const result = await fulfilled(request)
    expect(result.headers.Authorization).toBeUndefined()
  })

  it('clears token and navigates to login on 401 response', async () => {
    const rejectHandler = api.interceptors.response.handlers[0].rejected
    localStorage.setItem(TOKEN_KEY, 'token')
    global.location = { href: '' }
    const error = { response: { status: 401 } }
    await expect(rejectHandler(error)).rejects.toEqual(error)
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(global.location.href).toBe('/login')
  })
})
