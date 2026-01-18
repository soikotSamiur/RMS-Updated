import api from './axios';

const dashboardService = {
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getDailyTrends: async () => {
    const response = await api.get('/dashboard/daily-trends');
    return response.data;
  },
  getCategoryDistribution: async () => {
    const response = await api.get('/dashboard/category-distribution');
    return response.data;
  },
  getTopSellingProducts: async () => {
    const response = await api.get('/dashboard/top-selling');
    return response.data;
  }
};

export default dashboardService;
