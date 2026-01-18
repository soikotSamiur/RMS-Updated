// src/services/billService.js
import API from './axios';

const billService = {
  // Get all bills with pagination and filters
  getBills: async (params = {}) => {
    const { page = 1, per_page = 15, search = '', start_date = '', end_date = '', payment_method = '' } = params;
    const res = await API.get('/bills', {
      params: { page, per_page, search, start_date, end_date, payment_method }
    });
    return res.data;
  },

  // Get single bill
  getBill: async (id) => {
    const res = await API.get(`/bills/${id}`);
    return res.data;
  },

  // Create new bill
  createBill: async (billData) => {
    const res = await API.post('/bills', billData);
    return res.data;
  },

  // Delete bill
  deleteBill: async (id) => {
    const res = await API.delete(`/bills/${id}`);
    return res.data;
  },

  // Get bill statistics
  getBillStats: async () => {
    const res = await API.get('/bills/stats');
    return res.data;
  }
};

export default billService;
