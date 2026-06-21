import { useState, useEffect } from 'react'
import { patientService } from '../../services/patientService'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { Search, User, X } from 'lucide-react'

export function PatientIdLookup({
    onPatientSelect,
    selectedPatientId,
    disabled = false
}) {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)

    useEffect(() => {
        // If selectedPatientId is provided externally, fetch patient details
        if (selectedPatientId && !selectedPatient) {
            fetchPatientDetails(selectedPatientId)
        }
    }, [selectedPatientId])

    const fetchPatientDetails = async (patientId) => {
        try {
            const patient = await patientService.getPatientById(patientId)
            setSelectedPatient(patient)
            if (onPatientSelect) {
                onPatientSelect(patient)
            }
        } catch (error) {
            console.error('Error fetching patient details:', error)
        }
    }

    const searchPatients = async (query) => {
        if (!query || query.length < 2) {
            setResults([])
            setShowResults(false)
            return
        }

        setIsSearching(true)
        try {
            const data = await patientService.searchPatients(query)
            setResults(data.items || data || [])
            setShowResults(true)
        } catch (error) {
            console.error('Error searching patients:', error)
            setResults([])
        } finally {
            setIsSearching(false)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery) {
                searchPatients(searchQuery)
            }
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [searchQuery])

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient)
        setSearchQuery(`${patient.full_name} (${patient.id})`)
        setShowResults(false)
        if (onPatientSelect) {
            onPatientSelect(patient)
        }
    }

    const clearSelection = () => {
        setSelectedPatient(null)
        setSearchQuery('')
        setResults([])
        setShowResults(false)
        if (onPatientSelect) {
            onPatientSelect(null)
        }
    }

    return (
        <div className="relative">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            if (!e.target.value) {
                                clearSelection()
                            }
                        }}
                        onFocus={() => {
                            if (searchQuery && searchQuery.length >= 2) {
                                searchPatients(searchQuery)
                            }
                        }}
                        placeholder="Search patient by name or ID..."
                        className="w-full pl-9 pr-4 py-2 bg-cloud/30 rounded-lg border border-cloud focus:border-aegean-300 outline-none transition-all"
                        disabled={disabled}
                    />
                </div>
                {selectedPatient && (
                    <button
                        type="button"
                        onClick={clearSelection}
                        className="px-3 py-2 bg-coral-50 text-coral-500 rounded-lg hover:bg-coral-100 transition-all"
                        disabled={disabled}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && !disabled && (
                <div className="absolute z-10 mt-1 w-full bg-surface rounded-lg shadow-lg border border-cloud max-h-60 overflow-y-auto">
                    {isSearching ? (
                        <div className="flex items-center justify-center py-4">
                            <LoadingSpinner size="sm" />
                        </div>
                    ) : results.length > 0 ? (
                        results.map((patient) => (
                            <button
                                key={patient.id}
                                type="button"
                                onClick={() => handleSelectPatient(patient)}
                                className="w-full text-left px-4 py-3 hover:bg-cloud/30 transition-colors flex items-center gap-3 border-b border-cloud last:border-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-aegean-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-aegean-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-midnight truncate">
                                        {patient.full_name}
                                    </div>
                                    <div className="text-xs text-muted">
                                        ID: {patient.id} • DOB: {patient.date_of_birth}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : searchQuery.length >= 2 ? (
                        <div className="text-center py-4 text-muted text-sm">
                            No patients found matching "{searchQuery}"
                        </div>
                    ) : null}
                </div>
            )}

            {/* Selected Patient Display */}
            {selectedPatient && (
                <div className="mt-2 p-3 bg-cloud/30 rounded-lg border border-cloud">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-aegean-800 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {selectedPatient.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-midnight">{selectedPatient.full_name}</div>
                            <div className="text-xs text-muted">
                                ID: {selectedPatient.id} • DOB: {selectedPatient.date_of_birth}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}