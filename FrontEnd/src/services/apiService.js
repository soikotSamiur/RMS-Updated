// src/services/apiService.js
// Main API service - imports from separate service files
import authService from './authService';
import menuService from './menuService';
import orderService from './orderService';
import inventoryService from './inventoryService';
import reportsService from './reportsService';
import settingsService from './settingsService';

// Export auth for backward compatibility
export const auth = authService;

// Default export - combined services
const apiService = {
  menu: menuService,
  auth: authService,
  orders: orderService,
  inventory: inventoryService,
  reports: reportsService,
  settings: settingsService
};

export default apiService;

