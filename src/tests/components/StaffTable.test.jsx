import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StaffTable } from '../../components/admin/StaffTable'
import { adminService } from '../../services/adminService'

vi.mock('../../services/adminService', () => ({
  adminService: {
    getUsers: vi.fn(),
    deactivateUser: vi.fn(),
    createUser: vi.fn(),
  },
}))

const staff = [
  {
    id: 'u-1',
    full_name: 'Jane Doctor',
    role: 'Doctor',
    email: 'jane@hospital.test',
    is_active: true,
    created_at: '2026-06-01T08:00:00Z',
  },
  {
    id: 'u-2',
    full_name: 'Ada Admin',
    role: 'Admin',
    email: 'ada@hospital.test',
    is_active: false,
    created_at: '2026-05-01T08:00:00Z',
  },
]

describe('StaffTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
    vi.stubGlobal('alert', vi.fn())
  })

  it('loads and renders staff accounts', async () => {
    adminService.getUsers.mockResolvedValueOnce({ items: staff })
    render(<StaffTable />)

    expect(screen.getByRole('status')).toHaveTextContent(/loading staff/i)
    expect(await screen.findByText('Jane Doctor')).toBeInTheDocument()
    expect(screen.getByText('Ada Admin')).toBeInTheDocument()
    expect(screen.getByText('2 staff members')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('opens create modal and refreshes after creation', async () => {
    adminService.getUsers.mockResolvedValue({ items: staff })
    adminService.createUser.mockResolvedValueOnce({})
    const user = userEvent.setup()
    render(<StaffTable />)

    await screen.findByText('Jane Doctor')
    await user.click(screen.getByRole('button', { name: /add staff/i }))
    expect(screen.getByRole('heading', { name: /create staff account/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Full Name'), 'New Nurse')
    await user.type(screen.getByLabelText('Email'), 'new@hospital.test')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => expect(adminService.createUser).toHaveBeenCalledWith({
      full_name: 'New Nurse',
      email: 'new@hospital.test',
      role: 'Doctor',
      password: 'secret123',
    }))
    await waitFor(() => expect(screen.queryByRole('heading', { name: /create staff account/i })).not.toBeInTheDocument())
    expect(adminService.getUsers).toHaveBeenCalledTimes(2)
  })

  it('deactivates active staff after confirmation', async () => {
    adminService.getUsers.mockResolvedValue({ items: staff })
    adminService.deactivateUser.mockResolvedValueOnce({})
    const user = userEvent.setup()
    render(<StaffTable />)

    await screen.findByText('Jane Doctor')
    await user.click(screen.getByRole('button', { name: /deactivate/i }))

    expect(confirm).toHaveBeenCalledWith('Deactivate this account?')
    await waitFor(() => expect(adminService.deactivateUser).toHaveBeenCalledWith('u-1'))
    expect(adminService.getUsers).toHaveBeenCalledTimes(2)
  })

  it('shows retryable error state when staff cannot load', async () => {
    adminService.getUsers.mockRejectedValueOnce(new Error('network'))
    adminService.getUsers.mockResolvedValueOnce([])
    const user = userEvent.setup()
    render(<StaffTable />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to load staff accounts.')
    await user.click(screen.getByRole('button', { name: /try again/i }))
    await waitFor(() => expect(screen.getByText('0 staff members')).toBeInTheDocument())
  })

  it('does not deactivate when confirmation is cancelled', async () => {
    confirm.mockReturnValueOnce(false)
    adminService.getUsers.mockResolvedValueOnce(staff)
    const user = userEvent.setup()
    render(<StaffTable />)

    await screen.findByText('Jane Doctor')
    await user.click(screen.getByRole('button', { name: /deactivate/i }))

    expect(adminService.deactivateUser).not.toHaveBeenCalled()
  })
})
