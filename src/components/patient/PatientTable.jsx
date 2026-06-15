import { useState, useEffect, useMemo } from 'react';
import DashboardSearchBar from './DashboardSearchBar';
import DashboardPagination from './DashboardPagination';

const getStatusStyle = (status) => {
  switch (status) {
    case 'In ER':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Pending Lab':
      return 'bg-amber-100 text-amber-800 border-amber-200';
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
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const allPatients = useMemo(() => (patients || []).map((p) => ({
    id: p.patient_id,
    name: p.full_name,
    age: calculateAge(p.date_of_birth),
    gender: p.gender,
    status: p.status,
    admissionDate: '2026-06-15',
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
      <DashboardSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} debouncedSearch={debouncedSearch} />

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
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{patient.admissionDate}</td>
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
        <DashboardPagination totalItems={allPatients.length} filteredCount={filteredPatients.length} />
      </div>
    </div>
  );
};

export default PatientTable;