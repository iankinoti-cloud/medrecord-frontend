import { useState } from 'react';
import PatientHeader from './PatientHeader';
import PatientMedicalHistoryTab from './PatientMedicalHistoryTab';
import PatientCurrentTreatmentTab from './PatientCurrentTreatmentTab';
import PatientLabReportsTab from './PatientLabReportsTab';
import PatientAddDiagnosisForm from './PatientAddDiagnosisForm';

export const PatientDetailedView = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState('history');

  if (!patient) return null;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center text-xs font-medium text-blue-600 hover:underline">
        ← Back to Patient Directory
      </button>

      <PatientHeader patient={patient} />

      <div className="border-b border-gray-200 bg-white pt-2 rounded-t-xl border-t border-x px-2">
        <nav className="flex space-x-4">
          {['history', 'treatment', 'labs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 text-xs font-semibold capitalize border-b-2 transition-all ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
              }`}
            >
              {tab === 'history' && 'Medical History'}
              {tab === 'treatment' && 'Current Treatment'}
              {tab === 'labs' && 'Lab Reports'}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 shadow-sm min-h-32">
        {activeTab === 'history' && <PatientMedicalHistoryTab address={patient.address} emergency={patient.emergency_contact} />}
        {activeTab === 'treatment' && <PatientCurrentTreatmentTab />}
        {activeTab === 'labs' && <PatientLabReportsTab />}
      </div>

      <PatientAddDiagnosisForm />
    </div>
  );
};

export default PatientDetailedView;