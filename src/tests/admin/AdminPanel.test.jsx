import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminPanel } from '../../components/admin/AdminPanel'

vi.mock('../../services/adminService', () => ({
  adminService: {
    getUsers:       vi.fn().mockResolvedValue([]),
    getAuditLog:    vi.fn().mockResolvedValue([]),
    createUser:     vi.fn().mockResolvedValue({}),
    deactivateUser: vi.fn().mockResolvedValue({}),
  }
}))

function renderPanel() {
  return render(<MemoryRouter><AdminPanel /></MemoryRouter>)
}

describe('AdminPanel', () => {
  it('renders the three tabs', () => {
    renderPanel()
    expect(screen.getByRole('button', { name: 'Manage Staff' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Security Audit Log' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register Patient' })).toBeInTheDocument()
  })

  it('shows Manage Staff tab by default', () => {
    renderPanel()
    expect(screen.getByRole('button', { name: 'Manage Staff' })).toHaveClass('bg-surface')
  })

  it('switches to Audit Log tab on click', () => {
    renderPanel()
    fireEvent.click(screen.getByRole('button', { name: 'Security Audit Log' }))
    // Audit log tab has a date filter — verify its contents appear
    expect(screen.getByText(/from/i)).toBeInTheDocument()
  })

  it('switches to Register Patient tab on click', () => {
    renderPanel()
    fireEvent.click(screen.getByRole('button', { name: 'Register Patient' }))
    // Register patient form has a Full Name input
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
  })
})
