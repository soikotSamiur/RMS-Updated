import React, { useState, useEffect } from 'react';
import SalesReport from './SalesReport';
import InventoryReport from './InventoryReport';
import ReportFilters from './ReportFilters';
import ReportStats from './ReportStats';
import apiService from '../../../services/apiService';

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMonthStartDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [filters, setFilters] = useState({
    startDate: getMonthStartDate(),
    endDate: getLocalDateString(),
    reportType: 'monthly'
  });
  const [reportData, setReportData] = useState({
    sales: [],
    inventory: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const calculateDateRange = (reportType) => {
    const today = new Date();
    let startDate, endDate;
    
    switch(reportType) {
      case 'daily':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'weekly':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        endDate = new Date(today);
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      default:
        startDate = new Date(today);
        endDate = new Date(today);
    }
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    };
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch real data from backend API using the dates from filters
      if (activeReport === 'sales') {
        const response = await apiService.reports.getSalesReport(filters.startDate, filters.endDate);
        setReportData(prev => ({ ...prev, sales: response.data }));
      } else if (activeReport === 'inventory') {
        const response = await apiService.reports.getInventoryReport();
        setReportData(prev => ({ ...prev, inventory: response.data }));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
      console.error('Failed to fetch reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Now useEffect can safely use the function
  useEffect(() => {
    fetchReports();
  }, [activeReport, filters, refreshKey]);
 

  const handleFilterChange = (newFilters) => {
    // If reportType changed, calculate new date range
    if (newFilters.reportType !== filters.reportType) {
      const dateRange = calculateDateRange(newFilters.reportType);
      setFilters({
        ...newFilters,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
    } else {
      // Otherwise just update the filters (manual date changes)
      setFilters(newFilters);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const exportReport = () => {
    const data = {
      filters,
      reportType: activeReport,
      data: reportData[activeReport],
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${activeReport}-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const printReport = () => {
    window.print();
  };

  const reports = [
    { id: 'sales', name: 'Sales Report', icon: 'fas fa-chart-line' },
    { id: 'inventory', name: 'Inventory Report', icon: 'fas fa-boxes' }
  ];

  const renderActiveReport = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating report...</p>
          </div>
        </div>
      );
    }

    switch (activeReport) {
      case 'sales':
        return <SalesReport data={reportData.sales} filters={filters} />;
      case 'inventory':
        return <InventoryReport data={reportData.inventory} filters={filters} />;
      default:
        return <SalesReport data={reportData.sales} filters={filters} />;
    }
  };

  return (
    <div className="page-content md:p-2">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your restaurant performance</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <i className={`fas fa-sync ${isLoading ? 'animate-spin' : ''}`}></i> Refresh
            </button>
           
          </div>
        </div>

        <ReportStats reportType={activeReport} data={reportData[activeReport]} />
      </div>

      {/* Report Filters */}
      <ReportFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Report Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b border-gray-200">
          {reports.map(report => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeReport === report.id
                  ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className={`${report.icon} mr-2`}></i>
              {report.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Report Content */}
      <div className="bg-white rounded-lg shadow">
        {renderActiveReport()}
      </div>
    </div>
  );
};

export default ReportsPage;