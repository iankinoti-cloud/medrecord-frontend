import { useState } from 'react';
import { FileDropzone } from './FileDropzone';
import { PatientIdLookup } from './PatientIdLookup';
import { labService } from '../services/labService';
import {LoadingSpinner} from "../shared/LoadingSpinner";
import { AlertCircle, CheckCircle, Xcircle} from "lucide-react"

const TEST_TYPES = [
    'Complete Blood Count',
    'Lipid Panel',
    'Liver Function Test',
    'Kidney Function Test',
    'Blood Glucose',
    'Hemoglobin',
    'Platelet Count',
    'White Blood Cell Count',
    'Thyroid Function',
    'HIV Test',
    'Hepatitis Panel',
    'Urinalysis',
    'Blood Culture',
    'Stool Culture',
    'Biopsy',
    'Cytology',
    'Histology',
    'Pap Smear',
    'Allergy Test',
    'Autoimmune Panel',
]

export function UploadForm({ onUploadSuccess }) {
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        testType: '',
        reportId: '',
        notes: '',
    })
    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState(null) // 'success' | 'error'
    const [statusMessage, setStatusMessage] = useState('')

    const handlePatientSelect = (patient) => {
        setFormData(prev => ({
            ...prev,
            patientId: patient.id,
            patientName: patient.full_name,
        }))
    }

    const handleFileChange = (selectedFile) => {
        setFileError('')
        setUploadStatus(null)

        // Validate file size (5MB max)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setFileError('File size exceeds 5MB limit. Please compress or choose a smaller file.')
            setFile(null)
            return false
        }

        // Validate file type (PDF only)
        if (selectedFile.type !== 'application/pdf') {
            setFileError('Only PDF files are accepted. Please upload a PDF document.')
            setFile(null)
            return false
        }

        setFile(selectedFile)
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.patientId) {
            setUploadStatus('error')
            setStatusMessage('Please select a patient.')
            return
        }

        if (!formData.testType) {
            setUploadStatus('error')
            setStatusMessage('Please select a test type.')
            return
        }

        if (!file) {
            setUploadStatus('error')
            setStatusMessage('Please upload a PDF file.')
            return
        }

        if (!formData.reportId) {
            setUploadStatus('error')
            setStatusMessage('Please enter a report ID.')
            return
        }

        setIsUploading(true)
        setUploadStatus(null)
        setStatusMessage('')

        try {
            const uploadData = new FormData()
            uploadData.append('patient_id', formData.patientId)
            uploadData.append('test_type', formData.testType)
            uploadData.append('report_id', formData.reportId)
            uploadData.append('file', file)
            if (formData.notes) {
                uploadData.append('notes', formData.notes)
            }

            const result = await labService.uploadLabReport(uploadData)

            setUploadStatus('success')
            setStatusMessage(`Report uploaded successfully! ID: ${result.id}`)

            // Reset form after successful upload
            setFormData({
                patientId: '',
                patientName: '',
                testType: '',
                reportId: '',
                notes: '',
            })
            setFile(null)

            // Notify parent
            if (onUploadSuccess) {
                setTimeout(onUploadSuccess, 1500)
            }
        } catch (error) {
            setUploadStatus('error')
            setStatusMessage(error.response?.data?.detail || 'Failed to upload report. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            patientId: '',
            patientName: '',
            testType: '',
            reportId: '',
            notes: '',
        })
        setFile(null)
        setFileError('')
        setUploadStatus(null)
        setStatusMessage('')
    }

    return (
        <div className="bg-surface rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-midnight mb-6">
                Upload Lab Report
            </h3>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-600 text-sm rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {statusMessage}
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="mb-4 p-3 bg-coral-100 text-coral-500 text-sm rounded-lg flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {statusMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Lookup */}
                <div>
                    <label className="block text-sm font-medium text-midnight mb-1.5">
                        Patient *
                        <span className="text-xs text-muted ml-2">(Search by ID or Name)</span>
                    </label>
                    <PatientIdLookup
                        onPatientSelect={handlePatientSelect}
                        selectedPatientId={formData.patientId}
                        disabled={isUploading}
                    />
                    {formData.patientName && (
                        <div className="mt-1 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                            Selected: {formData.patientName} (ID: {formData.patientId})
                        </div>
                    )}
                </div>

                {/* Test Type */}
                <div>
                    <label className="block text-sm font-medium text-midnight mb-1.5">
                        Test Type *
                    </label>
                    <select
                        value={formData.testType}
                        onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                        className="w-full px-3 py-2 bg-cloud/30 rounded-lg border border-cloud focus:border-aegean-300 outline-none transition-all"
                        required
                        disabled={isUploading}
                    >
                        <option value="">Select test type</option>
                        {TEST_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Report ID */}
                <div>
                    <label className="block text-sm font-medium text-midnight mb-1.5">
                        Report ID *
                        <span className="text-xs text-muted ml-2">(Unique identifier for this report)</span>
                    </label>
                    <input
                        type="text"
                        value={formData.reportId}
                        onChange={(e) => setFormData(prev => ({ ...prev, reportId: e.target.value }))}
                        placeholder="e.g., LAB-2026-001"
                        className="w-full px-3 py-2 bg-cloud/30 rounded-lg border border-cloud focus:border-aegean-300 outline-none transition-all"
                        required
                        disabled={isUploading}
                    />
                </div>

                {/* File Dropzone */}
                <div>
                    <label className="block text-sm font-medium text-midnight mb-1.5">
                        Upload PDF *
                        <span className="text-xs text-muted ml-2">(Max 5MB, PDF only)</span>
                    </label>
                    <FileDropzone
                        onFileSelect={handleFileChange}
                        acceptedFileTypes={['application/pdf']}
                        maxSize={5 * 1024 * 1024} // 5MB
                        disabled={isUploading}
                    />
                    {file && (
                        <div className="mt-2 p-2 bg-emerald-50 rounded-lg text-sm text-emerald-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            File ready: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                    )}
                    {fileError && (
                        <div className="mt-2 p-2 bg-coral-50 rounded-lg text-sm text-coral-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {fileError}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-midnight mb-1.5">
                        Notes
                        <span className="text-xs text-muted ml-2">(Optional)</span>
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        placeholder="Any additional notes about this lab report..."
                        className="w-full px-3 py-2 bg-cloud/30 rounded-lg border border-cloud focus:border-aegean-300 outline-none transition-all resize-y"
                        disabled={isUploading}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-cloud">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-cloud rounded-lg text-sm text-midnight hover:bg-cloud transition-colors"
                        disabled={isUploading}
                    >
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        disabled={isUploading || !file}
                        className="flex-1 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading && <LoadingSpinner size="sm" color="white" />}
                        {isUploading ? 'Uploading...' : 'Upload Report'}
                    </button>
                </div>
            </form>
        </div>
    )
}