import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/icon.png"
            alt="User Portal logo"
            className="h-8 w-8 rounded"
          />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            User Portal
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {auth.isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
