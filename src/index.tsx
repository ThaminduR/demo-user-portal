import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from 'react-oidc-context';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

fetch('/config.json')
  .then((res) => res.json())
  .then((config) => {
    const providerKey = config.defaultProvider;
    const provider = config.providers?.[providerKey];

    if (!provider) {
      throw new Error(`OIDC provider config not found for: ${providerKey}`);
    }

    const oidcConfig = {
      authority: provider.issuer,
      client_id: provider.client_id,
      redirect_uri: provider.redirect_uri,
      post_logout_redirect_uri: provider.post_logout_redirect_uri,
      silent_redirect_uri: provider.silent_redirect_uri,
      scope: provider.scope,
      response_type: 'code',
    };

    root.render(
      <React.StrictMode>
        <AuthProvider {...oidcConfig}>
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('Failed to load OIDC config:', error);
    root.render(<div className="text-red-600 p-8 text-center">Failed to load OIDC configuration.</div>);
  });
