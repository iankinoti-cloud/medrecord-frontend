import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '../../components/auth/LoginForm'
import { AuthContext } from '../../context/AuthContext'

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, loading: false, login: mockLogin, logout: vi.fn() }}>
        <LoginForm />
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders email and password fields', () => {
    renderLoginForm()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders Google and GitHub OAuth buttons', () => {
    renderLoginForm()
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument()
    expect(screen.getByText(/continue with github/i)).toBeInTheDocument()
  })

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { detail: 'Invalid credentials' } }
    })
    renderLoginForm()

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'bad@test.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('redirects admin to /admin on successful login', async () => {
    mockLogin.mockResolvedValueOnce({ role: 'Admin', full_name: 'Admin User' })
    renderLoginForm()

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'admin@test.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  it('redirects doctor to /dashboard on successful login', async () => {
    mockLogin.mockResolvedValueOnce({ role: 'Doctor', full_name: 'Dr. House' })
    renderLoginForm()

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'doc@test.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('toggles password visibility', () => {
    renderLoginForm()
    const input = screen.getByLabelText('Password')
    expect(input.type).toBe('password')
    fireEvent.click(screen.getByRole('button', { name: /show password/i }))
    expect(input.type).toBe('text')
  })
})
