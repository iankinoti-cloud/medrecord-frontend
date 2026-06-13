import api from './api'
import { TOKEN_KEY, USER_KEY, API_BASE_URL } from '../utils/constants'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem(TOKEN_KEY, data.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  },

  async getMe() {
    const { data } = await api.get('/auth/me')
    return data
  },

  loginWithGoogle() {
    window.location.href = `${API_BASE_URL}/auth/google`
  },

  loginWithGithub() {
    window.location.href = `${API_BASE_URL}/auth/github`
  },

  getStoredUser() {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY))
  },
}
