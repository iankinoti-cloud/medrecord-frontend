/**
 * PERSON 2 — Patient Detailed Record
 * Build your components here.
 *
 * Required exports:
 *   PatientHeader, MedicalHistoryTab, CurrentTreatmentTab,
 *   LabReportsTab, AddDiagnosisForm
 *
 * Backend endpoints:
 *   GET  /patients/:id
 *   POST /patients/:id/diagnosis  [Doctor only]
 * Lab data format (agree with Person 3):
 *   { id, test_type, report_id, file_url, status, created_at, uploader_name }
 */

export function PatientDetailStub() {
  return (
    <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border">
      <div className="text-center">
        <p className="text-sm font-medium text-midnight">Person 2 — Patient Detail Record</p>
        <p className="text-xs text-muted mt-1">Build components in src/components/patient/</p>
      </div>
    </div>
  )
}
