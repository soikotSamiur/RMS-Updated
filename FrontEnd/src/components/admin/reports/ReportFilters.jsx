import React from 'react';

const ReportFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    const updatedFilters = {
      ...filters,
      [key]: value
    };

    // Validate that start date is not after end date
    if (key === 'startDate' && value > filters.endDate) {
      alert('Start date cannot be after end date!');
      return;
    }
    
    if (key === 'endDate' && value < filters.startDate) {
      alert('End date cannot be before start date!');
      return;
    }

    onFilterChange(updatedFilters);
  };

  const getTodayDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              max={getTodayDate()}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              max={getTodayDate()}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 bg-white text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => handleFilterChange('reportType', e.target.value)}
              className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => {
              // Reset to default filters - monthly report
              const now = new Date();
              const year = now.getFullYear();
              const month = String(now.getMonth() + 1).padStart(2, '0');
              const day = String(now.getDate()).padStart(2, '0');
              const monthStart = `${year}-${month}-01`;
              const today = `${year}-${month}-${day}`;
              onFilterChange({
                startDate: monthStart,
                endDate: today,
                reportType: 'monthly'
              });
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-refresh mr-2"></i>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;