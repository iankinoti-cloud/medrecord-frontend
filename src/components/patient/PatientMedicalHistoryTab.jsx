import 'react';

export const PatientMedicalHistoryTab = ({ address, emergency }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Demographic & Intake Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <p className="text-xs font-medium text-gray-400">Residential Address</p>
          <p className="text-gray-900 font-medium mt-0.5">{address || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400">Emergency Next of Kin Contact</p>
          <p className="text-gray-900 font-medium mt-0.5">{emergency || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistoryTab;