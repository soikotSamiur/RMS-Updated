import API from './axios';

// Menu API
const menuService = {
  getCategories: async () => {
      const res = await API.get('/categories');
      return res.data;
  },

  getMenuItems: async (params = {}) => {
    
      const { page = 1, per_page = 15, category = 'all', search = '' } = params;
      const res = await API.get('/menu-items', {
        params: { page, per_page, category, search }
      });
      return res.data;
  },

  createMenuItem: async (data) => {
   
      const res = await API.post('/menu-items', data);
      return res.data;
   
  },

  updateMenuItem: async (id, data) => {
      const res = await API.put(`/menu-items/${id}`, data);
      return res.data;
   
  },

  deleteMenuItem: async (id) => {
   
      const res = await API.delete(`/menu-items/${id}`);
      return res.data;
   
  },

  toggleAvailability: async (id) => {
 
      const res = await API.patch(`/menu-items/${id}/toggle-availability`);
      return res.data;
    
  },

  // Get menu item ingredients
  getMenuItemIngredients: async (id) => {
    
      const res = await API.get(`/menu-items/${id}/ingredients`);
      return res.data;
    
  },

  // Add ingredient to menu item
  addIngredientToMenuItem: async (menuItemId, data) => {
  
      const res = await API.post(`/menu-items/${menuItemId}/ingredients`, data);
      return res.data;
   
  },

  // Remove ingredient from menu item
  removeIngredientFromMenuItem: async (menuItemId, inventoryItemId) => {
  
      const res = await API.delete(`/menu-items/${menuItemId}/ingredients/${inventoryItemId}`);
      return res.data;
  
  }
};

export default menuService;
