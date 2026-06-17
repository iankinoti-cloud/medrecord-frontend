import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PatientDetailedView from '../../components/patient/PatientDetailedView'

const patient = {
  full_name: 'Alice Example',
  patient_id: 'PT-001',
  status: 'Active',
  gender: 'Female',
  blood_type: 'O+',
  contact_phone: '+254712345678',
  address: '123 Nairobi',
  emergency_contact: 'John Doe',
}

describe('PatientDetailedView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders patient details and tabs', () => {
    render(<PatientDetailedView patient={patient} onBack={vi.fn()} />)
    expect(screen.getByText('Alice Example')).toBeInTheDocument()
    expect(screen.getByText('PT-001')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /medical history/i })).toBeInTheDocument()
    expect(screen.getByText(/Demographic & Intake Data/i)).toBeInTheDocument()
  })

  it('switches tabs and updates content', () => {
    render(<PatientDetailedView patient={patient} onBack={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /current treatment/i }))
    expect(screen.getByText(/No therapeutic regimens/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /lab reports/i }))
    expect(screen.getByText(/No ongoing diagnostic laboratory panels/i)).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn()
    render(<PatientDetailedView patient={patient} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back to patient directory/i }))
    expect(onBack).toHaveBeenCalled()
  })
})
