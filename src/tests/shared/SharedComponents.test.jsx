import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { PageHeader } from '../../components/shared/PageHeader'
import { PageLayout } from '../../components/shared/PageLayout'
import { ErrorBoundary } from '../../components/shared/ErrorBoundary'

function renderWithAuth(children, value = { user: { full_name: 'Test User', role: 'Admin' }, loading: false, login: vi.fn(), logout: vi.fn() }) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('Shared components', () => {
  it('renders PageHeader with actions', () => {
    render(<PageHeader title="Dashboard" subtitle="Overview" actions={<button>Action</button>} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('renders PageLayout and Sidebar content', () => {
    renderWithAuth(
      <PageLayout>
        <div>Page body</div>
      </PageLayout>
    )
    expect(screen.getByText('Page body')).toBeInTheDocument()
    expect(screen.getByText('MedRecord')).toBeInTheDocument()
  })

  it('ErrorBoundary catches thrown errors and shows fallback UI', () => {
    const Bomb = () => {
      throw new Error('Boom')
    }

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })
})
