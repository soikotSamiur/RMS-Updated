import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Header = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 py-4 flex items-center justify-between px-4 md:px-6 bg-white shadow-sm">
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile toggle button */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        {/* User profile - desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm">
            {user ? (user.name ? user.name.charAt(0).toUpperCase() : 'U') : 'U'}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">{user ? user.name : 'Guest'}</div>
            <div className="text-xs text-gray-600">{user ? user.role : 'Visitor'}</div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;