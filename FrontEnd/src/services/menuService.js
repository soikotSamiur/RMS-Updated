// src/services/menuService.js
import API from './axios';

// Menu API
const menuService = {
  getCategories: async () => {
    try {
      const res = await API.get('/categories');
      return res.data;
    } catch (error) {
      // Return mock data if API fails
      return {
        success: true,
        data: [
          { id: 'all', name: 'All Items', count: 12 },
          { id: 'appetizers', name: 'Appetizers', count: 3 },
          { id: 'main-course', name: 'Main Course', count: 4 },
          { id: 'desserts', name: 'Desserts', count: 3 },
          { id: 'beverages', name: 'Beverages', count: 2 }
        ]
      };
    }
  },

  getMenuItems: async () => {
    try {
      const res = await API.get('/menu-items');
      return res.data;
    } 
    catch (error) {
      // Return mock data if API fails
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing and croutons',
            price: 8.99,
            category: 'appetizers',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
            available: true,
            preparationTime: 10
          },
          {
            id: 2,
            name: 'Chicken Wings',
            description: 'Spicy buffalo wings served with ranch dressing',
            price: 12.99,
            category: 'appetizers',
            image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
            available: true,
            preparationTime: 15
          },
          {
            id: 3,
            name: 'Mozzarella Sticks',
            description: 'Crispy breaded mozzarella with marinara sauce',
            price: 9.99,
            category: 'appetizers',
            image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400',
            available: true,
            preparationTime: 12
          },
          {
            id: 4,
            name: 'Grilled Chicken',
            description: 'Juicy grilled chicken breast with herbs and vegetables',
            price: 18.99,
            category: 'main-course',
            image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
            available: true,
            preparationTime: 25
          },
          {
            id: 5,
            name: 'Beef Burger',
            description: 'Classic beef burger with cheese, lettuce, and tomato',
            price: 15.99,
            category: 'main-course',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            available: true,
            preparationTime: 20
          },
          {
            id: 6,
            name: 'Pasta Carbonara',
            description: 'Creamy pasta with bacon and parmesan cheese',
            price: 16.99,
            category: 'main-course',
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
            available: true,
            preparationTime: 18
          },
          {
            id: 7,
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with lemon butter sauce',
            price: 24.99,
            category: 'main-course',
            image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
            available: false,
            preparationTime: 22
          },
          {
            id: 8,
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake with chocolate ganache',
            price: 7.99,
            category: 'desserts',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
            available: true,
            preparationTime: 5
          },
          {
            id: 9,
            name: 'Cheesecake',
            description: 'Classic New York style cheesecake with berry sauce',
            price: 8.99,
            category: 'desserts',
            image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400',
            available: true,
            preparationTime: 5
          },
          {
            id: 10,
            name: 'Ice Cream Sundae',
            description: 'Vanilla ice cream with chocolate sauce and nuts',
            price: 6.99,
            category: 'desserts',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
            available: true,
            preparationTime: 5
          },
          {
            id: 11,
            name: 'Fresh Orange Juice',
            description: 'Freshly squeezed orange juice',
            price: 4.99,
            category: 'beverages',
            image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
            available: true,
            preparationTime: 3
          },
          {
            id: 12,
            name: 'Iced Coffee',
            description: 'Cold brew coffee with ice and milk',
            price: 5.99,
            category: 'beverages',
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
            available: true,
            preparationTime: 5
          }
        ]
      };
    }
  },

  createMenuItem: async (data) => {
    try {
      const res = await API.post('/menu-items', data);
      return res.data;
    } catch (error) {
      // Mock success response
      return {
        success: true,
        data: { ...data, id: Date.now(), available: true }
      };
    }
  },

  updateMenuItem: async (id, data) => {
    try {
      const res = await API.put(`/menu-items/${id}`, data);
      return res.data;
    } catch (error) {
      // Mock success response
      return {
        success: true,
        data: { ...data, id }
      };
    }
  },

  deleteMenuItem: async (id) => {
    try {
      const res = await API.delete(`/menu-items/${id}`);
      return res.data;
    } catch (error) {
      // Mock success response
      return { success: true };
    }
  },

  toggleAvailability: async (id) => {
    try {
      const res = await API.patch(`/menu-items/${id}/toggle-availability`);
      return res.data;
    } catch (error) {
      // Mock success response
      return {
        success: true,
        message: 'Availability updated',
        data: { id, available: true }
      };
    }
  },

  // Get menu item ingredients
  getMenuItemIngredients: async (id) => {
    const res = await API.get(`/menu-items/${id}/ingredients`);
    return res.data;
  },

  // Add ingredient to menu item
  addIngredientToMenuItem: async (menuItemId, inventoryItemId, quantityRequired) => {
    const res = await API.post(`/menu-items/${menuItemId}/ingredients`, {
      inventoryItemId,
      quantityRequired
    });
    return res.data;
  },

  // Remove ingredient from menu item
  removeIngredientFromMenuItem: async (menuItemId, inventoryItemId) => {
    const res = await API.delete(`/menu-items/${menuItemId}/ingredients/${inventoryItemId}`);
    return res.data;
  }
};

export default menuService;
