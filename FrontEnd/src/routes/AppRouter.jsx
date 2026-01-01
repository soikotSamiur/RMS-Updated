import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';


// Admin Layout & Pages
import AdminLayout from '../components/admin/layout/AdminLayout';
import DashboardPage from '../components/admin/dashboard/DashboardPage';
import MenuPage from '../components/admin/menu/MenuPage';
import OrdersPage from '../components/admin/orders/OrdersPage';
import InventoryPage from '../components/admin/inventory/InventoryPage';
import ReportsPage from '../components/admin/reports/ReportsPage';
import SettingsPage from '../components/admin/settings/SettingsPage';

// User Layout & Pages
import UserLayout from '../components/user/layout/UserLayout';
import UserDashboardPage from '../components/user/dashboard/UserDashboardPage';
import UserMenuPage from '../components/user/menu/UserMenuPage';
import UserOrdersPage from '../components/user/orders/UserOrdersPage';

const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Admin Routes wrapped with AdminLayout */}
          <Route element={<AdminLayout />}>
            {/* Redirect /admin to /admin/dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Waiter', 'Chef', 'Cashier']}>
                  <Navigate to="/admin/dashboard" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Waiter', 'Chef', 'Cashier']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/menu"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Waiter', 'Chef']}>
                  <MenuPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Waiter', 'Chef', 'Cashier']}>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/inventory"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* User Dashboard Routes */}
          <Route element={<UserLayout />}>
            {/* Redirect /user to /user/dashboard */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <Navigate to="/user/dashboard" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/menu"
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <UserMenuPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/orders"
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <UserOrdersPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRouter;
