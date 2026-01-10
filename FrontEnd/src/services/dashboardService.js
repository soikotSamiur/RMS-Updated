// src/services/dashboardService.js
import api from './axios';

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get daily revenue & profit trends
  getDailyTrends: async () => {
    const response = await api.get('/dashboard/daily-trends');
    return response.data;
  },

  // Get sales distribution by category
  getCategoryDistribution: async () => {
    const response = await api.get('/dashboard/category-distribution');
    return response.data;
  },

  // Get top 5 selling products
  getTopSellingProducts: async () => {
    const response = await api.get('/dashboard/top-selling');
    return response.data;
  }
};

export default dashboardService;
