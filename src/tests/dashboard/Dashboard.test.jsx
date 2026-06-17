import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardStub } from '../../components/dashboard'

describe('Dashboard smoke', () => {
	it('renders dashboard stub content', () => {
		render(<DashboardStub />)
		expect(screen.getByText(/Person 2 — Patient Directory/i)).toBeInTheDocument()
	})
})
