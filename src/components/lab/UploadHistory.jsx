import { useState, useEffect, useCallback } from 'react'
import { labService } from '../../services/labService'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { ErrorMessage } from '../shared/ErrorMessage'
import { FileText, Download, Eye, Calendar, User, Search, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-600',
    processing: 'bg-aegean-100 text-aegean-700',
    completed: 'bg-emerald-100 text-emerald-600',
    failed: 'bg-coral-100 text-coral-500',
}

export function UploadHistory() {
    const [uploads, setUploads] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortField, setSortField] = useState('created_at')
    const [sortDirection, setSortDirection] = useState('desc')
    const [selectedUpload, setSelectedUpload] = useState(null)

    const fetchUploads = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const data = await labService.getUploadHistory()
            setUploads(data.items ?? data)
        } catch (err) {
            setError('Failed to load upload history. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUploads()
    }, [fetchUploads])

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const filteredUploads = uploads.filter(upload => {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
            upload.patient_name?.toLowerCase().includes(searchLower) ||
            upload.patient_id?.toLowerCase().includes(searchLower) ||
            upload.test_type?.toLowerCase().includes(searchLower) ||
            upload.report_id?.toLowerCase().includes(searchLower)
        const matchesStatus = statusFilter === 'all' || upload.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const sortedUploads = [...filteredUploads].sort((a, b) => {
        const aVal = a[sortField] || ''
        const bVal = b[sortField] || ''
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        return sortDirection === 'asc' ? comparison : -comparison
    })

    const handleViewDetails = (upload) => {
        setSelectedUpload(upload)
    }

    const handleDownload = (upload) => {
        // Implement download functionality
        console.log('Downloading:', upload.id)
        // window.open(upload.file_url, '_blank')
    }

    if (loading) return <LoadingSpinner label="Loading upload history..." />
    if (error) return <ErrorMessage message={error} onRetry={fetchUploads} />

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-midnight">Upload History</h3>
                <p className="text-sm text-muted">
                    {filteredUploads.length} upload{filteredUploads.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by patient, test, or report ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-surface rounded-lg border border-cloud focus:border-aegean-300 outline-none transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-surface rounded-lg border border-cloud focus:border-aegean-300 outline-none transition-all"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                </select>
                <button
                    onClick={fetchUploads}
                    className="px-4 py-2 bg-aegean-50 text-aegean-600 rounded-lg hover:bg-aegean-100 transition-all"
                >
                    Refresh
                </button>
            </div>

            {/* Uploads Table */}
            <div className="bg-surface rounded-xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-cloud/50">
                            <tr className="text-left text-sm text-muted">
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-cloud/70 transition-colors"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center gap-1">
                                        Date
                                        {sortField === 'created_at' && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-cloud/70 transition-colors"
                                    onClick={() => handleSort('patient_name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Patient
                                        {sortField === 'patient_name' && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-cloud/70 transition-colors"
                                    onClick={() => handleSort('test_type')}
                                >
                                    <div className="flex items-center gap-1">
                                        Test Type
                                        {sortField === 'test_type' && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-cloud/70 transition-colors"
                                    onClick={() => handleSort('report_id')}
                                >
                                    <div className="flex items-center gap-1">
                                        Report ID
                                        {sortField === 'report_id' && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 font-medium cursor-pointer hover:bg-cloud/70 transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center gap-1">
                                        Status
                                        {sortField === 'status' && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cloud">
                            {sortedUploads.map((upload) => (
                                <tr key={upload.id} className="hover:bg-cloud/30 transition-colors">
                                    <td className="px-4 py-3 text-sm text-muted">
                                        {new Date(upload.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="font-medium text-midnight">{upload.patient_name}</div>
                                            <div className="text-xs text-muted">{upload.patient_id}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-midnight">
                                        {upload.test_type}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono text-midnight">
                                        {upload.report_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[upload.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {upload.status?.toUpperCase() || 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleViewDetails(upload)}
                                                className="p-1.5 text-aegean-600 hover:text-aegean-800 hover:bg-aegean-50 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {upload.status === 'completed' && (
                                                <button
                                                    onClick={() => handleDownload(upload)}
                                                    className="p-1.5 text-muted hover:text-aegean-600 hover:bg-aegean-50 rounded-lg transition-all"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUploads.length === 0 && (
                    <div className="text-center py-8 text-muted">
                        {searchQuery ? 'No uploads match your search' : 'No uploads found'}
                    </div>
                )}
            </div>

            {/* Upload Details Modal */}
            {selectedUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl shadow-modal w-full max-w-2xl mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-cloud sticky top-0 bg-surface z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-midnight">Upload Details</h3>
                                <p className="text-sm text-muted">Report ID: {selectedUpload.report_id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedUpload(null)}
                                className="text-muted hover:text-midnight transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-muted">Patient</label>
                                    <p className="text-sm font-medium text-midnight">{selectedUpload.patient_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted">Patient ID</label>
                                    <p className="text-sm font-medium text-midnight">{selectedUpload.patient_id}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted">Test Type</label>
                                    <p className="text-sm font-medium text-midnight">{selectedUpload.test_type}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted">Status</label>
                                    <p className="text-sm font-medium text-midnight">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[selectedUpload.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {selectedUpload.status?.toUpperCase() || 'PENDING'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted">Uploaded By</label>
                                    <p className="text-sm font-medium text-midnight">{selectedUpload.uploader_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted">Uploaded At</label>
                                    <p className="text-sm font-medium text-midnight">
                                        {new Date(selectedUpload.created_at).toLocaleString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {selectedUpload.notes && (
                                <div>
                                    <label className="text-xs text-muted">Notes</label>
                                    <p className="text-sm text-midnight mt-1">{selectedUpload.notes}</p>
                                </div>
                            )}

                            {selectedUpload.status === 'completed' && selectedUpload.file_url && (
                                <div className="flex gap-3 pt-4 border-t border-cloud">
                                    <button
                                        onClick={() => handleDownload(selectedUpload)}
                                        className="flex-1 px-4 py-2 bg-aegean-800 text-white rounded-lg hover:bg-aegean-900 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Report
                                    </button>
                                    <button
                                        onClick={() => window.open(selectedUpload.file_url, '_blank')}
                                        className="flex-1 px-4 py-2 border border-cloud rounded-lg text-sm text-midnight hover:bg-cloud transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Report
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-cloud flex justify-end">
                            <button
                                onClick={() => setSelectedUpload(null)}
                                className="px-4 py-2 bg-aegean-800 text-white rounded-lg hover:bg-aegean-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}