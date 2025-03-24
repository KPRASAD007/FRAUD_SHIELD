import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { logout } from '../store/authSlice';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Fraud Shield
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              to="/"
              className="border-b-2 border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="border-b-2 border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="border-b-2 border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/enquiry"
              className="border-b-2 border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
            >
              Enquiry
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="border-b-2 border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className="border-b-2 border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side (Theme Toggle + Auth) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;