/**
 * PERSON 3 — wire the submit handler to POST /patients/register
 * This form slot lives inside AdminPanel. Person 1 owns the layout;
 * Person 3 owns the service call and validation logic.
 */
import { useState } from 'react'

export function RegisterPatientForm({ onRegistered }) {
  const [form, setForm]     = useState({
    full_name: '', date_of_birth: '', gender: '',
    blood_type: '', contact_phone: '', contact_email: '', address: '', emergency_contact: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      // PERSON 3: replace this placeholder with patientService.register(form)
      throw new Error('Person 3: wire POST /patients/register here')
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { id: 'full_name',          label: 'Full Name *',         type: 'text',   placeholder: 'Jane Doe' },
    { id: 'date_of_birth',      label: 'Date of Birth *',     type: 'date',   placeholder: '' },
    { id: 'contact_phone',      label: 'Phone',               type: 'tel',    placeholder: '+254 700 000 000' },
    { id: 'contact_email',      label: 'Email',               type: 'email',  placeholder: 'patient@email.com' },
    { id: 'emergency_contact',  label: 'Emergency Contact',   type: 'text',   placeholder: 'John Doe — 0700 000 001' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error   && <p className="text-xs text-coral-500 bg-coral-100 px-3 py-2 rounded-lg">{error}</p>}
      {success && <p className="text-xs text-emerald-600 bg-emerald-100 px-3 py-2 rounded-lg">{success}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-xs font-medium text-midnight mb-1">{label}</label>
            <input
              id={id} type={type} placeholder={placeholder}
              value={form[id]} onChange={set(id)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-aegean-700 focus:ring-1 focus:ring-aegean-700 transition-colors"
            />
          </div>
        ))}

        <div>
          <label htmlFor="gender" className="block text-xs font-medium text-midnight mb-1">Gender</label>
          <select id="gender" value={form.gender} onChange={set('gender')}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-aegean-700 transition-colors bg-surface">
            <option value="">Select gender</option>
            {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="blood_type" className="block text-xs font-medium text-midnight mb-1">Blood Type</label>
          <select id="blood_type" value={form.blood_type} onChange={set('blood_type')}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-aegean-700 transition-colors bg-surface">
            <option value="">Select blood type</option>
            {['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'].map(bt => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-xs font-medium text-midnight mb-1">Address</label>
        <textarea
          id="address" rows={2} value={form.address} onChange={set('address')}
          placeholder="123 Nairobi St, Westlands, Nairobi"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-aegean-700 focus:ring-1 focus:ring-aegean-700 transition-colors resize-none"
        />
      </div>

      <button type="submit" disabled={loading}
        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
        {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
        {loading ? 'Registering...' : 'Register Patient'}
      </button>
    </form>
  )
}
