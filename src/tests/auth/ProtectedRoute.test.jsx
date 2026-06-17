import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { AuthContext } from '../../context/AuthContext'
import { ROLES } from '../../utils/constants'

function LocationProbe() {
  const location = useLocation()
  return <div>location:{location.pathname}</div>
}

function renderRoute(user, loading = false, allowedRoles) {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <AuthContext.Provider value={{ user, loading, login: vi.fn(), logout: vi.fn() }}>
        <Routes>
          <Route path="/login" element={<LocationProbe />} />
          <Route path="/unauthorized" element={<LocationProbe />} />
          <Route path="/private" element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>Protected Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner while authenticating', () => {
    renderRoute(null, true, ['Admin'])
    expect(screen.getByText(/authenticating/i)).toBeInTheDocument()
  })

  it('redirects to /login when no user', () => {
    renderRoute(null, false, ['Admin'])
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('location:/login')).toBeInTheDocument()
  })

  it('renders children when user has allowed role', () => {
    renderRoute({ role: ROLES.ADMIN, full_name: 'Admin' }, false, [ROLES.ADMIN])
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('blocks access when user role is not allowed', () => {
    renderRoute({ role: ROLES.DOCTOR, full_name: 'Dr.' }, false, [ROLES.ADMIN])
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('location:/unauthorized')).toBeInTheDocument()
  })

  it('renders children when allowedRoles is not specified', () => {
    renderRoute({ role: ROLES.DOCTOR, full_name: 'Dr.' }, false, undefined)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('allows multiple roles', () => {
    const allowedRoles = [ROLES.ADMIN, ROLES.DOCTOR]
    renderRoute({ role: ROLES.DOCTOR, full_name: 'Dr.' }, false, allowedRoles)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('preserves location state during redirect', () => {
    renderRoute(null, false, [ROLES.ADMIN])
    expect(screen.getByText('location:/login')).toBeInTheDocument()
  })
})
