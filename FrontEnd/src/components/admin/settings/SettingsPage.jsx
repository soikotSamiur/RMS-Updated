import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { useSettings } from '../../../context/SettingsContext';

const SettingsPage = () => {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState({
    restaurant_name: 'My Restaurant',
    email: 'contact@restaurant.com',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    timezone: 'UTC+6',
    currency: 'BDT',
    theme: 'light',
    business_hours: 'Mon-Fri: 11AM - 10PM, Sat-Sun: 10AM - 11PM',
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.settings.getSettings();
      
      if (response.success) {
        setSettings(response.data);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      setError(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.settings.updateSettings(settings);
      
      if (response.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        refreshSettings(); // Refresh global settings
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
      console.error('Failed to save settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your restaurant configuration</p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {isSaved && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'general'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            General Settings
          </button>
    
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading settings...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={settings.restaurant_name || ''}
                      onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter restaurant name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="contact@restaurant.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={settings.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="123 Main St, City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Hours
                    </label>
                    <input
                      type="text"
                      value={settings.business_hours || ''}
                      onChange={(e) => handleInputChange('business_hours', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Mon-Fri: 11AM - 10PM, Sat-Sun: 10AM - 11PM"
                    />
                  </div>

                </div>
              )}

              {activeTab === 'users' && (
                <div className="text-center py-8">
                  <p className="text-gray-600">User Management features coming soon</p>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Payment Settings features coming soon</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t p-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
