import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterPatientForm } from '../../components/admin/RegisterPatientForm'

describe('RegisterPatientForm', () => {
  it('renders patient registration fields', () => {
    render(<RegisterPatientForm />)
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/blood type/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register patient/i })).toBeInTheDocument()
  })

  it('updates entered values and shows current placeholder service error on submit', async () => {
    const user = userEvent.setup()
    render(<RegisterPatientForm onRegistered={vi.fn()} />)

    await user.type(screen.getByLabelText(/full name/i), 'Amina Patient')
    await user.type(screen.getByLabelText(/phone/i), '+254700000000')
    await user.selectOptions(screen.getByLabelText(/gender/i), 'Female')
    await user.selectOptions(screen.getByLabelText(/blood type/i), 'O+')
    await user.type(screen.getByLabelText(/address/i), 'Nairobi')
    await user.click(screen.getByRole('button', { name: /register patient/i }))

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Amina Patient')
    expect(screen.getByLabelText(/gender/i)).toHaveValue('Female')
    expect(await screen.findByText('Person 3: wire POST /patients/register here')).toBeInTheDocument()
  })
})
