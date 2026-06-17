import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LoginPage } from '../../pages/LoginPage'
import { DashboardPage } from '../../pages/DashboardPage'
import { PatientDetailPage } from '../../pages/PatientDetailPage'
import { LabPortalPage } from '../../pages/LabPortalPage'
import { AdminPage } from '../../pages/AdminPage'
import { UnauthorizedPage } from '../../pages/UnauthorizedPage'

vi.mock('../../services/adminService', () => ({
  adminService: {
    getUsers: vi.fn().mockResolvedValue([]),
    getAuditLog: vi.fn().mockResolvedValue([]),
  },
}))

function renderWithAuth(ui, user = { full_name: 'Admin User', role: 'Admin' }) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthContext.Provider value={{ user, loading: false, login: vi.fn(), logout: vi.fn() }}>
        {ui}
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('page components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login page for unauthenticated users', () => {
    renderWithAuth(<LoginPage />, null)
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByText(/Authorized personnel only/i)).toBeInTheDocument()
  })

  it('redirects authenticated users from login by role', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthContext.Provider value={{ user: { full_name: 'Lab User', role: 'LabTechnician' }, loading: false, login: vi.fn(), logout: vi.fn() }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lab" element={<div>Lab destination</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByText('Lab destination')).toBeInTheDocument()
  })

  it('renders dashboard, patient detail, lab, and admin page shells', async () => {
    const { rerender } = renderWithAuth(<DashboardPage />)
    expect(screen.getByRole('heading', { name: /patient directory/i })).toBeInTheDocument()
    expect(screen.getByText(/Person 2/i)).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { full_name: 'Doctor User', role: 'Doctor' }, loading: false, login: vi.fn(), logout: vi.fn() }}>
          <PatientDetailPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByText(/Search and view patient medical records/i)).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { full_name: 'Lab User', role: 'Lab Technician' }, loading: false, login: vi.fn(), logout: vi.fn() }}>
          <LabPortalPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /lab portal/i })).toBeInTheDocument()
    expect(screen.getByText(/Person 3/i)).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { full_name: 'Admin User', role: 'Admin' }, loading: false, login: vi.fn(), logout: vi.fn() }}>
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /admin panel/i })).toBeInTheDocument()
    expect(await screen.findByText('0 staff members')).toBeInTheDocument()
  })

  it('renders unauthorized page with return link', () => {
    render(<UnauthorizedPage />)
    expect(screen.getByRole('heading', { name: /access restricted/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return to login/i })).toHaveAttribute('href', '/login')
  })
})
