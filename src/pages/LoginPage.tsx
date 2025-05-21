import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-8"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Welcome</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to continue</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Login with Identity Provider
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate('/register')}
              className="text-indigo-600 hover:underline focus:outline-none"
            >
              Register
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
