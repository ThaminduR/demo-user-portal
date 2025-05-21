import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-gray-800 text-foreground px-4">
      <div className="max-w-md rounded-xl bg-white dark:bg-gray-900 shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Registration Complete</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Your account has been successfully created. You can now log in.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
