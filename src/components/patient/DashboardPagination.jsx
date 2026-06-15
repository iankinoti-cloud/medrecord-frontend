import  'react';

export const DashboardPagination = ({ totalItems, filteredCount }) => {
  return (
    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
      <span className="text-xs text-gray-500">Showing {filteredCount} of {totalItems} results</span>
      <div className="inline-flex space-x-2">
        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed" disabled>
          Previous
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-not-allowed" disabled>
          Next
        </button>
      </div>
    </div>
  );
};

export default DashboardPagination;