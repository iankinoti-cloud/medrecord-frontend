import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { RoleBadge } from '../../components/shared/RoleBadge'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { ErrorMessage } from '../../components/shared/ErrorMessage'

describe('Shared Components', () => {
  describe('StatusBadge', () => {
    it('should render Active status', () => {
      render(<StatusBadge status="Active" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('should render In ER status', () => {
      render(<StatusBadge status="In ER" />)
      expect(screen.getByText('In ER')).toBeInTheDocument()
    })

    it('should render Pending Lab status', () => {
      render(<StatusBadge status="Pending Lab" />)
      expect(screen.getByText('Pending Lab')).toBeInTheDocument()
    })

    it('should render Discharged status', () => {
      render(<StatusBadge status="Discharged" />)
      expect(screen.getByText('Discharged')).toBeInTheDocument()
    })

    it('should have status dot', () => {
      const { container } = render(<StatusBadge status="Active" />)
      const dot = container.querySelector('[class*="rounded-full"]')
      expect(dot).toBeInTheDocument()
    })
  })

  describe('RoleBadge', () => {
    it('should render Doctor role', () => {
      render(<RoleBadge role="Doctor" />)
      expect(screen.getByText('Doctor')).toBeInTheDocument()
    })

    it('should render Admin role', () => {
      render(<RoleBadge role="Admin" />)
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })

    it('should render LabTechnician role', () => {
      render(<RoleBadge role="LabTechnician" />)
      expect(screen.getByText('LabTechnician')).toBeInTheDocument()
    })

    it('should have role-specific styling', () => {
      const { container: doctorContainer } = render(<RoleBadge role="Doctor" />)
      const doctorBadge = doctorContainer.querySelector('[class*="bg-"]')
      expect(doctorBadge).toBeInTheDocument()
    })
  })

  describe('LoadingSpinner', () => {
    it('should render spinner', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('[class*="animate-spin"]')
      expect(spinner).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<LoadingSpinner label="Loading..." />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should have size variations', () => {
      const { container: smContainer } = render(<LoadingSpinner size="sm" />)
      expect(smContainer.firstChild).toBeInTheDocument()

      const { container: mdContainer } = render(<LoadingSpinner size="md" />)
      expect(mdContainer.firstChild).toBeInTheDocument()

      const { container: lgContainer } = render(<LoadingSpinner size="lg" />)
      expect(lgContainer.firstChild).toBeInTheDocument()
    })
  })

  describe('ErrorMessage', () => {
    it('should render error message', () => {
      render(<ErrorMessage message="An error occurred" />)
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })

    it('should render with icon', () => {
      const { container } = render(<ErrorMessage message="Error" />)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render retry button when onRetry provided', () => {
      const mockOnRetry = vi.fn()
      render(<ErrorMessage message="Error" onRetry={mockOnRetry} />)
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('should call onRetry when retry button clicked', async () => {
      const user = userEvent.setup()
      const mockOnRetry = vi.fn()
      render(<ErrorMessage message="Error" onRetry={mockOnRetry} />)

      const retryBtn = screen.getByRole('button', { name: /retry/i })
      await user.click(retryBtn)

      expect(mockOnRetry).toHaveBeenCalled()
    })
  })
}))

      const retryBtn = screen.getByRole('button', { name: /retry/i })
      await user.click(retryBtn)

      expect(mockOnRetry).toHaveBeenCalled()
    })
  })
})
