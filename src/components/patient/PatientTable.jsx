import { useState, useEffect, useMemo } from 'react';

const getStatusStyle = (status) => {
  switch (status) {
    case 'In ER':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Pending Lab':
      return 'bg-red-100 text-red-800 border-amber-200';
    default:
      return 'bg-green-100 text-green-800 border-green-200';
  }
};

const PatientTable = ({ onSelectPatient, patients = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const time = dob.getTime();
    if (Number.isNaN(time)) return null;
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - time;
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const allPatients = useMemo(() => (patients || []).map((p) => ({
    id: p.patient_id,
    name: p.full_name,
    age: calculateAge(p.date_of_birth),
    gender: p.gender,
    status: p.status,
    admissionDate: null,
    raw: p,
  })), [patients]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPatients = allPatients.filter((patient) =>
    patient.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    patient.id.toLowerCase().includes(debouncedSearch.toLowerCase())
  );


  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm transition-all"
          placeholder="Search by patient ID or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm !== debouncedSearch && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 italic">typing...</span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 text-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Admission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onSelectPatient(patient.id)}
                  >
                    <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap">{patient.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{patient.name}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.age}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusStyle(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap ">{patient.admissionDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No patients found matching "{debouncedSearch}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <span className="text-xs text-gray-500">Showing {filteredPatients.length} of {allPatients.length} results</span>
          <div className="inline-flex space-x-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;