import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const user = auth.user;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Session Settings</h2>
          <button
            onClick={() => navigate('/profile')}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Profile
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <strong>Session expires at:</strong>{' '}
            {user?.expires_at
              ? new Date(user.expires_at * 1000).toLocaleString()
              : 'N/A'}
          </div>

          <div>
            <strong>Access Token:</strong>
            <div className="relative mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono break-all">
              {user?.access_token?.substring(0, 80) || 'N/A'}...
              {user?.access_token && (
                <button
                  onClick={() => copyToClipboard(user.access_token)}
                  className="absolute top-2 right-2 text-indigo-600 text-xs hover:underline"
                >
                  Copy
                </button>
              )}
            </div>
          </div>

          <div>
            <strong>ID Token Claims:</strong>
            <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-auto max-h-64">
              {JSON.stringify(user?.profile ?? {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
