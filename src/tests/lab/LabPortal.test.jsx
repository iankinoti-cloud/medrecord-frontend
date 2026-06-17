import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LabPortalStub } from '../../components/lab'

describe('Lab portal smoke', () => {
	it('renders lab portal stub', () => {
		render(<LabPortalStub />)
		expect(screen.getByText(/Person 3 — Lab Portal/i)).toBeInTheDocument()
	})
})
