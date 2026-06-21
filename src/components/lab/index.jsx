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

export { LabPortal as default } from './LabPortal'
export { UploadForm } from './UploadForm'
export { PatientIdLookup } from './PatientIdLookup'
export { FileDropzone } from './FileDropzone'
export { UploadHistory } from './UploadHistory'