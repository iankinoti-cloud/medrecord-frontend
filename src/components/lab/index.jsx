/**
 * PERSON 3 — Lab Technician Portal
 * Build your components here.
 *
 * Required exports:
 *   UploadForm, PatientIdLookup, FileDropzone
 *
 * Backend endpoints:
 *   POST /lab/upload             [Lab Tech only — multipart/form-data]
 *   GET  /patients/:id           [for patient name auto-fill]
 *
 * File validation rules (enforce BOTH frontend and backend):
 *   - Max size: 5MB
 *   - Accepted type: application/pdf only
 *
 * Lab result JSON shape (agree with Person 2's LabReportsTab):
 *   { id, test_type, report_id, file_url, status, created_at, uploader_name }
 */
import { useState } from "react"
import{UploadForm} from "./UploadForm"
import{PatientIdLookup} from "./PatientIdLookup"
import{FileDropzone} from "./FileDropzone"
import {UploadHistory} from "./UploadHistory"

export function LabPortal() {
  const [activeTab, setActiveTab] = useState("upload")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1) // Trigger refresh of upload history
    setActiveTab("history") // Switch to history tab after successful upload
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-midnight">Lab Technician Portal</h2>
        <div className="text-sm text-muted">
          Upload lab reports for patients
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-cloud rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'upload'
              ? 'bg-surface text-aegean-800 shadow-card'
              : 'text-muted hover:text-midnight'
            }`}
        >
          Upload Report
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history'
              ? 'bg-surface text-aegean-800 shadow-card'
              : 'text-muted hover:text-midnight'
            }`}
        >
          Upload History
        </button>
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'upload' && (
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        )}
        {activeTab === 'history' && (
          <UploadHistory key={refreshKey} />
        )}
      </div>
    </div>
  )
}

// Export required components
// export {LabPortal as default} from "./LabPortal"
export { UploadForm, PatientIdLookup, FileDropzone, UploadHistory }