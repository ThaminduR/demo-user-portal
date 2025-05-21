import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const user = auth.user?.profile;

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="space-y-2 text-sm">
          <div><strong>First Name:</strong> {user?.given_name || '-'}</div>
          <div><strong>Last Name:</strong> {user?.family_name || '-'}</div>
          <div><strong>Email:</strong> {user?.email || '-'}</div>
          <div><strong>Organization:</strong> {String(user?.org_handle || '-')}</div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="text-sm text-indigo-600 hover:underline"
            onClick={() => navigate('/settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
