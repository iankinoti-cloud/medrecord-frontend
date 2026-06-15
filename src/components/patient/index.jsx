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

import  { useState } from 'react'
import StatCards from './DashboardStatCards'
import PatientTable from './PatientTable'
import seededPatients from './mockPatients'

export default function PatientDirectory() {
  const [selectedPatientId, setSelectedPatientId] = useState(null)

  const selected = seededPatients.find(p => p.patient_id === selectedPatientId)

  if (selected) {
    return (
      <div className="w-full space-y-6">
        <div>
          <button onClick={() => setSelectedPatientId(null)} className="text-sm text-blue-600 underline">Back to directory</button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{selected.full_name}</h1>
          <p className="text-sm text-gray-500">{selected.address} · {selected.contact_phone} · {selected.contact_email}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p><strong>Patient ID:</strong> {selected.patient_id}</p>
          <p><strong>Gender:</strong> {selected.gender}</p>
          <p><strong>Blood type:</strong> {selected.blood_type}</p>
          <p><strong>Emergency contact:</strong> {selected.emergency_contact}</p>
          <p><strong>Status:</strong> {selected.status}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
        <p className="text-sm text-gray-500 mt-1">Manage, search, and view comprehensive patient clinical structure.</p>
      </div>
      <StatCards />
      <PatientTable patients={seededPatients} onSelectPatient={(id) => setSelectedPatientId(id)} />
    </div>
  )
}
 