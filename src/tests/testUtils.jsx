import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { vi } from 'vitest'

/**
 * Custom render function that wraps component with providers
 */
export function renderWithProviders(ui, { route = '/', ...renderOptions } = {}) {
  window.history.pushState({}, 'Test page', route)
  
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    )
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Custom render function with auth context only (no router)
 */
export function renderWithAuth(ui, { mockUser = null, ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    )
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Custom render function with router only (no auth)
 */
export function renderWithRouter(ui, { route = '/', ...renderOptions } = {}) {
  window.history.pushState({}, 'Test page', route)
  
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    )
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Create a mock authenticated user
 */
export function createMockUser(overrides = {}) {
  return {
    id: 1,
    email: 'doctor@hospital.org',
    full_name: 'Dr. John Smith',
    role: 'Doctor',
    avatar_url: 'https://example.com/avatar.jpg',
    ...overrides,
  }
}

/**
 * Create a mock admin user
 */
export function createMockAdminUser(overrides = {}) {
  return createMockUser({
    role: 'Admin',
    email: 'admin@hospital.org',
    full_name: 'Admin User',
    ...overrides,
  })
}

/**
 * Create a mock lab technician user
 */
export function createMockLabTechUser(overrides = {}) {
  return createMockUser({
    role: 'LabTechnician',
    email: 'lab@hospital.org',
    full_name: 'Lab Technician',
    ...overrides,
  })
}

/**
 * Setup local storage with auth token and user
 */
export function setupAuthStorage(user = null) {
  const token = 'mock_jwt_token_' + Date.now()
  localStorage.setItem('hrms_token', token)
  if (user) {
    localStorage.setItem('hrms_user', JSON.stringify(user))
  }
  return token
}

/**
 * Clear auth from local storage
 */
export function clearAuthStorage() {
  localStorage.removeItem('hrms_token')
  localStorage.removeItem('hrms_user')
}

/**
 * Mock api module
 */
export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
}

/**
 * Mock authService module
 */
export const mockAuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
  loginWithGoogle: vi.fn(),
  loginWithGithub: vi.fn(),
  getStoredUser: vi.fn(),
  getToken: vi.fn(),
  isAuthenticated: vi.fn(),
}

/**
 * Mock adminService module
 */
export const mockAdminService = {
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deactivateUser: vi.fn(),
  getAuditLog: vi.fn(),
}

/**
 * Wait for async updates
 */
export async function waitForAsync() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
