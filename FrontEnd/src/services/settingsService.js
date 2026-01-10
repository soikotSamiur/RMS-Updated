// src/services/settingsService.js
import apiClient from './axios';

const settingsService = {
  /**
   * Get all settings
   */
  getSettings: async () => {
    try {
      const response = await apiClient.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  },

  /**
   * Update settings
   * @param {Object} settings - Settings object with key-value pairs
   */
  updateSettings: async (settings) => {
    try {
      const response = await apiClient.put('/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }
};

export default settingsService;
