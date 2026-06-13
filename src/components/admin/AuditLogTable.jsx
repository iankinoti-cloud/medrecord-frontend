import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { ErrorMessage } from '../shared/ErrorMessage'

const ACTION_COLORS = {
  LOGIN:           'bg-aegean-800 text-white',
  LOGOUT:          'bg-gray-200 text-gray-600',
  VIEW_PATIENT:    'bg-teal-100 text-teal-700',
  ADD_DIAGNOSIS:   'bg-emerald-100 text-emerald-600',
  UPLOAD_LAB:      'bg-amber-100 text-amber-600',
  CREATE_USER:     'bg-aegean-700 text-white',
  DEACTIVATE_USER: 'bg-coral-100 text-coral-500',
  REGISTER_PATIENT:'bg-teal-600 text-white',
}

export function AuditLogTable() {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [filters, setFilters] = useState({ date_from: '', date_to: '' })

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (filters.date_from) params.date_from = filters.date_from
      if (filters.date_to)   params.date_to   = filters.date_to
      const data = await adminService.getAuditLog(params)
      setLogs(data.items ?? data)
    } catch {
      setError('Failed to load audit log.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  if (loading) return <LoadingSpinner label="Loading audit log..." />
  if (error)   return <ErrorMessage message={error} onRetry={fetchLogs} />

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">From</label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters(f => ({ ...f, date_from: e.target.value }))}
            className="px-3 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:border-aegean-700 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">To</label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters(f => ({ ...f, date_to: e.target.value }))}
            className="px-3 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:border-aegean-700 transition-colors"
          />
        </div>
        {(filters.date_from || filters.date_to) && (
          <button
            onClick={() => setFilters({ date_from: '', date_to: '' })}
            className="text-xs text-aegean-700 hover:underline"
          >
            Clear filters
          </button>
        )}
        <p className="ml-auto text-xs text-muted">{logs.length} entries</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cloud text-left">
              {['Timestamp', 'User', 'Action', 'Entity', 'IP Address'].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map(entry => (
              <tr key={entry.id} className="bg-surface hover:bg-cloud transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {new Date(entry.created_at).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-sm text-midnight font-medium">{entry.user_name ?? entry.user_id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded ${ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted font-mono">
                  {entry.entity_type && (
                    <span>{entry.entity_type}{entry.entity_id ? ` · ${entry.entity_id.slice(0, 8)}…` : ''}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{entry.ip_address ?? '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">No audit entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
