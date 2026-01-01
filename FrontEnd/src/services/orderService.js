// src/services/orderService.js
import API from './axios';

// Order API
const orderService = {
  // Get all orders
  getOrders: async () => {
    const res = await API.get('/orders');
    return res.data;
  },

  // Get single order
  getOrder: async (id) => {
    const res = await API.get(`/orders/${id}`);
    return res.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const res = await API.post('/orders', orderData);
    return res.data;
  },

  // Update existing order
  updateOrder: async (id, orderData) => {
    const res = await API.put(`/orders/${id}`, orderData);
    return res.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const res = await API.patch(`/orders/${id}/status`, { status });
    return res.data;
  },

  // Delete order
  deleteOrder: async (id) => {
    const res = await API.delete(`/orders/${id}`);
    return res.data;
  }
};

export default orderService;
