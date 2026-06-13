import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import { RoleBadge } from '../shared/RoleBadge'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { ErrorMessage } from '../shared/ErrorMessage'
import { CreateStaffModal } from './CreateStaffModal'

export function StaffTable() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminService.getUsers()
      setUsers(data.items ?? data)
    } catch {
      setError('Failed to load staff accounts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleDeactivate = async (id) => {
    if (!confirm('Deactivate this account?')) return
    try {
      await adminService.deactivateUser(id)
      fetchUsers()
    } catch {
      alert('Failed to deactivate account.')
    }
  }

  if (loading) return <LoadingSpinner label="Loading staff..." />
  if (error)   return <ErrorMessage message={error} onRetry={fetchUsers} />

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">{users.length} staff member{users.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-aegean-800 text-white text-sm font-medium rounded-lg hover:bg-aegean-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cloud text-left">
              {['Name', 'Role', 'Email', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="bg-surface hover:bg-cloud transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-aegean-800 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <span className="font-medium text-midnight">{user.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                <td className="px-4 py-3 text-muted font-mono text-xs">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                    user.is_active
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted text-xs">
                  {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  {user.is_active && (
                    <button
                      onClick={() => handleDeactivate(user.id)}
                      className="text-xs text-coral-500 hover:text-coral-600 font-medium transition-colors"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateStaffModal
          onClose={() => setShowModal(false)}
          onCreated={fetchUsers}
        />
      )}
    </>
  )
}
