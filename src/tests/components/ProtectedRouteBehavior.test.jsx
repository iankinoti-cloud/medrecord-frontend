import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { AuthContext } from '../../context/AuthContext'

function LocationProbe() {
  const location = useLocation()
  return <div>path:{location.pathname}</div>
}

function renderProtected(user, loading = false, allowedRoles) {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <AuthContext.Provider value={{ user, loading, login: () => {}, logout: () => {} }}>
        <Routes>
          <Route path="/login" element={<LocationProbe />} />
          <Route path="/unauthorized" element={<LocationProbe />} />
          <Route path="/private" element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>Private</div>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('renders loading spinner when auth is loading', () => {
    renderProtected(null, true, ['Admin'])
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('Private')).not.toBeInTheDocument()
  })

  it('redirects unauthenticated users away', () => {
    renderProtected(null, false, ['Admin'])
    expect(screen.queryByText('Private')).not.toBeInTheDocument()
    expect(screen.getByText('path:/login')).toBeInTheDocument()
  })

  it('renders content for allowed role', () => {
    renderProtected({ role: 'Admin' }, false, ['Admin'])
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('redirects users with disallowed role', () => {
    renderProtected({ role: 'Doctor' }, false, ['Admin'])
    expect(screen.queryByText('Private')).not.toBeInTheDocument()
    expect(screen.getByText('path:/unauthorized')).toBeInTheDocument()
  })
})
