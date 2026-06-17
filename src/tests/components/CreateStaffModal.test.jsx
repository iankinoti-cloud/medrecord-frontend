import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateStaffModal } from '../../components/admin/CreateStaffModal'
import { adminService } from '../../services/adminService'

vi.mock('../../services/adminService', () => ({
  adminService: {
    createUser: vi.fn(),
  },
}))

describe('CreateStaffModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal fields and buttons', () => {
    render(<CreateStaffModal onClose={vi.fn()} onCreated={vi.fn()} />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('submits form and calls onCreated/onClose', async () => {
    const onCreated = vi.fn()
    const onClose = vi.fn()
    adminService.createUser.mockResolvedValueOnce({})
    render(<CreateStaffModal onClose={onClose} onCreated={onCreated} />)

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass1234' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => expect(onCreated).toHaveBeenCalled())
    expect(onClose).toHaveBeenCalled()
  })

  it('displays error when creation fails', async () => {
    adminService.createUser.mockRejectedValueOnce({ response: { data: { detail: 'Bad data' } } })
    render(<CreateStaffModal onClose={vi.fn()} onCreated={vi.fn()} />)
    // fill required fields so the form submits
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass1234' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText('Bad data')).toBeInTheDocument())
  })
})
