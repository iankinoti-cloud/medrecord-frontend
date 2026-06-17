import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientTable from '../../components/patient/PatientTable'

const mockPatients = [
  { patient_id: 'PT-001', full_name: 'Alice Doe', date_of_birth: '1990-01-01', gender: 'Female', status: 'Active' },
  { patient_id: 'PT-002', full_name: 'Bob Smith', date_of_birth: '1985-06-15', gender: 'Male', status: 'In ER' },
]

describe('PatientTable', () => {
  // use real timers for debounce behaviour

  it('renders patient rows and pagination counts', () => {
    render(<PatientTable patients={mockPatients} onSelectPatient={vi.fn()} />)
    expect(screen.getByText('PT-001')).toBeInTheDocument()
    expect(screen.getByText('Alice Doe')).toBeInTheDocument()
    expect(screen.getByText('Showing 2 of 2 results')).toBeInTheDocument()
  })

  it('filters by name and patient id', async () => {
    render(<PatientTable patients={mockPatients} onSelectPatient={vi.fn()} />)
    const input = screen.getByPlaceholderText(/search by patient id or name/i)
    fireEvent.change(input, { target: { value: 'Bob' } })
    // wait for debounce to apply and PT-001 to disappear
    await waitFor(() => expect(screen.queryByText('PT-001')).not.toBeInTheDocument(), { timeout: 2000 })

    fireEvent.change(input, { target: { value: '' } })
    fireEvent.change(input, { target: { value: 'PT-001' } })
    // wait for debounce to apply and PT-002 to disappear
    await waitFor(() => expect(screen.queryByText('PT-002')).not.toBeInTheDocument(), { timeout: 2000 })
  })

  it('calls onSelectPatient when row clicked', () => {
    const onSelectPatient = vi.fn()
    render(<PatientTable patients={mockPatients} onSelectPatient={onSelectPatient} />)
    fireEvent.click(screen.getByText('Alice Doe').closest('tr'))
    expect(onSelectPatient).toHaveBeenCalledWith('PT-001')
  })
})
