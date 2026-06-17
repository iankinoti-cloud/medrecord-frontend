import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../../components/shared/Sidebar'
import { renderWithProviders } from '../testUtils'
import { ROLES } from '../../utils/constants'

vi.mock('../../services/authService', () => ({
  authService: {
    isAuthenticated: vi.fn(() => true),
    getStoredUser: vi.fn(() => ({
      id: 1,
      full_name: 'Dr. John Smith',
      role: 'Doctor',
    })),
    logout: vi.fn(),
    getMe: vi.fn(),
  },
}))

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sidebar', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByText('MedRecord')).toBeInTheDocument()
    expect(screen.getByText(/Hospital System/i)).toBeInTheDocument()
  })

  it('should display user initials', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByText('DJ')).toBeInTheDocument()
  })

  it('should show Dashboard for Doctor', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should have proper navigation links', () => {
    renderWithProviders(<Sidebar />)

    const navLinks = screen.getAllByRole('link')
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('should be fixed position', () => {
    const { container } = renderWithProviders(<Sidebar />)

    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('fixed')
    expect(aside).toHaveClass('top-0')
    expect(aside).toHaveClass('left-0')
  })

  it('should have sidebar width styling', () => {
    const { container } = renderWithProviders(<Sidebar />)

    const aside = container.querySelector('aside')
    expect(aside).toHaveStyle('width: var(--sidebar-width)')
  })

  it('should display brand information', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByText('MedRecord')).toBeInTheDocument()
    const logo = screen.getByText('Hospital System')
    expect(logo).toBeInTheDocument()
  })
})
    const { authService } = await import('../../services/authService')

    renderWithProviders(<Sidebar />)

    const logoutBtn = screen.getByRole('button', { name: /logout/i })
    if (logoutBtn) {
      await user.click(logoutBtn)
      expect(authService.logout).toHaveBeenCalled()
    }
  })

  it('should have proper navigation links', () => {
    renderWithProviders(<Sidebar />)

    const navLinks = screen.getAllByRole('link')
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('should be fixed position', () => {
    const { container } = renderWithProviders(<Sidebar />)

    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('fixed')
    expect(aside).toHaveClass('top-0')
    expect(aside).toHaveClass('left-0')
  })
})
