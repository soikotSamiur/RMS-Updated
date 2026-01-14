// src/services/inventoryService.js
import API from './axios';

// Inventory API Service
const inventoryService = {
  // Get all inventory items with optional filters
  getInventory: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 15,
      category: filters.category || 'all',
      status: filters.status || 'all',
      search: filters.search || ''
    };
    
    const res = await API.get('/inventory', { params });
    return res.data;
  },

  // Get single inventory item
  getInventoryItem: async (id) => {
    const res = await API.get(`/inventory/${id}`);
    return res.data;
  },

  // Create new inventory item
  createInventoryItem: async (itemData) => {
    const res = await API.post('/inventory', itemData);
    return res.data;
  },

  // Update existing inventory item
  updateInventoryItem: async (id, itemData) => {
    const res = await API.put(`/inventory/${id}`, itemData);
    return res.data;
  },

  // Delete inventory item
  deleteInventoryItem: async (id) => {
    const res = await API.delete(`/inventory/${id}`);
    return res.data;
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    const res = await API.get('/inventory/stats');
    return res.data;
  },

  // Get low stock items
  getLowStockItems: async () => {
    const res = await API.get('/inventory/low-stock');
    return res.data;
  },

  // Update stock manually (add or remove)
  updateStock: async (id, change) => {
    const res = await API.patch(`/inventory/${id}/stock`, { change });
    return res.data;
  },

  // Link inventory item to menu item
  linkToMenuItem: async (id, menuItemId, quantityRequired) => {
    const res = await API.post(`/inventory/${id}/link-menu-item`, {
      menuItemId,
      quantityRequired
    });
    return res.data;
  },

  // Unlink inventory item from menu item
  unlinkFromMenuItem: async (id, menuItemId) => {
    const res = await API.delete(`/inventory/${id}/unlink-menu-item/${menuItemId}`);
    return res.data;
  }
};

export default inventoryService;
