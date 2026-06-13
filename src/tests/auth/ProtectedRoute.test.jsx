import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { AuthContext } from '../../context/AuthContext'

function renderRoute(user, allowedRoles) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, loading: false, login: vi.fn(), logout: vi.fn() }}>
        <ProtectedRoute allowedRoles={allowedRoles}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('redirects to /login when no user', () => {
    renderRoute(null, ['Admin'])
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when user has allowed role', () => {
    renderRoute({ role: 'Admin', full_name: 'Admin' }, ['Admin'])
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('blocks access when user role is not allowed', () => {
    renderRoute({ role: 'Doctor', full_name: 'Dr.' }, ['Admin'])
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when allowedRoles is not specified', () => {
    renderRoute({ role: 'Doctor', full_name: 'Dr.' }, undefined)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
