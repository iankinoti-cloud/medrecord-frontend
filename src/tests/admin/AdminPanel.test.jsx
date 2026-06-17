import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  it('switches to Audit Log tab on click', async () => {
    const user = userEvent.setup()
    renderPanel()
    await user.click(screen.getByRole('button', { name: 'Security Audit Log' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Security Audit Log' })).toHaveClass('bg-surface')
    })
  })

  it('switches to Register Patient tab on click', async () => {
    const user = userEvent.setup()
    renderPanel()
    await user.click(screen.getByRole('button', { name: 'Register Patient' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Register Patient' })).toHaveClass('bg-surface')
    })
  })

  it('highlights only active tab', async () => {
    const user = userEvent.setup()
    renderPanel()
    
    const staffTab = screen.getByRole('button', { name: 'Manage Staff' })
    const auditTab = screen.getByRole('button', { name: 'Security Audit Log' })
    
    expect(staffTab).toHaveClass('bg-surface')
    expect(auditTab).not.toHaveClass('bg-surface')

    await user.click(auditTab)
    
    await waitFor(() => {
      expect(staffTab).not.toHaveClass('bg-surface')
      expect(auditTab).toHaveClass('bg-surface')
    })
  })

  it('switches between tabs correctly', async () => {
    const user = userEvent.setup()
    renderPanel()
    
    const staffTab = screen.getByRole('button', { name: 'Manage Staff' })
    const auditTab = screen.getByRole('button', { name: 'Security Audit Log' })
    const registerTab = screen.getByRole('button', { name: 'Register Patient' })

    await user.click(auditTab)
    expect(auditTab).toHaveClass('bg-surface')

    await user.click(registerTab)
    expect(registerTab).toHaveClass('bg-surface')

    await user.click(staffTab)
    expect(staffTab).toHaveClass('bg-surface')
  })
})
