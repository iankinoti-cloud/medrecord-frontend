import 'react';

export const DashboardSearchBar = ({ searchTerm, setSearchTerm, debouncedSearch }) => {
  return (
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
  );
};

export default DashboardSearchBar;