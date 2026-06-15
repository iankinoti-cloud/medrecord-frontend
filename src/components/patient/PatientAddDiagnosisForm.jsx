import 'react';

export const PatientAddDiagnosisForm = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Add Diagnosis Entry</p>
        <span className="text-xs px-2 py-0.5 font-medium text-blue-600 bg-blue-50 rounded-full">Doctor Role Active</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3">
        <input type="text" placeholder="Diagnosis parameters..." className="border text-sm p-2 rounded bg-white w-full opacity-60 cursor-not-allowed" disabled />
        <button className="bg-blue-600 text-white font-medium text-xs py-2 px-4 rounded shadow-sm opacity-60 cursor-not-allowed w-max" disabled>
          Commit Entry to Chart
        </button>
      </div>
    </div>
  );
};

export default PatientAddDiagnosisForm;