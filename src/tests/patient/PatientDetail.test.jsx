import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PatientDetailStub } from '../../components/patient'

describe('Patient detail smoke', () => {
	it('renders patient detail stub', () => {
		render(<PatientDetailStub />)
		expect(screen.getByText(/Patient Directory/i)).toBeInTheDocument()
	})
})
