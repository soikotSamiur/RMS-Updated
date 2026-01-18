import authService from './authService';
import menuService from './menuService';
import orderService from './orderService';
import inventoryService from './inventoryService';
import reportsService from './reportsService';
import settingsService from './settingsService';
import dashboardService from './dashboardService';

export const auth = authService;

const apiService = {
  menu: menuService,
  auth: authService,
  orders: orderService,
  inventory: inventoryService,
  reports: reportsService,
  settings: settingsService,
  dashboard: dashboardService
};

export default apiService;

