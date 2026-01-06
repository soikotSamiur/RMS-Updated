// src/services/reportsService.js
import API from './axios';

const reportsService = {
  // Get sales report
  getSalesReport: async (startDate, endDate) => {
    try {
      const response = await API.get('/reports/sales', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error.response?.data || error;
    }
  },

  // Get inventory report
  getInventoryReport: async () => {
    try {
      const response = await API.get('/reports/inventory');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      throw error.response?.data || error;
    }
  },

  // Get financial report
  getFinancialReport: async (startDate, endDate) => {
    try {
      const response = await API.get('/reports/financial', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error.response?.data || error;
    }
  },

  // Get report stats
  getReportStats: async (type, startDate, endDate) => {
    try {
      const response = await API.get('/reports/stats', {
        params: { type, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching report stats:', error);
      throw error.response?.data || error;
    }
  }
};

export default reportsService;
