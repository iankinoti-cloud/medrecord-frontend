import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardStatCard from '../../components/patient/DashboardStatCards'
import DashboardPagination from '../../components/patient/DashboardPagination'
import DashboardSearchBar from '../../components/patient/DashboardSearchBar'
import PatientHeader from '../../components/patient/PatientHeader'
import PatientMedicalHistoryTab from '../../components/patient/PatientMedicalHistoryTab'
import PatientAddDiagnosisForm from '../../components/patient/PatientAddDiagnosisForm'
import PatientDirectory from '../../components/patient'

const patient = {
  patient_id: 'P-1000',
  full_name: 'Maya Test',
  gender: 'Female',
  status: 'Pending Lab',
  blood_type: 'A+',
  contact_phone: '+254700000000',
}

describe('patient presentational components', () => {
  it('renders dashboard statistic cards', () => {
    render(<DashboardStatCard />)
    expect(screen.getByText('Total Records')).toBeInTheDocument()
    expect(screen.getByText('Pending Lab')).toBeInTheDocument()
    expect(screen.getByText('99.9%')).toBeInTheDocument()
  })

  it('renders pagination counts with disabled controls', () => {
    render(<DashboardPagination totalItems={10} filteredCount={3} />)
    expect(screen.getByText('Showing 3 of 10 results')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('updates dashboard search input and shows typing state while debouncing', async () => {
    const setSearchTerm = vi.fn()
    const user = userEvent.setup()
    render(<DashboardSearchBar searchTerm="Ali" setSearchTerm={setSearchTerm} debouncedSearch="" />)
    expect(screen.getByText(/typing/i)).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText(/search by patient id or name/i), 'a')
    expect(setSearchTerm).toHaveBeenCalled()
  })

  it('renders patient header and returns null without a patient', () => {
    const { container, rerender } = render(<PatientHeader patient={patient} />)
    expect(screen.getByText('Maya Test')).toBeInTheDocument()
    expect(screen.getByText('P-1000')).toBeInTheDocument()
    expect(screen.getByText('Blood: A+')).toBeInTheDocument()

    rerender(<PatientHeader patient={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders missing medical history values and disabled diagnosis controls', () => {
    render(
      <>
        <PatientMedicalHistoryTab />
        <PatientAddDiagnosisForm />
      </>
    )
    expect(screen.getAllByText('Not specified')).toHaveLength(2)
    expect(screen.getByPlaceholderText(/diagnosis parameters/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /commit entry to chart/i })).toBeDisabled()
  })

  it('opens a seeded patient detail and returns to the directory', async () => {
    const user = userEvent.setup()
    render(<PatientDirectory />)

    await user.click(screen.getByText('Aisha Mohammed'))
    expect(screen.getByText(/Patient ID:/)).toBeInTheDocument()
    expect(screen.getByText('Omar Mohammed (+254700333444)')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /back to patient directory/i }))
    expect(screen.getByText(/Search and view patient medical records/i)).toBeInTheDocument()
  })
})
