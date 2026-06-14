import React,{ useState, useEffect } from 'react';

const PatientTable = ({onSelectPatient}) => {
    const[searchTerm,setSearchTerm]=useState('');
    const[debouncedSearch, setDebouncedSearch]= useState("");
    const allPatients = [
        { id: "PT-001", name: "John Doe", age: 30, gender: "Male", status: "Active", admissionDate: "2026-01-15" },
        { id: "PT-002", name: "Jane Smith", age: 25,    gender: "Female", status: "In ER", admissionDate: "2026-02-20" },
        { id: "PT-003", name: "Alice Johnson", age: 40, gender: "Female", status: "Pending Lab", admissionDate: "2026-01-10" },
        { id: "PT-004", name: "Bob Brown", age: 50, gender: "Male", status: "Discharged", admissionDate: "2026-01-05" },
    ];
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 400); // 400 milliseconds delay

        return() => clearTimeout(timer);
    }, [searchTerm]);
    const filteredPatients = allPatients.filter((patient) =>
    patient.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    patient.id.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "In ER":
                return "bg-red-100 text-red-800 border-red-200";
            case "Pending Lab":return "bg-red-100 text-red-800 border-amber-200";
            default:return "bg-green-100 text-green-800 border-green-200";
        }
    };
    return (
        <div className="space-y-4">
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400"fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round"strokeWidth="2"d="M21 21l-6-6m2-5a7 70 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    </div>
                    <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 roounded-lg focus:outline-nonefocus:ring-blue-500 focus:border-blue-500 text-sm bg- white shadow-sm transition-all"
                    placeholder="Search by patient ID or name..."
                    value={searchTerm}
                    onChange={(e)=> setSearchTerm(e.target.value)}
                    />
                    {searchTerm !== debouncedSearch && (
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 italic">
                            typing...
                        </span>
                    )}
                    </div>
                    <div className="bg-white rouded-xl border border-gray-200 text shadow-sm overflow-hidden">
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
                                onClick={()=> onSelectPatient(patient.id)}
                                >                                
                                    <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap">{patient.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{patient.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.age}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={"px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border $(getStatusStyle(patient.status)}"}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap ">{patient.admissionDate}</td>

                                </tr>
                            ))
                        ): (
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
            <span className="text-xs text-gray-500">
                Showing {filteredPatients.length} of {allpatients.length} results
            </span>
            <div className="inline-flex space-x-2">  
                <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed"disabled>
                    Previous
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed"disabled>
                    Next
                </button>
            </div>
            </div>
        </div>
    </div>
    );
};

export default PatientTable;