// src/services/apiService.js
// Main API service - imports from separate service files
import authService from './authService';
import menuService from './menuService';
import orderService from './orderService';
import inventoryService from './inventoryService';

// Export auth for backward compatibility
export const auth = authService;

// Default export - combined services
const apiService = {
  menu: menuService,
  auth: authService,
  orders: orderService,
  inventory: inventoryService
};

export default apiService;

