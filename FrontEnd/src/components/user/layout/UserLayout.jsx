import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <UserSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <UserHeader setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
