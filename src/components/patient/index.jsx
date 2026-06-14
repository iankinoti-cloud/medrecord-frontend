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

import React,{use} from 'react';
import StatCards from './StatCards'
import PatientTable from './PatientTable'
import PatientDetailView from './PatientDetailView'
export function PatientDetailStub() {
  const[selectedPatient, setSelectedPatient] = useState(null);
  if (selectedPatient) {
    return (
      <PatientDetailView
        patientId={selectedPatientId}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
        <p className="text-sm text-gray-500 mt-1">Manage, search, and view comprehensive patient clinical structure.</p>
    </div>
    <StatCards />
    <PatientTable onSelectPatient={(id) => setSelectedPatient(id)} />
    </div>
  );
}
 