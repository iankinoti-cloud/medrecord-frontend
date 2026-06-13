import { useState } from 'react'
import { adminService } from '../../services/adminService'
import { ROLES } from '../../utils/constants'

export function CreateStaffModal({ onClose, onCreated }) {
  const [form, setForm]     = useState({ full_name: '', email: '', role: ROLES.DOCTOR, password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminService.createUser(form)
      onCreated()
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Failed to create staff account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-modal w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold text-midnight">Create Staff Account</h2>
          <button onClick={onClose} className="text-muted hover:text-midnight transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-xs text-coral-500 bg-coral-100 px-3 py-2 rounded-lg">{error}</p>
          )}

          {[
            { id: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Dr. Jane Doe' },
            { id: 'email',     label: 'Email',     type: 'email', placeholder: 'jane@hospital.org' },
            { id: 'password',  label: 'Password',  type: 'password', placeholder: '••••••••' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs font-medium text-midnight mb-1">{label}</label>
              <input
                id={id} type={type} required placeholder={placeholder}
                value={form[id]} onChange={set(id)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-aegean-700 focus:ring-1 focus:ring-aegean-700 transition-colors"
              />
            </div>
          ))}

          <div>
            <label htmlFor="role" className="block text-xs font-medium text-midnight mb-1">Role</label>
            <select
              id="role" value={form.role} onChange={set('role')}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-aegean-700 transition-colors bg-surface"
            >
              {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 border border-border rounded-lg text-sm text-midnight hover:bg-cloud transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 bg-aegean-800 text-white rounded-lg text-sm font-medium hover:bg-aegean-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
