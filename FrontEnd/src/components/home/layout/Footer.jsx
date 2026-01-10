import { useSettings } from '../../../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center mb-2">
            <span className="font-bold text-orange-500 text-xl">{settings.restaurant_name || 'DineSmart'}</span>
          </div>
          <p>Smart dining starts here with exceptional food and service.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul>
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Menu</a></li>
            <li><a href="#" className="hover:underline">Reservations</a></li>
            <li><a href="#" className="hover:underline">Reviews</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <div>{settings.phone || '(555) 123-4567'}</div>
          <div>{settings.email || 'info@dinesmart.com'}</div>
          <div>{settings.address || 'Road 12, Sector 10, Uttara, Dhaka Bangladesh'}</div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Hours</h4>
          <div>{settings.business_hours || 'Mon-Fri: 11AM - 10PM, Sat-Sun: 10AM - 11PM'}</div>
        </div>
      </div>
      <div className="text-center py-4 text-gray-400 text-xs">
        © 2025 {settings.restaurant_name || 'DineSmart'}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;