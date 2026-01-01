import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      // 🔹 Call AuthContext login method and get user data
      const userData = await auth.login({ email, password });

      // 🔹 Navigate based on user role from fresh data
      const userRole = userData?.role || 'Employee';
      if (userRole === 'Admin' || userRole === 'Waiter' || userRole === 'Chef' || userRole === 'Cashier') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message 
                      || err.response?.data?.errors?.email?.[0] 
                      || 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-[1300px] mx-auto">
          <div className="navbar">
            <div className="navbar-start">
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </div>
                <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li><Link to="/" className="text-gray-700 font-semibold">Home</Link></li>
                  <li><Link to="/register" className="text-gray-700 font-semibold">Register</Link></li>
                </ul>
              </div>
              <Link to="/" className="text-2xl text-orange-500 font-bold">DineSmart</Link>
            </div>
            <div className="navbar-end hidden lg:flex">
              <ul className="menu menu-horizontal px-1 flex items-center">
                <li><Link to="/" className="text-gray-700 font-semibold">Home</Link></li>
                <button className="btn ml-1 font-semibold bg-orange-500 p-5 text-white">
                  <Link to="/register">Get Started</Link>
                </button>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Restaurant Manager</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-orange-500 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <p className="text-center text-gray-600 text-sm">
            Don't have an account? <Link to="/register" className="text-orange-500 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
