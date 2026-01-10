import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    restaurant_name: 'DineSmart',
    email: 'info@dinesmart.com',
    phone: '(555) 123-4567',
    address: 'Road 12, Sector 10, Uttara, Dhaka Bangladesh',
    timezone: 'UTC+6',
    currency: 'BDT',
    theme: 'light',
    business_hours: 'Mon-Fri: 11AM - 10PM, Sat-Sun: 10AM - 11PM',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await apiService.settings.getSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
