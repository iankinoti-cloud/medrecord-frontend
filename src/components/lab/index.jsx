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

export function LabPortalStub() {
  return (
    <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border">
      <div className="text-center">
        <p className="text-sm font-medium text-midnight">Person 3 — Lab Portal</p>
        <p className="text-xs text-muted mt-1">Build components in src/components/lab/</p>
      </div>
    </div>
  )
}
