import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuditLogTable } from '../../components/admin/AuditLogTable'
import { adminService } from '../../services/adminService'

vi.mock('../../services/adminService', () => ({
  adminService: {
    getAuditLog: vi.fn(),
  },
}))

describe('AuditLogTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading then table rows', async () => {
    adminService.getAuditLog.mockResolvedValueOnce({ items: [{ id: '1', created_at: '2026-06-15T10:00:00Z', user_name: 'Alpha', action: 'LOGIN' }] })
    render(<AuditLogTable />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText(/Alpha/)).toBeInTheDocument())
  })

  it('shows no entries message with empty results', async () => {
    adminService.getAuditLog.mockResolvedValueOnce({ items: [] })
    render(<AuditLogTable />)
    await waitFor(() => expect(screen.getByText(/No audit entries found/i)).toBeInTheDocument())
  })

  it('filters by date inputs and clears filters', async () => {
    adminService.getAuditLog.mockResolvedValue({ items: [] })
    const { container } = render(<AuditLogTable />)
    // wait for initial load to finish
    await screen.findByText(/No audit entries found/i)
    // find the date inputs directly since labels are not linked with htmlFor
    const dateInputs = container.querySelectorAll('input[type="date"]')
    expect(dateInputs.length).toBeGreaterThanOrEqual(2)
    fireEvent.change(dateInputs[0], { target: { value: '2026-06-01' } })
    fireEvent.change(dateInputs[1], { target: { value: '2026-06-30' } })
    expect(await screen.findByRole('button', { name: /clear filters/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }))
    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
  })
})
