import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthContext } from '../../context/AuthContext'
import { useRole } from '../../hooks/useRole'

function RoleConsumer() {
  const { role, isDoctor, isLabTech, isAdmin } = useRole()
  return (
    <div>
      <div>role:{role}</div>
      <div>doctor:{String(isDoctor)}</div>
      <div>lab:{String(isLabTech)}</div>
      <div>admin:{String(isAdmin)}</div>
    </div>
  )
}

describe('useRole', () => {
  it('returns role flags based on auth context', () => {
    render(
      <AuthContext.Provider value={{ user: { role: 'LabTechnician' } }}>
        <RoleConsumer />
      </AuthContext.Provider>
    )
    expect(screen.getByText('role:LabTechnician')).toBeInTheDocument()
    expect(screen.getByText('doctor:false')).toBeInTheDocument()
    expect(screen.getByText('lab:true')).toBeInTheDocument()
    expect(screen.getByText('admin:false')).toBeInTheDocument()
  })
})
