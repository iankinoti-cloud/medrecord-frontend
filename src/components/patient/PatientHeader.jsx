import  'react';

export const PatientHeader = ({ patient }) => {
  if (!patient) return null;
  const initials = patient.full_name ? patient.full_name.split(' ').map(n => n[0]).join('') : 'PT';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-600 text-white font-semibold text-xl rounded-full flex items-center justify-center shadow-inner">
          {initials}
        </div>
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900">{patient.full_name}</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
              {patient.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Patient ID: <span className="font-mono text-gray-700">{patient.patient_id}</span> | {patient.gender}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 border border-gray-200">Blood: {patient.blood_type}</span>
        <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 border border-gray-200">Phone: {patient.contact_phone}</span>
      </div>
    </div>
  );
};

export default PatientHeader;
