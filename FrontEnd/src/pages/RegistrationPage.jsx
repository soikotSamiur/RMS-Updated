import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&#]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (@$!%*?&#)';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { ownerName, email, phone, password, confirmPassword, address } = formData;

    // Frontend validation
    if (!ownerName || !email || !phone || !password || !address) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);

      // 🔹 Call AuthContext register method
      await auth.register({
        name: ownerName,
        email,
        phone,
        address,
        password,
        // Don't send role - backend will default to 'Employee'
      });

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      // Backend validation errors
      const message = err.response?.data?.message 
                      || err.response?.data?.errors?.email?.[0] 
                      || 'Registration failed';
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
                  <li><Link to="/login" className="text-gray-700 font-semibold">Sign In</Link></li>
                </ul>
              </div>
              <Link to="/" className="text-2xl text-orange-500 font-bold">DineSmart</Link>
            </div>
            <div className="navbar-end hidden lg:flex">
              <ul className="menu menu-horizontal px-1 flex items-center">
                <li><Link to="/" className="text-gray-700 font-semibold">Home</Link></li>
                <li><Link to="/login" className="text-gray-700 font-semibold">Sign In</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Register Restaurant</h1>
        <p className="text-center text-gray-600 mb-8">Create your restaurant management account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Full Name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="admin@restaurant.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="+1234567890"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Restaurant Address"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-orange-500 font-semibold hover:underline">Sign In</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
